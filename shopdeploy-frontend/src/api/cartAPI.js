import axiosInstance from './axiosInstance';

export const cartAPI = {
    getCart: async () => {
        const response = await axiosInstance.get('/cart');
        return response.data;
    },

    addToCart: async (productId, qty) => {
        const response = await axiosInstance.post('/cart', { productId, qty });
        return response.data;
    },

    updateCartItem: async (itemId, qty) => {
        const response = await axiosInstance.put(`/cart/${itemId}`, { qty });
        return response.data;
    },

    removeFromCart: async (itemId) => {
        const response = await axiosInstance.delete(`/cart/${itemId}`);
        return response.data;
    },

    clearCart: async () => {
        const response = await axiosInstance.delete('/cart');
        return response.data;
    },
};
