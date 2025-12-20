export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const ORDER_STATUS = {
    PENDING: 'pending',
    PROCESSING: 'processing',
    SHIPPED: 'shipped',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled',
};

export const PAYMENT_METHODS = {
    COD: 'cod',
    STRIPE: 'stripe',
};

export const USER_ROLES = {
    CUSTOMER: 'customer',
    ADMIN: 'admin',
};
