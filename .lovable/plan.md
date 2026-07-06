# IMAX Curved Wall — replace the Dome

Rework `src/components/tero/ImaxReelWall.tsx` so the pinned "Step inside the dome" section renders a concave IMAX-style curved video wall instead of a hemispherical dome. Reuse the exact same `videos` array from `src/data/videos.ts` (no new placeholder assets). All other page sections (`Hero`, `LogoStrip`, `ServicesScroller`, etc.) stay untouched.

## What changes

Only `src/components/tero/ImaxReelWall.tsx`. The exported `ImaxReelWall` component keeps its name and its slot in `src/routes/index.tsx`.

## New structure

1. Keep the outer pinned section, cosmic backdrop, orbs, starfield, grain, vignettes, headline block, and "scroll ↓" hint exactly as they are.
2. Replace the 3D dome stage (`.absolute inset-x-0 bottom-0 ...` + `motion.div` with spherical tile math) with a curved masonry wall:
   - Container: `perspective: 1200px`, `perspectiveOrigin: 50% 55%`, `transform-style: preserve-3d`.
   - Inner wrapper: fixed logical width (e.g. `min(1600px, 140vw)`), centered, with `preserve-3d`.
   - 7 explicit column `<div>`s in a flex row with a small consistent gap (e.g. `gap-2` / 8px).
   - Distribute `videos` across the 7 columns round-robin so every column has 3–5 tiles cycling from the same pool. If the total isn't divisible, cycle from the start — never invent assets.
   - Each column is `flex flex-col gap-2` with varied tile heights via a fixed pattern per column index (e.g. `[220, 160, 260, 180, 240]` px, offset per column for a masonry feel). Tile widths come from the column width; each tile keeps `overflow-hidden rounded-[12px] ring-1 ring-white/10` and the same subtle inner shadow/vignette overlay used today.

## Concave curve

- Center column index = 3 (0..6). For each column compute `offset = index - 3` (range −3..+3).
- Apply per column: `transform: rotateY(${offset * 8}deg) translateZ(${-Math.abs(offset) * -40}px)` — i.e. negative offsets rotate positive-Y and positive offsets rotate negative-Y so both edges wrap toward the viewer, and edge columns get pulled forward with `translateZ` (center sits furthest back).
- Set `transformOrigin: 'center center'` on each column and `backfaceVisibility: hidden` on tiles.
- Use ~8° per column offset (tunable within the 6–10° range) and up to ~120px forward pull at the outermost columns for a smooth cylinder-section read.

## Scroll behavior

- Drop the dome's `useScroll` rotY/rotX/scale mapping. The wall is a static curved surface — the pinned section stays (still `320vh`) so the viewer has time to look at it, but rotation goes away. Keep a subtle parallax: map scroll progress to a small `translateY` (e.g. `-40px → 40px`) and a very light `scale` (0.98 → 1.02) on the wrapper so it doesn't feel dead. No dome-style spin.

## Videos

Reuse the existing `Tile` component and its lazy mount/`resolveForPlayback` logic verbatim — same `muted`, `autoPlay`, `loop`, `playsInline`, `object-fit: cover`. Eager-mount only the first ~14 tiles (first two columns) to keep initial network cost similar to today.

## Responsive

- ≥1024px: 7 columns as above.
- 640–1023px: 5 columns, curve reduced to ~7°/column, translateZ scaled down.
- <640px: 3 columns, ~5°/column, translateZ minimal — still concave but flatter so tiles don't clip.
- Column count + curve values chosen via a small `useEffect` + `window.matchMedia` (or `useMobile` hook if already imported elsewhere) so SSR renders the desktop layout and hydration adjusts.

## What stays exactly the same

- `src/data/videos.ts` — untouched.
- Headline block, backdrop layers, vignettes, "scroll ↓" hint — untouched.
- `src/routes/index.tsx` — untouched (still renders `<ImaxReelWall />`).
- All other components — untouched.

## Verification

After the edit: run the dev build, load `/`, confirm the section shows a concave curved wall of the same client reels, tiles autoplay muted, headline still reads "Step inside the dome.", and no console errors. Resize to mobile widths to confirm the responsive column counts kick in.
