import { memo, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Quote } from "lucide-react";
import { api } from "@/lib/api";
import { FadeIn } from "@/components/site/Motion";
import BlueprintToReality from "@/components/site/BlueprintToReality";

const HERO_IMAGES = [
  "https://images.pexels.com/photos/20418771/pexels-photo-20418771.jpeg",
  "https://images.pexels.com/photos/13201479/pexels-photo-13201479.jpeg",
  "https://images.pexels.com/photos/34538288/pexels-photo-34538288.jpeg",
];

const FEATURED_PROJECTS_FALLBACK = [
  {
    slug: "residency-hsr",
    title: "Residency HSR",
    category: "Residential",
    location: "Bengaluru",
    cover_image: "https://images.pexels.com/photos/13201479/pexels-photo-13201479.jpeg",
  },
  {
    slug: "marine-drive-sanctuary",
    title: "Marine Drive Sanctuary",
    category: "Apartment",
    location: "Mumbai",
    cover_image: "https://images.pexels.com/photos/34538288/pexels-photo-34538288.jpeg",
  },
  {
    slug: "atelier-office",
    title: "Atelier Office",
    category: "Commercial",
    location: "Pune",
    cover_image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
  },
];

const Hero = memo(function Hero() {
  const ref = useRef(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.06]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.12]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 7000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section ref={ref} className="relative h-screen min-h-[640px] overflow-hidden bg-[#171717]" data-testid="home-hero">
      <motion.div style={{ scale, y }} className="absolute inset-0 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.img
            key={HERO_IMAGES[activeSlide]}
            src={HERO_IMAGES[activeSlide]}
            alt="Luxury interior"
            className="absolute inset-0 w-full h-full object-cover brightness-[0.88] saturate-[0.98] contrast-[1.02]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            loading="eager"
            decoding="async"
            fetchPriority="high"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-b from-[#171717]/38 via-[#171717]/18 to-[#171717]/74" />
      </motion.div>

      <motion.div style={{ opacity }} className="relative h-full ngi-container flex flex-col justify-end pb-16 md:pb-24">
        <div className="relative max-w-[44rem] pb-2 md:pb-4">
          <div className="pointer-events-none absolute -inset-x-8 -inset-y-8 md:-inset-x-12 md:-inset-y-10 bg-gradient-to-r from-[#171717]/42 via-[#171717]/18 to-transparent blur-2xl" />
          <div className="relative z-10">
            <div className="ngi-overline text-[#C49A66] mb-6 ngi-reveal" style={{ animationDelay: "1.6s" }}>
            <span className="ngi-rule" />Interior architecture · Est. 2013
          </div>
            <h1 className="font-serif text-white text-5xl md:text-6xl lg:text-[80px] font-light tracking-tighter leading-[0.96] [text-shadow:0_1px_10px_rgba(0,0,0,0.18)]">
              <span className="block ngi-reveal" style={{ animationDelay: "1.7s" }}>Crafting timeless</span>
              <span className="block italic text-[#C49A66] ngi-reveal" style={{ animationDelay: "1.9s" }}>living spaces</span>
              <span className="block ngi-reveal" style={{ animationDelay: "2.1s" }}>with quiet luxury.</span>
            </h1>
            <p className="mt-8 max-w-lg text-sm md:text-base leading-7 text-[#F7F4EF] ngi-reveal [text-shadow:0_1px_6px_rgba(0,0,0,0.16)]" style={{ animationDelay: "2.2s" }}>
              We shape homes and hospitality environments with architectural clarity, tactile materials, and an unwavering commitment to calm, beautiful living.
            </p>
            <div className="mt-12 flex flex-col sm:flex-row gap-4 items-start ngi-reveal" style={{ animationDelay: "2.5s" }}>
              <Link
                to="/consultation"
                data-testid="hero-primary-cta"
                className="inline-flex items-center gap-3 rounded-full border border-[#C49A66] bg-[#C49A66] px-7 py-3.5 text-[11px] tracking-[0.22em] uppercase text-white transition-colors duration-300 hover:bg-[#D0AA72]"
              >
                Book a Consultation <ArrowUpRight size={16} />
              </Link>
              <Link
                to="/portfolio"
                data-testid="hero-secondary-cta"
                className="inline-flex items-center gap-3 rounded-full border border-white/24 px-7 py-3.5 text-[11px] tracking-[0.22em] uppercase text-white transition-colors duration-300 hover:border-white/40 hover:bg-white/6"
              >
                View Portfolio
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      <div
        className="absolute bottom-6 right-6 md:right-10 text-white/58 text-[10px] tracking-[0.28em] uppercase rotate-0 flex items-center gap-3 ngi-reveal"
        style={{ animationDelay: "2.6s" }}
      >
        <span>Scroll</span>
        <span className="block w-10 h-px bg-white/70" />
      </div>
    </section>
  );
});

const FeaturedProjects = memo(function FeaturedProjects({ projects }) {
  const featuredProjects = projects.length ? projects : FEATURED_PROJECTS_FALLBACK;

  return (
    <section className="ngi-section ngi-container" data-testid="home-featured">
      <FadeIn className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between mb-14 md:mb-16">
        <div>
          <div className="ngi-overline mb-4"><span className="ngi-rule" />Selected Works</div>
          <h2 className="max-w-2xl font-serif text-4xl font-light tracking-tight leading-tight md:text-5xl lg:text-[3.6rem]">
            Each project, an answer to a question only the client could ask.
          </h2>
        </div>
        <Link to="/portfolio" className="ngi-link-underline text-[11px] tracking-[0.22em] uppercase text-[#171717]/78 hover:text-[#171717]">
          All projects →
        </Link>
      </FadeIn>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {featuredProjects.slice(0, 3).map((p, i) => (
          <FadeIn
            key={p.slug}
            delay={i * 0.08}
            className="h-full"
          >
            <Link to={`/portfolio/${p.slug}`} className="group block h-full flex flex-col">
              <div className="ngi-image-zoom aspect-[4/3] bg-[#E7E2DA] overflow-hidden rounded-[24px] border border-[#E9E2D8] shadow-[0_10px_28px_rgba(45,42,38,0.06)] transition-shadow duration-500 group-hover:shadow-[0_16px_36px_rgba(45,42,38,0.09)] flex-shrink-0">
                <img src={p.cover_image} alt={p.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" loading="lazy" decoding="async" />
              </div>
              <div className="mt-5 flex flex-grow flex-col justify-between">
                <div>
                  <div className="text-[9px] font-medium uppercase tracking-[0.22em] text-[#9A9399]">{p.category} · {p.location}</div>
                  <h3 className="mt-3 font-serif text-xl leading-tight transition-colors duration-300 group-hover:text-[#B38B59] md:text-[1.7rem]">{p.title}</h3>
                </div>
                <div className="mt-4 flex items-center gap-2 text-[#171717]/74 transition-colors duration-300 group-hover:text-[#171717]">
                  <span className="text-[11px] font-medium uppercase tracking-[0.18em]">View project</span>
                  <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:translate-x-[2px] group-hover:-translate-y-[2px]" />
                </div>
              </div>
            </Link>
          </FadeIn>
        ))}
      </div>
    </section>
  );
});

const PhilosophySection = memo(function PhilosophySection() {
  return (
    <section className="ngi-container pt-24 md:pt-32 lg:pt-40 pb-0" data-testid="home-philosophy">
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
        <FadeIn>
          <div className="ngi-overline mb-4"><span className="ngi-rule" />Design Philosophy</div>
          <h2 className="max-w-3xl font-serif text-4xl font-light tracking-tight leading-tight md:text-5xl lg:text-[3.6rem]">
            A home should feel as enduring as it is beautiful.
          </h2>
          <p className="mt-7 max-w-xl text-base leading-8 text-[#6E675F] md:text-lg">
            We design with restraint and intention, allowing architecture, natural light, and materials to do the talking. The result is a space that feels effortless, collected, and quietly luxurious.
          </p>
        </FadeIn>
        <FadeIn delay={0.1}>
          <div className="rounded-[28px] border border-[#DDD5CB] bg-white p-8 shadow-[0_10px_30px_rgba(45,42,38,0.06)] md:p-10">
            <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.24em] text-[#C8A46A] mb-7">
              <span className="h-px w-10 bg-[#C8A46A]" />Studio Principle
            </div>
            <blockquote className="mb-9 font-serif text-2xl leading-relaxed text-[#171717] md:text-[2rem]">
              “Every room should feel like it has been waiting for its inhabitants all along.”
            </blockquote>
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#D8D2CA] pb-4 text-sm text-[#5A5450]">
                <span>Material-first approach</span>
                <span className="text-xs text-[#9A9399]">01</span>
              </div>
              <div className="flex items-center justify-between border-b border-[#D8D2CA] pb-4 text-sm text-[#5A5450]">
                <span>Architecture-led detailing</span>
                <span className="text-xs text-[#9A9399]">02</span>
              </div>
              <div className="flex items-center justify-between text-sm text-[#5A5450]">
                <span>Long-term stewardship</span>
                <span className="text-xs text-[#9A9399]">03</span>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
});

const Testimonials = memo(function Testimonials() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ 
    target: sectionRef, 
    offset: ["start end", "end start"] 
  });
  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 0.5, 0.5, 0]);

  const testimonials = [
    {
      quote: "They listened more than they spoke. The result is a home that feels like us—only more composed.",
      author: "Aarav & Ishita Menon",
      role: "Homeowners",
      location: "Bengaluru",
      project: "Residency HSR",
      image: "https://images.pexels.com/photos/13201479/pexels-photo-13201479.jpeg",
    },
    {
      quote: "Every evening the apartment seems to exhale. That is the design.",
      author: "Karan Shroff",
      role: "Homeowner",
      location: "Mumbai",
      project: "Marine Drive Sanctuary",
      image: "https://images.pexels.com/photos/34538288/pexels-photo-34538288.jpeg",
    },
  ];

  return (
    <section 
      ref={sectionRef}
      className="relative overflow-hidden bg-[#F7F4EF] py-24 md:py-32 lg:py-36" 
      data-testid="home-testimonials"
    >
      <motion.div 
        style={{ y, opacity }}
        className="absolute top-20 right-0 h-[440px] w-[440px] rounded-full bg-[#C8A46A]/8 blur-3xl pointer-events-none"
      />

      <div className="ngi-container relative z-10">
        <FadeIn className="mx-auto mb-16 max-w-3xl text-center md:mb-20">
          <div className="ngi-overline mb-6">
            <span className="ngi-rule" />In Their Words
          </div>
          <h2 className="mb-7 font-serif text-4xl font-light tracking-tight leading-[1.06] md:text-5xl lg:text-[3.7rem]">
            Designing homes that feel like a quiet conversation with oneself.
          </h2>
          <p className="mx-auto max-w-2xl text-base leading-8 text-[#6E675F] md:text-lg">
            Our work is best described by the people who live in the spaces we create.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
          {testimonials.map((t, i) => (
            <FadeIn key={i} delay={i * 0.15}>
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                className="group relative"
              >
                <div className="relative overflow-hidden rounded-[28px] border border-[#E5DDD2] bg-white shadow-[0_12px_32px_rgba(45,42,38,0.06)] transition-shadow duration-500 group-hover:shadow-[0_16px_36px_rgba(45,42,38,0.08)]">
                  <div className="relative h-64 overflow-hidden md:h-72">
                    <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/50 via-black/14 to-transparent" />
                    <img
                      src={t.image}
                      alt={t.project}
                      className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-[1.03]"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute bottom-5 left-5 z-20">
                      <div className="inline-flex items-center gap-2 rounded-full border border-white/16 bg-black/18 px-3 py-1.5 backdrop-blur-sm">
                        <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-white">{t.project}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-7 md:p-8">
                    <Quote size={28} className="mb-5 text-[#C8A46A]" strokeWidth={1.2} />
                    
                    <p className="mb-7 font-serif text-xl leading-relaxed text-[#171717] md:text-[1.65rem]">
                      "{t.quote}"
                    </p>
                    
                    <div className="flex items-center gap-4 border-t border-[#E7E2DA] pt-5">
                      <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-[#F4EEE4]">
                        <span className="text-sm font-serif text-[#B38B59]">{t.author.split(' ').map(n => n[0]).join('')}</span>
                      </div>
                      <div className="flex-grow">
                        <div className="text-sm font-medium text-[#171717]">{t.author}</div>
                        <div className="text-xs text-[#9A9399] mt-1">{t.role} · {t.location}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.4}>
          <div className="mt-14 text-center">
            <Link 
              to="/testimonials" 
              className="group inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.22em] text-[#171717]/78 transition-colors duration-300 hover:text-[#171717]"
            >
              <span>View All Client Stories</span>
              <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:translate-x-[2px] group-hover:-translate-y-[2px]" />
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
});

const ConsultationCTA = memo(function ConsultationCTA() {
  const sectionRef = useRef(null);

  return (
    <section 
      ref={sectionRef}
      className="relative overflow-hidden py-20 md:py-24 lg:py-28" 
      data-testid="home-cta"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[#1B1917] to-[#141414]" />

      <div className="ngi-container relative z-10">
        <FadeIn className="relative mx-auto w-full max-w-[880px]">
          <div className="relative mx-auto overflow-hidden rounded-[10px] border border-white/8 bg-white/[0.035] px-6 py-8 shadow-[0_18px_42px_rgba(15,15,15,0.2)] sm:px-10 sm:py-10 md:px-12 md:py-12 lg:px-14 lg:py-12">
            <div className="relative z-10 mx-auto flex max-w-[760px] flex-col items-center text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <div className="ngi-overline mb-6 flex justify-center text-[#C8A46A]">
                    <span className="ngi-rule" />Ready to Begin Your Journey
                  </div>
                </motion.div>

                <motion.h2 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="mb-6 max-w-[12ch] font-serif text-4xl font-light leading-[1.08] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-[4rem]"
                >
                  Let's design a space that{' '}
                  <span className="text-[#C8A46A] italic">tells your story</span>.
                </motion.h2>

                <motion.p 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="mx-auto mb-10 max-w-[44rem] text-base leading-8 text-[#F7F4EF] md:text-lg"
                >
                  Schedule a complimentary consultation. Ninety minutes to explore your vision, understand your needs, and discover how we can bring your ideal space to life.
                </motion.p>

                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="flex flex-col items-center justify-center gap-4 sm:flex-row"
                >
                  <Link
                    to="/consultation"
                    data-testid="home-cta-book"
                    className="group inline-flex items-center gap-3 rounded-full border border-[#B38B59] bg-[#B38B59] px-7 py-4 text-[11px] uppercase tracking-[0.22em] text-white transition-colors duration-300 hover:bg-[#C49A66]"
                  >
                    <span className="font-medium">Book Your Consultation</span>
                    <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:translate-x-[2px] group-hover:-translate-y-[2px]" />
                  </Link>

                  <Link
                    to="/portfolio"
                    className="group inline-flex items-center gap-3 rounded-full border border-white/20 px-7 py-4 text-[11px] uppercase tracking-[0.22em] text-white transition-all duration-300 hover:border-white/36 hover:bg-white/5"
                  >
                    <span>Explore Our Work</span>
                    <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:translate-x-[2px] group-hover:-translate-y-[2px]" />
                  </Link>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="mt-12 border-t border-white/10 pt-8 md:mt-14 md:pt-10"
                >
                  <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
                    {[
                      { value: "180+", label: "Projects Completed" },
                      { value: "13+", label: "Years of Excellence" },
                      { value: "98%", label: "Client Satisfaction" },
                      { value: "4.9", label: "Average Rating" },
                    ].map((stat, i) => (
                      <div key={i} className="text-center">
                        <div className="mb-2 font-serif text-3xl font-light text-white md:text-4xl">{stat.value}</div>
                        <div className="text-[11px] uppercase tracking-[0.18em] text-white/56">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </FadeIn>
      </div>
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
      <FeaturedProjects projects={projects} />
      <PhilosophySection />
      <BlueprintToReality />
      <Testimonials />
      <ConsultationCTA />
    </div>
  );
}
