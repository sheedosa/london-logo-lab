/** A small, designed space for a workshop photograph that has not been taken yet: stone ground, crop marks at the
 *  corners and one line saying exactly what will be shot. Set beside text, never as a half-page panel; at most one
 *  per page (two on the site in all). Replace with an <img> when the client's photos arrive. */
export function PhotoSlot({ shows, className = "" }: { shows: string; className?: string }) {
  const mark = "absolute h-3 w-3 border-ink";
  return (
    <figure className={`relative flex aspect-[4/3] w-full max-w-[20rem] flex-col justify-end gap-2 overflow-hidden rounded-xs bg-stone p-5 text-ink ${className}`}>
      <span aria-hidden="true" className={`${mark} left-2.5 top-2.5 border-l-2 border-t-2`} />
      <span aria-hidden="true" className={`${mark} right-2.5 top-2.5 border-r-2 border-t-2`} />
      <span aria-hidden="true" className={`${mark} bottom-2.5 left-2.5 border-b-2 border-l-2`} />
      <span aria-hidden="true" className={`${mark} bottom-2.5 right-2.5 border-b-2 border-r-2`} />
      <span className="font-semibold">Photo to come</span>
      <figcaption>{shows}</figcaption>
    </figure>
  );
}
