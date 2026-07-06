import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { videos, type VideoItem } from "@/data/videos";
import { resolveAssetUrl } from "@/lib/asset-url";

/**
 * IMAX Curved Wall — a spherical section of reels curved concavely toward the
 * viewer. Tiles keep their native aspect ratios and are packed masonry-style
 * across columns. The whole wall tilts gently toward the mouse cursor and
 * individual tiles lift on hover.
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

function Tile({
  url,
  aspect,
  rotX,
  tz,
  eager,
}: {
  url: string;
  aspect: number;
  rotX: number;
  tz: number;
  eager: boolean;
}) {
  const [mount, setMount] = useState(eager);
  const [playing, setPlaying] = useState(false);
  const [src, setSrc] = useState(url);
  const [hover, setHover] = useState(false);

  useEffect(() => setSrc(resolveForPlayback(url)), [url]);

  useEffect(() => {
    if (eager) return;
    const t = window.setTimeout(() => setMount(true), 250);
    return () => window.clearTimeout(t);
  }, [eager]);

  const hoverLift = hover ? 60 : 0;

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="relative w-full overflow-hidden rounded-[12px] bg-black ring-1 ring-white/10"
      style={{
        aspectRatio: `${aspect}`,
        transform: `rotateX(${rotX}deg) translateZ(${tz + hoverLift}px) scale(${hover ? 1.04 : 1})`,
        transformOrigin: "center center",
        transformStyle: "preserve-3d",
        backfaceVisibility: "hidden",
        transition:
          "transform 500ms cubic-bezier(.2,.7,.2,1), box-shadow 400ms ease, outline-color 300ms ease",
        boxShadow: hover
          ? "0 30px 90px -20px rgba(255,220,180,0.35), 0 20px 60px -30px rgba(0,0,0,0.9), inset 0 0 20px rgba(0,0,0,0.3)"
          : "0 20px 60px -30px rgba(0,0,0,0.9), inset 0 0 30px rgba(0,0,0,0.55)",
        outline: hover ? "1px solid rgba(255,255,255,0.28)" : "1px solid transparent",
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
          className={`absolute inset-0 h-full w-full object-cover pointer-events-none select-none transition-[filter,opacity] duration-300 ${playing ? "opacity-95" : "opacity-0"}`}
          style={{
            filter: hover
              ? "brightness(1.25) contrast(1.15) saturate(1.1)"
              : "brightness(1.08) contrast(1.08)",
          }}
        />
      )}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          opacity: hover ? 0.3 : 1,
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.5) 100%)",
        }}
      />
    </div>
  );
}

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

// Bin-pack videos into `cols` columns using shortest-column-first.
// Repeat the pool so every column is well filled.
function packColumns(pool: VideoItem[], cols: number, minTilesPerCol: number): VideoItem[][] {
  const buckets: VideoItem[][] = Array.from({ length: cols }, () => []);
  const heights = new Array(cols).fill(0);
  const target = Math.max(minTilesPerCol, Math.ceil((pool.length * 2) / cols));
  const totalNeeded = target * cols;
  for (let i = 0; i < totalNeeded; i++) {
    const item = pool[i % pool.length];
    // Height contribution = 1 / aspect (taller videos take more vertical space).
    let shortest = 0;
    for (let c = 1; c < cols; c++) {
      if (heights[c] < heights[shortest]) shortest = c;
    }
    buckets[shortest].push(item);
    heights[shortest] += 1 / item.aspect;
  }
  return buckets;
}

export function ImaxReelWall() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const p = useSpring(scrollYProgress, { stiffness: 140, damping: 32, mass: 0.35, restDelta: 0.0005 });

  const scrollY = useTransform(p, [0, 1], [-40, 40]);
  const scrollScale = useTransform(p, [0, 0.5, 1], [0.98, 1.02, 1.0]);

  // Mouse parallax (spring-damped, slow).
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const mouseRotY = useSpring(mx, { stiffness: 40, damping: 20, mass: 0.5 });
  const mouseRotX = useSpring(my, { stiffness: 40, damping: 20, mass: 0.5 });

  const cols = useColumnCount();

  const { degPerCol, zPerCol, degPerRow, zPerRow } = useMemo(() => {
    if (cols <= 3) return { degPerCol: 5, zPerCol: 20, degPerRow: 2, zPerRow: 6 };
    if (cols <= 5) return { degPerCol: 7, zPerCol: 30, degPerRow: 2.5, zPerRow: 10 };
    return { degPerCol: 8, zPerCol: 40, degPerRow: 3, zPerRow: 12 };
  }, [cols]);

  const columns = useMemo(() => packColumns(videos, cols, 4), [cols]);
  const center = (cols - 1) / 2;

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = stageRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1; // -1..1
    const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    mx.set(nx * 3); // rotateY degrees
    my.set(-ny * 2); // rotateX degrees
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-black"
      style={{ height: "320vh" }}
    >
      <div
        ref={stageRef}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="sticky top-0 h-screen w-full overflow-hidden"
      >
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

        {/* Starfield */}
        <div aria-hidden className="absolute inset-0 pointer-events-none dome-stars dome-stars-far" />
        <div aria-hidden className="absolute inset-0 pointer-events-none dome-stars dome-stars-near" />

        {/* Screen bloom — warm cream glow behind the wall */}
        <div
          aria-hidden
          className="absolute pointer-events-none"
          style={{
            left: "50%",
            top: "55%",
            width: "120vw",
            height: "110vh",
            transform: "translate(-50%, -50%)",
            background:
              "radial-gradient(50% 45% at 50% 50%, rgba(255,225,190,0.14) 0%, rgba(255,200,160,0.06) 40%, transparent 70%)",
            filter: "blur(40px)",
            mixBlendMode: "screen",
          }}
        />

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
            perspective: "1400px",
            perspectiveOrigin: "50% 55%",
          }}
        >
          <motion.div
            className="relative flex justify-center"
            style={{
              width: "min(1700px, 145vw)",
              transformStyle: "preserve-3d",
              translateY: scrollY,
              scale: scrollScale,
              rotateY: mouseRotY,
              rotateX: mouseRotX,
            }}
          >
            <div
              className="flex gap-2 px-2"
              style={{ transformStyle: "preserve-3d", width: "100%" }}
            >
              {columns.map((colTiles, colIdx) => {
                const offset = colIdx - center;
                const rotY = -offset * degPerCol;
                const tzCol = Math.abs(offset) * zPerCol;
                const midRow = (colTiles.length - 1) / 2;
                return (
                  <div
                    key={colIdx}
                    className="flex flex-1 min-w-0 flex-col gap-2"
                    style={{
                      transform: `rotateY(${rotY}deg) translateZ(${tzCol}px)`,
                      transformOrigin: "center center",
                      transformStyle: "preserve-3d",
                    }}
                  >
                    {colTiles.map((t, i) => {
                      const rowOffset = i - midRow;
                      const rowRotX = -rowOffset * degPerRow;
                      const rowTz = Math.abs(rowOffset) * zPerRow;
                      const eager = colIdx < 2 && i < 3;
                      return (
                        <Tile
                          key={`${colIdx}-${i}`}
                          url={t.url}
                          aspect={t.aspect}
                          rotX={rowRotX}
                          tz={rowTz}
                          eager={eager}
                        />
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Inner-edge vignette (theatre feel) */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-30"
          style={{
            boxShadow: "inset 0 0 240px 40px rgba(0,0,0,0.75)",
          }}
        />

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
