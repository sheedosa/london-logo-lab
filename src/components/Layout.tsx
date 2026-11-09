import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
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
  const g = saved ? store.garment(quote.garment) : undefined;
  return (
    <>
      {/* One strip: the message on the left, the preview tag on the right. Plain text, no controls. */}
      <aside aria-label="Notice" className="bg-orange text-ink">
        <div className="wrap flex h-[34px] items-center justify-between gap-3 text-[13px] font-medium">
          <p className="truncate">{g ? <>Your quote: <b>{quote.qty} × {g.title}</b><span className="hidden sm:inline">, saved on this device</span></> : <>From {SITE.minimumOrder} · Ready {SITE.turnaround}<span className="hidden sm:inline"> · Made in Tooting</span></>}</p>
          {SITE.preview && <span className="label shrink-0 rounded-pill border-[1.5px] border-ink px-1.5 py-0.5 text-[11px] leading-none" title="Concept preview: garments and prices are samples; quote sending opens at launch">Preview</span>}
        </div>
      </aside>
      <header className="sticky top-0 z-40 border-b-2 border-ink bg-paper">
        <div className="wrap flex min-h-16 items-center justify-between gap-4">
          <button type="button" className="inline-flex h-11 w-11 items-center justify-center lg:hidden" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen(!open)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">{open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}</svg>
          </button>
          <Link to="/" className="inline-flex min-h-11 shrink-0 items-center" onClick={() => setOpen(false)}><Logo className="h-[22px] w-auto min-[400px]:h-6 sm:h-9" /></Link>
          <nav aria-label="Main" className="hidden gap-7 text-[15px] font-medium lg:flex">
            {NAV.map((n) => <NavLink key={n.to} to={n.to} className={({ isActive }) => `inline-flex min-h-11 items-center border-b-2 ${isActive ? "border-orange" : "border-transparent hover:border-ink"}`}>{n.label}</NavLink>)}
          </nav>
          <Link to="/quote" className="btn btn-orange min-h-11 whitespace-nowrap px-2.5 text-[0.6875rem] tracking-[0.06em] sm:px-6 sm:text-[0.75rem] sm:tracking-[0.12em]">{g ? "Your quote" : "Build a quote"}</Link>
        </div>
        {open && (
          <nav aria-label="Main" className="border-t-2 border-ink bg-paper lg:hidden">
            <div className="wrap flex flex-col py-2">
              {NAV.map((n) => <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="flex min-h-12 items-center border-b border-line text-lg">{n.label}</Link>)}
              <Link to="/quote" onClick={() => setOpen(false)} className="flex min-h-12 items-center text-lg">Build a quote</Link>
            </div>
          </nav>
        )}
      </header>
    </>
  );
}

export function Footer() {
  return (
    <footer className="on-ink mt-20 bg-deep text-paper">
      <div className="wrap grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="flex flex-col gap-4">
          <Logo paper className="h-8 w-auto self-start" />
          <p className="max-w-xs text-paper-mute">Embroidery, printing, workwear and uniforms from a friendly workshop in {SITE.area}. From {SITE.minimumOrder}, ready {SITE.turnaround}.</p>
          <div>
            <p className="text-paper-mute">Part of the I&amp;A family:</p>
            <ul className="flex flex-wrap gap-x-4">{SITE.family.map((f) => <li key={f.name}><a className="inline-flex min-h-11 items-center underline" href={f.url}>{f.name}</a></li>)}</ul>
          </div>
        </div>
        <div>
          <h2 className="label mb-3 font-sans text-paper-mute">Services</h2>
          <ul className="flex flex-col">
            {[["/services#embroidery", "Embroidery"], ["/services#screen", "Screen printing"], ["/services#dtf", "DTF printing"], ["/services#vinyl", "Vinyl"], ["/services#workwear", "Workwear supply"], ["/services#uniforms", "Uniforms"]].map(([to, l]) => <li key={to}><Link to={to} className="inline-flex min-h-11 items-center">{l}</Link></li>)}
          </ul>
        </div>
        <div>
          <h2 className="label mb-3 font-sans text-paper-mute">Order</h2>
          <ul className="flex flex-col">
            <li><Link to="/quote" className="inline-flex min-h-11 items-center">Quote builder</Link></li>
            <li><Link to="/garments" className="inline-flex min-h-11 items-center">Garments</Link></li>
            <li><Link to="/schools-and-clubs" className="inline-flex min-h-11 items-center">Schools &amp; clubs</Link></li>
            <li><Link to="/about" className="inline-flex min-h-11 items-center">About &amp; visit</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="label mb-3 font-sans text-paper-mute">Workshop</h2>
          <p>{SITE.address}<br />{SITE.area}<br />{SITE.hours}</p>
          <p className="mt-3">{SITE.phone}<br />{SITE.email}</p>
        </div>
      </div>
      <div className="wrap border-t border-ink-soft py-6 text-[13px] text-paper-mute">© {SITE.legalName}, trading as {SITE.name} · Company no. [COMPANY NUMBER] · VAT [VAT NUMBER]{SITE.preview && " · Concept preview: garments and prices are samples; quote sending opens at launch"}</div>
    </footer>
  );
}
