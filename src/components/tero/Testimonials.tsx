import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import bhimaLogo from "@/assets/client-logos-white/bhima.png.asset.json";
import forumLogo from "@/assets/client-logos-white/forum.png.asset.json";
import luluLogo from "@/assets/client-logos-white/lulu.png.asset.json";
import stEngLogo from "@/assets/client-logos-white/steng.png.asset.json";
import shotLogo from "@/assets/client-logos-white/shot.png.asset.json";

type Testimonial = {
  quote: string;
  name: string;
  role: string;
  company: string;
  logo: string;
  project: string;
};

const items: Testimonial[] = [
  {
    quote:
      "For our Vara Mahalakshmi 2025 campaign, Tero Studios crafted an anamorphic video that perfectly merged tradition with innovation.",
    name: "Sibi Jacob",
    role: "Brand Manager",
    company: "Bhima Gold",
    logo: bhimaLogo.url,
    project: "Vara Mahalakshmi",
  },
  {
    quote:
      "Fresh ideas, creative execution, and engaging visual experiences that truly connected with our audience — handled with precision.",
    name: "Athira Nampiathiri",
    role: "Sr. Marketing Manager",
    company: "Forum Mall",
    logo: forumLogo.url,
    project: "Mall Campaign",
  },
  {
    quote:
      "An exceptional AR broadcast for our Onam celebrations. Creativity and flawless execution gave visitors a truly immersive experience.",
    name: "Hari Suhas",
    role: "General Manager",
    company: "Lulu Mall Kochi",
    logo: luluLogo.url,
    project: "Onam · AR",
  },
  {
    quote:
      "The anamorphic content for IMTEX 2025 and ACMEE 2025 helped us stand out with powerful visuals and high-impact brand presence.",
    name: "Ravivarman R",
    role: "Marketing Head",
    company: "S&T Engineers",
    logo: stEngLogo.url,
    project: "IMTEX · ACMEE",
  },
  {
    quote:
      "Working on the Campa Cola TVC and Mumbai launch was seamless. Their frame-by-frame animation elevated the campaign.",
    name: "Neha Gowda",
    role: "Producer",
    company: "Shot Ready",
    logo: shotLogo.url,
    project: "Campa Cola · TVC",
  },
];

export function Testimonials() {
  const [i, setI] = useState(0);
  const total = items.length;
  const item = items[i];

  const go = (dir: 1 | -1) => setI((p) => (p + dir + total) % total);

  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % total), 7000);
    return () => clearInterval(t);
  }, [total]);

  return (
    <section
      data-nav-theme="dark"
      className="relative overflow-hidden bg-[#101010] text-cream"
    >
      <div className="container-tero relative py-16 md:py-24">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12 md:mb-16">
          <div>
            <p className="overline text-vermillion">— Client response</p>
            <h2 className="mt-3 hero-headline text-[clamp(32px,4.5vw,56px)] leading-[0.98] text-cream">
              Portfolio of <span className="italic font-light text-cream/70">Consensus</span>
            </h2>
          </div>
          <div className="text-left md:text-right">
            <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-cream/40 mb-1">
              Series
            </p>
            <p className="font-display text-3xl tabular-nums">
              <span className="text-cream">{String(i + 1).padStart(3, "0")}</span>
              <span className="text-cream/30">, {String(total).padStart(3, "0")}</span>
            </p>
          </div>
        </div>

        <div className="h-px w-full bg-cream/10 mb-12 md:mb-16" />

        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,280px)_1fr_auto] gap-10 md:gap-16 items-center min-h-[280px]">
          {/* Logo */}
          <div className="relative h-20 md:h-24 flex items-center md:justify-start">
            <AnimatePresence mode="wait">
              <motion.img
                key={item.logo}
                src={item.logo}
                alt={`${item.company} logo`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="max-h-20 md:max-h-24 w-auto max-w-[220px] object-contain object-left brightness-0 invert opacity-90"
              />
            </AnimatePresence>
          </div>

          {/* Quote + author */}
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <blockquote className="font-display text-[clamp(18px,2vw,28px)] leading-[1.35] text-cream/95">
                  &ldquo;{item.quote}&rdquo;
                </blockquote>
                <div className="mt-8 flex items-center gap-4">
                  <div className="h-11 w-11 rounded-full bg-vermillion/20 border border-vermillion/40 flex items-center justify-center text-vermillion font-display text-base">
                    {item.name.split(" ").map((s) => s[0]).slice(0, 2).join("")}
                  </div>
                  <div>
                    <p className="font-sans-display text-sm font-bold uppercase tracking-wider text-cream">
                      {item.name}
                    </p>
                    <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.2em] text-cream/55">
                      {item.role} · {item.company}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Arrows */}
          <div className="flex md:flex-col items-center gap-3 md:gap-4">
            <button
              onClick={() => go(-1)}
              aria-label="Previous testimonial"
              className="h-12 w-12 md:h-14 md:w-14 rounded-full border border-cream/20 flex items-center justify-center text-cream/80 hover:bg-cream hover:text-ink transition-colors"
            >
              ←
            </button>
            <button
              onClick={() => go(1)}
              aria-label="Next testimonial"
              className="h-12 w-12 md:h-14 md:w-14 rounded-full border border-cream/20 flex items-center justify-center text-cream/80 hover:bg-cream hover:text-ink transition-colors"
            >
              →
            </button>
          </div>
        </div>

        {/* Footer: dots + counter */}
        <div className="mt-12 md:mt-16 flex items-center justify-between gap-6 border-t border-cream/10 pt-6">
          <div className="flex items-center gap-2.5">
            {items.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setI(idx)}
                aria-label={`Go to testimonial ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  idx === i ? "w-8 bg-vermillion" : "w-2 bg-cream/20 hover:bg-cream/40"
                }`}
              />
            ))}
          </div>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-cream/45">
            File {String(i + 1).padStart(2, "0")} of {String(total).padStart(2, "0")}
          </p>
        </div>
      </div>
    </section>
  );
}
