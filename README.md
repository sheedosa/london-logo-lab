# The London Logo Lab — embroidery, print and workwear

Concept preview for The London Logo Lab, the embroidery and print arm of the I&A group in Tooting, South London: embroidery, screen printing, DTF printing, vinyl, workwear supply and uniforms for trades, schools and sports clubs. From 1 item, ready within 7 days.
Built by Elconekt for IandA Group on the same stack as the group's other storefronts.

**Live preview:** https://sheedosa.github.io/london-logo-lab/

## The idea the site owns
The **quote builder with a live mock-up** (`/quote`, and its front door on the home page): garment, colour, quantity, decoration (embroidery, screen print, DTF or vinyl, each with its own positions), positions and an uploaded logo or typed name, shown on a flat drawing of the garment with the logo in place, with a sample per-item estimate that moves with the quantity band (1 to 9, 10 to 24, 25 to 49, 50+), and an "ask us for a quote" path. State lives in `src/lib/quote.tsx` and is saved to `localStorage`, so the choice made on the home page is waiting on the quote page and on each garment page. Submitting shows "Quote request ready; sending opens at launch" and a copyable summary.

## Stack
Vite + React 19 + TypeScript + Tailwind v4, react-router, deployed to GitHub Pages by `.github/workflows/deploy.yml`.
Every route is prerendered to static HTML (`scripts/prerender.mjs`) with titles, meta, Open Graph, JSON-LD, `sitemap.xml` and `llms.txt`.

## Commands
```bash
npm install
npm run dev          # http://localhost:5173/london-logo-lab/
npm run build        # typecheck + build + prerender (needs Chromium)
npm run build:spa    # without prerender
python3 scripts/logo.py <fonts-dir> public/img/logo   # rebuild the SVG lockups (see docs/BRAND.md)
node scripts/brand-assets.mjs                         # icons, Open Graph image, docs/logo-sheet.png
```

## What's real and what's sample
- **Real (confirmed by the client):** the six services, the three customer groups (trades, schools, sports clubs), minimum order 1 item, turnaround within 7 days, pricing per item or by quote, the area (Tooting, South London), the group link (footer), the identity in `docs/BRAND.md`.
- **Sample:** every garment in `src/data/garments.json` (names, colours, sizes, positions, which decorations each takes), the `sampleBase` and per-method `sample` figures and the whole pricing formula in `src/lib/quote.tsx`, the uniform spec example. All are labelled as samples on the page and in the preview banner (`SITE.preview`).
- **Placeholders:** address, phone, email, hours, legal entity, company and VAT numbers, prices, setup charges, express option, delivery and returns terms, artwork fees, school programme terms, client reviews. Every one is written as `[PLACEHOLDER]` in copy and listed in `SITE.toConfirm` (`src/data/site.ts`).

## Going live
1. Fill `SITE` in `src/data/site.ts` and replace every `[PLACEHOLDER]` in `src/pages/*` (grep for `\[` in `src/`).
2. Replace `src/data/garments.json` with the real range (brands, style codes, colours, sizes) and replace the sample formula in `src/lib/quote.tsx` with the workshop's price list, or move pricing server-side.
3. Wire `QuoteBuilder`'s "Prepare quote request" to a real destination (email via a form service, or the group's hub), including the uploaded artwork file.
4. Set `SITE.preview = false` to drop the banners and sample notes.
5. Replace each `PhotoSlot` ("Photo to come") with the workshop's own photographs.
6. Custom domain: `public/CNAME`, `VITE_BASE=/`, update `SITE.url`, `index.html`, `robots.txt`, `404.html` and `scripts/prerender.mjs`.
