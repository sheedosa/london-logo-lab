import { Link } from "react-router-dom";
import { Seo } from "../components/Seo";
import { Marque, TitleRule } from "../components/Icons";

export function NotFound() {
  return (
    <section className="wrap flex flex-col items-start gap-5 py-20 sm:py-28">
      <Seo title="Page not found" path="/404" description="That page isn't here." noindex />
      <Marque size={56} />
      <h1>That page isn't here</h1>
      <TitleRule />
      <p className="t-lede text-mute">It may have moved. Try the garments, or build a quote.</p>
      <div className="flex flex-wrap gap-3"><Link to="/quote" className="btn btn-orange">Build a quote</Link><Link to="/garments" className="btn btn-ghost">See the garments</Link></div>
    </section>
  );
}
