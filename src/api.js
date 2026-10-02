/**
 * API Client for Ayinde Technologies
 * Updated with Service endpoints for 12-page website structure
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

  // ========== SERVICE ENDPOINTS (NEW - 12-Page Website Services) ==========

  /**
   * Get all services overview (for home page display)
   * Returns all available services with basic info
   * @returns {array} List of all services with tiers and basic details
   */
  async getServices() {
    const res = await fetch(`${API_URL}/api/services/`, {
      headers: { 'Content-Type': 'application/json' }
    });
    return parseOrThrow(res);
  },

  /**
   * Get all service tiers for a specific service type
   * @param {string} serviceType - 'website' | 'applications' | 'consultation' | 'premium'
   * @returns {object} Service tiers with pricing and features
   */
  async getServiceTiers(serviceType) {
    const res = await fetch(`${API_URL}/api/services/tiers/${serviceType}/`, {
      headers: { 'Content-Type': 'application/json' }
    });
    return parseOrThrow(res);
  },

  /**
   * Get all available service packages
   * @returns {array} List of all service packages across all service types
   */
  async getServicePackages() {
    const res = await fetch(`${API_URL}/api/services/packages/`, {
      headers: { 'Content-Type': 'application/json' }
    });
    return parseOrThrow(res);
  },

  /**
   * Get user's current service subscriptions
   * @returns {array} User's active service subscriptions
   */
  async getServiceSubscriptions() {
    const res = await fetch(`${API_URL}/api/services/my-subscriptions/`, {
      headers: authHeaders()
    });
    return parseOrThrow(res);
  },

  /**
   * Verify and apply promotional code
   * @param {string} promoCode - Promotional code to apply
   * @param {number} amount - Original amount before discount
   * @returns {object} { valid: bool, discount_percentage: number, discount_amount: number, final_amount: number, message: string }
   */
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

  /**
   * Create service checkout (initiate purchase)
   * IMPORTANT: This is the CORRECT method to use for service payments
   *
   * @param {object} checkoutData - {
   *   service_type: 'website' | 'applications' | 'consultation' | 'premium',
   *   tier: 'starter' | 'professional' | 'advanced' | 'premium',
   *   payment_option: 'monthly' | 'quarterly' | 'annual' | 'fifty_percent_down',
   *   hours: number (for consultation only),
   *   promo_code: string (optional),
   *   amount: number,
   *   payment_method_nonce: string (from Square tokenization),
   *   billing_email: string,
   *   billing_name: string,
   *   billing_phone: string,
   *   billing_company: string,
   *   billing_postal_code: string,
   *   billing_country: string
   * }
   * @returns {object} Checkout response with session ID and confirmation details
   */
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

  /**
   * Get checkout status
   * @param {string} checkoutId - ID from createServiceCheckout response
   * @returns {object} Checkout status and details
   */
  async getCheckoutStatus(checkoutId) {
    const res = await fetch(`${API_URL}/api/services/checkout/${checkoutId}/`, {
      headers: authHeaders()
    });
    return parseOrThrow(res);
  },

  /**
   * Cancel a service subscription
   * @param {string} subscriptionId - Service subscription ID
   * @returns {object} Cancellation confirmation
   */
  async cancelServiceSubscription(subscriptionId) {
    const res = await fetch(`${API_URL}/api/services/subscriptions/${subscriptionId}/cancel/`, {
      method: 'POST',
      headers: authHeaders()
    });
    return parseOrThrow(res);
  },

  /**
   * Upgrade or downgrade service tier
   * @param {string} subscriptionId - Current subscription ID
   * @param {string} newTier - 'starter' | 'professional' | 'advanced' | 'premium'
   * @param {string} paymentOption - 'monthly' | 'quarterly' | 'annual' | 'fifty_percent_down'
   * @returns {object} Updated subscription details
   */
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

  /**
   * Save payment method for service (alternative to full checkout)
   * @param {string} paymentMethodNonce - From Square tokenization
   * @returns {object} Saved payment method details
   */
  async saveServicePaymentMethod(paymentMethodNonce) {
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

  /**
   * Create a service order/purchase with Square payment token
   * @param {object} purchaseData - { tier, tierName, amount, currency, paymentOption, discountPercent, period, fullName, email, phone, company, postalCode, country, sourceId }
   * @returns {object} Service order confirmation with order_id
   */
  async createServicePurchase(purchaseData) {
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

  /**
   * Get all active achievements
   * @returns {array} List of achievements (title, description, category, icon)
   */
  async getAchievements() {
    const res = await fetch(`${API_URL}/api/achievements/`, {
      headers: { 'Content-Type': 'application/json' }
    });
    return parseOrThrow(res);
  },

  /**
   * Get all active team members
   * @returns {object} Team members grouped by gender and full list
   */
  async getTeamMembers() {
    const res = await fetch(`${API_URL}/api/team/`, {
      headers: { 'Content-Type': 'application/json' }
    });
    return parseOrThrow(res);
  },

  /**
   * Get team members filtered by gender
   * @param {string} gender - 'male' | 'female' | 'other'
   * @returns {array} Filtered team members
   */
  async getTeamMembersByGender(gender) {
    const res = await fetch(`${API_URL}/api/team-members/by-gender/${gender}/`, {
      headers: { 'Content-Type': 'application/json' }
    });
    return parseOrThrow(res);
  },

  /**
   * Get all active quotes
   * @returns {object} { success: bool, quotes: array }
   */
  async getQuotes() {
    const res = await fetch(`${API_URL}/api/quotes/`, {
      headers: { 'Content-Type': 'application/json' }
    });
    return parseOrThrow(res);
  },

  /**
   * Get quotes by category
   * @param {string} category - Quote category
   * @returns {object} { success: bool, quotes: array }
   */
  async getQuotesByCategory(category) {
    const res = await fetch(`${API_URL}/api/quotes/?category=${category}`, {
      headers: { 'Content-Type': 'application/json' }
    });
    return parseOrThrow(res);
  },

  /**
   * Create achievement (admin only)
   * @param {object} achievementData - { title, description, category, icon, order }
   * @returns {object} Created achievement details
   */
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

  /**
   * Update achievement (admin only)
   * @param {number} achievementId - Achievement ID
   * @param {object} updateData - Fields to update
   * @returns {object} Updated achievement details
   */
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

  /**
   * Delete achievement (admin only)
   * @param {number} achievementId - Achievement ID
   * @returns {object} Deletion confirmation
   */
  async deleteAchievement(achievementId) {
    const res = await fetch(`${API_URL}/api/achievements/${achievementId}/`, {
      method: 'DELETE',
      headers: authHeaders()
    });
    return parseOrThrow(res);
  },

  /**
   * Create team member (admin only)
   * @param {object} memberData - { name, title, quote, achievement, image, gender, category, order }
   * @returns {object} Created member details
   */
  async createTeamMember(memberData) {
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

  /**
   * Update team member (admin only)
   * @param {number} memberId - Team member ID
   * @param {object} updateData - Fields to update
   * @returns {object} Updated member details
   */
  async updateTeamMember(memberId, updateData) {
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

  /**
   * Delete team member (admin only)
   * @param {number} memberId - Team member ID
   * @returns {object} Deletion confirmation
   */
  async deleteTeamMember(memberId) {
    const res = await fetch(`${API_URL}/api/team/${memberId}/`, {
      method: 'DELETE',
      headers: authHeaders()
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