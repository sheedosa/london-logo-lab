import { Garment } from "./Garment";
import { VLink, garmentVT } from "./VLink";
import { methodList, type Garment as G } from "../lib/store";

/** A garment in a listing: a row on phones, a tile from `lg`. The drawing carries over to the garment's own page. */
export function GarmentCard({ g }: { g: G }) {
  const c = g.colours[Math.min(1, g.colours.length - 1)];
  return (
    <VLink to={`/garments/${g.handle}`} className="group grid grid-cols-[104px_minmax(0,1fr)] items-center gap-4 lg:flex lg:flex-col lg:items-stretch lg:gap-2.5">
      <div className="relative rounded-xs bg-stone p-2 lg:p-4">
        <div style={garmentVT(g.handle)}><Garment kind={g.kind} colour={c.hex} positions={[g.positions[0]]} title={g.title} className="mx-auto aspect-[10/11] w-full max-w-[220px]" /></div>
      </div>
      <div>
        <h3 className="text-[1.0625rem] underline-offset-4 group-hover:underline">{g.title}</h3>
        {g.badge && <p className="t-small font-semibold">{g.badge}</p>}
        <p className="t-small text-mute">{methodList(g.methods)}</p>
        <ul className="mt-1.5 flex flex-wrap items-center gap-1" aria-label={`Colours: ${g.colours.map((x) => x.name).join(", ")}`}>
          {g.colours.map((x) => <li key={x.name} className="h-3.5 w-3.5 rounded-[2px] border border-ink" style={{ backgroundColor: x.hex }} />)}
        </ul>
        <p className="t-small mt-1 text-mute">from £[PRICE]</p>
      </div>
    </VLink>
  );
}
