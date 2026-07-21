import { Link } from "react-router-dom";
import { FadeIn } from "@/components/site/Motion";

const STEPS = [
  { n: "01", t: "Discovery", d: "We spend three weeks understanding how you live before we draw anything. We will ask about your morning routine, your favourite room in any house, the dealbreakers nobody else has thought to ask about.", img: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600" },
  { n: "02", t: "Concept", d: "A single direction, drawn deeply. We do not present three mood boards as a portfolio. We commit to one idea and defend it.", img: "https://images.pexels.com/photos/13201479/pexels-photo-13201479.jpeg" },
  { n: "03", t: "Design Development", d: "Every joint, every section, every finish — drawn, sampled, signed off. Material samples reviewed in our studio. Lighting mocked up. Furniture proportioned.", img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1600" },
  { n: "04", t: "Procurement", d: "Materials and furnishings curated and ordered from our studio. Lead times protected. Quality checks pre-dispatch.", img: "https://images.pexels.com/photos/7515855/pexels-photo-7515855.png" },
  { n: "05", t: "Execution", d: "Our site team manages every trade — masonry, joinery, electrical, plumbing, paint. You see weekly photographic progress.", img: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1600" },
  { n: "06", t: "Styling & Handover", d: "We style the home for you — flowers, books, throws, art. You move into a photographed work, not a construction site.", img: "https://images.pexels.com/photos/34538288/pexels-photo-34538288.jpeg" },
];

export default function ProcessPage() {
  return (
    <div data-testid="process-page" className="pt-28">
      <section className="ngi-page-hero">
        <FadeIn>
          <div className="ngi-overline mb-6"><span className="ngi-rule" />Process</div>
          <h1 className="ngi-page-title max-w-4xl">
            Six stages. <em className="text-[#707070]">Unhurried by design.</em>
          </h1>
          <p className="mt-8 max-w-2xl ngi-page-body">
            We have refined this process across two hundred and forty projects. It is the architecture behind the architecture.
          </p>
        </FadeIn>
      </section>

      <section className="ngi-container pb-24 md:pb-32">
        <div className="space-y-32 md:space-y-40">
          {STEPS.map((s, i) => (
            <FadeIn key={s.n} className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center" delay={0}>
              <div className={`md:col-span-6 ${i % 2 === 1 ? "md:order-2" : ""}`}>
                <div className="ngi-image-zoom aspect-[4/5]">
                  <img src={s.img} alt={s.t} className="w-full h-full object-cover" loading="lazy" />
                </div>
              </div>
              <div className={`md:col-span-5 ${i % 2 === 1 ? "md:col-start-1" : "md:col-start-8"}`}>
                <div className="font-serif text-7xl md:text-9xl text-[#C8A46A] font-light mb-6 leading-none">{s.n}</div>
                <h2 className="font-serif text-4xl md:text-5xl font-light mb-6">{s.t}</h2>
                <p className="text-base md:text-lg leading-relaxed text-[#1E1E1E]/80 max-w-md">{s.d}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      <section className="ngi-section ngi-container">
        <div className="bg-[#171717] text-white p-12 md:p-20 ngi-grain">
          <h2 className="ngi-section-heading max-w-2xl">Ready to begin?</h2>
          <Link to="/consultation" className="inline-flex mt-8 ngi-button-accent">
            Book a Consultation →
          </Link>
        </div>
      </section>
    </div>
  );
}
