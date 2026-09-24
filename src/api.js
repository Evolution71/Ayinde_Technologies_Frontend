// API client using fetch (no axios needed)

const API_URL = process.env.REACT_APP_API_URL || 'https://ayindetechnologiesbackend-production.up.railway.app';

const getToken = () => localStorage.getItem('token');

const fetchAPI = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || error.message || `HTTP ${response.status}`);
  }

  return response.json();
};

// Auth
export const login = (email, password) =>
  fetchAPI('/api/auth/login/', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

export const register = (email, password) =>
  fetchAPI('/api/auth/register/', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

export const logout = () => {
  localStorage.removeItem('token');
  return Promise.resolve();
};

// Courses
export const getCourses = () =>
  fetchAPI('/api/courses/').then(r => r.data || r);

export const getCourseDetail = (courseId) =>
  fetchAPI(`/api/courses/${courseId}/`).then(r => r.data || r);

export const getMyEnrollments = () =>
  fetchAPI('/api/courses/me/enrollments/').then(r => r.data || r);

export const getCourseProgress = (courseId) =>
  fetchAPI(`/api/courses/${courseId}/progress/`).then(r => r.data || r);

// Lessons
export const completeLesson = (courseId, lessonId) =>
  fetchAPI(`/api/courses/${courseId}/lessons/${lessonId}/complete/`, {
    method: 'POST',
  }).then(r => r.data || r);

// Payments - ONE-TIME
export const initiatePayment = (courseId, amount, currency = 'USD') =>
  fetchAPI('/api/payments/create-intent/', {
    method: 'POST',
    body: JSON.stringify({ course_id: courseId, amount, currency }),
  }).then(r => r.data || r);

export const verifyPayment = (paymentId, nonce, billingData = {}) =>
  fetchAPI('/api/payments/verify/', {
    method: 'POST',
    body: JSON.stringify({
      payment_id: paymentId,
      nonce,
      billing_postal_code: billingData.billingPostalCode,
      billing_country: billingData.billingCountry,
    }),
  }).then(r => r.data || r);

// ✅ NEW: Save card for auto-charge subscription
export const savePaymentMethod = (courseId, nonce) =>
  fetchAPI(`/api/courses/${courseId}/save-card/`, {
    method: 'POST',
    body: JSON.stringify({ nonce }),
  }).then(r => r.data || r);

// ✅ NEW: Get enrollment status (trial, active, payment_failed)
export const getEnrollmentStatus = (courseId) =>
  fetchAPI(`/api/courses/${courseId}/enrollment-status/`).then(r => r.data || r);

// Projects
export const getProjects = () =>
  fetchAPI('/api/projects/').then(r => r.data || r);

export default {
  login,
  register,
  logout,
  getCourses,
  getCourseDetail,
  getMyEnrollments,
  getCourseProgress,
  completeLesson,
  initiatePayment,
  verifyPayment,
  savePaymentMethod,
  getEnrollmentStatus,
  getProjects,
};