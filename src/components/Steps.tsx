/** A real sequence, set as one strip: numbered tiles sewn onto a single thread, across the page from `lg` and down
 *  the left edge on a phone. */
export function Steps({ steps, className = "" }: { steps: readonly { t: string; d: string }[]; className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <svg className="steps-thread" aria-hidden="true"><line className="down" x1="3" y1="4" x2="3" y2="100%" /><line className="across" x1="4" y1="3" x2="100%" y2="3" /></svg>
      <ol className="steps">
      {steps.map((s, i) => (
        <li key={s.t}>
          <span className="steps-n" aria-hidden="true">{i + 1}</span>
          <div className="flex flex-col gap-1.5 pt-0.5 lg:pt-0"><h3>{s.t}</h3><p className="text-mute">{s.d}</p></div>
        </li>
      ))}
      </ol>
    </div>
  );
}
