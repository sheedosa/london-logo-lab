import { Marque } from "./Icons";

/** A designed space for a workshop photograph that has not been taken yet: ink ground, stitched frame, one line
 *  saying what the photo will show. Max two per page. Replace with an <img> when the client's photos arrive. */
export function PhotoSlot({ shows, className = "" }: { shows: string; className?: string }) {
  return (
    <figure className={`relative flex flex-col justify-between overflow-hidden rounded-pill bg-ink p-6 text-paper sm:p-8 ${className}`}>
      <div className="pointer-events-none absolute inset-3 rounded-[2px] border-2 border-dashed border-mute" aria-hidden="true" />
      <Marque size={44} tile="#f4651f" thread="#1b1916" className="relative" />
      <figcaption className="relative mt-10 flex flex-col gap-1">
        <span className="label text-orange">Photo to come</span>
        <span className="max-w-sm text-paper">{shows}</span>
      </figcaption>
    </figure>
  );
}
