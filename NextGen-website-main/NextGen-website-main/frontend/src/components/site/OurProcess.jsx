import { memo, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { FadeIn } from "@/components/site/Motion";

const OurProcess = memo(function OurProcess() {
  const sectionRef = useRef(null);
  const stepRefs = useRef([]);
  const [activeStep, setActiveStep] = useState(0);
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const smoothTiltX = useSpring(tiltX, { stiffness: 70, damping: 22, mass: 0.8 });
  const smoothTiltY = useSpring(tiltY, { stiffness: 70, damping: 22, mass: 0.8 });

  const steps = useMemo(
    () => [
      {
        num: "01",
        meta: "Weeks 1-3",
        title: "Blueprint & Consultation",
        desc: "We document how you live, then translate architectural intent into a precise project brief.",
        image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1000&h=1250&fit=crop",
      },
      {
        num: "02",
        meta: "Weeks 3-6",
        title: "Material Moodboard",
        desc: "Samples, tones, and textures establish emotional direction before detailed drafting begins.",
        image: "https://images.pexels.com/photos/13201479/pexels-photo-13201479.jpeg?w=1000&h=1250&fit=crop",
      },
      {
        num: "03",
        meta: "Weeks 6-10",
        title: "3D Visualization",
        desc: "Spatial renders and lighting studies validate scale, rhythm, and atmosphere with confidence.",
        image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1000&h=1250&fit=crop",
      },
      {
        num: "04",
        meta: "Weeks 10-18",
        title: "On-Site Craftsmanship",
        desc: "Trades execute under studio oversight, with sequencing, tolerances, and finish quality protected.",
        image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1000&h=1250&fit=crop",
      },
      {
        num: "05",
        meta: "Final Week",
        title: "Final Interior Reveal",
        desc: "The completed interior is balanced, styled, and delivered as a fully resolved lived-in environment.",
        image: "https://images.pexels.com/photos/34538288/pexels-photo-34538288.jpeg?w=1000&h=1250&fit=crop",
      },
    ],
    []
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (!visible.length) return;

        const nextIndex = Number(visible[0].target.getAttribute("data-step-index"));
        if (!Number.isNaN(nextIndex)) {
          setActiveStep((prev) => (prev === nextIndex ? prev : nextIndex));
        }
      },
      {
        root: null,
        rootMargin: "-45% 0px -45% 0px",
        threshold: [0.2, 0.4, 0.6, 0.8],
      }
    );

    const currentRefs = stepRefs.current.filter(Boolean);
    currentRefs.forEach((ref) => observer.observe(ref));
    return () => observer.disconnect();
  }, [steps.length]);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const railProgress = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const imageX = useTransform(smoothTiltX, [-1, 1], [-6, 6]);
  const imageY = useTransform(smoothTiltY, [-1, 1], [8, -8]);
  const imageShadow = useTransform(smoothTiltY, [-1, 1], ["0 34px 84px rgba(45,42,38,0.2)", "0 22px 62px rgba(45,42,38,0.14)"]);
  const markerTop = steps.length > 1 ? (activeStep / (steps.length - 1)) * 100 : 0;

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-[var(--ngi-background)] py-24 md:py-32 lg:py-40" data-testid="process-section">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(165deg,rgba(255,255,255,0.64)_0%,rgba(247,244,239,0.79)_48%,rgba(240,236,230,0.9)_100%)]" />
        <div
          className="absolute inset-0 opacity-[0.024]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, rgba(45,42,38,0.45) 0px, rgba(45,42,38,0.45) 1px, transparent 1px, transparent 3px), repeating-linear-gradient(90deg, rgba(45,42,38,0.35) 0px, rgba(45,42,38,0.35) 1px, transparent 1px, transparent 4px)",
          }}
        />
        <div className="absolute -top-32 right-[-8%] h-[480px] w-[480px] rounded-full bg-[radial-gradient(circle,rgba(179,139,89,0.09),transparent_70%)] blur-3xl" />
        <div className="absolute bottom-[-12%] left-[-8%] h-[380px] w-[380px] rounded-full bg-[radial-gradient(circle,rgba(179,139,89,0.06),transparent_70%)] blur-3xl" />
      </div>

      <div className="ngi-container relative">
        <FadeIn className="mx-auto mb-20 max-w-2xl text-center md:mb-28">
          <div className="ngi-overline mb-6">
            <span className="ngi-rule" />Our Process
          </div>
          <h2 className="font-serif text-5xl font-light leading-[1.05] tracking-tighter md:text-6xl lg:text-7xl">
            Five stages. One continuous vision.
          </h2>
        </FadeIn>

        <section className="grid grid-cols-1 gap-y-14 lg:grid-cols-[48%_52%] lg:gap-x-20">
          <div className="lg:sticky lg:top-24 lg:h-[75vh] lg:self-start">
            <div className="relative h-[54vh] lg:h-full">
              <div aria-hidden="true" className="absolute -inset-6 rounded-[40px] bg-[radial-gradient(circle_at_30%_20%,rgba(179,139,89,0.16),transparent_65%)] blur-2xl" />

              <motion.div
                className="relative h-full overflow-hidden rounded-[32px] border border-[var(--ngi-border)]"
                onMouseMove={(event) => {
                  const bounds = event.currentTarget.getBoundingClientRect();
                  const px = (event.clientX - bounds.left) / bounds.width;
                  const py = (event.clientY - bounds.top) / bounds.height;
                  tiltX.set((px - 0.5) * 2);
                  tiltY.set((py - 0.5) * 2);
                }}
                onMouseLeave={() => {
                  tiltX.set(0);
                  tiltY.set(0);
                }}
                style={{ boxShadow: imageShadow }}
              >
                <AnimatePresence initial={false}>
                  <motion.img
                    key={steps[activeStep].image}
                    src={steps[activeStep].image}
                    alt={steps[activeStep].title}
                    initial={{ opacity: 0, scale: 1.03, filter: "blur(8px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, scale: 0.97, filter: "blur(8px)" }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0 h-full w-full object-cover"
                    style={{ x: imageX, y: imageY, willChange: "transform, opacity, filter" }}
                    loading="lazy"
                    decoding="async"
                  />
                </AnimatePresence>

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[color:var(--ngi-graphite)]/45 via-transparent to-[color:var(--ngi-graphite)]/8" />

                <div className="absolute right-6 top-6 text-[11px] uppercase tracking-[0.24em] text-white/80">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={activeStep}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      {steps[activeStep].num} / 0{steps.length}
                    </motion.span>
                  </AnimatePresence>
                </div>

                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeStep}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <div className="text-[10px] uppercase tracking-[0.24em] text-[var(--ngi-gold)]">Stage {steps[activeStep].num}</div>
                      <div className="mt-1 font-serif text-xl font-light">{steps[activeStep].title}</div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>
          </div>

          <div className="relative">
            <div aria-hidden="true" className="absolute bottom-0 left-0 top-0 hidden w-px bg-[var(--ngi-border)] lg:block" />
            <motion.div
              aria-hidden="true"
              style={{ scaleY: railProgress, transformOrigin: "top" }}
              className="absolute bottom-0 left-0 top-0 hidden w-px bg-[var(--ngi-gold)] lg:block"
            />
            <motion.div
              aria-hidden="true"
              className="absolute left-0 hidden h-8 w-px bg-[var(--ngi-gold)] opacity-90 lg:block"
              style={{ top: `${markerTop}%`, transform: "translateY(-50%)" }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            />

            <div className="lg:pl-14">
              {steps.map((step, index) => {
                const isActive = activeStep === index;

                return (
                  <article
                    key={step.num}
                    ref={(node) => {
                      stepRefs.current[index] = node;
                    }}
                    data-step-index={index}
                    className="relative flex min-h-[88vh] flex-col justify-center py-8 lg:min-h-[90vh]"
                  >
                    <motion.div
                      animate={{ opacity: isActive ? 1 : 0.4, y: isActive ? -6 : 8, scale: isActive ? 1 : 0.985 }}
                      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                      style={{ willChange: "transform, opacity" }}
                    >
                      <div className="mb-7 flex items-center gap-5">
                        <span
                          className={`font-serif text-6xl font-light leading-none transition-colors duration-700 md:text-7xl lg:text-8xl ${
                            isActive ? "text-[var(--ngi-gold)]/75" : "text-[var(--ngi-border-strong)]"
                          }`}
                        >
                          {step.num}
                        </span>
                        <motion.span
                          className="h-px flex-1"
                          animate={{
                            backgroundColor: isActive ? "rgba(179,139,89,0.74)" : "rgba(45,42,38,0.12)",
                            opacity: isActive ? 1 : 0.7,
                          }}
                          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        />
                        <span className="hidden text-[10px] uppercase tracking-[0.24em] text-[var(--ngi-text-muted)] sm:block">{step.meta}</span>
                      </div>

                      <motion.div
                        className="mb-6 h-px w-16 bg-[var(--ngi-gold)]"
                        animate={{ opacity: isActive ? 0.95 : 0.28, scaleX: isActive ? 1 : 0.62 }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        style={{ transformOrigin: "left" }}
                      />

                      <motion.h3
                        className="mb-5 font-serif text-3xl font-light leading-tight text-[var(--ngi-dark)] md:text-4xl lg:text-[2.75rem]"
                        animate={{ opacity: isActive ? 1 : 0.8, scale: isActive ? 1.02 : 1 }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        style={{ transformOrigin: "left center" }}
                      >
                        {step.title}
                      </motion.h3>

                      <p className="max-w-md text-base leading-8 text-[var(--ngi-text-muted)] md:text-lg">{step.desc}</p>
                    </motion.div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </section>
  );
});

export default OurProcess;
