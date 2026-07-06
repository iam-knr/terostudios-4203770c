# VPS Deployment

The build now targets a standalone Node server (Nitro `node-server` preset) instead of Cloudflare Workers.

## Build

```bash
bun install
bun run download-media          # populates public/media/ from the CDN
VITE_USE_LOCAL_MEDIA=true bun run build
```

Output lands in `.output/`:

- `.output/server/index.mjs` — the Node server entry
- `.output/public/` — static assets (including `media/`)

## Run

```bash
PORT=3000 node .output/server/index.mjs
```

Put nginx / Caddy in front of it as a reverse proxy. The server serves both SSR pages and the static assets under `.output/public/`, so no separate static host is required.

## Notes

- `nitro` is pinned exactly to `3.0.260429-beta`. Newer betas (`260603`, `260610`) crash the SSR CSS pass with `[lightningcss] Unexpected end of input` under the Node preset. Do not bump without re-verifying a clean build.
- The Node preset is declared in `vite.config.ts` (`nitro: { preset: "node-server" }`), so `NITRO_PRESET=...` at the shell is not needed.
- `VITE_USE_LOCAL_MEDIA=true` makes `src/lib/asset-url.ts` serve videos and logos from `/media/...` on your VPS instead of falling back to the Lovable CDN.
