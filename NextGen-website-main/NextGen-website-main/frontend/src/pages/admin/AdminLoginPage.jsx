import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

export default function AdminLoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) navigate("/admin/leads");
  }, [user, navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await login(email, password);
    setLoading(false);
    if (res.ok) {
      toast.success("Welcome back.");
      navigate("/admin/leads");
    } else {
      setError(res.error || "Invalid credentials");
    }
  };

  return (
    <div data-testid="admin-login-page" className="min-h-screen flex bg-[#F6F4F1]">
      <div className="hidden md:flex md:w-1/2 bg-[#171717] text-white relative overflow-hidden">
        <img
          src="https://images.pexels.com/photos/20418771/pexels-photo-20418771.jpeg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="relative z-10 p-12 lg:p-16 flex flex-col justify-between w-full">
          <Link to="/" className="flex items-center gap-3">
            <span className="block w-2 h-2 bg-[#C8A46A]" />
            <span className="font-serif text-xl">NextGen <span className="italic text-[#C8A46A]">Interiors</span></span>
          </Link>
          <div>
            <div className="ngi-overline text-[#C8A46A] mb-4"><span className="ngi-rule" />Studio Control</div>
            <h2 className="font-serif text-4xl lg:text-5xl font-light leading-tight">The quiet panel behind the practice.</h2>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          onSubmit={onSubmit}
          className="w-full max-w-md"
        >
          <div className="ngi-overline mb-4"><span className="ngi-rule" />Studio login</div>
          <h1 className="font-serif text-4xl md:text-5xl font-light leading-tight mb-10">Welcome back.</h1>

          <div className="space-y-6">
            <div>
              <label className="text-[10px] tracking-[0.22em] uppercase text-[#707070]">Email</label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                data-testid="admin-login-email"
                className="w-full bg-white border border-[#E7E2DA] focus:border-[#C8A46A] outline-none py-3 text-lg font-serif"
              />
            </div>
            <div>
              <label className="text-[10px] tracking-[0.22em] uppercase text-[#707070]">Password</label>
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                data-testid="admin-login-password"
                className="w-full bg-white border border-[#E7E2DA] focus:border-[#C8A46A] outline-none py-3 text-lg font-serif"
              />
            </div>
            {error && <p data-testid="admin-login-error" className="text-sm text-red-700">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              data-testid="admin-login-submit"
              className="w-full bg-[#171717] text-white hover:bg-[#C8A46A] hover:text-white px-8 py-4 text-[11px] tracking-[0.22em] uppercase transition-colors disabled:opacity-60"
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </div>

          <Link to="/" className="mt-12 inline-block text-[10px] tracking-[0.22em] uppercase text-[#1E1E1E]/60 ngi-link-underline">← Back to site</Link>
        </motion.form>
      </div>
    </div>
  );
}
