import { Link } from "react-router-dom";
import { FadeIn, CountUp } from "@/components/site/Motion";

const TEAM = [
  { name: "Aanya Rao", role: "Founder & Principal Architect", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600" },
  { name: "Rohan Iyer", role: "Design Director", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600" },
  { name: "Maya Bhattacharya", role: "Head of Materials", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600" },
  { name: "Karan Pillai", role: "Studio Manager", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600" },
];

const PRINCIPLES = [
  { n: "01", t: "Restraint", d: "We subtract until what remains is irreducible. Restraint is the editorial discipline behind every room we have built." },
  { n: "02", t: "Material literacy", d: "We know our way around stone, wood, plaster, fabric, brass and the people who work them. Specification is not a catalogue choice." },
  { n: "03", t: "Light first", d: "We brief a lighting plan before we draw a furniture plan. Light is the room. Furniture is its punctuation." },
  { n: "04", t: "Time as a tool", d: "Good interiors are unhurried. We will tell you when the schedule is wrong, and we will protect the timeline once we have signed it." },
];

export default function AboutPage() {
  return (
    <div data-testid="about-page" className="pt-28">
      <section className="ngi-container py-16 md:py-24">
        <FadeIn>
          <div className="ngi-overline mb-6"><span className="ngi-rule" />The Studio</div>
          <h1 className="font-serif text-5xl md:text-7xl font-light tracking-tighter leading-[1.02] max-w-5xl">
            A small studio in Bengaluru, working <em className="text-[#6D4C41]">unhurriedly</em>, across India.
          </h1>
        </FadeIn>
      </section>

      <section className="ngi-container grid grid-cols-1 md:grid-cols-12 gap-10 mb-24 md:mb-32">
        <FadeIn className="md:col-span-7">
          <div className="aspect-[16/10] ngi-image-zoom">
            <img src="https://images.pexels.com/photos/13201479/pexels-photo-13201479.jpeg" alt="Studio" className="w-full h-full object-cover" />
          </div>
        </FadeIn>
        <FadeIn className="md:col-span-4 md:col-start-9 self-end" delay={0.1}>
          <p className="text-base md:text-lg leading-relaxed text-[#1B1D22]/85">
            NextGen Interiors is a thirteen-person practice founded in 2013. We work on residential and commercial interior architecture — homes, offices, restaurants — for clients who care about how a room feels at 7am.
          </p>
          <p className="mt-6 text-base md:text-lg leading-relaxed text-[#1B1D22]/85">
            We are not stylists. We are interior architects, which is to say we draw every joint, specify every finish, and stand on site every week until the work is finished.
          </p>
        </FadeIn>
      </section>

      <section className="bg-[#E6E0D8]/40">
        <div className="ngi-container ngi-section">
          <FadeIn className="mb-16 max-w-2xl">
            <div className="ngi-overline mb-4"><span className="ngi-rule" />Four principles</div>
            <h2 className="font-serif text-4xl md:text-5xl font-light tracking-tight leading-tight">What we believe.</h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {PRINCIPLES.map((p, i) => (
              <FadeIn key={p.n} delay={i * 0.06} className="border-t border-[#0B0B0D]/15 pt-6">
                <div className="font-serif text-5xl text-[#C9A86A] font-light mb-3">{p.n}</div>
                <h3 className="font-serif text-2xl md:text-3xl font-light mb-3">{p.t}</h3>
                <p className="text-[#1B1D22]/75 leading-relaxed">{p.d}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="ngi-section ngi-container">
        <FadeIn className="mb-12">
          <div className="ngi-overline mb-4"><span className="ngi-rule" />The People</div>
          <h2 className="font-serif text-4xl md:text-5xl font-light tracking-tight">A studio of thirteen.</h2>
        </FadeIn>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {TEAM.map((m, i) => (
            <FadeIn key={m.name} delay={i * 0.06}>
              <div className="aspect-[3/4] ngi-image-zoom bg-[#E6E0D8]">
                <img src={m.img} alt={m.name} className="w-full h-full object-cover grayscale" />
              </div>
              <h3 className="mt-4 font-serif text-xl font-medium">{m.name}</h3>
              <div className="text-[11px] tracking-[0.2em] uppercase text-[#6D4C41] mt-1">{m.role}</div>
            </FadeIn>
          ))}
        </div>
      </section>

      <section className="bg-[#0B0B0D] text-[#F7F5F2]">
        <div className="ngi-container py-20 grid grid-cols-2 md:grid-cols-4 gap-10">
          {[{ n: 240, s: "+", l: "Projects" }, { n: 12, s: "", l: "Years" }, { n: 14, s: "", l: "Cities" }, { n: 13, s: "", l: "People in studio" }].map((s, i) => (
            <FadeIn key={i} delay={i * 0.06}>
              <div className="font-serif text-5xl md:text-6xl text-[#C9A86A]"><CountUp to={s.n} suffix={s.s} /></div>
              <div className="text-[10px] tracking-[0.22em] uppercase text-[#F7F5F2]/60 mt-3">{s.l}</div>
            </FadeIn>
          ))}
        </div>
      </section>

      <section className="ngi-section ngi-container text-center">
        <FadeIn>
          <div className="ngi-overline mb-4 inline-block"><span className="ngi-rule" />Work with us</div>
          <h2 className="font-serif text-4xl md:text-6xl font-light tracking-tight leading-tight max-w-3xl mx-auto">
            Begin a conversation.
          </h2>
          <Link to="/consultation" data-testid="about-cta" className="inline-flex mt-10 bg-[#0B0B0D] text-[#F7F5F2] hover:bg-[#C9A86A] hover:text-[#0B0B0D] px-10 py-5 text-[11px] tracking-[0.22em] uppercase transition-colors duration-300">
            Book a Consultation
          </Link>
        </FadeIn>
      </section>
    </div>
  );
}
