import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { FadeIn } from "@/components/site/Motion";
import { SERVICES } from "@/data/services";

export default function ServicesPage() {
  return (
    <div data-testid="services-page" className="pt-28">
      <section className="ngi-page-hero">
        <FadeIn>
          <div className="ngi-overline mb-6"><span className="ngi-rule" />Services</div>
          <h1 className="ngi-page-title max-w-4xl">
            Ten disciplines, <em className="text-[#707070]">one studio</em>, one standard.
          </h1>
          <p className="mt-8 ngi-page-body max-w-2xl">
            We design and execute residential and commercial interiors under a single contract. Pick the page you are interested in — or speak with us about a brief that spans several.
          </p>
        </FadeIn>
      </section>

      <section className="ngi-container pb-16 md:pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12 md:gap-y-20">
          {SERVICES.map((s, i) => (
            <FadeIn key={s.slug} delay={(i % 2) * 0.08} className={i % 2 === 1 ? "md:mt-24" : ""}>
              <Link to={`/services/${s.slug}`} className="group block" data-testid={`service-card-${s.slug}`}>
                <div className="aspect-[4/3] ngi-image-zoom ngi-panel overflow-hidden mb-6">
                  <img src={s.image} alt={s.title} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div className="ngi-page-label mb-2">0{i + 1}</div>
                <div className="flex items-start justify-between gap-6">
                  <h3 className="font-serif text-3xl md:text-4xl font-light leading-tight group-hover:text-[#707070] transition-colors">{s.title}</h3>
                  <ArrowUpRight className="mt-2 group-hover:text-[#C8A46A] transition-colors" />
                </div>
                <p className="text-[#1E1E1E]/70 mt-4 text-base leading-relaxed max-w-md">{s.short}</p>
              </Link>
            </FadeIn>
          ))}
        </div>
      </section>
    </div>
  );
}
