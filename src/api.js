// Backend API URL — set REACT_APP_API_URL in a .env file for production;
// falls back to localhost for local development.
export const API_URL = process.env.REACT_APP_API_URL || 'https://ayindetechnologiesbackend-production.up.railway.app';

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
    const res = await fetch(`${API_URL}/api/courses/`, { headers: authHeaders() });
    return parseOrThrow(res);
  },

  async enrollInCourse(courseId) {
    const res = await fetch(`${API_URL}/api/courses/${courseId}/enroll/`, {
      method: 'POST',
      headers: authHeaders(),
    });
    return parseOrThrow(res);
  },

  // SQUARE PAYMENT - NEW FLOW
  // Step 1: Create payment intent (get client token)
  async createPaymentIntent(courseId) {
    const res = await fetch(`${API_URL}/api/payments/create-intent/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify({ course_id: courseId }),
    });
    return parseOrThrow(res);
  },

  // Step 2: Verify payment after Square SDK completes payment
  async verifyPayment(paymentId, squarePaymentId, squareReceiptUrl) {
    const res = await fetch(`${API_URL}/api/payments/verify/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify({
        payment_id: paymentId,
        square_payment_id: squarePaymentId,
        square_receipt_url: squareReceiptUrl,
      }),
    });
    return parseOrThrow(res);
  },

  // Get payment status
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
};
