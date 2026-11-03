import { Link } from "react-router-dom";
import { Garment } from "./Garment";
import type { Garment as G } from "../lib/store";

export function GarmentCard({ g }: { g: G }) {
  const c = g.colours[Math.min(1, g.colours.length - 1)];
  return (
    <Link to={`/garments/${g.handle}`} className="group flex flex-col gap-2.5">
      <div className="relative rounded-pill border-2 border-ink bg-stone p-4 transition-colors group-hover:bg-paper">
        <Garment kind={g.kind} colour={c.hex} positions={[g.positions[0]]} title={g.title} className="mx-auto aspect-[10/11] w-full max-w-[220px]" />
        {g.badge && <span className="label absolute left-3 top-3 rounded-pill bg-orange px-2 py-1.5 text-[11px] text-ink">{g.badge}</span>}
        <ul className="absolute bottom-3 right-3 flex gap-1" aria-label={`Colours: ${g.colours.map((x) => x.name).join(", ")}`}>
          {g.colours.slice(0, 6).map((x) => <li key={x.name} className="h-3.5 w-3.5 rounded-pill border border-ink" style={{ backgroundColor: x.hex }} />)}
          {g.colours.length > 6 && <li className="text-xs text-mute">+{g.colours.length - 6}</li>}
        </ul>
      </div>
      <h3 className="text-base group-hover:underline">{g.title}</h3>
      <p className="-mt-1.5 text-sm text-mute">{g.methods.map((m) => m[0].toUpperCase() + m.slice(1)).join(" or ")} · from £[PRICE]</p>
    </Link>
  );
}
