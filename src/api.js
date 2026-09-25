/**
 * API Client - Frontend API integration
 * 
 * Handles all HTTP requests to backend with auth headers
 * Uses localStorage for token management
 * 
 * Usage:
 *   import { api } from '../api'
 *   await api.getCourses()
 *   await api.login(email, password)
 */

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// ========== TOKEN MANAGEMENT ==========

const setToken = (token) => {
  if (token) {
    localStorage.setItem('ayinde_token', token);
  } else {
    localStorage.removeItem('ayinde_token');
  }
};

const getToken = () => localStorage.getItem('ayinde_token');

// ========== HELPER FUNCTIONS ==========

const authHeaders = () => {
  const token = getToken();
  if (!token) return {};
  return { 'Authorization': `Bearer ${token}` };
};

const parseOrThrow = async (res) => {
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || `HTTP ${res.status}`);
  }
  return res.json();
};

// ========== MAIN API OBJECT ==========

export const api = {
  // ========== AUTH ENDPOINTS ==========

  async login(email, password) {
    const res = await fetch(`${API_URL}/api/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await parseOrThrow(res);
    setToken(data.access_token); // Auto-save token
    return data;
  },

  async register(name, email, password) {
    const res = await fetch(`${API_URL}/api/auth/register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    const data = await parseOrThrow(res);
    setToken(data.access_token); // Auto-save token
    return data;
  },

  async logout() {
    setToken(null);
  },

  async getCurrentUser() {
    const res = await fetch(`${API_URL}/api/auth/me/`, {
      headers: authHeaders()
    });
    return parseOrThrow(res);
  },

  // ========== COURSE ENDPOINTS ==========

  async getCourses() {
    /**
     * Get list of all courses
     * PUBLIC endpoint - no auth required
     */
    const res = await fetch(`${API_URL}/api/courses/`, {
      headers: { 'Content-Type': 'application/json' }
    });
    return parseOrThrow(res);
  },

  async getCourseDetail(courseId) {
    /**
     * Get detailed course view with lessons
     * REQUIRES auth - must be enrolled in course
     */
    const res = await fetch(`${API_URL}/api/courses/${courseId}/`, {
      headers: authHeaders()
    });
    return parseOrThrow(res);
  },

  async getMyEnrollments() {
    /**
     * Get list of courses user is enrolled in
     * REQUIRES auth
     */
    const res = await fetch(`${API_URL}/api/courses/me/enrollments/`, {
      headers: authHeaders()
    });
    return parseOrThrow(res);
  },

  // ========== SUBSCRIPTION ENDPOINTS (NEW) ==========

  async enrollInCourse(courseId) {
    /**
     * Start a free 30-day trial on a course
     * REQUIRES auth
     * 
     * Returns: enrollment_id, trial_ends_at
     */
    const res = await fetch(`${API_URL}/api/courses/${courseId}/enroll/`, {
      method: 'POST',
      headers: authHeaders()
    });
    return parseOrThrow(res);
  },

  async getEnrollmentStatus(courseId) {
    /**
     * Get trial countdown and subscription status
     * REQUIRES auth
     * 
     * Returns: status (trial/active/expired/cancelled), 
     *          trial_ends_at, days_remaining
     */
    const res = await fetch(`${API_URL}/api/courses/${courseId}/enrollment-status/`, {
      headers: authHeaders()
    });
    return parseOrThrow(res);
  },

  async savePaymentMethod(courseId, nonce) {
    /**
     * Save Square payment token for auto-charge after trial
     * REQUIRES auth
     * 
     * Args:
     *   courseId: Course ID
     *   nonce: Square payment token (from Web Payments SDK)
     * 
     * Returns: success confirmation
     */
    const res = await fetch(`${API_URL}/api/courses/${courseId}/save-payment-method/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders()
      },
      body: JSON.stringify({ nonce })
    });
    return parseOrThrow(res);
  },

  async cancelSubscription(courseId) {
    /**
     * Cancel course subscription
     * No charge will occur on trial end
     * REQUIRES auth
     * 
     * Returns: success confirmation
     */
    const res = await fetch(`${API_URL}/api/courses/${courseId}/cancel/`, {
      method: 'POST',
      headers: authHeaders()
    });
    return parseOrThrow(res);
  },

  async getCourseProgress(courseId) {
    /**
     * Get user's overall progress in a course
     * REQUIRES auth
     * 
     * Returns: overall_progress %, lessons progress array
     */
    const res = await fetch(`${API_URL}/api/courses/${courseId}/progress/`, {
      headers: authHeaders()
    });
    return parseOrThrow(res);
  },

  // ========== LESSON ENDPOINTS ==========

  async getLesson(courseId, lessonId) {
    /**
     * Get single lesson content
     * REQUIRES auth + active enrollment
     */
    const res = await fetch(`${API_URL}/api/courses/${courseId}/lessons/${lessonId}/`, {
      headers: authHeaders()
    });
    return parseOrThrow(res);
  },

  async completeLesson(courseId, lessonId) {
    /**
     * Mark lesson as complete
     * Updates course progress %
     * REQUIRES auth
     */
    const res = await fetch(`${API_URL}/api/courses/${courseId}/lessons/${lessonId}/complete/`, {
      method: 'POST',
      headers: authHeaders()
    });
    return parseOrThrow(res);
  },

  // ========== SERVICE ENDPOINTS ==========

  async getServices() {
    /**
     * Get list of premium services
     * PUBLIC endpoint
     */
    const res = await fetch(`${API_URL}/api/services/`, {
      headers: { 'Content-Type': 'application/json' }
    });
    return parseOrThrow(res);
  },

  async purchaseService(serviceId, package_type, billing_cycle) {
    /**
     * Purchase a premium service
     * REQUIRES auth
     * 
     * Args:
     *   serviceId: Service ID
     *   package_type: e.g., "Website Pro", "Application Pro", "Supreme VIP"
     *   billing_cycle: "monthly", "6_months", "annual", "2_year", "3_year"
     */
    const res = await fetch(`${API_URL}/api/services/purchase/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders()
      },
      body: JSON.stringify({ service_id: serviceId, package_type, billing_cycle })
    });
    return parseOrThrow(res);
  },

  // ========== PAYMENT ENDPOINTS ==========

  async createPaymentIntent(courseId, amount) {
    /**
     * Create Square payment intent
     * REQUIRES auth
     */
    const res = await fetch(`${API_URL}/api/payments/create-intent/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders()
      },
      body: JSON.stringify({ course_id: courseId, amount })
    });
    return parseOrThrow(res);
  },

  async verifyPayment(paymentId, nonce) {
    /**
     * Verify and process payment
     * REQUIRES auth
     */
    const res = await fetch(`${API_URL}/api/payments/verify/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders()
      },
      body: JSON.stringify({ payment_id: paymentId, nonce })
    });
    return parseOrThrow(res);
  },

  async getPaymentStatus(paymentId) {
    /**
     * Get payment status
     * REQUIRES auth
     */
    const res = await fetch(`${API_URL}/api/payments/${paymentId}/`, {
      headers: authHeaders()
    });
    return parseOrThrow(res);
  }
};

// ========== EXPORT FOR USE ==========

export const logout = () => api.logout();