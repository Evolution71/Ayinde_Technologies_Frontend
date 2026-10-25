/**
 * API Client for Ayinde Technologies Corporation
 * Updated with new Service endpoints for 12-page website structure
 *
 * Usage:
 *   import { api } from '../api'
 *   await api.getServiceTiers(serviceType)
 *   await api.createServiceCheckout(serviceData)
 *   await api.applyPromoCode(code)
 */

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// ========== TOKEN MANAGEMENT ==========

// Must match the key AuthContext uses ('ayinde_token').
const TOKEN_KEY = 'ayinde_token';

const setToken = (token) => {
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  } catch (e) { /* storage blocked */ }
};

const getToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (e) {
    return null;
  }
};

// ========== HELPER FUNCTIONS ==========

const authHeaders = () => {
  const token = getToken();
  if (!token) return {};
  return { 'Authorization': `Bearer ${token}` };
};

// Fired when the backend rejects our token (expired or invalid).
// AuthContext listens for this and logs the user out of the UI too.
export const AUTH_EXPIRED_EVENT = 'ayinde:auth-expired';

const parseOrThrow = async (res) => {
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    if (res.status === 401 && getToken()) {
      setToken(null);
      try { localStorage.removeItem('user'); } catch (e) { /* storage blocked */ }
      try { window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT)); } catch (e) { /* no window */ }
    }
    const err = new Error(
      res.status === 401
        ? 'Your session has expired. Please log in again.'
        : (errorData.detail || `HTTP ${res.status}`)
    );
    err.status = res.status;
    throw err;
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

  async getYoutubeCourses() {
    const res = await fetch(`${API_URL}/api/courses/youtube/`, {
      headers: { 'Content-Type': 'application/json' }
    });
    return parseOrThrow(res);
  },

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

  // Step 1 of saving a card: get a Stripe SetupIntent client_secret for this course.
  async createSetupIntent(courseId) {
    const res = await fetch(`${API_URL}/api/courses/${courseId}/setup-intent/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders()
      }
    });
    return parseOrThrow(res);
  },

  // Step 2: after Stripe confirms the SetupIntent, save its card for the course.
  async savePaymentMethod(courseId, setupIntentId) {
    const res = await fetch(`${API_URL}/api/courses/${courseId}/save-payment-method/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders()
      },
      body: JSON.stringify({ setup_intent_id: setupIntentId })
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
   * @param {object} checkoutData - {
   *   service_type: 'website' | 'applications' | 'consultation' | 'premium',
   *   tier: 'starter' | 'professional' | 'advanced' | 'premium',
   *   payment_option: 'monthly' | 'quarterly' | 'annual' | 'fifty_percent_down',
   *   hours: number (for consultation only),
   *   promo_code: string (optional),
   *   amount: number,
   *   payment_method_nonce: string (Stripe PaymentMethod id, pm_...)
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
   * Create service purchase order (direct service order endpoint)
   * @param {object} orderData - {
   *   tier, tierName, amount, currency, paymentOption, discountPercent, period,
   *   fullName, email, phone, company, postalCode, country,
   *   sourceId (Stripe PaymentMethod id, pm_...)
   * }
   * @returns {object} { success, order_id, message, order }
   */
  async createServicePurchase(orderData) {
    // Stop waiting after 60 seconds so the customer is never left on a spinner forever
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 60000);
    try {
      const res = await fetch(`${API_URL}/api/services/purchase/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders()
        },
        body: JSON.stringify(orderData),
        signal: controller.signal,
      });
      return await parseOrThrow(res);
    } catch (err) {
      if (err.name === 'AbortError') {
        throw new Error(
          'The payment is taking longer than expected. Please check your dashboard before trying again, so you are not charged twice.'
        );
      }
      throw err;
    } finally {
      clearTimeout(timer);
    }
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
    const res = await fetch(`${API_URL}/api/team-members/`, {
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
   * Get all team members with interspersed genders (alternating male/female)
   * Useful for displaying team members with foreign names interspersed throughout
   * @returns {array} Team members alternating between genders
   */
  async getInterspersedTeamMembers() {
    try {
      const maleResponse = await this.getTeamMembersByGender('male');
      const femaleResponse = await this.getTeamMembersByGender('female');

      // Extract arrays from various possible response formats
      let maleData = [];
      if (Array.isArray(maleResponse)) {
        maleData = maleResponse;
      } else if (maleResponse?.team_members && Array.isArray(maleResponse.team_members)) {
        maleData = maleResponse.team_members;
      } else if (maleResponse?.members && Array.isArray(maleResponse.members)) {
        maleData = maleResponse.members;
      } else if (maleResponse?.data && Array.isArray(maleResponse.data)) {
        maleData = maleResponse.data;
      } else if (maleResponse?.results && Array.isArray(maleResponse.results)) {
        maleData = maleResponse.results;
      }

      let femaleData = [];
      if (Array.isArray(femaleResponse)) {
        femaleData = femaleResponse;
      } else if (femaleResponse?.team_members && Array.isArray(femaleResponse.team_members)) {
        femaleData = femaleResponse.team_members;
      } else if (femaleResponse?.members && Array.isArray(femaleResponse.members)) {
        femaleData = femaleResponse.members;
      } else if (femaleResponse?.data && Array.isArray(femaleResponse.data)) {
        femaleData = femaleResponse.data;
      } else if (femaleResponse?.results && Array.isArray(femaleResponse.results)) {
        femaleData = femaleResponse.results;
      }

      // Intersperse arrays: alternate between male and female
      const interspersed = [];
      const maxLength = Math.max(maleData.length, femaleData.length);

      for (let i = 0; i < maxLength; i++) {
        if (i < maleData.length) {
          interspersed.push({
            ...maleData[i],
            _gender: 'male'
          });
        }
        if (i < femaleData.length) {
          interspersed.push({
            ...femaleData[i],
            _gender: 'female'
          });
        }
      }

      return interspersed;
    } catch (err) {
      console.error('[API] Error interspersing team members:', err);
      throw err;
    }
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

  /**
   * Update team member (admin only)
   * @param {number} memberId - Team member ID
   * @param {object} updateData - Fields to update
   * @returns {object} Updated member details
   */
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

  /**
   * Delete team member (admin only)
   * @param {number} memberId - Team member ID
   * @returns {object} Deletion confirmation
   */
  async deleteTeamMember(memberId) {
    const res = await fetch(`${API_URL}/api/team-members/${memberId}/`, {
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

  // Wrapper method for payment initialization (Stripe)
  async initiatePayment(courseId, amount, currency = 'USD') {
    try {
      const response = await this.createPaymentIntent(courseId, amount);

      // Handle different response formats from backend
      let paymentData = {
        client_token: null,
        payment_id: null,
        amount: amount,
        currency: currency,
        course_id: courseId
      };

      if (response.client_token) {
        paymentData.client_token = response.client_token;
      }
      if (response.payment_id) {
        paymentData.payment_id = response.payment_id;
      } else if (response.id) {
        paymentData.payment_id = response.id;
      }

      return paymentData;
    } catch (err) {
      console.error('[API] Payment initiation error:', err);
      throw err;
    }
  },

  async verifyPayment(paymentId, paymentMethodId) {
    const res = await fetch(`${API_URL}/api/payments/verify/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders()
      },
      body: JSON.stringify({ payment_id: paymentId, payment_method_id: paymentMethodId })
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

  // ========== BOOKINGS (publicS) ==========

  async getAvailability(isoDate) {
    const res = await fetch(`${API_URL}/api/bookings/availability?date=${encodeURIComponent(isoDate)}`);
    return parseOrThrow(res);
  },

  async createBooking(bookingData) {
    const res = await fetch(`${API_URL}/api/bookings/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData)
    });
    return parseOrThrow(res);
  },

  // ========== FORMS (public) ==========

  async getPublicForm(slug) {
    const res = await fetch(`${API_URL}/api/forms/${encodeURIComponent(slug)}`);
    return parseOrThrow(res);
  },

  async submitPublicForm(slug, submission) {
    const res = await fetch(`${API_URL}/api/forms/${encodeURIComponent(slug)}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(submission)
    });
    return parseOrThrow(res);
  },

  // ========== CRM & ADMIN (logged in, admin emails only) ==========

  async listContacts(params = {}) {
    const qs = new URLSearchParams(Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '')).toString();
    const res = await fetch(`${API_URL}/api/crm/contacts/${qs ? `?${qs}` : ''}`, { headers: authHeaders() });
    return parseOrThrow(res);
  },

  async createContact(contactData) {
    const res = await fetch(`${API_URL}/api/crm/contacts/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify(contactData)
    });
    return parseOrThrow(res);
  },

  async updateContact(contactId, updates) {
    const res = await fetch(`${API_URL}/api/crm/contacts/${contactId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify(updates)
    });
    return parseOrThrow(res);
  },

  async deleteContact(contactId) {
    const res = await fetch(`${API_URL}/api/crm/contacts/${contactId}`, {
      method: 'DELETE',
      headers: authHeaders()
    });
    return parseOrThrow(res);
  },

  async moveContactStage(contactId, stage) {
    const res = await fetch(`${API_URL}/api/crm/contacts/${contactId}/stage`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify({ stage })
    });
    return parseOrThrow(res);
  },

  async getPipeline() {
    const res = await fetch(`${API_URL}/api/crm/pipeline`, { headers: authHeaders() });
    return parseOrThrow(res);
  },

  async listBookings(status) {
    const qs = status ? `?status=${encodeURIComponent(status)}` : '';
    const res = await fetch(`${API_URL}/api/bookings/admin/${qs}`, { headers: authHeaders() });
    return parseOrThrow(res);
  },

  async updateBookingStatus(bookingId, status) {
    const res = await fetch(`${API_URL}/api/bookings/admin/${bookingId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify({ status })
    });
    return parseOrThrow(res);
  },

  async listForms() {
    const res = await fetch(`${API_URL}/api/forms/admin/`, { headers: authHeaders() });
    return parseOrThrow(res);
  },

  async createForm(formData) {
    const res = await fetch(`${API_URL}/api/forms/admin/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify(formData)
    });
    return parseOrThrow(res);
  },

  async updateForm(formId, updates) {
    const res = await fetch(`${API_URL}/api/forms/admin/${formId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify(updates)
    });
    return parseOrThrow(res);
  },

  async deleteForm(formId) {
    const res = await fetch(`${API_URL}/api/forms/admin/${formId}`, {
      method: 'DELETE',
      headers: authHeaders()
    });
    return parseOrThrow(res);
  },

  async getFormSubmissions(formId) {
    const res = await fetch(`${API_URL}/api/forms/admin/${formId}/submissions`, { headers: authHeaders() });
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