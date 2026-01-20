import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add auth headers to requests
api.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (user) {
        config.headers['x-user-id'] = user._id;
        config.headers['x-user-role'] = user.role;
    }
    return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const message = error.response?.data?.message || 'Something went wrong';
        console.error('API Error:', message);
        return Promise.reject(error);
    }
);

// Auth APIs
export const authAPI = {
    login: (userId) => api.post('/api/auth/login', { userId }),
    getMe: () => api.get('/api/auth/me'),
    getDemoUsers: () => api.get('/api/auth/users'),
    getProviders: (serviceType) => api.get('/api/auth/providers', { params: { serviceType } })
};

// Booking APIs (Customer)
export const bookingAPI = {
    create: (data) => api.post('/api/bookings', data),
    getMyBookings: (status) => api.get('/api/bookings/my', { params: { status } }),
    getBooking: (id) => api.get(`/api/bookings/${id}`),
    cancel: (id, reason) => api.patch(`/api/bookings/${id}/cancel`, { reason }),
    getHistory: (id) => api.get(`/api/bookings/${id}/history`)
};

// Provider APIs
export const providerAPI = {
    getAssignedBookings: (status) => api.get('/api/provider/bookings', { params: { status } }),
    accept: (id) => api.patch(`/api/provider/bookings/${id}/accept`),
    reject: (id, reason) => api.patch(`/api/provider/bookings/${id}/reject`, { reason }),
    start: (id) => api.patch(`/api/provider/bookings/${id}/start`),
    complete: (id, notes) => api.patch(`/api/provider/bookings/${id}/complete`, { notes }),
    cancel: (id, reason) => api.patch(`/api/provider/bookings/${id}/cancel`, { reason })
};

// Admin APIs
export const adminAPI = {
    getAllBookings: (params) => api.get('/api/admin/bookings', { params }),
    getStats: () => api.get('/api/admin/stats'),
    overrideStatus: (id, status, reason) => api.patch(`/api/admin/bookings/${id}/override`, { status, reason }),
    assignProvider: (id, providerId) => api.patch(`/api/admin/bookings/${id}/assign`, { providerId }),
    markNoShow: (id, type) => api.patch(`/api/admin/bookings/${id}/no-show`, { type }),
    getEventLogs: (params) => api.get('/api/admin/logs', { params })
};

export default api;
