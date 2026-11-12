import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import { Shell } from "./App";

/** Build-time render of one route (scripts/prerender.mjs). The browser hydrates exactly this markup. */
export function render(path: string): string {
  const base = import.meta.env.BASE_URL;
  return renderToString(<StrictMode><StaticRouter basename={base} location={base.replace(/\/$/, "") + path}><Shell /></StaticRouter></StrictMode>);
}
