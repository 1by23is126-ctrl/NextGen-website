import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { FadeIn } from "@/components/site/Motion";

/**
 * BlueprintToReality Component - FIXED VERSION
 * Signature experience: 6-step scroll-driven transformation from architectural blueprint to completed luxurious space
 * This is the WOW moment that defines the brand identity
 *
 * FIX: Blueprint overlay now properly removed from DOM when hidden to prevent rendering artifacts
 */
export default function BlueprintToReality() {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  // Calculate progress through 6 steps (0-1 maps to step 0-6)
  const step = useTransform(scrollYProgress, [0, 1], [0, 6]);

  // Background image transitions for the transformation
  const stageTwoOpacity = useTransform(step, [1.2, 2.8, 3.8], [0, 1, 0]);
  const stageThreeOpacity = useTransform(step, [3.4, 4.6, 5.8], [0, 1, 1]);

  // Walls opacity and scale (appears at step 2)
  const wallsOpacity = useTransform(step, [1.2, 1.8, 5], [0, 1, 1]);

  // Furniture opacity and scale (appears at step 3)
  const furnitureOpacity = useTransform(step, [2.2, 2.8, 5], [0, 1, 1]);

  // Lighting overlay (appears at step 4)
  const lightingOpacity = useTransform(step, [3.2, 3.8, 5], [0, 0.28, 0.28]);

  // Textures overlay (appears at step 5)
  const texturesOpacity = useTransform(step, [4.2, 4.8], [0, 0.15]);

  // Final completed space text block (fades in at step 6)
  const finalOpacity = useTransform(step, [5.2, 5.8], [0, 1]);

  // Slight scale animations for smoothness
  const wallsScale = useTransform(step, [1.2, 1.8], [0.95, 1]);
  const furnitureScale = useTransform(step, [2.2, 2.8], [0.95, 1]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[250vh] bg-gradient-to-b from-[#F7F5F2] via-[#E6E0D8]/30 to-[#F7F5F2]"
      data-testid="blueprint-to-reality"
    >
      {/* Sticky container for the transformation visualization */}
      <div className="sticky top-0 h-screen overflow-hidden bg-[#F7F5F2]">
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Step indicators - subtle text on top right */}
          <motion.div className="absolute top-12 right-12 z-10 text-right">
            <motion.div className="text-[12px] tracking-[0.2em] uppercase text-[#0B0B0D]/40 font-light">
              <motion.span>
                <motion.span
                  style={{
                    opacity: useTransform(step, [0, 1.5], [1, 0]),
                  }}
                >
                  Step 1: Blueprint
                </motion.span>
                <motion.span
                  style={{
                    opacity: useTransform(step, [1.2, 1.8, 3], [0, 1, 0]),
                  }}
                >
                  {"\n"}Step 2: Architecture
                </motion.span>
                <motion.span
                  style={{
                    opacity: useTransform(step, [2.2, 2.8, 4], [0, 1, 0]),
                  }}
                >
                  {"\n"}Step 3: Furnishing
                </motion.span>
                <motion.span
                  style={{
                    opacity: useTransform(step, [3.2, 3.8, 5], [0, 1, 0]),
                  }}
                >
                  {"\n"}Step 4: Illumination
                </motion.span>
                <motion.span
                  style={{
                    opacity: useTransform(step, [4.2, 4.8, 5.5], [0, 1, 0]),
                  }}
                >
                  {"\n"}Step 5: Finishes
                </motion.span>
                <motion.span
                  style={{
                    opacity: useTransform(step, [5.2, 5.8], [0, 1]),
                  }}
                >
                  {"\n"}Complete
                </motion.span>
              </motion.span>
            </motion.div>
          </motion.div>

          {/* Main transformation container */}
          <div className="relative w-full h-full flex items-center justify-center px-6 md:px-12 lg:px-24 bg-gradient-to-br from-[#F7F5F2] via-[#F5F1E8] to-[#F0EBE0]">
            {/* Base/Background layer */}
            <div className="absolute inset-0 w-full h-full">
              <motion.img
                src="https://images.pexels.com/photos/34538288/pexels-photo-34538288.jpeg"
                alt="Minimal interior in progress"
                className="absolute inset-0 w-full h-full object-cover"
                style={{ opacity: stageTwoOpacity, willChange: "opacity" }}
                loading="lazy"
              />
              <motion.img
                src="https://images.pexels.com/photos/13201479/pexels-photo-13201479.jpeg"
                alt="Final completed space"
                className="absolute inset-0 w-full h-full object-cover"
                style={{ opacity: stageThreeOpacity, willChange: "opacity" }}
                loading="lazy"
              />
            </div>

            {/* Step 2-3: Architectural elements layer */}
            <motion.div
              style={{ opacity: wallsOpacity, scale: wallsScale, willChange: "opacity, transform" }}
              className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#E6E0D8] via-[#F7F5F2] to-[#E6E0D8] opacity-40" />
              <div className="absolute inset-0 border-4 border-[#C9A86A]/20" />
            </motion.div>

            {/* Step 3: Furniture silhouettes */}
            <motion.div
              style={{ opacity: furnitureOpacity, scale: furnitureScale, willChange: "opacity, transform" }}
              className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none"
            >
              <div className="absolute inset-0 bg-gradient-radial from-[#0B0B0D]/5 to-transparent" />
            </motion.div>

            {/* Step 4: Lighting effect (warm glow) */}
            <motion.div
              style={{ opacity: lightingOpacity, willChange: "opacity" }}
              className="absolute inset-0 w-full h-full pointer-events-none"
            >
              <div className="absolute top-0 left-1/3 w-96 h-96 bg-gradient-radial from-[#C9A86A]/20 to-transparent blur-3xl" />
              <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-radial from-[#C9A86A]/15 to-transparent blur-3xl" />
            </motion.div>

            {/* Step 5: Texture overlay (subtle) */}
            <motion.div
              style={{ opacity: texturesOpacity, willChange: "opacity" }}
              className="absolute inset-0 w-full h-full pointer-events-none"
            >
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%223%22 /%3E%3C/filter%3E%3Crect width=%2260%22 height=%2260%22 fill=%22%23000%22 filter=%22url(%23noise)%22 opacity=%220.02%22/%3E%3C/svg%3E')",
                  backgroundRepeat: "repeat",
                }}
              />
            </motion.div>

            {/* Step 6: Final completed space fade in */}
            <motion.div
              style={{ opacity: finalOpacity, willChange: "opacity" }}
              className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-[#0B0B0D]/0 via-[#0B0B0D]/0 to-[#0B0B0D]/20" />
              <motion.div className="relative w-full h-full flex items-end justify-start p-12">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1 }}
                  className="max-w-md z-10"
                >
                  <div className="text-[11px] tracking-[0.22em] uppercase text-[#C9A86A] mb-4">The Complete Vision</div>
                  <h3 className="font-serif text-4xl md:text-5xl text-[#0B0B0D] font-light leading-tight mb-4">
                    A space that evolves with you
                  </h3>
                  <p className="text-[#0B0B0D]/70 text-sm leading-relaxed">
                    Every detail, from the blueprint to the final finish, is designed to create an environment that holds a quiet conversation with the people inside it.
                  </p>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll guide text - visible during scroll */}
      <div className="fixed bottom-12 left-12 z-40 pointer-events-none hidden lg:block">
        <motion.div
          style={{
            opacity: useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]),
          }}
          className="text-[12px] tracking-[0.2em] uppercase text-[#0B0B0D]/50 font-light"
        >
          Scroll to reveal the transformation
        </motion.div>
      </div>

      {/* Content section below the sticky transformation */}
      <div className="relative bg-[#F7F5F2] py-24 md:py-32 lg:py-40">
        <div className="ngi-container">
          <FadeIn className="max-w-3xl">
            <div className="ngi-overline mb-4">
              <span className="ngi-rule" />Our Process
            </div>
            <h2 className="font-serif text-5xl md:text-6xl lg:text-7xl font-light tracking-tighter leading-[1.05] max-w-4xl mb-8">
              From vision to reality in six considered steps.
            </h2>
            <p className="text-lg md:text-xl text-[#0B0B0D]/70 leading-relaxed max-w-2xl">
              What you've just witnessed isn't just an animation—it's our design philosophy made visible. We begin where every great project begins: with an idea. Then we build it with intention, craft, and an obsessive attention to every detail.
            </p>
          </FadeIn>

          {/* Quick process overview */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                num: "01",
                title: "Discovery",
                desc: "We listen more than we speak. Understanding how you live is where every great space begins.",
              },
              {
                num: "02",
                title: "Design",
                desc: "Every line, every material, every joint is drawn and reconsidered until it feels inevitable.",
              },
              {
                num: "03",
                title: "Execute",
                desc: "We see it through to completion. The finished space should feel like it always belonged.",
              },
            ].map((p, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="border-t border-[#0B0B0D]/10 pt-6">
                  <div className="text-6xl font-serif text-[#C9A86A] font-light mb-4">{p.num}</div>
                  <h3 className="font-serif text-2xl md:text-3xl font-light mb-3">{p.title}</h3>
                  <p className="text-sm leading-relaxed text-[#0B0B0D]/70">{p.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
