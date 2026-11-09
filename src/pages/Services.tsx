import { Link } from "react-router-dom";
import { Seo, breadcrumbs } from "../components/Seo";
import { Garment } from "../components/Garment";
import { PhotoSlot } from "../components/PhotoSlot";
import { Nb } from "../components/Nb";
import { Needle, Squeegee, Van, Spool, Registration, InkDrop } from "../components/Icons";
import { store } from "../lib/store";
import { SITE, STEPS } from "../data/site";

const JUMP = [["embroidery", "Embroidery"], ["screen", "Screen printing"], ["dtf", "DTF printing"], ["vinyl", "Vinyl"], ["workwear", "Workwear supply"], ["uniforms", "Uniforms"]] as const;

/** Stitch diagram: satin stitch on a letter shape, with the hoop ring. Decorative. */
function StitchDiagram() {
  return (
    <svg viewBox="0 0 240 200" aria-hidden="true" className="w-full max-w-[360px]">
      <circle cx="120" cy="100" r="88" fill="#e6dfd0" stroke="#1b1916" strokeWidth="1.5" />
      <circle cx="120" cy="100" r="78" fill="none" stroke="#1b1916" strokeWidth="1.5" />
      <g stroke="#f4651f" strokeWidth="2.2" strokeLinecap="round">
        {Array.from({ length: 22 }, (_, i) => <line key={i} x1={84} y1={60 + i * 3.6} x2={104} y2={58 + i * 3.6} />)}
        {Array.from({ length: 10 }, (_, i) => <line key={`b${i}`} x1={107 + i * 3.8} y1={140} x2={108 + i * 3.8} y2={120} />)}
      </g>
      <path d="M84 56h22v86h36v-24" fill="none" stroke="#1b1916" strokeWidth="1.5" strokeDasharray="3 3" />
      <path d="M150 48l40-20" stroke="#1b1916" strokeWidth="1.5" /><circle cx="190" cy="28" r="3" fill="#1b1916" />
    </svg>
  );
}
/** Three screens, one per colour, with registration marks. Decorative. */
function ScreensDiagram() {
  return (
    <svg viewBox="0 0 240 200" aria-hidden="true" className="w-full max-w-[360px]">
      {[{ c: "#f4651f", x: 20, y: 30 }, { c: "#1b1916", x: 60, y: 50 }, { c: "#f3eee4", x: 100, y: 70 }].map(({ c, x, y }, i) => (
        <g key={i}>
          <rect x={x} y={y} width="120" height="100" fill={c} stroke="#1b1916" strokeWidth="1.5" />
          <g fill="none" stroke={i === 2 ? "#1b1916" : "#f3eee4"} strokeWidth="1.2"><circle cx={x + 12} cy={y + 12} r="5" /><path d={`M${x + 4} ${y + 12}h16M${x + 12} ${y + 4}v16`} /></g>
        </g>
      ))}
      <path d="M130 100h50v40h-50z" fill="#f4651f" stroke="#1b1916" strokeWidth="1.5" />
    </svg>
  );
}

/** DTF: a printed film coming off its sheet onto the garment under a heat press platen. Decorative. */
function DtfDiagram() {
  return (
    <svg viewBox="0 0 240 200" aria-hidden="true" className="w-full max-w-[300px]">
      <rect x="30" y="20" width="180" height="34" fill="#1b1916" stroke="#1b1916" strokeWidth="1.5" />
      <path d="M120 54v18" stroke="#1b1916" strokeWidth="1.5" />
      <rect x="40" y="128" width="160" height="50" fill="#f3eee4" stroke="#1b1916" strokeWidth="1.5" />
      <path d="M58 118 L160 88 L190 112 L88 142 Z" fill="#f3eee4" stroke="#1b1916" strokeWidth="1.5" />
      <g stroke="#1b1916" strokeWidth="1.5"><rect x="96" y="104" width="22" height="18" fill="#f4651f" transform="rotate(-16 107 113)" /><circle cx="134" cy="106" r="9" fill="#2b4fbf" /><rect x="120" y="118" width="26" height="6" fill="#1f4a36" transform="rotate(-16 133 121)" /></g>
      <path d="M160 88 Q176 80 190 112" fill="none" stroke="#1b1916" strokeWidth="1.5" strokeDasharray="3 3" />
    </svg>
  );
}
/** Vinyl: letters cut from a sheet, the waste being lifted away. Decorative. */
function VinylDiagram() {
  return (
    <svg viewBox="0 0 240 200" aria-hidden="true" className="w-full max-w-[300px]">
      <rect x="24" y="40" width="192" height="120" fill="#e6dfd0" stroke="#1b1916" strokeWidth="1.5" />
      <g fill="#1b1916"><path d="M50 70h14v40h20v12H50z" /><path d="M94 70h34v12h-20v8h18v12h-18v20H94z" /><path d="M138 70h16l10 30 10-30h16l-18 52h-16z" /></g>
      <path d="M24 160 L24 130 Q60 150 80 160 Z" fill="#f3eee4" stroke="#1b1916" strokeWidth="1.5" />
      <path d="M216 40 Q230 60 216 84" fill="none" stroke="#1b1916" strokeWidth="1.5" />
      <g fill="#f4651f" stroke="#1b1916" strokeWidth="1.5"><rect x="190" y="132" width="10" height="10" /></g>
    </svg>
  );
}

const Bullets = ({ items, onInk = false }: { items: string[]; onInk?: boolean }) => (
  <ul className={`grid gap-2 sm:grid-cols-2 ${onInk ? "text-paper-mute" : "text-mute"}`}>
    {items.map((x) => <li key={x} className="flex gap-2"><span className="mt-2.5 h-1.5 w-1.5 shrink-0 bg-orange" aria-hidden="true" /><span><Nb>{x}</Nb></span></li>)}
  </ul>
);

const COMPARE: [string, string, string, string, string][] = [
  ["Best for", "Logos and crests on polos, fleece, caps", "Bold designs in a few colours on tees and hoodies", "Full-colour logos and photos, small runs", "Names, numbers and short text"],
  ["Looks like", "Raised thread with a slight sheen", "Flat, solid ink", "Smooth, bright print with fine detail", "Crisp single colour with clean edges"],
  ["Good value", "Any size of order", "Bigger runs, once the screens are made", "From one piece", "From one piece"],
  ["Setup", "Logo prepared for stitching: £[SETUP]", "One screen per colour: £[SCREEN CHARGE]", "[DTF SETUP]", "[VINYL SETUP]"],
  ["Not for", "Hi-vis tape lines", "Fleece pile, caps", "Fleece pile, knitwear", "Fleece pile, very fine detail"],
];

export function Services() {
  return (
    <>
      <Seo title="Services: embroidery, screen printing, DTF, vinyl, workwear and uniforms" path="/services" description="What The London Logo Lab does in Tooting: embroidery, screen printing, DTF printing and vinyl on workwear, plus workwear supply and uniforms for trades, schools and sports clubs. From 1 item, ready within 7 days."
        jsonLd={[breadcrumbs([{ name: "Home", path: "/" }, { name: "Services", path: "/services" }]),
          ...JUMP.map(([id, name]) => ({ "@context": "https://schema.org", "@type": "Service", name, provider: { "@type": "LocalBusiness", name: SITE.name }, areaServed: "London", url: `${SITE.url}/services#${id}` }))]} />

      <section className="on-ink relative overflow-hidden bg-ink text-paper">
        <div className="rule-grid absolute inset-0" aria-hidden="true" />
        <div className="wrap relative flex flex-col gap-6 py-12 lg:py-20">
          <nav aria-label="Breadcrumb" className="text-[14px] text-paper-mute"><Link to="/" className="inline-flex min-h-11 items-center underline">Home</Link> · Services</nav>
          <h1 className="max-w-4xl text-[40px] sm:text-[64px]">Everything your logo needs, under one roof.</h1>
          <p className="max-w-2xl text-[18px] text-paper-mute">Four ways to decorate, plus the garments and the uniform plan. From {SITE.minimumOrder}, ready {SITE.turnaround}.</p>
          <nav aria-label="On this page" className="flex flex-wrap gap-2">
            {JUMP.map(([id, l]) => <a key={id} href={`#${id}`} className="chip border-paper text-paper hover:bg-paper hover:text-ink">{l}</a>)}
          </nav>
        </div>
      </section>

      <section id="embroidery" className="wrap scroll-mt-24 grid items-center gap-10 py-16 lg:grid-cols-2 lg:py-20">
        <div className="flex flex-col gap-4">
          <Needle size={36} className="text-rust" />
          <h2 className="text-[32px] sm:text-[44px]">Embroidery</h2>
          <p className="text-[17px]">The lasting way to put a logo on a chest. We turn your logo into a stitch file, match the thread colours and stitch it here in the workshop.</p>
          <Bullets items={["Left or right chest, sleeve, back, cap front, apron bib", "Thread colours matched to your brand: [THREAD RANGE]", "Logo setup, once per logo: £[SETUP]", "Best on polos, sweats, fleece, softshells, caps"]} />
          <Link to="/quote" className="btn btn-ink self-start">Quote embroidery</Link>
        </div>
        <div className="flex justify-center rounded-pill bg-stone p-6"><StitchDiagram /></div>
      </section>

      <section id="screen" className="scroll-mt-24 bg-stone py-16 lg:py-20">
        <div className="wrap grid items-center gap-10 lg:grid-cols-2">
          <div className="flex flex-col gap-4 lg:order-2">
            <Squeegee size={36} className="text-rust" />
            <h2 className="text-[32px] sm:text-[44px]">Screen printing</h2>
            <p className="text-[17px]">Ink pushed through a screen, one screen per colour. Bold and flat, and the more you order, the better the price per item.</p>
            <Bullets items={["Big back prints and chest logos", "Event tees, crew hoodies, club shirts", "Screens per colour: £[SCREEN CHARGE]", "Ink colours matched: [INK MATCHING]"]} />
            <Link to="/quote" className="btn btn-ink self-start">Quote screen printing</Link>
          </div>
          <div className="flex justify-center rounded-pill bg-paper p-6 lg:order-1"><ScreensDiagram /></div>
        </div>
      </section>

      {/* DTF and vinyl side by side: both are pressed on with heat, both work from one piece */}
      <section className="wrap grid gap-6 py-16 lg:grid-cols-2 lg:py-20">
        {[
          { id: "dtf", I: InkDrop, t: "DTF printing", d: "Your design is printed onto film, then pressed onto the garment with heat. Full colour, fine detail, and good value from a single piece.", b: ["Photos, gradients, many-colour logos", "Tees, hoodies, hi-vis, aprons, cap fronts"], D: DtfDiagram },
          { id: "vinyl", I: Registration, t: "Vinyl", d: "Letters and shapes cut from coloured vinyl and pressed on. Clean, sharp and quick. Our go-to for names and numbers.", b: ["Player names and squad numbers", "Short text and one-colour logos"], D: VinylDiagram },
        ].map((x) => (
          <article key={x.id} id={x.id} className="scroll-mt-24 flex flex-col gap-4 rounded-pill border-2 border-ink p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4"><x.I size={36} className="text-rust" /><div className="w-40 sm:w-48"><x.D /></div></div>
            <h2 className="text-[30px] sm:text-[36px]">{x.t}</h2>
            <p className="text-[17px]">{x.d}</p>
            <Bullets items={x.b} />
            <Link to="/quote" className="btn btn-ink mt-auto self-start">Quote {x.t.toLowerCase().replace("dtf", "DTF")}</Link>
          </article>
        ))}
      </section>

      <section className="wrap pb-16 lg:pb-20">
        <h2 className="mb-3 text-[32px] sm:text-[40px]">Which one is right?</h2>
        <p className="mb-8 max-w-2xl text-mute">A rough guide. Tell us what it's for and we'll help you pick.</p>
        <div className="overflow-x-auto" tabIndex={0} role="region" aria-label="Comparison of embroidery, screen printing, DTF and vinyl">
          <table className="w-full min-w-[760px] border-collapse text-left">
            <thead><tr className="border-b-2 border-ink">{["", "Embroidery", "Screen printing", "DTF", "Vinyl"].map((h) => <th key={h} scope="col" className="label py-3 pr-4">{h || <span className="sr-only">Factor</span>}</th>)}</tr></thead>
            <tbody>
              {COMPARE.map(([a, ...rest]) => (
                <tr key={a} className="border-b border-line align-top"><th scope="row" className="min-h-11 py-3 pr-4 font-semibold">{a}</th>{rest.map((c, i) => <td key={i} className="py-3 pr-4 text-mute"><Nb>{c}</Nb></td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="workwear" className="wrap scroll-mt-24 grid items-center gap-10 border-t-2 border-ink py-16 lg:grid-cols-2 lg:py-20">
        <div className="flex flex-col gap-4">
          <Van size={36} className="text-rust" />
          <h2 className="text-[32px] sm:text-[44px]">Workwear supply</h2>
          <p className="text-[17px]">We supply the garments too, plain or decorated: polos, tees, sweats, hoodies, fleece, softshells, hi-vis, caps, beanies and aprons. Brands: [BRANDS STOCKED]. One polo or a van load.</p>
          <p className="text-mute">Twelve sample garments are on the site now. The full range is coming.</p>
          <Link to="/garments" className="btn btn-ink self-start">See the garments</Link>
        </div>
        <PhotoSlot shows="Boxed polos, folded and labelled, ready for collection." className="aspect-[4/3]" />
      </section>

      <section id="uniforms" className="scroll-mt-24 on-ink bg-ink py-16 text-paper lg:py-20">
        <div className="wrap grid items-center gap-10 lg:grid-cols-2">
          <div className="flex flex-col gap-4">
            <Spool size={36} className="text-orange" />
            <h2 className="text-[32px] text-paper sm:text-[44px]">Uniforms</h2>
            <p className="text-[17px] text-paper-mute">For a team of three or a whole school. We keep your spec on file: garments, colours, logo files, positions, who gets what. New starter? Send a size. Re-order? Send a number.</p>
            <Bullets onInk items={["One saved spec per team, role or site", "Names and sizes held on file", "Roll out by department or location", `Every order ready ${SITE.turnaround}`]} />
            <Link to="/quote" className="btn btn-orange self-start">Start a uniform</Link>
          </div>
          <div className="rounded-pill border-2 border-paper-mute p-5">
            <p className="label text-paper-mute">Sample uniform spec</p>
            <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2">
              {[["Who", "[CLIENT]"], ["Garments", "Classic polo (navy), softshell (black), hi-vis waistcoat"], ["Logo", "Left chest, embroidered; back print on hi-vis"], ["Names", "Right chest, embroidered"], ["Roles", "Site: all three. Office: polo only"]].map(([k, v]) => <div key={k} className="contents"><dt className="font-semibold">{k}</dt><dd className="text-paper-mute">{v}</dd></div>)}
            </dl>
            <div className="mt-5 grid grid-cols-3 gap-2">
              {(["classic-polo", "softshell-jacket", "hi-vis-vest"] as const).map((h, i) => { const g = store.garment(h)!; return <div key={h} className="rounded-pill bg-stone p-1"><Garment kind={g.kind} colour={["#1e2a44", "#1f1d1b", "#e7f23a"][i]} positions={i === 2 ? ["back"] : ["left-chest", "right-chest"]} view={i === 2 ? "back" : "front"} title={g.title} className="w-full" /></div>; })}
            </div>
          </div>
        </div>
      </section>

      <section className="wrap py-16 lg:py-20">
        <h2 className="mb-8 text-[32px] sm:text-[40px]">How it works</h2>
        <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <li key={s.n} className="flex flex-col gap-3 border-t-2 border-ink pt-4">
              <span className="flex items-center gap-3"><span className="display text-[40px] text-rust" aria-hidden="true">{s.n}</span>{[<Registration key="r" size={24} />, <InkDrop key="i" size={24} />, <Needle key="n" size={24} />, <Van key="v" size={24} />][i]}</span>
              <h3 className="text-xl">{s.t}</h3>
              <p className="text-mute">{s.d}</p>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
