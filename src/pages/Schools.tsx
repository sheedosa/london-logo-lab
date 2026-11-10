import { Link } from "react-router-dom";
import { Seo, breadcrumbs } from "../components/Seo";
import { Crumbs } from "../components/Crumbs";
import { Garment } from "../components/Garment";
import { PhotoSlot } from "../components/PhotoSlot";
import { Nb } from "../components/Nb";
import { TitleRule } from "../components/Icons";
import { VLink } from "../components/VLink";
import { store } from "../lib/store";
import { useQuote } from "../lib/quote";
import { SITE } from "../data/site";

const ORDER = [
  ["Agree the spec", "Garments, colours, your crest, where names and numbers go. We save it for next time."],
  ["Collect sizes", "Send us a size list. Sizing samples for a day at school or training: [SIZING DAY TERMS]."],
  ["Check the proof", "One flat proof per garment, with every name and number listed. You sign it off."],
  ["We make it", `Ready ${SITE.turnaround}. Bagged by name or by class: [BAGGING OPTION].`],
];

export function Schools() {
  const { update } = useQuote();
  const polo = store.garment("classic-polo")!, tee = store.garment("heavy-tee")!, hoodie = store.garment("pullover-hoodie")!, softshell = store.garment("softshell-jacket")!;
  return (
    <>
      <Seo title="Schools and clubs: PE kit, team kits, club and leavers' hoodies" path="/schools-and-clubs" description="Crested PE kit, team kit with names and numbers, club hoodies and leavers' hoodies for schools and sports clubs, from The London Logo Lab in Tooting. From 1 item, ready within 7 days."
        jsonLd={[breadcrumbs([{ name: "Home", path: "/" }, { name: "Schools & clubs", path: "/schools-and-clubs" }]), { "@context": "https://schema.org", "@type": "Service", name: "School and club kit", serviceType: "Embroidered and printed kit for schools and clubs", provider: { "@type": "LocalBusiness", name: SITE.name }, areaServed: "London" }]} />

      <section className="on-orange overflow-hidden bg-orange">
        <div className="wrap grid items-end gap-x-10 gap-y-6 pt-4 md:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)] lg:pt-8">
          <div className="flex flex-col gap-5 pb-10 lg:pb-16">
            <Crumbs trail={[{ to: "/", label: "Home" }]} here="Schools & clubs" className="text-ink" />
            <h1 className="max-w-[11em]">Kit for schools and sports clubs.</h1>
            <TitleRule />
            <p className="t-lede">PE kit, team kit, club and leavers' hoodies. Named and numbered, from {SITE.minimumOrder}, ready {SITE.turnaround}. Lost a shirt mid-season? We'll make you one.</p>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <VLink to="/quote" onClick={() => update({ garment: "pullover-hoodie", positions: ["left-chest", "back"], qty: 25 })} className="btn btn-ink">Quote a club hoodie</VLink>
              <a href="#schools" className="link">For schools</a>
              <a href="#clubs" className="link">For clubs</a>
            </div>
          </div>
          <div className="-mb-6 grid grid-cols-3 items-end md:-mb-10">
            {([polo, tee, hoodie] as const).map((g, i) => <Garment key={g.handle} kind={g.kind} colour={["#1f4a36", "#f2f1ec", "#1e2a44"][i]} positions={[i === 1 ? "back" : "left-chest"]} view={i === 1 ? "back" : "front"} logo={i === 1 ? { kind: "text", text: "PATEL 10" } : null} title={g.title} className="w-full" />)}
          </div>
        </div>
      </section>

      {/* Schools: the PE polo front and back, large, with the other school jobs as ruled lines beside it */}
      <section id="schools" className="wrap band scroll-mt-24 grid gap-x-12 gap-y-8 md:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] md:items-center lg:gap-x-20">
        <div className="grid grid-cols-2 gap-3 rounded-xs bg-stone p-4 sm:p-8">
          <Garment kind={polo.kind} colour="#1f4a36" positions={["left-chest"]} title={`${polo.title} for PE kit, front with crest`} className="w-full" />
          <Garment kind={polo.kind} colour="#1f4a36" positions={["back"]} view="back" logo={{ kind: "text", text: "ST ANNE'S" }} title={`${polo.title} for PE kit, back with ST ANNE'S`} className="w-full" />
        </div>
        <div>
          <h2>For schools</h2>
          <dl className="mt-6 border-t-2 border-ink">
            {[["PE kit", "A crested polo for every child, with the school name on the back if you like. Named inside on request."], ["Leavers' hoodies", "Every name on the back, proofed with the school first."], ["Trips and events", "Hi-vis for the coach, caps for sports day."]].map(([t, d]) => (
              <div key={t} className="border-b border-ink py-4"><dt className="t-sub">{t}</dt><dd className="mt-1 text-mute">{d}</dd></div>
            ))}
          </dl>
        </div>
      </section>

      {/* Clubs: an ink band, the shirt back with name and number leading, the rest of the kit bag as a row */}
      <section id="clubs" className="on-ink scroll-mt-24 bg-ink text-paper">
        <div className="wrap band grid gap-x-12 gap-y-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] lg:gap-x-20">
          <div className="flex flex-col gap-4">
            <h2>For sports clubs</h2>
            <p className="t-lede text-paper-mute">Names and numbers on the back, initials on the sleeve, a sponsor if you have one. A squad list in a spreadsheet is fine.</p>
            <dl className="mt-2 border-t border-mute">
              {[["Club hoodies", "Crest on the chest, names on the back."], ["Coaches and staff", "Softshells and fleeces for the touchline and the gate."]].map(([t, d]) => (
                <div key={t} className="border-b border-mute py-4"><dt className="t-sub">{t}</dt><dd className="mt-1 text-paper-mute">{d}</dd></div>
              ))}
            </dl>
          </div>
          <div className="grid grid-cols-4 items-end gap-2 sm:gap-3">
            <div className="col-span-2 rounded-xs bg-stone p-3 sm:p-5"><Garment kind={tee.kind} colour="#b4262a" positions={["back"]} view="back" logo={{ kind: "text", text: "SMITH 9" }} title={`${tee.title} for team kit, back with SMITH 9`} className="w-full" /></div>
            <div className="rounded-xs bg-stone p-2 sm:p-3"><Garment kind={hoodie.kind} colour="#1e2a44" positions={["left-chest"]} title={`${hoodie.title} for club hoodies`} className="w-full" /></div>
            <div className="rounded-xs bg-stone p-2 sm:p-3"><Garment kind={softshell.kind} colour="#1f1d1b" positions={["left-chest"]} title={`${softshell.title} for coaches and staff`} className="w-full" /></div>
          </div>
        </div>
      </section>

      {/* How an order runs: a real sequence on the left, the facts as a ledger on the right */}
      <section className="wrap band grid gap-x-12 gap-y-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)] lg:gap-x-20">
        <div>
          <h2>One spec, then easy re-orders.</h2>
          <ol className="mt-8 border-t-2 border-ink">
            {ORDER.map(([t, d], i) => (
              <li key={t} className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-4 border-b border-ink py-5 sm:grid-cols-[3.5rem_minmax(0,1fr)]">
                <span className="t-num text-rust" aria-hidden="true">{i + 1}</span>
                <div><h3>{t}</h3><p className="mt-1 text-mute">{d}</p></div>
              </li>
            ))}
          </ol>
        </div>
        <div className="flex flex-col gap-8">
          <div>
            <h3>The details</h3>
            <dl className="ledger mt-3 border-b border-ink">
              {[["Minimum order", SITE.minimumOrder], ["Ready", SITE.turnaround], ["Parent ordering", "[PARENT ORDER OPTION]"], ["Names", "£[NAMING CHARGE] per name"], ["Numbers", "£[NUMBERING CHARGE] per number"]].map(([k, v]) => <div key={k}><dt>{k}</dt><dd className="text-mute"><Nb>{v}</Nb></dd></div>)}
            </dl>
          </div>
          <p className="text-mute">[Client review, to come]</p>
          <PhotoSlot shows="A rail of crested PE polos, sized small to large." className="min-h-[220px]" />
        </div>
      </section>

      <section className="wrap">
        <div className="grid gap-6 border-t-2 border-ink pt-10 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
          <div className="flex flex-col gap-3">
            <h2>School uniform too?</h2>
            <p className="measure text-mute">Blazers, jumpers, ties and the rest of the school uniform are at <a href={SITE.family[0].url} className="underline underline-offset-4">I&amp;A Schoolwear</a>. We do the PE and club side; together it is one supplier for the school.</p>
          </div>
          <Link to="/quote" className="btn btn-ink self-start md:self-auto">Build a quote</Link>
        </div>
      </section>
    </>
  );
}
