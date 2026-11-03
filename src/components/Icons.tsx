// Craft icons drawn in the identity's 1.5px stroke. All decorative unless a title is passed.
type P = { className?: string; size?: number; title?: string };
const base = (size: number, title?: string) => ({ width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": title ? undefined : true, role: title ? "img" : undefined });

export const Needle = ({ className, size = 24, title }: P) => (
  <svg {...base(size, title)} className={className}>{title && <title>{title}</title>}<path d="M4 20 18 6" /><path d="M18 6a2.2 2.2 0 1 0 2 2" /><path d="M16.5 7.5 15 9" /><path d="M3 12c3-1 4 3 7 2" strokeDasharray="2 2" /></svg>
);
export const InkDrop = ({ className, size = 24, title }: P) => (
  <svg {...base(size, title)} className={className}>{title && <title>{title}</title>}<path d="M12 3s6 7 6 11.5a6 6 0 0 1-12 0C6 10 12 3 12 3Z" /><path d="M9.5 15a2.5 2.5 0 0 0 2.5 2.5" /></svg>
);
export const StitchLine = ({ className, size = 24, title }: P) => (
  <svg {...base(size, title)} className={className}>{title && <title>{title}</title>}<path d="M3 12h18" strokeDasharray="3 3" strokeWidth="2.5" /></svg>
);
export const Registration = ({ className, size = 24, title }: P) => (
  <svg {...base(size, title)} className={className}>{title && <title>{title}</title>}<circle cx="12" cy="12" r="6" /><path d="M12 2v20M2 12h20" /></svg>
);
export const Spool = ({ className, size = 24, title }: P) => (
  <svg {...base(size, title)} className={className}>{title && <title>{title}</title>}<rect x="6" y="3" width="12" height="3" /><rect x="6" y="18" width="12" height="3" /><path d="M8 6v12M16 6v12" /><path d="M8 9h8M8 12h8M8 15h8" /></svg>
);
export const Squeegee = ({ className, size = 24, title }: P) => (
  <svg {...base(size, title)} className={className}>{title && <title>{title}</title>}<path d="M12 3v9" /><rect x="4" y="12" width="16" height="4" /><path d="M5 16l1 4h12l1-4" /></svg>
);
export const Van = ({ className, size = 24, title }: P) => (
  <svg {...base(size, title)} className={className}>{title && <title>{title}</title>}<path d="M3 7h11v9H3zM14 10h4l3 3v3h-7" /><circle cx="7" cy="17" r="1.8" /><circle cx="17" cy="17" r="1.8" /></svg>
);
export const Tick = ({ className, size = 24, title }: P) => (
  <svg {...base(size, title)} className={className}>{title && <title>{title}</title>}<path d="M5 12.5 10 17 19 7" /></svg>
);
export const Copy = ({ className, size = 24, title }: P) => (
  <svg {...base(size, title)} className={className}>{title && <title>{title}</title>}<rect x="8" y="8" width="12" height="12" /><path d="M16 8V4H4v12h4" /></svg>
);
export const Upload = ({ className, size = 24, title }: P) => (
  <svg {...base(size, title)} className={className}>{title && <title>{title}</title>}<path d="M12 16V4M7 9l5-5 5 5" /><path d="M4 16v4h16v-4" /></svg>
);

/** The running-stitch marque, inline, for places where an <img> would be clumsy. */
export function Marque({ className = "", tile = "#1b1916", thread = "#f4651f", size = 40 }: { className?: string; tile?: string; thread?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true" className={className}>
      <rect width="100" height="100" rx="5" fill={tile} />
      <path d="M24 18V28M24 42V52M24 66V76H36M50 76H60M74 76H84" fill="none" stroke={thread} strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** A long running-stitch rule used as a section divider. */
export function StitchRule({ className = "" }: { className?: string }) {
  return <svg className={className} height="4" width="100%" aria-hidden="true"><line x1="0" y1="2" x2="100%" y2="2" stroke="currentColor" strokeWidth="3" strokeDasharray="14 10" strokeLinecap="round" /></svg>;
}
