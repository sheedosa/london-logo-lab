import { Link } from "react-router-dom";
import { Seo } from "../components/Seo";
import { HeroTicket } from "../components/HeroTicket";
import { Garment } from "../components/Garment";
import { MethodCloseUp } from "../components/MethodCloseUp";
import { PhotoSlot } from "../components/PhotoSlot";
import { VLink, garmentVT } from "../components/VLink";
import { store, type Method } from "../lib/store";
import { SECTORS, SITE, STEPS } from "../data/site";

const DECORATION: { id: Method; to: string; t: string; d: string }[] = [
  { id: "embroidery", to: "/services#embroidery", t: "Embroidery", d: "Stitched logos that last. Polos, fleece, caps." },
  { id: "screen", to: "/services#screen", t: "Screen printing", d: "Bold colours. Great value on bigger runs." },
  { id: "dtf", to: "/services#dtf", t: "DTF printing", d: "Full colour and fine detail, even for one." },
  { id: "vinyl", to: "/services#vinyl", t: "Vinyl", d: "Names and numbers, sharp and clean." },
];

export function Home() {
  const softshell = store.garment("softshell-jacket")!, vest = store.garment("hi-vis-vest")!, polo = store.garment("classic-polo")!, tee = store.garment("heavy-tee")!;
  const [trades, schools, clubs] = SECTORS;
  return (
    <>
      <Seo title="Embroidery, printing and workwear in Tooting, from one item" path="/" description="The London Logo Lab puts your logo on polos, hoodies, hi-vis, caps and aprons: embroidery, screen printing, DTF and vinyl in Tooting, South London. From 1 item, ready within 7 days. See it on the garment before you order." />

      {/* The hero is the job ticket itself. It hangs over the bottom edge of the ink band at desktop widths. */}
      <section className="on-ink bg-ink text-paper">
        <div className="wrap grid gap-7 pb-10 pt-8 sm:pt-12 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1fr)] lg:items-start lg:gap-12 lg:pb-14 lg:pt-10 xl:gap-16">
          <div className="flex flex-col gap-5 lg:sticky lg:top-28 lg:gap-7 lg:pt-4">
            <h1 className="t-hero">Got a logo? We'll put it on your kit.</h1>
            <p className="t-lede text-paper-mute">Polos, hoodies, hi-vis, caps and aprons. Stitched or printed in our Tooting workshop. You see it on the garment before you order.</p>
            <p className="hidden max-w-[30em] text-paper-mute lg:block">Start the ticket here: pick a garment and how many. Your choices follow you to the full quote.</p>
          </div>
          <HeroTicket />
        </div>
      </section>

      {/* Four ways to decorate, each with its close-up; the two supply services as plain lines underneath */}
      <section className="wrap band grid gap-x-12 gap-y-8 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1fr)]">
        <div className="flex flex-col gap-4 lg:sticky lg:top-28 lg:self-start">
          <h2>Four ways to put a logo on.</h2>
          <p className="measure text-mute">Not sure which? Tell us what it's for and we'll suggest one.</p>
          <Link to="/services" className="link self-start">Compare the four</Link>
        </div>
        <div>
          <ul className="border-t-2 border-ink">
            {DECORATION.map((s) => (
              <li key={s.id} className="border-b border-ink">
                <Link to={s.to} className="group grid grid-cols-[72px_minmax(0,1fr)] items-center gap-x-5 py-4 sm:grid-cols-[88px_minmax(0,0.8fr)_minmax(0,1fr)]">
                  <MethodCloseUp method={s.id} decorative className="row-span-2 w-full sm:row-span-1" />
                  <h3 className="underline-offset-4 group-hover:underline">{s.t}</h3>
                  <p className="text-mute">{s.d}</p>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-8 grid gap-x-10 gap-y-6 sm:grid-cols-2">
            <p><Link to="/services#workwear" className="font-semibold underline decoration-2 underline-offset-4">Workwear supply.</Link> We supply the garments too, plain or decorated. One polo or a van load.</p>
            <p><Link to="/services#uniforms" className="font-semibold underline decoration-2 underline-offset-4">Uniforms.</Link> We keep your spec on file, so a re-order is just a message.</p>
          </div>
        </div>
      </section>

      {/* Who it's for. Three customers, three different compositions. */}
      <section className="wrap pb-10 sm:pb-14">
        <h2 className="max-w-[14em]">Trades, schools and sports clubs.</h2>
        <p className="t-lede mt-4">Need one shirt? That's fine. Need a whole squad? Also fine.</p>
      </section>

      {/* Trades: a full-bleed ink band, the jacket front and the hi-vis back side by side, large */}
      <section className="on-ink bg-ink text-paper">
        <div className="wrap grid items-end gap-8 py-12 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] md:py-0 lg:gap-16">
          <div className="flex flex-col gap-4 md:py-20">
            <h3 className="t-section">{trades.t}</h3>
            <p className="t-lede text-paper-mute">{trades.d}</p>
            <VLink to={trades.to} className="btn btn-orange mt-2 self-start">Build a quote</VLink>
          </div>
          <div className="grid grid-cols-2 gap-3 md:pt-12">
            <div className="rounded-t-xs bg-stone px-3 pt-4 sm:px-6 sm:pt-8"><Garment kind={softshell.kind} colour="#1f1d1b" positions={["left-chest"]} title={`${softshell.title} for trades`} className="w-full" /></div>
            <div className="rounded-t-xs bg-stone px-3 pt-4 sm:px-6 sm:pt-8"><Garment kind={vest.kind} colour="#e7f23a" positions={["back"]} view="back" title={`${vest.title} for trades, back`} className="w-full" /></div>
          </div>
        </div>
      </section>

      {/* Schools: contained, the drawing pair on the left, plain text and the facts on the right */}
      <section className="wrap band grid items-center gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:gap-16">
        <div className="grid grid-cols-2 gap-3 md:order-1">
          <Garment kind={polo.kind} colour="#1f4a36" positions={["left-chest"]} title={`${polo.title} for schools, front with crest position`} className="w-full" />
          <Garment kind={polo.kind} colour="#1f4a36" positions={["back"]} view="back" logo={{ kind: "text", text: "ST ANNE'S" }} title={`${polo.title} for schools, back with the school name`} className="w-full" />
        </div>
        <div className="flex flex-col gap-4 md:order-2">
          <h3 className="t-section">{schools.t}</h3>
          <p className="t-lede">{schools.d}</p>
          <p className="measure text-mute">Crests on the chest. We keep one spec per school, so next term's order is easy.</p>
          <Link to={schools.to} className="btn btn-ink mt-2 self-start">Kit for schools</Link>
        </div>
      </section>

      {/* Sports clubs: an orange band with the squad lined up, backs to us */}
      <section className="on-orange overflow-hidden bg-orange">
        <div className="wrap grid items-center gap-6 pt-12 lg:grid-cols-[minmax(0,0.62fr)_minmax(0,1fr)] lg:gap-10 lg:py-16">
          <div className="flex flex-col gap-4">
            <h3 className="t-section">{clubs.t}</h3>
            <p className="t-lede">{clubs.d}</p>
            <Link to={`${clubs.to}#clubs`} className="btn btn-ink mt-2 self-start">Kit for clubs</Link>
          </div>
          <div className="-mx-2 grid grid-cols-3 items-end lg:mx-0">
            {["SMITH 9", "PATEL 10", "JONES 4"].map((n, i) => <Garment key={n} kind={tee.kind} colour="#b4262a" positions={["back"]} view="back" logo={{ kind: "text", text: n }} title={`${tee.title} for sports clubs, back with ${n}`} className={`w-full ${i === 1 ? "lg:-translate-y-6" : ""}`} />)}
          </div>
        </div>
      </section>

      {/* How it works: a real sequence, so it is numbered */}
      <section className="wrap band grid gap-x-12 gap-y-8 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1fr)]">
        <div className="flex flex-col gap-5 lg:sticky lg:top-28 lg:self-start">
          <h2>How it works</h2>
          <Link to="/quote" className="btn btn-ghost self-start">Start a quote</Link>
        </div>
        <ol className="border-t-2 border-ink">
          {STEPS.map((s, i) => (
            <li key={s.n} className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-4 border-b border-ink py-5 sm:grid-cols-[3.5rem_minmax(0,0.8fr)_minmax(0,1fr)] sm:gap-x-6">
              <span className="t-num text-rust" aria-hidden="true">{i + 1}</span>
              <h3 className="self-center">{s.t}</h3>
              <p className="col-start-2 text-mute sm:col-start-3">{s.d}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* The range as a rail: all twelve, bleeding off the right edge */}
      <section className="bg-stone py-14 sm:py-20">
        <div className="wrap flex flex-wrap items-end justify-between gap-x-8 gap-y-2">
          <h2>Garments we decorate</h2>
          <Link to="/garments" className="link">See all {store.garments().length} with colours and positions</Link>
        </div>
        <div className="wrap mt-8 !pr-0">
          <ul className="rail pr-4 sm:pr-8">
            {store.garments().map((g) => { const c = g.colours[Math.min(1, g.colours.length - 1)]; return (
              <li key={g.handle} className="w-[42vw] max-w-[200px] sm:w-[200px]">
                <VLink to={`/garments/${g.handle}`} className="group flex flex-col gap-2">
                  <div className="rounded-xs bg-paper p-3" style={garmentVT(g.handle)}><Garment kind={g.kind} colour={c.hex} title={g.title} className="w-full" /></div>
                  <span className="font-semibold underline-offset-4 group-hover:underline">{g.title}</span>
                </VLink>
              </li>
            ); })}
          </ul>
        </div>
      </section>

      {/* A line from the workshop, beside the first photo slot */}
      <section className="wrap band grid gap-8 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] md:items-center lg:gap-16">
        <PhotoSlot shows="Finished embroidery on a navy fleece, close up." className="min-h-[260px] md:min-h-[340px]" />
        <figure className="flex flex-col gap-4">
          <blockquote className="t-quote">Bring your logo on your phone. We'll show you how it looks on the garment and help you choose thread or print. One shirt is never too small a job.</blockquote>
          <figcaption className="text-mute">The team at {SITE.name}</figcaption>
        </figure>
      </section>

      <section className="wrap">
        <div className="grid gap-6 border-t-2 border-ink pt-10 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
          <div className="flex flex-col gap-3">
            <h2>Come and see us in Tooting, South London.</h2>
            <p className="text-mute">Address: {SITE.address}. Opening hours: {SITE.hours}.</p>
          </div>
          <Link to="/about" className="btn btn-ghost self-start md:self-auto">Visit the workshop</Link>
        </div>
      </section>
    </>
  );
}
