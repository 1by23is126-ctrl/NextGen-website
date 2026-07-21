import { Quote } from "lucide-react";
import { FadeIn } from "@/components/site/Motion";

const TESTIMONIALS = [
  { quote: "They listened more than they spoke. The result is a home that feels like us — only more composed.", author: "Aarav & Ishita Menon", role: "Homeowners · Bengaluru", project: "Obsidian Villa" },
  { quote: "Every evening the apartment seems to exhale. That is the design.", author: "Karan Shroff", role: "Homeowner · Mumbai", project: "Linden Apartment" },
  { quote: "Our team writes better proposals here. That is not a metaphor.", author: "Studio Principal", role: "Atelier · Pune", project: "Atelier Office" },
  { quote: "The room does half the hospitality for us.", author: "Founders, Terra", role: "Restaurant · Goa", project: "Terra Goa" },
  { quote: "I cook more. That is the highest compliment I can give.", author: "Meera Kapoor", role: "Homeowner · Delhi", project: "Ivory Kitchen" },
  { quote: "I sleep differently here.", author: "Resident", role: "Homeowner · Hyderabad", project: "Noir Bedroom" },
];

export default function TestimonialsPage() {
  return (
    <div data-testid="testimonials-page" className="pt-28">
      <section className="ngi-page-hero">
        <FadeIn>
          <div className="ngi-overline mb-6"><span className="ngi-rule" />Said about the studio</div>
          <h1 className="ngi-page-title max-w-4xl">
            From the people we have <em className="text-[#707070]">worked for</em>.
          </h1>
        </FadeIn>
      </section>

      <section className="ngi-container pb-24 md:pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
          {TESTIMONIALS.map((t, i) => (
            <FadeIn key={i} delay={(i % 2) * 0.05} className={`ngi-panel p-8 md:p-10 ${i % 2 === 1 ? "md:mt-24" : ""}`}>
              <Quote size={32} className="text-[#C8A46A] mb-6" strokeWidth={1} />
              <p className="font-serif text-2xl md:text-3xl font-light leading-snug text-[#171717]">"{t.quote}"</p>
              <div className="mt-8 flex items-end justify-between">
                <div>
                  <div className="ngi-page-label">{t.author}</div>
                  <div className="text-xs text-[#1E1E1E]/60 mt-1">{t.role}</div>
                </div>
                <div className="ngi-page-label text-[#1E1E1E]/50">{t.project}</div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>
    </div>
  );
}
