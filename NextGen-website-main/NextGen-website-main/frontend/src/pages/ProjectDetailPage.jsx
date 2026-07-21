import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowUpRight, Quote } from "lucide-react";
import { api } from "@/lib/api";
import { FadeIn } from "@/components/site/Motion";

export default function ProjectDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [all, setAll] = useState([]);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.18]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.9], [1, 0.2]);

  useEffect(() => {
    setProject(null);
    api.get(`/projects/${slug}`).then(({ data }) => setProject(data)).catch(() => {});
    api.get("/projects").then(({ data }) => setAll(data)).catch(() => {});
  }, [slug]);

  if (!project) {
    return (
      <div className="ngi-container pt-40 pb-24" data-testid="project-loading">
        <p className="text-[#1E1E1E]/60">Loading the project…</p>
      </div>
    );
  }

  const idx = all.findIndex((p) => p.slug === project.slug);
  const next = idx >= 0 ? all[(idx + 1) % all.length] : null;

  return (
    <div data-testid="project-detail-page">
      <section ref={heroRef} className="relative h-[88vh] min-h-[560px] overflow-hidden bg-[#171717]">
        <motion.div style={{ scale: heroScale, opacity: heroOpacity }} className="absolute inset-0">
          <img 
            src={`${project.cover_image}?auto=compress&w=1920&q=80`} 
            alt={project.title} 
            className="w-full h-full object-cover" 
            fetchpriority="high"
            loading="eager"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#171717]/30 via-transparent to-[#171717]/70" />
        </motion.div>
        <div className="relative h-full ngi-container flex flex-col justify-end pb-16 md:pb-24 text-white">
          <FadeIn>
            <div className="ngi-overline text-[#C8A46A] mb-6"><span className="ngi-rule" />{project.category} · {project.year}</div>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-light tracking-tighter leading-[0.98] max-w-5xl">
              {project.title}
            </h1>
            <div className="mt-6 text-white/70">{project.location}</div>
          </FadeIn>
        </div>
      </section>

      <section className="ngi-container ngi-section grid grid-cols-2 md:grid-cols-4 gap-8 border-b border-[#171717]/10">
        {[
          { l: "Location", v: project.location },
          { l: "Area", v: project.area },
          { l: "Year", v: project.year },
          { l: "Duration", v: project.duration },
        ].map((it, i) => (
          <FadeIn key={i} delay={i * 0.05}>
            <div className="ngi-page-label">{it.l}</div>
            <div className="font-serif text-2xl md:text-3xl mt-2">{it.v}</div>
          </FadeIn>
        ))}
      </section>

      <section data-testid="project-overview" className="ngi-section ngi-container grid grid-cols-1 md:grid-cols-12 gap-10">
        <FadeIn className="md:col-span-5">
          <div className="ngi-overline mb-4"><span className="ngi-rule" />Overview</div>
          <h2 className="ngi-section-heading">A short note on the project.</h2>
        </FadeIn>
        <FadeIn className="md:col-span-6 md:col-start-7" delay={0.1}>
          <p className="ngi-page-body">{project.overview}</p>
        </FadeIn>
      </section>

      {project.gallery?.[0] && (
        <section className="ngi-container">
          <FadeIn>
            <div className="aspect-[16/9] ngi-image-zoom">
              <img src={`${project.gallery[0]}?auto=compress&w=1200&q=75`} alt="" className="w-full h-full object-cover" loading="lazy" decoding="async" />
            </div>
          </FadeIn>
        </section>
      )}

      <section className="bg-[#E7E2DA]/40 mt-24 md:mt-32" data-testid="project-challenge">
        <div className="ngi-container ngi-section grid grid-cols-1 md:grid-cols-12 gap-10">
          <FadeIn className="md:col-span-5">
            <div className="ngi-overline mb-4"><span className="ngi-rule" />The Challenge</div>
            <h2 className="ngi-section-heading">What we set out to solve.</h2>
          </FadeIn>
          <FadeIn className="md:col-span-6 md:col-start-7" delay={0.1}>
            <p className="ngi-page-body">{project.challenge}</p>
          </FadeIn>
        </div>
      </section>

      <section data-testid="project-concept" className="ngi-section ngi-container grid grid-cols-1 md:grid-cols-12 gap-10">
        <FadeIn className="md:col-span-5">
          <div className="ngi-overline mb-4"><span className="ngi-rule" />Design Concept</div>
          <h2 className="ngi-section-heading">The one idea behind it all.</h2>
        </FadeIn>
        <FadeIn className="md:col-span-6 md:col-start-7" delay={0.1}>
          <p className="ngi-page-body">{project.concept}</p>
          {project.materials?.length > 0 && (
            <div className="mt-10 border-t border-[#171717]/15 pt-8" data-testid="project-materials">
              <div className="ngi-overline mb-5"><span className="ngi-rule" />Material palette</div>
              <ul className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
                {project.materials.map((m, i) => (
                  <li key={i} className="text-[#171717]">— {m}</li>
                ))}
              </ul>
            </div>
          )}
        </FadeIn>
      </section>

      {project.gallery?.length > 1 && (
        <section className="ngi-container pb-24 md:pb-32">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
            {project.gallery.slice(1).map((src, i) => (
              <FadeIn
                key={i}
                delay={i * 0.05}
                className={
                  i % 3 === 0 ? "md:col-span-7" :
                  i % 3 === 1 ? "md:col-span-5 md:mt-20" :
                  "md:col-span-12"
                }
              >
                <div className="ngi-image-zoom">
                  <img
                    src={`${src}?auto=compress&w=1200&q=75`}
                    alt=""
                    className={`w-full ${i % 3 === 2 ? "aspect-[16/9]" : "aspect-[4/5]"} object-cover`}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </FadeIn>
            ))}
          </div>
        </section>
      )}

      {project.timeline_phases?.length > 0 && (
        <section className="bg-[#171717] text-white" data-testid="project-timeline">
          <div className="ngi-container ngi-section">
            <FadeIn className="mb-12">
              <div className="ngi-overline mb-4 text-[#C8A46A]"><span className="ngi-rule" />Execution Timeline</div>
              <h2 className="font-serif text-4xl md:text-5xl font-light">{project.duration}, phased.</h2>
            </FadeIn>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-10">
              {project.timeline_phases.map((ph, i) => (
                <FadeIn key={i} delay={i * 0.05} className="border-t border-white/20 pt-5">
                  <div className="text-[10px] tracking-[0.22em] uppercase text-[#C8A46A]">Phase {String(i + 1).padStart(2, "0")}</div>
                  <h3 className="font-serif text-2xl mt-3">{ph.phase}</h3>
                  <div className="text-sm text-white/60 mt-2">{ph.duration}</div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {project.testimonial_quote && (
        <section className="ngi-section ngi-container" data-testid="project-testimonial">
          <FadeIn className="max-w-4xl">
            <Quote size={40} className="text-[#C8A46A] mb-8" strokeWidth={1} />
            <p className="font-serif text-3xl md:text-5xl font-light leading-snug">"{project.testimonial_quote}"</p>
            <div className="mt-8 text-[11px] tracking-[0.22em] uppercase text-[#707070]">— {project.testimonial_author}</div>
          </FadeIn>
        </section>
      )}

      {next && (
        <section className="ngi-section ngi-container" data-testid="project-next-nav">
          <Link to={`/portfolio/${next.slug}`} className="group block border-t border-[#171717]/15 pt-10">
            <div className="ngi-overline mb-4 text-[#707070]"><span className="ngi-rule" />Next Project</div>
            <div className="flex items-end justify-between">
              <h3 className="font-serif text-4xl md:text-6xl font-light group-hover:text-[#707070] transition-colors max-w-2xl">{next.title}</h3>
              <ArrowUpRight size={28} className="group-hover:text-[#C8A46A] transition-colors" />
            </div>
          </Link>
        </section>
      )}

      <section className="ngi-section ngi-container">
        <button onClick={() => navigate("/portfolio")} className="ngi-button-secondary">← All projects</button>
      </section>
    </div>
  );
}
