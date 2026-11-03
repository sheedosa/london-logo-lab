import { useId, useRef, useState, type ChangeEvent } from "react";
import { Link } from "react-router-dom";
import { Garment, hasBack } from "./Garment";
import { Copy, Tick, Upload } from "./Icons";
import { BANDS, bandFor, estimate, gbp, methodFor, summary, useQuote, type Decoration } from "../lib/quote";
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
  const methods: { id: Decoration; label: string; dead: boolean }[] = [
    { id: "embroidery", label: "Embroidery", dead: !g.methods.includes("embroidery") },
    { id: "print", label: "Print", dead: !g.methods.includes("print") },
    { id: "both", label: "Both", dead: g.methods.length < 2 },
  ];

  return (
    <div className={`grid gap-8 ${compact ? "lg:grid-cols-[1fr_1fr]" : "lg:grid-cols-[1.1fr_1fr]"}`}>
      {/* Mock-up */}
      <div className="flex flex-col gap-3 lg:order-2 lg:sticky lg:top-24 lg:self-start">
        <div className="relative rounded-pill border-2 border-ink bg-stone p-4 sm:p-6">
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="label">Live mock-up</p>
            {showBack && (
              <div className="flex gap-1" role="group" aria-label="View">
                <button type="button" aria-pressed={shownView === "front"} onClick={() => setView("front")} className="chip min-h-10 px-3 text-xs">Front</button>
                <button type="button" aria-pressed={shownView === "back"} onClick={() => setView("back")} className="chip min-h-10 px-3 text-xs">Back</button>
              </div>
            )}
          </div>
          <Garment kind={g.kind} colour={colour.hex} positions={quote.positions} logo={quote.logo} view={shownView} title={g.title} className="mx-auto w-full max-w-[360px]" />
          <p className="mt-2 text-sm text-mute" aria-live="polite">{g.title} in {colour.name}. {quote.positions.map((p) => `${store.position(p).label}: ${methodFor(quote.method, p)}`).join(" · ")}. {quote.logo ? "Showing your artwork at roughly the right size." : "Dashed boxes mark where the logo goes; add your artwork to see it placed."}</p>
        </div>
        <div className="rounded-pill bg-ink p-5 text-paper on-ink">
          <p className="label text-paper-mute">Sample estimate</p>
          <p className="display mt-1 text-[36px] text-orange sm:text-[44px]" aria-live="polite">from {gbp(est.perItem)} <span className="font-sans text-base text-paper">per item</span></p>
          <p className="text-sm text-paper-mute">{gbp(est.total)} for {quote.qty} · band {est.band.label} · garment {gbp(est.base)} + decoration {gbp(est.decoration)} × {est.band.factor}</p>
          <div className="mt-4 grid grid-cols-4 gap-1 text-center text-xs">
            {BANDS.map((b) => { const e = estimate({ ...quote, qty: b.min })!; const on = b === est.band; return (
              <button key={b.label} type="button" aria-pressed={on} onClick={() => update({ qty: b.min })} className={`flex min-h-12 flex-col justify-center rounded-pill border px-1 ${on ? "border-orange bg-orange text-ink" : "border-paper-mute text-paper hover:border-paper"}`}>
                <span className="font-semibold">{b.label}</span><span>{gbp(e.perItem)}</span>
              </button>
            ); })}
          </div>
          <p className="mt-3 text-xs text-paper-mute">Sample formula for the concept preview, not a price. Real prices, setup charges and minimums come from the workshop at launch.</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-8 lg:order-1">
        <fieldset>
          <legend className="label mb-3">1 · Garment</legend>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {store.garments().map((x) => (
              <button key={x.handle} type="button" aria-pressed={x.handle === g.handle} onClick={() => update({ garment: x.handle })}
                className={`flex min-h-11 flex-col items-center gap-1 rounded-pill border-2 p-2 text-xs font-medium ${x.handle === g.handle ? "border-ink bg-ink text-paper" : "border-line bg-paper hover:border-ink"}`}>
                <Garment kind={x.kind} colour={x.handle === g.handle ? "#f3eee4" : "#e6dfd0"} title={x.title} className="h-12 w-12" />
                <span>{x.title}</span>
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="label mb-3">2 · Colour <span className="normal-case tracking-normal text-mute">({colour.name})</span></legend>
          <div className="flex flex-wrap gap-2">
            {g.colours.map((c) => (
              <button key={c.name} type="button" aria-pressed={c.name === colour.name} aria-label={c.name} onClick={() => update({ colour: c.name })}
                className={`h-11 w-11 rounded-pill border-2 ${c.name === colour.name ? "border-orange ring-2 ring-ink ring-offset-2 ring-offset-paper" : "border-ink"}`} style={{ backgroundColor: c.hex }} />
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="label mb-3">3 · Quantity <span className="normal-case tracking-normal text-mute">(band {bandFor(quote.qty).label})</span></legend>
          <div className="flex flex-wrap items-center gap-2">
            <label htmlFor={`${uid}-qty`} className="sr-only">Quantity</label>
            <input id={`${uid}-qty`} type="number" min={1} max={5000} inputMode="numeric" value={quote.qty} onChange={(e) => update({ qty: Number(e.target.value) })} className="field w-28" />
            {BANDS.map((b) => <Toggle key={b.label} on={bandFor(quote.qty) === b} onClick={() => update({ qty: b.min })}>{b.label}</Toggle>)}
          </div>
        </fieldset>

        <fieldset>
          <legend className="label mb-3">4 · Decoration</legend>
          <div className="flex flex-wrap gap-2">
            {methods.map((m) => <Toggle key={m.id} on={quote.method === m.id} dead={m.dead} onClick={() => update({ method: m.id })} label={m.dead ? `${m.label}, not available on this garment` : undefined}>{m.label}</Toggle>)}
          </div>
          <p className="mt-2 text-sm text-mute">{quote.method === "both" ? "Both: embroidery on chest and sleeve positions, print on the back." : quote.method === "embroidery" ? "Embroidery: stitched thread, the lasting choice for logos up to about 10 cm on polos, fleeces and caps." : "Print: ink on fabric, for big back designs, event tees and hi-vis."}</p>
        </fieldset>

        <fieldset>
          <legend className="label mb-3">5 · Positions</legend>
          <div className="flex flex-wrap gap-2">
            {g.positions.map((p) => { const pos = store.position(p); return <Toggle key={p} on={quote.positions.includes(p)} onClick={() => togglePosition(p)}>{pos.label} <span className="sub ml-1 text-xs">{pos.size}</span></Toggle>; })}
          </div>
        </fieldset>

        {!compact && (
          <fieldset>
            <legend className="label mb-3">6 · Your logo</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <input ref={fileRef} id={`${uid}-file`} type="file" accept="image/png,image/jpeg,image/svg+xml,image/webp,image/gif" onChange={onFile} className="sr-only" />
                <label htmlFor={`${uid}-file`} className="btn btn-ghost cursor-pointer"><Upload size={18} /> Upload a logo</label>
                <p className="text-xs text-mute">PNG, JPG, SVG or WebP, under 3 MB. Stays on this device until you send the quote.</p>
                {fileError && <p role="alert" className="text-sm font-medium">{fileError}</p>}
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor={`${uid}-text`} className="text-sm font-medium">Or type a name to place</label>
                <input id={`${uid}-text`} type="text" maxLength={24} placeholder="e.g. HALE & SONS" value={quote.logo?.kind === "text" ? quote.logo.text : ""} onChange={(e) => update({ logo: e.target.value ? { kind: "text", text: e.target.value } : null })} className="field" />
              </div>
            </div>
            {quote.logo && <button type="button" onClick={() => { update({ logo: null }); if (fileRef.current) fileRef.current.value = ""; }} className="mt-2 inline-flex min-h-11 items-center text-sm underline">Remove artwork{quote.logo.kind === "image" ? ` (${quote.logo.name})` : ""}</button>}
          </fieldset>
        )}

        {compact ? (
          <div className="flex flex-wrap gap-3">
            <Link to="/quote" className="btn btn-orange">Add your logo and finish the quote</Link>
            <button type="button" onClick={reset} className="btn btn-ghost">Start again</button>
          </div>
        ) : (
          <fieldset className="flex flex-col gap-3">
            <legend className="label mb-3">7 · Send it to the workshop</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {([["name", "Your name"], ["org", "Business, school or club"], ["email", "Email"]] as const).map(([k, l]) => (
                <div key={k} className="flex flex-col gap-1">
                  <label htmlFor={`${uid}-${k}`} className="text-sm font-medium">{l}</label>
                  <input id={`${uid}-${k}`} type={k === "email" ? "email" : "text"} autoComplete={k === "email" ? "email" : k === "name" ? "name" : "organization"} value={quote.contact[k]} onChange={(e) => update({ contact: { ...quote.contact, [k]: e.target.value } })} className="field" />
                </div>
              ))}
              <div className="flex flex-col gap-1 sm:col-span-2">
                <label htmlFor={`${uid}-notes`} className="text-sm font-medium">Notes: sizes, names, deadline</label>
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
                <p className="text-sm text-mute">Copy the summary below and email it to {SITE.email}, or bring it to the workshop. Your choices are saved on this device.</p>
                <label htmlFor={`${uid}-summary`} className="sr-only">Quote summary</label>
                <textarea id={`${uid}-summary`} readOnly rows={9} value={text} className="field h-auto py-2 font-mono text-sm" />
                <button type="button" onClick={copy} className="btn btn-ink self-start">{copied ? <Tick size={18} /> : <Copy size={18} />} {copied ? "Copied" : "Copy summary"}</button>
              </div>
            )}
          </fieldset>
        )}
      </div>
    </div>
  );
}
