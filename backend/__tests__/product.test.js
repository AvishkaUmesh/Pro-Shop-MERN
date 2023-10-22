import supertest from 'supertest';
import app from '../app.js';

describe('Product', () => {
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
            const response = await supertest(app).get('/api/products/100');
            expect(response.statusCode).toBe(404);
        });
    });
});
