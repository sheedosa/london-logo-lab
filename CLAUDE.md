# The London Logo Lab website — guidance for this repo

Static React site (Vite + Tailwind) on GitHub Pages for the I&A group's embroidery and print workshop. Confirmed by the client: services (embroidery, screen printing, DTF printing, vinyl, workwear supply, uniforms), customers (trades, schools, sports clubs), minimum order 1 item, turnaround within 7 days, priced per item or by quote. The voice is friendly: short sentences, plain words. Not an I&A-branded site: it has its own identity (`docs/BRAND.md`); the group link is a footer line only.

## Rules
1. **Facts come from `src/data/site.ts`; garments from `src/data/garments.json`.** Never invent prices, minimums, setup charges, turnaround, delivery or returns terms, addresses, phone numbers, fabric claims or reviews. Unconfirmed items are `[PLACEHOLDER]` in copy and listed in `SITE.toConfirm`. While `SITE.preview` is true, garments are samples, the pricing formula is labelled as a sample, and quote sending is switched off.
2. **Data goes through `src/lib/store.ts`; the quote lives in `src/lib/quote.tsx`.** Components never read the JSON or `localStorage` directly. Every price shown on a page is either `£[PRICE]` or the output of `estimate()` labelled as a sample.
3. **Every page sets `<Seo>`** with title, description, canonical and JSON-LD. Add new routes to `scripts/prerender.mjs`.
4. **The quote builder is the core idea:** garment, colour, quantity band, decoration (embroidery, screen print, DTF, vinyl: each with its own positions in `garments.json` `methods` and its own sample formula), positions, logo, live flat mock-up, sample per-item estimate, and an "ask us for a quote" path to the send form. Any new garment needs a `kind` drawn in `src/components/Garment.tsx` (technical-flat style: ink silhouette, sewn-on pieces filled with the cloth, check it against the real garment) and its positions and methods listed in `garments.json`. The quote state saved on the device must stay valid when the data changes (`sanitise()`).
5. **Brand (docs/BRAND.md):** Ink `#1b1916` ground and text, Paper `#f3eee4`, Orange `#f4651f` as the one accent (fill with ink text, or text on ink; never text on paper), Stone `#e6dfd0` surfaces, Mute `#5f5850` secondary text. Archivo Black for h1/h2 and big numbers (sentence case); Archivo for body and 0.15em uppercase labels. Change `--font-display` / `--font-sans` only. Corners 3px, 2px ink borders. No gradients, no pills, no card grids for prose, no stock-photo look: imagery is flat SVG, swatches and labelled photo slots (max two per page). No faces. Missing workshop photos use `PhotoSlot` (max two per page).
6. **Logo files** in `public/img/logo/` are built by `scripts/logo.py`; edit the script, not the SVGs. Rasters and the logo sheet come from `scripts/brand-assets.mjs`.
7. Tap targets ≥ 44px, no horizontal overflow at 375px, body text ≥ 16px, AA contrast with solid tones, visible focus, `aria-pressed` on toggles, one `h1` per page, British English, GBP, no emoji.

## Commands
```bash
npm run dev          # local
npm run build        # typecheck + vite build + prerender (needs Chromium)
npm run build:spa    # build without prerender
```
