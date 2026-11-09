import { Link } from "react-router-dom";
import { Seo } from "../components/Seo";
import { HeroQuote } from "../components/HeroQuote";
import { GarmentCard } from "../components/GarmentCard";
import { Garment } from "../components/Garment";
import { PhotoSlot } from "../components/PhotoSlot";
import { Needle, Squeegee, Van, Spool, StitchRule, InkDrop, Registration } from "../components/Icons";
import { store } from "../lib/store";
import { SECTORS, SITE, STEPS } from "../data/site";

const DECORATION = [
  { to: "/services#embroidery", t: "Embroidery", d: "Stitched logos that last. Polos, fleece, caps.", I: Needle },
  { to: "/services#screen", t: "Screen printing", d: "Bold colours. Great value on bigger runs.", I: Squeegee },
  { to: "/services#dtf", t: "DTF printing", d: "Full colour and fine detail, even for one.", I: InkDrop },
  { to: "/services#vinyl", t: "Vinyl", d: "Names and numbers, sharp and clean.", I: Registration },
];

export function Home() {
  const featured = ["classic-polo", "pullover-hoodie", "softshell-jacket", "bib-apron"].map((h) => store.garment(h)!);
  const softshell = store.garment("softshell-jacket")!, vest = store.garment("hi-vis-vest")!, polo = store.garment("classic-polo")!, tee = store.garment("heavy-tee")!;
  return (
    <>
      <Seo title="Embroidery, printing and workwear in Tooting, from one item" path="/" description="The London Logo Lab puts your logo on polos, hoodies, hi-vis, caps and aprons: embroidery, screen printing, DTF and vinyl in Tooting, South London. From 1 item, ready within 7 days. See it on the garment before you order." />

      <section className="on-ink relative overflow-hidden bg-ink text-paper">
        <div className="rule-grid absolute inset-0" aria-hidden="true" />
        <div className="wrap relative grid items-center gap-8 py-8 sm:py-14 lg:grid-cols-[1.1fr_1fr] lg:gap-12 lg:py-20">
          <div className="flex flex-col gap-5 sm:gap-6">
            <p className="label text-orange">Embroidery · Printing · Workwear · Tooting</p>
            <h1 className="text-[42px] text-paper sm:text-[68px] lg:text-[78px]">Got a logo? We'll put it on your kit.</h1>
            <p className="max-w-lg text-[18px] text-paper-mute">Polos, hoodies, hi-vis, caps and aprons. Stitched or printed in our Tooting workshop. You see it on the garment before you order.</p>
            <dl className="grid max-w-lg grid-cols-3 gap-px overflow-hidden rounded-pill border-2 border-paper-mute bg-paper-mute">
              {[["Minimum order", SITE.minimumOrder], ["Ready", SITE.turnaround], ["Priced", "per item"]].map(([k, v]) => (
                <div key={k} className="flex flex-col bg-ink px-3 py-2.5"><dt className="label text-[11px] text-paper-mute">{k}</dt><dd className="font-semibold text-paper">{v}</dd></div>
              ))}
            </dl>
            <div className="flex flex-wrap gap-3">
              <Link to="/quote" className="btn btn-orange">Build a quote</Link>
              <Link to="/garments" className="btn btn-outline-paper">See the garments</Link>
            </div>
          </div>
          <div className="lg:m-2"><HeroQuote /></div>
        </div>
      </section>

      {/* Services: four ways to decorate as a compact list, the two supply services as larger blocks */}
      <section className="wrap grid gap-10 py-14 lg:grid-cols-[1.3fr_1fr] lg:py-20">
        <div>
          <p className="label mb-2 text-mute">What we do</p>
          <h2 className="mb-6 text-[32px] sm:text-[40px]">Four ways to put a logo on.</h2>
          <ul className="border-t-2 border-ink">
            {DECORATION.map((s) => (
              <li key={s.t} className="border-b border-line">
                <Link to={s.to} className="group grid min-h-16 grid-cols-[32px_1fr] items-center gap-x-4 py-3 sm:grid-cols-[32px_200px_1fr]">
                  <s.I size={28} className="text-rust" />
                  <h3 className="text-lg group-hover:underline">{s.t}</h3>
                  <p className="col-start-2 text-mute sm:col-start-3">{s.d}</p>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-mute">Not sure which? Tell us what it's for and we'll suggest one.</p>
        </div>
        <div className="flex flex-col gap-4">
          <Link to="/services#workwear" className="group flex flex-1 flex-col gap-2 rounded-pill bg-stone p-6">
            <Van size={32} className="text-rust" />
            <h3 className="text-xl group-hover:underline">Workwear supply</h3>
            <p className="text-mute">We supply the garments too, plain or decorated. One polo or a van load.</p>
          </Link>
          <Link to="/services#uniforms" className="group on-ink flex flex-1 flex-col gap-2 rounded-pill bg-ink p-6 text-paper">
            <Spool size={32} className="text-orange" />
            <h3 className="text-xl group-hover:underline">Uniforms</h3>
            <p className="text-paper-mute">We keep your spec on file, so a re-order is just a message.</p>
          </Link>
        </div>
      </section>

      {/* Who it's for: one large panel, two smaller rows, each with its own garment and colour */}
      <section className="bg-stone py-16 sm:py-20">
        <div className="wrap">
          <div className="mb-10 flex max-w-2xl flex-col gap-3">
            <p className="label text-mute">Who it's for</p>
            <h2 className="text-[32px] sm:text-[44px]">Trades, schools and sports clubs.</h2>
            <p className="text-[17px]">Need one shirt? That's fine. Need a whole squad? Also fine.</p>
          </div>
          <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
            <Link to={SECTORS[0].to} className="group on-ink flex flex-col justify-between gap-6 rounded-pill bg-ink p-6 text-paper sm:p-8">
              <div className="flex justify-center gap-2 sm:justify-start">
                <Garment kind={softshell.kind} colour="#1f1d1b" positions={["left-chest"]} title={`${softshell.title} for trades`} className="w-36 rounded-pill bg-stone p-2 sm:w-44" />
                <Garment kind={vest.kind} colour="#e7f23a" positions={["back"]} view="back" title={`${vest.title} for trades`} className="w-36 rounded-pill bg-stone p-2 sm:w-44" />
              </div>
              <div>
                <h3 className="text-2xl group-hover:underline">{SECTORS[0].t}</h3>
                <p className="mt-1 max-w-md text-paper-mute">{SECTORS[0].d}</p>
              </div>
            </Link>
            <div className="flex flex-col gap-4">
              {([[SECTORS[1], polo, "#1f4a36", "front"], [SECTORS[2], tee, "#b4262a", "back"]] as const).map(([s, g, c, view]) => (
                <Link key={s.k} to={s.to} className="group grid flex-1 grid-cols-[88px_1fr] items-center gap-4 rounded-pill border-2 border-ink bg-paper p-4 transition-colors hover:bg-orange sm:grid-cols-[112px_1fr] sm:p-5">
                  <Garment kind={g.kind} colour={c} positions={[view === "back" ? "back" : "left-chest"]} view={view} logo={view === "back" ? { kind: "text", text: "SMITH 9" } : null} title={`${g.title} for ${s.t.toLowerCase()}`} className="w-full" />
                  <div>
                    <h3 className="text-xl group-hover:underline">{s.t}</h3>
                    <p className="mt-1 text-mute group-hover:text-ink">{s.d}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="wrap py-16 sm:py-20">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-[32px] sm:text-[44px]">How it works</h2>
          <Link to="/quote" className="btn btn-ghost">Start a quote</Link>
        </div>
        <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s) => (
            <li key={s.n} className="flex flex-col gap-3">
              <span className="display text-[56px] leading-none text-rust" aria-hidden="true">{s.n}</span>
              <StitchRule className="text-ink" />
              <h3 className="text-xl">{s.t}</h3>
              <p className="text-mute">{s.d}</p>
            </li>
          ))}
        </ol>
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
            <p className="label">Schools &amp; sports clubs</p>
            <h2 className="text-[32px] sm:text-[44px]">PE kit, team kit and leavers' hoodies.</h2>
            <p className="text-[17px]">Crests on the chest. Names and numbers on the back. We keep one spec per school or club, so next term's order is easy.</p>
            <Link to="/schools-and-clubs" className="btn btn-ink self-start">Schools &amp; clubs</Link>
          </div>
          <div className="flex justify-center gap-2">
            {(["pullover-hoodie", "heavy-tee", "classic-polo"] as const).map((h, i) => { const g = store.garment(h)!; return <Garment key={h} kind={g.kind} colour={["#4c2a6e", "#f2f1ec", "#1e2a44"][i]} positions={[i === 1 ? "back" : "left-chest"]} view={i === 1 ? "back" : "front"} logo={i === 1 ? { kind: "text", text: "JONES 4" } : null} title={g.title} className="w-1/3 max-w-[180px]" />; })}
          </div>
        </div>
      </section>

      {/* A human line from the workshop, beside the first photo slot */}
      <section className="wrap grid gap-6 py-16 lg:grid-cols-2">
        <PhotoSlot shows="Finished embroidery on a navy fleece, close up." className="min-h-[260px]" />
        <div className="flex flex-col justify-center gap-4 rounded-pill border-2 border-ink p-6 sm:p-8">
          <p className="label text-mute">From the workshop</p>
          <p className="text-[22px] leading-snug sm:text-[24px]">Bring your logo on your phone. We'll show you how it looks on the garment and help you choose thread or print. One shirt is never too small a job.</p>
          <p className="text-mute">The team at {SITE.name}</p>
        </div>
      </section>

      <section className="wrap flex flex-wrap items-center justify-between gap-6 border-t-2 border-ink pt-12">
        <div className="flex max-w-xl flex-col gap-2">
          <p className="label text-mute">Come and see us</p>
          <h2 className="text-[32px] sm:text-[40px]">Tooting, South London.</h2>
          <p className="text-mute">Address: {SITE.address}. Opening hours: {SITE.hours}.</p>
        </div>
        <div className="flex flex-wrap gap-3"><Link to="/quote" className="btn btn-ink">Build a quote</Link><Link to="/about" className="btn btn-ghost">Visit</Link></div>
      </section>
    </>
  );
}
