import { createSlice } from '@reduxjs/toolkit';
import { updateCart } from '../utils/CartUtils';

const initialState = localStorage.getItem('cart')
    ? JSON.parse(localStorage.getItem('cart'))
    : { cartItems: [], shippingAddress: {}, paymentMethod: 'PayPal' };

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const item = action.payload;
            const existItem = state.cartItems.find(
                (curr) => curr._id === item._id
            );

            // if item already exists in cart, replace it with new item
            if (existItem) {
                state.cartItems = state.cartItems.map((curr) =>
                    curr._id === existItem._id ? item : curr
                );
            } else {
                state.cartItems = [...state.cartItems, item];
            }

            // calculate prices & save cart to local storage
            return updateCart(state);
        },

        removeFromCart: (state, action) => {
            state.cartItems = state.cartItems.filter(
                (curr) => curr._id !== action.payload
            );

            // calculate prices & save cart to local storage
            return updateCart(state);
        },

        saveShippingAddress: (state, action) => {
            state.shippingAddress = action.payload;
            return updateCart(state);
        },
    },
});

export const { addToCart, removeFromCart, saveShippingAddress } =
    cartSlice.actions;

export default cartSlice.reducer;
