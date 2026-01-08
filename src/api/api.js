import axios from 'axios';
const API_BASE_URL = 'http://localhost:5000/api';
export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});
// User endpoints
export const userAPI = {
    register: (userData) => api.post('/users/register', userData),
    login: (credentials) => api.post('/users/login', credentials),
    googleLogin: (googleData) => api.post('/users/google-login', googleData),
    getUser: (userId) => api.get(`/users/${userId}`),
    updateUser: (userId, userData) => api.put(`/users/${userId}`, userData),
};
// Category endpoints
export const categoryAPI = {
    getCategories: () => api.get('/categories'),
    createCategory: (categoryData) => api.post('/categories', categoryData),
};
// Product endpoints
export const productAPI = {
    getProducts: (params) => api.get('/products', { params }),
    getProductById: (id) => api.get(`/products/${id}`),
    createProduct: (productData) => {
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
    updateProduct: (id, productData) => api.put(`/products/${id}`, productData),
    deleteProduct: (id) => api.delete(`/products/${id}`),
};
// Order endpoints
export const orderAPI = {
    getOrders: (params) => api.get('/orders', { params }),
    createOrder: (orderData) => api.post('/orders', orderData),
    updateOrder: (id, orderData) => api.put(`/orders/${id}`, orderData),
};
