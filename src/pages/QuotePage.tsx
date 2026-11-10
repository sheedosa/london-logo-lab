import { Seo, breadcrumbs } from "../components/Seo";
import { Crumbs } from "../components/Crumbs";
import { QuoteBuilder } from "../components/QuoteBuilder";
import { TitleRule } from "../components/Icons";
import { SITE } from "../data/site";

export function QuotePage() {
  return (
    <>
      <Seo title="Quote builder with a live mock-up" path="/quote" description="Build an embroidery or print quote: choose a garment, colour, quantity, decoration and logo positions, upload your logo, and see it placed on a flat mock-up with a sample estimate by quantity band."
        jsonLd={[breadcrumbs([{ name: "Home", path: "/" }, { name: "Quote builder", path: "/quote" }]), { "@context": "https://schema.org", "@type": "WebApplication", name: "Logo Lab quote builder", applicationCategory: "BusinessApplication", operatingSystem: "Web", offers: { "@type": "Offer", price: "0", priceCurrency: "GBP" } }]} />

      {/* The workbench: a stone band the paper ticket lies on */}
      <section className="bg-stone">
        <div className="wrap pb-12 pt-4 lg:pb-20 lg:pt-8">
          <div className="flex flex-col gap-4 pb-6 lg:pb-10">
            <Crumbs trail={[{ to: "/", label: "Home" }]} here="Quote builder" />
            <h1>Build your quote</h1>
            <TitleRule className="text-rust" />
            <p className="t-lede">Fill in the ticket line by line and watch the mock-up change. We price per item, from {SITE.minimumOrder}, ready {SITE.turnaround}. Would you rather we priced it? <a href="#send" className="underline underline-offset-4">Ask us for a quote</a>.</p>
          </div>
          <QuoteBuilder />
        </div>
      </section>

      <section className="wrap band grid gap-x-12 gap-y-8 !pb-0 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-x-20">
        <div className="flex flex-col gap-3">
          <h2>What happens next</h2>
          <p className="t-lede">We check your logo and send you a flat proof with colours, sizes and positions marked. Nothing is made until you say yes. Then it's ready {SITE.turnaround}.</p>
          <p className="text-mute">Changes before you approve: [PROOF CHANGE POLICY]. Collection or delivery: [DELIVERY OPTIONS].</p>
        </div>
        <div className="flex flex-col gap-2 border-t-2 border-ink pt-5">
          <h3>About your logo file</h3>
          <p>Any file is fine to start. Vector files (Illustrator, EPS, PDF, SVG) give the cleanest result. A clear PNG works for the preview.</p>
          <p className="text-mute">Redrawing a logo: [ARTWORK FEE].</p>
        </div>
      </section>
    </>
  );
}
