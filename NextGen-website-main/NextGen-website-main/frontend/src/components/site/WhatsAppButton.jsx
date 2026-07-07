import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { whatsappUrl } from "@/data/business";

export default function WhatsAppButton() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 320);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  if (!visible) return null;
  return (
    <a
      data-testid="floating-whatsapp"
      href={whatsappUrl()}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-40 group"
    >
      <div className="bg-[#7A9070] hover:bg-[#0B0B0D] text-[#F7F5F2] w-14 h-14 flex items-center justify-center transition-colors duration-300 shadow-lg">
        <MessageCircle size={20} />
      </div>
      <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-[#0B0B0D] text-[#F7F5F2] text-[11px] tracking-wider uppercase px-3 py-2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        Chat on WhatsApp
      </span>
    </a>
  );
}
