import { memo, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Quote, ChevronDown } from "lucide-react";
import { api } from "@/lib/api";
import { FadeIn } from "@/components/site/Motion";
import BlueprintToReality from "@/components/site/BlueprintToReality";
import { SERVICES } from "@/data/services";

const HERO_IMAGES = [
  "https://images.pexels.com/photos/20418771/pexels-photo-20418771.jpeg",
  "https://images.pexels.com/photos/13201479/pexels-photo-13201479.jpeg",
  "https://images.pexels.com/photos/34538288/pexels-photo-34538288.jpeg",
];

const Hero = memo(function Hero() {
  const ref = useRef(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 220]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 6000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section ref={ref} className="relative h-screen min-h-[680px] overflow-hidden bg-[#171717]" data-testid="home-hero">
      <motion.div style={{ scale, y }} className="absolute inset-0 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.img
            key={HERO_IMAGES[activeSlide]}
            src={HERO_IMAGES[activeSlide]}
            alt="Luxury interior"
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            loading="eager"
            decoding="async"
            fetchPriority="high"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-b from-[#171717]/30 via-[#171717]/10 to-[#171717]/70" />
      </motion.div>

      <motion.div style={{ opacity }} className="relative h-full ngi-container flex flex-col justify-end pb-20 md:pb-28">
        <div className="max-w-4xl">
          <div className="ngi-overline text-[#B38B59] mb-6 ngi-reveal" style={{ animationDelay: "1.6s" }}>
            <span className="ngi-rule" />Interior architecture · Est. 2013
          </div>
          <h1 className="font-serif text-white text-5xl md:text-7xl lg:text-[88px] font-light tracking-tighter leading-[0.95]">
            <span className="block ngi-reveal" style={{ animationDelay: "1.7s" }}>Crafting timeless</span>
            <span className="block italic text-[#B38B59] ngi-reveal" style={{ animationDelay: "1.9s" }}>living spaces</span>
            <span className="block ngi-reveal" style={{ animationDelay: "2.1s" }}>with quiet luxury.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-sm md:text-base leading-7 text-white/75 ngi-reveal" style={{ animationDelay: "2.2s" }}>
            We shape homes and hospitality environments with architectural clarity, tactile materials, and an unwavering commitment to calm, beautiful living.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 items-start ngi-reveal" style={{ animationDelay: "2.5s" }}>
            <Link
              to="/consultation"
              data-testid="hero-primary-cta"
              className="inline-flex items-center gap-3 rounded-full magnetic bg-[#B38B59] text-white hover:bg-[#CFA978] px-8 py-4 text-[11px] tracking-[0.22em] uppercase transition-colors duration-300"
            >
              Book a Consultation <ArrowUpRight size={16} />
            </Link>
            <Link
              to="/portfolio"
              data-testid="hero-secondary-cta"
              className="inline-flex items-center gap-3 rounded-full border border-white/35 text-white hover:bg-[#B38B59] hover:border-[#B38B59] hover:text-white px-8 py-4 text-[11px] tracking-[0.22em] uppercase transition-colors duration-300"
            >
              View Portfolio
            </Link>
          </div>
        </div>
      </motion.div>

      <div
        className="absolute bottom-6 right-6 md:right-12 text-white/70 text-[10px] tracking-[0.3em] uppercase rotate-0 flex items-center gap-3 ngi-reveal"
        style={{ animationDelay: "2.6s" }}
      >
        <span>Scroll</span>
        <span className="block w-10 h-px bg-white/70" />
      </div>
    </section>
  );
});

const StatsStrip = memo(function StatsStrip() {
  const stats = useMemo(() => [
    { value: "13+", label: "Years of practice" },
    { value: "180", label: "Spaces completed" },
    { value: "4", label: "Design disciplines" },
    { value: "98%", label: "Repeat clientele" },
  ], []);

  return (
    <section className="ngi-container -mt-8 pb-16 md:pb-24">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 rounded-[28px] border border-[#EFE7DC] bg-white/80 p-4 shadow-[0_18px_50px_rgba(45,42,38,0.05)] backdrop-blur">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-[20px] bg-[#F7F4EF] px-5 py-6 text-center">
            <div className="font-serif text-3xl md:text-4xl text-[#2D2A26]">{stat.value}</div>
            <div className="mt-2 text-[10px] uppercase tracking-[0.24em] text-[#6E675F]">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
});

const FeaturedProjects = memo(function FeaturedProjects({ projects }) {
  if (!projects.length) return null;
  return (
    <section className="ngi-section ngi-container" data-testid="home-featured">
      <FadeIn className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
        <div>
          <div className="ngi-overline mb-4"><span className="ngi-rule" />Selected Works</div>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light tracking-tight leading-tight max-w-2xl">
            Each project, an answer to a question only the client could ask.
          </h2>
        </div>
        <Link to="/portfolio" className="ngi-link-underline text-sm tracking-wider uppercase text-[#171717]">
          All projects →
        </Link>
      </FadeIn>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10">
        {projects.slice(0, 3).map((p, i) => (
          <FadeIn
            key={p.slug}
            delay={i * 0.1}
            className={
              i === 0
                ? "md:col-span-7 md:row-span-2"
                : i === 1
                ? "md:col-span-5 md:mt-24"
                : "md:col-span-7 md:col-start-6 md:-mt-12"
            }
          >
            <Link to={`/portfolio/${p.slug}`} className="group block">
              <div className="ngi-image-zoom aspect-[4/5] md:aspect-[4/5] bg-[#E7E2DA]">
                <img src={p.cover_image} alt={p.title} className="w-full h-full object-cover" loading="lazy" decoding="async" />
              </div>
              <div className="flex items-end justify-between mt-5">
                <div>
                  <div className="text-[10px] tracking-[0.22em] uppercase text-[#707070]">{p.category} · {p.location}</div>
                  <h3 className="font-serif text-2xl md:text-3xl mt-2 group-hover:text-[#707070] transition-colors">{p.title}</h3>
                </div>
                <ArrowUpRight size={20} className="text-[#171717] group-hover:text-[#C8A46A] transition-colors" />
              </div>
            </Link>
          </FadeIn>
        ))}
      </div>
    </section>
  );
});

const MeetTheStudio = memo(function MeetTheStudio() {
  return (
    <section className="bg-[#F6F4F1] border-y border-[#E7E2DA]" data-testid="home-studio">
      <div className="ngi-container ngi-section grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
        <FadeIn className="md:col-span-5">
          <div className="aspect-[4/5] overflow-hidden border border-[#171717]/10">
            <img 
              src="https://images.pexels.com/photos/34538288/pexels-photo-34538288.jpeg" 
              alt="Studio workspace" 
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" 
              loading="lazy"
              decoding="async"
            />
          </div>
        </FadeIn>
        <FadeIn className="md:col-span-6 md:col-start-7" delay={0.1}>
          <div className="ngi-overline mb-4"><span className="ngi-rule" />Meet the Studio</div>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light tracking-tight leading-snug mb-8">
            Thirteen people, one obsession: <em className="text-[#707070]">considered interiors.</em>
          </h2>
          
          <div className="space-y-6 mb-10">
            <p className="text-base md:text-lg leading-relaxed text-[#171717]/80">
              NextGen Interiors is based in Bengaluru. We design residential and commercial interiors across India. What unites us isn't location—it's an unwavering commitment to detail and a belief that spaces should feel inevitable, not trendy.
            </p>
            
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="text-[11px] tracking-[0.22em] uppercase text-[#C8A46A] font-medium whitespace-nowrap">Design-Led</div>
                <p className="text-sm text-[#171717]/70">Every project is guided by senior architects from first sketch to final handover.</p>
              </div>
              <div className="flex gap-4">
                <div className="text-[11px] tracking-[0.22em] uppercase text-[#C8A46A] font-medium whitespace-nowrap">Material First</div>
                <p className="text-sm text-[#171717]/70">We review finishes in our studio under daylight and lamplight, never from a catalogue.</p>
              </div>
              <div className="flex gap-4">
                <div className="text-[11px] tracking-[0.22em] uppercase text-[#C8A46A] font-medium whitespace-nowrap">Built to Age</div>
                <p className="text-sm text-[#171717]/70">A five-year remedial visit programme ensures every project ages beautifully with you.</p>
              </div>
            </div>
          </div>

          <Link 
            to="/about" 
            className="inline-flex items-center gap-2 text-sm tracking-wider uppercase text-[#171717] ngi-link-underline hover:text-[#C8A46A] transition-colors"
          >
            Learn more about us →
          </Link>
        </FadeIn>
      </div>
    </section>
  );
});

const PhilosophySection = memo(function PhilosophySection() {
  return (
    <section className="ngi-section ngi-container" data-testid="home-philosophy">
      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 items-center">
        <FadeIn>
          <div className="ngi-overline mb-4"><span className="ngi-rule" />Design Philosophy</div>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light tracking-tight leading-tight max-w-3xl">
            A home should feel as enduring as it is beautiful.
          </h2>
          <p className="mt-8 max-w-2xl text-base md:text-lg leading-8 text-[#6E675F]">
            We design with restraint and intention, allowing architecture, natural light, and materials to do the talking. The result is a space that feels effortless, collected, and quietly luxurious.
          </p>
        </FadeIn>
        <FadeIn delay={0.1}>
          <div className="rounded-[32px] border border-[#EFE7DC] bg-white p-8 shadow-[0_20px_60px_rgba(45,42,38,0.06)]">
            <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.24em] text-[#B38B59]">
              <span className="h-px w-10 bg-[#B38B59]" />Studio principle
            </div>
            <blockquote className="mt-6 font-serif text-2xl md:text-3xl leading-relaxed text-[#2D2A26]">
              “Every room should feel like it has been waiting for its inhabitants all along.”
            </blockquote>
            <div className="mt-8 space-y-4">
              <div className="flex items-center justify-between border-b border-[#EFE7DC] pb-3 text-sm text-[#6E675F]">
                <span>Material-first approach</span>
                <span>01</span>
              </div>
              <div className="flex items-center justify-between border-b border-[#EFE7DC] pb-3 text-sm text-[#6E675F]">
                <span>Architecture-led detailing</span>
                <span>02</span>
              </div>
              <div className="flex items-center justify-between text-sm text-[#6E675F]">
                <span>Long-term stewardship</span>
                <span>03</span>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
});

const ServicesOverview = memo(function ServicesOverview() {
  const premiumServices = useMemo(() => [
    SERVICES[0], // Residential Interiors
    SERVICES[1], // Commercial Interiors
    { ...SERVICES[2], slug: "turnkey-solutions", title: "Turnkey Solutions", short: "Complete project management from concept to handover." }, // Modular Kitchens → Turnkey
    SERVICES[7], // Renovation
  ], []);

  return (
    <section className="ngi-section ngi-container" data-testid="home-services">
      <FadeIn className="mb-16">
        <div className="ngi-overline mb-4"><span className="ngi-rule" />Four Premium Services</div>
        <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light tracking-tight leading-tight max-w-3xl">
          Four disciplines. One studio. Infinite possibilities.
        </h2>
      </FadeIn>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
        {premiumServices.map((s, i) => (
          <FadeIn key={s.slug} delay={i * 0.08}>
            <Link to={`/services/${s.slug}`} className="group block">
              <div className="relative overflow-hidden rounded-[22px] border border-[#E7E2DA] bg-white shadow-[0_18px_50px_rgba(23,23,23,0.06)] transition-all duration-500 hover:-translate-y-1 hover:border-[#C8A46A]/40 hover:shadow-[0_24px_70px_rgba(23,23,23,0.10)]">
                {/* Service image with zoom effect */}
                <div className="relative h-64 md:h-80 overflow-hidden bg-[#E7E2DA]">
                  <img
                    src={s.image}
                    alt={s.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#171717]/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                {/* Service content */}
                <div className="p-8">
                  <div className="text-[10px] tracking-[0.22em] uppercase text-[#C8A46A] mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Service
                  </div>
                  <h3 className="font-serif text-2xl md:text-3xl font-light mb-3 group-hover:text-[#C8A46A] transition-colors duration-300">
                    {s.title}
                  </h3>
                  <p className="text-sm text-[#171717]/70 leading-relaxed mb-6">{s.short}</p>

                  {/* CTA - plain CSS transition instead of a motion.div for a hover-only shift */}
                  <div className="flex items-center gap-3 text-sm tracking-wider uppercase text-[#171717] group-hover:text-[#C8A46A] transition-colors duration-300">
                    <span>Explore</span>
                    <span className="inline-block opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
                      <ArrowUpRight size={16} />
                    </span>
                  </div>
                </div>

                {/* Border accent - plain CSS transition, same as the CTA above */}
                <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute top-0 left-0 h-px w-0 bg-gradient-to-r from-transparent to-[#C8A46A] group-hover:w-full transition-all duration-500" />
                  <div className="absolute bottom-0 right-0 h-px w-0 bg-gradient-to-l from-transparent to-[#C8A46A] group-hover:w-full transition-all duration-500" />
                </div>
              </div>
            </Link>
          </FadeIn>
        ))}
      </div>

      {/* Link to full services */}
      <FadeIn delay={0.4} className="mt-16 text-center">
        <Link to="/services" className="inline-flex items-center gap-3 text-sm tracking-wider uppercase text-[#171717] ngi-link-underline">
          Explore All Services <ArrowUpRight size={16} />
        </Link>
      </FadeIn>
    </section>
  );
});

const GalleryMasonry = memo(function GalleryMasonry() {
  const images = useMemo(() => [
    { src: "https://images.pexels.com/photos/20418771/pexels-photo-20418771.jpeg", alt: "Calm contemporary living room" },
    { src: "https://images.pexels.com/photos/34538288/pexels-photo-34538288.jpeg", alt: "Layered warm interior detail" },
    { src: "https://images.pexels.com/photos/13201479/pexels-photo-13201479.jpeg", alt: "Luxury dining environment" },
    { src: "https://images.pexels.com/photos/13219418/pexels-photo-13219418.jpeg", alt: "Architectural lighting composition" },
  ], []);

  return (
    <section className="ngi-section ngi-container" data-testid="home-gallery">
      <FadeIn className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <div className="ngi-overline mb-4"><span className="ngi-rule" />Studio Gallery</div>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light tracking-tight leading-tight max-w-2xl">
            An atmosphere of considered comfort.
          </h2>
        </div>
        <div className="max-w-xl text-sm md:text-base leading-7 text-[#6E675F]">
          Quietly layered spaces, sculptural forms, and tactile finishes designed to feel timeless from day one.
        </div>
      </FadeIn>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {images.map((image, index) => (
          <div key={image.src} className={`overflow-hidden rounded-[28px] border border-[#EFE7DC] bg-white shadow-[0_18px_50px_rgba(45,42,38,0.05)] ${index === 0 || index === 2 ? "md:translate-y-8" : ""}`}>
            <img src={image.src} alt={image.alt} className="h-72 w-full object-cover transition-transform duration-700 hover:scale-105" loading="lazy" decoding="async" />
          </div>
        ))}
      </div>
    </section>
  );
});

const FAQSection = memo(function FAQSection() {
  const faqs = useMemo(() => [
    { question: "How do you approach a new project?", answer: "We begin with an exploratory conversation, develop a spatial narrative, and then translate it into a layered design language that feels calm and enduring." },
    { question: "Do you work across residential and commercial spaces?", answer: "Yes. Our practice spans private residences, boutique hospitality, and workplace interiors with the same level of detail and care." },
    { question: "Can you assist with renovations?", answer: "Absolutely. We guide projects from concept through construction, including sensitive renovations that refresh an existing home or property." },
  ], []);

  return (
    <section className="ngi-section ngi-container" data-testid="home-faq">
      <div className="rounded-[32px] border border-[#EFE7DC] bg-white/80 p-8 md:p-12 shadow-[0_20px_60px_rgba(45,42,38,0.06)]">
        <FadeIn className="max-w-3xl">
          <div className="ngi-overline mb-4"><span className="ngi-rule" />Frequently Asked</div>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light tracking-tight leading-tight">
            A few answers before we begin.
          </h2>
        </FadeIn>

        <div className="mt-10 space-y-4">
          {faqs.map((item, index) => (
            <details key={item.question} className="group rounded-[20px] border border-[#EFE7DC] bg-[#F7F4EF] px-6 py-5" open={index === 0}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-base font-medium text-[#2D2A26]">
                <span>{item.question}</span>
                <ChevronDown size={18} className="shrink-0 text-[#B38B59] transition-transform duration-300 group-open:rotate-180" />
              </summary>
              <p className="mt-4 pr-8 text-sm leading-7 text-[#6E675F]">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
});

const Testimonials = memo(function Testimonials() {
  const testimonials = useMemo(() => [
    {
      quote: "They listened more than they spoke. The result is a home that feels like us—only more composed.",
      author: "Aarav & Ishita Menon",
      role: "Homeowners · Bengaluru",
      projectName: "Residency HSR",
      projectImage: "https://images.pexels.com/photos/13201479/pexels-photo-13201479.jpeg",
    },
    {
      quote: "Every evening the apartment seems to exhale. That is the design.",
      author: "Karan Shroff",
      role: "Homeowner · Mumbai",
      projectName: "Marine Drive Sanctuary",
      projectImage: "https://images.pexels.com/photos/34538288/pexels-photo-34538288.jpeg",
    },
    {
      quote: "Our team writes better proposals here. That is not a metaphor.",
      author: "Studio Principal",
      role: "Creative Studio · Pune",
      projectName: "Design Atelier",
      projectImage: "https://images.pexels.com/photos/13219418/pexels-photo-13219418.jpeg",
    },
    {
      quote: "The room does half the hospitality for us.",
      author: "Founders, Terra",
      role: "Restaurant · Goa",
      projectName: "Terra Restaurant",
      projectImage: "https://images.unsplash.com/photo-1517299033323-8f60b40141f1?w=1200",
    },
  ], []);

  return (
    <section className="ngi-section ngi-container" data-testid="home-testimonials">
      <FadeIn className="mb-16">
        <div className="ngi-overline mb-4"><span className="ngi-rule" />From Our Clients</div>
        <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light tracking-tight leading-tight max-w-3xl">
          Words from the people we've designed for.
        </h2>
      </FadeIn>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12">
        {testimonials.map((t, i) => (
          <FadeIn key={t.author} delay={i * 0.08}>
            <div className="group rounded-[22px] border border-[#E7E2DA] bg-white overflow-hidden shadow-[0_18px_50px_rgba(23,23,23,0.06)] hover:-translate-y-1 hover:border-[#C8A46A]/30 hover:shadow-[0_24px_70px_rgba(23,23,23,0.10)] transition-all duration-500">
              {/* Project image with overlay */}
              <div className="relative h-48 overflow-hidden bg-[#E7E2DA]">
                <img
                  src={t.projectImage}
                  alt={t.projectName}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#171717]/60 via-[#171717]/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="text-[10px] tracking-[0.22em] uppercase text-[#C8A46A]">{t.projectName}</div>
                </div>
              </div>

              {/* Testimonial content */}
              <div className="p-8 bg-white">
                <Quote size={24} className="text-[#C8A46A] mb-6" strokeWidth={1.2} />
                <p className="font-serif text-lg md:text-xl leading-relaxed text-[#171717] mb-8">
                  "{t.quote}"
                </p>
                <div className="border-t border-[#171717]/10 pt-6">
                  <div className="text-[11px] tracking-[0.22em] uppercase text-[#171717] font-medium">{t.author}</div>
                  <div className="text-xs text-[#171717]/60 mt-1">{t.role}</div>
                </div>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
});

const ConsultationCTA = memo(function ConsultationCTA() {
  return (
    <section className="ngi-section ngi-container" data-testid="home-cta">
      <FadeIn className="bg-[#171717] text-white px-8 md:px-16 lg:px-24 py-20 md:py-28 lg:py-32 relative ngi-grain border border-[#C8A46A]/15 shadow-[0_20px_60px_rgba(23,23,23,0.12)]">
        <div className="ngi-overline text-[#C8A46A] mb-6"><span className="ngi-rule" />Ready to Begin</div>
        <h2 className="font-serif text-5xl md:text-6xl lg:text-7xl font-light tracking-tight leading-[1.05] max-w-4xl mb-6">
          Tell us about the space you're imagining.
        </h2>
        <p className="mt-8 text-white/75 max-w-xl text-base md:text-lg leading-relaxed">
          Ninety minutes, in our studio or yours. No presentations, no sales—just a conversation between the people who will design your space and the people who will live in it.
        </p>
        <Link
          to="/consultation"
          data-testid="home-cta-book"
          className="inline-flex items-center gap-3 mt-12 magnetic bg-[#C8A46A] text-white hover:bg-[#D6B27A] px-10 py-5 text-[11px] tracking-[0.22em] uppercase transition-colors duration-300"
        >
          Book Your Consultation <ArrowUpRight size={16} />
        </Link>
      </FadeIn>
    </section>
  );
});

export default function HomePage() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    api.get("/projects", { params: { featured: true } }).then(({ data }) => setProjects(data)).catch(() => {});
  }, []);

  return (
    <div data-testid="home-page">
      <Hero />
      <StatsStrip />
      <FeaturedProjects projects={projects} />
      <BlueprintToReality />
      <PhilosophySection />
      <ServicesOverview />
      <GalleryMasonry />
      <MeetTheStudio />
      <Testimonials />
      <FAQSection />
      <ConsultationCTA />
    </div>
  );
}
