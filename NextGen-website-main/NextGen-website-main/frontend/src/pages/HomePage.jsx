import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Quote } from "lucide-react";
import { api } from "@/lib/api";
import { FadeIn, RevealText } from "@/components/site/Motion";
import BlueprintToReality from "@/components/site/BlueprintToReality";
import { SERVICES } from "@/data/services";

const HERO_IMAGES = [
  "https://images.pexels.com/photos/20418771/pexels-photo-20418771.jpeg",
  "https://images.pexels.com/photos/13201479/pexels-photo-13201479.jpeg",
  "https://images.pexels.com/photos/34538288/pexels-photo-34538288.jpeg",
];

function Hero() {
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
    <section ref={ref} className="relative h-screen min-h-[680px] overflow-hidden bg-[#0B0B0D]" data-testid="home-hero">
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
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B0B0D]/30 via-[#0B0B0D]/10 to-[#0B0B0D]/70" />
      </motion.div>

      <motion.div style={{ opacity }} className="relative h-full ngi-container flex flex-col justify-end pb-20 md:pb-28">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.6 }}
            className="ngi-overline text-[#C9A86A] mb-6"
          >
            <span className="ngi-rule" />Interior architecture · Est. 2013
          </motion.div>
          <h1 className="font-serif text-[#F7F5F2] text-5xl md:text-7xl lg:text-[88px] font-light tracking-tighter leading-[0.95]">
            <RevealText text="Interiors that hold" delay={1.7} />
            <br />
            <span className="italic text-[#C9A86A]"><RevealText text="a quiet conversation" delay={1.9} /></span>
            <br />
            <RevealText text="with their owners." delay={2.1} />
          </h1>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 2.5 }}
            className="mt-10 flex flex-col sm:flex-row gap-4 items-start"
          >
            <Link
              to="/consultation"
              data-testid="hero-primary-cta"
              className="inline-flex items-center gap-3 magnetic bg-[#F7F5F2] text-[#0B0B0D] hover:bg-[#C9A86A] px-8 py-4 text-[11px] tracking-[0.22em] uppercase transition-colors duration-300"
            >
              Book a Consultation <ArrowUpRight size={16} />
            </Link>
            <Link
              to="/portfolio"
              data-testid="hero-secondary-cta"
              className="inline-flex items-center gap-3 border border-[#F7F5F2]/30 text-[#F7F5F2] hover:border-[#C9A86A] hover:text-[#C9A86A] px-8 py-4 text-[11px] tracking-[0.22em] uppercase transition-colors duration-300"
            >
              View Portfolio
            </Link>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, delay: 2.6 }}
        className="absolute bottom-6 right-6 md:right-12 text-[#F7F5F2]/70 text-[10px] tracking-[0.3em] uppercase rotate-0 flex items-center gap-3"
      >
        <span>Scroll</span>
        <span className="block w-10 h-px bg-[#F7F5F2]/70" />
      </motion.div>
    </section>
  );
}

function FeaturedProjects({ projects }) {
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
        <Link to="/portfolio" className="ngi-link-underline text-sm tracking-wider uppercase text-[#0B0B0D]">
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
              <div className="ngi-image-zoom aspect-[4/5] md:aspect-[4/5] bg-[#E6E0D8]">
                <img src={p.cover_image} alt={p.title} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="flex items-end justify-between mt-5">
                <div>
                  <div className="text-[10px] tracking-[0.22em] uppercase text-[#6D4C41]">{p.category} · {p.location}</div>
                  <h3 className="font-serif text-2xl md:text-3xl mt-2 group-hover:text-[#6D4C41] transition-colors">{p.title}</h3>
                </div>
                <ArrowUpRight size={20} className="text-[#0B0B0D] group-hover:text-[#C9A86A] transition-colors" />
              </div>
            </Link>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}

function MeetTheStudio() {
  return (
    <section className="bg-[#E6E0D8]/40" data-testid="home-studio">
      <div className="ngi-container ngi-section grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
        <FadeIn className="md:col-span-5">
          <div className="aspect-[4/5] overflow-hidden border border-[#0B0B0D]/10">
            <img 
              src="https://images.pexels.com/photos/34538288/pexels-photo-34538288.jpeg" 
              alt="Studio workspace" 
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" 
              loading="lazy" 
            />
          </div>
        </FadeIn>
        <FadeIn className="md:col-span-6 md:col-start-7" delay={0.1}>
          <div className="ngi-overline mb-4"><span className="ngi-rule" />Meet the Studio</div>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light tracking-tight leading-snug mb-8">
            Thirteen people, one obsession: <em className="text-[#6D4C41]">considered interiors.</em>
          </h2>
          
          <div className="space-y-6 mb-10">
            <p className="text-base md:text-lg leading-relaxed text-[#0B0B0D]/80">
              NextGen Interiors is based in Bengaluru. We design residential and commercial interiors across India. What unites us isn't location—it's an unwavering commitment to detail and a belief that spaces should feel inevitable, not trendy.
            </p>
            
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="text-[11px] tracking-[0.22em] uppercase text-[#C9A86A] font-medium whitespace-nowrap">Design-Led</div>
                <p className="text-sm text-[#0B0B0D]/70">Every project is guided by senior architects from first sketch to final handover.</p>
              </div>
              <div className="flex gap-4">
                <div className="text-[11px] tracking-[0.22em] uppercase text-[#C9A86A] font-medium whitespace-nowrap">Material First</div>
                <p className="text-sm text-[#0B0B0D]/70">We review finishes in our studio under daylight and lamplight, never from a catalogue.</p>
              </div>
              <div className="flex gap-4">
                <div className="text-[11px] tracking-[0.22em] uppercase text-[#C9A86A] font-medium whitespace-nowrap">Built to Age</div>
                <p className="text-sm text-[#0B0B0D]/70">A five-year remedial visit programme ensures every project ages beautifully with you.</p>
              </div>
            </div>
          </div>

          <Link 
            to="/about" 
            className="inline-flex items-center gap-2 text-sm tracking-wider uppercase text-[#0B0B0D] ngi-link-underline hover:text-[#C9A86A] transition-colors"
          >
            Learn more about us →
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}

function ServicesOverview() {
  // Show only 4 premium services
  const premiumServices = [
    SERVICES[0], // Residential Interiors
    SERVICES[1], // Commercial Interiors
    { ...SERVICES[2], slug: "turnkey-solutions", title: "Turnkey Solutions", short: "Complete project management from concept to handover." }, // Modular Kitchens → Turnkey
    SERVICES[7], // Renovation
  ];

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
              <div className="relative overflow-hidden border border-[#0B0B0D]/10 bg-[#F7F5F2] transition-all duration-500 hover:border-[#C9A86A]/40 hover:bg-[#E6E0D8]/20">
                {/* Service image with zoom effect */}
                <div className="relative h-64 md:h-80 overflow-hidden bg-[#E6E0D8]">
                  <img
                    src={s.image}
                    alt={s.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0D]/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                {/* Service content */}
                <div className="p-8">
                  <div className="text-[10px] tracking-[0.22em] uppercase text-[#C9A86A] mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Service
                  </div>
                  <h3 className="font-serif text-2xl md:text-3xl font-light mb-3 group-hover:text-[#C9A86A] transition-colors duration-300">
                    {s.title}
                  </h3>
                  <p className="text-sm text-[#0B0B0D]/70 leading-relaxed mb-6">{s.short}</p>

                  {/* CTA with animation */}
                  <div className="flex items-center gap-3 text-sm tracking-wider uppercase text-[#0B0B0D] group-hover:text-[#C9A86A] transition-colors duration-300">
                    <span>Explore</span>
                    <motion.div
                      initial={{ x: 0, opacity: 0 }}
                      whileHover={{ x: 4, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ArrowUpRight size={16} />
                    </motion.div>
                  </div>
                </div>

                {/* Animated border accent */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="absolute top-0 left-0 h-px w-0 bg-gradient-to-r from-transparent to-[#C9A86A] group-hover:w-full transition-all duration-500" />
                  <div className="absolute bottom-0 right-0 h-px w-0 bg-gradient-to-l from-transparent to-[#C9A86A] group-hover:w-full transition-all duration-500" />
                </motion.div>
              </div>
            </Link>
          </FadeIn>
        ))}
      </div>

      {/* Link to full services */}
      <FadeIn delay={0.4} className="mt-16 text-center">
        <Link to="/services" className="inline-flex items-center gap-3 text-sm tracking-wider uppercase text-[#0B0B0D] ngi-link-underline">
          Explore All Services <ArrowUpRight size={16} />
        </Link>
      </FadeIn>
    </section>
  );
}

function Testimonials() {
  const testimonials = [
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
  ];

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
            <div className="group border border-[#0B0B0D]/10 overflow-hidden hover:border-[#C9A86A]/30 transition-all duration-500">
              {/* Project image with overlay */}
              <div className="relative h-48 overflow-hidden bg-[#E6E0D8]">
                <img
                  src={t.projectImage}
                  alt={t.projectName}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0D]/60 via-[#0B0B0D]/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="text-[10px] tracking-[0.22em] uppercase text-[#C9A86A]">{t.projectName}</div>
                </div>
              </div>

              {/* Testimonial content */}
              <div className="p-8 bg-[#F7F5F2]">
                <Quote size={24} className="text-[#C9A86A] mb-6" strokeWidth={1.2} />
                <p className="font-serif text-lg md:text-xl leading-relaxed text-[#0B0B0D] mb-8">
                  "{t.quote}"
                </p>
                <div className="border-t border-[#0B0B0D]/10 pt-6">
                  <div className="text-[11px] tracking-[0.22em] uppercase text-[#0B0B0D] font-medium">{t.author}</div>
                  <div className="text-xs text-[#0B0B0D]/60 mt-1">{t.role}</div>
                </div>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}

function ConsultationCTA() {
  return (
    <section className="ngi-section ngi-container" data-testid="home-cta">
      <FadeIn className="bg-[#0B0B0D] text-[#F7F5F2] px-8 md:px-16 lg:px-24 py-20 md:py-28 lg:py-32 relative ngi-grain">
        <div className="ngi-overline text-[#C9A86A] mb-6"><span className="ngi-rule" />Ready to Begin</div>
        <h2 className="font-serif text-5xl md:text-6xl lg:text-7xl font-light tracking-tight leading-[1.05] max-w-4xl mb-6">
          Tell us about the space you're imagining.
        </h2>
        <p className="mt-8 text-[#F7F5F2]/70 max-w-xl text-base md:text-lg leading-relaxed">
          Ninety minutes, in our studio or yours. No presentations, no sales—just a conversation between the people who will design your space and the people who will live in it.
        </p>
        <Link
          to="/consultation"
          data-testid="home-cta-book"
          className="inline-flex items-center gap-3 mt-12 magnetic bg-[#C9A86A] text-[#0B0B0D] hover:bg-[#F7F5F2] px-10 py-5 text-[11px] tracking-[0.22em] uppercase transition-colors duration-300"
        >
          Book Your Consultation <ArrowUpRight size={16} />
        </Link>
      </FadeIn>
    </section>
  );
}

export default function HomePage() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    api.get("/projects", { params: { featured: true } }).then(({ data }) => setProjects(data)).catch(() => {});
  }, []);

  return (
    <div data-testid="home-page">
      {/* NEW STRUCTURE - 7 SECTIONS */}
      {/* 1. Hero */}
      <Hero />
      
      {/* 2. Featured Projects */}
      <FeaturedProjects projects={projects} />
      
      {/* 3. Blueprint to Reality - THE SIGNATURE EXPERIENCE */}
      <BlueprintToReality />
      
      {/* 4. Services - Simplified to 4 premium cards */}
      <ServicesOverview />
      
      {/* 5. Meet the Studio - Enhanced About */}
      <MeetTheStudio />
      
      {/* 6. Testimonials - Redesigned with project images */}
      <Testimonials />
      
      {/* 7. Final CTA */}
      <ConsultationCTA />
    </div>
  );
}
