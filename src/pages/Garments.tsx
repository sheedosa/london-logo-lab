import { useState } from "react";
import { Link } from "react-router-dom";
import { Seo, breadcrumbs } from "../components/Seo";
import { GarmentCard } from "../components/GarmentCard";
import { store, type Method } from "../lib/store";

export function Garments() {
  const [category, setCategory] = useState("all");
  const [method, setMethod] = useState<Method | null>(null);
  const list = store.garments({ category, method });
  return (
    <>
      <Seo title="Garments: polos, tees, hoodies, hi-vis, caps and aprons" path="/garments" description="Twelve sample garments The London Logo Lab decorates: polos, t-shirts, sweatshirts, hoodies, fleece, softshell, hi-vis, caps, beanies and aprons, with colours and logo positions for each."
        jsonLd={[breadcrumbs([{ name: "Home", path: "/" }, { name: "Garments", path: "/garments" }]), { "@context": "https://schema.org", "@type": "CollectionPage", name: "Garments", description: "Sample garment range for embroidery and print." }]} />

      <section className="wrap flex flex-col gap-4 pb-6 pt-10 sm:pt-14">
        <nav aria-label="Breadcrumb" className="text-sm text-mute"><Link to="/" className="underline">Home</Link> · Garments</nav>
        <h1 className="text-[44px] sm:text-[64px]">Garments</h1>
        <p className="max-w-2xl text-[17px] text-mute">Twelve sample garments to show the range. Each one lists its colours, the decoration it takes and where the logo can go. The real range and brands come from the client.</p>
        <div className="flex flex-col gap-3 pt-2">
          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0" role="group" aria-label="Category">
            {[{ handle: "all", title: "Everything" }, ...store.categories()].map((c) => <button key={c.handle} type="button" aria-pressed={c.handle === category} onClick={() => setCategory(c.handle)} className="chip">{c.title}</button>)}
          </div>
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Decoration">
            <span className="label mr-1 text-mute">Takes</span>
            {(["embroidery", "print"] as const).map((m) => <button key={m} type="button" aria-pressed={method === m} onClick={() => setMethod(method === m ? null : m)} className="chip">{m[0].toUpperCase() + m.slice(1)}</button>)}
          </div>
        </div>
      </section>

      <section className="wrap pb-10">
        <h2 className="sr-only">All garments</h2>
        <p className="mb-5 text-sm text-mute" aria-live="polite">{list.length} {list.length === 1 ? "garment" : "garments"}{category !== "all" ? ` in ${store.category(category)?.title}` : ""}</p>
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
