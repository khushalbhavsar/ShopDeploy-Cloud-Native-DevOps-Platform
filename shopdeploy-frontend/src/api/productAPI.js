import axiosInstance from './axiosInstance';

export const productAPI = {
    getProducts: async (params = {}) => {
        const response = await axiosInstance.get('/products', { params });
        return response.data;
    },

    getProductById: async (id) => {
        const response = await axiosInstance.get(`/products/${id}`);
        return response.data;
    },

    createProduct: async (formData) => {
        const response = await axiosInstance.post('/products', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },

    updateProduct: async (id, formData) => {
        const response = await axiosInstance.put(`/products/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },

    deleteProduct: async (id) => {
        const response = await axiosInstance.delete(`/products/${id}`);
        return response.data;
    },
};
