import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { api } from "@/lib/api";
import { FadeIn } from "@/components/site/Motion";

const FILTERS = [
  { key: "all", label: "All Works" },
  { key: "residential", label: "Residential" },
  { key: "commercial", label: "Commercial" },
  { key: "kitchen", label: "Kitchen" },
  { key: "bedroom", label: "Bedroom" },
  { key: "office", label: "Office" },
  { key: "villa", label: "Villa" },
  { key: "apartment", label: "Apartment" },
];

export default function PortfolioPage() {
  const [filter, setFilter] = useState("all");
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    api.get("/projects").then(({ data }) => setProjects(data)).catch(() => {});
  }, []);

  const visible = filter === "all" ? projects : projects.filter((p) => p.category === filter);

  return (
    <div data-testid="portfolio-page" className="pt-28">
      <section className="ngi-container py-16 md:py-24">
        <FadeIn>
          <div className="ngi-overline mb-6"><span className="ngi-rule" />Portfolio</div>
          <h1 className="font-serif text-5xl md:text-7xl font-light tracking-tighter leading-[1.02] max-w-5xl">
            Selected works <em className="text-[#707070]">from the past decade</em>.
          </h1>
        </FadeIn>
      </section>

      <section className="ngi-container border-b border-[#171717]/10 pb-6">
        <div className="flex flex-wrap items-center gap-2 md:gap-4">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              data-testid={`filter-${f.key}`}
              onClick={() => setFilter(f.key)}
              className={`text-[11px] tracking-[0.22em] uppercase py-3 px-5 transition-colors ${
                filter === f.key
                  ? "bg-[#171717] text-white"
                  : "text-[#1E1E1E]/70 hover:text-[#C8A46A] border border-transparent hover:border-[#C8A46A]/40"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </section>

      <section className="ngi-container ngi-section">
        <motion.div layout className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 min-h-[60vh]">
          <AnimatePresence mode="popLayout">
            {visible.map((p, i) => {
              const span =
                i % 6 === 0 ? "md:col-span-8" :
                i % 6 === 1 ? "md:col-span-4 md:mt-32" :
                i % 6 === 2 ? "md:col-span-5" :
                i % 6 === 3 ? "md:col-span-7 md:mt-16" :
                i % 6 === 4 ? "md:col-span-6" :
                "md:col-span-6 md:mt-12";
              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.4, delay: (i % 4) * 0.05 }}
                  key={p.slug} 
                  className={span}
                >
                  <Link to={`/portfolio/${p.slug}`} className="group block" data-testid={`project-card-${p.slug}`}>
                    <div className={`ngi-image-zoom bg-[#E7E2DA] ${i % 3 === 0 ? "aspect-[4/5]" : "aspect-[5/4]"}`}>
                      <img src={`${p.cover_image}?auto=compress&w=800&q=75`} alt={p.title} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                    </div>
                    <div className="flex items-start justify-between mt-5">
                      <div>
                        <div className="text-[10px] tracking-[0.22em] uppercase text-[#707070]">{p.category} · {p.location} · {p.year}</div>
                        <h3 className="font-serif text-2xl md:text-3xl mt-2 group-hover:text-[#707070] transition-colors">{p.title}</h3>
                      </div>
                      <ArrowUpRight size={20} className="mt-2 group-hover:text-[#C8A46A] transition-colors" />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
        {visible.length === 0 && (
          <p className="text-center text-[#1E1E1E]/60 py-20">No projects yet in this category.</p>
        )}
      </section>
    </div>
  );
}
