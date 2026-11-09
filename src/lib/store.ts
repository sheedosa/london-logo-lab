// All garment, decoration and pricing data goes through this module. Preview mode reads garments.json; at launch
// the same interface can be backed by the group's Shopify store or the workshop's own price list.
import data from "../data/garments.json";

export type Method = "embroidery" | "screen" | "dtf" | "vinyl";
export type GarmentKind = "polo" | "polo-long" | "tee" | "sweat" | "hoodie" | "zip" | "fleece" | "softshell" | "vest" | "cap" | "beanie" | "apron";
export type PositionId = "left-chest" | "right-chest" | "back" | "sleeve" | "front" | "side" | "bib" | "hem";
export type Colour = { name: string; hex: string };
export type Garment = {
  handle: string;
  title: string;
  kind: GarmentKind;
  category: string;
  badge?: string;
  blurb: string;
  details: string;
  sizes: string;
  methods: Method[];
  positions: PositionId[];
  sampleBase: number; // SAMPLE figure for the preview formula only
  colours: Colour[];
};
export type Category = { handle: string; title: string; blurb: string };
export type Position = { id: PositionId; label: string; size: string };
/** A decoration method. `sample` feeds the preview formula only: per-position cost and a factor per quantity band. */
export type MethodInfo = { id: Method; label: string; line: string; positions: PositionId[]; sample: { small: number; large: number; bands: number[] } };

const d = data as unknown as { categories: Category[]; methods: MethodInfo[]; positions: Position[]; garments: Garment[] };

export const store = {
  categories: (): Category[] => d.categories,
  category: (handle: string) => d.categories.find((c) => c.handle === handle),
  garments: (f: { category?: string; method?: Method | null } = {}): Garment[] =>
    d.garments.filter((g) => (!f.category || f.category === "all" || g.category === f.category) && (!f.method || g.methods.includes(f.method))),
  garment: (handle: string) => d.garments.find((g) => g.handle === handle),
  positions: (): Position[] => d.positions,
  position: (id: PositionId) => d.positions.find((p) => p.id === id)!,
  methods: (): MethodInfo[] => d.methods,
  method: (id: Method) => d.methods.find((m) => m.id === id)!,
  /** Positions this garment offers for this decoration. */
  positionsFor: (g: Garment, m: Method): PositionId[] => g.positions.filter((p) => d.methods.find((x) => x.id === m)?.positions.includes(p)),
};

export const methodLabel = (m: Method) => store.method(m).label;
/** "Embroidery, screen print, DTF or vinyl" */
export const methodList = (ms: Method[]) =>
  ms.map((m, i) => (i === 0 || m === "dtf" ? methodLabel(m) : methodLabel(m).toLowerCase())).join(", ").replace(/, ([^,]*)$/, " or $1");
