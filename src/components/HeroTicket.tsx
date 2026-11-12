import { Garment } from "./Garment";
import { Ticket } from "./Ticket";
import { VLink } from "./VLink";
import { useQuote } from "../lib/quote";
import { store } from "../lib/store";

// The home hero is a working job ticket, not a picture of one: garment, colour, quantity, decoration and position
// fill in here, with the flat drawing on its own sheet beside it, both lying on the orange like work on a print table. It shares state with the full ticket on /quote, so whatever is
// chosen here is already written on the ticket there.
const QUICK = ["classic-polo", "heavy-tee", "pullover-hoodie", "softshell-jacket", "hi-vis-vest", "six-panel-cap"];

export function HeroTicket() {
  const { quote, choose, saved, reset } = useQuote();
  const g = store.garment(quote.garment)!;
  const colour = g.colours.find((c) => c.name === quote.colour) ?? g.colours[0];
  const back = quote.positions.length === 1 && quote.positions[0] === "back";
  return (
    <div className="feed grid gap-3 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] md:gap-5 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1fr)] lg:gap-8">
      <div className="mock grid grid-cols-[104px_minmax(0,1fr)] items-center gap-4 p-3 md:flex md:flex-col md:justify-center md:gap-4 md:self-start md:p-6 lg:p-9">
        <div key={g.handle} className="mock-swap w-full" style={{ viewTransitionName: "mock" }}>
          <Garment kind={g.kind} colour={colour.hex} positions={quote.positions} logo={quote.logo} view={back ? "back" : "front"} title={g.title} className="mx-auto w-full md:max-w-[440px]" />
        </div>
        <p className="t-small md:text-center md:text-base" aria-live="polite"><b>{g.title} in {colour.name}.</b> The dashed box is where your logo goes.</p>
      </div>
      <Ticket quote={quote} choose={choose} lines={["garment", "colour", "qty", "method", "positions"]} quick={QUICK} ground="orange">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
          <VLink to="/quote" className="btn btn-orange">Add your logo and finish</VLink>
          {saved && <button type="button" onClick={reset} className="link">Start again</button>}
        </div>
      </Ticket>
    </div>
  );
}
