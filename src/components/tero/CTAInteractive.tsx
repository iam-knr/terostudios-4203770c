import { useRef, useState, type MouseEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";

const intents = [
  {
    key: "brand-film",
    label: "Brand Film",
    headline: "a cinematic brand film",
    desc: "Story-led films that make your brand feel alive on screen.",
    meta: "4–8 weeks · From concept to master",
  },
  {
    key: "explainer",
    label: "3D Explainer",
    headline: "a 3D product explainer",
    desc: "Crystal-clear motion that turns complex products into instant clarity.",
    meta: "3–6 weeks · Modelling · Animation · Sound",
  },
  {
    key: "ad",
    label: "Ad Campaign",
    headline: "an ad campaign that lands",
    desc: "Short-form work tuned for social, OTT and broadcast.",
    meta: "2–5 weeks · 6s · 15s · 30s cutdowns",
  },
  {
    key: "title",
    label: "Title Sequence",
    headline: "an unforgettable title sequence",
    desc: "Opening credits and identity systems with editorial intent.",
    meta: "3–7 weeks · Design · Type · Motion",
  },
];

export function CTAInteractive() {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [active, setActive] = useState(0);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    setPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const current = intents[active];

  return (
    <section className="relative bg-cream py-24 md:py-36">
      <div className="container-tero">
        <div
          ref={ref}
          onMouseMove={onMove}
          className="group relative overflow-hidden rounded-[4px] border border-parchment bg-ink text-cream"
          style={{ minHeight: "560px" }}
        >
          {/* Cursor-tracking spotlight */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{
              background: `radial-gradient(420px circle at ${pos.x}% ${pos.y}%, rgba(232,57,14,0.22), transparent 60%)`,
            }}
          />

          {/* Background grid */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage:
                "linear-gradient(to right, #fdfaf6 1px, transparent 1px), linear-gradient(to bottom, #fdfaf6 1px, transparent 1px)",
              backgroundSize: "64px 64px",
            }}
          />

          {/* Floating sparkles that follow cursor */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 text-vermillion/70"
            animate={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            transition={{ type: "spring", stiffness: 60, damping: 18 }}
          >
            <Sparkles className="h-5 w-5" />
          </motion.div>

          <div className="relative z-10 grid gap-12 p-8 md:p-14 lg:grid-cols-[1.4fr_1fr] lg:p-20">
            {/* Left — headline */}
            <div className="flex flex-col justify-between gap-10">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-cream/55">
                  ◐ Let&apos;s collaborate / 2026
                </p>

                <h2 className="mt-6 font-display font-extrabold leading-[0.95] tracking-tight text-[clamp(40px,6vw,84px)]">
                  Let&apos;s build
                  <br />
                  <span className="inline-block">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={current.key}
                        initial={{ y: 28, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -28, opacity: 0 }}
                        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                        className="text-vermillion italic"
                      >
                        {current.headline}
                      </motion.span>
                    </AnimatePresence>
                  </span>
                  <br />
                  together.
                </h2>

                <AnimatePresence mode="wait">
                  <motion.p
                    key={current.key + "-desc"}
                    initial={{ y: 12, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -8, opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="mt-8 max-w-lg font-body text-[15px] leading-relaxed text-cream/70"
                  >
                    {current.desc}
                  </motion.p>
                </AnimatePresence>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4">
                <a
                  href="#contact"
                  className="group/btn inline-flex items-center gap-3 rounded-full bg-vermillion px-7 py-4 font-mono text-[12px] uppercase tracking-[0.25em] text-white transition-all hover:bg-[color:var(--accent-vermillion-deep)] hover:gap-5"
                >
                  Start the brief
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:rotate-45" />
                </a>
                <a
                  href="#work"
                  className="inline-flex items-center gap-3 rounded-full border border-cream/30 px-7 py-4 font-mono text-[12px] uppercase tracking-[0.25em] text-cream transition-colors hover:border-cream hover:bg-cream hover:text-ink"
                >
                  See the reel
                </a>
                <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-cream/45">
                  {current.meta}
                </p>
              </div>
            </div>

            {/* Right — interactive intent picker */}
            <div className="flex flex-col gap-3">
              <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-cream/45">
                ▸ What are we making?
              </p>
              <ul className="flex flex-col gap-2">
                {intents.map((it, i) => {
                  const isActive = i === active;
                  return (
                    <li key={it.key}>
                      <button
                        type="button"
                        onMouseEnter={() => setActive(i)}
                        onFocus={() => setActive(i)}
                        onClick={() => setActive(i)}
                        className={`group/row relative flex w-full items-center justify-between gap-6 border-b border-cream/10 py-5 text-left transition-colors ${
                          isActive ? "text-cream" : "text-cream/55 hover:text-cream"
                        }`}
                      >
                        <span className="flex items-center gap-4">
                          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-vermillion">
                            / 0{i + 1}
                          </span>
                          <span className="font-display text-[clamp(22px,2.4vw,32px)] leading-none">
                            {it.label}
                          </span>
                        </span>
                        <span
                          className={`relative h-px w-10 overflow-hidden bg-cream/15 transition-all ${
                            isActive ? "w-20" : ""
                          }`}
                        >
                          {isActive && (
                            <motion.span
                              layoutId="cta-indicator"
                              className="absolute inset-0 bg-vermillion"
                            />
                          )}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* Bottom meta strip */}
          <div className="relative z-10 flex items-center justify-between border-t border-cream/10 px-8 py-5 md:px-14 lg:px-20 font-mono text-[10px] uppercase tracking-[0.3em] text-cream/45">
            <span>● Replies within 24 hrs</span>
            <span>hello@terostudios.in</span>
          </div>
        </div>
      </div>
    </section>
  );
}
