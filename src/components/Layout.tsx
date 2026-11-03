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
  const { quote } = useQuote();
  const g = store.garment(quote.garment);
  return (
    <>
      <aside aria-label="Notices">
      {SITE.preview && <div className="bg-deep px-4 py-2 text-center text-[13px] text-paper">Concept preview: garments and prices are samples; quote sending opens at launch</div>}
      <div className="bg-orange px-4 py-2 text-center text-[13px] font-medium text-ink">
        {g ? <>Your quote so far: <b>{quote.qty} × {g.title}</b> · <Link to="/quote" className="underline">continue</Link></> : <>Embroidery and print in Tooting · <Link to="/quote" className="underline">build a quote with a live mock-up</Link></>}
      </div>
      </aside>
      <header className="sticky top-0 z-40 border-b-2 border-ink bg-paper">
        <div className="wrap flex min-h-16 items-center justify-between gap-4">
          <button type="button" className="inline-flex h-11 w-11 items-center justify-center lg:hidden" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen(!open)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">{open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}</svg>
          </button>
          <Link to="/" className="inline-flex min-h-11 shrink-0 items-center" onClick={() => setOpen(false)}><Logo className="h-7 w-auto sm:h-9" /></Link>
          <nav aria-label="Main" className="hidden gap-7 text-sm font-medium lg:flex">
            {NAV.map((n) => <NavLink key={n.to} to={n.to} className={({ isActive }) => `inline-flex min-h-11 items-center border-b-2 ${isActive ? "border-orange" : "border-transparent hover:border-ink"}`}>{n.label}</NavLink>)}
          </nav>
          <Link to="/quote" className="btn btn-orange min-h-11 px-4 text-[0.75rem] sm:px-6"><span className="sm:hidden">Quote</span><span className="hidden sm:inline">Build a quote</span></Link>
        </div>
        {open && (
          <nav aria-label="Main" className="border-t-2 border-ink bg-paper lg:hidden">
            <div className="wrap flex flex-col py-2">
              {NAV.map((n) => <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="flex min-h-12 items-center border-b border-line text-lg">{n.label}</Link>)}
              <Link to="/quote" onClick={() => setOpen(false)} className="flex min-h-12 items-center text-lg">Quote builder</Link>
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
          <p className="max-w-xs text-sm text-paper-mute">Embroidery, print, workwear and uniforms from {SITE.area}. Part of the I&amp;A family with {SITE.family.map((f, i) => <span key={f.name}>{i ? (i === SITE.family.length - 1 ? " and " : ", ") : ""}<a className="underline" href={f.url}>{f.name}</a></span>)}.</p>
        </div>
        <div>
          <h2 className="label mb-3 font-sans text-paper-mute">Services</h2>
          <ul className="flex flex-col">
            {[["/services#embroidery", "Embroidery"], ["/services#print", "Print"], ["/services#workwear", "Workwear supply"], ["/services#uniforms", "Uniform programmes"]].map(([to, l]) => <li key={to}><Link to={to} className="inline-flex min-h-11 items-center text-sm">{l}</Link></li>)}
          </ul>
        </div>
        <div>
          <h2 className="label mb-3 font-sans text-paper-mute">Order</h2>
          <ul className="flex flex-col">
            <li><Link to="/quote" className="inline-flex min-h-11 items-center text-sm">Quote builder</Link></li>
            <li><Link to="/garments" className="inline-flex min-h-11 items-center text-sm">Garments</Link></li>
            <li><Link to="/schools-and-clubs" className="inline-flex min-h-11 items-center text-sm">Schools &amp; clubs</Link></li>
            <li><Link to="/about" className="inline-flex min-h-11 items-center text-sm">About &amp; visit</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="label mb-3 font-sans text-paper-mute">Workshop</h2>
          <p className="text-sm">{SITE.address}<br />{SITE.area}<br />{SITE.hours}</p>
          <p className="mt-3 text-sm">{SITE.phone}<br />{SITE.email}</p>
        </div>
      </div>
      <div className="wrap border-t border-paper/15 py-6 text-xs text-paper-mute">© {SITE.legalName}, trading as {SITE.name} · Company no. [COMPANY NUMBER] · VAT [VAT NUMBER]</div>
    </footer>
  );
}
