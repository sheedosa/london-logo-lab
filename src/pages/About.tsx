import { Link } from "react-router-dom";
import { Seo, breadcrumbs } from "../components/Seo";
import { Needle, Squeegee, Registration, Van, Marque } from "../components/Icons";
import { img } from "../lib/store";
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
      <path d="M160 40c-16 0-28 12-28 28 0 20 28 52 28 52s28-32 28-52c0-16-12-28-28-28Z" fill="#f4651f" stroke="#1b1916" strokeWidth="1.5" />
      <circle cx="160" cy="68" r="9" fill="#1b1916" />
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
            <nav aria-label="Breadcrumb" className="text-sm text-paper-mute"><Link to="/" className="inline-flex min-h-11 items-center underline">Home</Link> · About &amp; visit</nav>
            <h1 className="text-[44px] sm:text-[64px] lg:text-[72px]">A workshop, not a web form.</h1>
            <p className="max-w-xl text-[18px] text-paper-mute">The London Logo Lab is an embroidery and print workshop in {SITE.area}, part of the I&amp;A family. Machines, thread, screens and people you can talk to, [MINUTES] minutes from the Tube.</p>
          </div>
          <Marque size={200} tile="#f4651f" thread="#1b1916" className="hidden justify-self-end lg:block" />
        </div>
      </section>

      <section className="wrap grid gap-10 py-16 lg:grid-cols-2 lg:py-20">
        <div className="flex flex-col gap-4">
          <p className="label text-mute">The workshop</p>
          <h2 className="text-[32px] sm:text-[44px]">What happens behind the counter.</h2>
          <p className="text-[17px]">Artwork comes in, gets checked and digitised. Garments come off the shelf or in from the supplier. Thread is matched, a proof goes out, and once it is approved the job runs on [MACHINES]. Everything is checked, folded and bagged here, by the people who made it.</p>
          <ul className="mt-2 grid gap-4 sm:grid-cols-2">
            {[{ I: Needle, t: "Embroidery", d: "[N]-head machines, [THREAD RANGE] thread colours" }, { I: Squeegee, t: "Print", d: "Screen and digital, [MAX PRINT SIZE]" }, { I: Registration, t: "Artwork", d: "Digitising and redraws in house" }, { I: Van, t: "Delivery", d: "Collection in Tooting; delivery [DELIVERY AREA]" }].map((x) => (
              <li key={x.t} className="flex gap-3 border-t-2 border-ink pt-3"><x.I size={28} className="shrink-0 text-rust" /><div><h3 className="text-base">{x.t}</h3><p className="text-sm text-mute">{x.d}</p></div></li>
            ))}
          </ul>
        </div>
        <img src={img("products/shirts")} alt="Folded shirts stacked on a shelf, sleeves and collars aligned" loading="lazy" width="1100" height="1375" className="aspect-[4/5] w-full rounded-pill border-2 border-ink object-cover" />
      </section>

      <section className="bg-stone py-16 lg:py-20">
        <div className="wrap grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div className="flex flex-col gap-4">
            <p className="label text-mute">Visit</p>
            <h2 className="text-[32px] sm:text-[44px]">{SITE.area}.</h2>
            <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-3">
              {[["Address", SITE.address], ["Hours", SITE.hours], ["Phone", SITE.phone], ["Email", SITE.email], ["Nearest", "[NEAREST STATION], [BUS ROUTES]"], ["Parking", "[PARKING NOTE]"]].map(([k, v]) => <div key={k} className="contents"><dt className="font-semibold">{k}</dt><dd className="text-mute">{v}</dd></div>)}
            </dl>
            <h3 className="mt-4 text-lg">What to bring</h3>
            <p className="text-mute">Your logo on a stick or by email (vector if you have it), a garment you like if you have one, and a rough number. We can do the rest at the counter, or you can <Link to="/quote" className="underline">build the quote first</Link> and bring the summary.</p>
            <div className="mt-2 flex flex-wrap gap-3"><Link to="/quote" className="btn btn-ink">Build a quote</Link><a href={SITE.social.instagram} className="btn btn-ghost">Instagram</a></div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="overflow-hidden rounded-pill border-2 border-ink"><AreaDiagram /></div>
            <p className="text-sm text-mute">Map and directions come with the confirmed address.</p>
          </div>
        </div>
      </section>

    </>
  );
}
