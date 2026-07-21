import { useState, useEffect, useCallback, memo } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
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

const Navbar = memo(function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const overDarkHero = !scrolled && (pathname === "/" || pathname.startsWith("/portfolio/"));
  const navText = overDarkHero ? "text-white" : "text-[#171717]";
  const mutedNavText = overDarkHero ? "text-white/75 hover:text-[#C8A46A]" : "text-[#1E1E1E]/70 hover:text-[#C8A46A]";

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 24);
  });

  const toggleMenu = useCallback(() => setOpen((v) => !v), []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      data-testid="site-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-[#F7F4EF]/90 backdrop-blur-xl border-b border-[#EFE7DC] shadow-[0_12px_35px_rgba(45,42,38,0.06)]" : "bg-transparent"
      }`}
    >
      <div className={`ngi-container mt-4 flex items-center justify-between rounded-full border px-4 py-3 md:px-6 md:py-4 transition-all duration-500 ${
        scrolled ? "border-[#EFE7DC] bg-[#F7F4EF]/90 shadow-[0_12px_35px_rgba(45,42,38,0.06)]" : "border-white/20 bg-white/10 backdrop-blur-md"
      }`}>
        <Link to="/" data-testid="nav-logo" className="flex items-center gap-3 group">
          <span className="block w-2 h-2 bg-[#C8A46A]" />
          <span className={`font-serif text-xl md:text-2xl tracking-tight ${navText}`}>
            NextGen <span className={`italic font-normal ${overDarkHero ? "text-[#C8A46A]" : "text-[#707070]"}`}>Interiors</span>
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
                  isActive ? navText : mutedNavText
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
            className="hidden md:inline-flex items-center rounded-full bg-[#2D2A26] text-white px-6 py-3 text-[11px] tracking-[0.22em] uppercase hover:bg-[#B38B59] hover:text-white transition-colors duration-300"
          >
            Book Consultation
          </Link>
          <button
            data-testid="nav-mobile-toggle"
            onClick={toggleMenu}
            aria-expanded={open}
            className={`lg:hidden w-10 h-10 flex items-center justify-center rounded-full border transition-colors ${overDarkHero ? "border-white/25 text-white" : "border-[#EFE7DC] text-[#2D2A26] bg-white/80 backdrop-blur-sm"}`}
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
            className="lg:hidden bg-[#F7F4EF] border-t border-[#EFE7DC]"
          >
            <div className="ngi-container py-8 flex flex-col gap-4">
              {NAV.map((n) => (
                <NavLink
                  key={n.to}
                  to={n.to}
                  data-testid={`mobile-nav-${n.label.toLowerCase()}`}
                  className="font-serif text-3xl text-[#2D2A26]"
                  end={n.to === "/"}
                >
                  {n.label}
                </NavLink>
              ))}
              <Link
                to="/consultation"
                data-testid="mobile-nav-book"
                className="mt-6 inline-flex items-center bg-[#171717] text-white px-6 py-4 text-[11px] tracking-[0.22em] uppercase w-fit"
              >
                Book Consultation
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
});

export default Navbar;
