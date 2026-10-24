import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import BackToTopButton from './components/BackToTopButton';
import './styles/responsive.css';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import ContactForm from './pages/ContactForm';
import Login from './pages/login';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Courses from './components/Courses';
import CourseDetailPage from './pages/CourseDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import ServiceFlyers from './components/ServiceFlyers';
import BookPage from './pages/BookPage';
import FormPage from './pages/Formpage';
import CRMPage from './pages/Admin/Crmpage';

// Service Pages
import ServicesOverviewPage from './pages/ServicesOverviewPage';
import WhyAyinde from './components/WhyAyinde';
import WebsiteServicesPage from './pages/WebsiteServicesPage';
import ApplicationServicesPage from './pages/ApplicationServicesPage';
import ConsultationServicesPage from './pages/ConsultationServicesPage';
import PremiumServicesPage from './pages/PremiumServicesPage';
import ServiceCheckoutPage from './pages/ServiceCheckoutPage';
import AchievementsPage from './pages/AchievementsPage';
import FamousQuotesPage from './pages/FamousQuotesPage';

// Design pages (PHP design). New paths only; existing routes are unchanged.
import SiteAbout from './pages/AboutUs';
import SiteServices from './pages/Services';
import SiteCourses from './pages/Courses';
import SiteProducts from './pages/Products';
import SiteContact from './pages/Contact';
import SiteTermsAndConditions from './pages/TermsAndConditions';
import SitePremiumServices from './pages/PremiumServices';
import SiteWebsiteDevelopment from './pages/WebsiteDevelopment';
import SiteAppDevelopment from './pages/AppDevelopment';
import SiteTechConsulting from './pages/TechConsulting';
import SiteHrWise from './pages/HrWise';
import SiteVerusPos from './pages/VerusPos';
import SiteExactus from './pages/Exactus';
import SiteInventro from './pages/Inventro';
import SiteStartProject from './pages/StartProject';
import AllPages from './pages/AllPages';

// Service pages end with the "why Ayinde" section before the global footer.
const withWhy = (page) => (
  <>
    {page}
    <WhyAyinde />
  </>
);

const App = () => {
  useEffect(() => {
    // Set page title
    document.title = 'Ayinde Technologies - Premium Tech Solutions';
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <AuthProvider>
        <Navigation />
        <main style={{ minHeight: 'calc(100vh - 120px)' }}>
          <BackToTopButton />
          <Routes>
            {/* Main Pages */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact-form" element={<ContactForm />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />

            {/* Authentication */}
            <Route path="/login" element={<Login />} />

            {/* Courses */}
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:courseId" element={<CourseDetailPage />} />
            <Route path="/checkout/:courseId" element={<CheckoutPage />} />

            {/* Services Routes - 12-Page Structure */}
            <Route path="/services" element={withWhy(<ServicesOverviewPage />)} />
            <Route path="/services/flyers" element={<ServiceFlyers />} />
            <Route path="/services/website" element={withWhy(<WebsiteServicesPage />)} />
            <Route path="/services/applications" element={withWhy(<ApplicationServicesPage />)} />
            <Route path="/services/consultation" element={withWhy(<ConsultationServicesPage />)} />
            <Route path="/services/premium" element={withWhy(<PremiumServicesPage />)} />
            <Route path="/services/checkout" element={<ServiceCheckoutPage />} />

            {/* Achievements/Quotes Page */}
            <Route path="/achievements" element={<AchievementsPage />} />

            {/* Booking, forms and admin CRM */}
            <Route path="/book" element={<BookPage />} />
            <Route path="/forms/:slug" element={<FormPage />} />
            <Route path="/admin/crm" element={<CRMPage />} />
            <Route path="/quotes" element={<FamousQuotesPage />} />

            {/* Design pages (new paths; existing pages above are unchanged) */}
            <Route path="/about-us" element={<SiteAbout />} />
            <Route path="/our-services" element={<SiteServices />} />
            <Route path="/our-courses" element={<SiteCourses />} />
            <Route path="/products" element={<SiteProducts />} />
            <Route path="/contact" element={<SiteContact />} />
            <Route path="/terms-and-conditions" element={<SiteTermsAndConditions />} />
            <Route path="/premium-services" element={<SitePremiumServices />} />
            <Route path="/website-development" element={<SiteWebsiteDevelopment />} />
            <Route path="/app-development" element={<SiteAppDevelopment />} />
            <Route path="/tech-consulting" element={<SiteTechConsulting />} />
            <Route path="/hr-wise" element={<SiteHrWise />} />
            <Route path="/verus-pos" element={<SiteVerusPos />} />
            <Route path="/exactus" element={<SiteExactus />} />
            <Route path="/inventro" element={<SiteInventro />} />
            <Route path="/start-project" element={<SiteStartProject />} />
            <Route path="/all-pages" element={<AllPages />} />

            {/* Catch-all - redirect to home */}
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
        <Footer />
      </AuthProvider>
    </Router>
  );
};

export default App;