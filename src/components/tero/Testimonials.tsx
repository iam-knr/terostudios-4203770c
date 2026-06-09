import { Reveal, RevealGroup, RevealItem } from "./Reveal";
import { Quote } from "lucide-react";
import bhima from "@/assets/Bhima_Gold.png.asset.json";
import forum from "@/assets/Fourm_mall.png.asset.json";
import lulu from "@/assets/Lulu_Mall.png.asset.json";
import stEng from "@/assets/S_T_Engineering.png.asset.json";
import shot from "@/assets/Shot_ready.png.asset.json";

const t = [
  {
    quote:
      "For our Vara Mahalakshmi 2025 campaign, Tero Studios crafted an anamorphic video that perfectly merged tradition with innovation, making a strong impact on our audience.",
    name: "Sibi Jacob",
    role: "Brand Manager, Bhima Gold",
    avatar: bhima.url,
  },
  {
    quote:
      "Their team brought fresh ideas, creative execution, and engaging visual experiences that truly connected with our audience. From concept to delivery, everything was handled with professionalism and precision.",
    name: "Athira Nampiathiri",
    role: "Senior Marketing Manager, Forum Mall",
    avatar: forum.url,
  },
  {
    quote:
      "Tero Studios delivered an exceptional AR broadcast for our Onam celebrations. Their creativity and flawless execution gave visitors a truly immersive festive experience.",
    name: "Hari Suhas",
    role: "General Manager, Lulu Mall Kochi",
    avatar: lulu.url,
  },
  {
    quote:
      "The anamorphic video content created by Tero Studios for IMTEX 2025 and ACMEE 2025 helped us stand out with powerful visuals and high-impact brand presence.",
    name: "Ravivarman R",
    role: "Marketing Head, S&T Engineers",
    avatar: stEng.url,
  },
  {
    quote:
      "Working with Tero Studios on the Campa Cola TVC and Mumbai launch video was seamless. Their frame-by-frame animation and creative approach elevated the campaign.",
    name: "Neha Gowda",
    role: "Producer, Shot Ready",
    avatar: shot.url,
  },
];

export function Testimonials() {
  return (
    <section data-nav-theme="dark" className="bg-ink text-cream">
      <div className="container-tero py-24 md:py-40">
        <Reveal>
          <p className="overline text-vermillion">— Portfolio of consensus</p>
          <h2 className="mt-6 hero-headline text-[clamp(40px,7vw,96px)] text-cream max-w-4xl">
            What clients have to say <br /> after the lights come up.
          </h2>
        </Reveal>

        <RevealGroup className="mt-20 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {t.map((q, i) => (
            <RevealItem
              key={i}
              className="relative flex flex-col gap-8 rounded-2xl border border-white/10 bg-white/[0.03] p-8 pt-16 backdrop-blur-sm"
            >
              <div className="absolute -top-10 left-1/2 -translate-x-1/2">
                <div className="h-20 w-20 overflow-hidden rounded-full border-2 border-cream bg-ink">
                  <img
                    src={q.avatar}
                    alt={q.name}
                    width={160}
                    height={160}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
              <Quote className="h-6 w-6 text-vermillion" strokeWidth={1.5} />
              <p className="font-display text-[clamp(18px,1.6vw,22px)] leading-snug text-cream not-italic">
                &ldquo;{q.quote}&rdquo;
              </p>
              <div className="mt-auto border-t border-white/10 pt-6 text-center">
                <p className="font-sans-display text-[16px] font-bold uppercase tracking-wide text-cream">
                  {q.name}
                </p>
                <p className="mt-1 font-body text-[13px] text-cream/60">{q.role}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
