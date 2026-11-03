// Post-build: render every route to static HTML inside dist/ so GitHub Pages serves real pages
// (titles, meta, JSON-LD and content) to Google, social scrapers and AI search. Also writes sitemap.xml and llms.txt.
import { chromium } from "playwright";
import { createServer } from "node:http";
import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const BASE = "/london-logo-lab";
const SITE = "https://sheedosa.github.io" + BASE;
const dist = new URL("../dist/", import.meta.url).pathname;
const cat = JSON.parse(readFileSync(new URL("../src/data/garments.json", import.meta.url)));

const routes = ["/", "/services", "/garments", "/quote", "/schools-and-clubs", "/about",
  ...cat.garments.map((g) => `/garments/${g.handle}`)];

const types = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".webp": "image/webp", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".json": "application/json", ".ico": "image/x-icon", ".txt": "text/plain", ".xml": "application/xml", ".webmanifest": "application/manifest+json" };
const server = createServer((req, res) => {
  let p = decodeURIComponent(req.url.split("?")[0]).replace(BASE, "") || "/";
  let f = join(dist, p);
  if (!existsSync(f) || statSync(f).isDirectory()) f = join(dist, "index.html");
  res.setHeader("Content-Type", types[extname(f)] ?? "application/octet-stream");
  res.end(readFileSync(f));
}).listen(4999);

const exe = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || (existsSync("/opt/pw-browsers/chromium") ? "/opt/pw-browsers/chromium" : undefined);
const browser = await chromium.launch(exe ? { executablePath: exe } : {});
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
page.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.abort()); // fonts aren't needed for markup
let n = 0;
for (const r of routes) {
  await page.goto(`http://localhost:4999${BASE}${r}`, { waitUntil: "networkidle" });
  await page.waitForFunction(() => document.querySelector("h1") && !document.body.innerText.includes("Loading"), null, { timeout: 10000 }).catch(() => {});
  let html = await page.content();
  html = html.replace("<html", '<html data-prerendered="1"'); // informational only
  const out = r === "/" ? join(dist, "index.html") : join(dist, r.slice(1), "index.html");
  mkdirSync(join(out, ".."), { recursive: true });
  writeFileSync(out, "<!doctype html>\n" + html.replace(/^<!doctype html>\s*/i, ""));
  n++;
}
await browser.close(); server.close();

const today = new Date().toISOString().slice(0, 10);
writeFileSync(join(dist, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.map((r) => `  <url><loc>${SITE}${r === "/" ? "/" : r}</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>${r === "/" ? "1.0" : r === "/quote" || r === "/garments" ? "0.9" : "0.7"}</priority></url>`).join("\n")}\n</urlset>\n`);

const cats = cat.categories.map((c) => `- ${c.title}: ${c.blurb}`).join("\n");
const garments = cat.garments.map((g) => `- [${g.title}](${SITE}/garments/${g.handle}): ${g.blurb} ${g.methods.join(" or ")}.`).join("\n");
writeFileSync(join(dist, "llms.txt"), `# The London Logo Lab

> Embroidery, print, custom workwear and uniforms from a workshop in Tooting, South London. Part of the I&A family (I&A Schoolwear, I&A Fashions, I&A Tailoring). Polos, t-shirts, sweatshirts, hoodies, fleece, softshell jackets, hi-vis, caps, beanies and aprons, decorated with the customer's logo by embroidery or print. The site's quote builder shows a live flat mock-up of the chosen garment with the logo positions marked and a sample estimate by quantity band (1 to 9, 10 to 24, 25 to 49, 50+).

Note: this site is a concept preview. Garments are samples, prices are a labelled sample formula, and quote sending opens at launch. Address, phone, minimums, turnaround and prices are placeholders until the business confirms them. Written to be readable by people and by AI search.

## Services
- [Embroidery](${SITE}/services#embroidery): digitised logos stitched on chest, sleeve, back, cap and apron positions
- [Print](${SITE}/services#print): screen and digital print for tees, hoodies, hi-vis and event runs
- [Workwear supply](${SITE}/services#workwear): plain or decorated garments, kids to 5XL
- [Uniform programmes](${SITE}/services#uniforms): a saved spec per team for repeat orders
- [Schools and clubs](${SITE}/schools-and-clubs): PE kit, team kits, club and leavers' hoodies

## Garment categories
${cats}

## Sample garments
${garments}

## Tools
- [Quote builder](${SITE}/quote): garment, colour, quantity, decoration, positions, logo upload, live mock-up, sample estimate
- [About and visit](${SITE}/about): the workshop in Tooting
`);
console.log(`prerendered ${n} routes, sitemap + llms.txt written`);
