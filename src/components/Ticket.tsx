import { useId, useRef, useState, type ChangeEvent, type ReactNode, type Ref } from "react";
import { Link } from "react-router-dom";
import { Garment, hasBack } from "./Garment";
import { Marque, Upload } from "./Icons";
import { TICKET_VT } from "./VLink";
import { BANDS, bandFor, estimate, gbp, type LineId, type Quote } from "../lib/quote";
import { store, type PositionId } from "../lib/store";
import { SITE } from "../data/site";

// The workshop job ticket: the quote, written up line by line. Each line is a ruled row that opens to show its
// choices; a line the visitor has chosen gets a stitched tick. The stub below the tear line carries the total.
// This is the only place the running-stitch border appears.

/** Running-stitch border, just inside the paper edge. */
export const Stitch = () => <svg className="stitch" aria-hidden="true"><rect width="100%" height="100%" rx="2" /></svg>;

/** Empty dashed box until the line is chosen; then the marque's ink tile with a thread tick. */
export function StitchTick({ on }: { on: boolean }) {
  return (
    <svg viewBox="0 0 22 22" className="tick" data-on={on} aria-hidden="true">
      <rect className="tile" x="1" y="1" width="20" height="20" rx="2" />
      <path className="thread" d="M5.6 11.6 L9.4 15.4 L16.6 6.6" />
    </svg>
  );
}

const LABEL: Record<LineId, string> = { garment: "Garment", colour: "Colour", qty: "How many", method: "Decoration", positions: "Where", logo: "Your logo" };

export const positionList = (ps: PositionId[]) => ps.map((p, i) => (i ? store.position(p).label.toLowerCase() : store.position(p).label)).join(", ");

type Props = {
  quote: Quote;
  choose: (patch: Partial<Quote>, line: LineId) => void;
  lines: LineId[];
  /** Short list of garments offered as chips (Home). Without it every garment is shown with its drawing. */
  quick?: string[];
  startOpen?: LineId | null;
  /** The surface the ticket lies on; the punched holes show it through. */
  ground?: "ink" | "stone";
  /** Show the four quantity bands in the stub. */
  bands?: boolean;
  /** Printed under the ticket name when the garment is fixed (garment pages). */
  subject?: string;
  stubRef?: Ref<HTMLDivElement>;
  children?: ReactNode;
  className?: string;
};

export function Ticket({ quote, choose, lines, quick, startOpen = null, ground = "stone", bands = false, subject, stubRef, children, className = "" }: Props) {
  const g = store.garment(quote.garment)!;
  const est = estimate(quote)!;
  const colour = g.colours.find((c) => c.name === quote.colour) ?? g.colours[0];
  const allowed = store.positionsFor(g, quote.method);
  const [open, setOpen] = useState<LineId | null>(startOpen);
  const [fileError, setFileError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const uid = useId();
  const done = (l: LineId) => (l === "logo" ? Boolean(quote.logo) : Boolean(quote.done?.includes(l)));

  const togglePosition = (p: PositionId) => {
    const next = quote.positions.includes(p) ? quote.positions.filter((x) => x !== p) : [...quote.positions, p];
    if (next.length) choose({ positions: next }, "positions");
  };
  const onFile = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; setFileError("");
    if (!f) return;
    if (!/^image\/(png|jpeg|svg\+xml|webp|gif)$/.test(f.type)) { setFileError("That file type can't be previewed. Use a PNG, JPG, SVG or WebP here; vector files (Illustrator, EPS, PDF) can be sent after the quote."); return; }
    if (f.size > 3_000_000) { setFileError("That file is over 3 MB. Use a smaller one for the preview; the full-size artwork can follow by email."); return; }
    const r = new FileReader();
    r.onload = () => choose({ logo: { kind: "image", dataUrl: String(r.result), name: f.name } }, "logo");
    r.readAsDataURL(f);
  };

  const value: Record<LineId, ReactNode> = {
    garment: <span>{g.title}</span>,
    colour: <><span className="h-4 w-4 shrink-0 rounded-xs border border-ink" style={{ backgroundColor: colour.hex }} aria-hidden="true" /><span>{colour.name}</span></>,
    qty: <span>{quote.qty} {quote.qty === 1 ? "item" : "items"}</span>,
    method: <span>{store.method(quote.method).label}</span>,
    positions: <span>{positionList(quote.positions)}</span>,
    logo: <span className={quote.logo ? "" : "font-normal text-mute"}>{quote.logo ? (quote.logo.kind === "image" ? quote.logo.name : quote.logo.text) : "Not added yet"}</span>,
  };

  const options: Record<LineId, ReactNode> = {
    garment: quick ? (
      <div className="flex flex-wrap gap-2">
        {quick.map((h) => { const x = store.garment(h)!; return <button key={h} type="button" aria-pressed={h === g.handle} onClick={() => choose({ garment: h }, "garment")} className="chip">{x.title}</button>; })}
        <Link to="/garments" className="link px-1">All {store.garments().length} garments</Link>
      </div>
    ) : (
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {store.garments().map((x) => (
          <button key={x.handle} type="button" aria-pressed={x.handle === g.handle} onClick={() => choose({ garment: x.handle }, "garment")}
            className={`flex min-h-11 flex-col items-center gap-1 rounded-xs border-2 px-1 py-2 text-[0.875rem] font-medium leading-tight ${x.handle === g.handle ? "border-ink bg-ink text-paper" : "border-line hover:border-ink"}`}>
            <Garment kind={x.kind} colour={x.handle === g.handle ? "#f3eee4" : "#e6dfd0"} title={x.title} className="h-12 w-12" />
            <span>{x.title}</span>
          </button>
        ))}
      </div>
    ),
    colour: (
      <div className="flex flex-wrap gap-2.5">
        {g.colours.map((c) => <button key={c.name} type="button" aria-pressed={c.name === colour.name} aria-label={c.name} title={c.name} onClick={() => choose({ colour: c.name }, "colour")} className="swatch" style={{ backgroundColor: c.hex }} />)}
      </div>
    ),
    qty: (
      <div className="flex flex-wrap items-center gap-2">
        <label htmlFor={`${uid}-qty`} className="sr-only">Quantity</label>
        <input id={`${uid}-qty`} type="number" min={1} max={5000} inputMode="numeric" value={quote.qty} onChange={(e) => choose({ qty: Number(e.target.value) }, "qty")} className="field w-24" />
        {BANDS.map((b) => <button key={b.label} type="button" aria-pressed={bandFor(quote.qty) === b} onClick={() => choose({ qty: b.min }, "qty")} className="chip">{b.label}</button>)}
        <p className="t-small w-full text-mute">From {SITE.minimumOrder}. The price per item drops at each band.</p>
      </div>
    ),
    method: (
      <>
        <div className="flex flex-wrap gap-2">
          {store.methods().map((m) => { const dead = !g.methods.includes(m.id); return <button key={m.id} type="button" aria-pressed={quote.method === m.id} disabled={dead} aria-label={dead ? `${m.label}, not available on this garment` : undefined} onClick={() => choose({ method: m.id }, "method")} className="chip">{m.label}</button>; })}
        </div>
        <p className="mt-2 text-mute">{store.method(quote.method).line}</p>
      </>
    ),
    positions: (
      <>
        <div className="flex flex-wrap gap-2">
          {allowed.map((p) => { const pos = store.position(p); return <button key={p} type="button" aria-pressed={quote.positions.includes(p)} onClick={() => togglePosition(p)} className="chip h-auto flex-col items-start justify-center py-1 leading-tight"><span>{pos.label}</span><span className="sub">{pos.size}</span></button>; })}
        </div>
        <p className="mt-2 text-mute">Pick one or more.{allowed.length < g.positions.length && ` ${store.method(quote.method).label} isn't offered on the ${g.positions.filter((p) => !allowed.includes(p)).map((p) => store.position(p).label.toLowerCase()).join(" or ")} of this garment.`}</p>
      </>
    ),
    logo: (
      <>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <input ref={fileRef} id={`${uid}-file`} type="file" accept="image/png,image/jpeg,image/svg+xml,image/webp,image/gif" onChange={onFile} aria-describedby={`${uid}-filehelp`} className="peer sr-only" />
            <label htmlFor={`${uid}-file`} className="btn btn-ghost cursor-pointer peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink"><Upload size={18} /> Upload a logo</label>
            <p id={`${uid}-filehelp`} className="t-small text-mute">PNG, JPG, SVG or WebP, under 3 MB. It stays on this device until you send the quote.</p>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor={`${uid}-text`} className="font-medium">Or type a name to see it placed</label>
            <input id={`${uid}-text`} type="text" maxLength={24} autoComplete="off" autoCapitalize="characters" placeholder="e.g. HALE & SONS" value={quote.logo?.kind === "text" ? quote.logo.text : ""} onChange={(e) => choose({ logo: e.target.value ? { kind: "text", text: e.target.value } : null }, "logo")} className="field" />
          </div>
        </div>
        {fileError && <p role="alert" className="mt-2 font-medium">{fileError}</p>}
        {quote.logo && <button type="button" onClick={() => { choose({ logo: null }, "logo"); if (fileRef.current) fileRef.current.value = ""; }} className="link mt-1">Remove artwork{quote.logo.kind === "image" ? ` (${quote.logo.name})` : ""}</button>}
      </>
    ),
  };

  return (
    <article className={`ticket ${className}`} style={{ ...TICKET_VT, ["--ground" as string]: ground === "ink" ? "var(--color-ink)" : "var(--color-stone)" }} aria-label="Job ticket: your quote">
      <div className="ticket-body">
        <Stitch />
        <div className="ticket-head">
          <div className="flex min-w-0 items-center gap-2.5">
            <Marque size={30} className="hidden shrink-0 sm:block" />
            <p className="flex min-w-0 flex-col"><span className="ticket-name whitespace-nowrap">Job ticket</span>{subject && <span className="t-small truncate text-mute">{subject}</span>}</p>
          </div>
          <p className="ticket-stamp shrink-0">{SITE.minimumOrder} minimum<br />Ready {SITE.turnaround}</p>
        </div>
        {lines.map((l) => {
          const isOpen = open === l;
          return (
            <div key={l} className="ticket-line" data-open={isOpen}>
              <button type="button" className="ticket-row" aria-expanded={isOpen} aria-controls={`${uid}-${l}`} onClick={() => setOpen(isOpen ? null : l)}>
                <StitchTick on={done(l)} />
                <span className="label">{LABEL[l]}</span>
                <span className="ticket-value">{value[l]}</span>
                <svg className="chev" width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><path d="M5 7.5l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                <span className="sr-only">{done(l) ? ", chosen" : ""}</span>
              </button>
              <div className="ticket-opts" id={`${uid}-${l}`} role="group" aria-label={LABEL[l]} inert={!isOpen}>
                <div><div>{options[l]}</div></div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="ticket-perf" aria-hidden="true" />
      <div className="ticket-stub" ref={stubRef}>
        <Stitch />
        <div className="relative flex flex-col gap-3">
          <div aria-live="polite">
            <p className="label text-mute">Sample estimate</p>
            <p className="ticket-total"><span>from</span><span className="t-num">{gbp(est.perItem)}</span><span>per item</span></p>
            <p className="t-small mt-1 text-mute">{gbp(est.total)} for {quote.qty}. Garment {gbp(est.garment)}, decoration {gbp(est.decoration)}.</p>
          </div>
          {bands && (
            <div className="grid grid-cols-4 gap-1.5" role="group" aria-label="Price per item at each quantity band">
              {BANDS.map((b) => { const e = estimate({ ...quote, qty: b.min })!; return (
                <button key={b.label} type="button" aria-pressed={b === est.band} onClick={() => choose({ qty: b.min }, "qty")} className="band-btn"><span className="font-semibold">{b.label}</span><span>{gbp(e.perItem)}</span></button>
              ); })}
            </div>
          )}
          <p className="t-small text-mute">Sample formula for the preview, not a price. We price per item, and real prices come from the workshop.</p>
          {children}
        </div>
      </div>
    </article>
  );
}

/** The live flat mock-up that sits beside the ticket. On phones it is a short strip that pins under the header
 *  while the ticket is filled in, and can be opened up to full size. */
export function Mock({ quote, vtName, className = "" }: { quote: Quote; vtName?: string; className?: string }) {
  const g = store.garment(quote.garment)!;
  const colour = g.colours.find((c) => c.name === quote.colour) ?? g.colours[0];
  const [view, setView] = useState<"front" | "back">("front");
  const [big, setBig] = useState(false);
  const canBack = hasBack(g.kind) && quote.positions.includes("back");
  const onlyBack = canBack && quote.positions.length === 1;
  const shown = canBack && (view === "back" || onlyBack) ? "back" : "front";
  const caption = `${g.title} in ${colour.name}, ${store.method(quote.method).label.toLowerCase()} on the ${quote.positions.map((p) => store.position(p).label.toLowerCase()).join(" and ")}.`;
  return (
    <div className={`mock ${className}`}>
      <div className={`grid items-center gap-x-4 p-3 md:block md:p-8 ${big ? "grid-cols-1" : "grid-cols-[112px_minmax(0,1fr)]"}`}>
        <div key={g.handle} className="mock-swap" style={vtName ? { viewTransitionName: vtName } : undefined}>
          <Garment kind={g.kind} colour={colour.hex} positions={quote.positions} logo={quote.logo} view={shown} title={g.title} className={`mx-auto w-full ${big ? "max-w-[300px]" : ""} md:max-w-[440px]`} />
        </div>
        <div className="flex flex-col gap-2 md:mt-4">
          <p aria-live="polite" className="t-small md:text-base">{caption} <span className="text-mute">{quote.logo ? "Your artwork is shown at roughly the right size." : "Dashed boxes show where the logo goes."}</span></p>
          <div className="flex flex-wrap gap-2">
            {canBack && !onlyBack && (
              <div className="flex gap-1.5" role="group" aria-label="View">
                <button type="button" aria-pressed={shown === "front"} onClick={() => setView("front")} className="chip">Front</button>
                <button type="button" aria-pressed={shown === "back"} onClick={() => setView("back")} className="chip">Back</button>
              </div>
            )}
            <button type="button" aria-expanded={big} onClick={() => setBig(!big)} className="chip md:hidden">{big ? "Smaller" : "Bigger"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Phone-only bar with the running total and the next action. Shown while the ticket is on screen but its stub
 *  (the real total and buttons) is not. */
export function TotalBar({ quote, show, children }: { quote: Quote; show: boolean; children: ReactNode }) {
  const est = estimate(quote)!;
  return (
    <div className="bar on-ink border-t-2 border-ink bg-ink text-paper md:hidden" data-show={show} inert={!show}>
      <div className="flex min-h-16 items-center justify-between gap-3 px-4 py-2">
        <p className="flex flex-col leading-tight"><span className="t-small text-paper-mute">Sample estimate</span><span><b className="text-[1.125rem]">from {gbp(est.perItem)}</b> per item</span></p>
        {children}
      </div>
    </div>
  );
}
