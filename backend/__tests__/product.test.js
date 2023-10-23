import supertest from 'supertest';
import app from '../app.js';
import products from '../data/products.js';
import users from '../data/users.js';
import Product from '../models/productModel.js';
import User from '../models/userModel.js';

describe('Product', () => {
    beforeAll(async () => {
        // Insert users
        const createdUsers = await User.insertMany(users);

        // Get admin user
        const adminUser = createdUsers[0]._id;

        // Insert products
        const sampleProducts = products.map((product) => {
            return { ...product, user: adminUser };
        });
        await Product.insertMany(sampleProducts);
    });

    afterAll(async () => {
        await Product.deleteMany();
        await User.deleteMany();
    });

    describe('get all products', () => {
        it('should return list of products', async () => {
            const products = await supertest(app).get('/api/products');
            expect(products.statusCode).toBe(200);
            expect(products.body.length).toBe(6);
        });
    });
    describe('get a single product', () => {
        it('should return a single product', async () => {
            const products = await supertest(app).get('/api/products');
            const product = await supertest(app).get(
                `/api/products/${products.body[0]._id}`
            );
            expect(product.statusCode).toBe(200);
            expect(product.body.name).toBe(
                'Airpods Wireless Bluetooth Headphones'
            );
            expect(product.body.price).toBe(89.99);
            expect(product.body.category).toBe('Electronics');
            expect(product.body.brand).toBe('Apple');
            expect(product.body.countInStock).toBe(10);
        });

        it('should return a 404 if product is not found', async () => {
            const response = await supertest(app).get(
                '/api/products/65352f4143b333fb8160a38c'
            );
            expect(response.statusCode).toBe(404);
        });

        it('should return a 404 if invalid ObjectId is passed', async () => {
            const response = await supertest(app).get('/api/products/12345');
            expect(response.statusCode).toBe(404);
            expect(response.body.message).toBe('Invalid ObjectId of:  12345');
        });
    });
});
