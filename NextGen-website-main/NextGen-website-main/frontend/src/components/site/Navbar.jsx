import { useState, useEffect } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/process", label: "Process" },
  { to: "/journal", label: "Journal" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      data-testid="site-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-[#F7F5F2]/95 backdrop-blur-md border-b border-[#0B0B0D]/10" : "bg-transparent"
      }`}
    >
      <div className="ngi-container flex items-center justify-between py-5 md:py-6">
        <Link to="/" data-testid="nav-logo" className="flex items-center gap-3 group">
          <span className="block w-2 h-2 bg-[#C9A86A]" />
          <span className="font-serif text-xl md:text-2xl tracking-tight text-[#0B0B0D]">
            NextGen <span className="italic font-normal text-[#6D4C41]">Interiors</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-10">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              data-testid={`nav-${n.label.toLowerCase()}`}
              className={({ isActive }) =>
                `text-[13px] tracking-wider uppercase ngi-link-underline transition-colors ${
                  isActive ? "text-[#0B0B0D]" : "text-[#1B1D22]/70 hover:text-[#0B0B0D]"
                }`
              }
              end={n.to === "/"}
            >
              {n.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/consultation"
            data-testid="nav-book-cta"
            className="hidden md:inline-flex items-center bg-[#0B0B0D] text-[#F7F5F2] px-6 py-3 text-[11px] tracking-[0.22em] uppercase hover:bg-[#C9A86A] hover:text-[#0B0B0D] transition-colors duration-300"
          >
            Book Consultation
          </Link>
          <button
            data-testid="nav-mobile-toggle"
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden w-10 h-10 flex items-center justify-center border border-[#0B0B0D]/15 text-[#0B0B0D]"
            aria-label="Open menu"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-[#F7F5F2] border-t border-[#0B0B0D]/10"
          >
            <div className="ngi-container py-8 flex flex-col gap-4">
              {NAV.map((n) => (
                <NavLink
                  key={n.to}
                  to={n.to}
                  data-testid={`mobile-nav-${n.label.toLowerCase()}`}
                  className="font-serif text-3xl text-[#0B0B0D]"
                  end={n.to === "/"}
                >
                  {n.label}
                </NavLink>
              ))}
              <Link
                to="/consultation"
                data-testid="mobile-nav-book"
                className="mt-6 inline-flex items-center bg-[#0B0B0D] text-[#F7F5F2] px-6 py-4 text-[11px] tracking-[0.22em] uppercase w-fit"
              >
                Book Consultation
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
