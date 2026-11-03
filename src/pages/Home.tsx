import { Link } from "react-router-dom";
import { Seo } from "../components/Seo";
import { HeroQuote } from "../components/HeroQuote";
import { GarmentCard } from "../components/GarmentCard";
import { Garment } from "../components/Garment";
import { Needle, Squeegee, Van, Spool, StitchRule } from "../components/Icons";
import { store } from "../lib/store";
import { SECTORS, SITE, STEPS } from "../data/site";

const SERVICES = [
  { to: "/services#embroidery", t: "Embroidery", d: "Logos digitised and stitched. Polos, fleeces, caps, softshells.", I: Needle },
  { to: "/services#print", t: "Print", d: "Screen and digital print for tees, hoodies, hi-vis and event runs.", I: Squeegee },
  { to: "/services#workwear", t: "Workwear supply", d: "Plain or decorated, from one polo to a van load, from brands you know.", I: Van },
  { to: "/services#uniforms", t: "Uniform programmes", d: "A saved spec per team so re-orders take a message, not a meeting.", I: Spool },
];

export function Home() {
  const featured = ["classic-polo", "pullover-hoodie", "softshell-jacket", "bib-apron"].map((h) => store.garment(h)!);
  return (
    <>
      <Seo title="Embroidery, print and workwear with a live mock-up quote" path="/" description="The London Logo Lab embroiders and prints logos on polos, hoodies, hi-vis, caps and aprons in Tooting, South London. Build a quote with a live mock-up, upload your logo, see a sample estimate by quantity band." />

      <section className="on-ink relative overflow-hidden bg-ink text-paper">
        <div className="rule-grid absolute inset-0" aria-hidden="true" />
        <div className="wrap relative grid items-center gap-8 py-6 sm:py-14 lg:grid-cols-[1.1fr_1fr] lg:gap-10 lg:py-20">
          <div className="flex flex-col gap-6">
            <p className="label text-orange">Embroidery · Print · Workwear · {SITE.area}</p>
            <h1 className="text-[44px] text-paper sm:text-[72px] lg:text-[84px]">Your logo,<br />stitched in<br />Tooting.</h1>
            <p className="max-w-lg text-[18px] text-paper-mute">Polos, hoodies, hi-vis, caps and aprons with your logo on them, embroidered and printed in our South London workshop. See it on the garment before you order.</p>
            <div className="flex flex-wrap gap-3">
              <Link to="/quote" className="btn btn-orange">Build a quote</Link>
              <Link to="/garments" className="btn btn-outline-paper">See the garments</Link>
            </div>
          </div>
          <div className="order-first lg:order-last"><HeroQuote /></div>
        </div>
      </section>

      <section className="wrap grid gap-6 py-14 sm:grid-cols-2 lg:grid-cols-4">
        {SERVICES.map((s) => (
          <Link key={s.t} to={s.to} className="group flex flex-col gap-3 border-t-2 border-ink pt-5">
            <s.I size={32} className="text-rust" />
            <h2 className="font-sans text-xl font-semibold group-hover:underline">{s.t}</h2>
            <p className="text-mute">{s.d}</p>
          </Link>
        ))}
      </section>

      <section className="bg-stone py-16 sm:py-20">
        <div className="wrap">
          <div className="mb-10 flex max-w-2xl flex-col gap-3">
            <p className="label text-mute">Who it's for</p>
            <h2 className="text-[32px] sm:text-[44px]">Trades, schools, kitchens, offices.</h2>
            <p className="text-[17px]">Anyone who needs the same logo on a lot of chests. Small runs welcome: [MINIMUM ORDER].</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {SECTORS.map((s, i) => {
              const g = store.garment(["softshell-jacket", "pullover-hoodie", "bib-apron", "classic-polo"][i])!;
              return (
                <Link key={s.k} to={s.k === "schools" ? "/schools-and-clubs" : "/quote"} className="group flex flex-col rounded-pill border-2 border-ink bg-paper p-5 transition-colors hover:bg-orange">
                  <Garment kind={g.kind} colour={g.colours[0].hex} positions={[g.positions[0]]} title={g.title} className="mb-3 h-28 w-28 self-end" />
                  <h3 className="text-xl">{s.t}</h3>
                  <p className="mt-1 text-sm text-mute group-hover:text-ink">{s.d}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="wrap py-16 sm:py-20">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-[32px] sm:text-[44px]">How it works</h2>
          <Link to="/services" className="label inline-flex min-h-11 items-center underline">All services</Link>
        </div>
        <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s) => (
            <li key={s.n} className="flex flex-col gap-3">
              <span className="display text-[64px] leading-none text-rust" aria-hidden="true">{s.n}</span>
              <StitchRule className="text-ink" />
              <h3 className="text-xl">{s.t}</h3>
              <p className="text-mute">{s.d}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="wrap pb-16">
        <div className="rounded-pill border-2 border-ink bg-stone p-6 sm:p-8">
          <p className="label mb-5 text-mute">Turnaround, minimums and setup: to be confirmed by the workshop</p>
          <dl className="grid gap-6 sm:grid-cols-3">
            {[["Standard turnaround", "[TURNAROUND] from artwork approval to collection. Express: [EXPRESS TURNAROUND]."], ["Minimum order", "[MINIMUM ORDER]. One-offs and samples: [ONE-OFF POLICY]."], ["Logo setup", "£[SETUP] to digitise your logo for embroidery, once. Print screens: [SCREEN CHARGE]."]].map(([l, d]) => (
              <div key={l} className="border-t-2 border-ink pt-3"><dt className="font-semibold">{l}</dt><dd className="mt-1 text-mute">{d}</dd></div>
            ))}
          </dl>
        </div>
      </section>

      <section className="wrap pb-16 sm:pb-20">
        <div className="mb-8 flex items-end justify-between gap-4">
          <h2 className="text-[32px] sm:text-[40px]">Garments we decorate</h2>
          <Link to="/garments" className="label inline-flex min-h-11 items-center underline">All twelve</Link>
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 lg:grid-cols-4">{featured.map((g) => <GarmentCard key={g.handle} g={g} />)}</div>
      </section>

      <section className="bg-orange py-16 sm:py-20">
        <div className="wrap grid items-center gap-8 lg:grid-cols-[1.2fr_1fr]">
          <div className="flex flex-col gap-4">
            <p className="label">Schools &amp; clubs</p>
            <h2 className="text-[32px] sm:text-[44px]">PE kit, team kits and leavers' hoodies, named and numbered.</h2>
            <p className="text-[17px]">Crested polos, named hoodies, numbered shirts. One spec per school or club, sized and re-ordered without starting again.</p>
            <Link to="/schools-and-clubs" className="btn btn-ink self-start">Schools &amp; clubs</Link>
          </div>
          <div className="flex justify-center gap-2">
            {(["pullover-hoodie", "heavy-tee", "classic-polo"] as const).map((h, i) => { const g = store.garment(h)!; return <Garment key={h} kind={g.kind} colour={["#4c2a6e", "#f2f1ec", "#1e2a44"][i]} positions={[i === 1 ? "back" : "left-chest"]} view={i === 1 ? "back" : "front"} title={g.title} className="w-1/3 max-w-[180px]" />; })}
          </div>
        </div>
      </section>

      <section className="wrap grid gap-6 py-16 lg:grid-cols-2">
        <div className="relative flex min-h-[280px] items-end rounded-pill border-2 border-ink bg-stone p-5">
          <p className="label text-mute" aria-hidden="true">Photo: finished embroidery on a navy fleece</p>
        </div>
        <figure className="flex flex-col justify-between gap-6 rounded-pill border-2 border-ink p-8">
          <blockquote className="display text-[28px] sm:text-[32px]">“[Client review, to come]”</blockquote>
          <figcaption className="text-sm text-mute">[CLIENT NAME], [TRADE OR ORGANISATION]</figcaption>
        </figure>
      </section>

      <section className="wrap flex flex-wrap items-center justify-between gap-6 border-t-2 border-ink pt-12">
        <div className="flex max-w-xl flex-col gap-2">
          <p className="label text-mute">The workshop</p>
          <h2 className="text-[32px] sm:text-[40px]">{SITE.area}.</h2>
          <p className="text-mute">{SITE.address}. Open {SITE.hours}. Bring a garment and a logo, or a van and a team.</p>
        </div>
        <div className="flex flex-wrap gap-3"><Link to="/quote" className="btn btn-ink">Build a quote</Link><Link to="/about" className="btn btn-ghost">Visit</Link></div>
      </section>
    </>
  );
}
