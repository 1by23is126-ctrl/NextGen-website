import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export default function CursorFX() {
  const isTouchDevice = useMemo(() => {
    if (typeof window === "undefined") return true;
    return (
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia("(pointer: coarse)").matches
    );
  }, []);

  const pointerX = useMotionValue(-100);
  const pointerY = useMotionValue(-100);
  const springX = useSpring(pointerX, { stiffness: 160, damping: 24 });
  const springY = useSpring(pointerY, { stiffness: 160, damping: 24 });
  const offsetX = useTransform(springX, (value) => value - 30);
  const offsetY = useTransform(springY, (value) => value - 30);
  const [hovered, setHovered] = useState(false);
  const activeMagnetic = useRef(null);
  const cachedRect = useRef(null);
  const magneticRAF = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined" || isTouchDevice) return;

    // Throttled magnetic calculation using RAF - PERFORMANCE FIX
    let lastX = 0;
    let lastY = 0;

    const updateMagneticThrottled = (clientX, clientY) => {
      if (!activeMagnetic.current) return;
      
      // Only recalculate rect if element changed or hasn't been cached
      if (!cachedRect.current) {
        cachedRect.current = activeMagnetic.current.getBoundingClientRect();
      }

      const rect = cachedRect.current;
      const offsetX = ((clientX - rect.left) / rect.width - 0.5) * 16;
      const offsetY = ((clientY - rect.top) / rect.height - 0.5) * 8;
      activeMagnetic.current.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0)`;
    };

    const updateCursor = (event) => {
      pointerX.set(event.clientX);
      pointerY.set(event.clientY);
      lastX = event.clientX;
      lastY = event.clientY;

      // Throttle magnetic calculation with RAF
      if (activeMagnetic.current && !magneticRAF.current) {
        magneticRAF.current = requestAnimationFrame(() => {
          updateMagneticThrottled(lastX, lastY);
          magneticRAF.current = null;
        });
      }
    };

    const onPointerOver = (event) => {
      const target = event.target.closest("a,button,.ngi-image-zoom,.magnetic");
      if (target) {
        setHovered(true);
      }
      const magnetic = event.target.closest(".magnetic");
      if (magnetic) {
        activeMagnetic.current = magnetic;
        cachedRect.current = magnetic.getBoundingClientRect();
        magnetic.style.transition = "transform 0.22s cubic-bezier(0.22, 1, 0.36, 1)";
      }
    };

    const onPointerOut = (event) => {
      const related = event.relatedTarget;
      const staysHovered = related && related.closest && related.closest("a,button,.ngi-image-zoom,.magnetic");
      if (!staysHovered) {
        setHovered(false);
      }
      const magnetic = event.target.closest(".magnetic");
      if (magnetic && activeMagnetic.current === magnetic) {
        magnetic.style.transform = "";
        activeMagnetic.current = null;
        cachedRect.current = null;
        if (magneticRAF.current) {
          cancelAnimationFrame(magneticRAF.current);
          magneticRAF.current = null;
        }
      }
    };

    window.addEventListener("pointermove", updateCursor);
    window.addEventListener("pointerover", onPointerOver);
    window.addEventListener("pointerout", onPointerOut);

    return () => {
      window.removeEventListener("pointermove", updateCursor);
      window.removeEventListener("pointerover", onPointerOver);
      window.removeEventListener("pointerout", onPointerOut);
      if (activeMagnetic.current) {
        activeMagnetic.current.style.transform = "";
      }
      if (magneticRAF.current) {
        cancelAnimationFrame(magneticRAF.current);
      }
    };
  }, [isTouchDevice, pointerX, pointerY]);

  if (isTouchDevice) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 z-10 pointer-events-none hidden lg:block"
      style={{
        x: offsetX,
        y: offsetY,
        width: 60,
        height: 60,
        borderRadius: "9999px",
        scale: hovered ? 1 : 0.4,
        backgroundColor: hovered ? "rgba(201,168,106,0.18)" : "rgba(255,255,255,0.08)",
        border: hovered ? "1px solid #C9A86A" : "1px solid rgba(255,255,255,0.5)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        transformOrigin: "center",
        willChange: "transform",
      }}
      transition={{ type: "spring", stiffness: 260, damping: 28 }}
    />
  );
}
