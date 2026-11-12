// Renders the raster brand assets from the SVG lockups: favicons and app icons, the Open Graph image and the
// logo sheet in docs/. Run after scripts/logo.py:  node scripts/brand-assets.mjs
import { chromium } from "playwright";
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";

const root = new URL("../", import.meta.url).pathname;
const logo = (n) => `file://${root}public/img/logo/${n}`;
const INK = "#1b1916", PAPER = "#f3eee4", ORANGE = "#f4651f", STONE = "#e6dfd0", MUTE = "#5f5850";
const fonts = `<link href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Archivo:wght@400;500;600&family=Bitter:wght@700;800;900&display=swap" rel="stylesheet">`;

const exe = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || (existsSync("/opt/pw-browsers/chromium") ? "/opt/pw-browsers/chromium" : undefined);
const browser = await chromium.launch(exe ? { executablePath: exe } : {});
const shot = async (html, w, h, path, type = "png") => {
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  const tmp = `${root}node_modules/.tmp/brand-${Date.now()}.html`;
  mkdirSync(`${root}node_modules/.tmp`, { recursive: true });
  writeFileSync(tmp, html);
  await page.goto(`file://${tmp}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(300);
  await page.screenshot({ path, type, ...(type === "jpeg" ? { quality: Number(process.env.OG_QUALITY ?? 90) } : {}) });
  await page.close();
};

// Icons: full-bleed marque
for (const [size, name] of [[64, "favicon-64.png"], [180, "apple-touch-icon.png"], [512, "icon-512.png"]]) {
  await shot(`<html><body style="margin:0"><img src="${logo("logolab-marque-icon.svg")}" style="width:${size}px;height:${size}px;display:block"></body></html>`, size, size, `${root}public/img/logo/${name}`);
}

// Open Graph image: the orange field, the slab headline across it, the ink lockup and the stamp
await shot(`<html><head>${fonts}<style>
  body{margin:0;width:1200px;height:630px;background:${ORANGE};font-family:Archivo,Arial,sans-serif;color:${INK};position:relative;overflow:hidden}
  .in{position:absolute;left:64px;top:56px;right:64px;bottom:56px;display:flex;flex-direction:column;justify-content:space-between}
  h1{font-family:Bitter,Rockwell,Georgia,serif;font-weight:900;font-size:100px;line-height:1;margin:0;letter-spacing:-.018em;word-spacing:.06em}
  .row{display:flex;justify-content:space-between;align-items:flex-end;gap:48px}
  p{margin:0;font-size:25px;line-height:1.4;font-weight:500;max-width:520px}
  .card{background:${PAPER};border:3px solid ${INK};border-radius:4px;padding:22px 26px;display:flex;flex-direction:column;gap:16px;align-items:flex-start}
  .stamp{border:3px solid #b54106;color:#b54106;border-radius:4px;padding:6px 12px;font-size:19px;font-weight:600;line-height:1.3;letter-spacing:.09em;text-transform:uppercase;transform:rotate(-1.5deg)}
</style></head><body><div class="in">
  <h1>Your logo, stitched in Tooting.</h1>
  <div class="row"><p>Polos, hoodies, hi-vis, caps and aprons with your logo on. Build a quote and see it on the garment first.</p>
  <div class="card"><img src="${logo("logolab-horizontal-ink.svg")}" style="height:64px"><div class="stamp">1 item minimum<br>Ready within 7 days</div></div></div>
</div></body></html>`, 1200, 630, `${root}public/img/og/og-home.jpg`, "jpeg");

// Logo sheet for docs/
const tile = (bg, inner, h = 220) => `<div style="background:${bg};height:${h}px;display:flex;align-items:center;justify-content:center;border:2px solid ${INK}">${inner}</div>`;
await shot(`<html><head>${fonts}<style>
  body{margin:0;width:1400px;background:${PAPER};font-family:Archivo,Arial,sans-serif;color:${INK};padding:56px;box-sizing:border-box}
  h1{font-family:Bitter,Rockwell,Georgia,serif;font-weight:900;font-size:46px;margin:0 0 6px;letter-spacing:-.012em}
  .sub{color:${MUTE};font-size:18px;margin-bottom:36px}
  .label{text-transform:uppercase;letter-spacing:.15em;font-weight:600;font-size:12px;margin:0 0 10px}
  .g{display:grid;grid-template-columns:repeat(2,1fr);gap:24px;margin-bottom:32px}
  .g4{display:grid;grid-template-columns:repeat(4,1fr);gap:24px;margin-bottom:32px}
  .sw{height:120px;border:2px solid ${INK};display:flex;align-items:flex-end;padding:12px;font-size:14px;font-weight:600}
</style></head><body>
  <h1>The London Logo Lab</h1><div class="sub">Identity sheet. A light, orange-led workshop: Archivo Black wordmark, running-stitch L marque, Bitter slab headings, safety orange in whole fields with ink type.</div>
  <p class="label">Horizontal lockups</p>
  <div class="g">${tile(PAPER, `<img src="${logo("logolab-horizontal-ink.svg")}" style="height:90px">`)}${tile(INK, `<img src="${logo("logolab-horizontal-paper.svg")}" style="height:90px">`)}</div>
  <p class="label">Stacked lockups</p>
  <div class="g4">${tile(PAPER, `<img src="${logo("logolab-stacked-ink.svg")}" style="height:180px;max-width:86%;object-fit:contain">`, 260)}${tile(INK, `<img src="${logo("logolab-stacked-paper.svg")}" style="height:180px;max-width:86%;object-fit:contain">`, 260)}${tile(ORANGE, `<img src="${logo("logolab-stacked-orange-bg.svg")}" style="height:180px;max-width:86%;object-fit:contain">`, 260)}${tile(INK, `<img src="${logo("logolab-stacked-ink-bg.svg")}" style="height:180px;max-width:86%;object-fit:contain">`, 260)}</div>
  <p class="label">Marque and small sizes</p>
  <div class="g4">${tile(PAPER, `<img src="${logo("logolab-marque-ink.svg")}" style="height:140px">`)}${tile(PAPER, `<img src="${logo("logolab-marque-orange.svg")}" style="height:140px">`)}${tile(INK, `<img src="${logo("logolab-marque-paper.svg")}" style="height:140px">`)}${tile(STONE, `<div style="display:flex;gap:16px;align-items:center"><img src="${logo("logolab-marque-icon.svg")}" style="height:64px"><img src="${logo("logolab-marque-icon.svg")}" style="height:32px"><img src="${logo("logolab-marque-icon.svg")}" style="height:16px"></div>`)}</div>
  <p class="label">Palette</p>
  <div class="g4" style="grid-template-columns:repeat(5,1fr)">
    <div class="sw" style="background:${INK};color:${PAPER}">Ink ${INK}</div><div class="sw" style="background:${PAPER}">Paper ${PAPER}</div><div class="sw" style="background:${ORANGE}">Orange ${ORANGE}</div><div class="sw" style="background:${STONE}">Stone ${STONE}</div><div class="sw" style="background:${MUTE};color:${PAPER}">Mute ${MUTE}</div>
  </div>
  <p class="label">Type</p>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px">
    <div><div style="font-family:Bitter;font-weight:900;font-size:56px;line-height:1;letter-spacing:-.012em">Bitter 900, 800, 700</div><div style="color:${MUTE};margin-top:8px">Headings and big numerals, in sentence case. Archivo Black is kept for the wordmark only.</div></div>
    <div><div style="font-size:40px;font-weight:600;line-height:1">Archivo 400 to 600</div><div style="color:${MUTE};margin-top:8px">Body at 16px and up; labels uppercase, 0.15em tracked, semibold.</div></div>
  </div>
</body></html>`, 1400, Number(process.env.SHEET_HEIGHT ?? 1400), `${root}docs/logo-sheet.png`);

await browser.close();
console.log("brand assets written: favicon-64, apple-touch-icon, icon-512, og-home.jpg, docs/logo-sheet.png");
