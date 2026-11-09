import { Link } from "react-router-dom";
import { Seo, breadcrumbs } from "../components/Seo";
import { Garment } from "../components/Garment";
import { PhotoSlot } from "../components/PhotoSlot";
import { Nb } from "../components/Nb";
import { store } from "../lib/store";
import { useQuote } from "../lib/quote";
import { SITE } from "../data/site";

// The two big tiles show front and back, with a crest and a name and number, because that is the job.
const FEATURE = [
  { t: "PE kit", d: "A crested polo for every child, with the school name on the back if you like. Named inside on request.", garment: "classic-polo", colour: "#1f4a36", text: "ST ANNE'S" },
  { t: "Team kit", d: "Names and numbers on the back, initials on the sleeve, a sponsor if you have one. A squad list in a spreadsheet is fine.", garment: "heavy-tee", colour: "#b4262a", text: "SMITH 9" },
] as const;
const MORE = [
  { t: "Club hoodies", d: "Crest on the chest, names on the back.", garment: "pullover-hoodie", colour: "#1e2a44" },
  { t: "Leavers' hoodies", d: "Every name on the back, proofed with the school first.", garment: "pullover-hoodie", colour: "#4c2a6e" },
  { t: "Coaches and staff", d: "Softshells and fleeces for the touchline and the gate.", garment: "softshell-jacket", colour: "#1f1d1b" },
  { t: "Trips and events", d: "Hi-vis for the coach, caps for sports day.", garment: "hi-vis-vest", colour: "#e7f23a" },
] as const;

export function Schools() {
  const { update } = useQuote();
  return (
    <>
      <Seo title="Schools and clubs: PE kit, team kits, club and leavers' hoodies" path="/schools-and-clubs" description="Crested PE kit, team kit with names and numbers, club hoodies and leavers' hoodies for schools and sports clubs, from The London Logo Lab in Tooting. From 1 item, ready within 7 days."
        jsonLd={[breadcrumbs([{ name: "Home", path: "/" }, { name: "Schools & clubs", path: "/schools-and-clubs" }]), { "@context": "https://schema.org", "@type": "Service", name: "School and club kit", serviceType: "Embroidered and printed kit for schools and clubs", provider: { "@type": "LocalBusiness", name: SITE.name }, areaServed: "London" }]} />

      <section className="relative overflow-hidden bg-orange">
        <div className="rule-grid-ink absolute inset-0" aria-hidden="true" />
        <div className="wrap relative grid items-center gap-10 py-14 lg:grid-cols-[1.2fr_1fr] lg:py-20">
          <div className="flex flex-col gap-6">
            <nav aria-label="Breadcrumb" className="text-[14px]"><Link to="/" className="inline-flex min-h-11 items-center underline">Home</Link> · Schools &amp; clubs</nav>
            <h1 className="text-[38px] sm:text-[60px] lg:text-[68px]">Kit for schools and sports clubs.</h1>
            <p className="max-w-xl text-[18px]">PE kit, team kit, club and leavers' hoodies. Named and numbered, from {SITE.minimumOrder}, ready {SITE.turnaround}. Lost a shirt mid-season? We'll make you one.</p>
            <div className="flex flex-wrap gap-3">
              <Link to="/quote" onClick={() => update({ garment: "pullover-hoodie", positions: ["left-chest", "back"], qty: 25 })} className="btn btn-ink">Quote a club hoodie</Link>
              <a href="#kits" className="btn btn-ghost">What we make</a>
            </div>
          </div>
          <div className="flex justify-center gap-2">
            {(["classic-polo", "heavy-tee", "pullover-hoodie"] as const).map((h, i) => { const g = store.garment(h)!; return <Garment key={h} kind={g.kind} colour={["#1f4a36", "#f2f1ec", "#1e2a44"][i]} positions={[i === 1 ? "back" : "left-chest"]} view={i === 1 ? "back" : "front"} logo={i === 1 ? { kind: "text", text: "PATEL 10" } : null} title={g.title} className="w-1/3 max-w-[200px]" />; })}
          </div>
        </div>
      </section>

      <section id="kits" className="wrap scroll-mt-24 py-16 sm:py-20">
        <h2 className="mb-10 text-[32px] sm:text-[44px]">What we make</h2>
        <div className="grid gap-6 lg:grid-cols-2">
          {FEATURE.map((k) => { const g = store.garment(k.garment)!; return (
            <article key={k.t} className="flex flex-col gap-4 rounded-pill border-2 border-ink p-5 sm:p-6">
              <div className="grid grid-cols-2 gap-2 rounded-pill bg-stone p-3">
                <Garment kind={g.kind} colour={k.colour} positions={["left-chest"]} title={`${g.title} for ${k.t}, front with crest`} className="w-full" />
                <Garment kind={g.kind} colour={k.colour} positions={["back"]} view="back" logo={{ kind: "text", text: k.text }} title={`${g.title} for ${k.t}, back with ${k.text}`} className="w-full" />
              </div>
              <h3 className="text-2xl">{k.t}</h3>
              <p className="text-mute">{k.d}</p>
            </article>
          ); })}
        </div>
        <ul className="mt-6 grid gap-x-6 sm:grid-cols-2">
          {MORE.map((k) => { const g = store.garment(k.garment)!; return (
            <li key={k.t} className="grid grid-cols-[72px_1fr] items-center gap-4 border-b border-line py-4">
              <Garment kind={g.kind} colour={k.colour} positions={[g.positions[0]]} title={`${g.title} for ${k.t.toLowerCase()}`} className="w-[72px]" />
              <div><h3 className="text-lg">{k.t}</h3><p className="text-mute">{k.d}</p></div>
            </li>
          ); })}
        </ul>
      </section>

      <section className="bg-stone py-16 sm:py-20">
        <div className="wrap grid gap-10 lg:grid-cols-2">
          <div className="flex flex-col gap-4">
            <p className="label text-mute">How a school or club order runs</p>
            <h2 className="text-[32px] sm:text-[40px]">One spec, then easy re-orders.</h2>
            <ol className="mt-2 flex flex-col gap-5">
              {[["Agree the spec", "Garments, colours, your crest, where names and numbers go. We save it for next time."], ["Collect sizes", "Send us a size list. Sizing samples for a day at school or training: [SIZING DAY TERMS]."], ["Check the proof", "One flat proof per garment, with every name and number listed. You sign it off."], ["We make it", `Ready ${SITE.turnaround}. Bagged by name or by class: [BAGGING OPTION].`]].map(([t, d], i) => (
                <li key={t} className="grid grid-cols-[auto_1fr] gap-4"><span className="display text-[32px] text-rust" aria-hidden="true">{i + 1}</span><div><h3 className="text-lg">{t}</h3><p className="text-mute">{d}</p></div></li>
              ))}
            </ol>
          </div>
          <div className="flex flex-col gap-6">
            <div className="rounded-pill border-2 border-ink bg-paper p-6">
              <p className="label text-mute">The details</p>
              <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2">
                {[["Minimum order", SITE.minimumOrder], ["Ready", SITE.turnaround], ["Parent ordering", "[PARENT ORDER OPTION]"], ["Names", "£[NAMING CHARGE] per name"], ["Numbers", "£[NUMBERING CHARGE] per number"]].map(([k, v]) => <div key={k} className="contents"><dt className="font-semibold">{k}</dt><dd className="text-mute"><Nb>{v}</Nb></dd></div>)}
              </dl>
            </div>
            <figure className="rounded-pill border-2 border-dashed border-mute p-5">
              <blockquote className="text-mute">[Client review, to come]</blockquote>
              <figcaption className="mt-1 text-[14px] text-mute">[PE LEAD OR CLUB SECRETARY], [SCHOOL OR CLUB]</figcaption>
            </figure>
            <PhotoSlot shows="A rail of crested PE polos, sized small to large." className="min-h-[220px]" />
          </div>
        </div>
      </section>

      <section className="wrap flex flex-wrap items-center justify-between gap-6 pt-16">
        <div className="flex max-w-xl flex-col gap-2">
          <h2 className="text-[32px] sm:text-[40px]">School uniform too?</h2>
          <p className="text-mute">Blazers, jumpers, ties and the rest of the school uniform are at <a href={SITE.family[0].url} className="underline">I&amp;A Schoolwear</a>. We do the PE and club side; together it is one supplier for the school.</p>
        </div>
        <Link to="/quote" className="btn btn-ink">Build a quote</Link>
      </section>
    </>
  );
}
