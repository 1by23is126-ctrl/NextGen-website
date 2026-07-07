export const BUSINESS = {
  name: "NextGen Interiors",
  tagline: "Interior architecture for considered lives.",
  phone: "+91 98450 12345",
  phoneRaw: "+919845012345",
  email: "hello@nextgeninteriors.in",
  whatsapp: "+919845012345",
  whatsappMessage: "Hello, I'd like to discuss an interior project with NextGen Interiors.",
  address: {
    line1: "No. 14, 3rd Cross, Indiranagar",
    line2: "Bengaluru, Karnataka 560038",
  },
  hours: {
    weekdays: "Mon – Fri · 10am – 7pm",
    saturday: "Sat · 11am – 5pm",
    sunday: "Sun · By appointment",
  },
  social: {
    instagram: "https://instagram.com/nextgeninteriors",
    pinterest: "https://pinterest.com/nextgeninteriors",
    linkedin: "https://linkedin.com/company/nextgeninteriors",
  },
  mapEmbed:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.4663099!2d77.6391!3d12.9784!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae167a8a3a3a3a%3A0x3a3a3a3a3a3a3a3a!2sIndiranagar%2C%20Bengaluru!5e0!3m2!1sen!2sin!4v1700000000000",
};

export const whatsappUrl = (message) =>
  `https://wa.me/${BUSINESS.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
    message || BUSINESS.whatsappMessage,
  )}`;
