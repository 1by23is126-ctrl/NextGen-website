import { useState } from "react";
import { Phone, Mail, MapPin, Instagram, Linkedin, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { api, formatApiError } from "@/lib/api";
import { BUSINESS, whatsappUrl } from "@/data/business";
import { FadeIn } from "@/components/site/Motion";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/leads", { ...form, source: "contact" });
      setDone(true);
      toast.success("Thank you. We will be in touch within one working day.");
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      toast.error(formatApiError(err.response?.data?.detail) || "Could not send. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div data-testid="contact-page" className="pt-28">
      <section className="ngi-container py-16 md:py-24">
        <FadeIn>
          <div className="ngi-overline mb-6"><span className="ngi-rule" />Contact</div>
          <h1 className="font-serif text-5xl md:text-7xl font-light tracking-tighter leading-[1.02] max-w-4xl">
            Let's <em className="text-[#6D4C41]">begin a conversation</em>.
          </h1>
        </FadeIn>
      </section>

      <section className="ngi-container pb-24 grid grid-cols-1 md:grid-cols-12 gap-12">
        <FadeIn className="md:col-span-7">
          <form onSubmit={onSubmit} className="space-y-8" data-testid="contact-form">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="text-[10px] tracking-[0.22em] uppercase text-[#6D4C41]">Your Name</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  data-testid="contact-name"
                  className="w-full bg-transparent border-b border-[#0B0B0D]/30 focus:border-[#C9A86A] outline-none py-3 text-lg font-serif"
                />
              </div>
              <div>
                <label className="text-[10px] tracking-[0.22em] uppercase text-[#6D4C41]">Email</label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  data-testid="contact-email"
                  className="w-full bg-transparent border-b border-[#0B0B0D]/30 focus:border-[#C9A86A] outline-none py-3 text-lg font-serif"
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] tracking-[0.22em] uppercase text-[#6D4C41]">Phone</label>
              <input
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                data-testid="contact-phone"
                className="w-full bg-transparent border-b border-[#0B0B0D]/30 focus:border-[#C9A86A] outline-none py-3 text-lg font-serif"
              />
            </div>
            <div>
              <label className="text-[10px] tracking-[0.22em] uppercase text-[#6D4C41]">Tell us about your project</label>
              <textarea
                required
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                data-testid="contact-message"
                className="w-full bg-transparent border-b border-[#0B0B0D]/30 focus:border-[#C9A86A] outline-none py-3 text-lg font-serif resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              data-testid="contact-submit"
              className="bg-[#0B0B0D] text-[#F7F5F2] px-10 py-5 text-[11px] tracking-[0.22em] uppercase hover:bg-[#C9A86A] hover:text-[#0B0B0D] transition-colors disabled:opacity-50"
            >
              {loading ? "Sending…" : done ? "Sent ✓ Send Another" : "Send Message →"}
            </button>
          </form>
        </FadeIn>

        <FadeIn className="md:col-span-4 md:col-start-9 space-y-10" delay={0.1}>
          <div>
            <div className="ngi-overline mb-4"><span className="ngi-rule" />Studio</div>
            <a href={`tel:${BUSINESS.phoneRaw}`} className="flex items-center gap-3 text-lg font-serif mb-3 ngi-link-underline" data-testid="contact-phone-link">
              <Phone size={16} className="text-[#C9A86A]" />{BUSINESS.phone}
            </a>
            <a href={`mailto:${BUSINESS.email}`} className="flex items-center gap-3 text-lg font-serif mb-3 ngi-link-underline" data-testid="contact-email-link">
              <Mail size={16} className="text-[#C9A86A]" />{BUSINESS.email}
            </a>
            <a href={whatsappUrl()} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-lg font-serif ngi-link-underline" data-testid="contact-whatsapp">
              <MessageCircle size={16} className="text-[#C9A86A]" />Chat on WhatsApp
            </a>
          </div>

          <div>
            <div className="ngi-overline mb-4"><span className="ngi-rule" />Address</div>
            <address className="not-italic text-base leading-relaxed text-[#1B1D22]/80 flex items-start gap-3">
              <MapPin size={16} className="text-[#C9A86A] mt-1.5 shrink-0" />
              <span>{BUSINESS.address.line1}<br />{BUSINESS.address.line2}</span>
            </address>
          </div>

          <div>
            <div className="ngi-overline mb-4"><span className="ngi-rule" />Hours</div>
            <ul className="text-sm leading-loose text-[#1B1D22]/80">
              <li>{BUSINESS.hours.weekdays}</li>
              <li>{BUSINESS.hours.saturday}</li>
              <li>{BUSINESS.hours.sunday}</li>
            </ul>
          </div>

          <div>
            <div className="ngi-overline mb-4"><span className="ngi-rule" />Social</div>
            <div className="flex gap-5">
              <a href={BUSINESS.social.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="hover:text-[#C9A86A] transition-colors"><Instagram size={20} /></a>
              <a href={BUSINESS.social.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="hover:text-[#C9A86A] transition-colors"><Linkedin size={20} /></a>
            </div>
          </div>
        </FadeIn>
      </section>

      <section className="ngi-container pb-24 md:pb-32">
        <FadeIn>
          <div className="aspect-[21/9] border border-[#0B0B0D]/15">
            <iframe
              title="NextGen Studio Location"
              src={BUSINESS.mapEmbed}
              width="100%"
              height="100%"
              style={{ border: 0, filter: "grayscale(1) contrast(0.95)" }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
