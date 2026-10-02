/**
 * API Client for Ayinde Technologies - FIXED
 * ✅ Fixed verifyPayment to accept billing info as 3rd parameter
 * ✅ Fixed token key to use 'ayinde_token' consistently
 *
 * Usage:
 *   import { api } from '../api'
 *   await api.verifyPayment(paymentId, nonce, { billingPostalCode, billingCountry })
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

  // ========== CAPTCHA ENDPOINTS ==========

  async getCaptcha() {
    const res = await fetch(`${API_URL}/api/captcha/`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    return parseOrThrow(res);
  },

  async verifyCaptcha(captchaId, userAnswer) {
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

  async getServiceTiers(serviceType) {
    const res = await fetch(`${API_URL}/api/services/tiers/${serviceType}/`, {
      headers: { 'Content-Type': 'application/json' }
    });
    return parseOrThrow(res);
  },

  async getServicePackages() {
    const res = await fetch(`${API_URL}/api/services/packages/`, {
      headers: { 'Content-Type': 'application/json' }
    });
    return parseOrThrow(res);
  },

  async getServiceSubscriptions() {
    const res = await fetch(`${API_URL}/api/services/my-subscriptions/`, {
      headers: authHeaders()
    });
    return parseOrThrow(res);
  },

  async applyPromoCode(promoCode, amount) {
    const res = await fetch(`${API_URL}/api/services/promo-code/verify/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders()
      },
      body: JSON.stringify({
        promo_code: promoCode,
        amount
      })
    });
    return parseOrThrow(res);
  },

  async createServiceCheckout(checkoutData) {
    const res = await fetch(`${API_URL}/api/services/checkout/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders()
      },
      body: JSON.stringify(checkoutData)
    });
    return parseOrThrow(res);
  },

  async getCheckoutStatus(checkoutId) {
    const res = await fetch(`${API_URL}/api/services/checkout/${checkoutId}/`, {
      headers: authHeaders()
    });
    return parseOrThrow(res);
  },

  async cancelServiceSubscription(subscriptionId) {
    const res = await fetch(`${API_URL}/api/services/subscriptions/${subscriptionId}/cancel/`, {
      method: 'POST',
      headers: authHeaders()
    });
    return parseOrThrow(res);
  },

  async upgradeServiceTier(subscriptionId, newTier, paymentOption) {
    const res = await fetch(`${API_URL}/api/services/subscriptions/${subscriptionId}/upgrade/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders()
      },
      body: JSON.stringify({
        new_tier: newTier,
        payment_option: paymentOption
      })
    });
    return parseOrThrow(res);
  },

  // ========== ACHIEVEMENT & TEAM ENDPOINTS ==========

  async getAchievements() {
    const res = await fetch(`${API_URL}/api/achievements/`, {
      headers: { 'Content-Type': 'application/json' }
    });
    return parseOrThrow(res);
  },

  async getTeamMembers() {
    const res = await fetch(`${API_URL}/api/team-members/`, {
      headers: { 'Content-Type': 'application/json' }
    });
    return parseOrThrow(res);
  },

  async getTeamMembersByGender(gender) {
    const res = await fetch(`${API_URL}/api/team-members/by-gender/${gender}/`, {
      headers: { 'Content-Type': 'application/json' }
    });
    return parseOrThrow(res);
  },

  async createAchievement(achievementData) {
    const res = await fetch(`${API_URL}/api/achievements/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders()
      },
      body: JSON.stringify(achievementData)
    });
    return parseOrThrow(res);
  },

  async updateAchievement(achievementId, updateData) {
    const res = await fetch(`${API_URL}/api/achievements/${achievementId}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders()
      },
      body: JSON.stringify(updateData)
    });
    return parseOrThrow(res);
  },

  async deleteAchievement(achievementId) {
    const res = await fetch(`${API_URL}/api/achievements/${achievementId}/`, {
      method: 'DELETE',
      headers: authHeaders()
    });
    return parseOrThrow(res);
  },

  async createTeamMember(memberData) {
    const res = await fetch(`${API_URL}/api/team-members/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders()
      },
      body: JSON.stringify(memberData)
    });
    return parseOrThrow(res);
  },

  async updateTeamMember(memberId, updateData) {
    const res = await fetch(`${API_URL}/api/team-members/${memberId}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders()
      },
      body: JSON.stringify(updateData)
    });
    return parseOrThrow(res);
  },

  async deleteTeamMember(memberId) {
    const res = await fetch(`${API_URL}/api/team-members/${memberId}/`, {
      method: 'DELETE',
      headers: authHeaders()
    });
    return parseOrThrow(res);
  },

  // ========== PAYMENT ENDPOINTS ==========

  async createPaymentIntent(courseId, amount) {
    console.log(`[API] Creating payment intent for course ${courseId}, amount: ${amount}`);
    const res = await fetch(`${API_URL}/api/payments/create-intent/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders()
      },
      body: JSON.stringify({ course_id: courseId, amount })
    });
    const data = await parseOrThrow(res);
    console.log('[API] Payment intent created:', data);
    return data;
  },

  // ✅ FIXED: Accept 3rd parameter with billing info
  async verifyPayment(paymentId, nonce, billingInfo = {}) {
    console.log(`[API] Verifying payment ${paymentId}`);
    const res = await fetch(`${API_URL}/api/payments/verify/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders()
      },
      body: JSON.stringify({
        payment_id: paymentId,
        nonce: nonce,
        billing_postal_code: billingInfo.billingPostalCode || '',
        billing_country: billingInfo.billingCountry || 'NG'
      })
    });
    const data = await parseOrThrow(res);
    console.log('[API] Payment verified:', data);
    return data;
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