import supertest from 'supertest';
import app from '../server.js';

describe('Product', () => {
	describe('get all products', () => {
		it('should return list of products', async () => {
			const products = await supertest(app).get('/api/products');
			expect(products.statusCode).toBe(200);
		});
	});
	describe('get a single product', () => {
		it('should return a single product', async () => {});

		it('should return a 404 if product is not found', async () => {
			const response = await supertest(app).get('/api/products/100');
			expect(response.statusCode).toBe(404);
		});
	});
});
