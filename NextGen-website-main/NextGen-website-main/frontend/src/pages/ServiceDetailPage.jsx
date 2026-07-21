import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FadeIn } from "@/components/site/Motion";
import { SERVICES } from "@/data/services";
import { api } from "@/lib/api";
import { ArrowUpRight, Plus, Minus } from "lucide-react";

export default function ServiceDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const service = SERVICES.find((s) => s.slug === slug);
  const [openFaq, setOpenFaq] = useState(-1);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    if (!service) return;
    api.get("/projects").then(({ data }) => setRelated(data.slice(0, 3))).catch(() => {});
  }, [service]);

  if (!service) {
    return (
      <div className="ngi-container pt-40 pb-24" data-testid="service-not-found">
        <h1 className="ngi-page-title max-w-none">Service not found.</h1>
        <button onClick={() => navigate("/services")} className="mt-8 ngi-button-secondary">Back to services</button>
      </div>
    );
  }

  const idx = SERVICES.findIndex((s) => s.slug === slug);
  const next = SERVICES[(idx + 1) % SERVICES.length];

  return (
    <div data-testid="service-detail-page" className="pt-28">
      <section className="ngi-container pt-8 pb-12">
        <Link to="/services" className="text-[10px] tracking-[0.22em] uppercase text-[#707070] ngi-link-underline">← All services</Link>
      </section>

      <section className="ngi-container grid grid-cols-1 md:grid-cols-12 gap-10 items-end mb-16">
        <FadeIn className="md:col-span-7">
          <div className="ngi-overline mb-4"><span className="ngi-rule" />Service · 0{idx + 1}</div>
          <h1 className="ngi-page-title max-w-none">{service.title}</h1>
        </FadeIn>
        <FadeIn className="md:col-span-4 md:col-start-9" delay={0.1}>
          <p className="ngi-page-body">{service.short}</p>
        </FadeIn>
      </section>

      <section className="ngi-container mb-24">
        <FadeIn>
          <div className="aspect-[16/9] ngi-image-zoom">
            <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
          </div>
        </FadeIn>
      </section>

      <section className="ngi-container grid grid-cols-1 md:grid-cols-12 gap-12 mb-24 md:mb-32">
        <FadeIn className="md:col-span-5">
          <div className="ngi-overline mb-4"><span className="ngi-rule" />Overview</div>
          <h2 className="ngi-section-heading">What you get when you work with us on this.</h2>
        </FadeIn>
        <FadeIn className="md:col-span-6 md:col-start-7" delay={0.1}>
          <p className="ngi-page-body">{service.overview}</p>
          <ul className="mt-10 space-y-4">
            {service.benefits.map((b, i) => (
              <li key={i} className="flex gap-4 border-t border-[#171717]/10 pt-4">
                <span className="text-[#C8A46A] font-serif text-xl">0{i + 1}</span>
                <span className="text-[#1E1E1E]/85">{b}</span>
              </li>
            ))}
          </ul>
        </FadeIn>
      </section>

      <section className="bg-[#E7E2DA]/40">
        <div className="ngi-container ngi-section">
          <FadeIn className="mb-12">
            <div className="ngi-overline mb-4"><span className="ngi-rule" />Process</div>
            <h2 className="ngi-section-heading">How a {service.title.toLowerCase()} project moves.</h2>
          </FadeIn>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {service.process.map((p, i) => (
              <FadeIn key={p} delay={i * 0.04} className="border-t border-[#171717]/20 pt-4">
                <div className="text-[10px] tracking-[0.22em] uppercase text-[#707070]">Step {String(i + 1).padStart(2, "0")}</div>
                <div className="font-serif text-xl md:text-2xl mt-2">{p}</div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="ngi-section ngi-container">
        <FadeIn className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">
          <div className="md:col-span-5">
            <div className="ngi-overline mb-4"><span className="ngi-rule" />Common questions</div>
            <h2 className="ngi-section-heading">Questions about this service.</h2>
          </div>
        </FadeIn>
        <div className="max-w-3xl border-t border-[#171717]/15">
          {service.faqs.map((f, i) => (
            <div key={i} className="border-b border-[#171717]/15">
              <button
                onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                data-testid={`service-faq-${i}`}
                className="w-full flex items-center justify-between py-6 text-left"
              >
                <h3 className="font-serif text-xl md:text-2xl font-light pr-8">{f.q}</h3>
                {openFaq === i ? <Minus size={20} className="text-[#C8A46A]" /> : <Plus size={20} className="text-[#C8A46A]" />}
              </button>
              <div
                className="grid transition-all duration-300 ease-in-out"
                style={{
                  gridTemplateRows: openFaq === i ? "1fr" : "0fr",
                  opacity: openFaq === i ? 1 : 0,
                }}
              >
                <div className="overflow-hidden">
                  <p className="pb-6 text-[#1E1E1E]/80 leading-relaxed">{f.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {related.length > 0 && (
        <section className="ngi-section ngi-container">
          <FadeIn className="mb-12">
            <div className="ngi-overline mb-4"><span className="ngi-rule" />Related projects</div>
            <h2 className="font-serif text-4xl md:text-5xl font-light">Recently from the studio.</h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {related.map((p) => (
              <Link key={p.slug} to={`/portfolio/${p.slug}`} className="group block">
                <div className="aspect-[4/5] ngi-image-zoom">
                  <img src={p.cover_image} alt={p.title} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <h3 className="mt-5 font-serif text-2xl">{p.title}</h3>
                <div className="text-[10px] tracking-[0.22em] uppercase text-[#707070] mt-2">{p.category} · {p.location}</div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="ngi-section ngi-container">
        <Link to={`/services/${next.slug}`} className="group block border-t border-[#171717]/15 pt-10">
          <div className="ngi-overline mb-4 text-[#707070]"><span className="ngi-rule" />Next service</div>
          <div className="flex items-end justify-between">
            <h3 className="font-serif text-4xl md:text-6xl font-light group-hover:text-[#707070] transition-colors">{next.title}</h3>
            <ArrowUpRight size={28} className="group-hover:text-[#C8A46A] transition-colors" />
          </div>
        </Link>
      </section>

      <section className="ngi-section ngi-container">
        <div className="bg-[#171717] text-white p-12 md:p-20 ngi-grain">
          <h2 className="ngi-section-heading max-w-2xl">Have a brief? Let's talk it through.</h2>
          <Link to="/consultation" className="inline-flex mt-8 ngi-button-accent">
            Book Consultation →
          </Link>
        </div>
      </section>
    </div>
  );
}
