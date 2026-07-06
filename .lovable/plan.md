## Goal

Make `bun run build` reproducibly succeed on a fresh clone so you can deploy to your own VPS as a Node server, instead of the template's Cloudflare Worker default.

## Root cause

The Lovable Vite wrapper (`@lovable.dev/vite-tanstack-config`) always adds Nitro to the build. By default it uses the `cloudflare-module` preset. When you override with `NITRO_PRESET=node-server`, Nitro re-processes the already-emitted Tailwind v4 CSS through its `virtual:nitro:raw:` critical-CSS pipeline, and Lightning CSS crashes with `Unexpected end of input`. This is a known incompatibility between recent Nitro v3 betas and `@tailwindcss/vite@4` under the Node preset — not caused by anything in your code.

## Plan

1. **Declare the deploy target in `vite.config.ts` instead of via env var.** Add `nitro: { preset: "node-server" }` to the `defineConfig` call so the build is deterministic and doesn't depend on `NITRO_PRESET` being set at the shell.

2. **Pin `nitro` to a version that builds cleanly with the Node preset + Tailwind v4.** Downgrade from `3.0.260603-beta` (and the newer `260610-beta`, which is also broken) to the earliest version the wrapper still accepts: `3.0.260429-beta`. Use an exact pin (no `^`) in `package.json` so a fresh `bun install` can't drift into a broken beta.

3. **Add a Lightning CSS safety net for the SSR pass.** In case a future patch of the wrapper re-introduces the crash, extend `defineConfig` with `vite: { build: { cssMinify: "esbuild" } }` so Nitro's inlining step uses esbuild instead of Lightning CSS for that stage. This is a no-op for the client bundle (Tailwind still uses Lightning CSS) but prevents the SSR re-parse from touching Lightning CSS on the already-minified output.

4. **Document the VPS build/run flow** in a short `DEPLOY.md`:
   - `bun install`
   - `bun run download-media` (populates `public/media/` from your CDN)
   - `VITE_USE_LOCAL_MEDIA=true bun run build`
   - `node .output/server/index.mjs` behind your reverse proxy (nginx/Caddy) on the port of your choice (`PORT=3000` by default for the Node preset)

5. **Verify.** Run a fresh install + build in the sandbox after the changes to confirm the Lightning CSS error is gone and the `.output/` tree looks correct (`.output/server/index.mjs` + `.output/public/`).

## Technical details

- `vite.config.ts` diff (illustrative):
  ```ts
  export default defineConfig({
    tanstackStart: { server: { entry: "server" } },
    nitro: { preset: "node-server" },
    vite: { build: { cssMinify: "esbuild" } },
  });
  ```
- `package.json` diff:
  ```json
  "nitro": "3.0.260429-beta"
  ```
- No source-code changes to your app, components, or asset-URL logic. The earlier CDN-fallback + `VITE_USE_LOCAL_MEDIA` work stays exactly as-is.

## Risk / fallback

If the pinned `3.0.260429-beta` also trips the Lightning CSS bug on your VPS Node version (unlikely — this beta predates the offending change), the next fallback is to keep the Cloudflare preset and run the output on your VPS via `workerd` (the same runtime Cloudflare uses), which sidesteps Nitro's Node critical-CSS path entirely. I'd only take that step if step 2 doesn't hold up under a clean rebuild.