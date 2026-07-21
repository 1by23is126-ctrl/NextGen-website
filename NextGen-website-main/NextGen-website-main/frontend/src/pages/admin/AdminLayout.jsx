import { useEffect } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { LogOut, Inbox, BookOpen } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function AdminLayout() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate("/admin/login", { replace: true });
  }, [user, loading, navigate]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-[#1E1E1E]/60">Loading…</div>;
  }
  if (!user) return null;

  return (
    <div className="min-h-screen flex bg-[#F6F4F1]" data-testid="admin-layout">
      <aside className="w-64 bg-[#171717] text-white flex flex-col">
        <div className="p-6 border-b border-white/10">
          <Link to="/" className="flex items-center gap-3">
            <span className="block w-2 h-2 bg-[#C8A46A]" />
            <span className="font-serif text-lg">NextGen <span className="italic text-[#C8A46A]">Interiors</span></span>
          </Link>
          <div className="text-[10px] tracking-[0.22em] uppercase text-[#C8A46A] mt-3">Studio Control</div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <NavLink to="/admin/leads" data-testid="admin-nav-leads" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 text-sm tracking-wider uppercase text-[11px] transition-colors ${isActive ? "bg-[#C8A46A] text-white" : "hover:bg-[#1E1E1E] text-white/80"}`}>
            <Inbox size={16} /> Leads
          </NavLink>
          <NavLink to="/admin/blog" data-testid="admin-nav-blog" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 text-sm tracking-wider uppercase text-[11px] transition-colors ${isActive ? "bg-[#C8A46A] text-white" : "hover:bg-[#1E1E1E] text-white/80"}`}>
            <BookOpen size={16} /> Journal
          </NavLink>
        </nav>
        <div className="p-4 border-t border-white/10">
          <div className="text-xs text-white/60 mb-2">Signed in as</div>
          <div className="text-sm mb-4 truncate">{user.email}</div>
          <button onClick={async () => { await logout(); navigate("/admin/login", { replace: true }); }} data-testid="admin-logout" className="w-full flex items-center justify-center gap-2 border border-white/20 hover:border-[#C8A46A] hover:text-[#C8A46A] px-4 py-3 text-[10px] tracking-[0.22em] uppercase transition-colors">
            <LogOut size={14} /> Sign out
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}
