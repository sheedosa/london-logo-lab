import { useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
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

function ScrollTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => { if (hash) document.getElementById(hash.slice(1))?.scrollIntoView(); else window.scrollTo(0, 0); }, [pathname, hash]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <QuoteProvider>
        <ScrollTop />
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-pill focus:bg-orange focus:px-4 focus:py-3">Skip to content</a>
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
    </BrowserRouter>
  );
}
