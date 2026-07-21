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
    <div data-testid="consultation-page" className="min-h-screen pt-28 pb-24 bg-[#F7F4EF]">
      <section className="ngi-container">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <aside className="md:col-span-4">
            <div className="ngi-overline mb-6"><span className="ngi-rule" />Book a Consultation</div>
            <h1 className="ngi-section-heading max-w-sm">
              Ninety minutes. <em className="text-[#707070]">Honest, unrushed.</em>
            </h1>
            <p className="mt-6 ngi-page-body max-w-sm">
              No deck, no sales. A conversation between the people who will design your space and the people who will live in it.
            </p>
            <div className="mt-12 space-y-3 text-sm text-[#1E1E1E]/70">
              <div className="flex items-center gap-2"><Check size={14} className="text-[#C8A46A]" /> First consultation is complimentary</div>
              <div className="flex items-center gap-2"><Check size={14} className="text-[#C8A46A]" /> Senior designer in the room</div>
              <div className="flex items-center gap-2"><Check size={14} className="text-[#C8A46A]" /> No obligation to proceed</div>
            </div>
          </aside>

          <div className="md:col-span-7 md:col-start-6 min-h-[480px] flex flex-col">
            {!done && (
              <div className="mb-12">
                <div className="flex items-center justify-between text-[10px] tracking-[0.22em] uppercase text-[#707070] mb-3">
                  <span>Step {Math.min(step + 1, totalSteps)} of {totalSteps}</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="h-px bg-[#171717]/15 relative overflow-hidden">
                  <motion.div
                    className="absolute left-0 top-0 h-full w-full bg-[#C8A46A] origin-left"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: progress / 100 }}
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
                  <div className="ngi-page-label">{STEPS[step].subtitle}</div>
                  <h2 className="ngi-section-heading mt-4 mb-10">{STEPS[step].title}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {STEPS[step].options.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => select(STEPS[step].key, opt)}
                        data-testid={`consult-option-${STEPS[step].key}-${opt}`}
                        className={`text-left ngi-panel px-6 py-5 transition-all ${
                          data[STEPS[step].key] === opt
                            ? "bg-[#171717] text-white border-[#171717]"
                            : "hover:border-[#171717] hover:bg-[#E7E2DA]/50"
                        }`}
                      >
                        <span className="font-serif text-xl md:text-2xl">{opt}</span>
                      </button>
                    ))}
                  </div>
                  {step > 0 && (
                    <button
                      onClick={() => setStep((s) => s - 1)}
                      className="mt-10 ngi-page-label hover:text-[#B38B59]"
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
                  <div className="ngi-page-label">Last step. Tell us who to call.</div>
                  <h2 className="ngi-section-heading mt-4 mb-10">Your details.</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="ngi-page-label">Full Name</label>
                      <input required value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} data-testid="consult-name" className="ngi-input" />
                    </div>
                    <div>
                      <label className="ngi-page-label">Phone</label>
                      <input required value={data.phone} onChange={(e) => setData({ ...data, phone: e.target.value })} data-testid="consult-phone" className="ngi-input" />
                    </div>
                  </div>
                  <div className="mt-8">
                    <label className="ngi-page-label">Email</label>
                    <input required type="email" value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} data-testid="consult-email" className="ngi-input" />
                  </div>
                  <div className="mt-8">
                    <label className="ngi-page-label">Anything we should know</label>
                    <textarea rows={3} value={data.message} onChange={(e) => setData({ ...data, message: e.target.value })} data-testid="consult-message" className="ngi-textarea" />
                  </div>
                  <div className="mt-12 flex items-center gap-6">
                    <button type="button" onClick={() => setStep((s) => s - 1)} className="text-[10px] tracking-[0.22em] uppercase text-[#1E1E1E]/60 hover:text-[#C8A46A]">
                      ← Previous
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      data-testid="consult-submit"
                      className="ngi-button-primary gap-3 disabled:opacity-50"
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
                  <div className="w-16 h-16 border border-[#B38B59] flex items-center justify-center mb-8">
                    <Check size={28} className="text-[#B38B59]" strokeWidth={1.5} />
                  </div>
                  <h2 className="ngi-section-heading leading-tight">Thank you, {data.name?.split(" ")[0] || "friend"}.</h2>
                  <p className="mt-6 ngi-page-body max-w-lg">
                    A senior designer from the studio will be in touch within one working day to schedule your ninety minutes.
                  </p>
                  <p className="mt-4 text-sm text-[#1E1E1E]/60">In the meantime — perhaps a short read from the journal?</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </div>
  );
}
