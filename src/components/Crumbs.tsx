import { Link } from "react-router-dom";

/** Breadcrumb trail: links, then the current page as plain text. */
export function Crumbs({ trail, here, className = "text-mute" }: { trail: { to: string; label: string }[]; here: string; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={`t-small ${className}`}>
      <ol className="flex flex-wrap items-center gap-x-2">
        {trail.map((t) => <li key={t.to} className="flex items-center gap-x-2"><Link to={t.to} className="inline-flex min-h-11 items-center underline underline-offset-4">{t.label}</Link><span aria-hidden="true">/</span></li>)}
        <li aria-current="page">{here}</li>
      </ol>
    </nav>
  );
}
