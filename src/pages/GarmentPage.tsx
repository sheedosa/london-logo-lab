import { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Seo, breadcrumbs } from "../components/Seo";
import { Crumbs } from "../components/Crumbs";
import { GarmentCard } from "../components/GarmentCard";
import { Mock, Ticket, TotalBar } from "../components/Ticket";
import { VLink } from "../components/VLink";
import { NotFound } from "./NotFound";
import { methodList, store, type Garment as G } from "../lib/store";
import { DEFAULT_QUOTE, mark, sanitise, useQuote, type LineId, type Quote } from "../lib/quote";
import { useOnScreen } from "../lib/useOnScreen";
import { SITE } from "../data/site";

export function GarmentPage() {
  const { handle = "" } = useParams();
  const g = store.garment(handle);
  if (!g) return <NotFound />;
  return <Detail key={g.handle} g={g} />;
}

function Detail({ g }: { g: G }) {
  const { quote, update } = useQuote();
  // A ticket started for this garment. It stays on this page until "Quote this garment" writes it to the saved quote.
  const [draft, setDraft] = useState<Quote>(() => quote.garment === g.handle ? quote
    : sanitise({ ...DEFAULT_QUOTE, garment: g.handle, colour: g.colours[Math.min(1, g.colours.length - 1)].name, method: g.methods[0], positions: [], qty: quote.qty, done: [] }));
  const choose = (patch: Partial<Quote>, line: LineId) => setDraft((d) => sanitise({ ...d, ...patch, done: mark(d.done, line) }));
  const start = () => update({ garment: g.handle, colour: draft.colour, method: draft.method, positions: draft.positions, qty: draft.qty, done: mark(draft.done, "garment") });
  const benchRef = useRef<HTMLDivElement>(null), stubRef = useRef<HTMLDivElement>(null);
  const benchOn = useOnScreen(benchRef, false), stubOn = useOnScreen(stubRef);

  const related = store.garments({ category: g.category }).filter((x) => x.handle !== g.handle);
  const others = related.length ? related : store.garments().filter((x) => x.handle !== g.handle).slice(0, 4);
  const path = `/garments/${g.handle}`;
  const cat = store.category(g.category)!;

  return (
    <>
      <Seo title={g.title} path={path} type="product" description={`${g.title}: ${g.blurb} ${methodList(g.methods)}, from ${SITE.minimumOrder}, ready ${SITE.turnaround}. Positions ${g.positions.map((x) => store.position(x).label.toLowerCase()).join(", ")}. The London Logo Lab, Tooting.`}
        jsonLd={[breadcrumbs([{ name: "Home", path: "/" }, { name: "Garments", path: "/garments" }, { name: g.title, path }]),
          { "@context": "https://schema.org", "@type": "Product", name: g.title, description: g.details, color: g.colours.map((x) => x.name).join(", "), brand: { "@type": "Brand", name: SITE.name }, category: cat.title }]} />

      {/* The bench: title, then the drawing with a ticket started for this garment */}
      <section className="bg-stone">
        <div className="wrap pb-12 pt-4 lg:pb-20 lg:pt-8">
          <div className="flex flex-col gap-3 pb-6 lg:pb-10">
            <Crumbs trail={[{ to: "/", label: "Home" }, { to: "/garments", label: "Garments" }]} here={cat.title} />
            <h1>{g.title}</h1>
            <p className="t-lede">{g.blurb}</p>
            <p className="text-mute">{g.badge ? `${g.badge}. ` : ""}Sizes {g.sizes}. {methodList(g.methods)}. From <span className="whitespace-nowrap">£[PRICE]</span>.</p>
          </div>

          <div ref={benchRef} className="md:grid md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] md:items-start md:gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-12">
            <div className="sticky top-[var(--header-h)] z-20 -mx-4 sm:-mx-8 md:top-24 md:mx-0">
              <Mock quote={draft} vtName={`garment-${g.handle}`} className="max-md:rounded-none max-md:border-x-0 max-md:border-t-0" />
              <p className="t-small mt-2 hidden text-mute md:block">Flat drawing of a sample garment.</p>
            </div>
            <div className="mt-5 md:mt-0">
              <Ticket quote={draft} choose={choose} lines={["colour", "qty", "method", "positions"]} startOpen="colour" bands subject={g.title} stubRef={stubRef}>
                <div className="flex flex-col gap-2">
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
                    <VLink to="/quote" onClick={start} className="btn btn-orange">Quote this garment</VLink>
                    <VLink to="/quote#send" onClick={start} className="link">Or ask us for a quote</VLink>
                  </div>
                  <p className="t-small text-mute">Sample garment. Opens the full ticket with this colour, decoration and position written in.</p>
                </div>
              </Ticket>
            </div>
          </div>
        </div>
      </section>

      <section className="wrap band">
        <h2>The details</h2>
        <div className="mt-6 max-w-[52rem] border-t-2 border-ink">
          <details open className="border-b border-ink"><summary className="t-sub flex min-h-14 cursor-pointer items-center">Details</summary><p className="measure pb-5 text-mute">{g.details}</p></details>
          <details className="border-b border-ink"><summary className="t-sub flex min-h-14 cursor-pointer items-center">Decoration and artwork</summary><p className="measure pb-5 text-mute">Positions: {g.positions.map((x) => `${store.position(x).label} (${store.position(x).size})`).join("; ")}. Send vector artwork where you can; we get it ready to stitch or print (setup: <span className="whitespace-nowrap">£[SETUP]</span>) and send a proof before anything is made.</p></details>
          <details className="border-b border-ink"><summary className="t-sub flex min-h-14 cursor-pointer items-center">Sizing, care and returns</summary><p className="measure pb-5 text-mute">Size chart: [SIZE CHART]. Wash inside out at [WASH TEMPERATURE]. Decorated garments are made to order: [RETURNS POLICY ON DECORATED GOODS].</p></details>
        </div>
      </section>

      <section className="wrap">
        <div className="flex flex-col gap-6 border-t-2 border-ink pt-8 lg:pt-10">
          <h2>{related.length ? `Also in ${cat.title.toLowerCase()}` : "More garments"}</h2>
          <div className={`grid gap-x-5 gap-y-5 sm:grid-cols-2 lg:grid-cols-4`}>{others.map((x) => <GarmentCard key={x.handle} g={x} />)}</div>
        </div>
      </section>

      <TotalBar quote={draft} show={benchOn && !stubOn}>
        <VLink to="/quote" onClick={start} className="btn btn-orange min-h-11 px-4">Quote this garment</VLink>
      </TotalBar>
    </>
  );
}
