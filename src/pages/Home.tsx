import { Link } from "react-router-dom";
import { Seo } from "../components/Seo";
import { HeroTicket } from "../components/HeroTicket";
import { Garment } from "../components/Garment";
import { MethodCloseUp } from "../components/MethodCloseUp";
import { PhotoSlot } from "../components/PhotoSlot";
import { Steps } from "../components/Steps";
import { VLink, garmentVT } from "../components/VLink";
import { store, type Method } from "../lib/store";
import { SECTORS, SITE, STEPS } from "../data/site";
import { CONTACT } from "../lib/contact";

const DECORATION: { id: Method; to: string; t: string; d: string }[] = [
  { id: "embroidery", to: "/services#embroidery", t: "Embroidery", d: "Stitched logos and crests on polos, fleece and caps." },
  { id: "screen", to: "/services#screen", t: "Screen printing", d: "Flat, solid ink in a few colours. Suits bigger runs." },
  { id: "dtf", to: "/services#dtf", t: "DTF printing", d: "Full colour and fine detail, from one piece." },
  { id: "vinyl", to: "/services#vinyl", t: "Vinyl", d: "Names, numbers and one-colour logos with clean edges." },
];

export function Home() {
  const softshell = store.garment("softshell-jacket")!, vest = store.garment("hi-vis-vest")!, polo = store.garment("classic-polo")!, tee = store.garment("heavy-tee")!;
  const [trades, schools, clubs] = SECTORS;
  return (
    <>
      <Seo title="Embroidery, printing and workwear in Tooting, from one item" path="/" description="The London Logo Lab puts your logo on polos, hoodies, hi-vis, caps and aprons: embroidery, screen printing, DTF and vinyl in Tooting, South London. From 1 item, ready within 7 days. See it on the garment before you order." />

      {/* An orange field. The headline runs the full width across the top; the working ticket and the drawing lie
          side by side beneath it, like a job on a print table. */}
      <section className="on-orange bg-orange">
        <div className="wrap pb-10 pt-8 sm:pt-12 lg:pb-16 lg:pt-14">
          <h1 className="t-hero">We put your logo on workwear and kit.</h1>
          <div className="mt-5 grid gap-x-12 gap-y-3 lg:mt-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.7fr)] lg:items-end">
            <p className="t-lede font-medium">Polos, hoodies, hi-vis, caps and aprons for trades, schools and sports clubs, made in our Tooting workshop. You see the logo on the garment before you order.</p>
            <p className="hidden lg:block">Start the ticket here: pick a garment and how many. Your choices follow you to the full quote.</p>
          </div>
          <div className="mt-7 lg:mt-10"><HeroTicket /></div>
        </div>
      </section>

      {/* Four ways to decorate: four columns, the drawn close-up large on top (two by two on a phone); the two
          supply services as plain lines underneath */}
      <section className="wrap band">
        <div className="flex flex-col items-center gap-3 text-center">
          <h2>Embroidery, screen printing, DTF and vinyl</h2>
          <p className="text-mute">Tell us what the garment is for and we'll suggest which of the four suits it.</p>
        </div>
        <ul className="mt-9 grid grid-cols-2 gap-x-5 gap-y-9 lg:mt-12 lg:grid-cols-4 lg:gap-x-10">
          {DECORATION.map((s) => (
            <li key={s.id}>
              <Link to={s.to} className="group flex flex-col items-center gap-2 text-center">
                <MethodCloseUp method={s.id} decorative className="mb-2 w-full max-w-[232px]" />
                <h3 className="underline-offset-4 group-hover:underline">{s.t}</h3>
                <p className="max-w-[17em] text-mute">{s.d}</p>
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-10 flex justify-center lg:mt-12"><Link to="/services" className="btn btn-ghost">Compare the four</Link></div>
        <div className="mt-10 grid gap-x-12 gap-y-5 border-t-2 border-ink pt-7 sm:grid-cols-2 lg:mt-14">
          <p><Link to="/services#workwear" className="font-semibold underline decoration-2 underline-offset-4">Workwear supply.</Link> We supply the garments too, plain or decorated. One polo or a van load.</p>
          <p><Link to="/services#uniforms" className="font-semibold underline decoration-2 underline-offset-4">Uniforms.</Link> We keep your spec on file, so a re-order is just a message.</p>
        </div>
      </section>

      {/* Who it's for. Three customers, three different compositions. */}
      <section className="wrap pb-8 sm:pb-10">
        <h2>Who we make it for</h2>
      </section>

      {/* Trades: a framed stone bench, the jacket front and the hi-vis back standing on its bottom edge */}
      <section className="wrap">
        <div className="grid items-end gap-x-8 gap-y-7 rounded-xs border-2 border-ink bg-stone px-5 pt-8 sm:px-8 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] md:pt-0 lg:gap-x-16 lg:px-12">
          <div className="flex flex-col gap-4 md:py-14 lg:py-20">
            <h3 className="t-section">{trades.t}</h3>
            <p className="t-lede">{trades.d}</p>
            <VLink to={trades.to} className="btn btn-orange mt-2 self-start">Build a quote</VLink>
          </div>
          <div className="grid grid-cols-2 gap-3 md:pt-10">
            <div className="rounded-t-xs border-2 border-b-0 border-ink bg-paper px-3 pt-4 sm:px-6 sm:pt-8"><Garment kind={softshell.kind} colour="#1f1d1b" positions={["left-chest"]} title={`${softshell.title} for trades`} className="w-full" /></div>
            <div className="rounded-t-xs border-2 border-b-0 border-ink bg-paper px-3 pt-4 sm:px-6 sm:pt-8"><Garment kind={vest.kind} colour="#e7f23a" positions={["back"]} view="back" title={`${vest.title} for trades, back`} className="w-full" /></div>
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

      {/* How it works: a real sequence, so it is one strip of four steps on a stitched line */}
      <section className="wrap band">
        <h2>How it works</h2>
        <Steps steps={STEPS} className="mt-8 lg:mt-10" />
        <Link to="/quote" className="btn btn-ghost mt-8 lg:mt-10">Start a quote</Link>
      </section>

      {/* The range as a rail: all twelve, bleeding off the right edge */}
      <section className="bg-stone py-14 sm:py-20">
        <div className="wrap"><h2>Garments we decorate</h2></div>
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
        <div className="wrap mt-3"><Link to="/garments" className="link">See all {store.garments().length} with colours and positions</Link></div>
      </section>

      {/* The workshop: one photo slot, a plain note and where to find us */}
      <section className="wrap band grid gap-8 !pb-0 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] md:items-center lg:gap-16">
        <PhotoSlot shows="Finished embroidery on a navy fleece, close up." className="min-h-[260px] md:min-h-[340px]"><MethodCloseUp method="embroidery" decorative className="w-full" /></PhotoSlot>
        <div className="flex flex-col gap-4">
          <h2>Come and see us in {SITE.area}.</h2>
          <p className="t-lede">Bring your logo on your phone. We'll show you how it looks on the garment and help you choose thread or print.</p>
          <p className="text-mute">{CONTACT.address && CONTACT.hours ? `${CONTACT.address}. Open ${CONTACT.hours}.` : "The workshop address and opening hours are to come."}</p>
          <Link to="/about" className="btn btn-ghost mt-2 self-start">About the workshop</Link>
        </div>
      </section>
    </>
  );
}
