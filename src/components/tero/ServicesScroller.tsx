import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent, AnimatePresence } from "framer-motion";

const services = [
  {
    n: "01",
    name: "Brand Storytelling",
    desc: "Editorial films and motion identities that translate brand DNA into stories people remember.",
    tag: "Narrative",
  },
  {
    n: "02",
    name: "Anamorphic & DOOH",
    desc: "Forced-perspective 3D spectacles built for billboards, LED corners and out-of-home moments.",
    tag: "Out of home",
  },
  {
    n: "03",
    name: "Immersive XR Training",
    desc: "VR, AR and mixed-reality modules that turn complex SOPs into hands-on muscle memory.",
    tag: "XR learning",
  },
  {
    n: "04",
    name: "PropViz Experiences",
    desc: "Real-time architectural walkthroughs, CGI films and interactive sales tools for property.",
    tag: "Real estate",
  },
  {
    n: "05",
    name: "Event & Immersive Hardware",
    desc: "Stage visuals, projection mapping and custom hardware that turn venues into experiences.",
    tag: "On ground",
  },
  {
    n: "06",
    name: "AI Content Creation",
    desc: "Generative AI-powered visuals, motion variations and smart production pipelines that scale creativity.",
    tag: "Generative",
  },
];

// SVG icons (24×24) sampled by the particle field per active service.
const ICONS: string[] = [
  // 0 — Brand Storytelling
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><rect x="1.5" y="5" width="15" height="11" rx="1.2"/><path d="M7 19h4M9 16v3"/><circle cx="8.5" cy="10.5" r="2.6"/><path d="M7.6 9.4l2.4 1.1-2.4 1.1z" fill="black" stroke="none"/><path d="M16.5 8.5l4 -2v8l-4 -2z"/><path d="M21.6 7.5c.6 1 .6 3 0 4M22.6 6.5c1 1.6 1 5 0 6.6"/></svg>`,
  // 1 — Anamorphic & DOOH
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="4" width="19" height="9" rx="0.6"/><path d="M2.5 13h19l-1 2h-17z"/><path d="M11.4 15v6M12.6 15v6"/><path d="M8 21h8"/><path d="M5 2.5l1.5 1.5M9 2.5l1 1.5M13 2.5l1 1.5M17 2.5l1 1.5"/></svg>`,
  // 2 — XR
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M10 3h4v2h-4z"/><path d="M3 9c0-1 .8-2 2-2h14c1.2 0 2 1 2 2v5c0 1.2-1 2-2 2h-3.5l-1.6-2a2 2 0 0 0-3.8 0L8.5 16H5c-1.2 0-2-.8-2-2z"/><circle cx="8.5" cy="12" r="1.8"/><circle cx="15.5" cy="12" r="1.8"/></svg>`,
  // 3 — PropViz
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21V10l-5 3v8z"/><path d="M20 21V5l-7-3v19z"/><path d="M13 2v19"/><rect x="15" y="11" width="6" height="10"/><path d="M16.5 13h1M19 13h1M16.5 15.5h1M19 15.5h1M16.5 18h1M19 18h1"/></svg>`,
  // 4 — Event hardware
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4l5 2.5v5L12 14 7 11.5v-5z"/><path d="M7 6.5l5 2.5 5-2.5M12 9v5"/><path d="M4 21h16M5 19h14a1 1 0 0 0 0-2H5a1 1 0 0 0 0 2z"/></svg>`,
  // 5 — AI chip
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="5" width="14" height="14" rx="2"/><rect x="8" y="8" width="8" height="8" rx="1"/><text x="12" y="14.3" text-anchor="middle" font-family="Arial, sans-serif" font-weight="bold" font-size="5.2" fill="black" stroke="none">AI</text><path d="M9 2v3M12 2v3M15 2v3M9 19v3M12 19v3M15 19v3M2 9h3M2 12h3M2 15h3M19 9h3M19 12h3M19 15h3"/></svg>`,
];

// Warm vermillion + amber + cream palette over black — matches site tokens.
const PALETTE = [
  "rgba(232, 57, 14, 0.95)",
  "rgba(255, 120, 60, 0.90)",
  "rgba(255, 170, 80, 0.85)",
  "rgba(196, 154, 60, 0.90)",
  "rgba(253, 250, 246, 0.85)",
  "rgba(180, 200, 230, 0.55)",
];

export function ServicesScroller() {
  const ref = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<HTMLCanvasElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  // formProgress: 0 = fully scattered, 1 = formed into icon. Built per-step so
  // particles scatter between services and re-form on the new shape.
  const formRef = useRef(0);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const total = services.length;
    const seg = 1 / total;
    const i = Math.min(total - 1, Math.max(0, Math.floor(v * total)));
    // local progress inside the segment, 0..1
    const local = (v - i * seg) / seg;
    // ease: scatter 0..0.18, hold formed 0.22..0.78, scatter 0.82..1
    let f = 0;
    if (local < 0.22) f = local / 0.22;
    else if (local > 0.78) f = Math.max(0, 1 - (local - 0.78) / 0.22);
    else f = 1;
    formRef.current = f;
    if (i !== activeRef.current) {
      activeRef.current = i;
      setActive(i);
    }
  });

  // Starfield — slow parallax twinkle behind everything.
  useEffect(() => {
    const c = starsRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    let raf = 0;
    type S = { x: number; y: number; r: number; a: number; sp: number; ph: number };
    let stars: S[] = [];

    const resize = () => {
      const w = c.clientWidth;
      const h = c.clientHeight;
      c.width = w * DPR;
      c.height = h * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      const count = Math.floor((w * h) / 5200);
      stars = new Array(count).fill(0).map(() => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.2 + 0.2,
        a: Math.random() * 0.6 + 0.2,
        sp: 0.4 + Math.random() * 0.9,
        ph: Math.random() * Math.PI * 2,
      }));
    };
    const start = performance.now();
    const tick = (now: number) => {
      const w = c.clientWidth;
      const h = c.clientHeight;
      ctx.clearRect(0, 0, w, h);
      const t = (now - start) / 1000;
      for (const s of stars) {
        const tw = 0.55 + 0.45 * Math.sin(t * s.sp + s.ph);
        ctx.globalAlpha = s.a * tw;
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(tick);
    };
    resize();
    raf = requestAnimationFrame(tick);
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  // Particle field — samples ICONS[active], morphs between shapes, scatters
  // and re-forms based on formRef (driven by scroll segment progress).
  useEffect(() => {
    const c = fieldRef.current;
    if (!c) return;
    const ctx = c.getContext("2d", { alpha: true });
    if (!ctx) return;
    const DPR = Math.min(window.devicePixelRatio || 1, 2);

    type P = {
      // home (formed) target inside the icon
      hx: number;
      hy: number;
      // scattered home (drifting deep-space position)
      sx: number;
      sy: number;
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      phase: number;
      driftA: number;
      driftR: number;
    };

    let particles: P[] = [];
    const shapes: { x: number; y: number }[][] = [];
    let raf = 0;

    async function sampleIcon(svg: string, w: number, h: number) {
      return new Promise<{ x: number; y: number }[]>((resolve) => {
        const blob = new Blob([svg], { type: "image/svg+xml" });
        const url = URL.createObjectURL(blob);
        const img = new Image();
        img.onload = () => {
          const sample = document.createElement("canvas");
          const sctx = sample.getContext("2d")!;
          const target = Math.min(w, h) * 0.55;
          const scale = target / 24;
          const sw = Math.round(24 * scale);
          const sh = Math.round(24 * scale);
          sample.width = sw;
          sample.height = sh;
          sctx.drawImage(img, 0, 0, sw, sh);
          const data = sctx.getImageData(0, 0, sw, sh).data;
          const step = Math.max(2, Math.round(Math.min(sw, sh) / 110));
          const offX = (w - sw) / 2;
          const offY = (h - sh) / 2;
          const pts: { x: number; y: number }[] = [];
          for (let y = 0; y < sh; y += step) {
            for (let x = 0; x < sw; x += step) {
              const i = (y * sw + x) * 4;
              if (data[i + 3] > 60) {
                pts.push({
                  x: x + offX + (Math.random() - 0.5) * step * 0.5,
                  y: y + offY + (Math.random() - 0.5) * step * 0.5,
                });
              }
            }
          }
          URL.revokeObjectURL(url);
          resolve(pts);
        };
        img.src = url;
      });
    }

    async function buildShapes(w: number, h: number) {
      shapes.length = 0;
      for (const svg of ICONS) {
        // eslint-disable-next-line no-await-in-loop
        shapes.push(await sampleIcon(svg, w, h));
      }
      const maxLen = shapes.reduce((m, s) => Math.max(m, s.length), 0);
      // Extra ambient particles surrounding the form, like deep-space dust.
      const ambient = Math.round(maxLen * 0.55);
      const total = maxLen + ambient;
      particles = new Array(total).fill(0).map((_, i) => {
        const a = Math.random() * Math.PI * 2;
        const r = Math.min(w, h) * (0.35 + Math.random() * 0.55);
        const sx = w / 2 + Math.cos(a) * r * (1 + Math.random() * 0.4);
        const sy = h / 2 + Math.sin(a) * r * (0.7 + Math.random() * 0.4);
        return {
          hx: sx,
          hy: sy,
          sx,
          sy,
          x: sx,
          y: sy,
          vx: 0,
          vy: 0,
          size: i < maxLen ? 0.9 + Math.random() * 1.6 : 0.5 + Math.random() * 1.0,
          color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
          phase: Math.random() * Math.PI * 2,
          driftA: a,
          driftR: r,
        };
      });
    }

    const resize = () => {
      const w = c.clientWidth;
      const h = c.clientHeight;
      c.width = w * DPR;
      c.height = h * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      buildShapes(w, h);
    };

    const start = performance.now();
    const tick = (now: number) => {
      const w = c.clientWidth;
      const h = c.clientHeight;
      // Subtle motion-trail by clearing with low-alpha black.
      ctx.fillStyle = "rgba(0,0,0,0.22)";
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";

      const t = (now - start) / 1000;
      const f = formRef.current;
      const shape = shapes[activeRef.current];
      if (!shape) {
        raf = requestAnimationFrame(tick);
        return;
      }

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        // assign home target inside the active icon when within shape length
        if (i < shape.length) {
          p.hx = shape[i].x;
          p.hy = shape[i].y;
        }
        // ambient drift — slow orbit around center
        const ang = p.driftA + t * 0.05 * (i % 2 ? 1 : -1);
        const sx = w / 2 + Math.cos(ang) * p.driftR;
        const sy = h / 2 + Math.sin(ang) * p.driftR * 0.7;
        p.sx = sx;
        p.sy = sy;

        // blend between scattered position and formed position by `f`
        const ease = f * f * (3 - 2 * f);
        const tx = sx + (p.hx - sx) * ease + Math.cos(t * 0.7 + p.phase) * (1.5 + (1 - ease) * 4);
        const ty = sy + (p.hy - sy) * ease + Math.sin(t * 0.9 + p.phase) * (1.5 + (1 - ease) * 4);

        const dx = tx - p.x;
        const dy = ty - p.y;
        p.vx = (p.vx + dx * 0.07) * 0.80;
        p.vy = (p.vy + dy * 0.07) * 0.80;
        p.x += p.vx;
        p.y += p.vy;

        ctx.beginPath();
        ctx.fillStyle = p.color;
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";
      raf = requestAnimationFrame(tick);
    };

    resize();
    raf = requestAnimationFrame(tick);
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  // Title fade-in opacity tied to scroll into section
  const titleOpacity = useTransform(scrollYProgress, [0, 0.04, 0.96, 1], [0, 1, 1, 0]);

  return (
    <section
      ref={ref}
      data-nav-theme="dark"
      className="relative"
      style={{
        height: `${services.length * 100}vh`,
        background: "#050507",
        color: "#fdfaf6",
      }}
    >
      <div ref={stageRef} className="sticky top-0 h-screen overflow-hidden">
        {/* Deep space gradient */}
        <div
          aria-hidden
          className="absolute inset-0 z-0"
          style={{
            background:
              "radial-gradient(80% 55% at 50% 50%, rgba(60,20,8,0.45) 0%, rgba(20,8,4,0.30) 35%, #050507 70%)",
          }}
        />

        {/* Starfield */}
        <canvas ref={starsRef} className="absolute inset-0 z-[1] block w-full h-full" />

        {/* Particle morph field — fills the stage */}
        <canvas ref={fieldRef} className="absolute inset-0 z-[2] block w-full h-full" />

        {/* Vermillion glow behind the cluster */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[2]"
          style={{
            background:
              "radial-gradient(28% 22% at 50% 52%, rgba(232,57,14,0.22) 0%, transparent 70%)",
            mixBlendMode: "screen",
          }}
        />

        {/* Top section title */}
        <motion.div
          style={{ opacity: titleOpacity }}
          className="absolute inset-x-0 top-[88px] md:top-[96px] z-20 flex flex-col items-center gap-2 px-8"
        >
          <span className="font-mono text-[11px] uppercase tracking-[0.35em] text-white/45">
            What we craft
          </span>
          <h2 className="font-display text-[clamp(20px,2.2vw,28px)] leading-none text-white/90">
            Our Primary Services
          </h2>
        </motion.div>

        {/* Left number rail */}
        <div className="pointer-events-none absolute left-6 md:left-10 top-1/2 -translate-y-1/2 z-20 hidden md:block">
          <ul className="space-y-3 font-mono text-[11px]">
            {services.map((s, i) => (
              <li
                key={s.n}
                className={[
                  "flex items-center gap-3 transition-colors duration-500",
                  i === active ? "text-white" : "text-white/25",
                ].join(" ")}
              >
                <span>{s.n}</span>
                <span
                  className="inline-block h-px bg-vermillion transition-all duration-500"
                  style={{ width: i === active ? 28 : 0, opacity: i === active ? 1 : 0 }}
                />
              </li>
            ))}
          </ul>
        </div>

        {/* Alternating side text — odd → left, even → right */}
        <div className="absolute inset-0 z-20 flex items-center pointer-events-none">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
              className={[
                "w-full px-6 md:px-16",
                active % 2 === 0 ? "text-left" : "text-right",
              ].join(" ")}
            >
              <div
                className={[
                  "max-w-[640px]",
                  active % 2 === 0 ? "mr-auto" : "ml-auto",
                ].join(" ")}
              >
                <div className="flex items-center gap-3 mb-5 font-mono text-[11px] uppercase tracking-[0.32em] text-vermillion"
                  style={{ justifyContent: active % 2 === 0 ? "flex-start" : "flex-end" }}>
                  <span className="inline-block h-px w-8 bg-vermillion" />
                  <span>{services[active].tag}</span>
                </div>
                <h3
                  className="font-display font-bold leading-[0.95] text-white"
                  style={{
                    fontSize: "clamp(40px, 6.4vw, 108px)",
                    letterSpacing: "-0.03em",
                    textShadow: "0 0 60px rgba(232,57,14,0.25)",
                  }}
                >
                  {services[active].name}
                </h3>
                <p className="mt-6 font-body text-[15px] md:text-[17px] leading-[1.55] text-white/65 max-w-[44ch]"
                  style={{ marginLeft: active % 2 === 0 ? 0 : "auto" }}>
                  {services[active].desc}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom counter + scroll hint */}
        <div className="absolute inset-x-0 bottom-0 z-20 flex items-center justify-between px-8 pb-8 md:px-12 font-mono text-[11px] uppercase tracking-[0.3em] text-white/45">
          <span>— What we do</span>
          <span className="hidden md:inline-block text-white/30">Scroll ↓</span>
          <span>
            <span className="text-white/80">{String(active + 1).padStart(2, "0")}</span>
            {" / "}
            {String(services.length).padStart(2, "0")}
          </span>
        </div>
      </div>
    </section>
  );
}
