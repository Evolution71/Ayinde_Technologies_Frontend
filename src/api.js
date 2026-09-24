// Backend API URL — HTTPS enforced, with fallback
function getApiUrl() {
  const envUrl = process.env.REACT_APP_API_URL;
  
  if (envUrl) {
    if (envUrl.startsWith('http://') || envUrl.startsWith('https://')) {
      return envUrl;
    } else {
      return `https://${envUrl}`;
    }
  }
  
  return 'https://ayindetechnologiesbackend-production.up.railway.app';
}

export const API_URL = getApiUrl();

const TOKEN_KEY = 'ayinde_token';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
  console.log('✅ Token saved to localStorage');
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
  console.log('✅ Token cleared');
}

function authHeaders() {
  const token = getToken();
  if (token) {
    return { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }
  return { 'Content-Type': 'application/json' };
}

async function parseOrThrow(res) {
  if (res.ok) return res.json();
  let detail = 'Something went wrong.';
  try {
    const body = await res.json();
    detail = body.detail || detail;
  } catch (_) {
    // ignore
  }
  throw new Error(detail);
}

export const api = {
  async register(name, email, password, captchaToken, captchaAnswer) {
    const res = await fetch(`${API_URL}/api/auth/register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name, email, password,
        captcha_token: captchaToken,
        captcha_answer: captchaAnswer,
      }),
    });
    return parseOrThrow(res);
  },

  async login(email, password, captchaToken, captchaAnswer) {
    const res = await fetch(`${API_URL}/api/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email, password,
        captcha_token: captchaToken,
        captcha_answer: captchaAnswer,
      }),
    });
    const data = await parseOrThrow(res);
    // SAVE TOKEN AFTER LOGIN
    if (data.access_token) {
      setToken(data.access_token);
    }
    return data;
  },

  async me() {
    const res = await fetch(`${API_URL}/api/auth/me/`, { headers: authHeaders() });
    return parseOrThrow(res);
  },

  async getServices() {
    const res = await fetch(`${API_URL}/api/services/`);
    return parseOrThrow(res);
  },

  async getTeam() {
    const res = await fetch(`${API_URL}/api/team/`);
    return parseOrThrow(res);
  },

  async getProjects() {
    const res = await fetch(`${API_URL}/api/projects/`, { headers: authHeaders() });
    return parseOrThrow(res);
  },

  async getCourses() {
    const res = await fetch(`${API_URL}/api/courses/`, { headers: authHeaders() });
    return parseOrThrow(res);
  },

  async getMyEnrollments() {
    const res = await fetch(`${API_URL}/api/courses/me/enrollments/`, { headers: authHeaders() });
    return parseOrThrow(res);
  },

  async getCourseDetail(courseId) {
    const res = await fetch(`${API_URL}/api/courses/${courseId}/`, { headers: authHeaders() });
    return parseOrThrow(res);
  },

  async getCourseProgress(courseId) {
    const res = await fetch(`${API_URL}/api/courses/${courseId}/progress/`, { headers: authHeaders() });
    return parseOrThrow(res);
  },

  async completeLesson(courseId, lessonId) {
    const res = await fetch(`${API_URL}/api/courses/${courseId}/lessons/${lessonId}/complete/`, {
      method: 'POST',
      headers: authHeaders()
    });
    return parseOrThrow(res);
  },

  async enrollInCourse(courseId) {
    const res = await fetch(`${API_URL}/api/courses/${courseId}/enroll/`, {
      method: 'POST',
      headers: authHeaders(),
    });
    return parseOrThrow(res);
  },

  async createPaymentIntent(courseId) {
    const res = await fetch(`${API_URL}/api/payments/create-intent/`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ course_id: courseId }),
    });
    return parseOrThrow(res);
  },

  async initiatePayment(courseId, amount, currency = 'USD') {
    const res = await fetch(`${API_URL}/api/payments/create-intent/`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ 
        course_id: courseId,
        amount: amount,
        currency: currency 
      }),
    });
    return parseOrThrow(res);
  },

  async verifyPayment(paymentId, token, billingData = {}) {
    const res = await fetch(`${API_URL}/api/payments/verify/`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({
        payment_id: paymentId,
        nonce: token,
        billing_postal_code: billingData.billingPostalCode || '',
        billing_country: billingData.billingCountry || ''
      })
    });
    return parseOrThrow(res);
  },

  async getPaymentStatus(paymentId) {
    const res = await fetch(`${API_URL}/api/payments/${paymentId}/`, {
      headers: authHeaders(),
    });
    return parseOrThrow(res);
  },

  async getCaptcha() {
    const res = await fetch(`${API_URL}/api/captcha/`);
    return parseOrThrow(res);
  },

  async submitContact(payload) {
    const res = await fetch(`${API_URL}/api/contact/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return parseOrThrow(res);
  },

  async savePaymentMethod(courseId, nonce) {
    const res = await fetch(`${API_URL}/api/courses/${courseId}/save-card/`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ nonce }),
    });
    return parseOrThrow(res);
  },

  async getEnrollmentStatus(courseId) {
    const res = await fetch(`${API_URL}/api/courses/${courseId}/enrollment-status/`, {
      headers: authHeaders(),
    });
    return parseOrThrow(res);
  },
};