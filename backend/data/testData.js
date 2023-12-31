// normal test users
export const testNormalUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: '123456',
};

// admin test users
export const testAdminUser = {
    name: 'Test Admin',
    email: 'admin@example.com',
    password: '123456',
    isAdmin: true,
};

// product test data
export const testProduct = {
    name: 'Airpods Wireless Bluetooth Headphones',
    image: '/images/airpods.jpg',
    description:
        'Bluetooth technology lets you connect it with compatible devices wirelessly High-quality AAC audio offers immersive listening experience Built-in microphone allows you to take calls while working',
    brand: 'Apple',
    category: 'Electronics',
    price: 89.99,
    countInStock: 10,
    rating: 4.5,
    numReviews: 12,
};

// products test data
export const testProducts = [
    {
        name: 'Airpods Wireless Bluetooth Headphones',
        image: '/images/airpods.jpg',
        description:
            'Bluetooth technology lets you connect it with compatible devices wirelessly High-quality AAC audio offers immersive listening experience Built-in microphone allows you to take calls while working',
        brand: 'Apple',
        category: 'Electronics',
        price: 89.99,
        countInStock: 10,
        rating: 4.5,
        numReviews: 12,
    },
    {
        name: 'iPhone 11 Pro 256GB Memory',
        image: '/images/phone.jpg',
        description:
            'Introducing the iPhone 11 Pro. A transformative triple-camera system that adds tons of capability without complexity. An unprecedented leap in battery life',
        brand: 'Apple',
        category: 'Electronics',
        price: 599.99,
        countInStock: 7,
        rating: 4.0,
        numReviews: 8,
    },
];
