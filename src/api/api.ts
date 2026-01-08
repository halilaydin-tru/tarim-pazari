import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://tarim-pazari-api.onrender.com/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// User endpoints
export const userAPI = {
  register: (userData: any) => api.post('/users/register', userData),
  login: (credentials: any) => api.post('/users/login', credentials),
  googleLogin: (googleData: any) => api.post('/users/google-login', googleData),
  getUser: (userId: number) => api.get(`/users/${userId}`),
  updateUser: (userId: number, userData: any) => api.put(`/users/${userId}`, userData),
};

// Category endpoints
export const categoryAPI = {
  getCategories: () => api.get('/categories'),
  createCategory: (categoryData: any) => api.post('/categories', categoryData),
};

// Product endpoints
export const productAPI = {
  getProducts: (params?: any) => api.get('/products', { params }),
  getProductById: (id: number) => api.get(`/products/${id}`),
  createProduct: (productData: any) => {
    // If FormData, use it directly without JSON content-type
    if (productData instanceof FormData) {
      return api.post('/products', productData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
    }
    return api.post('/products', productData);
  },
  updateProduct: (id: number, productData: any) => api.put(`/products/${id}`, productData),
  deleteProduct: (id: number) => api.delete(`/products/${id}`),
};

// Order endpoints
export const orderAPI = {
  getOrders: (params?: any) => api.get('/orders', { params }),
  createOrder: (orderData: any) => api.post('/orders', orderData),
  updateOrder: (id: number, orderData: any) => api.put(`/orders/${id}`, orderData),
};
