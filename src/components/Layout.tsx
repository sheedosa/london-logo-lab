import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { SITE } from "../data/site";
import { CONTACT, CONTACT_TO_COME, allKnown } from "../lib/contact";
import { useQuote } from "../lib/quote";
import { store } from "../lib/store";

const BASE = import.meta.env.BASE_URL;
export const NAV = [
  { to: "/services", label: "Services" },
  { to: "/garments", label: "Garments" },
  { to: "/schools-and-clubs", label: "Schools & clubs" },
  { to: "/about", label: "About" },
];

export function Logo({ className = "" }: { className?: string }) {
  return <img src={`${BASE}img/logo/logolab-horizontal-ink.svg`} alt="The London Logo Lab" className={className} width="714" height="122" />;
}

export function Header() {
  const [open, setOpen] = useState(false);
  const { quote, saved } = useQuote();
  const { pathname } = useLocation();
  const g = saved ? store.garment(quote.garment) : undefined;
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      const bar = document.querySelector<HTMLElement>("header");
      if (e.key === "Escape") { setOpen(false); bar?.querySelector<HTMLElement>("button[aria-controls]")?.focus(); return; }
      if (e.key !== "Tab" || !bar) return;
      // Keep Tab inside the header and its open panel.
      const stops = [...bar.querySelectorAll<HTMLElement>("a[href], button")].filter((el) => el.offsetParent !== null);
      const first = stops[0], last = stops[stops.length - 1], at = document.activeElement;
      if (e.shiftKey && (at === first || !bar.contains(at))) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && (at === last || !bar.contains(at))) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open]);
  const quoteWord = g ? "Your quote" : "Build a quote";
  // Plain words. The page you are on is underlined in ink; the way in to the quote always carries the orange line.
  const word = (isActive: boolean) => `inline-flex min-h-11 items-center whitespace-nowrap underline-offset-[7px] ${isActive ? "underline decoration-2" : "hover:underline hover:decoration-2"}`;
  return (
    // One bar on Paper with a 2px Ink rule: the lockup, the pages as plain words, and the promise as a stamp.
    <header className="sticky top-0 z-40 border-b-2 border-ink bg-paper">
      <div className="wrap flex min-h-16 items-center gap-3 lg:gap-9">
        <Link to="/" className="inline-flex min-h-11 shrink-0 items-center"><Logo className="h-[22px] w-auto min-[400px]:h-6 sm:h-9" /></Link>
        <nav aria-label="Main" className="hidden items-center gap-6 font-medium lg:flex xl:gap-8">
          {NAV.map((n) => <NavLink key={n.to} to={n.to} className={({ isActive }) => word(isActive)}>{n.label}</NavLink>)}
          <NavLink to="/quote" className="inline-flex min-h-11 items-center whitespace-nowrap font-semibold underline decoration-orange decoration-4 underline-offset-[7px] hover:decoration-orange-deep">
            {quoteWord}{g && <span className="hidden font-normal xl:inline">: {quote.qty} × {g.title}</span>}
          </NavLink>
        </nav>
        <p className="stamp ml-auto hidden shrink-0 md:block">{SITE.minimumOrder} minimum<br />Ready {SITE.turnaround}</p>
        <div className="ml-auto flex items-center gap-1 sm:gap-2 md:ml-2 lg:hidden">
          <Link to="/quote" className="btn btn-orange min-h-11 whitespace-nowrap px-4">{g ? "Your quote" : "Quote"}</Link>
          <button type="button" className="inline-flex h-11 w-11 items-center justify-center" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="menu" onClick={() => setOpen(!open)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">{open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}</svg>
          </button>
        </div>
      </div>
      {open && (
        <>
          <div className="absolute inset-x-0 top-full h-screen bg-ink/60 lg:hidden" onClick={() => setOpen(false)} aria-hidden="true" />
          <nav id="menu" aria-label="Menu" className="absolute inset-x-0 top-full max-h-[calc(100dvh-66px)] overflow-y-auto border-b-2 border-ink bg-paper lg:hidden">
            <div className="wrap grid gap-6 py-4 sm:grid-cols-[1.2fr_1fr] sm:py-8">
              <ul className="flex flex-col">
                {[...NAV, { to: "/quote", label: quoteWord }].map((n) => (
                  <li key={n.to} className="border-b border-line"><NavLink to={n.to} className={({ isActive }) => `t-sub flex min-h-14 items-center justify-between ${isActive ? "underline decoration-orange decoration-4 underline-offset-8" : ""}`}>{n.label}</NavLink></li>
                ))}
              </ul>
              <div className="flex flex-col gap-3">
                <p className="font-semibold">The workshop, {SITE.area}</p>
                <p>From {SITE.minimumOrder}. Ready {SITE.turnaround}.</p>
                {(CONTACT.phone || CONTACT.address || CONTACT.hours) && (
                  <dl className="ledger" style={{ ["--ledger-rule" as string]: "var(--color-line)" }}>
                    {CONTACT.phone && <div><dt>Phone</dt><dd><a href={`tel:${CONTACT.phone}`} className="underline underline-offset-4">{CONTACT.phone}</a></dd></div>}
                    {CONTACT.address && <div><dt>Address</dt><dd>{CONTACT.address}</dd></div>}
                    {CONTACT.hours && <div><dt>Hours</dt><dd>{CONTACT.hours}</dd></div>}
                  </dl>
                )}
                {!allKnown && <p className="text-mute">{CONTACT_TO_COME}</p>}
              </div>
            </div>
          </nav>
        </>
      )}
    </header>
  );
}

const SERVICE_LINKS = [["/services#embroidery", "Embroidery"], ["/services#screen", "Screen printing"], ["/services#dtf", "DTF printing"], ["/services#vinyl", "Vinyl"], ["/services#workwear", "Workwear supply"], ["/services#uniforms", "Uniforms"]];
const ORDER_LINKS = [["/quote", "Quote builder"], ["/garments", "Garments"], ["/schools-and-clubs", "Schools & clubs"], ["/about", "About & visit"]];

// The footer is the bottom stub of the job ticket: torn off along a line of punched holes, with the promise and
// the way in on the left and the links as two short lines on the right. Paper, not a dark block of columns.
export function Footer() {
  const item = "inline-flex min-h-11 items-center underline underline-offset-4 hover:decoration-2";
  const line = (label: string, links: string[][]) => (
    <nav aria-label={label}><ul className="flex flex-wrap gap-x-5">{links.map(([to, l]) => <li key={to}><Link to={to} className={item}>{l}</Link></li>)}</ul></nav>
  );
  return (
    <footer className="mt-16 sm:mt-24">
      <div className="tear" aria-hidden="true" />
      <div className="wrap grid gap-x-16 gap-y-8 pb-10 pt-9 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] lg:pb-14 lg:pt-12">
        <div className="flex flex-col items-start gap-5">
          <p className="t-section max-w-[11em]">From {SITE.minimumOrder}, ready {SITE.turnaround}.</p>
          <Link to="/quote" className="btn btn-orange">Build a quote</Link>
        </div>
        <div className="flex flex-col gap-1 lg:pt-1">
          {line("Services", SERVICE_LINKS)}
          {line("Order", ORDER_LINKS)}
          <address className="mt-3 flex flex-col gap-1 not-italic">
            <p><b>The workshop.</b> {CONTACT.address && <>{CONTACT.address}, </>}{SITE.area}.{CONTACT.hours && <> Open {CONTACT.hours}.</>}</p>
            {(CONTACT.phone || CONTACT.email) && <p>{CONTACT.phone}{CONTACT.phone && CONTACT.email && ", "}{CONTACT.email}</p>}
            {!allKnown && <p className="text-mute">{CONTACT_TO_COME}</p>}
          </address>
        </div>
      </div>
      <div className="wrap">
        <div className="flex flex-col gap-1 border-t-2 border-ink py-5 text-mute lg:flex-row lg:items-baseline lg:justify-between lg:gap-8">
          <p className="t-small shrink-0">Part of the I&amp;A family: {SITE.family.map((f, i) => <span key={f.name} className="whitespace-nowrap"><a className="inline-flex min-h-11 items-center underline underline-offset-4" href={f.url}>{f.name}</a>{i < SITE.family.length - 1 && ", "}</span>)}</p>
          <p className="t-small lg:text-right">© {CONTACT.legalName ? `${CONTACT.legalName}, trading as ${SITE.name}` : SITE.name}.{SITE.preview && " Concept preview: garments and prices are samples; quote sending opens at launch."}</p>
        </div>
      </div>
    </footer>
  );
}
