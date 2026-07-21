import "@/App.css";
import React, { Suspense, lazy, memo } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider } from "@/context/AuthContext";
import SmoothScroll from "@/components/site/SmoothScroll";
import CursorFX from "@/components/site/CursorFX";
import ScrollToTop from "@/components/site/ScrollToTop";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import WhatsAppButton from "@/components/site/WhatsAppButton";
import PageLoader from "@/components/site/PageLoader";

const HomePage = lazy(() => import("@/pages/HomePage"));
const AboutPage = lazy(() => import("@/pages/AboutPage"));
const ServicesPage = lazy(() => import("@/pages/ServicesPage"));
const ServiceDetailPage = lazy(() => import("@/pages/ServiceDetailPage"));
const PortfolioPage = lazy(() => import("@/pages/PortfolioPage"));
const ProjectDetailPage = lazy(() => import("@/pages/ProjectDetailPage"));
const ProcessPage = lazy(() => import("@/pages/ProcessPage"));
const TestimonialsPage = lazy(() => import("@/pages/TestimonialsPage"));
const BlogPage = lazy(() => import("@/pages/BlogPage"));
const BlogDetailPage = lazy(() => import("@/pages/BlogDetailPage"));
const FAQPage = lazy(() => import("@/pages/FAQPage"));
const ContactPage = lazy(() => import("@/pages/ContactPage"));
const ConsultationPage = lazy(() => import("@/pages/ConsultationPage"));
const PrivacyPage = lazy(() => import("@/pages/PrivacyPage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));
const AdminLoginPage = lazy(() => import("@/pages/admin/AdminLoginPage"));
const AdminLayout = lazy(() => import("@/pages/admin/AdminLayout"));
const AdminLeadsPage = lazy(() => import("@/pages/admin/AdminLeadsPage"));
const AdminBlogPage = lazy(() => import("@/pages/admin/AdminBlogPage"));

const RouteFallback = memo(function RouteFallback() {
  return (
    <div className="min-h-screen bg-[#F6F4F1] flex items-center justify-center px-6">
      <div className="w-full max-w-sm rounded-[24px] border border-[#E7E2DA] bg-white/80 px-8 py-10 text-center shadow-[0_18px_50px_rgba(23,23,23,0.06)]">
        <div className="mx-auto mb-4 h-2 w-2 rounded-full bg-[#C8A46A]" />
        <div className="font-serif text-xl tracking-tight text-[#171717]">Loading experience</div>
        <div className="mt-2 text-sm text-[#707070]">Preparing the next section with a lighter touch.</div>
      </div>
    </div>
  );
});

const SiteLayout = memo(function SiteLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
      <WhatsAppButton />
    </>
  );
});

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <SmoothScroll />
          <CursorFX />
          <ScrollToTop />
          <PageLoader />
          <Toaster
            position="bottom-center"
            toastOptions={{
              style: { background: "#171717", color: "#F6F4F1", border: "1px solid #C8A46A", borderRadius: 0 },
            }}
          />
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<SiteLayout><HomePage /></SiteLayout>} />
              <Route path="/about" element={<SiteLayout><AboutPage /></SiteLayout>} />
              <Route path="/services" element={<SiteLayout><ServicesPage /></SiteLayout>} />
              <Route path="/services/:slug" element={<SiteLayout><ServiceDetailPage /></SiteLayout>} />
              <Route path="/portfolio" element={<SiteLayout><PortfolioPage /></SiteLayout>} />
              <Route path="/portfolio/:slug" element={<SiteLayout><ProjectDetailPage /></SiteLayout>} />
              <Route path="/process" element={<SiteLayout><ProcessPage /></SiteLayout>} />
              <Route path="/testimonials" element={<SiteLayout><TestimonialsPage /></SiteLayout>} />
              <Route path="/journal" element={<SiteLayout><BlogPage /></SiteLayout>} />
              <Route path="/journal/:slug" element={<SiteLayout><BlogDetailPage /></SiteLayout>} />
              <Route path="/faq" element={<SiteLayout><FAQPage /></SiteLayout>} />
              <Route path="/contact" element={<SiteLayout><ContactPage /></SiteLayout>} />
              <Route path="/consultation" element={<SiteLayout><ConsultationPage /></SiteLayout>} />
              <Route path="/privacy" element={<SiteLayout><PrivacyPage /></SiteLayout>} />

              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminLeadsPage />} />
                <Route path="leads" element={<AdminLeadsPage />} />
                <Route path="blog" element={<AdminBlogPage />} />
              </Route>

              <Route path="*" element={<SiteLayout><NotFoundPage /></SiteLayout>} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
