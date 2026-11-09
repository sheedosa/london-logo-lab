import type { ReactNode } from "react";
import type { GarmentKind, PositionId } from "../lib/store";
import type { Logo } from "../lib/quote";

// Flat garment drawings, in the style of a technical flat: one 200 x 220 viewBox for every kind so cards and the
// quote builder line up. The silhouette is always outlined in ink; pieces sewn onto the body (collars, cuffs,
// pockets, hoods, peaks) are filled with the cloth and outlined in a solid edge tone that reads on that cloth;
// stitching is a dashed seam tone. `positions` draws the decoration boxes; `logo` is placed inside each one.
// Wearer's left is the viewer's right on the front view.

type Box = { x: number; y: number; w: number; h: number };
type Pal = { cloth: string; shade: string; edge: string; seam: string };
type Part = (p: Pal) => ReactNode;
type Spec = { front: Part; back?: Part; boxes: Partial<Record<PositionId, Box>>; backBoxes?: Partial<Record<PositionId, Box>> };

const INK = "#1b1916", PAPER = "#f3eee4", ORANGE = "#f4651f", TAPE = "#c9ccd1";

// ---- colour helpers -------------------------------------------------------------------------------------------
const rgb = (hex: string) => { const n = parseInt(hex.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
const hex = (c: number[]) => `#${c.map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, "0")).join("")}`;
const mix = (a: string, b: string, t: number) => { const x = rgb(a), y = rgb(b); return hex(x.map((v, i) => v + (y[i] - v) * t)); };
const lin = (v: number) => { const s = v / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; };
const relLum = (h: string) => { const [r, g, b] = rgb(h); return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b); };
const contrast = (a: string, b: string) => { const x = relLum(a), y = relLum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
const isLight = (h: string) => relLum(h) > 0.3;

function palette(cloth: string): Pal {
  const light = isLight(cloth);
  return {
    cloth,
    shade: light ? mix(cloth, INK, 0.22) : mix(cloth, "#000000", 0.45), // inside of a neck or hood
    edge: light ? INK : mix(cloth, PAPER, 0.62),                         // outline of sewn-on pieces
    seam: light ? mix(cloth, INK, 0.5) : mix(cloth, PAPER, 0.42),        // dashed topstitching
  };
}

// ---- shared shapes ----------------------------------------------------------------------------------------------
const STROKE = { strokeWidth: 1.5, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };
const Outline = ({ d, fill }: { d: string; fill: string }) => <path d={d} fill={fill} stroke={INK} {...STROKE} />;
const Piece = ({ d, p, fill }: { d: string; p: Pal; fill?: string }) => <path d={d} fill={fill ?? p.cloth} stroke={p.edge} {...STROKE} />;
const Seams = ({ d, p }: { d: string[]; p: Pal }) => <g fill="none" stroke={p.seam} strokeWidth="1.2" strokeDasharray="3 2.5" strokeLinecap="round">{d.map((x, i) => <path key={i} d={x} />)}</g>;
const Lines = ({ d, p, w = 1.5 }: { d: string[]; p: Pal; w?: number }) => <g fill="none" stroke={p.edge} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round">{d.map((x, i) => <path key={i} d={x} />)}</g>;

/** Short-sleeve body (tee, polo). `neck` is the control point of the neckline curve: higher number, deeper neck. */
const shortBody = (neck: number) => `M78 42 L44 54 L16 102 L36 116 L52 94 L54 206 L146 206 L148 94 L164 116 L184 102 L156 54 L122 42 Q100 ${neck} 78 42 Z`;
/** Long-sleeve body: sleeves run to the wrist and finish at a cuff. */
const longBody = (neck: number) => `M78 42 L44 54 L12 196 L36 198 L54 104 L54 206 L146 206 L146 104 L164 198 L188 196 L156 54 L122 42 Q100 ${neck} 78 42 Z`;
const ARMHOLE_SHORT = ["M44 54 Q54 74 52 94", "M156 54 Q146 74 148 94"];
const ARMHOLE_LONG = ["M44 54 Q56 80 54 104", "M156 54 Q144 80 146 104"];
const SLEEVE_HEM_STITCH = ["M19.4 97.1 L39.4 111.1", "M180.6 97.1 L160.6 111.1"];
const HEM_STITCH = "M56 199 H144";

/** Knitted rib cuffs at the wrist, with rib lines. */
const RibCuffs: Part = (p) => (
  <>
    <Piece p={p} d="M14.7 184 L38.5 185 L36 198 L12 196 Z" />
    <Piece p={p} d="M185.3 184 L161.5 185 L164 198 L188 196 Z" />
    <Lines p={{ ...p, edge: p.seam }} w={1} d={["M20.6 184.3 L18 196.5", "M26.6 184.5 L24 197", "M32.5 184.8 L30 197.5", "M179.4 184.3 L182 196.5", "M173.4 184.5 L176 197", "M167.5 184.8 L170 197.5"]} />
  </>
);
/** Knitted rib waistband. */
const RibHem: Part = (p) => (
  <>
    <Piece p={p} d="M54 192 H146 V206 H54 Z" />
    <Lines p={{ ...p, edge: p.seam }} w={1} d={Array.from({ length: 11 }, (_, i) => `M${62 + i * 7.6} 194.5 V203.5`)} />
  </>
);
/** Bound cuffs and hem (fleece, softshell): a narrow band, no rib. */
const BoundCuffs: Part = (p) => (
  <>
    <Piece p={p} d="M13.4 190 L37.3 191 L36 198 L12 196 Z" />
    <Piece p={p} d="M186.6 190 L162.7 191 L164 198 L188 196 Z" />
  </>
);
/** Crew neck rib. `outer` sets how far the rib sits below the neckline. */
const crew = (outer: number): Part => (p) => (
  <>
    <Piece p={p} fill={p.shade} d="M78 42 Q100 54 122 42 Q100 76 78 42 Z" />
    <Piece p={p} d={`M78 42 Q100 76 122 42 L126 43.4 Q100 ${outer} 74 43.4 Z`} />
  </>
);
const crewBack: Part = (p) => <Piece p={p} d="M78 42 Q100 50 122 42 L126 43.4 Q100 58 74 43.4 Z" />;

/** Polo: a folded knit collar with two points, a three-button placket. */
const poloCollar: Part = (p) => (
  <>
    <Piece p={p} fill={p.shade} d="M80 41 Q100 52 120 41 L100 64 Z" />
    <Piece p={p} d="M78 42 Q100 25 122 42 Q100 34 78 42 Z" />
    <Piece p={p} d="M94 62 H106 V104 H94 Z" />
    <g fill={p.shade} stroke={p.edge} strokeWidth="1">{[74, 85, 96].map((y) => <circle key={y} cx="100" cy={y} r="2.2" />)}</g>
    <Piece p={p} d="M78 41 L69 46 L83 80 L100 63 Q89 53 78 41 Z" />
    <Piece p={p} d="M122 41 L131 46 L117 80 L100 63 Q111 53 122 41 Z" />
  </>
);
const poloCollarBack: Part = (p) => (
  <>
    <Piece p={p} d="M77 43 Q100 51 123 43 L123 34 Q100 40 77 34 Z" />
    <Seams p={p} d={["M79 37.5 Q100 43 121 37.5"]} />
  </>
);
/** Short sleeve with a knitted rib band (polo). */
const ribSleeveBands: Part = (p) => (
  <>
    <Piece p={p} d="M16 102 L36 116 L40 110.3 L20 96.3 Z" />
    <Piece p={p} d="M184 102 L164 116 L160 110.3 L180 96.3 Z" />
  </>
);

/** Hood, worn up, seen from the front: a filled shape behind the shoulders, the lined opening, two drawcords. */
const hoodFront = (zip: boolean): Part => (p) => (
  <>
    <Piece p={p} fill={p.shade} d={`M82 52 C80 36 88 24 100 24 C112 24 120 36 118 52 L${zip ? "101 68 L99 68" : "100 70"} Z`} />
    <Lines p={p} d={["M78 42 Q86 58 100 72", "M122 42 Q114 58 100 72"]} />
    <g fill={p.shade} stroke={p.edge} strokeWidth="1"><circle cx="92" cy="62" r="2" /><circle cx="108" cy="62" r="2" /></g>
    <Lines p={p} d={["M92 63 Q90.5 80 90 96", "M108 63 Q109.5 80 110 96"]} />
    <g fill={p.edge}><rect x="88.5" y="95" width="3" height="7" rx="1" /><rect x="108.5" y="95" width="3" height="7" rx="1" /></g>
  </>
);
const HOOD_OUTER = "M70 50 C58 30 64 6 100 6 C136 6 142 30 130 50 Z";
const HOOD_BACK = "M68 56 C56 30 64 4 100 4 C136 4 144 30 132 56 Q100 64 68 56 Z";
/** Zip down the centre front, with teeth and a puller. */
const zipLine = (top: number): Part => (p) => (
  <>
    <path d={`M100 ${top} V206`} stroke={p.edge} strokeWidth="3.2" />
    <path d={`M100 ${top} V206`} stroke={p.cloth} strokeWidth="1.4" strokeDasharray="1.2 1.4" />
    <rect x="98" y={top + 2} width="4" height="10" rx="1" fill={p.edge} />
  </>
);
/** Stand-up collar (fleece, softshell); `top` is how high it stands. */
const standCollar = (top: number): Part => (p) => (
  <>
    <Outline fill={p.cloth} d={`M76 44 L77 ${top} Q100 ${top - 6} 123 ${top} L124 44 Q100 54 76 44 Z`} />
    <Piece p={p} fill={p.shade} d={`M77 ${top} Q100 ${top + 6} 123 ${top} Q100 ${top - 6} 77 ${top} Z`} />
  </>
);
const standCollarBack = (top: number): Part => (p) => (
  <>
    <Outline fill={p.cloth} d={`M76 44 L77 ${top} Q100 ${top - 4} 123 ${top} L124 44 Q100 50 76 44 Z`} />
    <Seams p={p} d={[`M78 ${top + 5} Q100 ${top + 1} 122 ${top + 5}`]} />
  </>
);
const zipPocket = (d: string, pull: [number, number]): Part => (p) => (
  <>
    <path d={d} stroke={p.edge} strokeWidth="2.4" strokeLinecap="round" fill="none" />
    <rect x={pull[0] - 1.5} y={pull[1]} width="3" height="7" rx="1" fill={p.edge} />
  </>
);

// ---- position boxes ---------------------------------------------------------------------------------------------
const CHEST = { "left-chest": { x: 112, y: 76, w: 32, h: 26 }, "right-chest": { x: 56, y: 76, w: 32, h: 26 } };
const BACK = { back: { x: 56, y: 82, w: 88, h: 62 } };
const BACK_HOOD = { back: { x: 56, y: 90, w: 88, h: 60 } };
const SLEEVE_SHORT = { sleeve: { x: 155, y: 80, w: 16, h: 14 } };
const SLEEVE_LONG = { sleeve: { x: 150, y: 104, w: 16, h: 16 } };

const SPECS: Record<GarmentKind, Spec> = {
  tee: {
    front: (p) => <><Outline fill={p.cloth} d={shortBody(76)} />{crew(86)(p)}<Seams p={p} d={[...ARMHOLE_SHORT, ...SLEEVE_HEM_STITCH, HEM_STITCH]} /></>,
    back: (p) => <><Outline fill={p.cloth} d={shortBody(50)} />{crewBack(p)}<Seams p={p} d={[...ARMHOLE_SHORT, ...SLEEVE_HEM_STITCH, HEM_STITCH]} /></>,
    boxes: { ...CHEST, ...SLEEVE_SHORT }, backBoxes: BACK,
  },
  polo: {
    front: (p) => <><Outline fill={p.cloth} d={shortBody(60)} />{ribSleeveBands(p)}{poloCollar(p)}<Seams p={p} d={[...ARMHOLE_SHORT, HEM_STITCH]} /></>,
    back: (p) => <><Outline fill={p.cloth} d={shortBody(50)} />{ribSleeveBands(p)}{poloCollarBack(p)}<Seams p={p} d={[...ARMHOLE_SHORT, HEM_STITCH]} /></>,
    boxes: { ...CHEST, ...SLEEVE_SHORT }, backBoxes: BACK,
  },
  "polo-long": {
    front: (p) => <><Outline fill={p.cloth} d={longBody(60)} />{RibCuffs(p)}{poloCollar(p)}<Seams p={p} d={[...ARMHOLE_LONG, HEM_STITCH]} /></>,
    back: (p) => <><Outline fill={p.cloth} d={longBody(50)} />{RibCuffs(p)}{poloCollarBack(p)}<Seams p={p} d={[...ARMHOLE_LONG, HEM_STITCH]} /></>,
    boxes: { ...CHEST, ...SLEEVE_LONG }, backBoxes: BACK,
  },
  sweat: {
    front: (p) => <><Outline fill={p.cloth} d={longBody(76)} />{RibCuffs(p)}{RibHem(p)}{crew(92)(p)}<Seams p={p} d={ARMHOLE_LONG} /></>,
    back: (p) => <><Outline fill={p.cloth} d={longBody(50)} />{RibCuffs(p)}{RibHem(p)}{crewBack(p)}<Seams p={p} d={ARMHOLE_LONG} /></>,
    boxes: { ...CHEST, ...SLEEVE_LONG }, backBoxes: BACK,
  },
  hoodie: {
    front: (p) => <>
      <Outline fill={p.cloth} d={HOOD_OUTER} /><Outline fill={p.cloth} d={longBody(76)} />{RibCuffs(p)}{RibHem(p)}
      <Piece p={p} d="M62 152 L74 132 H126 L138 152 V190 H62 Z" /><Seams p={p} d={["M66.5 152 L77 135.5", "M133.5 152 L123 135.5", ...ARMHOLE_LONG]} />
      {hoodFront(false)(p)}
    </>,
    back: (p) => <><Outline fill={p.cloth} d={longBody(50)} />{RibCuffs(p)}{RibHem(p)}<Outline fill={p.cloth} d={HOOD_BACK} /><Seams p={p} d={["M100 6 V59", ...ARMHOLE_LONG]} /></>,
    boxes: { ...CHEST, ...SLEEVE_LONG }, backBoxes: BACK_HOOD,
  },
  zip: {
    front: (p) => <>
      <Outline fill={p.cloth} d={HOOD_OUTER} /><Outline fill={p.cloth} d={longBody(76)} />{RibCuffs(p)}{RibHem(p)}
      <Piece p={p} d="M60 152 L72 134 H96 V190 H60 Z" /><Piece p={p} d="M140 152 L128 134 H104 V190 H140 Z" />
      <Seams p={p} d={["M64.5 152 L75 137", "M135.5 152 L125 137", ...ARMHOLE_LONG]} />
      {hoodFront(true)(p)}{zipLine(68)(p)}
    </>,
    back: (p) => <><Outline fill={p.cloth} d={longBody(50)} />{RibCuffs(p)}{RibHem(p)}<Outline fill={p.cloth} d={HOOD_BACK} /><Seams p={p} d={["M100 6 V59", ...ARMHOLE_LONG]} /></>,
    boxes: { ...CHEST, ...SLEEVE_LONG }, backBoxes: BACK_HOOD,
  },
  fleece: {
    front: (p) => <>
      <Outline fill={p.cloth} d={longBody(56)} />{BoundCuffs(p)}<Piece p={p} d="M54 199 H146 V206 H54 Z" />
      <Lines p={{ ...p, edge: INK }} d={["M62 206 V212", "M138 206 V212"]} /><g fill={p.edge} stroke={INK} strokeWidth="1"><rect x="59" y="211" width="6" height="6" rx="1.5" /><rect x="135" y="211" width="6" height="6" rx="1.5" /></g>
      <Seams p={p} d={[...ARMHOLE_LONG, "M14 186 L38 187.5", "M186 186 L162 187.5"]} />
      {zipPocket("M62 148 L66 184", [66, 182])(p)}{zipPocket("M138 148 L134 184", [134, 182])(p)}
      {standCollar(30)(p)}{zipLine(30)(p)}
    </>,
    back: (p) => <><Outline fill={p.cloth} d={longBody(50)} />{BoundCuffs(p)}<Piece p={p} d="M54 199 H146 V206 H54 Z" />{standCollarBack(32)(p)}<Seams p={p} d={ARMHOLE_LONG} /></>,
    boxes: { ...CHEST, ...SLEEVE_LONG }, backBoxes: BACK,
  },
  softshell: {
    front: (p) => <>
      <Outline fill={p.cloth} d={longBody(56)} />{BoundCuffs(p)}
      <Piece p={p} d="M26 186 L38 187 L37.4 193 L25 192 Z" /><Piece p={p} d="M174 186 L162 187 L162.6 193 L175 192 Z" />
      <Seams p={p} d={[...ARMHOLE_LONG, "M58 64 Q70 120 64 206", "M142 64 Q130 120 136 206", "M56 200 H144"]} />
      {zipPocket("M60 176 L78 152", [77, 152])(p)}{zipPocket("M140 176 L122 152", [123, 152])(p)}
      {standCollar(24)(p)}{zipLine(24)(p)}
    </>,
    back: (p) => <><Outline fill={p.cloth} d={longBody(50)} />{BoundCuffs(p)}{standCollarBack(26)(p)}<Seams p={p} d={[...ARMHOLE_LONG, "M48 74 Q100 80 152 74", "M56 200 H144"]} /></>,
    boxes: { ...CHEST, ...SLEEVE_LONG }, backBoxes: BACK,
  },
  vest: {
    front: (p) => <>
      <Outline fill={p.cloth} d="M80 40 L60 46 C62 76 56 94 44 104 L46 206 H154 L156 104 C144 94 138 76 140 46 L120 40 L100 92 Z" />
      <Piece p={p} fill={p.shade} d="M80 40 Q100 48 120 40 L100 92 Z" />
      <Seams p={p} d={["M83.5 42.5 L100 84 L116.5 42.5", "M64 48 C66 76 61 96 50 106", "M136 48 C134 76 139 96 150 106"]} />
      <path d="M100 92 V206" stroke={INK} strokeWidth="1.5" />
      <g fill={TAPE} stroke={INK} strokeWidth="1"><rect x="64" y="45" width="11" height="75" /><rect x="125" y="45" width="11" height="75" /><rect x="44.6" y="120" width="110.8" height="12" /><rect x="45.3" y="162" width="109.4" height="12" /></g>
    </>,
    back: (p) => <>
      <Outline fill={p.cloth} d="M80 40 L60 46 C62 76 56 94 44 104 L46 206 H154 L156 104 C144 94 138 76 140 46 L120 40 Q100 48 80 40 Z" />
      <Seams p={p} d={["M82 43.5 Q100 51 118 43.5", "M64 48 C66 76 61 96 50 106", "M136 48 C134 76 139 96 150 106"]} />
      <g fill={TAPE} stroke={INK} strokeWidth="1"><rect x="64" y="45" width="11" height="75" /><rect x="125" y="45" width="11" height="75" /><rect x="44.6" y="120" width="110.8" height="12" /><rect x="45.3" y="162" width="109.4" height="12" /></g>
    </>,
    boxes: { "left-chest": { x: 103, y: 96, w: 20, h: 18 } }, backBoxes: { back: { x: 50, y: 137, w: 100, h: 20 } },
  },
  cap: {
    front: (p) => <>
      <Outline fill={p.cloth} d="M38 138 C36 76 66 52 100 52 C134 52 164 76 162 138 Z" />
      <Seams p={p} d={["M100 54 V136", "M99 53 C78 58 66 86 62 138", "M101 53 C122 58 134 86 138 138"]} />
      <g fill={p.shade} stroke={p.edge} strokeWidth="1"><circle cx="74" cy="80" r="2" /><circle cx="126" cy="80" r="2" /></g>
      <Outline fill={p.cloth} d="M36 134 Q100 120 164 134 Q160 166 100 172 Q40 166 36 134 Z" />
      <Seams p={p} d={["M44 140 Q100 128 156 140", "M48 148 Q100 138 152 148", "M54 156 Q100 148 146 156"]} />
      <circle cx="100" cy="52" r="4" fill={p.cloth} stroke={INK} strokeWidth="1.5" />
    </>,
    boxes: { front: { x: 70, y: 82, w: 60, h: 36 }, side: { x: 139, y: 104, w: 16, h: 14 } },
  },
  beanie: {
    front: (p) => <>
      <Outline fill={p.cloth} d="M50 134 C48 66 72 40 100 40 C128 40 152 66 150 134 Z" />
      <Seams p={p} d={["M100 42 V130", "M84 44 Q74 80 72 130", "M116 44 Q126 80 128 130", "M70 54 Q60 90 60 130", "M130 54 Q140 90 140 130"]} />
      <Outline fill={p.cloth} d="M42 128 Q100 120 158 128 L156 178 Q100 186 44 178 Z" />
      <Lines p={{ ...p, edge: p.seam }} w={1} d={Array.from({ length: 13 }, (_, i) => { const x = 50 + i * 8.3; return `M${x} 129 V176`; })} />
    </>,
    boxes: { front: { x: 72, y: 136, w: 56, h: 32 } },
  },
  apron: {
    front: (p) => <>
      <path d="M75 36 C72 4 128 4 125 36" fill="none" stroke={INK} strokeWidth="7" strokeLinecap="round" />
      <path d="M75 36 C72 4 128 4 125 36" fill="none" stroke={p.cloth} strokeWidth="4" strokeLinecap="round" />
      {["M32 106 C20 108 12 116 8 132", "M32 112 C24 122 22 136 22 150", "M168 106 C180 108 188 116 192 132", "M168 112 C176 122 178 136 178 150"].map((d) => (
        <g key={d}><path d={d} fill="none" stroke={INK} strokeWidth="7" strokeLinecap="round" /><path d={d} fill="none" stroke={p.cloth} strokeWidth="4" strokeLinecap="round" /></g>
      ))}
      <Outline fill={p.cloth} d="M70 34 H130 Q132 86 170 102 V208 H30 V102 Q68 86 70 34 Z" />
      <Piece p={p} d="M62 142 H138 V180 H62 Z" />
      <Seams p={p} d={["M73 40 H127", "M62 147 H138", "M100 147 V180", "M34 201 H166", "M36 106 V201", "M164 106 V201"]} />
    </>,
    boxes: { bib: { x: 78, y: 54, w: 44, h: 32 }, hem: { x: 134, y: 184, w: 26, h: 18 } },
  },
};

// ---- logo placement ---------------------------------------------------------------------------------------------
/** Split text into `n` lines of roughly even length, breaking at spaces. */
function wrap(text: string, n: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  if (n <= 1 || words.length < 2) return [text];
  const target = text.length / n;
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    if (cur && (cur.length + 1 + w.length > target * 1.15) && lines.length < n - 1) { lines.push(cur); cur = w; } else cur = cur ? `${cur} ${w}` : w;
  }
  lines.push(cur);
  return lines;
}

/** A typed name, sized to the box on up to three lines and never below `min` (viewBox units, about 10px on a card). */
function LogoText({ box, text, fill, min = 10 }: { box: Box; text: string; fill: string; min?: number }) {
  const EM = 0.74; // average advance of Archivo Black capitals
  let best = { lines: [text], size: 0 };
  for (let n = 1; n <= 3; n++) {
    const lines = wrap(text, n);
    const longest = Math.max(...lines.map((l) => l.length), 2);
    const size = Math.min((box.h - 2) / (lines.length * 1.08), (box.w - 3) / (longest * EM));
    if (lines.some((l) => l.length < 2)) continue; // never strand "&" or an initial on its own line
    if (size > best.size * 1.15) best = { lines, size };
  }
  const size = Math.max(min, Math.min(best.size, box.h * 0.62));
  const lh = size * 1.02;
  const top = box.y + box.h / 2 - ((best.lines.length - 1) * lh) / 2;
  return (
    <g fill={fill} fontFamily="Archivo Black, Archivo, Arial, sans-serif" fontSize={size} textAnchor="middle">
      {best.lines.map((l, i) => {
        const natural = l.length * EM * size;
        const squeeze = natural > box.w - 2 ? { textLength: box.w - 2, lengthAdjust: "spacingAndGlyphs" as const } : {};
        return <text key={i} x={box.x + box.w / 2} y={top + i * lh} dominantBaseline="central" {...squeeze}>{l}</text>;
      })}
    </g>
  );
}

function LogoIn({ box, logo, fill }: { box: Box; logo: Logo; fill: string }) {
  if (logo.kind === "image") return <image href={logo.dataUrl} x={box.x + 1} y={box.y + 1} width={box.w - 2} height={box.h - 2} preserveAspectRatio="xMidYMid meet" />;
  return <LogoText box={box} text={logo.text.trim().slice(0, 24).toUpperCase() || "YOUR LOGO"} fill={fill} />;
}

export function Garment({ kind, colour, positions = [], logo = null, view = "front", title, className = "" }: {
  kind: GarmentKind; colour: string; positions?: PositionId[]; logo?: Logo | null; view?: "front" | "back"; title: string; className?: string;
}) {
  const s = SPECS[kind];
  const isBack = view === "back" && Boolean(s.back);
  const p = palette(colour);
  const boxes = (isBack ? s.backBoxes ?? {} : s.boxes) as Partial<Record<PositionId, Box>>;
  // The position marker must read on the cloth: orange on dark cloth, ink (on a paper underlay) on light, red or orange cloth.
  const mark = !isLight(colour) && contrast(ORANGE, colour) >= 3 ? ORANGE : INK;
  const textFill = isLight(colour) ? INK : PAPER;
  const active = positions.filter((x) => boxes[x]);
  const label = `${title} in ${isBack ? "back" : "front"} view${active.length ? `, logo at ${active.join(", ").replace(/-/g, " ")}` : ""}`;
  return (
    <svg viewBox="0 0 200 220" role="img" aria-label={label} className={className}>
      {(isBack ? s.back! : s.front)(p)}
      {active.map((x) => { const b = boxes[x]!; const cx = b.x + b.w / 2, cy = b.y + b.h / 2; return (
        <g key={x}>
          {mark === INK && <rect x={b.x} y={b.y} width={b.w} height={b.h} fill="none" stroke={PAPER} strokeWidth="3.5" />}
          <rect x={b.x} y={b.y} width={b.w} height={b.h} fill="none" stroke={mark} strokeWidth="1.5" strokeDasharray="4 3" />
          {logo ? <LogoIn box={b} logo={logo} fill={textFill} /> : (
            <>{mark === INK && <path d={`M${cx - 5} ${cy}h10M${cx} ${cy - 5}v10`} stroke={PAPER} strokeWidth="3.5" />}<path d={`M${cx - 5} ${cy}h10M${cx} ${cy - 5}v10`} stroke={mark} strokeWidth="1.5" /></>
          )}
        </g>
      ); })}
    </svg>
  );
}

export const hasBack = (kind: GarmentKind) => Boolean(SPECS[kind].back);
