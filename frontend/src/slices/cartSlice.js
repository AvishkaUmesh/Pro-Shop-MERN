import { createSlice } from '@reduxjs/toolkit';

const initialState = localStorage.getItem('cart')
    ? JSON.parse(localStorage.getItem('cart'))
    : { cartItems: [] };

const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2);
};

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

            // calculate items price
            state.itemsPrice = addDecimals(
                state.cartItems.reduce(
                    (acc, curr) => acc + curr.price * curr.qty,
                    0
                )
            );

            // calculate shipping price
            // if order is over $100, shipping is free else $10 shipping
            state.shippingPrice = addDecimals(state.itemsPrice > 100 ? 0 : 10);

            // calculate tax price (15% of items price)
            state.taxPrice = addDecimals(
                Number((0.15 * state.itemsPrice).toFixed(2))
            );

            // calculate total price
            state.totalPrice = (
                Number(state.itemsPrice) +
                Number(state.shippingPrice) +
                Number(state.taxPrice)
            ).toFixed(2);

            // save cart to local storage
            localStorage.setItem('cart', JSON.stringify(state));
        },
    },
});

export const { addToCart } = cartSlice.actions;

export default cartSlice.reducer;
