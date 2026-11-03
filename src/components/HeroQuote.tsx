import { Link } from "react-router-dom";
import { Garment } from "./Garment";
import { BANDS, estimate, gbp, useQuote } from "../lib/quote";
import { store } from "../lib/store";

// The quote builder's front door: garment, quantity band and a live flat with the logo position, on the home page.
// Shares state with the full builder, so what is picked here is waiting on /quote.
const QUICK = ["classic-polo", "heavy-tee", "pullover-hoodie", "softshell-jacket", "hi-vis-vest", "six-panel-cap"];

export function HeroQuote() {
  const { quote, update } = useQuote();
  const g = store.garment(quote.garment)!;
  const colour = g.colours.find((c) => c.name === quote.colour) ?? g.colours[0];
  const est = estimate(quote)!;
  return (
    <div className="rounded-pill border-2 border-paper bg-paper p-4 text-ink sm:p-5">
      <div className="grid grid-cols-[1fr_auto] items-start gap-3">
        <div>
          <p className="label">Quote builder</p>
          <p className="mt-1 text-sm text-mute">Pick a garment and a quantity. The mock-up and the sample estimate follow you to the full builder.</p>
        </div>
        <Garment kind={g.kind} colour={colour.hex} positions={quote.positions} logo={quote.logo} title={g.title} className="h-24 w-24 sm:h-28 sm:w-28" />
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5" role="group" aria-label="Garment">
        {QUICK.map((h) => { const x = store.garment(h)!; return <button key={h} type="button" aria-pressed={h === g.handle} onClick={() => update({ garment: h })} className="chip min-h-11 px-3 text-xs">{x.title}</button>; })}
        <Link to="/garments" className="inline-flex min-h-11 items-center px-2 text-xs underline">all 12</Link>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5" role="group" aria-label="Quantity band">
        {BANDS.map((b) => <button key={b.label} type="button" aria-pressed={est.band === b} onClick={() => update({ qty: b.min })} className="chip min-h-11 px-3 text-xs">{b.label}</button>)}
      </div>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-3 border-t-2 border-ink pt-3">
        <div>
          <p className="display text-[28px]">from {gbp(est.perItem)} <span className="font-sans text-sm font-normal">per item</span></p>
          <p className="text-xs text-mute">{g.title} in {colour.name}, {quote.qty} off, {quote.method}. Sample formula, not a price.</p>
        </div>
        <Link to="/quote" className="btn btn-orange">Continue</Link>
      </div>
    </div>
  );
}
