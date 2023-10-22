import products from './data/products';
import users from './data/users';
import Order from './models/orderModel';
import Product from './models/productModel';
import User from './models/userModel';
import server from './server';

beforeAll(async () => {
    server.on('listening', () => {
        console.log('Server is ready');
    });

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

    console.log('Data Imported!');
});

afterAll(async () => {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    console.log('Data Destroyed!');
    server.close();
});
