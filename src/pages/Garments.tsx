import { Link, useSearchParams } from "react-router-dom";
import { Seo, breadcrumbs } from "../components/Seo";
import { Crumbs } from "../components/Crumbs";
import { GarmentCard } from "../components/GarmentCard";
import { TitleRule } from "../components/Icons";
import { store, type Method } from "../lib/store";
import { SITE } from "../data/site";

export function Garments() {
  // Filter state lives in the address, so a filtered list can be linked to (the services page does) and survives Back.
  const [params, setParams] = useSearchParams();
  const category = store.category(params.get("in") ?? "")?.handle ?? "all";
  const method = store.methods().find((m) => m.id === params.get("takes"))?.id ?? null;
  const set = (next: { category?: string; method?: Method | null }) => {
    const c = next.category ?? category, m = next.method === undefined ? method : next.method;
    const p = new URLSearchParams();
    if (c !== "all") p.set("in", c);
    if (m) p.set("takes", m);
    setParams(p, { replace: true, preventScrollReset: true });
  };
  const list = store.garments({ category, method });
  const groups = store.categories().map((c) => ({ c, items: list.filter((g) => g.category === c.handle) })).filter((x) => x.items.length);
  const filtered = category !== "all" || method !== null;
  return (
    <>
      <Seo title="Garments: polos, tees, hoodies, hi-vis, caps and aprons" path="/garments" description="Twelve sample garments, from one item, The London Logo Lab decorates: polos, t-shirts, sweatshirts, hoodies, fleece, softshell, hi-vis, caps, beanies and aprons, with colours and logo positions for each."
        jsonLd={[breadcrumbs([{ name: "Home", path: "/" }, { name: "Garments", path: "/garments" }]), { "@context": "https://schema.org", "@type": "CollectionPage", name: "Garments", description: "Sample garment range for embroidery and print." }]} />

      <section className="wrap flex flex-col gap-4 pb-6 pt-4 lg:pt-8">
        <Crumbs trail={[{ to: "/", label: "Home" }]} here="Garments" />
        <h1>Garments</h1>
        <TitleRule className="text-rust" />
        <p className="t-lede text-mute">Twelve sample garments to show the range. Each one shows its colours, how it can be decorated and where your logo can go. Every garment from {SITE.minimumOrder}, ready {SITE.turnaround}. Prices per garment are to come: from <span className="whitespace-nowrap">£[PRICE]</span>.</p>
      </section>

      {/* Filters: both rows always visible, the chosen ones pressed */}
      <section aria-label="Filters" className="border-y-2 border-ink">
        <div className="wrap grid gap-x-6 gap-y-1 py-3 md:grid-cols-[auto_minmax(0,1fr)] md:items-center">
          <p className="label pt-1 text-mute md:pt-0" id="f-cat">Show</p>
          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 py-1.5 sm:mx-0 sm:flex-wrap sm:px-0" role="group" aria-labelledby="f-cat">
            {[{ handle: "all", title: "Everything" }, ...store.categories()].map((c) => <button key={c.handle} type="button" aria-pressed={c.handle === category} onClick={() => set({ category: c.handle })} className="chip">{c.title}</button>)}
          </div>
          <p className="label pt-1 text-mute md:pt-0" id="f-takes">That takes</p>
          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 py-1.5 sm:mx-0 sm:flex-wrap sm:px-0" role="group" aria-labelledby="f-takes">
            {store.methods().map((m) => <button key={m.id} type="button" aria-pressed={method === m.id} onClick={() => set({ method: method === m.id ? null : m.id })} className="chip">{m.label}</button>)}
          </div>
        </div>
      </section>

      <section className="wrap pb-4 pt-6">
        <h2 className="sr-only">Results</h2>
        <p className="flex min-h-11 flex-wrap items-center gap-x-4" aria-live="polite">
          <span><b>{list.length} {list.length === 1 ? "garment" : "garments"}</b>{category !== "all" ? ` in ${store.category(category)?.title}` : ""}{method ? ` that ${list.length === 1 ? "takes" : "take"} ${store.method(method).label.replace("Embroidery", "embroidery").replace("Screen", "screen").replace("Vinyl", "vinyl")}` : ""}</span>
          {filtered && <button type="button" onClick={() => setParams(new URLSearchParams(), { replace: true, preventScrollReset: true })} className="link">Clear filters</button>}
        </p>
        {groups.length ? groups.map(({ c, items }) => (
          <div key={c.handle} className="grid gap-x-10 gap-y-5 border-t border-ink py-8 lg:grid-cols-[minmax(0,0.3fr)_minmax(0,1fr)] lg:py-10">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <h3 className="t-section">{c.title}</h3>
              <p className="mt-2 max-w-[28em] text-mute">{c.blurb}</p>
            </div>
            <div className="grid gap-x-5 gap-y-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-y-8">{items.map((g) => <GarmentCard key={g.handle} g={g} />)}</div>
          </div>
        )) : (
          <div className="flex flex-col items-start gap-3 border-t border-ink py-10">
            <p className="t-sub">Nothing in {store.category(category)?.title ?? "that category"} takes {method ? store.method(method).label.toLowerCase().replace("dtf", "DTF") : "that decoration"}.</p>
            <p className="text-mute">Try another decoration, or see everything.</p>
            <button type="button" onClick={() => setParams(new URLSearchParams(), { replace: true, preventScrollReset: true })} className="btn btn-ghost">Clear filters</button>
          </div>
        )}
      </section>

      <section className="bg-stone">
        <div className="wrap grid gap-6 py-12 md:grid-cols-[minmax(0,1fr)_auto] md:items-center lg:py-16">
          <div className="flex flex-col gap-3"><h2 className="max-w-[16em]">If it isn't here, tell us the brand and style code.</h2><p className="measure text-mute">We decorate garments from most UK workwear suppliers, and your own if they are suitable: [OWN GARMENT POLICY].</p></div>
          <Link to="/quote" className="btn btn-ink self-start md:self-auto">Build a quote</Link>
        </div>
      </section>
    </>
  );
}
