import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Seo, breadcrumbs } from "../components/Seo";
import { Garment, hasBack } from "../components/Garment";
import { GarmentCard } from "../components/GarmentCard";
import { NotFound } from "./NotFound";
import { methodList, store, type Method, type PositionId } from "../lib/store";
import { BANDS, estimate, gbp, useQuote } from "../lib/quote";
import { SITE } from "../data/site";

export function GarmentPage() {
  const { handle = "" } = useParams();
  const g = store.garment(handle);
  const { quote, update } = useQuote();
  const [colour, setColour] = useState<string | null>(null);
  const [position, setPosition] = useState<PositionId | null>(null);
  const [chosenMethod, setMethod] = useState<Method | null>(null);
  useEffect(() => { setColour(null); setPosition(null); setMethod(null); }, [handle]);
  if (!g) return <NotFound />;

  const c = g.colours.find((x) => x.name === colour) ?? (quote.garment === g.handle ? g.colours.find((x) => x.name === quote.colour) : null) ?? g.colours[0];
  const method: Method = chosenMethod && g.methods.includes(chosenMethod) ? chosenMethod : quote.garment === g.handle && g.methods.includes(quote.method) ? quote.method : g.methods[0];
  const allowed = store.positionsFor(g, method);
  const p = position && allowed.includes(position) ? position : allowed[0];
  const view = p === "back" && hasBack(g.kind) ? "back" : "front";
  const related = store.garments({ category: g.category }).filter((x) => x.handle !== g.handle).slice(0, 4);
  const path = `/garments/${g.handle}`;
  const cat = store.category(g.category)!;
  const start = () => update({ garment: g.handle, colour: c.name, method, positions: [p] });

  return (
    <>
      <Seo title={g.title} path={path} type="product" description={`${g.title}: ${g.blurb} ${methodList(g.methods)}, from ${SITE.minimumOrder}, ready ${SITE.turnaround}. Positions ${g.positions.map((x) => store.position(x).label.toLowerCase()).join(", ")}. The London Logo Lab, Tooting.`}
        jsonLd={[breadcrumbs([{ name: "Home", path: "/" }, { name: "Garments", path: "/garments" }, { name: g.title, path }]),
          { "@context": "https://schema.org", "@type": "Product", name: g.title, description: g.details, color: g.colours.map((x) => x.name).join(", "), brand: { "@type": "Brand", name: SITE.name }, category: cat.title }]} />

      {/* Phones: title, drawing, controls. Desktop: drawing on the left across both rows, title and controls on the right. */}
      <section className="wrap grid gap-6 pb-16 pt-4 lg:grid-cols-[1.15fr_1fr] lg:grid-rows-[auto_1fr] lg:gap-x-14 lg:pt-10">
        <div className="flex flex-col gap-4 lg:col-start-2 lg:row-start-1">
          <nav aria-label="Breadcrumb" className="text-[14px] text-mute"><Link to="/" className="inline-flex min-h-11 items-center underline">Home</Link> · <Link to="/garments" className="inline-flex min-h-11 items-center underline">Garments</Link> · {cat.title}</nav>
          <div className="flex flex-col gap-2">
            {g.badge && <span className="label self-start rounded-pill bg-orange px-2 py-1.5 text-[11px]">{g.badge}</span>}
            <h1 className="text-[34px] sm:text-[48px]">{g.title}</h1>
            <p className="text-[17px]">{g.blurb}</p>
            <p className="text-mute">Sizes {g.sizes} · {methodList(g.methods)} · <span className="whitespace-nowrap">from £[PRICE]</span></p>
          </div>
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-pill border-2 border-ink bg-ink">
            {[["Minimum order", SITE.minimumOrder], ["Ready", SITE.turnaround]].map(([k, v]) => <div key={k} className="bg-stone px-4 py-2.5"><dt className="label text-mute">{k}</dt><dd className="font-semibold">{v}</dd></div>)}
          </dl>
        </div>

        <div className="flex flex-col gap-3 lg:col-start-1 lg:row-span-2 lg:row-start-1">
          <div className="rounded-pill border-2 border-ink bg-stone p-4 sm:p-10 lg:sticky lg:top-24">
            <Garment kind={g.kind} colour={c.hex} positions={[p]} logo={quote.garment === g.handle ? quote.logo : null} view={view} title={g.title} className="mx-auto w-full max-w-[420px]" />
          </div>
          <p className="text-[14px] text-mute">{g.title} in {c.name}, {store.position(p).label.toLowerCase()} marked. Flat drawing of a sample garment.</p>
        </div>

        <div className="flex flex-col gap-6 lg:col-start-2 lg:row-start-2">
          <fieldset>
            <legend className="label mb-2">Colour <span className="normal-case tracking-normal text-mute">({c.name})</span></legend>
            <div className="flex flex-wrap gap-2">
              {g.colours.map((x) => <button key={x.name} type="button" aria-pressed={x.name === c.name} aria-label={x.name} onClick={() => setColour(x.name)} className={`h-11 w-11 rounded-pill border-2 ${x.name === c.name ? "border-orange ring-2 ring-ink ring-offset-2 ring-offset-paper" : "border-ink"}`} style={{ backgroundColor: x.hex }} />)}
            </div>
          </fieldset>

          <fieldset>
            <legend className="label mb-2">Decoration</legend>
            <div className="flex flex-wrap gap-2">
              {g.methods.map((m) => <button key={m} type="button" aria-pressed={m === method} onClick={() => setMethod(m)} className="chip">{store.method(m).label}</button>)}
            </div>
            <p className="mt-2 text-mute">{store.method(method).line}</p>
          </fieldset>

          <fieldset>
            <legend className="label mb-2">Logo position</legend>
            <div className="flex flex-wrap gap-2">
              {allowed.map((x) => { const pos = store.position(x); return <button key={x} type="button" aria-pressed={x === p} onClick={() => setPosition(x)} className="chip">{pos.label} <span className="sub ml-1 text-[13px]">{pos.size}</span></button>; })}
            </div>
          </fieldset>

          <div className="rounded-pill bg-ink p-5 text-paper on-ink">
            <p className="label text-paper-mute">Sample estimate per item · {store.method(method).label}, {store.position(p).label.toLowerCase()}</p>
            <div className="mt-3 grid grid-cols-4 gap-1 text-center">
              {BANDS.map((b) => { const e = estimate({ garment: g.handle, qty: b.min, method, positions: [p] })!; return <div key={b.label} className="rounded-pill border border-paper-mute px-1 py-2"><span className="block text-[13px] text-paper-mute">{b.label}</span><span className="font-semibold text-orange">{gbp(e.perItem)}</span></div>; })}
            </div>
            <p className="mt-3 text-[13px] text-paper-mute">Sample formula for the preview, not a price. Real per-item prices come from the workshop.</p>
          </div>

          <div className="flex flex-col gap-3">
            <Link to="/quote" onClick={start} className="btn btn-orange min-h-14">Quote this garment</Link>
            <Link to="/quote#send" onClick={start} className="btn btn-ghost">Or ask us for a quote</Link>
            <p className="text-center text-[14px] text-mute">Sample garment. Opens the quote builder with this colour, decoration and position set.</p>
          </div>

          <div className="border-t-2 border-ink">
            <details open className="border-b border-line"><summary className="flex min-h-12 cursor-pointer items-center font-medium">Details</summary><p className="pb-4 text-mute">{g.details}</p></details>
            <details className="border-b border-line"><summary className="flex min-h-12 cursor-pointer items-center font-medium">Decoration and artwork</summary><p className="pb-4 text-mute">Positions: {g.positions.map((x) => `${store.position(x).label} (${store.position(x).size})`).join("; ")}. Send vector artwork where you can; we get it ready to stitch or print (setup: £[SETUP]) and send a proof before anything is made.</p></details>
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
