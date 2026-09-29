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

// NEW: Premium Services Pages
import PricingPage from './pages/PricingPage';
import ServiceCheckoutPage from './pages/ServiceCheckoutPage';
import WebsiteServicesPage from './pages/WebsiteServicesPage';
import ApplicationServicesPage from './pages/ApplicationServicesPage';
import ConsultationServicesPage from './pages/ConsultationServicesPage';

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

            {/* NEW: Premium Services */}
            <Route path="/services" element={<PricingPage />} />
            <Route path="/services/websites" element={<WebsiteServicesPage />} />
            <Route path="/services/applications" element={<ApplicationServicesPage />} />
            <Route path="/services/consultation" element={<ConsultationServicesPage />} />
            <Route path="/services/checkout" element={<ServiceCheckoutPage />} />

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