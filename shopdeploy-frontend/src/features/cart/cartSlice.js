import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cartAPI } from '../../api/cartAPI';

export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { rejectWithValue }) => {
    try {
        const data = await cartAPI.getCart();
        return data.data.cart;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch cart');
    }
});

export const addToCart = createAsyncThunk('cart/addToCart', async ({ productId, qty }, { rejectWithValue }) => {
    try {
        const data = await cartAPI.addToCart(productId, qty);
        return data.data.cart;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to add to cart');
    }
});

export const updateCartItem = createAsyncThunk('cart/updateCartItem', async ({ itemId, qty }, { rejectWithValue }) => {
    try {
        const data = await cartAPI.updateCartItem(itemId, qty);
        return data.data.cart;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to update cart');
    }
});

export const removeFromCart = createAsyncThunk('cart/removeFromCart', async (itemId, { rejectWithValue }) => {
    try {
        const data = await cartAPI.removeFromCart(itemId);
        return data.data.cart;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to remove from cart');
    }
});

export const clearCart = createAsyncThunk('cart/clearCart', async (_, { rejectWithValue }) => {
    try {
        const data = await cartAPI.clearCart();
        return data.data.cart;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to clear cart');
    }
});

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        cart: null,
        isLoading: false,
        error: null,
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCart.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.isLoading = false;
                state.cart = action.payload;
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.cart = action.payload;
            })
            .addCase(updateCartItem.fulfilled, (state, action) => {
                state.cart = action.payload;
            })
            .addCase(removeFromCart.fulfilled, (state, action) => {
                state.cart = action.payload;
            })
            .addCase(clearCart.fulfilled, (state, action) => {
                state.cart = action.payload;
            });
    },
});

export const { clearError } = cartSlice.actions;
export default cartSlice.reducer;
