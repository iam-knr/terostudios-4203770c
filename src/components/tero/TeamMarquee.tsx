import { useEffect, useRef, type ReactNode } from "react";
import { Linkedin } from "lucide-react";
import { Reveal } from "./Reveal";

type Person = { name: string; role: string; li?: string };

export function TeamMarquee({
  eyebrow,
  title,
  people,
  featured = false,
}: {
  eyebrow: string;
  title: ReactNode;
  people: Person[];
  featured?: boolean;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const offsetRef = useRef(0);
  const pausedRef = useRef(false);

  // Duplicate list for seamless loop
  const loop = [...people, ...people, ...people];

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const speed = 0.6; // px per frame
    const tick = () => {
      if (!pausedRef.current) {
        offsetRef.current -= speed;
        const half = track.scrollWidth / 3;
        if (-offsetRef.current >= half) offsetRef.current += half;
        track.style.transform = `translate3d(${offsetRef.current}px,0,0)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <section className="relative overflow-hidden bg-ink text-cream">
      {/* starfield */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "radial-gradient(1px 1px at 20% 30%, rgba(255,255,255,0.7), transparent 60%), radial-gradient(1px 1px at 70% 60%, rgba(255,255,255,0.5), transparent 60%), radial-gradient(1.5px 1.5px at 40% 80%, rgba(255,255,255,0.6), transparent 60%), radial-gradient(1px 1px at 85% 20%, rgba(255,255,255,0.5), transparent 60%), radial-gradient(1px 1px at 10% 70%, rgba(255,255,255,0.6), transparent 60%), radial-gradient(1px 1px at 55% 15%, rgba(255,255,255,0.4), transparent 60%)",
          backgroundSize: "600px 600px",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(218,87,55,0.10), transparent 60%)",
        }}
      />

      <div className="container-tero relative z-10 pt-20 md:pt-28">
        <Reveal>
          <p className="overline text-cream/60">{eyebrow}</p>
          <h2 className="mt-6 hero-headline text-[clamp(40px,6vw,80px)] leading-[1] text-cream">
            {title}
          </h2>
        </Reveal>
      </div>

      {/* Marquee */}
      <div
        className="relative z-10 mt-12 md:mt-16 pb-20 md:pb-28"
        onMouseEnter={() => (pausedRef.current = true)}
        onMouseLeave={() => (pausedRef.current = false)}
      >
        {/* edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-32 md:w-64 bg-gradient-to-r from-ink to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-32 md:w-64 bg-gradient-to-l from-ink to-transparent" />

        <div className="overflow-hidden">
          <div
            ref={trackRef}
            className="flex w-max items-center gap-12 md:gap-20 will-change-transform"
          >
            {loop.map((p, i) => {
              const isCenter = featured && i % people.length === 0;
              return (
                <div key={i} className="flex items-center gap-12 md:gap-20 shrink-0">
                  <div
                    className={`group flex flex-col items-center text-center transition-opacity duration-500 ${
                      isCenter ? "opacity-100" : "opacity-40 hover:opacity-100"
                    }`}
                  >
                    <h3 className="font-sans-display font-bold uppercase tracking-tight text-[clamp(56px,9vw,140px)] leading-[0.9] text-cream">
                      {p.name}
                    </h3>
                    <div className="mt-3 flex items-center gap-3 font-body text-[12px] md:text-[14px] text-cream/70">
                      <span>{p.role}</span>
                      <a
                        href={p.li ?? "#"}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`${p.name} on LinkedIn`}
                        className="inline-flex h-6 w-6 items-center justify-center rounded-sm border border-cream/30 text-cream/80 hover:border-vermillion hover:text-vermillion"
                      >
                        <Linkedin className="h-3 w-3" strokeWidth={2} />
                      </a>
                    </div>
                  </div>
                  {/* separator dot */}
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-cream/40" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
