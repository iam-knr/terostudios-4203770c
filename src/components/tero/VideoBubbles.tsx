import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import p1 from "@/assets/portfolio-1.jpg";
import p2 from "@/assets/portfolio-2.jpg";
import p3 from "@/assets/portfolio-3.jpg";
import p4 from "@/assets/portfolio-4.jpg";
import p5 from "@/assets/portfolio-5.jpg";
import p6 from "@/assets/portfolio-6.jpg";

/** Bubble layout (percent of stage). Arranged in an organic cluster. */
type Bubble = {
  img: string;
  /** center x in % */
  x: number;
  /** center y in % */
  y: number;
  /** diameter in vmin */
  size: number;
  /** which side it slides in from */
  from: "left" | "right" | "top" | "bottom";
  /** float bobbing duration */
  bob: number;
  /** entry delay seconds */
  delay: number;
  label: string;
};

const bubbles: Bubble[] = [
  { img: p1, x: 14, y: 32, size: 22, from: "left",   bob: 6.5, delay: 0.05, label: "Refraction" },
  { img: p2, x: 30, y: 70, size: 18, from: "left",   bob: 7.2, delay: 0.18, label: "Editorial Set" },
  { img: p3, x: 50, y: 28, size: 28, from: "top",    bob: 8.0, delay: 0.0,  label: "Mr. Sprout" },
  { img: p4, x: 50, y: 78, size: 20, from: "bottom", bob: 6.8, delay: 0.22, label: "Onboarding" },
  { img: p5, x: 70, y: 60, size: 24, from: "right",  bob: 7.6, delay: 0.1,  label: "Ember" },
  { img: p6, x: 86, y: 30, size: 19, from: "right",  bob: 6.2, delay: 0.16, label: "Quiet Vessels" },
];

const offscreen = (b: Bubble) => {
  switch (b.from) {
    case "left":   return { x: -700, y: 60,  rotate: -18, opacity: 0 };
    case "right":  return { x: 700,  y: -40, rotate: 18,  opacity: 0 };
    case "top":    return { x: 0,    y: -500, rotate: -10, opacity: 0 };
    case "bottom": return { x: 0,    y: 500,  rotate: 10,  opacity: 0 };
  }
};

export function VideoBubbles() {
  return (
    <section className="relative w-full bg-cream py-24 md:py-32 overflow-hidden">
      {/* hairlines */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-6 md:left-12 w-px h-full bg-ink/[0.06]" />
        <div className="absolute top-0 right-6 md:right-12 w-px h-full bg-ink/[0.06]" />
      </div>

      <div className="container-tero relative">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink/40 mb-4">
              — Selected work
            </p>
            <h2 className="font-display font-extrabold uppercase tracking-tighter text-ink text-[clamp(40px,7vw,110px)] leading-[0.9]">
              Moments <span className="italic font-normal text-vermillion">in motion.</span>
            </h2>
          </div>
          <Link
            to="/portfolio"
            className="self-start md:self-end inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-ink border-b border-ink pb-1 hover:text-vermillion hover:border-vermillion transition-colors"
          >
            View all projects →
          </Link>
        </div>

        {/* Bubble stage */}
        <div className="relative w-full" style={{ height: "min(90vh, 780px)" }}>
          {bubbles.map((b, i) => (
            <motion.div
              key={i}
              initial={offscreen(b)}
              whileInView={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{
                type: "spring",
                stiffness: 60,
                damping: 14,
                mass: 1.2,
                delay: b.delay,
              }}
              className="absolute"
              style={{
                left: `${b.x}%`,
                top: `${b.y}%`,
                width: `${b.size}vmin`,
                height: `${b.size}vmin`,
                transform: "translate(-50%, -50%)",
              }}
            >
              {/* Continuous float bob */}
              <motion.div
                animate={{ y: [0, -14, 0, 10, 0] }}
                transition={{ duration: b.bob, repeat: Infinity, ease: "easeInOut" }}
                className="w-full h-full"
              >
                <BubbleLink b={b} />
              </motion.div>
            </motion.div>
          ))}

          {/* Faint vermillion glow blobs to add depth */}
          <div
            aria-hidden
            className="pointer-events-none absolute -z-0 left-[40%] top-[55%] w-[55vmin] h-[55vmin] rounded-full blur-3xl opacity-30"
            style={{ background: "radial-gradient(circle, #E8390E 0%, transparent 65%)" }}
          />
        </div>
      </div>
    </section>
  );
}

function BubbleLink({ b }: { b: Bubble }) {
  return (
    <Link
      to="/portfolio"
      className="group relative block w-full h-full rounded-full overflow-hidden shadow-[0_30px_70px_-25px_rgba(20,20,30,0.45)] ring-1 ring-ink/10 will-change-transform transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.08]"
    >
      {/* When you have video files, swap <img> for <video src=... autoPlay loop muted playsInline /> */}
      <img
        src={b.img}
        alt={b.label}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      {/* Tint */}
      <div className="absolute inset-0 bg-ink/15 group-hover:bg-ink/5 transition-colors duration-500" />

      {/* Hover ring */}
      <div className="absolute inset-1 rounded-full ring-1 ring-cream/30 group-hover:ring-cream/60 transition-all" />

      {/* Hover label + play icon */}
      <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="w-12 h-12 rounded-full border border-cream/70 backdrop-blur-sm flex items-center justify-center mb-3 bg-ink/30">
          <span className="block w-0 h-0 border-t-[7px] border-t-transparent border-l-[11px] border-l-cream border-b-[7px] border-b-transparent ml-1" />
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-cream">
          {b.label}
        </span>
      </div>
    </Link>
  );
}
