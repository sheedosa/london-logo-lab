import { existsSync } from "node:fs";
import { join } from "node:path";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// The two font files the first screen needs are preloaded, so text is in its own face on first paint.
const preloadFonts = (): Plugin => ({
  name: "preload-fonts",
  apply: "build",
  transformIndexHtml: {
    order: "post",
    handler(_html, ctx) {
      const base = ctx.server ? "/" : (process.env.VITE_BASE ?? "/london-logo-lab/");
      return Object.keys(ctx.bundle ?? {}).filter((f) => f.endsWith(".woff2")).sort().reverse().map((f) => ({
        tag: "link", injectTo: "head-prepend" as const,
        attrs: { rel: "preload", as: "font", type: "font/woff2", href: base + f, crossorigin: "" },
      }));
    },
  },
});

// `vite preview` answers /garments with the home shell; GitHub Pages redirects it to /garments/ and serves the
// prerendered page. Do the same here, so the preview shows what visitors get.
const pagesRedirect = (): Plugin => ({
  name: "pages-redirect",
  configurePreviewServer(server) {
    const base = server.config.base, dist = join(server.config.root, server.config.build.outDir);
    server.middlewares.use((req, res, next) => {
      const [path, query] = (req.url ?? "").split("?");
      if (path.startsWith(base) && !path.endsWith("/") && !/\.[a-z0-9]+$/i.test(path) && existsSync(join(dist, decodeURIComponent(path.slice(base.length)), "index.html"))) {
        res.statusCode = 301; res.setHeader("Location", path + "/" + (query ? "?" + query : "")); res.end(); return;
      }
      next();
    });
  },
});

// GitHub Pages serves the site at /<repo>/ — set VITE_BASE=/ for a custom domain.
export default defineConfig({
  plugins: [react(), tailwindcss(), preloadFonts(), pagesRedirect()],
  base: process.env.VITE_BASE ?? "/london-logo-lab/",
});
