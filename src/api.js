// Backend API URL — HTTPS enforced, with fallback
// Ensures the URL always starts with https://
function getApiUrl() {
  const envUrl = process.env.REACT_APP_API_URL;
  
  // If env var exists, use it
  if (envUrl) {
    // Ensure it has https:// protocol
    if (envUrl.startsWith('http://') || envUrl.startsWith('https://')) {
      // Already has protocol, return as-is
      return envUrl;
    } else {
      // No protocol, add https://
      return `https://${envUrl}`;
    }
  }
  
  // Fallback for development
  return 'https://ayindetechnologiesbackend-production.up.railway.app';
}

export const API_URL = getApiUrl();

const TOKEN_KEY = 'ayinde_token';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function parseOrThrow(res) {
  if (res.ok) return res.json();
  let detail = 'Something went wrong.';
  try {
    const body = await res.json();
    detail = body.detail || detail;
  } catch (_) {
    // ignore — use default message
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
    return parseOrThrow(res);
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
    const res = await fetch(`${API_URL}/api/courses/`);
    return parseOrThrow(res);
  },

  async enrollInCourse(courseId) {
    const res = await fetch(`${API_URL}/api/courses/${courseId}/enroll/`, {
      method: 'POST',
      headers: authHeaders(),
    });
    return parseOrThrow(res);
  },

  // FIXED: Now sends amount and currency along with course_id
  async initiatePayment(courseId, amount, currency = 'USD') {
    const res = await fetch(`${API_URL}/api/payments/create-intent/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify({ 
        course_id: courseId,
        amount: amount,
        currency: currency
      }),
    });
    return parseOrThrow(res);
  },

  // FIXED: Now sends payment_id and nonce instead of transaction_id
  async verifyPayment(paymentId, nonce) {
    const res = await fetch(`${API_URL}/api/payments/verify/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify({ 
        payment_id: paymentId,
        nonce: nonce
      }),
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
};