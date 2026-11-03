import { Link } from "react-router-dom";
import { Seo, breadcrumbs } from "../components/Seo";
import { QuoteBuilder } from "../components/QuoteBuilder";
import { SITE } from "../data/site";

export function QuotePage() {
  return (
    <>
      <Seo title="Quote builder with a live mock-up" path="/quote" description="Build an embroidery or print quote: choose a garment, colour, quantity, decoration and logo positions, upload your logo, and see it placed on a flat mock-up with a sample estimate by quantity band."
        jsonLd={[breadcrumbs([{ name: "Home", path: "/" }, { name: "Quote builder", path: "/quote" }]), { "@context": "https://schema.org", "@type": "WebApplication", name: "Logo Lab quote builder", applicationCategory: "BusinessApplication", operatingSystem: "Web", offers: { "@type": "Offer", price: "0", priceCurrency: "GBP" } }]} />

      <section className="wrap flex flex-col gap-4 pb-8 pt-10 sm:pt-14">
        <nav aria-label="Breadcrumb" className="text-sm text-mute"><Link to="/" className="underline">Home</Link> · Quote builder</nav>
        <h1 className="text-[44px] sm:text-[64px]">Build your quote.</h1>
        <p className="max-w-2xl text-[17px] text-mute">Seven choices, a live mock-up and a sample estimate that moves with the quantity. Everything is saved on this device, so you can come back to it. Sending opens at launch; until then the summary copies to your clipboard.</p>
      </section>

      <section className="wrap pb-16">
        <QuoteBuilder />
      </section>

      <section className="wrap">
        <div className="grid gap-6 rounded-pill bg-stone p-8 sm:grid-cols-3">
          {[["Artwork", "Vector files (Illustrator, EPS, PDF, SVG) give the cleanest result. A good PNG works for the preview. We redraw simple logos: [ARTWORK FEE]."], ["Proofs", "A flat proof with thread or ink colours, sizes and positions before anything is made. Changes are free until you approve."], ["Then what", `Standard turnaround [TURNAROUND] from approval. Collect from ${SITE.area} or delivery at [DELIVERY CHARGE].`]].map(([t, d]) => (
            <div key={t} className="flex flex-col gap-2 border-t-2 border-ink pt-4"><h2 className="font-sans text-lg font-semibold">{t}</h2><p className="text-sm text-mute">{d}</p></div>
          ))}
        </div>
      </section>
    </>
  );
}
