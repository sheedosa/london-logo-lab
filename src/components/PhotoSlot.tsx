import { Marque } from "./Icons";

/** A designed space for a workshop photograph that has not been taken yet: ink ground, the marque, one line
 *  saying what the photo will show. Max two per page. Replace with an <img> when the client's photos arrive. */
export function PhotoSlot({ shows, className = "" }: { shows: string; className?: string }) {
  return (
    <figure className={`relative flex flex-col justify-between gap-10 overflow-hidden rounded-xs bg-ink p-6 text-paper sm:p-8 ${className}`}>
      <Marque size={44} tile="#f4651f" thread="#1b1916" />
      <figcaption className="flex max-w-sm flex-col gap-1">
        <span className="font-semibold text-orange">Photo to come</span>
        <span>{shows}</span>
      </figcaption>
    </figure>
  );
}
