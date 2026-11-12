import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

// GitHub Pages SPA fallback: 404.html redirects to /?p=<path>; restore it before React mounts.
const params = new URLSearchParams(window.location.search);
const p = params.get("p");
if (p) window.history.replaceState(null, "", import.meta.env.BASE_URL.replace(/\/$/, "") + p);

const root = document.getElementById("root")!;
const app = <StrictMode><App /></StrictMode>;
// A prerendered page is taken over in place (no repaint, nothing jumps). The page is drawn afresh when the markup
// is not this route's (dev, the 404 fallback, a host that serves the home shell for every path) or when the
// address carries a query the static page could not know about (a filtered garments list).
const here = window.location.pathname.slice(import.meta.env.BASE_URL.length - 1).replace(/\/+$/, "") || "/";
if (root.dataset.page === here && !window.location.search) hydrateRoot(root, app);
else { root.replaceChildren(); createRoot(root).render(app); }
