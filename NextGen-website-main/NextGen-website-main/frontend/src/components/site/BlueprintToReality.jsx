import { memo, useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion";

const PROCESS_STEPS = [
  {
    number: "01",
    eyebrow: "Discovery",
    title: "Understand the brief",
    subtitle: "Project foundations",
    description: "We define goals, constraints, priorities, and how the space is meant to support daily life.",
    supportingInfo: ["Client goals", "Spatial priorities", "Project constraints"],
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
    visualKind: "blueprint",
    labels: ["North light", "Primary suite", "Living axis"],
  },
  {
    number: "02",
    eyebrow: "Planning",
    title: "Organize the layout",
    subtitle: "Spatial order",
    description: "Spatial logic, circulation, and room relationships are resolved before aesthetic decisions begin.",
    supportingInfo: ["Circulation paths", "Room adjacencies", "Functional zoning"],
    image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80",
    visualKind: "materials",
    palette: ["#D8CCBD", "#8B7355", "#B9B7B0", "#5C5046"],
  },
  {
    number: "03",
    eyebrow: "Direction",
    title: "Set the design language",
    subtitle: "Material intent",
    description: "Materials, mood, tone, and architectural intent are aligned into one clear direction.",
    supportingInfo: ["Material palette", "Atmosphere", "Architectural tone"],
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
    visualKind: "render",
    labels: ["Perspective view", "Warm oak", "Ambient glow"],
  },
  {
    number: "04",
    eyebrow: "Development",
    title: "Refine the details",
    subtitle: "Technical resolution",
    description: "Joinery, finishes, lighting, and technical decisions are coordinated into a buildable system.",
    supportingInfo: ["Joinery details", "Lighting plan", "Finish coordination"],
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80",
    visualKind: "construction",
    labels: ["Site review", "Joinery mark-up", "Lighting check"],
  },
  {
    number: "05",
    eyebrow: "Execution",
    title: "Coordinate delivery",
    subtitle: "Project movement",
    description: "Selections, approvals, procurement, and site communication keep the project moving cleanly.",
    supportingInfo: ["Procurement", "Approvals", "Site coordination"],
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
    visualKind: "styling",
    labels: ["Art placement", "Textile balance", "Layered lighting"],
  },
  {
    number: "06",
    eyebrow: "Completion",
    title: "Prepare the final reveal",
    subtitle: "Final readiness",
    description: "The last layer brings clarity, cohesion, and readiness for the finished home to be experienced.",
    supportingInfo: ["Styling review", "Final checks", "Client handoff"],
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
    visualKind: "reveal",
    labels: ["Final styling", "Evening mood", "Client reveal"],
  },
];

const OBSERVER_OPTIONS = {
  root: null,
  rootMargin: "-40% 0px -40% 0px",
  threshold: [0.2, 0.4, 0.6],
};

const fadeTransition = {
  duration: 1.05,
  ease: [0.22, 1, 0.36, 1],
};

const panelTransition = {
  duration: 1.15,
  ease: [0.22, 1, 0.36, 1],
};

const staggerParentVariants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.04,
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.035,
      staggerDirection: -1,
    },
  },
};

const staggerChildVariants = {
  initial: { opacity: 0, y: 10, filter: "blur(8px)", scale: 0.992 },
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    scale: 1,
    transition: fadeTransition,
  },
  exit: {
    opacity: 0,
    y: -8,
    filter: "blur(8px)",
    scale: 0.992,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

function StepVisualOverlay({ step, shouldReduceMotion }) {
  return (
    <motion.div
      key="process-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={panelTransition}
      className="absolute inset-0"
    >
      <motion.div
        initial={{ opacity: 0.03 }}
        animate={{ opacity: 0.08 }}
        exit={{ opacity: 0.03 }}
        transition={panelTransition}
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(23,23,23,0.10),rgba(23,23,23,0.80))]"
      />
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={panelTransition}
        className="absolute left-5 right-5 bottom-5 rounded-[18px] border border-white/10 bg-black/14 px-4 py-3 backdrop-blur-sm md:left-7 md:right-7 md:bottom-7 md:px-5 md:py-4"
      >
        <div className="flex items-end justify-between gap-4">
          <div className="min-w-0">
            <div className="text-[10px] uppercase tracking-[0.22em] text-[#C8A46A]">{step.eyebrow}</div>
            <div className="mt-1 font-serif text-lg font-light leading-tight text-white md:text-xl">{step.title}</div>
          </div>
          <div className="shrink-0 text-right">
            <div className="font-serif text-xl font-light text-[#C8A46A] md:text-[1.75rem]">{step.number}</div>
            <div className="mt-2 h-px w-10 bg-white/24 md:w-12">
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={panelTransition}
                className="h-full origin-left bg-[#C8A46A]"
              />
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

const BlueprintToReality = memo(function BlueprintToReality() {
  const sectionRef = useRef(null);
  const stepRefs = useRef([]);
  const [activeStep, setActiveStep] = useState(0);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 70,
    damping: 24,
    mass: 0.35,
  });

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const visibleEntries = entries
        .filter((entry) => entry.isIntersecting)
        .sort((entryA, entryB) => entryB.intersectionRatio - entryA.intersectionRatio);

      if (!visibleEntries.length) {
        return;
      }

      const nextStep = Number(visibleEntries[0].target.getAttribute("data-step-index"));
      if (Number.isNaN(nextStep)) {
        return;
      }

      setActiveStep((currentStep) => (currentStep === nextStep ? currentStep : nextStep));
    }, OBSERVER_OPTIONS);

    const currentStepRefs = stepRefs.current.filter(Boolean);
    currentStepRefs.forEach((stepRef) => observer.observe(stepRef));

    return () => {
      currentStepRefs.forEach((stepRef) => observer.unobserve(stepRef));
      observer.disconnect();
    };
  }, []);

  const activeProcessStep = PROCESS_STEPS[activeStep] ?? PROCESS_STEPS[0];
  const imageAnimation = {};
  const imageTransition = shouldReduceMotion
    ? { duration: 0.3 }
    : { duration: 18, repeat: Infinity, ease: "easeInOut" };

  return (
    <section ref={sectionRef} className="relative bg-[#171717] text-white" data-testid="blueprint-to-reality">
      <div className="ngi-container w-full max-w-[1500px] py-12 md:py-16 lg:py-18">
        <div className="mb-16 grid gap-8 lg:grid-cols-[minmax(0,0.35fr)_minmax(0,0.65fr)] lg:items-end lg:gap-14 lg:mb-20">
          <div className="min-w-0">
            <div className="ngi-overline mb-4 lg:mb-5">
              <span className="ngi-rule" />Our Process
            </div>
            <h2
              className="max-w-[16ch] font-serif font-light leading-[1.04] text-white"
              style={{ fontSize: "clamp(1.5rem, 2.7vw, 2.75rem)" }}
            >
              Every stage reveals a different layer of the project.
            </h2>
          </div>
          <p className="min-w-0 max-w-[34rem] text-base leading-8 text-white/66 md:text-lg lg:pl-1">
            The structure stays fixed and readable while the visual language, pacing, and details shift with each stage of the process.
          </p>
        </div>

        <div className="grid gap-14 lg:grid-cols-[minmax(0,0.6fr)_minmax(0,0.4fr)] lg:gap-16">
          <div className="relative min-w-0">
            <div className="lg:sticky lg:top-10 lg:flex lg:h-[calc(100svh-5rem)] lg:items-center">
              <motion.div
                layout
                transition={panelTransition}
                className="relative w-full min-w-0 overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03] p-4 md:aspect-[3/2.3] md:p-5 lg:aspect-[3/2.3] lg:p-5"
              >
                <div className="absolute inset-0">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeProcessStep.number}
                      initial={{ opacity: 0, scale: 1.02, filter: shouldReduceMotion ? "blur(0px)" : "blur(8px)" }}
                      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                      exit={{ opacity: 0, scale: 0.995, filter: shouldReduceMotion ? "blur(0px)" : "blur(8px)" }}
                      transition={panelTransition}
                      className="absolute inset-0"
                    >
                      <motion.div
                        layout
                        animate={imageAnimation}
                        transition={imageTransition}
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${activeProcessStep.image})` }}
                      />
                      <motion.div
                        initial={{ opacity: 0.65 }}
                        animate={{ opacity: 0.88 }}
                        exit={{ opacity: 0.65 }}
                        transition={panelTransition}
                        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(23,23,23,0.06),rgba(23,23,23,0.82))]"
                      />
                      <StepVisualOverlay step={activeProcessStep} shouldReduceMotion={shouldReduceMotion} />
                    </motion.div>
                  </AnimatePresence>
                </div>
                <div className="relative mt-3 h-px w-full overflow-hidden rounded-full bg-white/10" aria-hidden="true">
                  <motion.div className="h-full origin-left rounded-full bg-[#C8A46A]" style={{ scaleX: smoothProgress }} />
                </div>

                <div className="relative mt-6 flex items-start justify-between gap-4">
                  <AnimatePresence mode="wait">
                    <motion.div
                      layout
                      key={`${activeProcessStep.number}-heading`}
                      initial={{ opacity: 0, y: 14, filter: shouldReduceMotion ? "blur(0px)" : "blur(8px)", scale: 0.992 }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
                      exit={{ opacity: 0, y: -12, filter: shouldReduceMotion ? "blur(0px)" : "blur(8px)", scale: 0.992 }}
                      transition={panelTransition}
                    >
                      <div className="text-[11px] uppercase tracking-[0.22em] text-[#C8A46A]">
                        {activeProcessStep.eyebrow}
                      </div>
                      <h3 className="mt-2 max-w-[12ch] font-serif text-[clamp(1.35rem,1.8vw,2.2rem)] font-light leading-tight text-white">
                        {activeProcessStep.title}
                      </h3>
                    </motion.div>
                  </AnimatePresence>
                  <AnimatePresence mode="wait">
                    <motion.div
                      layout
                      key={`${activeProcessStep.number}-number`}
                      initial={{ opacity: 0, scale: 0.98, filter: shouldReduceMotion ? "blur(0px)" : "blur(8px)" }}
                      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                      exit={{ opacity: 0, scale: 1.01, filter: shouldReduceMotion ? "blur(0px)" : "blur(8px)" }}
                      transition={panelTransition}
                      className="shrink-0 font-serif text-xl text-[#C8A46A] md:text-[1.75rem]"
                    >
                      {activeProcessStep.number}
                    </motion.div>
                  </AnimatePresence>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    layout
                    key={`${activeProcessStep.number}-body`}
                    variants={staggerParentVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="relative"
                    aria-live="polite"
                  >
                    <motion.p variants={staggerChildVariants} className="mt-4 max-w-[30rem] text-[15px] leading-7 text-white/72 md:text-base">
                      {activeProcessStep.description}
                    </motion.p>
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            </div>
          </div>

          <div className="relative min-w-0">
            {PROCESS_STEPS.map((step, index) => {
              const isActive = index === activeStep;

              return (
                <motion.section
                  layout
                  key={step.number}
                  ref={(node) => {
                    stepRefs.current[index] = node;
                  }}
                  data-step-index={index}
                  className="flex min-h-[100svh] items-center py-10"
                  aria-labelledby={`process-step-${step.number}`}
                >
                  <motion.div
                    layout
                    initial={false}
                    animate={{
                      opacity: isActive ? 1 : 0.72,
                      filter: isActive || shouldReduceMotion ? "blur(0px)" : "blur(0.6px)",
                    }}
                    transition={panelTransition}
                    className={`ml-auto w-full max-w-[30rem] min-w-0 rounded-[28px] border p-6 md:p-7 lg:p-8 ${isActive ? "border-white/16 bg-white/[0.04]" : "border-white/8 bg-white/[0.02]"}`}
                  >
                    <motion.div layout className="text-[10px] uppercase tracking-[0.22em] text-[#C8A46A] md:text-[11px]">
                      {step.eyebrow}
                    </motion.div>
                    <motion.div layout className="mt-3 font-serif text-4xl font-light leading-none text-white/18 md:text-5xl lg:text-6xl">
                      {step.number}
                    </motion.div>
                    <motion.h3
                      id={`process-step-${step.number}`}
                      layout
                      className="mt-3 max-w-[12ch] font-serif text-[clamp(1.35rem,1.8vw,2.15rem)] font-light leading-tight text-white"
                    >
                      {step.title}
                    </motion.h3>
                    <motion.p layout className="mt-3 max-w-[24rem] text-[14px] leading-7 text-white/68 md:text-[15px]">
                      {step.description}
                    </motion.p>
                  </motion.div>
                </motion.section>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
});

export default BlueprintToReality;