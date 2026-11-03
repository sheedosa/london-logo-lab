import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Seo, breadcrumbs } from "../components/Seo";
import { Garment, hasBack } from "../components/Garment";
import { GarmentCard } from "../components/GarmentCard";
import { NotFound } from "./NotFound";
import { store, type PositionId } from "../lib/store";
import { BANDS, estimate, gbp, useQuote } from "../lib/quote";
import { SITE } from "../data/site";

export function GarmentPage() {
  const { handle = "" } = useParams();
  const g = store.garment(handle);
  const { quote, update } = useQuote();
  const [colour, setColour] = useState<string | null>(null);
  const [position, setPosition] = useState<PositionId | null>(null);
  useEffect(() => { setColour(null); setPosition(null); }, [handle]);
  if (!g) return <NotFound />;

  const c = g.colours.find((x) => x.name === colour) ?? (quote.garment === g.handle ? g.colours.find((x) => x.name === quote.colour) : null) ?? g.colours[0];
  const p = position ?? g.positions[0];
  const view = p === "back" && hasBack(g.kind) ? "back" : "front";
  const method = g.methods[0];
  const related = store.garments({ category: g.category }).filter((x) => x.handle !== g.handle).slice(0, 4);
  const path = `/garments/${g.handle}`;
  const cat = store.category(g.category)!;
  const start = () => update({ garment: g.handle, colour: c.name, positions: [p] }); // method is kept if the garment takes it

  return (
    <>
      <Seo title={g.title} path={path} type="product" description={`${g.title}: ${g.blurb} ${g.methods.join(" or ")}, positions ${g.positions.map((x) => store.position(x).label.toLowerCase()).join(", ")}. The London Logo Lab, Tooting.`}
        jsonLd={[breadcrumbs([{ name: "Home", path: "/" }, { name: "Garments", path: "/garments" }, { name: g.title, path }]),
          { "@context": "https://schema.org", "@type": "Product", name: g.title, description: g.details, color: g.colours.map((x) => x.name).join(", "), brand: { "@type": "Brand", name: SITE.name }, category: cat.title }]} />

      <section className="wrap grid gap-10 pb-16 pt-6 lg:grid-cols-[1.15fr_1fr] lg:gap-14 lg:pt-10">
        <div className="flex flex-col gap-3">
          <div className="rounded-pill border-2 border-ink bg-stone p-6 sm:p-10">
            <Garment kind={g.kind} colour={c.hex} positions={[p]} logo={quote.garment === g.handle ? quote.logo : null} view={view} title={g.title} className="mx-auto w-full max-w-[420px]" />
          </div>
          <p className="text-sm text-mute">{g.title} in {c.name}, {store.position(p).label.toLowerCase()} position marked. Flat drawing: sample garment, concept preview.</p>
        </div>

        <div className="flex flex-col gap-6 lg:sticky lg:top-24 lg:self-start">
          <nav aria-label="Breadcrumb" className="text-sm text-mute"><Link to="/" className="underline">Home</Link> · <Link to="/garments" className="underline">Garments</Link> · {cat.title}</nav>
          <div className="flex flex-col gap-2">
            {g.badge && <span className="label self-start rounded-pill bg-orange px-2 py-1.5 text-[11px]">{g.badge}</span>}
            <h1 className="text-[36px] sm:text-[48px]">{g.title}</h1>
            <p className="text-[17px]">{g.blurb}</p>
            <p className="text-sm text-mute">Sizes {g.sizes} · {g.methods.map((m) => m[0].toUpperCase() + m.slice(1)).join(" or ")} · garment from £[PRICE]</p>
          </div>

          <fieldset>
            <legend className="label mb-2">Colour <span className="normal-case tracking-normal text-mute">({c.name})</span></legend>
            <div className="flex flex-wrap gap-2">
              {g.colours.map((x) => <button key={x.name} type="button" aria-pressed={x.name === c.name} aria-label={x.name} onClick={() => setColour(x.name)} className={`h-11 w-11 rounded-pill border-2 ${x.name === c.name ? "border-orange ring-2 ring-ink ring-offset-2 ring-offset-paper" : "border-ink"}`} style={{ backgroundColor: x.hex }} />)}
            </div>
          </fieldset>

          <fieldset>
            <legend className="label mb-2">Logo position</legend>
            <div className="flex flex-wrap gap-2">
              {g.positions.map((x) => { const pos = store.position(x); return <button key={x} type="button" aria-pressed={x === p} onClick={() => setPosition(x)} className="chip">{pos.label} <span className="sub ml-1 text-xs">{pos.size}</span></button>; })}
            </div>
          </fieldset>

          <div className="rounded-pill bg-ink p-5 text-paper on-ink">
            <p className="label text-paper-mute">Sample estimate, {method}, {store.position(p).label.toLowerCase()}</p>
            <div className="mt-3 grid grid-cols-4 gap-1 text-center text-sm">
              {BANDS.map((b) => { const e = estimate({ garment: g.handle, qty: b.min, method, positions: [p] })!; return <div key={b.label} className="rounded-pill border border-paper-mute px-1 py-2"><span className="block text-xs text-paper-mute">{b.label}</span><span className="font-semibold text-orange">{gbp(e.perItem)}</span></div>; })}
            </div>
            <p className="mt-3 text-xs text-paper-mute">Per item, sample formula for the concept preview. Real prices come from the workshop.</p>
          </div>

          <div className="flex flex-col gap-3">
            <Link to="/quote" onClick={start} className="btn btn-orange min-h-14">Quote this garment</Link>
            <p className="text-center text-sm text-mute">Concept preview: sample garment. Opens the quote builder with this colour and position set.</p>
          </div>

          <div className="border-t-2 border-ink">
            <details open className="border-b border-line"><summary className="flex min-h-12 cursor-pointer items-center font-medium">Details</summary><p className="pb-4 text-mute">{g.details}</p></details>
            <details className="border-b border-line"><summary className="flex min-h-12 cursor-pointer items-center font-medium">Decoration and artwork</summary><p className="pb-4 text-mute">Positions: {g.positions.map((x) => `${store.position(x).label} (${store.position(x).size})`).join("; ")}. Send vector artwork where you can; we digitise for embroidery once per logo (£[SETUP]) and send a proof before anything is made.</p></details>
            <details className="border-b border-line"><summary className="flex min-h-12 cursor-pointer items-center font-medium">Sizing, care and returns</summary><p className="pb-4 text-mute">Size chart: [SIZE CHART]. Wash inside out at [WASH TEMPERATURE]. Decorated garments are made to order: [RETURNS POLICY ON DECORATED GOODS].</p></details>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="wrap pb-6">
          <h2 className="mb-6 text-[32px] sm:text-[36px]">Also in {cat.title.toLowerCase()}</h2>
          <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 lg:grid-cols-4">{related.map((x) => <GarmentCard key={x.handle} g={x} />)}</div>
        </section>
      )}
    </>
  );
}
