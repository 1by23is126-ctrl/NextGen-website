import { motion, useInView, useMotionValue, useTransform, animate, useReducedMotion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { DURATIONS, EASING, SCROLL_MARGINS, STAGGER } from "../../lib/animationConfig";

export const FadeIn = React.memo(function FadeIn({ children, delay = 0, y = 24, className = "", once = true }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      whileInView={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
      viewport={{ once, amount: 0.15, margin: `${SCROLL_MARGINS.STANDARD}px` }}
      transition={{ duration: prefersReducedMotion ? 0.15 : DURATIONS.MEDIUM / 1000, ease: EASING.PRIMARY, delay }}
      className={className}
      style={{ willChange: "transform, opacity" }}
    >
      {children}
    </motion.div>
  );
});

export const RevealText = React.memo(function RevealText({ text, className = "", delay = 0 }) {
  const words = text.split(" ");
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: `${SCROLL_MARGINS.STANDARD}px` });
  const prefersReducedMotion = useReducedMotion();

  return (
    <span ref={ref} className={`inline-block ${className}`} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom mr-[0.25em]">
          <motion.span
            initial={{ y: prefersReducedMotion ? "0%" : "110%" }}
            animate={inView ? { y: "0%" } : { y: prefersReducedMotion ? "0%" : "110%" }}
            transition={{
              duration: prefersReducedMotion ? 0.15 : DURATIONS.SLOW / 1000,
              ease: EASING.PRIMARY,
              delay: prefersReducedMotion ? 0 : delay + i * STAGGER.STANDARD,
            }}
            className="inline-block"
          >
            {w}
          </motion.span>
        </span>
      ))}
    </span>
  );
});

export function CountUp({ to = 100, duration = DURATIONS.EXTENDED, suffix = "", className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: `${SCROLL_MARGINS.LATE}px` });
  
  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);

  useEffect(() => {
    if (inView) {
      animate(count, to, {
        duration: duration / 1000,
        ease: EASING.PRIMARY,
      });
    }
  }, [inView, to, duration, count]);

  return <motion.span ref={ref} className={className}>{rounded}{suffix}</motion.span>;
}
