import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { api, formatApiError } from "@/lib/api";

const STEPS = [
  { key: "project_type", title: "What kind of space?", subtitle: "Step one. The shape of the brief.", options: ["Residence", "Apartment", "Villa", "Office", "Hospitality", "Other"] },
  { key: "budget", title: "Approximate budget", subtitle: "Step two. So we can advise honestly.", options: ["₹ Under 25L", "₹ 25L – 60L", "₹ 60L – 1.2 Cr", "₹ 1.2 Cr – 3 Cr", "₹ 3 Cr +"] },
  { key: "timeline", title: "When would you like to begin?", subtitle: "Step three. Schedule.", options: ["Within 1 month", "1 – 3 months", "3 – 6 months", "Just exploring"] },
  { key: "location", title: "Where is the project?", subtitle: "Step four. We will travel.", options: ["Bengaluru", "Mumbai", "Delhi NCR", "Hyderabad", "Pune", "Chennai", "Other"] },
];

export default function ConsultationPage() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    project_type: "",
    budget: "",
    timeline: "",
    location: "",
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const totalSteps = STEPS.length + 1;
  const progress = ((step + 1) / totalSteps) * 100;

  const select = (key, value) => {
    setData((d) => ({ ...d, [key]: value }));
    setTimeout(() => setStep((s) => Math.min(STEPS.length, s + 1)), 280);
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/leads", { ...data, source: "consultation" });
      setDone(true);
      toast.success("Booked. We will be in touch within a working day.");
    } catch (err) {
      toast.error(formatApiError(err.response?.data?.detail) || "Could not submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div data-testid="consultation-page" className="min-h-screen pt-28 pb-24 bg-[#F7F5F2]">
      <section className="ngi-container">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <aside className="md:col-span-4">
            <div className="ngi-overline mb-6"><span className="ngi-rule" />Book a Consultation</div>
            <h1 className="font-serif text-4xl md:text-5xl font-light tracking-tighter leading-[1.05]">
              Ninety minutes. <em className="text-[#6D4C41]">Honest, unrushed.</em>
            </h1>
            <p className="mt-6 text-base leading-relaxed text-[#1B1D22]/80 max-w-sm">
              No deck, no sales. A conversation between the people who will design your space and the people who will live in it.
            </p>
            <div className="mt-12 space-y-3 text-sm text-[#1B1D22]/70">
              <div className="flex items-center gap-2"><Check size={14} className="text-[#7A9070]" /> First consultation is complimentary</div>
              <div className="flex items-center gap-2"><Check size={14} className="text-[#7A9070]" /> Senior designer in the room</div>
              <div className="flex items-center gap-2"><Check size={14} className="text-[#7A9070]" /> No obligation to proceed</div>
            </div>
          </aside>

          <div className="md:col-span-7 md:col-start-6 min-h-[480px] flex flex-col">
            {!done && (
              <div className="mb-12">
                <div className="flex items-center justify-between text-[10px] tracking-[0.22em] uppercase text-[#6D4C41] mb-3">
                  <span>Step {Math.min(step + 1, totalSteps)} of {totalSteps}</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="h-px bg-[#0B0B0D]/15 relative">
                  <motion.div
                    className="absolute left-0 top-0 h-px bg-[#C9A86A]"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
              </div>
            )}

            <AnimatePresence mode="wait">
              {!done && step < STEPS.length && (
                <motion.div
                  key={`step-${step}`}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.4 }}
                  className="flex-1"
                >
                  <div className="text-[10px] tracking-[0.22em] uppercase text-[#6D4C41]">{STEPS[step].subtitle}</div>
                  <h2 className="font-serif text-3xl md:text-5xl font-light mt-4 mb-10 leading-tight">{STEPS[step].title}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {STEPS[step].options.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => select(STEPS[step].key, opt)}
                        data-testid={`consult-option-${STEPS[step].key}-${opt}`}
                        className={`text-left px-6 py-5 border transition-all ${
                          data[STEPS[step].key] === opt
                            ? "bg-[#0B0B0D] text-[#F7F5F2] border-[#0B0B0D]"
                            : "border-[#0B0B0D]/20 hover:border-[#0B0B0D] hover:bg-[#E6E0D8]/50"
                        }`}
                      >
                        <span className="font-serif text-xl md:text-2xl">{opt}</span>
                      </button>
                    ))}
                  </div>
                  {step > 0 && (
                    <button
                      onClick={() => setStep((s) => s - 1)}
                      className="mt-10 text-[10px] tracking-[0.22em] uppercase text-[#1B1D22]/60 hover:text-[#0B0B0D]"
                    >
                      ← Previous
                    </button>
                  )}
                </motion.div>
              )}

              {!done && step === STEPS.length && (
                <motion.form
                  key="step-final"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.4 }}
                  onSubmit={submit}
                  className="flex-1"
                  data-testid="consult-final-form"
                >
                  <div className="text-[10px] tracking-[0.22em] uppercase text-[#6D4C41]">Last step. Tell us who to call.</div>
                  <h2 className="font-serif text-3xl md:text-5xl font-light mt-4 mb-10 leading-tight">Your details.</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="text-[10px] tracking-[0.22em] uppercase text-[#6D4C41]">Full Name</label>
                      <input required value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} data-testid="consult-name" className="w-full bg-transparent border-b border-[#0B0B0D]/30 focus:border-[#C9A86A] outline-none py-3 text-lg font-serif" />
                    </div>
                    <div>
                      <label className="text-[10px] tracking-[0.22em] uppercase text-[#6D4C41]">Phone</label>
                      <input required value={data.phone} onChange={(e) => setData({ ...data, phone: e.target.value })} data-testid="consult-phone" className="w-full bg-transparent border-b border-[#0B0B0D]/30 focus:border-[#C9A86A] outline-none py-3 text-lg font-serif" />
                    </div>
                  </div>
                  <div className="mt-8">
                    <label className="text-[10px] tracking-[0.22em] uppercase text-[#6D4C41]">Email</label>
                    <input required type="email" value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} data-testid="consult-email" className="w-full bg-transparent border-b border-[#0B0B0D]/30 focus:border-[#C9A86A] outline-none py-3 text-lg font-serif" />
                  </div>
                  <div className="mt-8">
                    <label className="text-[10px] tracking-[0.22em] uppercase text-[#6D4C41]">Anything we should know</label>
                    <textarea rows={3} value={data.message} onChange={(e) => setData({ ...data, message: e.target.value })} data-testid="consult-message" className="w-full bg-transparent border-b border-[#0B0B0D]/30 focus:border-[#C9A86A] outline-none py-3 text-lg font-serif resize-none" />
                  </div>
                  <div className="mt-12 flex items-center gap-6">
                    <button type="button" onClick={() => setStep((s) => s - 1)} className="text-[10px] tracking-[0.22em] uppercase text-[#1B1D22]/60 hover:text-[#0B0B0D]">
                      ← Previous
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      data-testid="consult-submit"
                      className="inline-flex items-center gap-3 bg-[#0B0B0D] text-[#F7F5F2] px-10 py-5 text-[11px] tracking-[0.22em] uppercase hover:bg-[#C9A86A] hover:text-[#0B0B0D] transition-colors disabled:opacity-50"
                    >
                      {loading ? "Submitting…" : "Book Consultation"} <ArrowRight size={14} />
                    </button>
                  </div>
                </motion.form>
              )}

              {done && (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                  className="flex-1 flex flex-col items-start justify-center"
                  data-testid="consult-success"
                >
                  <div className="w-16 h-16 border border-[#7A9070] flex items-center justify-center mb-8">
                    <Check size={28} className="text-[#7A9070]" strokeWidth={1.5} />
                  </div>
                  <h2 className="font-serif text-4xl md:text-6xl font-light leading-tight">Thank you, {data.name?.split(" ")[0] || "friend"}.</h2>
                  <p className="mt-6 text-lg text-[#1B1D22]/80 max-w-lg leading-relaxed">
                    A senior designer from the studio will be in touch within one working day to schedule your ninety minutes.
                  </p>
                  <p className="mt-4 text-sm text-[#1B1D22]/60">In the meantime — perhaps a short read from the journal?</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </div>
  );
}
