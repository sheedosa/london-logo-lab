/** Keeps price placeholders such as "£[SETUP]" on one line wherever they appear in running text. */
export function Nb({ children }: { children: string }) {
  const parts = children.split(/(£\[[^\]]+\])/);
  return <>{parts.map((p, i) => (i % 2 ? <span key={i} className="whitespace-nowrap">{p}</span> : p))}</>;
}
