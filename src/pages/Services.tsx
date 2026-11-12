import { Link } from "react-router-dom";
import { Seo, breadcrumbs } from "../components/Seo";
import { Crumbs } from "../components/Crumbs";
import { Garment } from "../components/Garment";
import { MethodCloseUp } from "../components/MethodCloseUp";
import { PhotoSlot } from "../components/PhotoSlot";
import { Steps } from "../components/Steps";
import { Nb } from "../components/Nb";
import { TitleRule } from "../components/Icons";
import { VLink } from "../components/VLink";
import { store, type Method } from "../lib/store";
import { useQuote } from "../lib/quote";
import { SITE, STEPS } from "../data/site";

const JUMP = [["embroidery", "Embroidery"], ["screen", "Screen printing"], ["dtf", "DTF printing"], ["vinyl", "Vinyl"], ["workwear", "Workwear supply"], ["uniforms", "Uniforms"]] as const;

// The four decoration methods, side by side. Every row is something a customer can choose by.
const METHODS: { id: Method; name: string; what: string; rows: string[] }[] = [
  { id: "embroidery", name: "Embroidery", what: "The lasting way to put a logo on a chest. We turn your logo into a stitch file, match the thread colours and stitch it here in the workshop.",
    rows: ["Logos and crests on polos, sweats, fleece, softshells and caps", "Raised thread with a slight sheen", "Any size of order", "Thread colours matched to your brand: [THREAD RANGE]", "Logo prepared for stitching, once per logo: £[SETUP]", "Hi-vis tape lines"] },
  { id: "screen", name: "Screen printing", what: "Ink pushed through a screen, one screen per colour. Bold and flat, and the more you order, the better the price per item.",
    rows: ["Bold designs in a few colours: event tees, crew hoodies, club shirts", "Flat, solid ink", "Bigger runs, once the screens are made", "Ink colours matched: [INK MATCHING]", "One screen per colour: £[SCREEN CHARGE]", "Fleece pile, caps"] },
  { id: "dtf", name: "DTF printing", what: "Your design is printed onto film, then pressed onto the garment with heat. Full colour, fine detail, and good value from a single piece.",
    rows: ["Photos, gradients and many-colour logos, small runs", "Smooth, bright print with fine detail", "From one piece", "Full colour", "[DTF SETUP]", "Fleece pile, knitwear"] },
  { id: "vinyl", name: "Vinyl", what: "Letters and shapes cut from coloured vinyl and pressed on. Clean, sharp and quick. Our go-to for names and numbers.",
    rows: ["Player names, squad numbers, short text and one-colour logos", "Crisp single colour with clean edges", "From one piece", "Single colours", "[VINYL SETUP]", "Fleece pile, very fine detail"] },
];
const ROWS = ["Best for", "Look and feel", "Good value", "Colour", "Setup", "Not for"];

export function Services() {
  const { quote, update } = useQuote();
  /** Opens the ticket with this decoration written in; moves to the first garment that takes it if the current one does not. */
  const startWith = (m: Method) => () => {
    const current = store.garment(quote.garment);
    update({ garment: current?.methods.includes(m) ? quote.garment : store.garments({ method: m })[0].handle, method: m });
  };
  return (
    <>
      <Seo title="Services: embroidery, screen printing, DTF, vinyl, workwear and uniforms" path="/services" description="What The London Logo Lab does in Tooting: embroidery, screen printing, DTF printing and vinyl on workwear, plus workwear supply and uniforms for trades, schools and sports clubs. From 1 item, ready within 7 days."
        jsonLd={[breadcrumbs([{ name: "Home", path: "/" }, { name: "Services", path: "/services" }]),
          ...JUMP.map(([id, name]) => ({ "@context": "https://schema.org", "@type": "Service", name, provider: { "@type": "LocalBusiness", name: SITE.name }, areaServed: "London", url: `${SITE.url}/services#${id}` }))]} />

      <section className="border-b-2 border-ink">
        <div className="wrap flex flex-col gap-5 pb-8 pt-4 lg:pb-12 lg:pt-8">
          <Crumbs trail={[{ to: "/", label: "Home" }]} here="Services" />
          <h1 className="max-w-[15em]">Embroidery, print and the garments to put them on.</h1>
          <TitleRule className="text-rust" />
          <p className="t-lede">Four ways to decorate, plus the garments and the uniform plan. From {SITE.minimumOrder}, ready {SITE.turnaround}.</p>
          <nav aria-label="On this page" className="flex flex-wrap gap-x-6">
            {JUMP.map(([id, l]) => <a key={id} href={`#${id}`} className="link">{l}</a>)}
          </nav>
        </div>
      </section>

      {/* The comparison: one column per method at desktop, one block per method on a phone. Same markup. */}
      <section className="wrap band">
        <h2>Which one is right?</h2>
        <p className="measure mt-4 text-mute">A rough guide. Tell us what it's for and we'll help you pick.</p>
        <div className="compare mt-10">
          <div className="compare-rail" aria-hidden="true">
            <span />
            {["Where it goes", ...ROWS].map((r) => <span key={r} className="label">{r}</span>)}
            <span />
          </div>
          {METHODS.map((m) => { const info = store.method(m.id); const takes = store.garments({ method: m.id }).length; return (
            <article key={m.id} id={m.id} className="compare-col scroll-mt-24">
              <header className="flex flex-col gap-3 pb-5">
                <MethodCloseUp method={m.id} className="w-28 lg:w-[7.5rem]" />
                <h3 className="t-head">{m.name}</h3>
                <p>{m.what}</p>
              </header>
              <dl className="contents">
                <div><dt className="label">Where it goes</dt><dd>{info.positions.map((p, i) => (i ? store.position(p).label.toLowerCase() : store.position(p).label)).join(", ")}</dd></div>
                {ROWS.map((r, i) => <div key={r}><dt className="label">{r}</dt><dd><Nb>{m.rows[i]}</Nb></dd></div>)}
              </dl>
              <footer className="flex flex-col items-start gap-1 pt-5">
                <VLink to="/quote" onClick={startWith(m.id)} className="btn btn-ink">Quote {m.name.toLowerCase().replace("dtf", "DTF")}</VLink>
                <Link to={`/garments?takes=${m.id}`} className="link">{takes} of the {store.garments().length} sample garments take it</Link>
              </footer>
            </article>
          ); })}
        </div>
      </section>

      <section id="workwear" className="scroll-mt-24 border-t-2 border-ink">
        <div className="wrap band grid items-center gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)] lg:gap-16">
          <div className="flex flex-col gap-4">
            <h2>Workwear supply</h2>
            <p className="t-lede">We supply the garments too, plain or decorated: polos, tees, sweats, hoodies, fleece, softshells, hi-vis, caps, beanies and aprons. Brands: [BRANDS STOCKED]. One polo or a van load.</p>
            <p className="text-mute">Twelve sample garments are on the site now. The full range is coming.</p>
            <Link to="/garments" className="btn btn-ink mt-2 self-start">See the garments</Link>
          </div>
          <PhotoSlot shows="Boxed polos, folded and labelled, ready for collection." className="aspect-[4/3]" />
        </div>
      </section>

      <section id="uniforms" className="on-orange scroll-mt-24 bg-orange">
        <div className="wrap band grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] lg:gap-16">
          <div className="flex flex-col gap-4">
            <h2>Uniforms</h2>
            <p className="t-lede">For a team of three or a whole school. We keep your spec on file: garments, colours, logo files, positions, who gets what. New starter? Send a size. Re-order? Send a number.</p>
            <ul className="mt-2 border-t border-ink">
              {["One saved spec per team, role or site", "Names and sizes held on file", "Roll out by department or location", `Every order ready ${SITE.turnaround}`].map((x) => <li key={x} className="border-b border-ink py-3">{x}</li>)}
            </ul>
            <Link to="/quote" className="btn btn-ink mt-3 self-start">Start a uniform</Link>
          </div>
          <div>
            <div className="grid grid-cols-3 gap-2">
              {(["classic-polo", "softshell-jacket", "hi-vis-vest"] as const).map((h, i) => { const g = store.garment(h)!; return <div key={h} className="rounded-xs border-2 border-ink bg-paper p-2"><Garment kind={g.kind} colour={["#1e2a44", "#1f1d1b", "#e7f23a"][i]} positions={i === 2 ? ["back"] : ["left-chest", "right-chest"]} view={i === 2 ? "back" : "front"} title={g.title} className="w-full" /></div>; })}
            </div>
            <h3 className="mt-6">Sample uniform spec</h3>
            <dl className="ledger mt-3 border-b border-ink">
              {[["Who", "[CLIENT]"], ["Garments", "Classic polo (navy), softshell (black), hi-vis waistcoat"], ["Logo", "Left chest, embroidered; back print on hi-vis"], ["Names", "Right chest, embroidered"], ["Roles", "Site: all three. Office: polo only"]].map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
            </dl>
          </div>
        </div>
      </section>

      <section className="wrap band !pb-0">
        <h2>How it works</h2>
        <Steps steps={STEPS} className="mt-8 lg:mt-10" />
        <Link to="/quote" className="btn btn-ghost mt-8 lg:mt-10">Start a quote</Link>
      </section>
    </>
  );
}
