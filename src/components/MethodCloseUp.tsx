import { useId } from "react";
import type { Method } from "../lib/store";

// Drawn close-ups of the four decoration methods, in the same technical-flat style as the garments: one loupe,
// one letter (the foot of the marque's L), made four ways. 1.5px ink outlines, flat fills, no gradients.
const INK = "#1b1916", PAPER = "#f3eee4", STONE = "#e6dfd0", LINE = "#cfc6b4", ORANGE = "#f4651f", DEEP = "#d9530f";
const L = "M36 12 H64 V76 H110 V104 H36 Z";

const ALT: Record<Method, string> = {
  embroidery: "Close-up of embroidery: rows of satin stitch laid side by side, with a thread end",
  screen: "Close-up of a screen print: flat ink laid through the dots of the mesh, with a registration mark",
  dtf: "Close-up of a DTF transfer: a full-colour print with the clear film peeling off one corner",
  vinyl: "Close-up of cut vinyl: one solid colour with a clean cut edge and the waste lifting away",
};

function Art({ method, id }: { method: Method; id: string }) {
  if (method === "embroidery") return (
    <>
      <path d={L} fill={DEEP} />
      <g stroke={ORANGE} strokeWidth="2.5" strokeLinecap="round">
        {Array.from({ length: 23 }, (_, i) => <line key={i} x1="37.5" y1={15.2 + i * 3.9} x2="62.5" y2={13.2 + i * 3.9} />)}
        {Array.from({ length: 12 }, (_, i) => <line key={`f${i}`} x1={66.5 + i * 3.9} y1="102.5" x2={64.5 + i * 3.9} y2="77.5" />)}
      </g>
      <path d={L} fill="none" stroke={INK} strokeWidth="1.2" strokeDasharray="3 2.5" strokeLinecap="round" />
      <path d="M110 90 C122 84 118 70 128 66" fill="none" stroke={ORANGE} strokeWidth="2.5" strokeLinecap="round" />
    </>
  );
  if (method === "screen") return (
    <>
      <defs>
        <pattern id={`${id}-mesh`} width="4.4" height="4.4" patternUnits="userSpaceOnUse"><rect width="4.4" height="4.4" fill={ORANGE} /><circle cx="2.2" cy="2.2" r="0.75" fill={DEEP} /></pattern>
        <pattern id={`${id}-dots`} width="4.4" height="4.4" patternUnits="userSpaceOnUse"><circle cx="2.2" cy="2.2" r="1.5" fill={ORANGE} /></pattern>
      </defs>
      <path d={L} fill={`url(#${id}-mesh)`} />
      {/* the edge of the print, where the mesh dots have not quite joined up */}
      <path d="M110 76 H118 V104 H110 Z M36 104 H118 V110 H36 Z" fill={`url(#${id}-dots)`} />
      <g fill="none" stroke={INK} strokeWidth="1.5"><circle cx="100" cy="34" r="9" /><path d="M86 34h28M100 20v28" /></g>
    </>
  );
  if (method === "dtf") return (
    <>
      <path d={L} fill={PAPER} stroke={PAPER} strokeWidth="5" strokeLinejoin="round" />
      <clipPath id={`${id}-l`}><path d={L} /></clipPath>
      <g clipPath={`url(#${id}-l)`}>
        <rect x="30" y="8" width="90" height="100" fill={ORANGE} />
        <path d="M30 60 L70 20 L120 20 L120 50 L62 108 L30 108 Z" fill="#2b4fbf" />
        <path d="M30 96 L84 42 L120 42 L120 62 L74 108 L30 108 Z" fill="#1f4a36" />
        <circle cx="50" cy="30" r="9" fill={PAPER} />
      </g>
      {/* the clear carrier film, peeling from the top right */}
      <path d="M24 4 H96 L124 30 V112 H24 Z" fill="none" stroke={INK} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M96 4 L124 30 L100 34 Z" fill={PAPER} stroke={INK} strokeWidth="1.5" strokeLinejoin="round" />
    </>
  );
  return (
    <>
      <path d={L} fill={INK} />
      {/* the cut line the blade leaves around the letter, and the waste being weeded away */}
      <path d="M30 6 H70 V70 H116 V110 H30 Z" fill="none" stroke={INK} strokeWidth="1.2" strokeDasharray="3 2.5" />
      <path d="M70 6 H116 V70 H70 Z" fill={PAPER} stroke={INK} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M116 6 L96 26 L116 44 Z" fill={LINE} stroke={INK} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M80 62 L88 50 L92 53 Z" fill={ORANGE} stroke={INK} strokeWidth="1.5" strokeLinejoin="round" />
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
        <g transform="translate(0 14)"><Art method={method} id={id} /></g>
      </g>
      <circle cx="72" cy="72" r="68" fill="none" stroke={INK} strokeWidth="1.5" />
    </svg>
  );
}
