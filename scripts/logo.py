# Builds The London Logo Lab lockups as outlined SVG paths (no font dependency at render time).
# Wordmark: "LOGO LAB" in Archivo Black; "THE LONDON" in Archivo Bold, tracked 0.18em.
# Marque: a running-stitch "L" on a square tile.
#
# Usage:  python3 scripts/logo.py <fonts-dir> <out-dir>
#   fonts-dir holds archivo-black-latin-400-normal.woff and archivo-latin-700-normal.woff
#   (from `npm pack @fontsource/archivo-black @fontsource/archivo`, files/ folder).
import sys
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen

FONTS, OUT = sys.argv[1].rstrip("/"), sys.argv[2].rstrip("/")
black = TTFont(f"{FONTS}/archivo-black-latin-400-normal.woff")
bold = TTFont(f"{FONTS}/archivo-latin-700-normal.woff")

INK, PAPER, ORANGE = "#1b1916", "#f3eee4", "#f4651f"
LABEL = "The London Logo Lab"


def run(font, text, size, x, y, tracking=0.0):
    """Outline `text` at baseline (x, y). Returns (path d, advance, bbox)."""
    gs = font.getGlyphSet(); cmap = font.getBestCmap(); s = size / font["head"].unitsPerEm
    pen = SVGPathPen(gs); bp = BoundsPen(gs); cx = x
    for i, ch in enumerate(text):
        glyph = gs[cmap[ord(ch)]]
        glyph.draw(TransformPen(pen, (s, 0, 0, -s, cx, y)))
        glyph.draw(TransformPen(bp, (s, 0, 0, -s, cx, y)))
        cx += glyph.width * s + (tracking * size if i < len(text) - 1 else 0)
    return pen.getCommands(), cx - x, bp.bounds


def stitch(x, y, size, tile, thread, r=None):
    """Square tile with a running-stitch L: five stitches, the third turning the corner."""
    r = size * 0.05 if r is None else r
    sw = size * 0.10                     # thread width
    k = lambda v: x + size * v / 100
    j = lambda v: y + size * v / 100
    segs = [f"M{k(24):.2f} {j(18):.2f}V{j(28):.2f}", f"M{k(24):.2f} {j(42):.2f}V{j(52):.2f}",
            f"M{k(24):.2f} {j(66):.2f}V{j(76):.2f}H{k(36):.2f}", f"M{k(50):.2f} {j(76):.2f}H{k(60):.2f}",
            f"M{k(74):.2f} {j(76):.2f}H{k(84):.2f}"]
    return (f'<rect x="{x:.2f}" y="{y:.2f}" width="{size:.2f}" height="{size:.2f}" rx="{r:.2f}" fill="{tile}"/>'
            f'<path d="{"".join(segs)}" fill="none" stroke="{thread}" stroke-width="{sw:.2f}" stroke-linecap="round" stroke-linejoin="round"/>')


def svg(body, w, h, bg=None):
    rect = f'<rect width="{w:.1f}" height="{h:.1f}" fill="{bg}"/>' if bg else ""
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w:.1f} {h:.1f}" role="img" aria-label="{LABEL}">{rect}{body}</svg>')


def wordmark(x, y, fill, big=100):
    """THE LONDON over LOGO LAB, left aligned at x; y is the LOGO LAB baseline. Returns (body, width, top)."""
    small = big * 0.26
    d1, w1, b1 = run(black, "LOGO LAB", big, x, y, tracking=-0.015)
    top_small_base = b1[1] - big * 0.16
    d2, w2, b2 = run(bold, "THE LONDON", small, x + big * 0.03, top_small_base, tracking=0.18)
    return f'<g fill="{fill}"><path d="{d1}"/><path d="{d2}"/></g>', max(w1, w2), b2[1]


def horizontal(text_fill, tile, thread, bg=None):
    big = 100; pad = 6
    _, w, top = wordmark(0, 0, text_fill, big)
    cap = -top                       # text block height from top of THE LONDON to LOGO LAB baseline
    tile_size = cap + big * 0.06
    gap = big * 0.3
    tx = pad + tile_size + gap
    base = pad + cap + big * 0.03
    body, w, _ = wordmark(tx, base, text_fill, big)
    marque = stitch(pad, pad, tile_size, tile, thread)
    W = tx + w + pad; H = pad + tile_size + pad
    return svg(marque + body, W, H, bg)


def stacked(text_fill, tile, thread, bg=None):
    big = 100; tile_size = 140
    _, w, top = wordmark(0, 0, text_fill, big)
    W = w + 80
    tx = (W - w) / 2
    ty = 30 + tile_size + 50 - top
    body, _, _ = wordmark(tx, ty, text_fill, big)
    marque = stitch((W - tile_size) / 2, 30, tile_size, tile, thread)
    H = ty + 36
    return svg(marque + body, W, H, bg)


def marque(tile, thread, size=512, square=False):
    if square:  # full-bleed for favicons and app icons
        return svg(stitch(0, 0, size, tile, thread, r=0), size, size)
    return svg(stitch(0, 0, size, tile, thread), size, size)


files = {
    "logolab-horizontal-ink.svg": horizontal(INK, INK, ORANGE),
    "logolab-horizontal-paper.svg": horizontal(PAPER, PAPER, INK),
    "logolab-horizontal-orange.svg": horizontal(PAPER, ORANGE, INK),
    "logolab-stacked-ink.svg": stacked(INK, INK, ORANGE),
    "logolab-stacked-paper.svg": stacked(PAPER, PAPER, INK),
    "logolab-stacked-ink-bg.svg": stacked(PAPER, ORANGE, INK, bg=INK),
    "logolab-stacked-orange-bg.svg": stacked(INK, INK, ORANGE, bg=ORANGE),
    "logolab-marque-ink.svg": marque(INK, ORANGE),
    "logolab-marque-orange.svg": marque(ORANGE, INK),
    "logolab-marque-paper.svg": marque(PAPER, INK),
    "logolab-marque-icon.svg": marque(INK, ORANGE, square=True),
}
for name, content in files.items():
    open(f"{OUT}/{name}", "w").write(content)
print(f"wrote {len(files)} files to {OUT}")
