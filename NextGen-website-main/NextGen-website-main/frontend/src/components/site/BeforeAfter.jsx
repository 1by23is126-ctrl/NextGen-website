import { useEffect, useRef, useState } from "react";

export default function BeforeAfter({ before, after, labelBefore = "Before", labelAfter = "After" }) {
  const [pos, setPos] = useState(50);
  const ref = useRef(null);
  const dragging = useRef(false);
  const autoDemo = useRef(true);
  const timeouts = useRef([]);

  useEffect(() => {
    const animate = [20, 80, 50];
    timeouts.current.push(
      window.setTimeout(() => {
        if (!autoDemo.current) return;
        setPos(animate[0]);
      }, 500),
    );
    timeouts.current.push(
      window.setTimeout(() => {
        if (!autoDemo.current) return;
        setPos(animate[1]);
      }, 1300),
    );
    timeouts.current.push(
      window.setTimeout(() => {
        if (!autoDemo.current) return;
        setPos(animate[2]);
      }, 2100),
    );
    return () => timeouts.current.forEach((id) => window.clearTimeout(id));
  }, []);

  const stopAuto = () => {
    if (!autoDemo.current) return;
    autoDemo.current = false;
    timeouts.current.forEach((id) => window.clearTimeout(id));
    timeouts.current = [];
  };

  const move = (clientX) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(0, Math.min(100, x)));
  };

  const onDown = (e) => {
    stopAuto();
    dragging.current = true;
    move(e.clientX ?? e.touches?.[0]?.clientX);
  };
  const onMove = (e) => {
    if (!dragging.current) return;
    move(e.clientX ?? e.touches?.[0]?.clientX);
  };
  const onUp = () => {
    dragging.current = false;
  };

  return (
    <div
      ref={ref}
      data-testid="before-after-slider"
      onMouseDown={onDown}
      onMouseMove={onMove}
      onMouseUp={onUp}
      onMouseLeave={onUp}
      onTouchStart={onDown}
      onTouchMove={onMove}
      onTouchEnd={onUp}
      className="relative w-full aspect-[16/10] overflow-hidden select-none cursor-ew-resize bg-[#0B0B0D]"
    >
      <img src={after} alt={labelAfter} className="absolute inset-0 w-full h-full object-cover" />
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${pos}%`, transition: "width 0.08s ease-out" }}
      >
        <img
          src={before}
          alt={labelBefore}
          className="absolute inset-0 h-full object-cover"
          style={{ width: `${100 / (pos / 100)}%`, maxWidth: "none", transition: "width 0.08s ease-out" }}
        />
      </div>
      <div
        className="absolute top-0 bottom-0 w-px bg-[#F7F5F2] shadow-[0_0_0_1px_rgba(11,11,13,0.3)]"
        style={{ left: `${pos}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-[#F7F5F2] border border-[#0B0B0D]/20 flex items-center justify-center">
          <span className="text-[#0B0B0D] text-xs tracking-widest">↔</span>
        </div>
      </div>
      <div className="absolute top-4 left-4 text-[10px] tracking-[0.24em] uppercase text-[#F7F5F2] bg-[#0B0B0D]/60 px-3 py-1.5">{labelBefore}</div>
      <div className="absolute top-4 right-4 text-[10px] tracking-[0.24em] uppercase text-[#F7F5F2] bg-[#0B0B0D]/60 px-3 py-1.5">{labelAfter}</div>
    </div>
  );
}
