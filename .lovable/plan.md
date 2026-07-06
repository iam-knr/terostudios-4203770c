# IMAX Wall — one massive seamless curved screen

Refactor `src/components/tero/ImaxReelWall.tsx` only. Reuse the same `videos` from `src/data/videos.ts`.

## Core shift

Stop rendering a gallery of tiles. Render ONE giant curved LED wall composed of tightly-packed uniform "panels" that all read as a single screen surface.

## 1. Uniform brick-wall grid, no gaps

- Kill masonry + native aspect ratios. Every panel is the same size, forced to a cinematic IMAX aspect of **1.9:1** with `object-cover`.
- Grid: 9 columns × 5 rows on desktop (45 panels), 7×4 on tablet, 5×3 on mobile.
- Panels sit flush with **`gap: 0`**. Remove `rounded-*`, `ring-*`, outer `box-shadow`, and the per-tile linear-gradient overlay — those made it look like separate thumbnails. Add only a hairline `1px` inner seam using `outline: 1px solid rgba(0,0,0,0.6); outline-offset: -1px` to suggest LED module edges without breaking the surface.
- Cycle through the `videos` pool (17 items) to fill all 45 panels; repeats are fine — this is one screen showing a montage, not a portfolio grid.

## 2. Deeper cylindrical curve

- Move to a real per-column cylinder mapping instead of stepping degrees.
  - Total sweep angle: **90°** on desktop (±45° from center), 70° on tablet, 50° on mobile.
  - For each column `i` (0..n-1), `theta = (i/(n-1) - 0.5) * sweep`.
  - Apply: `transform: rotateY(${theta}deg) translateZ(${cos(theta) * R - R}px)` where R ≈ 900px on desktop, 700 tablet, 500 mobile. This gives a true concave arc (center furthest back, edges wrapping forward) rather than the current shallow tilt.
- Bump `perspective` to **1800px** and `perspectiveOrigin: 50% 50%` so the curve reads deeply without fish-eye distortion.
- Column width shrinks so the wrapped arc fills the viewport width: use `width: calc(100vw / cols * 1.15)` per column with the arc math above (edges may extend slightly past viewport — that's the wrap).

## 3. Remove hover lift + heavy vignette

- Delete tile hover state entirely (no lift, no scale, no filter change, no outline). The wall is a screen, not a menu.
- Delete the `inset 0 0 240px 40px rgba(0,0,0,0.75)` inner box-shadow vignette.
- Keep only soft edge fades: reduce the four black-gradient overlays to `~12%` on top/bottom and `~6%` on left/right so the screen feels emissive at its edges rather than framed.
- Keep the warm cream bloom behind the wall but soften it (opacity 0.10, larger blur) so it reads as spill light off a bright screen.

## 4. Screen realism

- Add a very faint scanline overlay across the whole wall: 2px repeating linear-gradient `rgba(255,255,255,0.02)` at 3px pitch, on top of tiles inside the curved container. Barely visible but sells "LED panels".
- Boost video base filter to `brightness(1.12) contrast(1.1) saturate(1.05)` on all panels uniformly (no hover variant).
- Keep mouse-parallax tilt but reduce range to `rotateY: ±1.5°` / `rotateX: ±1°` — a colossal screen only moves a tiny bit with your head.
- Keep the scroll-driven subtle `translateY`/`scale` intact.

## 5. Performance

- 45 panels playing simultaneously is heavy. Eager-mount the center 15 panels (rows 2–4, all columns); lazy-mount the rest with a 300ms stagger after first paint.
- All videos stay `muted autoPlay loop playsInline` — no change to `resolveForPlayback` or `Tile` mount lifecycle beyond removing hover state.

## What stays exactly the same

- Cosmic backdrop, orbs, starfield, film grain, headline, "scroll ↓" hint, section height (320vh), scroll parallax on the wall wrapper.
- `resolveForPlayback`, lazy `Tile` mount pattern.
- `src/data/videos.ts`, `src/routes/index.tsx`, every other component.

## Verification

Reload `/`. Expect: a single massive concave IMAX screen wrapping the viewport, uniform brick-pattern panels with barely-visible seams, deep curve where center reads recessed and edges wrap forward, no hover interactions, warm screen bloom spilling behind, faint scanlines. Resize down — grid drops to 7×4 then 5×3 with proportionally softer curve.
