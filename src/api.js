import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://ayindetechnologiesbackend-production.up.railway.app';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const login = (email, password) => api.post('/api/auth/login/', { email, password });
export const register = (email, password) => api.post('/api/auth/register/', { email, password });
export const logout = () => {
  localStorage.removeItem('token');
  return Promise.resolve();
};

// Courses
export const getCourses = () => api.get('/api/courses/').then(r => r.data);
export const getCourseDetail = (courseId) => api.get(`/api/courses/${courseId}/`).then(r => r.data);
export const getMyEnrollments = () => api.get('/api/courses/me/enrollments/').then(r => r.data);
export const getCourseProgress = (courseId) => api.get(`/api/courses/${courseId}/progress/`).then(r => r.data);

// Lessons
export const completeLesson = (courseId, lessonId) => 
  api.post(`/api/courses/${courseId}/lessons/${lessonId}/complete/`).then(r => r.data);

// Payments - ONE-TIME
export const initiatePayment = (courseId, amount, currency = 'USD') =>
  api.post('/api/payments/create-intent/', { course_id: courseId, amount, currency }).then(r => r.data);

export const verifyPayment = (paymentId, nonce, billingData = {}) =>
  api.post('/api/payments/verify/', {
    payment_id: paymentId,
    nonce,
    billing_postal_code: billingData.billingPostalCode,
    billing_country: billingData.billingCountry
  }).then(r => r.data);

// ✅ NEW: Save card for auto-charge subscription
export const savePaymentMethod = (courseId, nonce) =>
  api.post(`/api/courses/${courseId}/save-card/`, { nonce }).then(r => r.data);

// ✅ NEW: Get enrollment status (trial, active, payment_failed)
export const getEnrollmentStatus = (courseId) =>
  api.get(`/api/courses/${courseId}/enrollment-status/`).then(r => r.data);

// Projects
export const getProjects = () => api.get('/api/projects/').then(r => r.data);

export default api;