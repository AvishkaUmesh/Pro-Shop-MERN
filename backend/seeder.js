// eslint-disable-next-line no-unused-vars
import colors from 'colors';
import dotenv from 'dotenv';

import products from './data/products.js';
import users from './data/users.js';

import Order from './models/orderModel.js';
import Product from './models/productModel.js';
import User from './models/userModel.js';

import connectDB from './config/db.js';

dotenv.config();

connectDB();

const importData = async () => {
    try {
        // Clear the database
        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();

        // Insert users
        const createdUsers = await User.insertMany(users);

        // Get admin user
        const adminUser = createdUsers[0]._id;

        // Insert products
        const sampleProducts = products.map((product) => {
            return { ...product, user: adminUser };
        });
        await Product.insertMany(sampleProducts);

        console.log('Data Imported!'.green.inverse);
        process.exit();
    } catch (error) {
        console.error(`${error}`.red.inverse);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        // Clear the database
        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();

        console.log('Data Destroyed!'.red.inverse);
        process.exit();
    } catch (error) {
        console.error(`${error}`.red.inverse);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
