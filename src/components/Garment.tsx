import type { GarmentKind, PositionId } from "../lib/store";
import type { Logo } from "../lib/quote";

// Flat garment drawings. One 200 x 220 viewBox for every kind so cards and the quote builder line up.
// `colour` fills the cloth; `positions` draws the decoration boxes; `logo` is placed inside each active box.
// Wearer's left is the viewer's right on the front view.

type Box = { x: number; y: number; w: number; h: number };
type Spec = { front: string; back?: string; details: string[]; backDetails?: string[]; boxes: Partial<Record<PositionId, Box>>; backBoxes?: Partial<Record<PositionId, Box>> };

const INK = "#1b1916", PAPER = "#f3eee4", ORANGE = "#f4651f", TAPE = "#c9ccd1";
const TEE = "M70 48 C80 62 120 62 130 48 L165 62 L182 112 L152 120 L150 205 L50 205 L48 120 L18 112 L35 62 Z";
const LONG = "M70 48 C80 62 120 62 130 48 L165 60 L188 150 L158 158 L152 122 L150 205 L50 205 L48 122 L42 158 L12 150 L35 60 Z";
const BACK_NECK = "M70 48 C80 54 120 54 130 48";
const CHEST = { "left-chest": { x: 110, y: 90, w: 32, h: 26 }, "right-chest": { x: 58, y: 90, w: 32, h: 26 } };
const BACK = { back: { x: 55, y: 90, w: 90, h: 60 } };
const SLEEVE_SHORT = { sleeve: { x: 156, y: 76, w: 20, h: 18 } };
const SLEEVE_LONG = { sleeve: { x: 160, y: 98, w: 20, h: 18 } };

const SPECS: Record<GarmentKind, Spec> = {
  tee: { front: TEE, back: TEE, details: ["M48 120 L58 64", "M152 120 L142 64", "M50 196 H150"], backDetails: [BACK_NECK, "M48 120 L58 64", "M152 120 L142 64"], boxes: { ...CHEST, ...SLEEVE_SHORT }, backBoxes: BACK },
  polo: { front: TEE, back: TEE, details: ["M48 120 L58 64", "M152 120 L142 64", "M72 50 L90 54 L100 76 L110 54 L128 50", "M96 76 V102 H104 V76", "M50 196 H150"], backDetails: [BACK_NECK, "M48 120 L58 64", "M152 120 L142 64"], boxes: { ...CHEST, ...SLEEVE_SHORT }, backBoxes: BACK },
  sweat: { front: LONG, back: LONG, details: ["M48 122 L60 62", "M152 122 L140 62", "M50 194 H150", "M14 142 L44 150", "M186 142 L156 150", "M66 52 C74 68 126 68 134 52"], backDetails: [BACK_NECK, "M48 122 L60 62", "M152 122 L140 62", "M50 194 H150"], boxes: { ...CHEST, ...SLEEVE_LONG }, backBoxes: BACK },
  hoodie: { front: LONG, back: LONG, details: ["M66 52 C60 18 140 18 134 52", "M78 56 C78 36 122 36 122 56", "M94 60 V84", "M106 60 V84", "M62 150 L72 136 H128 L138 150 V190 H62 Z", "M48 122 L60 62", "M152 122 L140 62", "M50 194 H150", "M14 142 L44 150", "M186 142 L156 150"], backDetails: ["M66 52 C60 18 140 18 134 52", "M48 122 L60 62", "M152 122 L140 62", "M50 194 H150"], boxes: { ...CHEST, ...SLEEVE_LONG }, backBoxes: BACK },
  zip: { front: LONG, back: LONG, details: ["M66 52 C60 18 140 18 134 52", "M78 56 C78 36 122 36 122 56", "M98 58 V205", "M102 58 V205", "M62 150 L72 136 V190 H62 Z", "M138 150 L128 136 V190 H138 Z", "M48 122 L60 62", "M152 122 L140 62", "M14 142 L44 150", "M186 142 L156 150"], backDetails: ["M66 52 C60 18 140 18 134 52", "M48 122 L60 62", "M152 122 L140 62", "M50 194 H150"], boxes: { ...CHEST, ...SLEEVE_LONG }, backBoxes: BACK },
  fleece: { front: "M78 40 H122 L130 50 L165 60 L188 150 L158 158 L152 122 L150 205 L50 205 L48 122 L42 158 L12 150 L35 60 L70 50 Z", back: LONG, details: ["M78 40 L70 50", "M122 40 L130 50", "M98 50 V205", "M102 50 V205", "M62 160 L62 190", "M138 160 L138 190", "M48 122 L60 62", "M152 122 L140 62", "M14 142 L44 150", "M186 142 L156 150"], backDetails: [BACK_NECK, "M48 122 L60 62", "M152 122 L140 62"], boxes: { ...CHEST, ...SLEEVE_LONG }, backBoxes: BACK },
  softshell: { front: "M76 34 H124 L132 50 L165 60 L188 150 L158 158 L152 122 L150 205 L50 205 L48 122 L42 158 L12 150 L35 60 L68 50 Z", back: LONG, details: ["M76 34 L68 50", "M124 34 L132 50", "M98 50 V205", "M102 50 V205", "M60 168 L72 156", "M140 168 L128 156", "M48 122 L60 62", "M152 122 L140 62", "M14 142 L44 150", "M186 142 L156 150", "M50 196 H150"], backDetails: [BACK_NECK, "M48 122 L60 62", "M152 122 L140 62", "M30 120 H170"], boxes: { ...CHEST, ...SLEEVE_LONG }, backBoxes: BACK },
  vest: { front: "M72 44 C80 64 120 64 128 44 L150 52 L158 110 L152 205 H48 L42 110 L50 52 Z", back: "M72 44 C80 50 120 50 128 44 L150 52 L158 110 L152 205 H48 L42 110 L50 52 Z", details: ["M98 64 V205", "M102 64 V205"], backDetails: [], boxes: { "left-chest": { x: 108, y: 86, w: 30, h: 22 } }, backBoxes: { back: { x: 56, y: 140, w: 88, h: 18 } } },
  cap: { front: "M40 118 C40 56 160 56 160 118 Z", details: ["M100 62 V118", "M66 70 C60 90 58 104 58 118", "M134 70 C140 90 142 104 142 118", "M28 120 C28 142 172 142 172 120 L160 118 C150 130 50 130 40 118 Z"], boxes: { front: { x: 76, y: 76, w: 48, h: 32 }, side: { x: 132, y: 92, w: 22, h: 16 } } },
  beanie: { front: "M45 130 C45 50 155 50 155 130 Z", details: ["M40 130 H160 V166 H40 Z", "M56 130 V166", "M72 130 V166", "M128 130 V166", "M144 130 V166", "M100 56 V130"], boxes: { front: { x: 78, y: 136, w: 44, h: 24 } } },
  apron: { front: "M70 30 H130 V96 L172 106 V210 H28 V106 L70 96 Z", details: ["M70 30 C70 8 130 8 130 30", "M28 106 L8 116", "M172 106 L192 116", "M72 134 H128 V170 H72 Z", "M100 134 V170"], boxes: { bib: { x: 78, y: 48, w: 44, h: 30 }, hem: { x: 136, y: 178, w: 26, h: 20 } } },
};

function luminance(hex: string) {
  const n = parseInt(hex.slice(1), 16); const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

function LogoIn({ box, logo, onLight }: { box: Box; logo: Logo; onLight: boolean }) {
  if (logo.kind === "image") return <image href={logo.dataUrl} x={box.x + 1} y={box.y + 1} width={box.w - 2} height={box.h - 2} preserveAspectRatio="xMidYMid meet" />;
  const text = logo.text.trim().slice(0, 24) || "Your logo";
  const size = Math.max(4, Math.min(box.h * 0.55, (box.w * 1.7) / Math.max(text.length, 3)));
  return <text x={box.x + box.w / 2} y={box.y + box.h / 2} fontFamily="Archivo Black, Archivo, Arial, sans-serif" fontSize={size} textAnchor="middle" dominantBaseline="central" fill={onLight ? INK : PAPER}>{text}</text>;
}

export function Garment({ kind, colour, positions = [], logo = null, view = "front", title, className = "" }: {
  kind: GarmentKind; colour: string; positions?: PositionId[]; logo?: Logo | null; view?: "front" | "back"; title: string; className?: string;
}) {
  const s = SPECS[kind];
  const isBack = view === "back" && s.back;
  const body = isBack ? s.back! : s.front;
  const details = isBack ? s.backDetails ?? [] : s.details;
  const boxes = (isBack ? s.backBoxes ?? {} : s.boxes) as Partial<Record<PositionId, Box>>;
  const onLight = luminance(colour) > 0.6;
  const seam = onLight ? INK : PAPER;
  const active = positions.filter((p) => boxes[p]);
  const label = `${title} in ${view === "back" ? "back" : "front"} view${active.length ? `, logo at ${active.join(", ").replace(/-/g, " ")}` : ""}`;
  return (
    <svg viewBox="0 0 200 220" role="img" aria-label={label} className={className}>
      <path d={body} fill={colour} stroke={INK} strokeWidth="1.5" strokeLinejoin="round" />
      {kind === "vest" && (
        <g fill={TAPE} stroke={INK} strokeWidth="1">
          <rect x="44" y="118" width="112" height="12" /><rect x="44" y="162" width="112" height="12" />
          <rect x="60" y="52" width="12" height="66" /><rect x="128" y="52" width="12" height="66" />
        </g>
      )}
      <g fill="none" stroke={seam} strokeWidth="1.5" strokeOpacity="0.55" strokeLinecap="round" strokeLinejoin="round">{details.map((d, i) => <path key={i} d={d} />)}</g>
      {kind === "polo" && !isBack && <g fill={seam} fillOpacity="0.7"><circle cx="100" cy="84" r="1.6" /><circle cx="100" cy="92" r="1.6" /><circle cx="100" cy="100" r="1.6" /></g>}
      {kind === "cap" && <circle cx="100" cy="60" r="3" fill={colour} stroke={INK} strokeWidth="1.5" />}
      {active.map((p) => { const b = boxes[p]!; return (
        <g key={p}>
          <rect x={b.x} y={b.y} width={b.w} height={b.h} fill={logo ? "none" : ORANGE} fillOpacity={logo ? 0 : 0.18} stroke={ORANGE} strokeWidth="1.5" strokeDasharray="4 3" />
          {logo ? <LogoIn box={b} logo={logo} onLight={onLight} /> : <path d={`M${b.x + b.w / 2 - 5} ${b.y + b.h / 2}h10M${b.x + b.w / 2} ${b.y + b.h / 2 - 5}v10`} stroke={ORANGE} strokeWidth="1.5" />}
        </g>
      ); })}
    </svg>
  );
}

export const hasBack = (kind: GarmentKind) => Boolean(SPECS[kind].back);
