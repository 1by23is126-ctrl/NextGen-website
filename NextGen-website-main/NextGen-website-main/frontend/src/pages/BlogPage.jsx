import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { FadeIn } from "@/components/site/Motion";
import { ArrowUpRight } from "lucide-react";

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [category, setCategory] = useState("all");

  useEffect(() => {
    const params = category === "all" ? {} : { category };
    api.get("/blog", { params }).then(({ data }) => setPosts(data)).catch(() => {});
  }, [category]);

  const categories = ["all", ...Array.from(new Set(posts.map((p) => p.category)))];

  return (
    <div data-testid="blog-page" className="pt-28">
      <section className="ngi-container py-16 md:py-24">
        <FadeIn>
          <div className="ngi-overline mb-6"><span className="ngi-rule" />Journal</div>
          <h1 className="font-serif text-5xl md:text-7xl font-light tracking-tighter leading-[1.02] max-w-4xl">
            Field notes, material diaries, <em className="text-[#707070]">letters home</em>.
          </h1>
          <p className="mt-8 max-w-2xl text-base md:text-lg leading-relaxed text-[#1E1E1E]/80">
            Long-form writing from the studio. About materials, the practice, the homes we have built and the ones we still want to.
          </p>
        </FadeIn>
      </section>

      <section className="ngi-container pb-24 md:pb-32">
        <div className="flex flex-wrap gap-2 mb-16 border-b border-[#171717]/10 pb-6">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              data-testid={`blog-filter-${c}`}
              className={`text-[11px] tracking-[0.22em] uppercase py-3 px-5 transition-colors ${
                category === c ? "bg-[#171717] text-white" : "text-[#1E1E1E]/70 hover:text-[#C8A46A]"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-20">
          {posts.map((p, i) => (
            <FadeIn key={p.id} delay={(i % 2) * 0.06} className={i % 2 === 1 ? "md:mt-28" : ""}>
              <Link to={`/journal/${p.slug}`} className="group block" data-testid={`blog-card-${p.slug}`}>
                <div className="aspect-[5/4] ngi-image-zoom mb-6">
                  <img src={p.cover_image} alt={p.title} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div className="text-[10px] tracking-[0.22em] uppercase text-[#707070] mb-3">{p.category} · {p.read_time} min read</div>
                <h2 className="font-serif text-3xl md:text-4xl font-light leading-tight group-hover:text-[#707070] transition-colors">{p.title}</h2>
                <p className="mt-4 text-[#1E1E1E]/75 leading-relaxed">{p.excerpt}</p>
                <div className="mt-6 inline-flex items-center gap-2 text-[11px] tracking-[0.22em] uppercase text-[#171717] ngi-link-underline">
                  Read article <ArrowUpRight size={14} />
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
        {posts.length === 0 && <p className="text-center text-[#1E1E1E]/60 py-20">No articles in this category yet.</p>}
      </section>
    </div>
  );
}
