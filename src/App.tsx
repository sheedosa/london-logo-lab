import { useEffect, useLayoutEffect, useRef } from "react";
import { BrowserRouter, Route, Routes, useLocation, useNavigationType } from "react-router-dom";
import { Header, Footer } from "./components/Layout";
import { QuoteProvider } from "./lib/quote";
import { Home } from "./pages/Home";
import { Services } from "./pages/Services";
import { Garments } from "./pages/Garments";
import { GarmentPage } from "./pages/GarmentPage";
import { QuotePage } from "./pages/QuotePage";
import { Schools } from "./pages/Schools";
import { About } from "./pages/About";
import { NotFound } from "./pages/NotFound";

// Where each history entry was scrolled to, so Back and Forward return to the same place.
const scrolls = new Map<string, number>();
let lastY = 0; // the page's scroll position at the last scroll event

/** A new page starts at the top (at once, not as a long smooth scroll); Back and Forward return to where the
 *  visitor was; a link to an anchor lands on it; a filter or the menu leaves the page where it is. */
function ScrollManager() {
  const { pathname, hash, key, state } = useLocation();
  const type = useNavigationType();
  const last = useRef<{ path: string; key: string } | null>(null); // the entry before this one; null on the first load
  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    const save = () => { lastY = window.scrollY; };
    window.addEventListener("scroll", save, { passive: true });
    return () => window.removeEventListener("scroll", save);
  }, []);
  useLayoutEffect(() => {
    const from = last.current;
    last.current = { path: pathname, key };
    const to = (top: number) => { lastY = top; window.scrollTo({ top, behavior: "instant" }); };
    const target = hash ? document.getElementById(hash.slice(1)) : null;
    if (from === null) { target?.scrollIntoView({ behavior: "instant" }); return; } // first load: the browser has placed the page
    if (from.key === key) return;                                                    // a second run of the same entry (dev)
    scrolls.set(from.key, lastY);
    if ((state as { menu?: boolean } | null)?.menu) return;                          // the menu opening on this page
    if (type === "POP") { to(scrolls.get(key) ?? 0); return; }
    // An anchor on the page you are on glides to it; an anchor on another page is simply where that page opens.
    if (target) target.scrollIntoView({ behavior: from.path === pathname ? "auto" : "instant" });
    else if (from.path !== pathname || type === "PUSH") to(0); // a filter (replace, same page) stays put
  }, [key]); // eslint-disable-line react-hooks/exhaustive-deps
  return null;
}

/** The site without its router, so the same tree is rendered to HTML at build time and hydrated in the browser. */
export function Shell() {
  return (
    <QuoteProvider>
      <ScrollManager />
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-xs focus:bg-orange focus:px-4 focus:py-3">Skip to content</a>
      <Header />
      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/garments" element={<Garments />} />
          <Route path="/garments/:handle" element={<GarmentPage />} />
          <Route path="/quote" element={<QuotePage />} />
          <Route path="/schools-and-clubs" element={<Schools />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </QuoteProvider>
  );
}

export default function App() {
  return <BrowserRouter basename={import.meta.env.BASE_URL}><Shell /></BrowserRouter>;
}
