import { useEffect, useState, type RefObject } from "react";

/** True while the element is on screen. Used to show the phone action bar only when the real button is not. */
export function useOnScreen(ref: RefObject<Element | null>, initial = true) {
  const [on, setOn] = useState(initial);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setOn(e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
  return on;
}
