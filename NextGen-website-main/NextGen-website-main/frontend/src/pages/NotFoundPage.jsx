import { Link } from "react-router-dom";
import { FadeIn } from "@/components/site/Motion";

export default function NotFoundPage() {
  return (
    <div data-testid="not-found-page" className="pt-28 min-h-[80vh] flex items-center">
      <div className="ngi-container py-16 md:py-24 max-w-4xl">
        <FadeIn>
          <div className="ngi-overline mb-6"><span className="ngi-rule" />404 · Off the floor plan</div>
          <h1 className="font-serif text-6xl md:text-8xl font-light tracking-tighter leading-[0.95]">
            This page <em className="text-[#6D4C41]">was never drawn</em>.
          </h1>
          <p className="mt-8 max-w-xl text-lg text-[#1B1D22]/80 leading-relaxed">
            We could not find what you were looking for. Perhaps a wall was moved. Try returning home — or explore what we have built.
          </p>
          <div className="mt-12 flex flex-wrap gap-4">
            <Link to="/" data-testid="notfound-home" className="bg-[#0B0B0D] text-[#F7F5F2] hover:bg-[#C9A86A] hover:text-[#0B0B0D] px-10 py-5 text-[11px] tracking-[0.22em] uppercase transition-colors">Return Home</Link>
            <Link to="/portfolio" className="border border-[#0B0B0D]/30 hover:border-[#0B0B0D] px-10 py-5 text-[11px] tracking-[0.22em] uppercase transition-colors">View Portfolio</Link>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
