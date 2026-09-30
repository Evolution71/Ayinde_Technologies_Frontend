import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navigation from './components/Navigation';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/login';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Courses from './components/Courses';
import CourseDetailPage from './pages/CourseDetailPage';
import CheckoutPage from './pages/CheckoutPage';

// Service Pages
import ServicesOverviewPage from './pages/ServicesOverviewPage';
import WebsiteServicesPage from './pages/WebsiteServicesPage';
import ApplicationServicesPage from './pages/ApplicationServicesPage';
import ConsultationServicesPage from './pages/ConsultationServicesPage';
import PremiumServicesPage from './pages/PremiumServicesPage';
import ServiceCheckoutPage from './pages/ServiceCheckoutPage';
import AchievementsPage from './pages/AchievementsPage';
import FamousQuotesPage from './pages/FamousQuotesPage';

const App = () => {
  useEffect(() => {
    // Set page title
    document.title = 'Ayinde Technologies - Premium Tech Solutions';
  }, []);

  return (
    <Router>
      <AuthProvider>
        <Navigation />
        <main style={{ minHeight: 'calc(100vh - 120px)' }}>
          <Routes>
            {/* Main Pages */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />

            {/* Authentication */}
            <Route path="/login" element={<Login />} />

            {/* Courses */}
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:courseId" element={<CourseDetailPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />

            {/* Services Routes - 12-Page Structure */}
            <Route path="/services" element={<ServicesOverviewPage />} />
            <Route path="/services/website" element={<WebsiteServicesPage />} />
            <Route path="/services/applications" element={<ApplicationServicesPage />} />
            <Route path="/services/consultation" element={<ConsultationServicesPage />} />
            <Route path="/services/premium" element={<PremiumServicesPage />} />
            <Route path="/services/checkout" element={<ServiceCheckoutPage />} />

            {/* Achievements/Quotes Page */}
            <Route path="/achievements" element={<AchievementsPage />} />
            <Route path="/quotes" element={<FamousQuotesPage />} />

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