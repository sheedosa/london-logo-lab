import { useId, useRef, useState, type FormEvent } from "react";
import { Copy, Tick } from "./Icons";
import { Mock, Ticket, TotalBar } from "./Ticket";
import { LINES, summary, useQuote } from "../lib/quote";
import { useOnScreen } from "../lib/useOnScreen";
import { SITE } from "../data/site";

type Errors = Partial<Record<"name" | "email", string>>;

/** The full job ticket with the live mock-up beside it, then the form that sends it to the workshop. */
export function QuoteBuilder() {
  const { quote, choose, update, reset } = useQuote();
  const [ready, setReady] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const uid = useId();
  const benchRef = useRef<HTMLDivElement>(null);
  const stubRef = useRef<HTMLDivElement>(null);
  const sendRef = useRef<HTMLFormElement>(null);
  const benchOn = useOnScreen(benchRef, false), stubOn = useOnScreen(stubRef), sendOn = useOnScreen(sendRef, false);

  const text = summary(quote);
  const copy = async () => { try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { setCopied(false); } };
  const submit = (e: FormEvent) => {
    e.preventDefault();
    const next: Errors = {};
    if (!quote.contact.name.trim()) next.name = "Add your name so we know who to reply to.";
    if (!quote.contact.email.trim()) next.email = "Add an email address so we can send the price.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(quote.contact.email.trim())) next.email = "That email address looks incomplete. It should look like name@example.co.uk.";
    setErrors(next);
    const first = (["name", "email"] as const).find((k) => next[k]);
    if (first) { setReady(false); document.getElementById(`${uid}-${first}`)?.focus(); return; }
    setReady(true);
  };
  const set = (k: keyof typeof quote.contact, v: string) => { update({ contact: { ...quote.contact, [k]: v } }); if (k === "name" || k === "email") setErrors((x) => ({ ...x, [k]: undefined })); };
  const FIELDS = [
    { k: "name", l: "Your name", type: "text", auto: "name", mode: "text" },
    { k: "org", l: "Business, school or club (optional)", type: "text", auto: "organization", mode: "text" },
    { k: "email", l: "Email", type: "email", auto: "email", mode: "email" },
  ] as const;

  return (
    <div ref={benchRef} className="md:grid md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] md:items-start md:gap-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:gap-12">
      <Mock quote={quote} vtName="mock" className="sticky top-[var(--header-h)] z-20 -mx-4 max-md:rounded-none max-md:border-x-0 max-md:border-t-0 sm:-mx-8 md:top-24 md:order-2 md:mx-0" />

      <div className="mt-5 flex flex-col gap-8 md:order-1 md:mt-0">
        <Ticket quote={quote} choose={choose} lines={LINES} startOpen="garment" bands stubRef={stubRef}>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
            <a href="#send" className="btn btn-orange">Send it to the workshop</a>
            <button type="button" onClick={() => { reset(); setReady(false); setErrors({}); }} className="link">Start again</button>
          </div>
        </Ticket>

        <form id="send" ref={sendRef} onSubmit={submit} noValidate className="flex scroll-mt-28 flex-col gap-4 rounded-xs border-2 border-ink bg-paper p-5 sm:p-7">
          <h2 className="t-sub">Send it to the workshop</h2>
          <p className="text-mute">Happy with the estimate, or would you rather we priced it? Either way, leave your details and we'll come back with a price per item.</p>
          <div className="grid gap-4 sm:grid-cols-2">
            {FIELDS.map((f) => { const err = f.k === "org" ? undefined : errors[f.k]; return (
              <div key={f.k} className={`flex flex-col gap-1 ${f.k === "email" ? "sm:col-span-2" : ""}`}>
                <label htmlFor={`${uid}-${f.k}`} className="font-medium">{f.l}</label>
                <input id={`${uid}-${f.k}`} type={f.type} inputMode={f.mode} autoComplete={f.auto} autoCapitalize={f.k === "email" ? "none" : undefined} spellCheck={f.k === "email" ? false : undefined} aria-invalid={err ? true : undefined} aria-describedby={err ? `${uid}-${f.k}-err` : undefined} value={quote.contact[f.k]} onChange={(e) => set(f.k, e.target.value)} className="field" />
                {err && <p id={`${uid}-${f.k}-err`} className="font-medium text-rust">{err}</p>}
              </div>
            ); })}
            <div className="flex flex-col gap-1 sm:col-span-2">
              <label htmlFor={`${uid}-notes`} className="font-medium">Notes: sizes, names, when you need it (optional)</label>
              <textarea id={`${uid}-notes`} rows={3} value={quote.contact.notes} onChange={(e) => set("notes", e.target.value)} className="field py-2" />
            </div>
          </div>
          <button type="submit" className="btn btn-orange self-start">Prepare quote request</button>
          <div role="status">
            {ready && (
              <div className="flex flex-col gap-3 rounded-xs bg-stone p-4">
                <p className="font-semibold">Quote request ready; sending opens at launch.</p>
                <p className="text-mute">Copy the summary below and email it to {SITE.email}, or bring it to the workshop. Your choices are saved on this device.</p>
                <label htmlFor={`${uid}-summary`} className="sr-only">Quote summary</label>
                <textarea id={`${uid}-summary`} readOnly rows={9} value={text} className="field py-2 text-[0.9375rem]" />
                <button type="button" onClick={copy} className="btn btn-ink self-start">{copied ? <Tick size={18} /> : <Copy size={18} />} {copied ? "Copied" : "Copy summary"}</button>
              </div>
            )}
          </div>
        </form>
      </div>

      <TotalBar quote={quote} show={benchOn && !stubOn && !sendOn}>
        <a href="#send" className="btn btn-orange min-h-11 px-4">Send to workshop</a>
      </TotalBar>
    </div>
  );
}
