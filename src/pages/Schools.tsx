import { Link } from "react-router-dom";
import { Seo, breadcrumbs } from "../components/Seo";
import { Garment } from "../components/Garment";
import { StitchRule } from "../components/Icons";
import { store } from "../lib/store";
import { useQuote } from "../lib/quote";
import { SITE } from "../data/site";

const KITS = [
  { t: "PE kit", d: "Crested polo and shorts, reversible rugby top, hoodie for the walk home. Named inside the collar on request.", garment: "classic-polo", colour: "#1f4a36", positions: ["left-chest"] as const },
  { t: "Team kits", d: "Numbered shirts, initials on the sleeve, sponsor on the back. Squad lists in a spreadsheet are fine.", garment: "heavy-tee", colour: "#b4262a", positions: ["back"] as const, view: "back" as const },
  { t: "Club hoodies", d: "The club crest on the chest and names on the back. Members order from one saved spec, [ORDER WINDOW].", garment: "pullover-hoodie", colour: "#1e2a44", positions: ["left-chest", "back"] as const },
  { t: "Leavers' hoodies", d: "Year on the front, every name on the back in the shape of the year. Proofed with the school before print.", garment: "pullover-hoodie", colour: "#4c2a6e", positions: ["back"] as const, view: "back" as const },
  { t: "Staff wear", d: "Softshells and fleeces for the gate and the playground, polos for PE staff and the office.", garment: "softshell-jacket", colour: "#1f1d1b", positions: ["left-chest"] as const },
  { t: "Trips and events", d: "Hi-vis for the coach, printed tees for sports day, caps for the summer fair.", garment: "hi-vis-vest", colour: "#e7f23a", positions: ["back"] as const, view: "back" as const },
];

export function Schools() {
  const { update } = useQuote();
  return (
    <>
      <Seo title="Schools and clubs: PE kit, team kits, club and leavers' hoodies" path="/schools-and-clubs" description="Crested PE kit, numbered team kits, club hoodies and leavers' hoodies from The London Logo Lab in Tooting, with the schoolwear know-how of the I&A family: named items, sizing, one spec per school or club."
        jsonLd={[breadcrumbs([{ name: "Home", path: "/" }, { name: "Schools & clubs", path: "/schools-and-clubs" }]), { "@context": "https://schema.org", "@type": "Service", name: "School and club kit", serviceType: "Embroidered and printed kit for schools and clubs", provider: { "@type": "LocalBusiness", name: SITE.name }, areaServed: "London" }]} />

      <section className="relative overflow-hidden bg-orange">
        <div className="rule-grid-ink absolute inset-0" aria-hidden="true" />
        <div className="wrap relative grid items-center gap-10 py-14 lg:grid-cols-[1.2fr_1fr] lg:py-20">
          <div className="flex flex-col gap-6">
            <nav aria-label="Breadcrumb" className="text-sm"><Link to="/" className="underline">Home</Link> · Schools &amp; clubs</nav>
            <h1 className="text-[44px] sm:text-[64px] lg:text-[72px]">Kit for the whole squad, named and numbered.</h1>
            <p className="max-w-xl text-[18px]">PE kit, team kits, club and leavers' hoodies. We are part of the I&amp;A family, which has dressed South London schools for years, so we know about sizing days, name tapes and the September rush.</p>
            <div className="flex flex-wrap gap-3">
              <Link to="/quote" onClick={() => update({ garment: "pullover-hoodie", positions: ["left-chest", "back"], qty: 25 })} className="btn btn-ink">Quote a club hoodie</Link>
              <a href="#kits" className="btn btn-ghost">What we make</a>
            </div>
          </div>
          <div className="flex justify-center gap-2">
            {(["classic-polo", "heavy-tee", "pullover-hoodie"] as const).map((h, i) => { const g = store.garment(h)!; return <Garment key={h} kind={g.kind} colour={["#1f4a36", "#f2f1ec", "#1e2a44"][i]} positions={[i === 1 ? "back" : "left-chest"]} view={i === 1 ? "back" : "front"} title={g.title} className="w-1/3 max-w-[200px]" />; })}
          </div>
        </div>
      </section>

      <section id="kits" className="wrap scroll-mt-24 py-16 sm:py-20">
        <h2 className="mb-10 text-[32px] sm:text-[44px]">What we make for schools and clubs</h2>
        <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {KITS.map((k) => { const g = store.garment(k.garment)!; return (
            <article key={k.t} className="flex flex-col gap-3">
              <div className="rounded-pill border-2 border-ink bg-stone p-4"><Garment kind={g.kind} colour={k.colour} positions={[...k.positions]} view={k.view ?? "front"} title={`${g.title} for ${k.t.toLowerCase()}`} className="mx-auto h-40 w-40" /></div>
              <h3 className="text-xl">{k.t}</h3>
              <p className="text-mute">{k.d}</p>
            </article>
          ); })}
        </div>
      </section>

      <section className="bg-stone py-16 sm:py-20">
        <div className="wrap grid gap-10 lg:grid-cols-2">
          <div className="flex flex-col gap-4">
            <p className="label text-mute">How a school or club order runs</p>
            <h2 className="text-[32px] sm:text-[40px]">One spec. One sizing day. One re-order a term.</h2>
            <ol className="mt-2 flex flex-col gap-5">
              {[["Agree the spec", "Garments, colours, crest file, where names and numbers go. Saved against the school or club."], ["Collect sizes", "A sizing set of samples for a day at school or training: [SIZING DAY TERMS]. Or a size list by email."], ["Proof and approve", "One flat proof per garment, with every name and number listed. The organiser signs it off."], ["Make and hand over", "Bagged and labelled by name or by class: [BAGGING OPTION]. Collection or delivery to one address."]].map(([t, d], i) => (
                <li key={t} className="grid grid-cols-[auto_1fr] gap-4"><span className="display text-[32px] text-rust" aria-hidden="true">0{i + 1}</span><div><h3 className="text-lg">{t}</h3><p className="text-mute">{d}</p></div></li>
              ))}
            </ol>
          </div>
          <div className="flex flex-col gap-6">
            <div className="rounded-pill border-2 border-ink bg-paper p-6">
              <p className="label text-mute">Placeholders for the client</p>
              <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
                {[["Minimum", "[CLUB MINIMUM]"], ["Lead time", "[SCHOOL TURNAROUND], longer in [PEAK MONTHS]"], ["Parent ordering", "[PARENT ORDER OPTION]"], ["Named items", "[NAMING CHARGE] per name"], ["Numbers", "[NUMBERING CHARGE] per number"]].map(([k, v]) => <div key={k} className="contents"><dt className="font-semibold">{k}</dt><dd className="text-mute">{v}</dd></div>)}
              </dl>
            </div>
            <StitchRule className="text-ink" />
            <figure className="flex flex-col gap-3">
              <blockquote className="display text-[26px]">“[Client review, to come]”</blockquote>
              <figcaption className="text-sm text-mute">[PE LEAD OR CLUB SECRETARY], [SCHOOL OR CLUB]</figcaption>
            </figure>
            <div className="relative flex min-h-[200px] items-end rounded-pill border-2 border-ink bg-paper p-5">
              <p className="label text-mute" aria-hidden="true">Photo: a rail of crested PE polos, sized small to large</p>
            </div>
          </div>
        </div>
      </section>

      <section className="wrap flex flex-wrap items-center justify-between gap-6 pt-16">
        <div className="flex max-w-xl flex-col gap-2">
          <h2 className="text-[32px] sm:text-[40px]">Uniform too?</h2>
          <p className="text-mute">Blazers, jumpers, ties and the rest of the school uniform are at <a href={SITE.family[0].url} className="underline">I&amp;A Schoolwear</a>. We do the PE and club side; together it is one supplier for the school.</p>
        </div>
        <Link to="/quote" className="btn btn-ink">Build a quote</Link>
      </section>
    </>
  );
}
