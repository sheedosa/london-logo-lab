import { gbp } from "../lib/quote";

/** "Sample estimate" on its own line, then the figure and "per item" kept together so they never split. */
export function PriceLine({ perItem, onInk = false, big = false }: { perItem: number; onInk?: boolean; big?: boolean }) {
  return (
    <p aria-live="polite">
      <span className={`label block ${onInk ? "text-paper-mute" : "text-mute"}`}>Sample estimate</span>
      <span className="whitespace-nowrap">
        <span className={`display ${big ? "text-[30px] sm:text-[36px]" : "text-[26px]"} ${onInk ? "text-orange" : ""}`}>from {gbp(perItem)}</span>{" "}
        <span className={onInk ? "text-paper-mute" : "text-mute"}>per item</span>
      </span>
    </p>
  );
}
