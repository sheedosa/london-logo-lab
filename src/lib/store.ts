// All garment and pricing data goes through this module. Preview mode reads garments.json; at launch the same
// interface can be backed by the group's Shopify store or the workshop's own price list.
import data from "../data/garments.json";

export type Method = "embroidery" | "print";
export type GarmentKind = "polo" | "tee" | "sweat" | "hoodie" | "zip" | "fleece" | "softshell" | "vest" | "cap" | "beanie" | "apron";
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

const d = data as unknown as { categories: Category[]; positions: Position[]; garments: Garment[] };

export const store = {
  categories: (): Category[] => d.categories,
  category: (handle: string) => d.categories.find((c) => c.handle === handle),
  garments: (f: { category?: string; method?: Method | null } = {}): Garment[] =>
    d.garments.filter((g) => (!f.category || f.category === "all" || g.category === f.category) && (!f.method || g.methods.includes(f.method))),
  garment: (handle: string) => d.garments.find((g) => g.handle === handle),
  positions: (): Position[] => d.positions,
  position: (id: PositionId) => d.positions.find((p) => p.id === id)!,
};

export const img = (path: string, small = false) => `${import.meta.env.BASE_URL}img/${path}${small ? "-sm" : ""}.webp`;
