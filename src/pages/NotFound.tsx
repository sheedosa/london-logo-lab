import { Link } from "react-router-dom";
import { Seo } from "../components/Seo";
import { Marque } from "../components/Icons";

export function NotFound() {
  return (
    <section className="wrap flex flex-col items-center gap-4 py-24 text-center">
      <Seo title="Page not found" path="/404" description="That page isn't here." noindex />
      <Marque size={64} />
      <h1 className="text-[44px]">That page isn't here</h1>
      <p className="text-mute">It may have moved. Try the garments, or build a quote.</p>
      <div className="flex flex-wrap justify-center gap-3"><Link to="/garments" className="btn btn-ink">Garments</Link><Link to="/quote" className="btn btn-orange">Build a quote</Link></div>
    </section>
  );
}
