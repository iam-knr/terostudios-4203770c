import { useEffect, useRef } from "react";

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

const ICONS: string[] = [
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="1.5" y="5" width="15" height="11" rx="1.2"/><path d="M7 19h4M9 16v3"/><circle cx="8.5" cy="10.5" r="2.6"/><path d="M7.6 9.4l2.4 1.1-2.4 1.1z" fill="black" stroke="none"/><path d="M16.5 8.5l4 -2v8l-4 -2z"/><path d="M21.6 7.5c.6 1 .6 3 0 4M22.6 6.5c1 1.6 1 5 0 6.6"/></svg>`,
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="4" width="19" height="9" rx="0.6"/><path d="M2.5 13h19l-1 2h-17z"/><path d="M11.4 15v6M12.6 15v6"/><path d="M8 21h8"/><path d="M5 2.5l1.5 1.5M9 2.5l1 1.5M13 2.5l1 1.5M17 2.5l1 1.5"/></svg>`,
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M10 3h4v2h-4z"/><path d="M3 9c0-1 .8-2 2-2h14c1.2 0 2 1 2 2v5c0 1.2-1 2-2 2h-3.5l-1.6-2a2 2 0 0 0-3.8 0L8.5 16H5c-1.2 0-2-.8-2-2z"/><circle cx="8.5" cy="12" r="1.8"/><circle cx="15.5" cy="12" r="1.8"/></svg>`,
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21V10l-5 3v8z"/><path d="M20 21V5l-7-3v19z"/><path d="M13 2v19"/><rect x="15" y="11" width="6" height="10"/><path d="M16.5 13h1M19 13h1M16.5 15.5h1M19 15.5h1M16.5 18h1M19 18h1"/></svg>`,
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4l5 2.5v5L12 14 7 11.5v-5z"/><path d="M7 6.5l5 2.5 5-2.5M12 9v5"/><path d="M4 21h16M5 19h14a1 1 0 0 0 0-2H5a1 1 0 0 0 0 2z"/></svg>`,
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="5" width="14" height="14" rx="2"/><rect x="8" y="8" width="8" height="8" rx="1"/><text x="12" y="14.3" text-anchor="middle" font-family="Arial, sans-serif" font-weight="bold" font-size="5.2" fill="black" stroke="none">AI</text><path d="M9 2v3M12 2v3M15 2v3M9 19v3M12 19v3M15 19v3M2 9h3M2 12h3M2 15h3M19 9h3M19 12h3M19 15h3"/></svg>`,
];

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const smooth = (n: number) => {
  const t = clamp01(n);
  return t * t * t * (t * (t * 6 - 15) + 10);
};

const THEME_PARTICLE_COLORS = [
  "rgba(232,57,14,0.96)",
  "rgba(232,57,14,0.82)",
  "rgba(196,154,60,0.82)",
  "rgba(253,250,246,0.78)",
];

type Point = { x: number; y: number };

export function ServicesScroller() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<HTMLCanvasElement>(null);
  const textRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const canvas = starsRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let raf = 0;
    let w = 0;
    let h = 0;
    let depth = 0;
    type Star = { x: number; y: number; z: number; r: number; a: number };
    let stars: Star[] = [];

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      stars = new Array(Math.floor((w * h) / 2800)).fill(0).map(() => ({
        x: (Math.random() - 0.5) * w,
        y: (Math.random() - 0.5) * h,
        z: Math.random() * 1 + 0.15,
        r: Math.random() * 1.15 + 0.15,
        a: Math.random() * 0.55 + 0.18,
      }));
    };

    const onScroll = () => {
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const total = Math.max(1, rect.height - window.innerHeight);
      depth = clamp01(-rect.top / total);
    };

    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2;
      const cy = h / 2;
      for (const s of stars) {
        const travel = depth * 900 * s.z;
        const yy = ((s.y + travel + h * 0.7) % (h * 1.4)) - h * 0.7;
        const scale = 0.65 + s.z * 0.9;
        ctx.globalAlpha = s.a;
        ctx.fillStyle = "#fdfaf6";
        ctx.beginPath();
        ctx.arc(cx + s.x * scale, cy + yy * scale, s.r * scale, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(tick);
    };

    resize();
    onScroll();
    raf = requestAnimationFrame(tick);
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    const canvas = fieldRef.current;
    const stage = stageRef.current;
    if (!canvas || !stage) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let raf = 0;
    let w = 0;
    let h = 0;
    let progress = 0;
    let pointerX = -9999;
    let pointerY = -9999;
    let smoothPointerX = -9999;
    let smoothPointerY = -9999;
    let last = performance.now();

    type Particle = {
      x: number;
      y: number;
      z: number;
      vx: number;
      vy: number;
      vz: number;
      scatterX: number;
      scatterY: number;
      scatterZ: number;
      shapeIndex: number;
      color: string;
      size: number;
      phase: number;
    };

    let shapes: Point[][] = [];
    let particles: Particle[] = [];

    async function sampleIcon(svg: string, box: number) {
      return new Promise<Point[]>((resolve) => {
        const blob = new Blob([svg], { type: "image/svg+xml" });
        const url = URL.createObjectURL(blob);
        const img = new Image();
        img.onload = () => {
          const sample = document.createElement("canvas");
          const sctx = sample.getContext("2d")!;
          const size = Math.round(box);
          sample.width = size;
          sample.height = size;
          const glyph = size * 0.82;
          const off = (size - glyph) / 2;
          sctx.drawImage(img, off, off, glyph, glyph);
          const data = sctx.getImageData(0, 0, size, size).data;
          const step = Math.max(3, Math.round(size / 88));
          const pts: Point[] = [];
          for (let y = 0; y < size; y += step) {
            for (let x = 0; x < size; x += step) {
              const i = (y * size + x) * 4;
              if (data[i + 3] > 70) {
                pts.push({
                  x: x - size / 2 + (Math.random() - 0.5) * step * 0.35,
                  y: y - size / 2 + (Math.random() - 0.5) * step * 0.35,
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

    const rebuild = async () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const box = Math.min(w * 0.36, h * 0.54, 430);
      shapes = [];
      for (const svg of ICONS) {
        // eslint-disable-next-line no-await-in-loop
        shapes.push(await sampleIcon(svg, box));
      }
      const maxLen = shapes.reduce((m, s) => Math.max(m, s.length), 0);
      const total = Math.min(950, Math.max(520, maxLen));
      particles = new Array(total).fill(0).map((_, i) => {
        const a = Math.random() * Math.PI * 2;
        const r = Math.min(w, h) * (0.34 + Math.random() * 0.42);
        const sx = Math.cos(a) * r;
        const sy = Math.sin(a) * r * 1.35;
        return {
          x: sx,
          y: sy,
          z: (Math.random() - 0.5) * 360,
          vx: 0,
          vy: 0,
          vz: 0,
          scatterX: sx,
          scatterY: sy,
          scatterZ: (Math.random() - 0.5) * 520,
          shapeIndex: i,
          color: THEME_PARTICLE_COLORS[Math.floor(Math.random() * THEME_PARTICLE_COLORS.length)],
          size: 0.75 + Math.random() * 1.25,
          phase: Math.random() * Math.PI * 2,
        };
      });
    };

    const updateProgress = () => {
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const total = Math.max(1, rect.height - window.innerHeight);
      progress = clamp01(-rect.top / total);
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointerX = event.clientX - rect.left;
      pointerY = event.clientY - rect.top;
    };

    const onPointerLeave = () => {
      pointerX = -9999;
      pointerY = -9999;
    };

    const tick = (now: number) => {
      const dt = Math.min(0.035, Math.max(0.001, (now - last) / 1000));
      last = now;
      updateProgress();

      if (pointerX > -9000) {
        if (smoothPointerX < -9000) {
          smoothPointerX = pointerX;
          smoothPointerY = pointerY;
        }
        smoothPointerX += (pointerX - smoothPointerX) * 0.16;
        smoothPointerY += (pointerY - smoothPointerY) * 0.16;
      } else {
        smoothPointerX = -9999;
        smoothPointerY = -9999;
      }

      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";

      const serviceCount = services.length;
      const raw = progress * serviceCount;
      const activeFloat = Math.min(serviceCount - 0.001, raw);
      const active = Math.floor(activeFloat);
      const local = activeFloat - active;
      const form = smooth(Math.sin(local * Math.PI));
      const side = active % 2 === 0 ? 1 : -1;
      const targetCx = w * (side > 0 ? 0.69 : 0.31);
      const textCx = w * (side > 0 ? 0.24 : 0.76);
      const cy = h * 0.5;
      const shape = shapes[active] || shapes[0] || [];
      const yaw = progress * Math.PI * 2.8 + local * 0.55;
      const pitch = Math.sin(progress * Math.PI * 2) * 0.28;
      const downDrift = (local - 0.5) * 90;
      const t = now / 1000;

      textRefs.current.forEach((node, i) => {
        if (!node) return;
        const dist = Math.abs(i - active - local * 0.18);
        const appear = clamp01(1 - dist * 1.35);
        const textSide = i % 2 === 0 ? -1 : 1;
        const tx = w * (textSide < 0 ? 0.08 : 0.56);
        const ty = h * 0.5 + (i - active - local) * 150;
        node.style.opacity = String(smooth(appear));
        node.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
      });

      for (const p of particles) {
        const idx = p.shapeIndex % Math.max(1, shape.length);
        const pt = shape[idx] || { x: 0, y: 0 };
        const depth = ((idx % 17) - 8) * 5.5 + Math.sin(idx * 0.9) * 20;
        const cosY = Math.cos(yaw);
        const sinY = Math.sin(yaw);
        const cosP = Math.cos(pitch);
        const sinP = Math.sin(pitch);
        const rx = pt.x * cosY + depth * sinY;
        const rz = depth * cosY - pt.x * sinY;
        const ry = pt.y * cosP - rz * sinP;
        const rz2 = rz * cosP + pt.y * sinP;
        const scatterBreath = 1 + Math.sin(t * 0.22 + p.phase) * 0.025;
        const scatterX = p.scatterX * scatterBreath;
        const scatterY = p.scatterY * scatterBreath + progress * h * 0.14;
        const scatterZ = p.scatterZ;
        const targetX = scatterX * (1 - form) + rx * form;
        const targetY = scatterY * (1 - form) + (ry + downDrift) * form;
        const targetZ = scatterZ * (1 - form) + rz2 * form;

        let screenX = targetCx + targetX;
        let screenY = cy + targetY;
        if (smoothPointerX > -9000) {
          const dx = screenX - smoothPointerX;
          const dy = screenY - smoothPointerY;
          const dist = Math.hypot(dx, dy);
          const radius = 92;
          if (dist < radius && dist > 0.1) {
            const force = Math.pow(1 - dist / radius, 2) * 46;
            screenX += (dx / dist) * force;
            screenY += (dy / dist) * force;
          }
        }

        const tx = screenX - targetCx;
        const ty = screenY - cy;
        const tz = targetZ;
        p.vx = (p.vx + (tx - p.x) * 0.022) * 0.86;
        p.vy = (p.vy + (ty - p.y) * 0.022) * 0.86;
        p.vz = (p.vz + (tz - p.z) * 0.018) * 0.88;
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;

        const perspective = 760 / (760 - p.z);
        const px = targetCx + p.x * perspective;
        const py = cy + p.y * perspective;
        const alpha = 0.20 + form * 0.72 + Math.max(0, p.z) / 1200;
        ctx.globalAlpha = Math.min(1, alpha);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(px, py, p.size * perspective * (0.86 + form * 0.42), 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
      raf = requestAnimationFrame(tick);
    };

    rebuild();
    raf = requestAnimationFrame(tick);
    window.addEventListener("resize", rebuild);
    window.addEventListener("scroll", updateProgress, { passive: true });
    canvas.addEventListener("pointermove", onPointerMove, { passive: true });
    canvas.addEventListener("pointerleave", onPointerLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", rebuild);
      window.removeEventListener("scroll", updateProgress);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      data-nav-theme="dark"
      className="relative bg-[#030509] text-[#fdfaf6]"
      style={{ height: `${services.length * 170}vh` }}
    >
      <div ref={stageRef} className="sticky top-0 h-screen overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 115%, rgba(18,22,36,0.9) 0%, transparent 58%), linear-gradient(180deg, #020309 0%, #05070d 54%, #020309 100%)",
          }}
        />
        <canvas ref={starsRef} className="absolute inset-0 block h-full w-full" />
        <canvas ref={fieldRef} className="absolute inset-0 z-10 block h-full w-full" />

        <div className="pointer-events-none absolute inset-x-0 top-20 z-20 flex flex-col items-center gap-2 px-6 text-center">
          <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-[#fdfaf6]/45">
            What we craft
          </span>
          <h2 className="font-display text-[clamp(22px,2.5vw,34px)] leading-none text-[#fdfaf6]/90">
            Our Primary Services
          </h2>
        </div>

        <div className="pointer-events-none absolute inset-0 z-20">
          {services.map((service, i) => {
            const left = i % 2 === 0;
            return (
              <div
                key={service.n}
                ref={(el) => {
                  if (el) textRefs.current[i] = el;
                }}
                className={[
                  "absolute top-0 max-w-[520px] will-change-transform",
                  left ? "text-left" : "text-right",
                ].join(" ")}
                style={{ opacity: i === 0 ? 1 : 0 }}
              >
                <div
                  className="mb-5 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.32em] text-[#e8390e]"
                  style={{ justifyContent: left ? "flex-start" : "flex-end" }}
                >
                  <span className="inline-block h-px w-8 bg-[#e8390e]" />
                  <span>{service.tag}</span>
                </div>
                <h3 className="font-display font-bold leading-[0.95] text-[#fdfaf6] text-[clamp(42px,6vw,92px)]">
                  {service.name}
                </h3>
                <p
                  className="mt-6 max-w-[42ch] font-body text-[15px] leading-[1.6] text-[#fdfaf6]/62 md:text-[17px]"
                  style={{ marginLeft: left ? 0 : "auto" }}
                >
                  {service.desc}
                </p>
              </div>
            );
          })}
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex items-center justify-between px-8 pb-8 font-mono text-[10px] uppercase tracking-[0.3em] text-[#fdfaf6]/38 md:px-12">
          <span>— Services</span>
          <span className="hidden md:inline-block">Move through space ↓</span>
          <span>{String(services.length).padStart(2, "0")} fields</span>
        </div>
      </div>
    </section>
  );
}