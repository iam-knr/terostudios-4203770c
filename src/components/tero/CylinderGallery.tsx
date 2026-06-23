import { useMemo, useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { videos } from "@/data/videos";

/**
 * Two-act anamorphic stage:
 *   Act 1 (scroll 0 → 0.55): a deck of video cards RISES UP from below the
 *     viewport and FANS OUT into a wide anamorphic arc — each card tilts on
 *     its own axis (rotateY/rotateZ) like cards being dealt in 3D.
 *   Act 2 (scroll 0.55 → 1): the fan dissolves and a curved 4-row reel wall
 *     settles in; rows pan left/right (alternating) forever.
 * Heading stays pinned at the top of the sticky viewport throughout.
 */

const FAN_COUNT = 13; // odd → true center card
const FAN_SPREAD_X = 720; // half-width of the fan spread (px from center)
const FAN_SPREAD_Y = 80; // arc droop (px below center at edges)
const FAN_ROT = 38; // max card rotation (deg) at the fan edges

// Wall config (Act 2)
const ROWS = 4;
const TILES_PER_ROW = 7;
const TILE_W = 220;
const TILE_H = 130;
const GAP = 14;
const CURVE = 60;
const DEPTH = 380;

// Pre-computed fan layout (deterministic).
const FAN = Array.from({ length: FAN_COUNT }, (_, i) => {
  const halfN = (FAN_COUNT - 1) / 2;
  const t = (i - halfN) / halfN; // -1..1
  return {
    t,
    finalX: t * FAN_SPREAD_X,
    finalY: Math.abs(t) * FAN_SPREAD_Y, // arc droops at edges
    finalRotZ: t * FAN_ROT,
    finalRotY: -t * 18, // anamorphic facing inward
    z: -Math.abs(t) * 220, // edge cards recede
    w: 300 - Math.abs(t) * 60, // edge cards a bit smaller
  };
});

export function CylinderGallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const p = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 28,
    mass: 0.5,
  });

  const fanOpacity = useTransform(p, [0, 0.45, 0.6], [1, 1, 0]);
  const wallOpacity = useTransform(p, [0.45, 0.6, 1], [0, 1, 1]);
  const wallScale = useTransform(p, [0.45, 0.7], [0.92, 1]);

  // Stable row tiles for the wall, duplicated for seamless marquee.
  const rows = useMemo(
    () =>
      Array.from({ length: ROWS }, (_, r) => {
        const base = Array.from({ length: TILES_PER_ROW }, (_, c) => {
          const idx = (r * TILES_PER_ROW + c) % videos.length;
          return videos[idx];
        });
        return [...base, ...base];
      }),
    [],
  );

  const halfC = (TILES_PER_ROW - 1) / 2;

  return (
    <section
      ref={sectionRef}
      className="relative bg-ink text-cream"
      style={{ height: "300vh" }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Backdrop glow */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(70% 55% at 50% 50%, rgba(232,57,14,0.16) 0%, transparent 65%), #0a0b10",
          }}
        />

        {/* Heading pinned on top */}
        <div className="absolute inset-x-0 top-0 z-40 px-6 pt-10 md:pt-14 text-center">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-cream/60">
            Reel Wall · Anamorphic Theatre
          </span>
          <h2 className="mt-3 font-display text-[clamp(2rem,4.6vw,4rem)] leading-[1.02] tracking-[-0.02em] text-cream">
            Stories That Bend Reality
          </h2>
          <p className="mt-2 text-[12px] md:text-[13px] tracking-[0.18em] uppercase text-cream/55">
            Anamorphic worlds, crafted frame by frame
          </p>
        </div>

        {/* ── ACT 1: Deck rising from below, fanning out ── */}
        <motion.div
          className="absolute inset-0 z-10 flex items-center justify-center"
          style={{
            perspective: "1600px",
            perspectiveOrigin: "50% 55%",
            opacity: fanOpacity,
          }}
        >
          <div
            className="relative"
            style={{ transformStyle: "preserve-3d", width: 1, height: 1 }}
          >
            {FAN.map((f, i) => (
              <FanCard
                key={i}
                f={f}
                index={i}
                total={FAN_COUNT}
                progress={p}
                url={videos[i % videos.length].url}
              />
            ))}
          </div>
        </motion.div>

        {/* ── ACT 2: Curved 4-row reel wall (rows pan left/right) ── */}
        <motion.div
          className="absolute inset-0 z-20 flex items-center justify-center"
          style={{
            perspective: "1500px",
            perspectiveOrigin: "50% 50%",
            opacity: wallOpacity,
            scale: wallScale,
          }}
        >
          <div
            className="relative mx-auto"
            style={{
              transformStyle: "preserve-3d",
              width: "min(1400px, 96vw)",
            }}
          >
            {rows.map((rowTiles, r) => {
              const dir = r % 2 === 0 ? "tero-row-left" : "tero-row-right";
              const duration = 38 + r * 6;
              return (
                <div
                  key={r}
                  className="relative mx-auto"
                  style={{
                    marginTop: r === 0 ? 0 : GAP,
                    height: TILE_H,
                    width: "100%",
                    overflow: "hidden",
                    maskImage:
                      "linear-gradient(90deg, transparent 0%, #000 12%, #000 88%, transparent 100%)",
                  }}
                >
                  <div
                    className="absolute top-0 left-0 flex"
                    style={{
                      gap: GAP,
                      animation: `${dir} ${duration}s linear infinite`,
                      transformStyle: "preserve-3d",
                    }}
                  >
                    {rowTiles.map((vid, c) => {
                      const cMod = c % TILES_PER_ROW;
                      const t = (cMod - halfC) / halfC;
                      const rotY = -t * (CURVE / 2);
                      const tz = -Math.abs(t) * DEPTH;
                      return (
                        <div
                          key={`${r}-${c}`}
                          className="relative shrink-0 overflow-hidden rounded-[8px] ring-1 ring-cream/10 bg-black"
                          style={{
                            width: TILE_W,
                            height: TILE_H,
                            transform: `rotateY(${rotY}deg) translateZ(${tz}px)`,
                            transformStyle: "preserve-3d",
                            boxShadow:
                              "0 30px 60px -30px rgba(0,0,0,0.7), inset 0 0 40px rgba(0,0,0,0.35)",
                          }}
                        >
                          <video
                            src={vid.url}
                            autoPlay
                            muted
                            loop
                            playsInline
                            preload="metadata"
                            className="absolute inset-0 h-full w-full object-cover pointer-events-none select-none"
                          />
                          <div
                            aria-hidden
                            className="absolute inset-0 pointer-events-none"
                            style={{
                              background:
                                "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.35) 100%)",
                            }}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Edge vignettes */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-[18%] z-30"
          style={{
            background:
              "linear-gradient(90deg, #0a0b10 10%, rgba(10,11,16,0.5) 60%, transparent 100%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-[18%] z-30"
          style={{
            background:
              "linear-gradient(-90deg, #0a0b10 10%, rgba(10,11,16,0.5) 60%, transparent 100%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[18%] z-30"
          style={{
            background: "linear-gradient(0deg, #0a0b10 10%, transparent 100%)",
          }}
        />

        {/* Scroll hint */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 font-mono text-[10px] uppercase tracking-[0.3em] text-cream/40">
          scroll ↓
        </div>
      </div>
    </section>
  );
}

type FanItem = (typeof FAN)[number];

function FanCard({
  f,
  index,
  total,
  progress,
  url,
}: {
  f: FanItem;
  index: number;
  total: number;
  progress: MotionValue<number>;
  url: string;
}) {
  // Stagger: each card emerges in sequence from center outward.
  const order = Math.abs(index - (total - 1) / 2); // 0 = center first
  const delay = order * 0.025; // 0..~0.15
  const start = delay;
  const end = delay + 0.42;

  // Phase 1 only — settle by ~p=0.45, then Act 2 takes over.
  const y = useTransform(progress, [start, end], [900, f.finalY]);
  const x = useTransform(progress, [start, end], [0, f.finalX]);
  const rotZ = useTransform(progress, [start, end], [0, f.finalRotZ]);
  const rotY = useTransform(progress, [start, end], [0, f.finalRotY]);
  const scl = useTransform(progress, [start, end], [0.55, 1]);
  const op = useTransform(
    progress,
    [start, start + 0.04, end, 0.55],
    [0, 1, 1, 0.85],
  );

  return (
    <motion.div
      className="absolute overflow-hidden rounded-[12px] ring-1 ring-cream/15 bg-black"
      style={{
        left: 0,
        top: 0,
        width: f.w,
        height: f.w * 0.6,
        x,
        y,
        z: f.z,
        scale: scl,
        rotateY: rotY,
        rotateZ: rotZ,
        opacity: op,
        transformStyle: "preserve-3d",
        translateX: "-50%",
        translateY: "-50%",
        zIndex: 100 - Math.round(Math.abs(f.t) * 50),
        boxShadow:
          "0 60px 120px -40px rgba(232,57,14,0.4), 0 30px 70px -30px rgba(0,0,0,0.85), inset 0 0 40px rgba(0,0,0,0.4)",
      }}
    >
      <video
        src={url}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className="absolute inset-0 h-full w-full object-cover pointer-events-none select-none"
      />
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.45) 100%)",
        }}
      />
    </motion.div>
  );
}
