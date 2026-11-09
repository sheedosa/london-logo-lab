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
        <nav aria-label="Breadcrumb" className="text-[14px] text-mute"><Link to="/" className="inline-flex min-h-11 items-center underline">Home</Link> · Quote builder</nav>
        <h1 className="text-[42px] sm:text-[64px]">Build your quote</h1>
        <p className="max-w-2xl text-[17px] text-mute">Pick a garment, choose how it's decorated and where, and watch the mock-up change. We price per item, from {SITE.minimumOrder}, ready {SITE.turnaround}. Would you rather we priced it? <a href="#send" className="underline">Ask us for a quote</a>.</p>
      </section>

      <section className="wrap pb-16">
        <QuoteBuilder />
      </section>

      <section className="wrap">
        <div className="grid gap-8 rounded-pill bg-stone p-6 sm:p-8 lg:grid-cols-[1.3fr_1fr]">
          <div className="flex flex-col gap-3">
            <h2 className="text-[28px] sm:text-[32px]">What happens next</h2>
            <p>We check your logo and send you a flat proof with colours, sizes and positions marked. Nothing is made until you say yes. Then it's ready {SITE.turnaround}.</p>
            <p className="text-mute">Changes before you approve: [PROOF CHANGE POLICY]. Collection or delivery: [DELIVERY OPTIONS].</p>
          </div>
          <div className="flex flex-col gap-2 border-t-2 border-ink pt-4 lg:border-l-2 lg:border-t-0 lg:pl-8 lg:pt-0">
            <h2 className="label">About your logo file</h2>
            <p>Any file is fine to start. Vector files (Illustrator, EPS, PDF, SVG) give the cleanest result. A clear PNG works for the preview.</p>
            <p className="text-mute">Redrawing a logo: [ARTWORK FEE].</p>
          </div>
        </div>
      </section>
    </>
  );
}
