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

The marque is also the "position marker" idea on the site: the mock-up's dashed boxes show where the stitch goes, and the job ticket's tick is the marque tile with a thread tick.

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

- **Archivo Black** (Google Fonts): wordmark, the home hero, page titles (h1) and large numerals such as the ticket total. Set tight: tracking about -0.03em, leading 0.96 to 0.98. Never below 18px.
- **Archivo** (variable, width and weight axes): section titles (h2) and other longer display lines at weight 800 and 88% width, so a sentence fits a phone in two or three lines; text at 400, emphasis at 500 or 600, always at normal width, 17px with 1.6 leading and lines of 45 to 75 characters.
- The voice is friendly: sentence case everywhere (headings, buttons, links), short lines, plain workshop words. Upper case is kept for the wordmark, the lines of the job ticket, filter names and footer headings (12px, 0.15em).
- One fluid scale lives in `src/index.css` (`--step-hero` to `--step-small`). Fonts load from Google Fonts in `index.html`; change `--font-display` and `--font-sans` in `src/index.css` only.

## Shapes and motion

- Corners 3px everywhere (buttons, tiles, inputs); the marque tile is the one exception at 5%.
- Borders are 2px ink; rules between rows are 1px ink.
- **The job ticket** is the site's signature: a paper ticket with a running-stitch border in orange (the marque's stitch), a perforated tear line above the total, the confirmed terms as a rust stamp in the header, and a stitched tick on each line once it is chosen. The stitch border appears only on the ticket; a short stitched rule sits under page titles. Nothing else is stitched.
- No rule grids, gradients or drop shadows.
- Motion answers an action: a ticket line opening, a tick stitching in, the drawing changing. The hero ticket arriving is the one unprompted moment. `prefers-reduced-motion` switches all motion off.
- Focus: 2px ink ring with an orange halo on light grounds; 3px orange ring on ink.

## Illustration

Flat garment drawings (`src/components/Garment.tsx`) in one 200×220 viewBox: cloth filled from the garment's colour list, 1.5px ink outline, seams at 55% in the contrast colour, hi-vis tape in a fixed silver. Logo positions are dashed orange boxes with a cross; uploaded artwork sits inside the box. Method close-ups (`MethodCloseUp.tsx`): one round loupe on the cloth showing the foot of the marque's L made four ways: satin stitch rows, screen mesh dots, a DTF film peeling, cut vinyl with the waste lifting. Same 1.5px ink outline and flat fills.

Photos are limited to two per page and otherwise replaced by labelled photo slots in stone. No faces.
