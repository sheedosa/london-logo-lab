import { createContext, useContext, useState, type ReactNode } from "react";
import { store, type Method, type PositionId } from "./store";

// The quote the visitor is building, remembered on this device. At launch the same object is what gets sent
// to the workshop (and could be saved against a customer account for re-orders).
export type Logo = { kind: "image"; dataUrl: string; name: string } | { kind: "text"; text: string };
export type Quote = {
  garment: string;
  colour: string;
  qty: number;
  method: Method;
  positions: PositionId[];
  logo: Logo | null;
  contact: { name: string; org: string; email: string; notes: string };
};

export const BANDS = [
  { min: 1, max: 9, label: "1 to 9" },
  { min: 10, max: 24, label: "10 to 24" },
  { min: 25, max: 49, label: "25 to 49" },
  { min: 50, max: Infinity, label: "50+" },
] as const;
export type Band = (typeof BANDS)[number];
export const bandFor = (qty: number): Band => BANDS.find((b) => qty >= b.min && qty <= b.max) ?? BANDS[0];

// SAMPLE pricing formula. Every figure here and in garments.json is illustrative and is replaced by the workshop's
// price list at launch. Per item = garment base x garment band factor + each position's decoration cost x that
// decoration's band factor (screen print falls fastest with quantity, DTF and vinyl stay nearly flat).
const GARMENT_BANDS = [1, 0.92, 0.85, 0.8];
const isLarge = (p: PositionId) => p === "back";

export function estimate(q: Pick<Quote, "garment" | "qty" | "method" | "positions">) {
  const g = store.garment(q.garment);
  if (!g) return null;
  const band = bandFor(q.qty);
  const i = BANDS.indexOf(band);
  const m = store.method(q.method).sample;
  const garment = g.sampleBase * GARMENT_BANDS[i];
  const decoration = q.positions.reduce((s, p) => s + (isLarge(p) ? m.large : m.small) * m.bands[i], 0);
  const perItem = garment + decoration;
  return { perItem, total: perItem * q.qty, band, decoration, garment };
}
export const gbp = (n: number) => `£${n.toFixed(2)}`;

export const DEFAULT_QUOTE: Quote = {
  garment: "classic-polo", colour: "Navy", qty: 12, method: "embroidery", positions: ["left-chest"], logo: null,
  contact: { name: "", org: "", email: "", notes: "" },
};

const KEY = "logolab-quote";
const MAX_PERSISTED_LOGO = 400_000; // characters of data URL; bigger logos stay in memory only

type Ctx = { quote: Quote; saved: boolean; update: (patch: Partial<Quote>) => void; reset: () => void };
const QuoteContext = createContext<Ctx>({ quote: DEFAULT_QUOTE, saved: false, update: () => {}, reset: () => {} });

function sanitise(q: Quote): Quote {
  const g = store.garment(q.garment);
  if (!g) return DEFAULT_QUOTE;
  const colour = g.colours.some((c) => c.name === q.colour) ? q.colour : g.colours[0].name;
  // Older saved quotes may carry "print" or "both"; anything the garment does not take falls back to its first method.
  const method: Method = g.methods.includes(q.method) ? q.method : g.methods[0];
  const allowed = store.positionsFor(g, method);
  const positions = (Array.isArray(q.positions) ? q.positions : []).filter((p) => allowed.includes(p));
  const logo = q.logo && (q.logo.kind === "text" ? typeof q.logo.text === "string" : typeof q.logo.dataUrl === "string") ? q.logo : null;
  const contact = { ...DEFAULT_QUOTE.contact, ...(q.contact ?? {}) };
  return { ...q, colour, method, logo, contact, positions: positions.length ? positions : [allowed[0]], qty: Math.max(1, Math.min(5000, Math.round(q.qty) || 1)) };
}

export function QuoteProvider({ children }: { children: ReactNode }) {
  // `saved` is true once the visitor has made a choice (now or on an earlier visit); the header strip keys off it.
  const [state, set] = useState<{ quote: Quote; saved: boolean }>(() => {
    try { const v = localStorage.getItem(KEY); return v ? { quote: sanitise({ ...DEFAULT_QUOTE, ...(JSON.parse(v) as Partial<Quote>) }), saved: true } : { quote: DEFAULT_QUOTE, saved: false }; } catch { return { quote: DEFAULT_QUOTE, saved: false }; }
  });
  const quote = state.quote;
  const persist = (q: Quote) => {
    try {
      const logo = q.logo?.kind === "image" && q.logo.dataUrl.length > MAX_PERSISTED_LOGO ? null : q.logo;
      localStorage.setItem(KEY, JSON.stringify({ ...q, logo }));
    } catch { /* private mode or quota: the quote lives in memory for this visit */ }
  };
  const update = (patch: Partial<Quote>) => set((prev) => { const next = sanitise({ ...prev.quote, ...patch }); persist(next); return { quote: next, saved: true }; });
  const reset = () => { set({ quote: DEFAULT_QUOTE, saved: false }); try { localStorage.removeItem(KEY); } catch { /* ignore */ } };
  return <QuoteContext.Provider value={{ quote, saved: state.saved, update, reset }}>{children}</QuoteContext.Provider>;
}

export const useQuote = () => useContext(QuoteContext);

/** Plain-text summary the visitor can copy, and what gets sent at launch. */
export function summary(q: Quote): string {
  const g = store.garment(q.garment);
  const e = estimate(q);
  if (!g || !e) return "";
  const lines = [
    "Quote request: The London Logo Lab",
    `Garment: ${g.title} in ${q.colour}`,
    `Quantity: ${q.qty} (band ${e.band.label})`,
    `Decoration: ${store.method(q.method).label}`,
    `Positions: ${q.positions.map((p) => store.position(p).label).join(", ")}`,
    `Artwork: ${q.logo ? (q.logo.kind === "image" ? `file attached (${q.logo.name})` : `text "${q.logo.text}"`) : "to follow"}`,
    `Sample estimate: from ${gbp(e.perItem)} per item, ${gbp(e.total)} for ${q.qty} (sample formula, not a price)`,
  ];
  if (q.contact.name || q.contact.org || q.contact.email) lines.push(`From: ${[q.contact.name, q.contact.org, q.contact.email].filter(Boolean).join(", ")}`);
  if (q.contact.notes) lines.push(`Notes: ${q.contact.notes}`);
  return lines.join("\n");
}
