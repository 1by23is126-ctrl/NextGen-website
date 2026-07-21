import { useEffect, useState } from "react";
import { Plus, Trash2, Edit3, X } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";

const EMPTY = {
  title: "",
  slug: "",
  excerpt: "",
  cover_image: "",
  content: "",
  category: "Practice",
  read_time: 5,
  author: "NextGen Studio",
  published: true,
};

export default function AdminBlogPage() {
  const [posts, setPosts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const { data } = await api.get("/blog");
      setPosts(data);
    } catch {
      toast.error("Could not load posts");
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchPosts(); }, []);

  const openNew = () => { setEditing("new"); setForm(EMPTY); };
  const openEdit = (post) => { setEditing(post.id); setForm({ ...EMPTY, ...post }); };
  const close = () => { setEditing(null); setForm(EMPTY); };

  const save = async (e) => {
    e.preventDefault();
    try {
      if (editing === "new") {
        const { data } = await api.post("/blog", form);
        setPosts((p) => [data, ...p]);
        toast.success("Post published");
      } else {
        const { data } = await api.put(`/blog/${editing}`, form);
        setPosts((p) => p.map((x) => (x.id === editing ? data : x)));
        toast.success("Post updated");
      }
      close();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Could not save");
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this article?")) return;
    try {
      await api.delete(`/blog/${id}`);
      setPosts((p) => p.filter((x) => x.id !== id));
      toast.success("Deleted");
    } catch { toast.error("Could not delete"); }
  };

  return (
    <div className="p-8 lg:p-12" data-testid="admin-blog-page">
      <div className="flex items-baseline justify-between mb-10">
        <div>
          <div className="ngi-overline mb-2"><span className="ngi-rule" />Journal</div>
          <h1 className="font-serif text-4xl md:text-5xl font-light">Articles</h1>
        </div>
        <button onClick={openNew} data-testid="admin-blog-new" className="inline-flex items-center gap-2 bg-[#171717] text-white px-6 py-3 text-[10px] tracking-[0.22em] uppercase hover:bg-[#C8A46A] hover:text-white transition-colors">
          <Plus size={14} /> New article
        </button>
      </div>

      {editing && (
        <form onSubmit={save} className="bg-[#E7E2DA]/40 border border-[#171717]/10 p-6 lg:p-8 mb-10" data-testid="admin-blog-form">
          <div className="flex justify-between mb-6">
            <h2 className="font-serif text-2xl">{editing === "new" ? "New article" : "Edit article"}</h2>
            <button type="button" onClick={close}><X size={18} /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-[10px] tracking-[0.22em] uppercase text-[#707070]">Title</label>
              <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full bg-white border border-[#E7E2DA] focus:border-[#C8A46A] py-2 outline-none font-serif text-lg" data-testid="blog-form-title" />
            </div>
            <div>
              <label className="text-[10px] tracking-[0.22em] uppercase text-[#707070]">Slug</label>
              <input required value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full bg-white border border-[#E7E2DA] focus:border-[#C8A46A] py-2 outline-none font-serif text-lg" data-testid="blog-form-slug" />
            </div>
            <div>
              <label className="text-[10px] tracking-[0.22em] uppercase text-[#707070]">Category</label>
              <input required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full bg-white border border-[#E7E2DA] focus:border-[#C8A46A] py-2 outline-none font-serif text-lg" />
            </div>
            <div>
              <label className="text-[10px] tracking-[0.22em] uppercase text-[#707070]">Read time (min)</label>
              <input type="number" required value={form.read_time} onChange={(e) => setForm({ ...form, read_time: Number(e.target.value) })} className="w-full bg-white border border-[#E7E2DA] focus:border-[#C8A46A] py-2 outline-none font-serif text-lg" />
            </div>
            <div className="md:col-span-2">
              <label className="text-[10px] tracking-[0.22em] uppercase text-[#707070]">Cover image URL</label>
              <input required value={form.cover_image} onChange={(e) => setForm({ ...form, cover_image: e.target.value })} className="w-full bg-white border border-[#E7E2DA] focus:border-[#C8A46A] py-2 outline-none font-serif text-base" />
            </div>
            <div className="md:col-span-2">
              <label className="text-[10px] tracking-[0.22em] uppercase text-[#707070]">Excerpt</label>
              <textarea required rows={2} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} className="w-full bg-white border border-[#E7E2DA] focus:border-[#C8A46A] py-2 outline-none font-serif text-base resize-none" />
            </div>
            <div className="md:col-span-2">
              <label className="text-[10px] tracking-[0.22em] uppercase text-[#707070]">Content (use \n\n for paragraphs)</label>
              <textarea required rows={10} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className="w-full bg-white border border-[#E7E2DA] focus:border-[#C8A46A] p-3 outline-none focus:border-[#C8A46A] font-serif text-base resize-y" data-testid="blog-form-content" />
            </div>
          </div>
          <div className="flex items-center gap-4 mt-6">
            <button type="submit" data-testid="blog-form-save" className="bg-[#171717] text-white px-8 py-3 text-[10px] tracking-[0.22em] uppercase hover:bg-[#C8A46A] hover:text-white transition-colors">Save</button>
            <button type="button" onClick={close} className="text-[10px] tracking-[0.22em] uppercase text-[#1E1E1E]/60">Cancel</button>
          </div>
        </form>
      )}

      <div className="border-t border-b border-[#171717]/10 divide-y divide-[#171717]/10">
        {loading ? (
          <p className="py-12 text-center text-[#1E1E1E]/60">Loading…</p>
        ) : posts.length === 0 ? (
          <p className="py-12 text-center text-[#1E1E1E]/60">No articles yet.</p>
        ) : posts.map((p) => (
          <div key={p.id} className="py-5 grid grid-cols-12 gap-4 items-center" data-testid={`blog-row-${p.id}`}>
            <div className="col-span-1">
              <div className="w-16 h-16 bg-[#E7E2DA] overflow-hidden">
                <img src={p.cover_image} alt="" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="col-span-5">
              <div className="font-serif text-xl">{p.title}</div>
              <div className="text-xs text-[#1E1E1E]/60 mt-1">/{p.slug}</div>
            </div>
            <div className="col-span-2 text-[10px] tracking-[0.22em] uppercase text-[#707070]">{p.category}</div>
            <div className="col-span-2 text-xs text-[#1E1E1E]/60">{new Date(p.created_at).toLocaleDateString("en-IN")}</div>
            <div className="col-span-2 text-right flex items-center justify-end gap-3">
              <button onClick={() => openEdit(p)} data-testid={`blog-edit-${p.id}`} className="text-[#171717] hover:text-[#C8A46A]"><Edit3 size={16} /></button>
              <button onClick={() => remove(p.id)} data-testid={`blog-delete-${p.id}`} className="text-[#1E1E1E]/40 hover:text-red-700"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
