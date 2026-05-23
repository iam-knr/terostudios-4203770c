import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const stats = [
  { n: "320+", label: "Projects" },
  { n: "48+", label: "Clients" },
  { n: "12", label: "Years" },
  { n: "27", label: "Awards" },
  { n: "5", label: "Studios" },
];

export function StatsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  // Scroll-tied nudge layered on top of the CSS marquee
  const scrollShift = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);

  const Row = () => (
    <div className="flex shrink-0 gap-24 md:gap-32 items-center px-12 md:px-16">
      {stats.map((s, i) => (
        <div key={i} className="group/item flex flex-col items-start gap-2">
          <span className="font-mono text-[10px] tracking-[0.25em] text-vermillion uppercase">
            / 0{i + 1}
          </span>
          <div className="flex items-baseline gap-5">
            <h3
              className="font-display font-extrabold tracking-tighter text-ink leading-none text-[clamp(72px,12vw,180px)] transition-colors duration-500 group-hover/item:text-vermillion"
            >
              {s.n}
            </h3>
            <p className="font-body text-base md:text-xl font-medium text-ink/80 uppercase tracking-wide">
              {s.label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-cream"
    >
      {/* Editorial header */}
      <div className="container-tero pt-20 md:pt-28">
        <div className="flex items-end justify-between gap-6 border-b border-parchment pb-8">
          <div>
            <p className="overline">— By the numbers / 2014–2026</p>
            <h2 className="mt-5 hero-headline text-[clamp(40px,6vw,84px)] max-w-3xl text-ink">
              A decade of frames,
              <br />
              <span className="text-vermillion">shipped</span> with intent.
            </h2>
          </div>
          <p className="hidden md:block max-w-xs font-body text-[14px] leading-relaxed text-slate">
            Numbers we like, but the work is what we&apos;d rather you remember.
            <span className="block mt-3 font-mono text-[11px] uppercase tracking-[0.25em] text-ink/50">
              Vol. 12 · Issue 05
            </span>
          </p>
        </div>
      </div>

      {/* Kinetic film strip */}
      <div className="group relative w-full border-y border-parchment py-16 md:py-24 mt-12 md:mt-20">
        <motion.div
          style={{ x: scrollShift }}
          className="flex whitespace-nowrap will-change-transform animate-[tero-marquee_38s_linear_infinite] group-hover:[animation-play-state:paused]"
        >
          <Row />
          <Row />
        </motion.div>

        {/* edge fades */}
        <div className="absolute inset-y-0 left-0 w-32 md:w-48 bg-gradient-to-r from-cream to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 md:w-48 bg-gradient-to-l from-cream to-transparent z-10 pointer-events-none" />

        {/* corner meta */}
        <div className="absolute top-3 left-6 z-20 font-mono text-[10px] uppercase tracking-[0.3em] text-ink/40">
          ▸ Reel · Stats 2024
        </div>
        <div className="absolute bottom-3 right-6 z-20 font-mono text-[10px] uppercase tracking-[0.3em] text-ink/40">
          Independent since 2014 ●
        </div>
      </div>

      <style>{`
        @keyframes tero-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
