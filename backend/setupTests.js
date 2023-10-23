import mongoose from 'mongoose';
import Order from './models/orderModel';
import Product from './models/productModel';
import User from './models/userModel';
import server from './server';

beforeAll(async () => {
    // Clear the database
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
});

afterAll(async () => {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    console.log('Data Destroyed!');
    await mongoose.connection.close();
    server.close();
});
