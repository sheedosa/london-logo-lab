import { useState } from "react";
import { Link } from "react-router-dom";
import { Seo, breadcrumbs } from "../components/Seo";
import { GarmentCard } from "../components/GarmentCard";
import { store, type Method } from "../lib/store";
import { SITE } from "../data/site";

export function Garments() {
  const [category, setCategory] = useState("all");
  const [method, setMethod] = useState<Method | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const list = store.garments({ category, method });
  return (
    <>
      <Seo title="Garments: polos, tees, hoodies, hi-vis, caps and aprons" path="/garments" description="Twelve sample garments, from one item, The London Logo Lab decorates: polos, t-shirts, sweatshirts, hoodies, fleece, softshell, hi-vis, caps, beanies and aprons, with colours and logo positions for each."
        jsonLd={[breadcrumbs([{ name: "Home", path: "/" }, { name: "Garments", path: "/garments" }]), { "@context": "https://schema.org", "@type": "CollectionPage", name: "Garments", description: "Sample garment range for embroidery and print." }]} />

      <section className="wrap flex flex-col gap-4 pb-6 pt-10 sm:pt-14">
        <nav aria-label="Breadcrumb" className="text-sm text-mute"><Link to="/" className="inline-flex min-h-11 items-center underline">Home</Link> · Garments</nav>
        <h1 className="text-[44px] sm:text-[64px]">Garments</h1>
        <p className="max-w-2xl text-[17px] text-mute">Twelve sample garments to show the range. Each one shows its colours, how it can be decorated and where your logo can go. Every garment from {SITE.minimumOrder}, ready {SITE.turnaround}.</p>
        <div className="flex flex-col gap-3 pt-2">
          <div className="flex items-start gap-2">
            <div className="-ml-4 flex min-w-0 flex-1 gap-2 overflow-x-auto pl-4 pr-1 sm:ml-0 sm:flex-wrap sm:pl-0" role="group" aria-label="Category">
              {[{ handle: "all", title: "Everything" }, ...store.categories()].map((c) => <button key={c.handle} type="button" aria-pressed={c.handle === category} onClick={() => setCategory(c.handle)} className="chip">{c.title}</button>)}
            </div>
            <button type="button" aria-expanded={filterOpen} aria-controls="method-filter" onClick={() => setFilterOpen(!filterOpen)} className="chip shrink-0 gap-1.5 lg:hidden">
              Filter{method ? " (1)" : ""}
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" className={filterOpen ? "rotate-180" : ""}><path d="M2 5l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2" /></svg>
            </button>
          </div>
          <div id="method-filter" className={`${filterOpen ? "flex" : "hidden"} flex-wrap items-center gap-2 lg:flex`} role="group" aria-label="Decoration">
            <span className="label mr-1 text-mute">Takes</span>
            {store.methods().map((m) => <button key={m.id} type="button" aria-pressed={method === m.id} onClick={() => setMethod(method === m.id ? null : m.id)} className="chip">{m.label}</button>)}
          </div>
        </div>
      </section>

      <section className="wrap pb-10">
        <h2 className="sr-only">All garments</h2>
        <p className="mb-5 text-mute" aria-live="polite">{list.length} {list.length === 1 ? "garment" : "garments"}{category !== "all" ? ` in ${store.category(category)?.title}` : ""}</p>
        {list.length ? (
          <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 lg:grid-cols-4">{list.map((g) => <GarmentCard key={g.handle} g={g} />)}</div>
        ) : (
          <div className="rounded-pill bg-stone p-8 text-center"><p>Nothing in that category takes that decoration.</p><button type="button" onClick={() => { setCategory("all"); setMethod(null); }} className="btn btn-ghost mt-4">Clear filters</button></div>
        )}
      </section>

      <section className="wrap">
        <div className="flex flex-col gap-4 rounded-pill bg-ink p-8 text-paper on-ink sm:flex-row sm:items-center sm:justify-between">
          <div><h2 className="text-[28px] text-paper sm:text-[32px]">Not here? Tell us the brand and style code.</h2><p className="text-paper-mute">We decorate garments from most UK workwear suppliers, and your own if they are suitable: [OWN GARMENT POLICY].</p></div>
          <Link to="/quote" className="btn btn-orange shrink-0">Build a quote</Link>
        </div>
      </section>
    </>
  );
}
