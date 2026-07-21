import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { FadeIn } from "@/components/site/Motion";

const FAQS = [
  { cat: "Getting started", q: "How do we begin working with NextGen?", a: "Book a consultation. The first ninety minutes is free, on us, in our studio or yours. We will leave you with an honest sense of whether we are the right studio for you." },
  { cat: "Getting started", q: "What is the minimum project size you take?", a: "Residences from approximately 1,800 sq ft and commercial fit-outs from 800 sq ft, though exceptions exist for projects that excite us." },
  { cat: "Fees", q: "How are your fees structured?", a: "Two ways. Design-only briefs are charged as a percentage of the build value. Turnkey briefs are quoted as a single fixed fee that covers design, procurement and execution." },
  { cat: "Fees", q: "What is a typical residential project cost?", a: "Most residential projects fall between ₹2,500 and ₹5,500 per sq ft fully delivered, depending on material specification, custom millwork and brief complexity." },
  { cat: "Timeline", q: "How long does a full residence take?", a: "Six to fourteen months end to end, depending on scope and site. We commit to a date in writing and protect it." },
  { cat: "Timeline", q: "Can we live in the home during the renovation?", a: "Sometimes, with phased work. We will be honest about when it works well and when it doesn't." },
  { cat: "Working together", q: "Do you work outside Bengaluru?", a: "Yes — we have completed projects in fourteen cities across India, with a small site team that travels for the duration of the project." },
  { cat: "Working together", q: "Will I work with the senior designer who pitched the project?", a: "Yes. The lead designer who draws the first sketch will be there for handover. We do not bait-and-switch." },
  { cat: "Aftercare", q: "Do you offer a warranty?", a: "Yes — a five-year remedial visit programme covering settlement, joinery adjustments, hardware and finishes." },
  { cat: "Aftercare", q: "Can you furnish around an existing collection?", a: "Often yes. We will tell you honestly which pieces deserve to stay and which deserve a new home." },
];

export default function FAQPage() {
  const [open, setOpen] = useState(0);
  const categories = Array.from(new Set(FAQS.map((f) => f.cat)));
  return (
    <div data-testid="faq-page" className="pt-28">
      <section className="ngi-page-hero">
        <FadeIn>
          <div className="ngi-overline mb-6"><span className="ngi-rule" />Frequently asked</div>
          <h1 className="ngi-page-title max-w-4xl">
            The questions we are <em className="text-[#707070]">often asked</em>.
          </h1>
        </FadeIn>
      </section>

      <section className="ngi-container pb-24 md:pb-32 grid grid-cols-1 md:grid-cols-12 gap-12">
        <FadeIn className="md:col-span-3">
          <div className="ngi-overline mb-4"><span className="ngi-rule" />Topics</div>
          <ul className="space-y-2">
            {categories.map((c) => (
              <li key={c} className="text-[#1E1E1E]/70 text-sm">— {c}</li>
            ))}
          </ul>
        </FadeIn>

        <div className="md:col-span-8 md:col-start-5 divide-y divide-[#171717]/15 border-t border-b border-[#171717]/15">
          {FAQS.map((f, i) => (
            <div key={i}>
              <button
                onClick={() => setOpen(open === i ? -1 : i)}
                data-testid={`faq-${i}`}
                className="w-full text-left py-7 flex items-start justify-between gap-6"
              >
                <div className="flex-1">
                  <div className="ngi-page-label mb-2">{f.cat}</div>
                  <h3 className="font-serif text-xl md:text-2xl font-light">{f.q}</h3>
                </div>
                {open === i ? <Minus size={20} className="text-[#C8A46A] mt-1" /> : <Plus size={20} className="text-[#C8A46A] mt-1" />}
              </button>
              <div
                className="grid transition-all duration-300 ease-in-out"
                style={{
                  gridTemplateRows: open === i ? "1fr" : "0fr",
                  opacity: open === i ? 1 : 0,
                }}
              >
                <div className="overflow-hidden">
                  <p className="pb-7 text-[#1E1E1E]/80 leading-relaxed max-w-2xl">{f.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="ngi-section ngi-container">
        <div className="bg-[#171717] text-white p-12 md:p-20 text-center ngi-grain">
          <h2 className="ngi-section-heading max-w-2xl mx-auto">A question we haven't answered?</h2>
          <Link to="/contact" className="inline-flex mt-8 ngi-button-accent">
            Write to us →
          </Link>
        </div>
      </section>
    </div>
  );
}
