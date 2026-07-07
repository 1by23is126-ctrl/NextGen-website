import { FadeIn } from "@/components/site/Motion";

export default function PrivacyPage() {
  return (
    <div data-testid="privacy-page" className="pt-28">
      <section className="ngi-container py-16 md:py-24 max-w-3xl">
        <FadeIn>
          <div className="ngi-overline mb-6"><span className="ngi-rule" />Privacy</div>
          <h1 className="font-serif text-5xl md:text-6xl font-light tracking-tighter leading-tight">Privacy Policy</h1>
          <p className="mt-6 text-sm text-[#1B1D22]/60">Last updated · {new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long" })}</p>

          <div className="prose max-w-none mt-12 text-[#1B1D22]/85 leading-relaxed space-y-6">
            <p>NextGen Interiors LLP ("we", "us", "our") respects your privacy. This policy describes what information we collect when you visit our website or engage our studio, and how we use it.</p>

            <h2 className="font-serif text-2xl mt-12">What we collect</h2>
            <p>We collect the information you provide to us when you book a consultation, submit a contact form, or correspond with the studio. This typically includes your name, email, phone number, and any details you share about a prospective project.</p>

            <h2 className="font-serif text-2xl mt-10">How we use it</h2>
            <p>We use the information only to respond to your enquiry, schedule a consultation, and — if we go on to work together — to deliver your project. We do not sell or rent your information to third parties.</p>

            <h2 className="font-serif text-2xl mt-10">Cookies</h2>
            <p>Our website uses essential cookies to function and analytical cookies (Google Analytics) to understand how visitors use the site. You can disable cookies in your browser settings.</p>

            <h2 className="font-serif text-2xl mt-10">Retention</h2>
            <p>Enquiry data is retained for up to twenty-four months unless we go on to work together, in which case it forms part of your client record and is retained for the duration of our engagement plus seven years for statutory compliance.</p>

            <h2 className="font-serif text-2xl mt-10">Your rights</h2>
            <p>You may request a copy of the personal data we hold on you, or request its deletion, by writing to hello@nextgeninteriors.in.</p>

            <h2 className="font-serif text-2xl mt-10">Contact</h2>
            <p>If you have questions about this policy, write to us at hello@nextgeninteriors.in.</p>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
