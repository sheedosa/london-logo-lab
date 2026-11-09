import { useEffect, useId, useRef, useState, type ChangeEvent } from "react";
import { Link } from "react-router-dom";
import { Garment, hasBack } from "./Garment";
import { Copy, Tick, Upload } from "./Icons";
import { PriceLine } from "./PriceLine";
import { BANDS, bandFor, estimate, gbp, summary, useQuote } from "../lib/quote";
import { store, type PositionId } from "../lib/store";
import { SITE } from "../data/site";

const Toggle = ({ on, dead, onClick, children, label, className = "" }: { on: boolean; dead?: boolean; onClick: () => void; children: React.ReactNode; label?: string; className?: string }) => (
  <button type="button" aria-pressed={on} aria-label={label} disabled={dead} onClick={onClick}
    className={`chip ${dead ? "cursor-not-allowed border-line text-mute line-through" : ""} ${className}`}>{children}</button>
);

export function QuoteBuilder({ compact = false }: { compact?: boolean }) {
  const { quote, update, reset } = useQuote();
  const g = store.garment(quote.garment)!;
  const est = estimate(quote)!;
  const colour = g.colours.find((c) => c.name === quote.colour) ?? g.colours[0];
  const [view, setView] = useState<"front" | "back">("front");
  const [ready, setReady] = useState(false);
  const [copied, setCopied] = useState(false);
  const [fileError, setFileError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const uid = useId();
  const mockRef = useRef<HTMLDivElement>(null);
  const [mockHidden, setMockHidden] = useState(false);
  const [stripOpen, setStripOpen] = useState(false);
  // On phones the big mock-up scrolls away as soon as a control is touched; a compact strip takes over until it is back.
  useEffect(() => {
    const el = mockRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => { setMockHidden(!e.isIntersecting); if (e.isIntersecting) setStripOpen(false); }, { rootMargin: "-120px 0px 0px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const allowed = store.positionsFor(g, quote.method);
  const showBack = hasBack(g.kind) && quote.positions.includes("back");
  const shownView = showBack && view === "back" ? "back" : "front";

  const togglePosition = (p: PositionId) => {
    const next = quote.positions.includes(p) ? quote.positions.filter((x) => x !== p) : [...quote.positions, p];
    if (next.length) update({ positions: next });
  };
  const onFile = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; setFileError("");
    if (!f) return;
    if (!/^image\/(png|jpeg|svg\+xml|webp|gif)$/.test(f.type)) { setFileError("Use a PNG, JPG, SVG or WebP. Vector files (Illustrator, EPS, PDF) can be sent after the quote."); return; }
    if (f.size > 3_000_000) { setFileError("Keep the preview file under 3 MB. The full-size artwork can follow by email."); return; }
    const r = new FileReader();
    r.onload = () => update({ logo: { kind: "image", dataUrl: String(r.result), name: f.name } });
    r.readAsDataURL(f);
  };
  const text = summary(quote);
  const copy = async () => { try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { setCopied(false); } };
  return (
    <div className={`grid gap-8 ${compact ? "lg:grid-cols-[1fr_1fr]" : "lg:grid-cols-[1.1fr_1fr]"}`}>
      {/* Compact live strip, phones only, while the big mock-up is off screen */}
      {!compact && mockHidden && (
        <div className="fixed inset-x-0 top-[66px] z-30 border-b-2 border-ink bg-stone px-4 py-2 lg:hidden">
          <button type="button" aria-expanded={stripOpen} onClick={() => setStripOpen(!stripOpen)} className="flex min-h-14 w-full items-center gap-3 text-left">
            <Garment kind={g.kind} colour={colour.hex} positions={quote.positions} logo={quote.logo} view={shownView} title={g.title} className="h-14 w-14 shrink-0" />
            <span className="flex min-w-0 flex-1 flex-col leading-tight">
              <span className="truncate font-semibold">{g.title}, {colour.name}</span>
              <span className="truncate text-[14px] text-mute">{quote.positions.map((x) => store.position(x).label).join(", ")} · {store.method(quote.method).label}</span>
            </span>
            <span className="display whitespace-nowrap text-[20px]">{gbp(est.perItem)}</span>
          </button>
          {stripOpen && <Garment kind={g.kind} colour={colour.hex} positions={quote.positions} logo={quote.logo} view={shownView} title={g.title} className="mx-auto mt-2 w-full max-w-[260px]" />}
        </div>
      )}

      {/* Mock-up */}
      <div className="flex flex-col gap-3 lg:order-2 lg:sticky lg:top-24 lg:self-start">
        <div ref={mockRef} className="relative rounded-pill border-2 border-ink bg-stone p-4 sm:p-6">
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="label">Live mock-up</p>
            {showBack && (
              <div className="flex gap-1" role="group" aria-label="View">
                <button type="button" aria-pressed={shownView === "front"} onClick={() => setView("front")} className="chip min-h-11 px-3 text-sm">Front</button>
                <button type="button" aria-pressed={shownView === "back"} onClick={() => setView("back")} className="chip min-h-11 px-3 text-sm">Back</button>
              </div>
            )}
          </div>
          <Garment kind={g.kind} colour={colour.hex} positions={quote.positions} logo={quote.logo} view={shownView} title={g.title} className="mx-auto w-full max-w-[360px]" />
          <p className="mt-2 text-mute" aria-live="polite">{g.title} in {colour.name}, {store.method(quote.method).label.toLowerCase()} on the {quote.positions.map((p) => store.position(p).label.toLowerCase()).join(" and ")}. {quote.logo ? "Your artwork is shown at roughly the right size." : "Dashed boxes show where the logo goes. Add yours to see it there."}</p>
        </div>
        <div className="rounded-pill bg-ink p-5 text-paper on-ink">
          <PriceLine perItem={est.perItem} onInk big />
          <p className="mt-1 text-[14px] text-paper-mute">{gbp(est.total)} for {quote.qty} · garment {gbp(est.garment)} + decoration {gbp(est.decoration)}</p>
          <div className="mt-4 grid grid-cols-4 gap-1 text-center text-[14px]">
            {BANDS.map((b) => { const e = estimate({ ...quote, qty: b.min })!; const on = b === est.band; return (
              <button key={b.label} type="button" aria-pressed={on} onClick={() => update({ qty: b.min })} className={`flex min-h-12 flex-col justify-center rounded-pill border px-1 ${on ? "border-orange bg-orange text-ink" : "border-paper-mute text-paper hover:border-paper"}`}>
                <span className="font-semibold">{b.label}</span><span>{gbp(e.perItem)}</span>
              </button>
            ); })}
          </div>
          <p className="mt-3 text-[13px] text-paper-mute">Sample formula for the preview, not a price. We price per item, and real prices come from the workshop.</p>
          {!compact && <a href="#send" className="mt-3 inline-flex min-h-11 items-center font-semibold text-paper underline">Rather talk to a person? Ask us for a quote</a>}
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-8 lg:order-1">
        <fieldset>
          <legend className="label mb-3">Garment</legend>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {store.garments().map((x) => (
              <button key={x.handle} type="button" aria-pressed={x.handle === g.handle} onClick={() => update({ garment: x.handle })}
                className={`flex min-h-11 flex-col items-center gap-1 rounded-pill border-2 p-2 text-[13px] font-medium leading-tight ${x.handle === g.handle ? "border-ink bg-ink text-paper" : "border-line bg-paper hover:border-ink"}`}>
                <Garment kind={x.kind} colour={x.handle === g.handle ? "#f3eee4" : "#e6dfd0"} title={x.title} className="h-12 w-12" />
                <span>{x.title}</span>
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="label mb-3">Colour <span className="normal-case tracking-normal text-mute">({colour.name})</span></legend>
          <div className="flex flex-wrap gap-2">
            {g.colours.map((c) => (
              <button key={c.name} type="button" aria-pressed={c.name === colour.name} aria-label={c.name} onClick={() => update({ colour: c.name })}
                className={`h-11 w-11 rounded-pill border-2 ${c.name === colour.name ? "border-orange ring-2 ring-ink ring-offset-2 ring-offset-paper" : "border-ink"}`} style={{ backgroundColor: c.hex }} />
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="label mb-3">How many <span className="normal-case tracking-normal text-mute">(from 1 item)</span></legend>
          <div className="flex flex-wrap items-center gap-2">
            <label htmlFor={`${uid}-qty`} className="sr-only">Quantity</label>
            <input id={`${uid}-qty`} type="number" min={1} max={5000} inputMode="numeric" value={quote.qty} onChange={(e) => update({ qty: Number(e.target.value) })} className="field w-28" />
            {BANDS.map((b) => <Toggle key={b.label} on={bandFor(quote.qty) === b} onClick={() => update({ qty: b.min })}>{b.label}</Toggle>)}
          </div>
        </fieldset>

        <fieldset>
          <legend className="label mb-3">Decoration</legend>
          <div className="flex flex-wrap gap-2">
            {store.methods().map((m) => { const dead = !g.methods.includes(m.id); return <Toggle key={m.id} on={quote.method === m.id} dead={dead} onClick={() => update({ method: m.id })} label={dead ? `${m.label}, not available on this garment` : undefined}>{m.label}</Toggle>; })}
          </div>
          <p className="mt-2 text-mute">{store.method(quote.method).line}</p>
        </fieldset>

        <fieldset>
          <legend className="label mb-3">Where it goes</legend>
          <div className="flex flex-wrap gap-2">
            {allowed.map((p) => { const pos = store.position(p); return <Toggle key={p} on={quote.positions.includes(p)} onClick={() => togglePosition(p)}>{pos.label} <span className="sub ml-1 text-[13px]">{pos.size}</span></Toggle>; })}
          </div>
          {allowed.length < g.positions.length && <p className="mt-2 text-mute">{store.method(quote.method).label} isn't offered on the {g.positions.filter((p) => !allowed.includes(p)).map((p) => store.position(p).label.toLowerCase()).join(" or ")} of this garment.</p>}
        </fieldset>

        {!compact && (
          <fieldset>
            <legend className="label mb-3">Your logo</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <input ref={fileRef} id={`${uid}-file`} type="file" accept="image/png,image/jpeg,image/svg+xml,image/webp,image/gif" onChange={onFile} className="sr-only" />
                <label htmlFor={`${uid}-file`} className="btn btn-ghost cursor-pointer"><Upload size={18} /> Upload a logo</label>
                <p className="text-[14px] text-mute">PNG, JPG, SVG or WebP, under 3 MB. It stays on this device until you send the quote.</p>
                {fileError && <p role="alert" className="font-medium">{fileError}</p>}
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor={`${uid}-text`} className="font-medium">Or type a name to see it placed</label>
                <input id={`${uid}-text`} type="text" maxLength={24} placeholder="e.g. HALE & SONS" value={quote.logo?.kind === "text" ? quote.logo.text : ""} onChange={(e) => update({ logo: e.target.value ? { kind: "text", text: e.target.value } : null })} className="field" />
              </div>
            </div>
            {quote.logo && <button type="button" onClick={() => { update({ logo: null }); if (fileRef.current) fileRef.current.value = ""; }} className="mt-2 inline-flex min-h-11 items-center underline">Remove artwork{quote.logo.kind === "image" ? ` (${quote.logo.name})` : ""}</button>}
          </fieldset>
        )}

        {compact ? (
          <div className="flex flex-wrap gap-3">
            <Link to="/quote" className="btn btn-orange">Add your logo and finish the quote</Link>
            <button type="button" onClick={reset} className="btn btn-ghost">Start again</button>
          </div>
        ) : (
          <fieldset id="send" className="flex scroll-mt-28 flex-col gap-3">
            <legend className="label mb-3">Send it to the workshop</legend>
            <p className="text-mute">Happy with the estimate, or would you rather we priced it? Either way, leave your details and we'll come back with a price per item.</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {([["name", "Your name"], ["org", "Business, school or club"], ["email", "Email"]] as const).map(([k, l]) => (
                <div key={k} className="flex flex-col gap-1">
                  <label htmlFor={`${uid}-${k}`} className="font-medium">{l}</label>
                  <input id={`${uid}-${k}`} type={k === "email" ? "email" : "text"} autoComplete={k === "email" ? "email" : k === "name" ? "name" : "organization"} value={quote.contact[k]} onChange={(e) => update({ contact: { ...quote.contact, [k]: e.target.value } })} className="field" />
                </div>
              ))}
              <div className="flex flex-col gap-1 sm:col-span-2">
                <label htmlFor={`${uid}-notes`} className="font-medium">Notes: sizes, names, when you need it</label>
                <textarea id={`${uid}-notes`} rows={3} value={quote.contact.notes} onChange={(e) => update({ contact: { ...quote.contact, notes: e.target.value } })} className="field h-auto py-2" />
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={() => setReady(true)} className="btn btn-orange">Prepare quote request</button>
              <button type="button" onClick={() => { reset(); setReady(false); if (fileRef.current) fileRef.current.value = ""; }} className="btn btn-ghost">Start again</button>
            </div>
            {ready && (
              <div role="status" className="flex flex-col gap-3 rounded-pill border-2 border-ink bg-stone p-4">
                <p className="font-semibold">Quote request ready; sending opens at launch.</p>
                <p className="text-mute">Copy the summary below and email it to {SITE.email}, or bring it to the workshop. Your choices are saved on this device.</p>
                <label htmlFor={`${uid}-summary`} className="sr-only">Quote summary</label>
                <textarea id={`${uid}-summary`} readOnly rows={9} value={text} className="field h-auto py-2 font-mono text-[14px]" />
                <button type="button" onClick={copy} className="btn btn-ink self-start">{copied ? <Tick size={18} /> : <Copy size={18} />} {copied ? "Copied" : "Copy summary"}</button>
              </div>
            )}
          </fieldset>
        )}
      </div>
    </div>
  );
}
