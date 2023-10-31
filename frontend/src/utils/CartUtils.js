export const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2);
};

export const updateCart = (state) => {
    // calculate items price
    const itemsPrice = state.cartItems.reduce(
        (acc, item) => acc + (item.price * 100 * item.qty) / 100,
        0
    );
    state.itemsPrice = addDecimals(itemsPrice);

    // calculate shipping price | if order is over $100, shipping is free else $10 shipping
    state.shippingPrice = addDecimals(state.itemsPrice > 100 ? 0 : 10);

    // calculate tax price (15% of items price)
    state.taxPrice = addDecimals(Number((0.15 * state.itemsPrice).toFixed(2)));

    // calculate total price
    state.totalPrice = (
        Number(state.itemsPrice) +
        Number(state.shippingPrice) +
        Number(state.taxPrice)
    ).toFixed(2);

    // save cart to local storage
    localStorage.setItem('cart', JSON.stringify(state));

    return state;
};
