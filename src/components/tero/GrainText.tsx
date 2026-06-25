import { useEffect, useRef } from "react";

/**
 * Renders a text string as a swarm of brand-colored particles that
 * settle into the letter forms and gently breathe. Matches the
 * GrainMorph aesthetic used elsewhere on the site.
 */

const PALETTE = [
  "rgba(245, 240, 226, 0.95)", // cream
  "rgba(245, 240, 226, 0.7)",
  "rgba(232, 57, 14, 0.9)",    // vermillion
  "rgba(255, 95, 40, 0.8)",    // vermillion-light
  "rgba(196, 154, 60, 0.85)",  // amber
  "rgba(218, 160, 110, 0.75)",
];

export function GrainText({
  text,
  className,
  style,
  weight = 800,
  family = "'Coolvetica Rg Cond', 'Clash Display', sans-serif",
  density = 2.6,
}: {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  weight?: number;
  family?: string;
  density?: number;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const DPR = Math.min(window.devicePixelRatio || 1, 2);

    type P = {
      hx: number; hy: number;
      x: number; y: number;
      vx: number; vy: number;
      size: number; color: string; phase: number;
    };

    let particles: P[] = [];
    let raf = 0;
    const start = performance.now();

    function sampleText(w: number, h: number): { x: number; y: number }[] {
      const sample = document.createElement("canvas");
      const sctx = sample.getContext("2d")!;
      sample.width = w;
      sample.height = h;
      // Fit text to ~85% of width
      let fontSize = h * 0.92;
      sctx.font = `${weight} ${fontSize}px ${family}`;
      let m = sctx.measureText(text);
      const targetW = w * 0.92;
      if (m.width > 0) {
        fontSize *= targetW / m.width;
        fontSize = Math.min(fontSize, h * 0.95);
      }
      sctx.clearRect(0, 0, w, h);
      sctx.fillStyle = "#fff";
      sctx.textAlign = "center";
      sctx.textBaseline = "middle";
      sctx.font = `${weight} ${fontSize}px ${family}`;
      sctx.fillText(text, w / 2, h / 2);
      const data = sctx.getImageData(0, 0, w, h).data;
      const step = Math.max(2, Math.round(Math.min(w, h) / (90 * density)));
      const pts: { x: number; y: number }[] = [];
      for (let y = 0; y < h; y += step) {
        for (let x = 0; x < w; x += step) {
          const i = (y * w + x) * 4;
          if (data[i + 3] > 80) {
            pts.push({
              x: x + (Math.random() - 0.5) * step * 0.7,
              y: y + (Math.random() - 0.5) * step * 0.7,
            });
          }
        }
      }
      return pts;
    }

    function build() {
      const w = wrap!.clientWidth;
      const h = wrap!.clientHeight;
      canvas!.width = w * DPR;
      canvas!.height = h * DPR;
      canvas!.style.width = `${w}px`;
      canvas!.style.height = `${h}px`;
      ctx!.setTransform(DPR, 0, 0, DPR, 0, 0);

      const pts = sampleText(w, h);
      particles = pts.map((p) => {
        const a = Math.random() * Math.PI * 2;
        const r = Math.min(w, h) * (0.3 + Math.random() * 0.5);
        return {
          hx: p.x,
          hy: p.y,
          x: w / 2 + Math.cos(a) * r,
          y: h / 2 + Math.sin(a) * r,
          vx: 0, vy: 0,
          size: 0.8 + Math.random() * 1.6,
          color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
          phase: Math.random() * Math.PI * 2,
        };
      });
    }

    function tick(now: number) {
      const w = canvas!.clientWidth;
      const h = canvas!.clientHeight;
      ctx!.clearRect(0, 0, w, h);
      const t = (now - start) / 1000;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const bob = Math.sin(t * 0.5 + p.phase) * 1.3;
        const sway = Math.cos(t * 0.4 + p.phase * 0.7) * 1.2;
        const tx = p.hx + sway;
        const ty = p.hy + bob;
        const dx = tx - p.x;
        const dy = ty - p.y;
        p.vx = (p.vx + dx * 0.04) * 0.84;
        p.vy = (p.vy + dy * 0.04) * 0.84;
        p.x += p.vx;
        p.y += p.vy;
        ctx!.beginPath();
        ctx!.fillStyle = p.color;
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx!.fill();
      }
      raf = requestAnimationFrame(tick);
    }

    build();
    raf = requestAnimationFrame(tick);
    const onResize = () => build();
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [text, weight, family, density]);

  return (
    <div ref={wrapRef} className={className} style={style} aria-label={text} role="img">
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
