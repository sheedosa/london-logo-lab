# The London Logo Lab — identity

Direction: **Bold workshop.** Confident, trade-friendly, reads on a van door and a polo chest. Not an I&A-branded site; the group link is a footer line only.

![Logo sheet](logo-sheet.png)

## Name treatment

- **LOGO LAB** is the strong word: Archivo Black, upper case, tracked slightly tight (−0.015em).
- **THE LONDON** sits above it, left aligned: Archivo Bold at 26% of the big size, tracked 0.18em.
- The two lines share a left edge. Nothing is ever set in Archivo Black below 18px.
- Written in prose: "The London Logo Lab" on first mention, "Logo Lab" after that. Never "LLL".

## Marque: the running-stitch L

Five stitches on a square tile make an L: three down, the third turns the corner, two along the foot. It is the first letter of the strong word drawn with the first thing the workshop does. Round-capped strokes at 10% of the tile, gaps wide enough to survive 16px (favicon) and embroidery at 20mm. Tile corners are 5% of the edge; the full-bleed icon version is square.

The marque is also the "position marker" idea on the site: the quote builder's dashed boxes show where the stitch goes.

## Lockups (`public/img/logo/`)

| File | Use |
| --- | --- |
| `logolab-horizontal-ink.svg` | Header, documents, anything on paper or stone |
| `logolab-horizontal-paper.svg` | Footer, dark grounds |
| `logolab-horizontal-orange.svg` | Orange tile + paper text on ink, for van sides and signage |
| `logolab-stacked-ink.svg`, `-paper.svg` | Square-ish spaces: labels, social avatars with a border, embroidery on a chest |
| `logolab-stacked-ink-bg.svg`, `-orange-bg.svg` | Self-contained tiles with their own background |
| `logolab-marque-ink.svg`, `-orange.svg`, `-paper.svg` | Marque alone: small spaces, sleeve embroidery, stamps |
| `logolab-marque-icon.svg` + `favicon-64.png`, `apple-touch-icon.png`, `icon-512.png` | Full-bleed app and tab icons |

All lockups are outlined paths built by `scripts/logo.py` (fontTools over the Google Fonts files from `@fontsource/archivo-black` and `@fontsource/archivo`), so they need no fonts installed. Raster assets and this sheet come from `scripts/brand-assets.mjs`.

Clear space: the height of the marque tile on all sides. Minimum width: 120px horizontal, 80px stacked, 16px marque.

## Palette

| Token | Hex | Role |
| --- | --- | --- |
| Ink | `#1b1916` | Ground for hero, panels, footer; all body text on light grounds |
| Paper | `#f3eee4` | Warm page ground; text on ink |
| Orange | `#f4651f` | The one accent. Fills with ink text (5.6:1), or text on ink (5.6:1). Never text on paper |
| Stone | `#e6dfd0` | Neutral surface with a warm bias: cards, bands, photo slots |
| Mute | `#5f5850` | Secondary text: 6.0:1 on paper, 5.3:1 on stone |
| Paper mute | `#c9c2b5` | Secondary text on ink: 9.9:1 |
| Deep | `#121110` | Footer and pressed states |
| Line | `#d9d1c2` | Hairlines and dividers |

Orange-deep `#d9530f` is the hover state for orange buttons. No gradients. No alpha text.

## Type

- **Archivo Black** (Google Fonts): wordmark, h1, h2, large numerals and prices. Sentence case for headings, upper case only in the wordmark and labels.
- **Archivo** 400 to 700: body at 16px or larger, buttons (semibold, upper case, 0.12em), labels (semibold, upper case, 0.15em, 12px).
- Loaded from Google Fonts in `index.html`; change `--font-display` and `--font-sans` in `src/index.css` only.

## Shapes and motion

- Corners 3px everywhere (buttons, cards, inputs); the marque tile is the one exception at 5%.
- Borders are 2px ink. Section dividers can be a running-stitch rule (`StitchRule`).
- Decorative backgrounds: a 64px rule grid at 8–9% opacity on ink or orange heroes.
- Motion only in response to a user action (hover colour, focus outline). `prefers-reduced-motion` is respected globally.

## Illustration

Flat garment drawings (`src/components/Garment.tsx`) in one 200×220 viewBox: cloth filled from the garment's colour list, 1.5px ink outline, seams at 55% in the contrast colour, hi-vis tape in a fixed silver. Logo positions are dashed orange boxes with a cross; uploaded artwork sits inside the box. Craft icons (`Icons.tsx`): needle, ink drop, spool, squeegee, registration mark, van, all 1.5px stroke.

Photos are limited to two per page and otherwise replaced by labelled photo slots in stone. No faces.
