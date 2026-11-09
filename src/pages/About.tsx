import { Link } from "react-router-dom";
import { Seo, breadcrumbs } from "../components/Seo";
import { Needle, Squeegee, Registration, Van, Marque } from "../components/Icons";
import { PhotoSlot } from "../components/PhotoSlot";
import { SITE } from "../data/site";

/** Map-pin diagram: Tooting as a pin on a few simple rectangles for the high street. Decorative. */
function AreaDiagram() {
  return (
    <svg viewBox="0 0 320 200" aria-hidden="true" className="w-full">
      <rect width="320" height="200" fill="#e6dfd0" />
      <g fill="#f3eee4" stroke="#1b1916" strokeWidth="1.5">
        {[[20, 120, 50, 60], [80, 100, 40, 80], [130, 130, 60, 50], [200, 90, 46, 90], [256, 120, 50, 60]].map(([x, y, w, h], i) => <rect key={i} x={x} y={y} width={w} height={h} />)}
      </g>
      <path d="M0 180H320" stroke="#1b1916" strokeWidth="1.5" strokeDasharray="8 6" />
      <path d="M160 132 L150 110 H170 Z" fill="#1b1916" />
      <rect x="128" y="46" width="64" height="64" rx="3" fill="#1b1916" />
      <path d="M143 57V63M143 72V78M143 87V93H151M159 93H165M173 93H179" fill="none" stroke="#f4651f" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function About() {
  return (
    <>
      <Seo title="About and visit: the workshop in Tooting" path="/about" description="The London Logo Lab is an embroidery and print workshop in Tooting, South London. How we work, what to bring, and how to find us."
        jsonLd={[breadcrumbs([{ name: "Home", path: "/" }, { name: "About & visit", path: "/about" }]), { "@context": "https://schema.org", "@type": "AboutPage", name: "About The London Logo Lab" }]} />

      <section className="on-ink relative overflow-hidden bg-ink text-paper">
        <div className="rule-grid absolute inset-0" aria-hidden="true" />
        <div className="wrap relative grid items-center gap-10 py-14 lg:grid-cols-[1.2fr_1fr] lg:py-20">
          <div className="flex flex-col gap-6">
            <nav aria-label="Breadcrumb" className="text-[14px] text-paper-mute"><Link to="/" className="inline-flex min-h-11 items-center underline">Home</Link> · About &amp; visit</nav>
            <h1 className="text-[42px] sm:text-[64px] lg:text-[72px]">A friendly workshop in Tooting.</h1>
            <p className="max-w-xl text-[18px] text-paper-mute">We stitch and print logos for trades, schools and sports clubs. Come in, show us your logo, and we'll help you get it right. Part of the I&amp;A family.</p>
          </div>
          <Marque size={200} tile="#f4651f" thread="#1b1916" className="hidden justify-self-end lg:block" />
        </div>
      </section>

      <section className="wrap grid gap-10 py-16 lg:grid-cols-2 lg:py-20">
        <div className="flex flex-col gap-4">
          <p className="label text-mute">The workshop</p>
          <h2 className="text-[32px] sm:text-[44px]">What happens behind the counter</h2>
          <p className="text-[17px]">Your logo comes in and we check it. We get it ready to stitch or print. You get a proof. Once you say yes, we make it, check it, fold it and bag it. One shirt or a hundred, ready {SITE.turnaround}.</p>
          <ul className="mt-2 grid gap-4 sm:grid-cols-2">
            {[{ I: Needle, t: "Embroidery", d: "Logos stitched here. Machines: [MACHINES]" }, { I: Squeegee, t: "Printing", d: "Screen printing, DTF and vinyl" }, { I: Registration, t: "Your logo", d: "We get it ready to stitch or print" }, { I: Van, t: "Getting it to you", d: "Collection or delivery: [DELIVERY OPTIONS]" }].map((x) => (
              <li key={x.t} className="flex gap-3 border-t-2 border-ink pt-3"><x.I size={28} className="shrink-0 text-rust" /><div><h3 className="text-base">{x.t}</h3><p className="text-mute">{x.d}</p></div></li>
            ))}
          </ul>
        </div>
        <PhotoSlot shows="The embroidery machine mid-run, a club crest half stitched." className="min-h-[320px] lg:min-h-0" />
      </section>

      <section className="bg-stone py-16 lg:py-20">
        <div className="wrap grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div className="flex flex-col gap-4">
            <p className="label text-mute">Visit</p>
            <h2 className="text-[32px] sm:text-[44px]">Come and see us</h2>
            <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-3">
              {[["Address", SITE.address], ["Hours", SITE.hours], ["Phone", SITE.phone], ["Email", SITE.email], ["Nearest", "[NEAREST STATION], [BUS ROUTES]"], ["Parking", "[PARKING NOTE]"]].map(([k, v]) => <div key={k} className="contents"><dt className="font-semibold">{k}</dt><dd className="text-mute">{v}</dd></div>)}
            </dl>
            <h3 className="mt-4 text-lg">What to bring</h3>
            <p className="text-mute">Your logo, on your phone is fine. A garment you like, if you have one. A rough number, even if it's one. We'll do the rest at the counter, or you can <Link to="/quote" className="underline">build the quote first</Link> and bring the summary.</p>
            <div className="mt-2 flex flex-wrap gap-3"><Link to="/quote" className="btn btn-ink">Build a quote</Link>{SITE.social.instagram.startsWith("http") && <a href={SITE.social.instagram} className="btn btn-ghost">Instagram</a>}</div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="overflow-hidden rounded-pill border-2 border-ink"><AreaDiagram /></div>
            <p className="text-mute">Map and directions come with the confirmed address.</p>
          </div>
        </div>
      </section>

    </>
  );
}
