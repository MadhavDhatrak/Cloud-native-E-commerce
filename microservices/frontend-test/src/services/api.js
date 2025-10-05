import axios from 'axios';

const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Product Service
export const productService = {
  getAll: () => api.get('/products'),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`)
};

// User Service
export const userService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getAll: () => api.get('/auth'),
  getById: (id) => api.get(`/auth/${id}`),
  update: (id, data) => api.put(`/auth/${id}`, data),
  delete: (id) => api.delete(`/auth/${id}`)
};

// Order Service
export const orderService = {
  getAll: () => api.get('/orders'),
  getById: (id) => api.get(`/orders/${id}`),
  getByUser: (userId) => api.get(`/orders/user/${userId}`),
  create: (data) => api.post('/orders', data),
  updateStatus: (id, status) => api.patch(`/orders/${id}/status`, { status: status }),
  updatePayment: (id, paymentStatus) => api.patch(`/orders/${id}/payment`, { status: paymentStatus }),
  cancelOrder: (id) => api.patch(`/orders/${id}/cancel`)
};

export default {
  productService,
  userService,
  orderService
};
