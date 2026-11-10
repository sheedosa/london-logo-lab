import type { ReactNode } from "react";

/** A designed space for a workshop photograph that has not been taken yet: stone ground, crop marks at the corners,
 *  an optional line drawing of the subject, and one line saying what the photo will show. Max two per page.
 *  Replace with an <img> when the client's photos arrive. */
export function PhotoSlot({ shows, className = "", children }: { shows: string; className?: string; children?: ReactNode }) {
  const mark = "absolute h-4 w-4 border-ink";
  return (
    <figure className={`relative flex flex-col justify-between gap-6 overflow-hidden rounded-xs bg-stone p-7 text-ink sm:p-9 ${className}`}>
      <span aria-hidden="true" className={`${mark} left-3 top-3 border-l-2 border-t-2`} />
      <span aria-hidden="true" className={`${mark} right-3 top-3 border-r-2 border-t-2`} />
      <span aria-hidden="true" className={`${mark} bottom-3 left-3 border-b-2 border-l-2`} />
      <span aria-hidden="true" className={`${mark} bottom-3 right-3 border-b-2 border-r-2`} />
      <span className="font-semibold">Photo to come</span>
      {children && <div className="mx-auto w-2/5 max-w-[200px]">{children}</div>}
      <figcaption className="max-w-sm">{shows}</figcaption>
    </figure>
  );
}
