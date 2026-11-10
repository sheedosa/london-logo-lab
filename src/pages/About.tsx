import { Link } from "react-router-dom";
import { Seo, breadcrumbs } from "../components/Seo";
import { Crumbs } from "../components/Crumbs";
import { Marque, TitleRule } from "../components/Icons";
import { PhotoSlot } from "../components/PhotoSlot";
import { SITE } from "../data/site";

/** Map-pin diagram: Tooting as a pin on a few simple rectangles for the high street. Decorative. */
function AreaDiagram() {
  return (
    <svg viewBox="0 0 320 200" aria-hidden="true" className="w-full">
      <rect width="320" height="200" fill="#f3eee4" />
      <g fill="#e6dfd0" stroke="#1b1916" strokeWidth="1.5">
        {[[20, 120, 50, 60], [80, 100, 40, 80], [130, 130, 60, 50], [200, 90, 46, 90], [256, 120, 50, 60]].map(([x, y, w, h], i) => <rect key={i} x={x} y={y} width={w} height={h} />)}
      </g>
      <path d="M0 180H320" stroke="#1b1916" strokeWidth="1.5" />
      <path d="M160 132 L150 110 H170 Z" fill="#1b1916" />
      <rect x="128" y="46" width="64" height="64" rx="3" fill="#1b1916" />
      <path d="M143 57V63M143 72V78M143 87V93H151M159 93H165M173 93H179" fill="none" stroke="#f4651f" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const WORKSHOP = [
  ["Embroidery", "Logos stitched here. Machines: [MACHINES]"],
  ["Printing", "Screen printing, DTF and vinyl"],
  ["Your logo", "We get it ready to stitch or print"],
  ["Getting it to you", "Collection or delivery: [DELIVERY OPTIONS]"],
];

export function About() {
  return (
    <>
      <Seo title="About and visit: the workshop in Tooting" path="/about" description="The London Logo Lab is an embroidery and print workshop in Tooting, South London. How we work, what to bring, and how to find us."
        jsonLd={[breadcrumbs([{ name: "Home", path: "/" }, { name: "About & visit", path: "/about" }]), { "@context": "https://schema.org", "@type": "AboutPage", name: "About The London Logo Lab" }]} />

      <section className="on-ink bg-ink text-paper">
        <div className="wrap grid items-center gap-10 pb-12 pt-4 md:grid-cols-[minmax(0,1fr)_auto] lg:pb-16 lg:pt-8">
          <div className="flex flex-col gap-5">
            <Crumbs trail={[{ to: "/", label: "Home" }]} here="About & visit" className="text-paper-mute" />
            <h1 className="max-w-[10em]">A friendly workshop in Tooting.</h1>
            <TitleRule className="text-orange" />
            <p className="t-lede text-paper-mute">We stitch and print logos for trades, schools and sports clubs. Come in, show us your logo, and we'll help you get it right. Part of the I&amp;A family.</p>
          </div>
          <Marque size={220} tile="#f4651f" thread="#1b1916" className="hidden md:block md:h-40 md:w-40 lg:h-[220px] lg:w-[220px]" />
        </div>
      </section>

      <section className="wrap band grid gap-x-12 gap-y-10 md:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)] lg:gap-x-20">
        <div className="flex flex-col gap-5">
          <h2>What happens behind the counter</h2>
          <p className="t-lede">Your logo comes in and we check it. We get it ready to stitch or print. You get a proof. Once you say yes, we make it, check it, fold it and bag it. One shirt or a hundred, ready {SITE.turnaround}.</p>
          <dl className="ledger mt-2 border-b border-ink">
            {WORKSHOP.map(([t, d]) => <div key={t}><dt>{t}</dt><dd className="text-mute">{d}</dd></div>)}
          </dl>
        </div>
        <PhotoSlot shows="The embroidery machine mid-run, a club crest half stitched." className="min-h-[300px]" />
      </section>

      <section className="bg-stone">
        <div className="wrap band grid gap-x-12 gap-y-10 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] lg:gap-x-20">
          <div className="flex flex-col gap-4 md:order-2">
            <h2>Come and see us</h2>
            <dl className="ledger border-b border-ink">
              {[["Address", SITE.address], ["Hours", SITE.hours], ["Phone", SITE.phone], ["Email", SITE.email], ["Nearest", "[NEAREST STATION], [BUS ROUTES]"], ["Parking", "[PARKING NOTE]"]].map(([k, v]) => <div key={k}><dt>{k}</dt><dd className="text-mute">{v}</dd></div>)}
            </dl>
          </div>
          <div className="flex flex-col gap-3 md:order-1">
            <div className="overflow-hidden rounded-xs border-2 border-ink"><AreaDiagram /></div>
            <p className="text-mute">Map and directions come with the confirmed address.</p>
          </div>
        </div>
      </section>

      <section className="wrap band grid gap-6 !pb-0 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
        <div className="flex flex-col gap-3">
          <h2>What to bring</h2>
          <p className="t-lede">Your logo, on your phone is fine. A garment you like, if you have one. A rough number, even if it's one. We'll do the rest at the counter, or you can <Link to="/quote" className="underline underline-offset-4">build the quote first</Link> and bring the summary.</p>
        </div>
        <div className="flex flex-wrap gap-3"><Link to="/quote" className="btn btn-ink">Build a quote</Link>{SITE.social.instagram.startsWith("http") && <a href={SITE.social.instagram} className="btn btn-ghost">Instagram</a>}</div>
      </section>
    </>
  );
}
