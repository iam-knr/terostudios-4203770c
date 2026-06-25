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
  accent?: boolean;
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
    accent: true,
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
  {
    quote:
      "End-to-end craft — concept, motion, finish. The kind of studio partner you keep on speed dial for every launch window.",
    name: "Studio Partner",
    role: "Creative Director",
    company: "Tero Collaborator",
    logo: bhimaLogo.url,
    project: "Ongoing",
  },
];

export function Testimonials() {
  return (
    <section
      data-nav-theme="dark"
      className="relative overflow-hidden bg-[#101010] text-cream"
    >
      <div className="container-tero relative py-10 md:py-14">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="overline text-vermillion">— Client response</p>
            <h2 className="mt-3 hero-headline text-[clamp(24px,3.4vw,42px)] leading-[1.02] text-cream">
              Trusted by brands that move culture.
            </h2>
          </div>
          <p className="max-w-sm font-body text-sm leading-relaxed text-cream/50">
            Campaign craft, launch visuals and immersive motion systems built with studio precision.
          </p>
        </div>

        <div className="mt-7 grid grid-cols-1 min-[560px]:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {items.map((item, i) => (
            <Card key={`${item.name}-${i}`} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}


function Card({ item }: { item: Testimonial; index: number }) {
  const accent = item.accent;
  return (
    <article
      className={[
        "group relative flex h-full flex-col justify-between",
        "bg-[#1E1E1E] p-4 md:p-5 min-h-[178px]",
        "border-l-2 transition-colors duration-300",
        accent
          ? "border-[#FF4A1C]/70"
          : "border-white/5 hover:border-vermillion/50",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-4">
        <img
          src={item.logo}
          alt={`${item.company} logo`}
          loading="eager"
          decoding="sync"
          className="h-6 md:h-7 max-w-[104px] w-auto object-contain object-left opacity-90"
        />
        <span
          className={[
            "shrink-0 px-2 py-1 font-mono text-[8px] uppercase tracking-[0.14em]",
            accent
              ? "bg-[#FF4A1C]/10 text-[#FF4A1C]"
              : "bg-white/5 text-cream/45",
          ].join(" ")}
        >
          {item.project}
        </span>
      </div>


        <blockquote className="mt-4 font-display text-[13px] md:text-[14px] leading-[1.45] text-cream/95">
          &ldquo;{item.quote}&rdquo;
        </blockquote>

        <div className="mt-4 border-t border-white/10 pt-3">
          <p className="font-sans-display text-[12px] font-bold uppercase tracking-wider text-cream">
            {item.name}
          </p>
          <p className="mt-0.5 font-body text-[11px] text-cream/55">
            {item.role} · {item.company}
          </p>
        </div>
    </article>

  );
}
