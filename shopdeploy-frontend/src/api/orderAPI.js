import axiosInstance from './axiosInstance';

export const orderAPI = {
    createOrder: async (orderData) => {
        const response = await axiosInstance.post('/orders', orderData);
        return response.data;
    },

    getMyOrders: async (params = {}) => {
        const response = await axiosInstance.get('/orders', { params });
        return response.data;
    },

    getAllOrders: async (params = {}) => {
        const response = await axiosInstance.get('/orders/all', { params });
        return response.data;
    },

    getOrderById: async (id) => {
        const response = await axiosInstance.get(`/orders/${id}`);
        return response.data;
    },

    updateOrderStatus: async (id, status, note) => {
        const response = await axiosInstance.put(`/orders/${id}/status`, { status, note });
        return response.data;
    },

    cancelOrder: async (id) => {
        const response = await axiosInstance.put(`/orders/${id}/cancel`);
        return response.data;
    },
};
