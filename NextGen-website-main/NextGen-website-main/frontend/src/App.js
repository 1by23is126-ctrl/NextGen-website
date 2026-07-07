import "@/App.css";
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

import HomePage from "@/pages/HomePage";
import AboutPage from "@/pages/AboutPage";
import ServicesPage from "@/pages/ServicesPage";
import ServiceDetailPage from "@/pages/ServiceDetailPage";
import PortfolioPage from "@/pages/PortfolioPage";
import ProjectDetailPage from "@/pages/ProjectDetailPage";
import ProcessPage from "@/pages/ProcessPage";
import TestimonialsPage from "@/pages/TestimonialsPage";
import BlogPage from "@/pages/BlogPage";
import BlogDetailPage from "@/pages/BlogDetailPage";
import FAQPage from "@/pages/FAQPage";
import ContactPage from "@/pages/ContactPage";
import ConsultationPage from "@/pages/ConsultationPage";
import PrivacyPage from "@/pages/PrivacyPage";
import NotFoundPage from "@/pages/NotFoundPage";
import AdminLoginPage from "@/pages/admin/AdminLoginPage";
import AdminLayout from "@/pages/admin/AdminLayout";
import AdminLeadsPage from "@/pages/admin/AdminLeadsPage";
import AdminBlogPage from "@/pages/admin/AdminBlogPage";

function SiteLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}

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
              style: { background: "#0B0B0D", color: "#F7F5F2", border: "1px solid #C9A86A", borderRadius: 0 },
            }}
          />
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
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
