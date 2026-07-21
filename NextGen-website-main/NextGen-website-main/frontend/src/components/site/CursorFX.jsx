import { useEffect, useMemo, useRef } from "react";

/**
 * Lightweight custom cursor.
 * - No Framer Motion, no spring physics, no React re-renders on movement.
 * - A single rAF loop lerps the dot toward the pointer and writes
 *   translate3d directly to the DOM node (GPU-composited, no layout/paint cost).
 * - Magnetic pull is only computed while actively hovering a `.magnetic` element.
 */
export default function CursorFX() {
  const isTouchDevice = useMemo(() => {
    if (typeof window === "undefined") return true;
    return (
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia("(pointer: coarse)").matches
    );
  }, []);

  const dotRef = useRef(null);
  const target = useRef({ x: -100, y: -100 });
  const current = useRef({ x: -100, y: -100 });
  const hovered = useRef(false);
  const activeMagnetic = useRef(null);
  const cachedRect = useRef(null);
  const rafId = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined" || isTouchDevice) return;

    const updateCursor = (event) => {
      target.current.x = event.clientX;
      target.current.y = event.clientY;

      if (activeMagnetic.current) {
        if (!cachedRect.current) {
          cachedRect.current = activeMagnetic.current.getBoundingClientRect();
        }
        const rect = cachedRect.current;
        const offsetX = ((event.clientX - rect.left) / rect.width - 0.5) * 16;
        const offsetY = ((event.clientY - rect.top) / rect.height - 0.5) * 8;
        activeMagnetic.current.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0)`;
      }
    };

    const onPointerOver = (event) => {
      const target = event.target.closest("a,button,.ngi-image-zoom,.magnetic");
      hovered.current = !!target;

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
      if (!staysHovered) hovered.current = false;

      const magnetic = event.target.closest(".magnetic");
      if (magnetic && activeMagnetic.current === magnetic) {
        magnetic.style.transform = "";
        activeMagnetic.current = null;
        cachedRect.current = null;
      }
    };

    // Single rAF loop: lerp toward the pointer and write translate3d directly.
    // This replaces spring physics with a cheap, constant-cost linear interpolation.
    const tick = () => {
      current.current.x += (target.current.x - current.current.x) * 0.22;
      current.current.y += (target.current.y - current.current.y) * 0.22;

      if (dotRef.current) {
        const scale = hovered.current ? 1 : 0.4;
        dotRef.current.style.transform = `translate3d(${current.current.x - 30}px, ${current.current.y - 30}px, 0) scale(${scale})`;
        dotRef.current.style.backgroundColor = hovered.current ? "rgba(201,168,106,0.18)" : "rgba(255,255,255,0.08)";
        dotRef.current.style.borderColor = hovered.current ? "#C8A46A" : "rgba(255,255,255,0.5)";
      }
      rafId.current = requestAnimationFrame(tick);
    };
    rafId.current = requestAnimationFrame(tick);

    window.addEventListener("pointermove", updateCursor);
    window.addEventListener("pointerover", onPointerOver);
    window.addEventListener("pointerout", onPointerOut);

    return () => {
      window.removeEventListener("pointermove", updateCursor);
      window.removeEventListener("pointerover", onPointerOver);
      window.removeEventListener("pointerout", onPointerOut);
      if (activeMagnetic.current) activeMagnetic.current.style.transform = "";
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [isTouchDevice]);

  if (isTouchDevice) return null;

  return (
    <div
      ref={dotRef}
      className="fixed top-0 left-0 z-10 pointer-events-none hidden lg:block rounded-full"
      style={{
        width: 60,
        height: 60,
        border: "1px solid rgba(255,255,255,0.5)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        transformOrigin: "center",
        willChange: "transform",
        transform: "translate3d(-100px, -100px, 0) scale(0.4)",
        transition: "background-color 0.2s ease, border-color 0.2s ease",
      }}
    />
  );
}
