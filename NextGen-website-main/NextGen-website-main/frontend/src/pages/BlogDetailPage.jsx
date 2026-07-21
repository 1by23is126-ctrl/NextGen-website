import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "@/lib/api";
import { FadeIn } from "@/components/site/Motion";
import { ArrowUpRight } from "lucide-react";

export default function BlogDetailPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    setPost(null);
    api.get(`/blog/${slug}`).then(({ data }) => setPost(data)).catch(() => {});
    api.get("/blog").then(({ data }) => setRelated(data.filter((p) => p.slug !== slug).slice(0, 2))).catch(() => {});
  }, [slug]);

  if (!post) {
    return (
      <div className="ngi-container pt-40 pb-24" data-testid="blog-loading">
        <p className="text-[#1E1E1E]/60">Loading article…</p>
      </div>
    );
  }

  return (
    <article data-testid="blog-detail-page" className="pt-28">
      <header className="ngi-page-hero max-w-4xl">
        <Link to="/journal" className="text-[10px] tracking-[0.22em] uppercase text-[#707070] ngi-link-underline">← Journal</Link>
        <FadeIn className="mt-8 max-w-4xl">
          <div className="ngi-overline mb-6"><span className="ngi-rule" />{post.category} · {post.read_time} min read</div>
          <h1 className="ngi-page-title max-w-none">{post.title}</h1>
          <div className="mt-8 text-[11px] tracking-[0.22em] uppercase text-[#1E1E1E]/60">By {post.author}</div>
        </FadeIn>
      </header>

      <section className="ngi-container">
        <FadeIn>
          <div className="aspect-[16/9] ngi-image-zoom">
            <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover" />
          </div>
        </FadeIn>
      </section>

      <section className="ngi-container py-20 md:py-28">
        <FadeIn className="max-w-2xl mx-auto">
          <div className="max-w-none text-[#171717] leading-relaxed text-base md:text-lg">
            {post.content.split("\n\n").map((para, i) => {
              if (para.startsWith("**") && para.endsWith("**")) {
                return <p key={i} className="ngi-page-label my-8 not-italic" style={{ fontStyle: "normal" }}>{para.replaceAll("*", "")}</p>;
              }
              return <p key={i} className="mb-8 leading-relaxed" dangerouslySetInnerHTML={{ __html: para.replaceAll(/\*\*(.*?)\*\*/g, '<strong class="text-[#707070] font-medium">$1</strong>') }} />;
            })}
          </div>
        </FadeIn>
      </section>

      {related.length > 0 && (
        <section className="bg-[#E7E2DA]/40">
          <div className="ngi-container ngi-section">
            <FadeIn className="mb-10">
              <div className="ngi-overline mb-4"><span className="ngi-rule" />Continue reading</div>
              <h2 className="ngi-section-heading">More from the journal.</h2>
            </FadeIn>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {related.map((p) => (
                <Link key={p.id} to={`/journal/${p.slug}`} className="group block">
                  <div className="aspect-[5/4] ngi-image-zoom ngi-panel overflow-hidden mb-5">
                    <img src={p.cover_image} alt={p.title} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <div className="ngi-page-label mb-2">{p.category}</div>
                  <h3 className="font-serif text-2xl md:text-3xl font-light group-hover:text-[#707070] transition-colors">{p.title}</h3>
                  <div className="mt-4 inline-flex items-center gap-2 text-[11px] tracking-[0.22em] uppercase ngi-link-underline">Read <ArrowUpRight size={14} /></div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
