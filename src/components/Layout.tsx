import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { SITE } from "../data/site";
import { useQuote } from "../lib/quote";
import { store } from "../lib/store";

const BASE = import.meta.env.BASE_URL;
export const NAV = [
  { to: "/services", label: "Services" },
  { to: "/garments", label: "Garments" },
  { to: "/schools-and-clubs", label: "Schools & clubs" },
  { to: "/about", label: "About" },
];

export function Logo({ paper = false, className = "" }: { paper?: boolean; className?: string }) {
  return <img src={`${BASE}img/logo/logolab-horizontal-${paper ? "paper" : "ink"}.svg`} alt="The London Logo Lab" className={className} width="714" height="122" />;
}

export function Header() {
  const [open, setOpen] = useState(false);
  const { quote, saved } = useQuote();
  const { pathname } = useLocation();
  const g = saved ? store.garment(quote.garment) : undefined;
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open]);
  return (
    <>
      {/* One strip: the message on the left, the preview tag on the right. Plain text, no controls. */}
      <aside aria-label="Notice" className="bg-orange text-ink">
        <div className="wrap flex h-[34px] items-center justify-between gap-3 text-[0.8125rem] font-medium">
          <p className="truncate">{g ? <>Your quote: <b>{quote.qty} × {g.title}</b><span className="hidden sm:inline">, saved on this device</span></> : <>From {SITE.minimumOrder}. Ready {SITE.turnaround}.<span className="hidden sm:inline"> Made in Tooting.</span></>}</p>
          {SITE.preview && <span className="shrink-0 rounded-xs border-[1.5px] border-ink px-1.5 py-0.5 text-[0.75rem] font-semibold leading-none" title="Concept preview: garments and prices are samples; quote sending opens at launch">Preview</span>}
        </div>
      </aside>
      <header className="sticky top-0 z-40 border-b-2 border-ink bg-paper">
        <div className="wrap flex min-h-16 items-center justify-between gap-3">
          <Link to="/" className="inline-flex min-h-11 shrink-0 items-center"><Logo className="h-[22px] w-auto min-[400px]:h-6 sm:h-9" /></Link>
          <nav aria-label="Main" className="hidden gap-7 font-medium lg:flex">
            {NAV.map((n) => <NavLink key={n.to} to={n.to} className={({ isActive }) => `inline-flex min-h-11 items-center border-b-2 ${isActive ? "border-orange" : "border-transparent hover:border-ink"}`}>{n.label}</NavLink>)}
          </nav>
          <div className="flex items-center gap-1 sm:gap-2">
            <Link to="/quote" className="btn btn-orange min-h-11 whitespace-nowrap px-3 sm:px-5">{g ? "Your quote" : "Build a quote"}</Link>
            <button type="button" className="inline-flex h-11 w-11 items-center justify-center lg:hidden" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="menu" onClick={() => setOpen(!open)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">{open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}</svg>
            </button>
          </div>
        </div>
        {open && (
          <>
            <div className="absolute inset-x-0 top-full h-screen bg-ink/60 lg:hidden" onClick={() => setOpen(false)} aria-hidden="true" />
            <nav id="menu" aria-label="Menu" className="absolute inset-x-0 top-full max-h-[calc(100dvh-100px)] overflow-y-auto border-b-2 border-ink bg-paper lg:hidden">
              <div className="wrap grid gap-6 py-4 sm:grid-cols-[1.2fr_1fr] sm:py-8">
                <ul className="flex flex-col">
                  {[...NAV, { to: "/quote", label: g ? "Your quote" : "Build a quote" }].map((n) => (
                    <li key={n.to} className="border-b border-line"><NavLink to={n.to} className={({ isActive }) => `t-sub flex min-h-14 items-center justify-between ${isActive ? "underline decoration-orange decoration-4 underline-offset-8" : ""}`}>{n.label}</NavLink></li>
                  ))}
                </ul>
                <div className="flex flex-col gap-3">
                  <p className="font-semibold">The workshop, {SITE.area}</p>
                  <dl className="ledger" style={{ ["--ledger-rule" as string]: "var(--color-line)" }}>
                    <div><dt>Phone</dt><dd>{SITE.phone}</dd></div>
                    <div><dt>Address</dt><dd>{SITE.address}</dd></div>
                    <div><dt>Hours</dt><dd>{SITE.hours}</dd></div>
                  </dl>
                  <p className="text-mute">From {SITE.minimumOrder}, ready {SITE.turnaround}.</p>
                </div>
              </div>
            </nav>
          </>
        )}
      </header>
    </>
  );
}

const SERVICE_LINKS = [["/services#embroidery", "Embroidery"], ["/services#screen", "Screen printing"], ["/services#dtf", "DTF printing"], ["/services#vinyl", "Vinyl"], ["/services#workwear", "Workwear supply"], ["/services#uniforms", "Uniforms"]];
const ORDER_LINKS = [["/quote", "Quote builder"], ["/garments", "Garments"], ["/schools-and-clubs", "Schools & clubs"], ["/about", "About & visit"]];

export function Footer() {
  const item = "inline-flex min-h-11 items-center underline-offset-4 hover:underline";
  return (
    <footer className="on-ink mt-16 bg-deep text-paper sm:mt-24">
      {/* The promise and the way in, as one line across the top */}
      <div className="wrap flex flex-col gap-5 border-b border-ink-soft py-10 md:flex-row md:items-center md:justify-between md:py-12">
        <p className="t-section max-w-[18em]">From {SITE.minimumOrder}, ready {SITE.turnaround}.</p>
        <Link to="/quote" className="btn btn-orange self-start md:self-auto">Build a quote</Link>
      </div>
      <div className="wrap grid gap-x-8 gap-y-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.3fr]">
        <div className="flex flex-col gap-4 sm:col-span-2 lg:col-span-1">
          <Logo paper className="h-8 w-auto self-start" />
          <p className="max-w-[22em] text-paper-mute">Embroidery, printing, workwear and uniforms from a friendly workshop in {SITE.area}.</p>
        </div>
        <nav aria-label="Services">
          <h2 className="label mb-2 text-paper-mute">Services</h2>
          <ul>{SERVICE_LINKS.map(([to, l]) => <li key={to}><Link to={to} className={item}>{l}</Link></li>)}</ul>
        </nav>
        <nav aria-label="Order">
          <h2 className="label mb-2 text-paper-mute">Order</h2>
          <ul>{ORDER_LINKS.map(([to, l]) => <li key={to}><Link to={to} className={item}>{l}</Link></li>)}</ul>
        </nav>
        <div>
          <h2 className="label mb-2 text-paper-mute">Workshop</h2>
          <address className="flex flex-col gap-3 py-2.5 not-italic">
            <p>{SITE.address}<br />{SITE.area}</p>
            <p>{SITE.hours}</p>
            <p>{SITE.phone}<br />{SITE.email}</p>
          </address>
        </div>
      </div>
      <div className="wrap flex flex-col gap-2 border-t border-ink-soft py-6 text-paper-mute lg:flex-row lg:items-baseline lg:justify-between lg:gap-8">
        <p className="t-small shrink-0">Part of the I&amp;A family: {SITE.family.map((f, i) => <span key={f.name}>{i > 0 && ", "}<a className="inline-flex min-h-11 items-center underline underline-offset-4" href={f.url}>{f.name}</a></span>)}</p>
        <p className="t-small lg:text-right">© {SITE.legalName}, trading as {SITE.name}. Company no. [COMPANY NUMBER]. VAT [VAT NUMBER].{SITE.preview && " Concept preview: garments and prices are samples; quote sending opens at launch."}</p>
      </div>
    </footer>
  );
}
