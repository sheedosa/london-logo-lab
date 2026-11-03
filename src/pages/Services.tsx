import { Link } from "react-router-dom";
import { Seo, breadcrumbs } from "../components/Seo";
import { Garment } from "../components/Garment";
import { Needle, Squeegee, Van, Spool, Registration, InkDrop } from "../components/Icons";
import { img, store } from "../lib/store";
import { STEPS } from "../data/site";

const JUMP = [["embroidery", "Embroidery"], ["print", "Print"], ["workwear", "Workwear supply"], ["uniforms", "Uniform programmes"]] as const;

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

export function Services() {
  return (
    <>
      <Seo title="Services: embroidery, print, workwear supply, uniform programmes" path="/services" description="What The London Logo Lab does: logo embroidery, screen and digital print, plain and decorated workwear supply, and uniform programmes for teams, from a workshop in Tooting."
        jsonLd={[breadcrumbs([{ name: "Home", path: "/" }, { name: "Services", path: "/services" }]),
          ...JUMP.map(([id, name]) => ({ "@context": "https://schema.org", "@type": "Service", name, provider: { "@type": "LocalBusiness", name: "The London Logo Lab" }, areaServed: "London", url: `https://sheedosa.github.io/london-logo-lab/services#${id}` }))]} />

      <section className="on-ink relative overflow-hidden bg-ink text-paper">
        <div className="rule-grid absolute inset-0" aria-hidden="true" />
        <div className="wrap relative flex flex-col gap-6 py-14 lg:py-20">
          <nav aria-label="Breadcrumb" className="text-sm text-paper-mute"><Link to="/" className="underline">Home</Link> · Services</nav>
          <h1 className="max-w-4xl text-[44px] sm:text-[64px]">Four things we do, all under one roof.</h1>
          <nav aria-label="On this page" className="flex flex-wrap gap-2">
            {JUMP.map(([id, l]) => <a key={id} href={`#${id}`} className="chip border-paper text-paper hover:bg-paper hover:text-ink">{l}</a>)}
          </nav>
        </div>
      </section>

      <section id="embroidery" className="wrap scroll-mt-24 grid items-center gap-10 py-16 lg:grid-cols-2 lg:py-20">
        <div className="flex flex-col gap-4">
          <Needle size={36} className="text-rust" />
          <h2 className="text-[32px] sm:text-[44px]">Embroidery</h2>
          <p className="text-[17px]">The lasting way to put a logo on a chest. We digitise your artwork into a stitch file, match thread colours, and run it on multi-head machines in the workshop. Left chest, right chest, sleeve, cap front, apron bib, across the back.</p>
          <ul className="grid gap-2 text-mute sm:grid-cols-2">
            {["Logos up to about 10 cm on the chest, 30 cm across the back", "Thread colours matched to your brand: [THREAD RANGE]", "Setup (digitising) once per logo: £[SETUP]", "Best on polos, sweats, fleece, softshell, caps and aprons"].map((x) => <li key={x} className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 bg-orange" aria-hidden="true" />{x}</li>)}
          </ul>
          <Link to="/quote" className="btn btn-ink self-start">Quote embroidery</Link>
        </div>
        <div className="flex justify-center rounded-pill bg-stone p-6"><StitchDiagram /></div>
      </section>

      <section id="print" className="scroll-mt-24 bg-stone py-16 lg:py-20">
        <div className="wrap grid items-center gap-10 lg:grid-cols-2">
          <div className="order-2 flex justify-center rounded-pill bg-paper p-6 lg:order-1"><ScreensDiagram /></div>
          <div className="order-1 flex flex-col gap-4 lg:order-2">
            <Squeegee size={36} className="text-rust" />
            <h2 className="text-[32px] sm:text-[44px]">Print</h2>
            <p className="text-[17px]">Screen print for runs with a few flat colours, digital print for photographs and one-offs. Big back designs, event tees, hi-vis with the company name, crew hoodies.</p>
            <ul className="grid gap-2 text-mute sm:grid-cols-2">
              {["Screen print: [MIN RUN] and up, one screen per colour", "Digital print: full colour, from one piece", "Hi-vis: print only, so the reflective tape stays intact", "Artwork: vector preferred; we redraw simple logos for [ARTWORK FEE]"].map((x) => <li key={x} className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 bg-orange" aria-hidden="true" />{x}</li>)}
            </ul>
            <Link to="/quote" className="btn btn-ink self-start">Quote print</Link>
          </div>
        </div>
      </section>

      <section className="wrap py-16 lg:py-20">
        <h2 className="mb-8 text-[32px] sm:text-[40px]">Embroidery or print?</h2>
        <div className="overflow-x-auto" tabIndex={0} role="region" aria-label="Embroidery or print comparison table">
          <table className="w-full min-w-[560px] border-collapse text-left">
            <thead><tr className="border-b-2 border-ink">{["", "Embroidery", "Print"].map((h) => <th key={h} scope="col" className="label py-3 pr-4 font-sans">{h || <span className="sr-only">Factor</span>}</th>)}</tr></thead>
            <tbody>
              {[["Best for", "Logos, crests, names on polos, fleece, caps", "Big designs, photos, event and crew tees"], ["Size", "Up to 10 cm chest, 30 cm back", "Up to the full back"], ["Colours", "Thread colours, usually up to [N]", "Flat colours by screen or full colour digitally"], ["Wears", "Decades; outlasts the garment", "Years with care; fades before thread does"], ["Setup", "Digitising once: £[SETUP]", "Screens per colour: £[SCREEN CHARGE]; none for digital"], ["Minimum", "[MINIMUM ORDER]", "[MIN RUN] screen; one piece digital"]].map(([a, b, c]) => (
                <tr key={a} className="border-b border-line align-top"><th scope="row" className="py-3 pr-4 font-semibold">{a}</th><td className="py-3 pr-4 text-mute">{b}</td><td className="py-3 text-mute">{c}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="workwear" className="wrap scroll-mt-24 grid items-center gap-10 border-t-2 border-ink py-16 lg:grid-cols-2 lg:py-20">
        <div className="flex flex-col gap-4">
          <Van size={36} className="text-rust" />
          <h2 className="text-[32px] sm:text-[44px]">Workwear supply</h2>
          <p className="text-[17px]">Plain or decorated, we supply the garments too: polos, tees, sweats, hoodies, fleece, softshells, hi-vis, caps, beanies and aprons from [BRANDS STOCKED]. Sizes from kids to 5XL. One polo or a van load.</p>
          <p className="text-mute">Twelve sample garments are on the site now; the full range comes with the client's supplier list.</p>
          <Link to="/garments" className="btn btn-ink self-start">See the garments</Link>
        </div>
        <img src={img("products/swatches")} alt="Cloth swatches in charcoal, navy, grey and green laid out on a table" loading="lazy" width="1100" height="825" className="aspect-[4/3] w-full rounded-pill border-2 border-ink object-cover" />
      </section>

      <section id="uniforms" className="scroll-mt-24 on-ink bg-ink py-16 text-paper lg:py-20">
        <div className="wrap grid items-center gap-10 lg:grid-cols-2">
          <div className="flex flex-col gap-4">
            <Spool size={36} className="text-orange" />
            <h2 className="text-[32px] text-paper sm:text-[44px]">Uniform programmes</h2>
            <p className="text-[17px] text-paper-mute">For teams of ten to a thousand. We keep a spec per organisation: garments, colours, logo files, positions, who gets what. New starter? Send a size. Re-order? Send a number. [ACCOUNT TERMS].</p>
            <ul className="grid gap-2 text-paper-mute sm:grid-cols-2">
              {["One saved spec per team, role or site", "Named items and sizes held on file", "Roll-out by department or location", "Repeat orders in [REORDER TURNAROUND]"].map((x) => <li key={x} className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 bg-orange" aria-hidden="true" />{x}</li>)}
            </ul>
            <Link to="/quote" className="btn btn-orange self-start">Start a programme</Link>
          </div>
          <div className="rounded-pill border-2 border-paper-mute p-5">
            <p className="label text-paper-mute">Sample uniform spec</p>
            <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
              {[["Organisation", "[CLIENT]"], ["Garments", "Classic polo (navy), Softshell (black), Hi-vis waistcoat"], ["Logo", "Left chest, embroidered, 9 cm; back print on hi-vis"], ["Names", "Right chest, embroidered, block capitals"], ["Roles", "Site: all three. Office: polo only"]].map(([k, v]) => <div key={k} className="contents"><dt className="font-semibold">{k}</dt><dd className="text-paper-mute">{v}</dd></div>)}
            </dl>
            <div className="mt-5 flex gap-2">
              {(["classic-polo", "softshell-jacket", "hi-vis-vest"] as const).map((h, i) => { const g = store.garment(h)!; return <Garment key={h} kind={g.kind} colour={["#1e2a44", "#1f1d1b", "#e7f23a"][i]} positions={i === 2 ? ["left-chest"] : ["left-chest", "right-chest"]} title={g.title} className="w-1/3" />; })}
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
