import { memo } from "react";
import { Link } from "react-router-dom";
import { Instagram, Linkedin } from "lucide-react";
import { BUSINESS } from "@/data/business";

const Footer = memo(function Footer() {
  return (
    <footer data-testid="site-footer" className="mt-32 border-t border-[#EFE7DC] bg-[#2D2A26] text-white">
      <div className="ngi-container py-24 lg:py-32 grid grid-cols-1 md:grid-cols-12 gap-12">
        <div className="md:col-span-5">
          <div className="flex items-center gap-3 mb-8">
            <span className="block w-2 h-2 bg-[#C8A46A]" />
            <span className="font-serif text-2xl tracking-tight">
              NextGen <span className="italic text-[#C8A46A]">Interiors</span>
            </span>
          </div>
          <p className="font-serif text-3xl md:text-4xl font-light leading-snug max-w-md">
            Quietly considered interiors for residences and workplaces across India.
          </p>
          <Link
            to="/consultation"
            data-testid="footer-book"
            className="inline-flex items-center mt-10 ngi-button-secondary"
          >
            Begin a Project →
          </Link>
        </div>

        <div className="md:col-span-3 md:col-start-7">
          <div className="text-[11px] tracking-[0.22em] uppercase text-[#B38B59] mb-6">Studio</div>
          <ul className="space-y-3 text-white/80 text-sm">
            <li><Link to="/about" className="ngi-link-underline">About</Link></li>
            <li><Link to="/process" className="ngi-link-underline">Process</Link></li>
            <li><Link to="/portfolio" className="ngi-link-underline">Portfolio</Link></li>
            <li><Link to="/journal" className="ngi-link-underline">Journal</Link></li>
            <li><Link to="/testimonials" className="ngi-link-underline">Testimonials</Link></li>
            <li><Link to="/faq" className="ngi-link-underline">FAQ</Link></li>
            <li><Link to="/privacy" className="ngi-link-underline">Privacy</Link></li>
          </ul>
        </div>

        <div className="md:col-span-3">
          <div className="text-[11px] tracking-[0.22em] uppercase text-[#B38B59] mb-6">Studio Address</div>
          <address className="not-italic text-white/80 text-sm leading-relaxed mb-6">
            {BUSINESS.address.line1}<br />
            {BUSINESS.address.line2}
          </address>
          <div className="text-[11px] tracking-[0.22em] uppercase text-[#B38B59] mb-3">Contact</div>
          <a href={`tel:${BUSINESS.phoneRaw}`} className="block text-sm ngi-link-underline mb-2">{BUSINESS.phone}</a>
          <a href={`mailto:${BUSINESS.email}`} className="block text-sm ngi-link-underline">{BUSINESS.email}</a>
          <div className="flex items-center gap-5 mt-8">
            <a href={BUSINESS.social.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="text-white/70 hover:text-[#C8A46A] transition-colors">
              <Instagram size={18} />
            </a>
            <a href={BUSINESS.social.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="text-white/70 hover:text-[#C8A46A] transition-colors">
              <Linkedin size={18} />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="ngi-container py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-[11px] tracking-wider uppercase text-white/50">
          <span>© {new Date().getFullYear()} NextGen Interiors. All rights reserved.</span>
          <span>Crafted in Bengaluru · Working pan-India</span>
        </div>
      </div>
    </footer>
  );
});

export default Footer;
