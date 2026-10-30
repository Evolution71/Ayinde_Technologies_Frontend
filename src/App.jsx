import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
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
import FormPage from './pages/FormPage';
import CRMPage from './pages/Admin/Crmpage';

// Admin console (client management) - same design as the PHP admin dashboard
import ConsoleLayout from './console/ConsoleLayout';
import ConsoleDashboard from './console/pages/ConsoleDashboard';
import ConsoleProjects from './console/pages/ConsoleProjects';
import ConsoleServiceRequests from './console/pages/ConsoleServiceRequests';
import ConsoleMessages from './console/pages/ConsoleMessages';
import ConsoleSharedFiles from './console/pages/ConsoleSharedFiles';
import ConsoleContacts from './console/pages/ConsoleContacts';
import ConsoleNewsletters from './console/pages/ConsoleNewsletters';
import ConsoleBroadcasts from './console/pages/ConsoleBroadcasts';
import ConsoleSettings from './console/pages/ConsoleSettings';

// Service Pages
import ServicesOverviewPage from './pages/ServicesOverviewPage';
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

// Offering pages: Build, Automate, Plan
import { BuildPage, AutomatePage, PlanPage } from './pages/OfferingPage';

const ConsoleRoutes = () => (
  <Routes>
    <Route path="/console" element={<ConsoleLayout />}>
      <Route index element={<ConsoleDashboard />} />
      <Route path="projects" element={<ConsoleProjects />} />
      <Route path="service-requests" element={<ConsoleServiceRequests />} />
      <Route path="messages" element={<ConsoleMessages />} />
      <Route path="shared-files" element={<ConsoleSharedFiles />} />
      <Route path="contacts" element={<ConsoleContacts />} />
      <Route path="newsletters" element={<ConsoleNewsletters />} />
      <Route path="broadcasts" element={<ConsoleBroadcasts />} />
      <Route path="settings" element={<ConsoleSettings />} />
      <Route path="*" element={<Navigate to="/console" replace />} />
    </Route>
  </Routes>
);

const SiteRoutes = () => (
  <>
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

        {/* Offerings */}
        <Route path="/build" element={<BuildPage />} />
        <Route path="/automate" element={<AutomatePage />} />
        <Route path="/plan" element={<PlanPage />} />

        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Navigate to="/login" replace state={{ mode: 'register' }} />} />
        <Route path="/signup" element={<Navigate to="/login" replace state={{ mode: 'register' }} />} />

        {/* Courses */}
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:courseId" element={<CourseDetailPage />} />
        <Route path="/checkout/:courseId" element={<CheckoutPage />} />

        {/* Services Routes - 12-Page Structure */}
        <Route path="/services" element={<ServicesOverviewPage />} />
        <Route path="/services/flyers" element={<ServiceFlyers />} />
        <Route path="/services/website" element={<WebsiteServicesPage />} />
        <Route path="/services/applications" element={<ApplicationServicesPage />} />
        <Route path="/services/consultation" element={<ConsultationServicesPage />} />
        <Route path="/services/premium" element={<PremiumServicesPage />} />
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
  </>
);

// The admin console has its own sidebar and topbar, so the public navigation and footer are hidden there
const Shell = () => {
  const { pathname } = useLocation();
  const isConsole = pathname === '/console' || pathname.startsWith('/console/');
  return isConsole ? <ConsoleRoutes /> : <SiteRoutes />;
};

const App = () => {
  useEffect(() => {
    // Set page title
    document.title = 'Ayinde Technologies Corporation - Websites, Apps, Consulting and Enterprise Solutions';
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <AuthProvider>
        <Shell />
      </AuthProvider>
    </Router>
  );
};

export default App;