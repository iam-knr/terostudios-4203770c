import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { videos } from "@/data/videos";
import { resolveAssetUrl } from "@/lib/asset-url";

/**
 * IMAX Curved Wall — one massive seamless concave LED screen made of
 * uniform 1.9:1 panels tiled with no gaps and mapped onto a cylinder.
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

function Panel({ url, eager }: { url: string; eager: boolean }) {
  const [mount, setMount] = useState(eager);
  const [src, setSrc] = useState(url);

  useEffect(() => setSrc(resolveForPlayback(url)), [url]);

  useEffect(() => {
    if (eager) return;
    const t = window.setTimeout(() => setMount(true), 300 + Math.random() * 600);
    return () => window.clearTimeout(t);
  }, [eager]);

  return (
    <div
      className="relative w-full bg-black"
      style={{
        aspectRatio: "1.9 / 1",
        outline: "1px solid rgba(0,0,0,0.55)",
        outlineOffset: "-1px",
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
          className="absolute inset-0 h-full w-full object-cover pointer-events-none select-none"
          style={{ filter: "brightness(1.12) contrast(1.1) saturate(1.05)" }}
        />
      )}
    </div>
  );
}

type Layout = { cols: number; rows: number; sweep: number; radius: number };

function useLayout(): Layout {
  const [layout, setLayout] = useState<Layout>({ cols: 9, rows: 5, sweep: 90, radius: 900 });
  useEffect(() => {
    const compute = () => {
      const w = window.innerWidth;
      if (w < 640) setLayout({ cols: 5, rows: 3, sweep: 50, radius: 500 });
      else if (w < 1024) setLayout({ cols: 7, rows: 4, sweep: 70, radius: 700 });
      else setLayout({ cols: 9, rows: 5, sweep: 90, radius: 900 });
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);
  return layout;
}

export function ImaxReelWall() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const p = useSpring(scrollYProgress, { stiffness: 140, damping: 32, mass: 0.35, restDelta: 0.0005 });

  const scrollY = useTransform(p, [0, 1], [-30, 30]);
  const scrollScale = useTransform(p, [0, 0.5, 1], [0.99, 1.02, 1.0]);

  // Very subtle mouse parallax — a colossal screen barely moves.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const mouseRotY = useSpring(mx, { stiffness: 40, damping: 22, mass: 0.6 });
  const mouseRotX = useSpring(my, { stiffness: 40, damping: 22, mass: 0.6 });

  const { cols, rows, sweep, radius } = useLayout();

  // Fill grid by cycling the pool.
  const grid = useMemo(() => {
    const out: string[][] = [];
    let i = 0;
    for (let r = 0; r < rows; r++) {
      const row: string[] = [];
      for (let c = 0; c < cols; c++) {
        row.push(videos[i % videos.length].url);
        i++;
      }
      out.push(row);
    }
    return out;
  }, [cols, rows]);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = stageRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    mx.set(nx * 1.5);
    my.set(-ny * 1.0);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  // Column width — the wrapped arc should fill most of the viewport.
  const colWidth = `calc(min(100vw, 1600px) / ${cols} * 1.05)`;

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

        {/* Warm screen bloom — spill light off a bright screen */}
        <div
          aria-hidden
          className="absolute pointer-events-none"
          style={{
            left: "50%",
            top: "55%",
            width: "140vw",
            height: "120vh",
            transform: "translate(-50%, -50%)",
            background:
              "radial-gradient(50% 45% at 50% 50%, rgba(255,225,190,0.10) 0%, rgba(255,200,160,0.04) 45%, transparent 75%)",
            filter: "blur(60px)",
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

        {/* Cylindrical IMAX screen */}
        <div
          className="absolute inset-x-0 flex items-center justify-center"
          style={{
            top: "22vh",
            bottom: 0,
            perspective: "1800px",
            perspectiveOrigin: "50% 50%",
          }}
        >
          <motion.div
            className="relative flex items-center justify-center"
            style={{
              transformStyle: "preserve-3d",
              translateY: scrollY,
              scale: scrollScale,
              rotateY: mouseRotY,
              rotateX: mouseRotX,
            }}
          >
            <div className="flex" style={{ transformStyle: "preserve-3d" }}>
              {Array.from({ length: cols }).map((_, colIdx) => {
                const t = cols === 1 ? 0 : colIdx / (cols - 1) - 0.5; // -0.5..0.5
                const theta = t * sweep; // degrees
                const rad = (theta * Math.PI) / 180;
                const tz = Math.cos(rad) * radius - radius; // negative for outer columns
                const centerRow = Math.floor(rows / 2);
                return (
                  <div
                    key={colIdx}
                    className="flex flex-col"
                    style={{
                      width: colWidth,
                      transform: `rotateY(${theta}deg) translateZ(${tz}px)`,
                      transformOrigin: "center center",
                      transformStyle: "preserve-3d",
                    }}
                  >
                    {grid.map((row, rIdx) => {
                      const eager = Math.abs(rIdx - centerRow) <= 1 && Math.abs(colIdx - (cols - 1) / 2) <= 2;
                      return <Panel key={`${colIdx}-${rIdx}`} url={row[colIdx]} eager={eager} />;
                    })}
                  </div>
                );
              })}
            </div>

            {/* Scanline overlay across the screen surface */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(0deg, rgba(255,255,255,0.025) 0px, rgba(255,255,255,0.025) 1px, transparent 1px, transparent 3px)",
                mixBlendMode: "overlay",
              }}
            />
          </motion.div>
        </div>

        {/* Soft edge fades (no heavy vignette) */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[16%] z-30"
          style={{ background: "linear-gradient(0deg, #000 20%, transparent 100%)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[12%] z-20"
          style={{ background: "linear-gradient(180deg, #000 30%, transparent 100%)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-[6%] z-30"
          style={{ background: "linear-gradient(90deg, #000 30%, transparent 100%)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-[6%] z-30"
          style={{ background: "linear-gradient(270deg, #000 30%, transparent 100%)" }}
        />

        {/* Scroll hint */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-40 font-mono text-[10px] uppercase tracking-[0.3em] text-cream/40">
          scroll ↓
        </div>
      </div>
    </section>
  );
}
