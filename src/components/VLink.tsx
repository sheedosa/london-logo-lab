import type { ComponentProps, MouseEvent } from "react";
import { flushSync } from "react-dom";
import { Link, useNavigate } from "react-router-dom";

type Doc = Document & { startViewTransition?: (cb: () => void) => unknown };

/** A link that carries shared elements across the page change: the ticket on Home becomes the ticket on the quote
    page, a garment on a card becomes the garment on its page. Falls back to a plain link where the browser has no
    view transitions, on modified clicks, and under reduced motion. */
export function VLink({ to, onClick, ...rest }: ComponentProps<typeof Link> & { to: string }) {
  const navigate = useNavigate();
  const go = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    const doc = document as Doc;
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (!doc.startViewTransition || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    e.preventDefault();
    doc.startViewTransition(() => flushSync(() => navigate(to)));
  };
  return <Link to={to} onClick={go} {...rest} />;
}

/** The name two drawings of the same garment share, so one becomes the other. */
export const garmentVT = (handle: string) => ({ viewTransitionName: `garment-${handle}` });
/** The job ticket keeps one name wherever it appears. */
export const TICKET_VT = { viewTransitionName: "job-ticket" };
