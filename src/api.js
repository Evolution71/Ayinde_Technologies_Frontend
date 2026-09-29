/**
 * API Client for Ayinde Technologies
 * Updated to include new captcha methods and corrected register function
 *
 * Usage:
 *   import { api } from '../api'
 *   await api.getCaptcha()
 *   await api.verifyCaptcha(captchaId, userAnswer)
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
    setToken(data.access_token);
    return data;
  },

  async register(first_name, last_name, email, password) {
    const res = await fetch(`${API_URL}/api/auth/register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ first_name, last_name, email, password })
    });
    const data = await parseOrThrow(res);
    setToken(data.access_token);
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

  // ========== CAPTCHA ENDPOINTS (NEW) ==========

  async getCaptcha() {
    /**
     * Generate a new captcha challenge
     *
     * Returns: {
     *   captcha_id: unique ID (needed for verification),
     *   captcha_image: text to display to user,
     *   expires_at: when captcha expires
     * }
     *
     * Frontend should display captcha_image and ask user to enter it
     */
    const res = await fetch(`${API_URL}/api/captcha/`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    return parseOrThrow(res);
  },

  async verifyCaptcha(captchaId, userAnswer) {
    /**
     * Verify user's captcha answer
     *
     * Args:
     *   captchaId: ID from getCaptcha response
     *   userAnswer: What user typed
     *
     * Returns: {
     *   success: true/false,
     *   message: explanation,
     *   score: 1.0 if valid, 0.0 if not
     * }
     */
    const res = await fetch(`${API_URL}/api/captcha/verify/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        captcha_id: captchaId,
        captcha_answer: userAnswer
      })
    });
    return parseOrThrow(res);
  },

  async deleteCaptcha(captchaId) {
    /**
     * Delete a captcha (for form cancellations)
     */
    const res = await fetch(`${API_URL}/api/captcha/${captchaId}/`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    });
    return parseOrThrow(res);
  },

  // ========== COURSE ENDPOINTS ==========

  async getCourses() {
    const res = await fetch(`${API_URL}/api/courses/`, {
      headers: { 'Content-Type': 'application/json' }
    });
    return parseOrThrow(res);
  },

  async getCourseDetail(courseId) {
    const res = await fetch(`${API_URL}/api/courses/${courseId}/`, {
      headers: authHeaders()
    });
    return parseOrThrow(res);
  },

  async getMyEnrollments() {
    const res = await fetch(`${API_URL}/api/courses/me/enrollments/`, {
      headers: authHeaders()
    });
    return parseOrThrow(res);
  },

  async enrollInCourse(courseId) {
    const res = await fetch(`${API_URL}/api/courses/${courseId}/enroll/`, {
      method: 'POST',
      headers: authHeaders()
    });
    return parseOrThrow(res);
  },

  async getEnrollmentStatus(courseId) {
    const res = await fetch(`${API_URL}/api/courses/${courseId}/enrollment-status/`, {
      headers: authHeaders()
    });
    return parseOrThrow(res);
  },

  async savePaymentMethod(courseId, nonce) {
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
    const res = await fetch(`${API_URL}/api/courses/${courseId}/cancel/`, {
      method: 'POST',
      headers: authHeaders()
    });
    return parseOrThrow(res);
  },

  async getCourseProgress(courseId) {
    const res = await fetch(`${API_URL}/api/courses/${courseId}/progress/`, {
      headers: authHeaders()
    });
    return parseOrThrow(res);
  },

  // ========== LESSON ENDPOINTS ==========

  async getLesson(courseId, lessonId) {
    const res = await fetch(`${API_URL}/api/courses/${courseId}/lessons/${lessonId}/`, {
      headers: authHeaders()
    });
    return parseOrThrow(res);
  },

  async completeLesson(courseId, lessonId) {
    const res = await fetch(`${API_URL}/api/courses/${courseId}/lessons/${lessonId}/complete/`, {
      method: 'POST',
      headers: authHeaders()
    });
    return parseOrThrow(res);
  },

  // ========== SERVICE ENDPOINTS ==========

  async getServices() {
    const res = await fetch(`${API_URL}/api/services/`, {
      headers: { 'Content-Type': 'application/json' }
    });
    return parseOrThrow(res);
  },

  async purchaseService(serviceId, package_type, billing_cycle) {
    const res = await fetch(`${API_URL}/api/services/purchase/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders()
      },
      body: JSON.stringify({
        service_id: serviceId,
        package_type,
        billing_cycle
      })
    });
    return parseOrThrow(res);
  },

  // ========== PAYMENT ENDPOINTS ==========

  async createPaymentIntent(courseId, amount) {
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
    const res = await fetch(`${API_URL}/api/payments/${paymentId}/`, {
      headers: authHeaders()
    });
    return parseOrThrow(res);
  },

  // ========== CONTACT ENDPOINTS ==========

  async submitContactForm(formData) {
    const res = await fetch(`${API_URL}/api/contact/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    return parseOrThrow(res);
  },

  // ========== TEAM ENDPOINTS ==========

  async getTeam() {
    const res = await fetch(`${API_URL}/api/team/`, {
      headers: { 'Content-Type': 'application/json' }
    });
    return parseOrThrow(res);
  },

  async getTeamMember(memberId) {
    const res = await fetch(`${API_URL}/api/team/${memberId}/`, {
      headers: { 'Content-Type': 'application/json' }
    });
    return parseOrThrow(res);
  },

  // ========== PROJECTS ENDPOINTS ==========

  async getProjects() {
    const res = await fetch(`${API_URL}/api/projects/`, {
      headers: authHeaders()
    });
    return parseOrThrow(res);
  },

  async getProject(projectId) {
    const res = await fetch(`${API_URL}/api/projects/${projectId}/`, {
      headers: authHeaders()
    });
    return parseOrThrow(res);
  }
};

export const logout = () => api.logout();