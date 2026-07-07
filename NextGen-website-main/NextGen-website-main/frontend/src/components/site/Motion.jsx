import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { DURATIONS, EASING, SCROLL_MARGINS, STAGGER } from "../../lib/animationConfig";

export function FadeIn({ children, delay = 0, y = 24, className = "", once = true }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: `${SCROLL_MARGINS.STANDARD}px` }}
      transition={{ duration: DURATIONS.MEDIUM / 1000, ease: EASING.PRIMARY, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function RevealText({ text, className = "", delay = 0 }) {
  const words = text.split(" ");
  return (
    <span className={`inline-block ${className}`} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom mr-[0.25em]">
          <motion.span
            initial={{ y: "110%" }}
            whileInView={{ y: "0%" }}
            viewport={{ once: true, margin: `${SCROLL_MARGINS.STANDARD}px` }}
            transition={{ 
              duration: DURATIONS.SLOW / 1000, 
              ease: EASING.PRIMARY, 
              delay: delay + i * STAGGER.STANDARD 
            }}
            className="inline-block"
          >
            {w}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

export function CountUp({ to = 100, duration = DURATIONS.EXTENDED, suffix = "", className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: `${SCROLL_MARGINS.LATE}px` });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    let raf;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(Math.round(eased * to));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration]);
  return <span ref={ref} className={className}>{val}{suffix}</span>;
}
