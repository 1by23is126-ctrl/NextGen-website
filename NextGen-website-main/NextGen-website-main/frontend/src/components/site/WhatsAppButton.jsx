import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { whatsappUrl } from "@/data/business";
import { useScroll, useMotionValueEvent } from "framer-motion";

export default function WhatsAppButton() {
  const [visible, setVisible] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setVisible(latest > 320);
  });

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
      <div className="bg-[#C8A46A] hover:bg-[#171717] text-white w-14 h-14 flex items-center justify-center transition-colors duration-300 shadow-lg">
        <MessageCircle size={20} />
      </div>
      <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-[#171717] text-white text-[11px] tracking-wider uppercase px-3 py-2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        Chat on WhatsApp
      </span>
    </a>
  );
}
