import { useId } from "react";
import type { Method } from "../lib/store";

// Drawn close-ups of the four decoration methods, in the same technical-flat style as the garments: one loupe on
// the cloth, each showing what the technique really looks like close up. Flat fills, no gradients, house palette.
const INK = "#1b1916", PAPER = "#f3eee4", STONE = "#e6dfd0", LINE = "#cfc6b4", WARP = "#d8cfbd", ORANGE = "#f4651f", DEEP = "#c4500f", PALE = "#f99a66";
const BLUE = "#2b4fbf", GREEN = "#1f4a36";

const ALT: Record<Method, string> = {
  embroidery: "Close-up of embroidery: two columns of satin stitch on a woven cloth, every thread lying the same way, with a loose thread end",
  screen: "Close-up of a screen print: flat solid ink with a crisp edge, fading into a halftone tint of dots",
  dtf: "Close-up of a DTF transfer: a full-colour picture with its thin film edge, and the clear carrier sheet peeling from one corner",
  vinyl: "Close-up of cut vinyl: a single-colour number with a clean cut edge, one corner lifting as it is weeded",
};

type P = [number, number];
const q = (a: P, b: P, c: P, t: number): P => [(1 - t) ** 2 * a[0] + 2 * (1 - t) * t * b[0] + t * t * c[0], (1 - t) ** 2 * a[1] + 2 * (1 - t) * t * b[1] + t * t * c[1]];
const r1 = (n: number) => Math.round(n * 10) / 10;

/** One satin-stitch column: threads laid side by side across a curve, each slanted the same way. */
function Satin({ a, b, c, w, n, slant = 2.2 }: { a: P; b: P; c: P; w: number; n: number; slant?: number }) {
  const lines = Array.from({ length: n }, (_, i) => {
    const t = (i + 0.5) / n;
    const [x, y] = q(a, b, c, t), [x2, y2] = q(a, b, c, Math.min(1, t + 0.01));
    const len = Math.hypot(x2 - x, y2 - y) || 1, tx = (x2 - x) / len, ty = (y2 - y) / len, nx = -ty, ny = tx;
    return [r1(x + nx * w / 2 - tx * slant), r1(y + ny * w / 2 - ty * slant), r1(x - nx * w / 2 + tx * slant), r1(y - ny * w / 2 + ty * slant)];
  });
  return (
    <g strokeLinecap="round">
      {lines.map(([x1, y1, x2, y2], i) => <line key={`d${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={DEEP} strokeWidth="3" />)}
      {lines.map(([x1, y1, x2, y2], i) => <line key={`l${i}`} x1={x1} y1={y1 - 0.6} x2={x2} y2={y2 - 0.6} stroke={ORANGE} strokeWidth="1.8" />)}
      {lines.map(([x1, y1, x2, y2], i) => <line key={`s${i}`} x1={r1(x1 + (x2 - x1) * 0.3)} y1={r1(y1 + (y2 - y1) * 0.3 - 0.9)} x2={r1(x1 + (x2 - x1) * 0.55)} y2={r1(y1 + (y2 - y1) * 0.55 - 0.9)} stroke={PALE} strokeWidth="0.8" />)}
    </g>
  );
}

function Art({ method, id }: { method: Method; id: string }) {
  if (method === "embroidery") return (
    <>
      {/* a plain-weave ground: warp and weft passing over and under each other */}
      <defs>
        <pattern id={`${id}-plain`} width="8" height="8" patternUnits="userSpaceOnUse">
          <rect width="8" height="8" fill={STONE} />
          <rect x="0" y="0.6" width="4" height="2.8" rx="1.2" fill={WARP} /><rect x="4" y="4.6" width="4" height="2.8" rx="1.2" fill={WARP} />
          <rect x="4.6" y="0" width="2.8" height="4" rx="1.2" fill={LINE} /><rect x="0.6" y="4" width="2.8" height="4" rx="1.2" fill={LINE} />
        </pattern>
      </defs>
      <rect width="144" height="144" fill={`url(#${id}-plain)`} />
      <Satin a={[30, 108]} b={[38, 46]} c={[106, 34]} w={22} n={44} />
      <Satin a={[64, 120]} b={[92, 104]} c={[122, 80]} w={16} n={24} slant={1.6} />
      {/* the thread end, pulled through and left loose, with the needle holes along the column's edge */}
      <path d="M106 23 C118 22 124 30 121 42" fill="none" stroke={ORANGE} strokeWidth="1.6" strokeLinecap="round" />
      <g fill={INK}>{[[26, 112], [36, 116], [118, 70], [126, 86]].map(([x, y]) => <circle key={`${x}`} cx={x} cy={y} r="0.9" />)}</g>
    </>
  );
  if (method === "screen") {
    // halftone: dots on a grid, shrinking as the tint fades away from the solid ink
    const dots: [number, number, number][] = [];
    for (let row = 0; row < 9; row++) for (let col = 0; col < 24; col++) {
      const y = 78 + row * 6, x = col * 6 + (row % 2 ? 3 : 0), r = 2.9 - row * 0.32;
      if (r > 0.35) dots.push([x, y, r1(r)]);
    }
    return (
      <>
        {/* one flat, opaque layer of ink with a crisp edge */}
        <path d="M0 0 H144 V72 C120 76 98 70 72 74 C46 78 24 72 0 75 Z" fill={ORANGE} />
        <g fill={ORANGE}>{dots.map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} />)}</g>
        {/* the second screen: a solid ink shape laid on top in register */}
        <path d="M38 22 H106 L94 52 H26 Z" fill={INK} />
        <path d="M52 30 H92 L88 40 H48 Z" fill={ORANGE} />
      </>
    );
  }
  if (method === "dtf") return (
    <>
      {/* the clear carrier film, a little larger than the print, peeling from the top right corner */}
      <path d="M20 26 H100 L124 50 V118 H20 Z" fill={PAPER} fillOpacity="0.45" stroke={INK} strokeWidth="1.2" strokeLinejoin="round" />
      <clipPath id={`${id}-art`}><rect x="32" y="38" width="80" height="68" rx="5" /></clipPath>
      {/* the thin film edge every DTF print has round its artwork */}
      <rect x="30" y="36" width="84" height="72" rx="6.5" fill={PAPER} stroke={INK} strokeWidth="0.8" />
      <g clipPath={`url(#${id}-art)`}>
        <rect x="32" y="38" width="80" height="68" fill={ORANGE} />
        <circle cx="90" cy="58" r="10" fill={PAPER} />
        <path d="M32 92 L56 62 L72 80 L84 70 L112 98 V106 H32 Z" fill={BLUE} />
        <path d="M32 100 C52 88 72 96 92 90 C100 88 106 92 112 94 V106 H32 Z" fill={GREEN} />
        <path d="M50 70 L56 62 L62 69 L57 67 Z" fill={PAPER} />
      </g>
      <path d="M100 26 L124 50 L104 52 Z" fill={PAPER} stroke={INK} strokeWidth="1.2" strokeLinejoin="round" />
    </>
  );
  return (
    <>
      {/* a cut number in one colour; the waste around it has been weeded and one corner is lifting */}
      <path d="M58 30 H104 V46 L80 116 H60 L83 50 H42 V46 Z" fill={INK} />
      <path d="M42 46 L58 30 V46 Z" fill={STONE} />
      <path d="M58 30 L42 46 L30 22 Z" fill={LINE} stroke={INK} strokeWidth="1.4" strokeLinejoin="round" />
      {/* the weeding hook catching the lifted corner */}
      <path d="M30 22 C27 19 27 15 31 14 L58 2" fill="none" stroke={INK} strokeWidth="1.8" strokeLinecap="round" />
      {/* a strip of waste vinyl not yet weeded, with its cut line */}
      <path d="M112 30 H144 V116 H96 L112 70 Z" fill={INK} fillOpacity="0.18" />
      <path d="M112 30 V70 L96 116" fill="none" stroke={INK} strokeWidth="1" strokeDasharray="3 2" />
    </>
  );
}

/** A round loupe on the cloth, showing how one method looks close up. */
export function MethodCloseUp({ method, className = "", decorative = false }: { method: Method; className?: string; decorative?: boolean }) {
  const id = `cu${useId().replace(/[^a-z0-9]/gi, "")}`;
  return (
    <svg viewBox="0 0 144 144" className={className} role={decorative ? undefined : "img"} aria-label={decorative ? undefined : ALT[method]} aria-hidden={decorative || undefined}>
      <defs>
        <clipPath id={`${id}-loupe`}><circle cx="72" cy="72" r="68" /></clipPath>
        <pattern id={`${id}-weave`} width="6" height="6" patternUnits="userSpaceOnUse"><path d="M0 3h6M3 0v6" stroke={LINE} strokeWidth="1" /></pattern>
      </defs>
      <g clipPath={`url(#${id}-loupe)`}>
        <rect width="144" height="144" fill={STONE} />
        <rect width="144" height="144" fill={`url(#${id}-weave)`} />
        <Art method={method} id={id} />
      </g>
      <circle cx="72" cy="72" r="68" fill="none" stroke={INK} strokeWidth="1.5" />
    </svg>
  );
}
