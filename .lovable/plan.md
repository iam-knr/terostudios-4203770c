# IMAX Wall — spherical curve, mouse parallax, hover lift, native-aspect masonry

Refine `src/components/tero/ImaxReelWall.tsx` only. All other files untouched. Continue reusing the `videos` array from `src/data/videos.ts` — no new assets.

## 1. Vertical curve (spherical feel)

Currently only columns rotate on Y. Add a per-tile vertical curve:
- Compute a row index per tile within its column (0..N-1) and a normalized offset from the column's vertical center (`rowOffset = rowIndex - (colLength-1)/2`).
- Apply per tile: `rotateX(${-rowOffset * 3}deg) translateZ(${-Math.abs(rowOffset) * 12}px)` — top and bottom tiles tilt inward toward the viewer; middle tiles sit furthest back. Combined with the existing column `rotateY` this reads as a section of a sphere.
- Scale down for mobile (`degPerRow` 2 on <640px, 2.5 on md, 3 on lg).

## 2. Native-aspect masonry (max videos in their own dimensions)

Replace the fixed HEIGHT_PATTERNS with per-video heights derived from each `VideoItem.aspect`:
- Column width is fluid (`flex-1`). Render each tile with `paddingTop: ${100 / aspect}%` on an inner box, or set `aspectRatio: ${aspect}` on the tile so it takes its native shape.
- Distribute videos across columns using a shortest-column bin-packing pass (track cumulative `1/aspect` height per column, push next video into the currently-shortest column). This gives a real masonry with no cropping and packs every video in the pool at least once.
- Use the full `videos` pool (17 items) so the wall shows the maximum available reels; if a column ends up empty at small widths, cycle from the start.

## 3. Screen bloom + edge vignette

- Add a soft radial bloom behind the wall (inside the stage container, below the columns): a large `radial-gradient` in cream/warm-white at ~10% opacity with `mix-blend-screen` and heavy blur, sized ~120% of the wall.
- Add a subtle inner-edge vignette on top of the wall: an absolutely-positioned overlay with `box-shadow: inset 0 0 240px 40px rgba(0,0,0,0.75)` and `pointer-events-none`, above tiles but below the existing black gradient vignettes so the edges darken like an IMAX theatre.

## 4. Mouse parallax tilt

- Track mouse position over the sticky stage via `onMouseMove` on the sticky container; normalize to `(-1..1, -1..1)` from center.
- Feed into two `motion` values with a slow spring (`stiffness: 40, damping: 20`).
- Apply to the wall wrapper as `rotateY: mouseX * 3deg` and `rotateX: -mouseY * 2deg`, combined with the existing scroll-driven `translateY`/`scale` (framer-motion handles combined transforms via style props). Reset toward 0 on `mouseleave`.
- Respect `prefers-reduced-motion` — skip parallax if reduced.

## 5. Hover tile lift + brighten

- On each `Tile`, add `transition: transform 400ms cubic-bezier(.2,.7,.2,1), filter 400ms` and a `group hover:` state (or `onMouseEnter`/`Leave` local state) that applies `translateZ(40px) scale(1.03)` and boosts the video `filter` to `brightness(1.25) contrast(1.15) saturate(1.1)`, plus a stronger ring (`ring-white/25`) and a slightly amplified box-shadow for a "lit screen" pop.
- Keep tiles `cursor-pointer`-free (no click behavior added) — pure visual affordance.

## What stays exactly the same

- Cosmic backdrop, orbs, starfield, film grain, headline, "scroll ↓" hint, section height (320vh), scroll-driven subtle `translateY`/`scale`, and all four black edge vignettes.
- `resolveForPlayback`, lazy Tile mounting, video attributes (`muted autoPlay loop playsInline`).
- `src/data/videos.ts`, `src/routes/index.tsx`, all other components.

## Verification

Reload `/`, confirm: tiles show at native aspect ratios in a packed masonry, wall reads as a section of a sphere (both horizontal and vertical curve), moving the mouse tilts the whole wall smoothly, hovering a tile lifts and brightens it, edges are darkened by a vignette with a soft warm bloom behind the wall. Resize to mobile/tablet — curve softens, columns drop to 5 then 3, no console errors.
