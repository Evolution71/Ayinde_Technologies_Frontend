/**
 * API Client for Ayinde Technologies
 * Updated with Service endpoints for 12-page website structure
 * Fixed: verifyPayment now accepts and sends billing info
 * Fixed: All protected endpoints include authHeaders()
 * Fixed: Token key is consistent ('ayinde_token')
 * Fixed: Added console logging for debugging token flow
 *
 * Usage:
 *   import { api } from '../api'
 *   await api.getServices()
 *   await api.getServiceTiers(serviceType)
 *   await api.createServiceCheckout(serviceData)
 *   await api.applyPromoCode(code)
 */

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// ========== TOKEN MANAGEMENT ==========

const setToken = (token) => {
  if (token) {
    localStorage.setItem('ayinde_token', token);
    console.log('[API] ✅ Token saved to localStorage');
  } else {
    localStorage.removeItem('ayinde_token');
    console.log('[API] 🔄 Token cleared from localStorage');
  }
};

const getToken = () => {
  const token = localStorage.getItem('ayinde_token');
  console.log('[API] Token check:', token ? `Found (${token.substring(0, 20)}...)` : 'NOT FOUND');
  return token;
};

// ========== HELPER FUNCTIONS ==========

const authHeaders = () => {
  const token = getToken();
  if (!token) {
    console.warn('[API] ⚠️ No token found - request will be unauthenticated');
    return {};
  }
  const headers = { 'Authorization': `Bearer ${token}` };
  console.log('[API] ✅ Auth headers added');
  return headers;
};

const parseOrThrow = async (res) => {
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    console.error('[API] ❌ Request failed:', res.status, errorData);
    throw new Error(errorData.detail || `HTTP ${res.status}`);
  }
  return res.json();
};

// ========== MAIN API OBJECT ==========

export const api = {

  // ========== AUTH ENDPOINTS ==========

  async login(email, password) {
    console.log('[API] 🔐 Logging in:', email);
    const res = await fetch(`${API_URL}/api/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await parseOrThrow(res);
    setToken(data.access_token);
    console.log('[API] ✅ Login successful');
    return data;
  },

  async register(first_name, last_name, email, password) {
    console.log('[API] 📝 Registering:', email);
    const res = await fetch(`${API_URL}/api/auth/register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ first_name, last_name, email, password })
    });
    const data = await parseOrThrow(res);
    setToken(data.access_token);
    console.log('[API] ✅ Registration successful');
    return data;
  },

  async logout() {
    console.log('[API] 🔓 Logging out');
    setToken(null);
  },

  async getCurrentUser() {
    console.log('[API] 👤 Fetching current user');
    const res = await fetch(`${API_URL}/api/auth/me/`, {
      headers: authHeaders()
    });
    return parseOrThrow(res);
  },

  // ========== CAPTCHA ENDPOINTS ==========

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
    console.log('[API] 🔐 Generating captcha');
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
    console.log('[API] ✓ Verifying captcha answer');
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
    console.log('[API] 🗑️ Deleting captcha:', captchaId);
    const res = await fetch(`${API_URL}/api/captcha/${captchaId}/`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    });
    return parseOrThrow(res);
  },

  // ========== COURSE ENDPOINTS ==========

  async getCourses() {
    console.log('[API] 📚 Fetching all courses');
    const res = await fetch(`${API_URL}/api/courses/`, {
      headers: { 'Content-Type': 'application/json' }
    });
    return parseOrThrow(res);
  },

  async getCourseDetail(courseId) {
    console.log('[API] 📖 Fetching course detail:', courseId);
    const res = await fetch(`${API_URL}/api/courses/${courseId}/`, {
      headers: { ...authHeaders(), 'Content-Type': 'application/json' }
    });
    return parseOrThrow(res);
  },

  async getMyEnrollments() {
    console.log('[API] 🎓 Fetching my enrollments');
    const res = await fetch(`${API_URL}/api/courses/me/enrollments/`, {
      headers: authHeaders()
    });
    return parseOrThrow(res);
  },

  async enrollInCourse(courseId) {
    console.log('[API] ✏️ Enrolling in course:', courseId);
    const res = await fetch(`${API_URL}/api/courses/${courseId}/enroll/`, {
      method: 'POST',
      headers: { ...authHeaders(), 'Content-Type': 'application/json' }
    });
    return parseOrThrow(res);
  },

  async getEnrollmentStatus(courseId) {
    console.log('[API] 🔍 Checking enrollment status:', courseId);
    const res = await fetch(`${API_URL}/api/courses/${courseId}/enrollment-status/`, {
      headers: authHeaders()
    });
    return parseOrThrow(res);
  },

  async savePaymentMethod(courseId, nonce) {
    console.log('[API] 💳 Saving payment method for course:', courseId);
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
    console.log('[API] ❌ Canceling subscription for course:', courseId);
    const res = await fetch(`${API_URL}/api/courses/${courseId}/cancel/`, {
      method: 'POST',
      headers: authHeaders()
    });
    return parseOrThrow(res);
  },

  async getCourseProgress(courseId) {
    console.log('[API] 📊 Getting course progress:', courseId);
    const res = await fetch(`${API_URL}/api/courses/${courseId}/progress/`, {
      headers: authHeaders()
    });
    return parseOrThrow(res);
  },

  // ========== LESSON ENDPOINTS ==========

  async getLesson(courseId, lessonId) {
    console.log('[API] 📄 Getting lesson:', lessonId);
    const res = await fetch(`${API_URL}/api/courses/${courseId}/lessons/${lessonId}/`, {
      headers: authHeaders()
    });
    return parseOrThrow(res);
  },

  async completeLesson(courseId, lessonId) {
    console.log('[API] ✅ Marking lesson complete:', lessonId);
    const res = await fetch(`${API_URL}/api/courses/${courseId}/lessons/${lessonId}/complete/`, {
      method: 'POST',
      headers: authHeaders()
    });
    return parseOrThrow(res);
  },

  // ========== SERVICE ENDPOINTS ==========

  async getServices() {
    console.log('[API] 🔧 Fetching services');
    const res = await fetch(`${API_URL}/api/services/`, {
      headers: { 'Content-Type': 'application/json' }
    });
    return parseOrThrow(res);
  },

  async getServiceTiers(serviceType) {
    console.log('[API] 💎 Fetching service tiers:', serviceType);
    const res = await fetch(`${API_URL}/api/services/tiers/${serviceType}/`, {
      headers: { 'Content-Type': 'application/json' }
    });
    return parseOrThrow(res);
  },

  async getServicePackages() {
    console.log('[API] 📦 Fetching service packages');
    const res = await fetch(`${API_URL}/api/services/packages/`, {
      headers: { 'Content-Type': 'application/json' }
    });
    return parseOrThrow(res);
  },

  async getServiceSubscriptions() {
    console.log('[API] 📋 Fetching my service subscriptions');
    const res = await fetch(`${API_URL}/api/services/my-subscriptions/`, {
      headers: authHeaders()
    });
    return parseOrThrow(res);
  },

  async applyPromoCode(promoCode, amount) {
    console.log('[API] 🎁 Applying promo code:', promoCode);
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
    console.log('[API] 🛒 Creating service checkout');
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
    console.log('[API] 🔄 Checking checkout status:', checkoutId);
    const res = await fetch(`${API_URL}/api/services/checkout/${checkoutId}/`, {
      headers: authHeaders()
    });
    return parseOrThrow(res);
  },

  async cancelServiceSubscription(subscriptionId) {
    console.log('[API] ❌ Canceling service subscription:', subscriptionId);
    const res = await fetch(`${API_URL}/api/services/subscriptions/${subscriptionId}/cancel/`, {
      method: 'POST',
      headers: authHeaders()
    });
    return parseOrThrow(res);
  },

  async upgradeServiceTier(subscriptionId, newTier, paymentOption) {
    console.log('[API] 📈 Upgrading service tier');
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

  async saveServicePaymentMethod(paymentMethodNonce) {
    console.log('[API] 💳 Saving service payment method');
    const res = await fetch(`${API_URL}/api/services/payment-method/save/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders()
      },
      body: JSON.stringify({
        payment_method_nonce: paymentMethodNonce
      })
    });
    return parseOrThrow(res);
  },

  async createServicePurchase(purchaseData) {
    console.log('[API] 🎯 Creating service purchase');
    const res = await fetch(`${API_URL}/api/services/purchase/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders()
      },
      body: JSON.stringify(purchaseData)
    });
    return parseOrThrow(res);
  },

  // ========== ACHIEVEMENT & TEAM ENDPOINTS ==========

  async getAchievements() {
    console.log('[API] 🏆 Fetching achievements');
    const res = await fetch(`${API_URL}/api/achievements/`, {
      headers: { 'Content-Type': 'application/json' }
    });
    return parseOrThrow(res);
  },

  async getTeamMembers() {
    console.log('[API] 👥 Fetching team members');
    const res = await fetch(`${API_URL}/api/team/`, {
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await parseOrThrow(res);
    console.log('[API] ✅ Team members received:', Array.isArray(data) ? data.length : '?', 'members');
    return data;
  },

  async getTeamMembersByGender(gender) {
    console.log('[API] 👥 Fetching team members by gender:', gender);
    const res = await fetch(`${API_URL}/api/team-members/by-gender/${gender}/`, {
      headers: { 'Content-Type': 'application/json' }
    });
    return parseOrThrow(res);
  },

  async getQuotes() {
    console.log('[API] 💬 Fetching quotes');
    const res = await fetch(`${API_URL}/api/quotes/`, {
      headers: { 'Content-Type': 'application/json' }
    });
    return parseOrThrow(res);
  },

  async getQuotesByCategory(category) {
    console.log('[API] 💬 Fetching quotes by category:', category);
    const res = await fetch(`${API_URL}/api/quotes/?category=${category}`, {
      headers: { 'Content-Type': 'application/json' }
    });
    return parseOrThrow(res);
  },

  async createAchievement(achievementData) {
    console.log('[API] 🏆 Creating achievement');
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
    console.log('[API] ✏️ Updating achievement:', achievementId);
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
    console.log('[API] 🗑️ Deleting achievement:', achievementId);
    const res = await fetch(`${API_URL}/api/achievements/${achievementId}/`, {
      method: 'DELETE',
      headers: authHeaders()
    });
    return parseOrThrow(res);
  },

  async createTeamMember(memberData) {
    console.log('[API] 👤 Creating team member');
    const res = await fetch(`${API_URL}/api/team/`, {
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
    console.log('[API] ✏️ Updating team member:', memberId);
    const res = await fetch(`${API_URL}/api/team/${memberId}/`, {
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
    console.log('[API] 🗑️ Deleting team member:', memberId);
    const res = await fetch(`${API_URL}/api/team/${memberId}/`, {
      method: 'DELETE',
      headers: authHeaders()
    });
    return parseOrThrow(res);
  },

  // ========== PAYMENT ENDPOINTS ==========

  async createPaymentIntent(courseId, amount) {
    console.log('[API] 💰 Creating payment intent - Course:', courseId, 'Amount:', amount);
    const res = await fetch(`${API_URL}/api/payments/create-intent/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders()  // ✅ CRITICAL: Auth header included
      },
      body: JSON.stringify({ course_id: courseId, amount })
    });
    const data = await parseOrThrow(res);
    console.log('[API] ✅ Payment intent created:', data);
    return data;
  },

  // ✅ FIXED: Now accepts and sends billing information
  async verifyPayment(paymentId, nonce, billingInfo = {}) {
    console.log('[API] 🔐 Verifying payment - PaymentId:', paymentId);
    const requestBody = {
      payment_id: paymentId,
      nonce,
      billing_postal_code: billingInfo.billingPostalCode || '',
      billing_country: billingInfo.billingCountry || ''
    };
    console.log('[API] Request body:', requestBody);

    const res = await fetch(`${API_URL}/api/payments/verify/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders()  // ✅ CRITICAL: Auth header included
      },
      body: JSON.stringify(requestBody)
    });
    const data = await parseOrThrow(res);
    console.log('[API] ✅ Payment verified:', data);
    return data;
  },

  async getPaymentStatus(paymentId) {
    console.log('[API] 📊 Getting payment status:', paymentId);
    const res = await fetch(`${API_URL}/api/payments/${paymentId}/`, {
      headers: authHeaders()
    });
    return parseOrThrow(res);
  },

  // ========== CONTACT ENDPOINTS ==========

  async submitContactForm(formData) {
    console.log('[API] 📧 Submitting contact form');
    const res = await fetch(`${API_URL}/api/contact/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    return parseOrThrow(res);
  },

  // ========== TEAM ENDPOINTS ==========

  async getTeam() {
    console.log('[API] 👥 Fetching team (alias for getTeamMembers)');
    return this.getTeamMembers();
  },

  async getTeamMember(memberId) {
    console.log('[API] 👤 Getting team member:', memberId);
    const res = await fetch(`${API_URL}/api/team/${memberId}/`, {
      headers: { 'Content-Type': 'application/json' }
    });
    return parseOrThrow(res);
  },

  // ========== PROJECTS ENDPOINTS ==========

  async getProjects() {
    console.log('[API] 📁 Fetching projects');
    const res = await fetch(`${API_URL}/api/projects/`, {
      headers: authHeaders()
    });
    return parseOrThrow(res);
  },

  async getProject(projectId) {
    console.log('[API] 📄 Getting project:', projectId);
    const res = await fetch(`${API_URL}/api/projects/${projectId}/`, {
      headers: authHeaders()
    });
    return parseOrThrow(res);
  }
};

export const logout = () => api.logout();