import { Link } from "react-router-dom";
import { FadeIn } from "@/components/site/Motion";

export default function NotFoundPage() {
  return (
    <div data-testid="not-found-page" className="pt-28 min-h-[80vh] flex items-center">
      <div className="ngi-page-hero max-w-4xl">
        <FadeIn>
          <div className="ngi-overline mb-6"><span className="ngi-rule" />404 · Off the floor plan</div>
          <h1 className="ngi-page-title-lg max-w-none">
            This page <em className="text-[#707070]">was never drawn</em>.
          </h1>
          <p className="mt-8 max-w-xl ngi-page-body">
            We could not find what you were looking for. Perhaps a wall was moved. Try returning home — or explore what we have built.
          </p>
          <div className="mt-12 flex flex-wrap gap-4">
            <Link to="/" data-testid="notfound-home" className="ngi-button-primary">Return Home</Link>
            <Link to="/portfolio" className="ngi-button-secondary">View Portfolio</Link>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
