import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { videos } from "@/data/videos";
import { resolveAssetUrl } from "@/lib/asset-url";

/**
 * IMAX Curved Wall — a masonry grid of reels curved concavely toward the
 * viewer like the inside of a giant IMAX cylinder screen. Reuses the exact
 * `videos` data source used by the rest of the site.
 */

function resolveForPlayback(url: string) {
  if (typeof window === "undefined") return resolveAssetUrl(url);
  const isLocal = ["localhost", "127.0.0.1", "0.0.0.0"].includes(window.location.hostname);
  const resolved = resolveAssetUrl(url);
  const parsed = new URL(resolved, window.location.origin);
  if (!isLocal) return resolved;
  return parsed.pathname.startsWith("/__l5e/")
    ? `https://id-preview--12ac4244-7645-4fb2-a900-5ab683320d3c.lovable.app${parsed.pathname}${parsed.search}${parsed.hash}`
    : resolved;
}

function Tile({ url, height, eager }: { url: string; height: number; eager: boolean }) {
  const [mount, setMount] = useState(eager);
  const [playing, setPlaying] = useState(false);
  const [src, setSrc] = useState(url);

  useEffect(() => setSrc(resolveForPlayback(url)), [url]);

  useEffect(() => {
    if (eager) return;
    const t = window.setTimeout(() => setMount(true), 250);
    return () => window.clearTimeout(t);
  }, [eager]);

  return (
    <div
      className="relative w-full overflow-hidden rounded-[12px] bg-black ring-1 ring-white/10"
      style={{
        height,
        boxShadow: "0 20px 60px -30px rgba(0,0,0,0.9), inset 0 0 30px rgba(0,0,0,0.55)",
        backfaceVisibility: "hidden",
      }}
    >
      {mount && (
        <video
          src={src}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onLoadedData={(e) => {
            const v = e.currentTarget;
            if (v.paused) v.play().catch(() => {});
          }}
          onPlaying={() => setPlaying(true)}
          className={`absolute inset-0 h-full w-full object-cover pointer-events-none select-none brightness-[1.08] contrast-[1.08] transition-opacity duration-200 ${playing ? "opacity-95" : "opacity-0"}`}
        />
      )}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.5) 100%)",
        }}
      />
    </div>
  );
}

// Height patterns per column (px) — offset per column index for masonry feel.
const HEIGHT_PATTERNS = [
  [220, 160, 260, 180, 240],
  [180, 260, 200, 240, 170],
  [240, 190, 220, 260, 180],
  [200, 250, 170, 230, 210],
  [260, 180, 240, 200, 250],
  [190, 230, 260, 170, 220],
  [230, 200, 190, 250, 180],
];

function useColumnCount() {
  const [cols, setCols] = useState(7);
  useEffect(() => {
    const compute = () => {
      const w = window.innerWidth;
      if (w < 640) setCols(3);
      else if (w < 1024) setCols(5);
      else setCols(7);
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);
  return cols;
}

export function ImaxReelWall() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const p = useSpring(scrollYProgress, { stiffness: 140, damping: 32, mass: 0.35, restDelta: 0.0005 });

  // Subtle parallax on the whole wall — no dome spin.
  const translateY = useTransform(p, [0, 1], [-40, 40]);
  const scale = useTransform(p, [0, 0.5, 1], [0.98, 1.02, 1.0]);

  const cols = useColumnCount();

  // Curve params scale with column count.
  const { degPerCol, zPerCol } = useMemo(() => {
    if (cols <= 3) return { degPerCol: 5, zPerCol: 20 };
    if (cols <= 5) return { degPerCol: 7, zPerCol: 30 };
    return { degPerCol: 8, zPerCol: 40 };
  }, [cols]);

  // Distribute videos across columns round-robin, cycling the pool if needed.
  const columns = useMemo(() => {
    const tilesPerCol = 5;
    const total = cols * tilesPerCol;
    const buckets: { url: string }[][] = Array.from({ length: cols }, () => []);
    for (let i = 0; i < total; i++) {
      const src = videos[i % videos.length];
      buckets[i % cols].push({ url: src.url });
    }
    return buckets;
  }, [cols]);

  const center = (cols - 1) / 2;

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-black"
      style={{ height: "320vh" }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Cosmic backdrop */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(70% 55% at 50% 25%, #11131c 0%, #06070d 60%, #000 100%)",
          }}
        />

        {/* Drifting nebula orbs */}
        <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden" style={{ mixBlendMode: "screen" }}>
          <div className="dome-orb dome-orb-1" />
          <div className="dome-orb dome-orb-2" />
          <div className="dome-orb dome-orb-3" />
        </div>

        {/* Dense starfield */}
        <div aria-hidden className="absolute inset-0 pointer-events-none dome-stars dome-stars-far" />
        <div aria-hidden className="absolute inset-0 pointer-events-none dome-stars dome-stars-near" />

        {/* Film grain */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none opacity-[0.07] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.55'/></svg>\")",
            backgroundSize: "160px 160px",
          }}
        />

        <style>{`
          .dome-orb { position: absolute; border-radius: 9999px; filter: blur(80px); will-change: transform; }
          .dome-orb-1 { width: 560px; height: 560px; left: -8vw; top: 8vh; background: radial-gradient(circle, rgba(232,57,14,0.22) 0%, transparent 65%); animation: dome-drift-1 42s ease-in-out infinite alternate; }
          .dome-orb-2 { width: 640px; height: 640px; right: -10vw; top: 40vh; background: radial-gradient(circle, rgba(45,27,110,0.30) 0%, transparent 65%); animation: dome-drift-2 50s ease-in-out infinite alternate; }
          .dome-orb-3 { width: 480px; height: 480px; left: 35vw; top: 55vh; background: radial-gradient(circle, rgba(30,60,140,0.20) 0%, transparent 65%); animation: dome-drift-3 60s ease-in-out infinite alternate; }
          @keyframes dome-drift-1 { to { transform: translate3d(30vw, 20vh, 0); } }
          @keyframes dome-drift-2 { to { transform: translate3d(-25vw, -15vh, 0); } }
          @keyframes dome-drift-3 { to { transform: translate3d(-15vw, -25vh, 0); } }

          .dome-stars { background-repeat: repeat; opacity: 0.55; will-change: transform; }
          .dome-stars-far {
            background-image:
              radial-gradient(1px 1px at 18% 22%, rgba(255,255,255,0.4), transparent 60%),
              radial-gradient(1px 1px at 47% 64%, rgba(255,255,255,0.35), transparent 60%),
              radial-gradient(1px 1px at 73% 38%, rgba(255,255,255,0.4), transparent 60%),
              radial-gradient(1px 1px at 88% 81%, rgba(255,255,255,0.3), transparent 60%);
            background-size: 460px 460px;
            animation: dome-twinkle 8s ease-in-out infinite alternate, dome-pan-far 180s linear infinite;
          }
          .dome-stars-near {
            background-image:
              radial-gradient(1.4px 1.4px at 22% 36%, rgba(255,255,255,0.7), transparent 60%),
              radial-gradient(1.2px 1.2px at 58% 78%, rgba(220,230,255,0.6), transparent 60%),
              radial-gradient(1.5px 1.5px at 81% 18%, rgba(255,240,220,0.65), transparent 60%);
            background-size: 720px 720px;
            animation: dome-twinkle 6s ease-in-out infinite alternate-reverse, dome-pan-near 120s linear infinite;
          }
          @keyframes dome-twinkle { 0% { opacity: 0.35; } 100% { opacity: 0.75; } }
          @keyframes dome-pan-far { to { background-position: 460px 0; } }
          @keyframes dome-pan-near { to { background-position: -720px 0; } }
          @media (prefers-reduced-motion: reduce) {
            .dome-orb, .dome-stars { animation: none !important; }
          }
        `}</style>

        {/* Heading */}
        <div className="absolute inset-x-0 z-40 flex flex-col items-center" style={{ top: "120px" }}>
          <div className="pointer-events-none absolute inset-x-0 top-[-36px] h-[150px] z-[-1] bg-gradient-to-b from-black via-black/85 to-transparent" />
          <header className="text-center container-tero">
            <div className="mb-1 flex items-center justify-center gap-2">
              <span className="h-px w-5 bg-vermillion/60" />
              <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-vermillion">
                (01) The Dome Reel
              </span>
              <span className="h-px w-5 bg-vermillion/60" />
            </div>
            <h2 className="font-display text-[clamp(18px,2.2vw,30px)] leading-[1.2] tracking-tight text-[#fdfaf6] pb-1">
              Step inside the <span className="italic text-vermillion">dome.</span>
            </h2>
          </header>
        </div>

        {/* IMAX curved wall stage */}
        <div
          className="absolute inset-x-0 flex items-start justify-center overflow-hidden"
          style={{
            top: "22vh",
            bottom: 0,
            perspective: "1200px",
            perspectiveOrigin: "50% 55%",
          }}
        >
          <motion.div
            className="relative flex justify-center"
            style={{
              width: "min(1600px, 140vw)",
              transformStyle: "preserve-3d",
              translateY,
              scale,
            }}
          >
            <div
              className="flex gap-2 px-2"
              style={{ transformStyle: "preserve-3d", width: "100%" }}
            >
              {columns.map((colTiles, colIdx) => {
                const offset = colIdx - center;
                const rotY = -offset * degPerCol; // negative offset (left) => positive rotateY, wraps toward viewer
                const tz = -Math.abs(offset) * zPerCol * -1; // edge columns pulled forward (+Z)
                const heights = HEIGHT_PATTERNS[colIdx % HEIGHT_PATTERNS.length];
                let tileCounter = 0;
                return (
                  <div
                    key={colIdx}
                    className="flex flex-1 min-w-0 flex-col gap-2"
                    style={{
                      transform: `rotateY(${rotY}deg) translateZ(${tz}px)`,
                      transformOrigin: "center center",
                      transformStyle: "preserve-3d",
                    }}
                  >
                    {colTiles.map((t, i) => {
                      const h = heights[i % heights.length];
                      const eager = colIdx < 2;
                      const key = `${colIdx}-${i}-${tileCounter++}`;
                      return <Tile key={key} url={t.url} height={h} eager={eager} />;
                    })}
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Vignettes */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[26%] z-30"
          style={{ background: "linear-gradient(0deg, #000 10%, transparent 100%)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[18%] z-20"
          style={{ background: "linear-gradient(180deg, #000 20%, transparent 100%)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-[10%] z-30"
          style={{ background: "linear-gradient(90deg, #000 20%, transparent 100%)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-[10%] z-30"
          style={{ background: "linear-gradient(270deg, #000 20%, transparent 100%)" }}
        />

        {/* Scroll hint */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-40 font-mono text-[10px] uppercase tracking-[0.3em] text-cream/40">
          scroll ↓
        </div>
      </div>
    </section>
  );
}
