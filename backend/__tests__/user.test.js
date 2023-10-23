import bcrypt from 'bcryptjs';
import supertest from 'supertest';
import app from '../app.js';
import User from '../models/userModel.js';

// Define a test user
const plainPassword = '123456';
const testNormalUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: bcrypt.hashSync(plainPassword, 10),
};

const testAdminUser = {
    name: 'Test Admin',
    email: 'admin@example.com',
    password: bcrypt.hashSync(plainPassword, 10),
    isAdmin: true,
};

describe('User', () => {
    describe('authUser', () => {
        // Create the test users before running the tests
        beforeAll(async () => {
            await User.deleteMany({});
            await User.create(testNormalUser);
            await User.create(testAdminUser);
        });

        // Remove the test user after running the tests
        afterAll(async () => {
            await User.deleteMany({});
        });

        it('should return user object if email and password are correct', async () => {
            const response = await supertest(app).post('/api/users/auth').send({
                email: testNormalUser.email,
                password: plainPassword,
            });

            expect(response.statusCode).toBe(200);
            expect(response.body._id).toBeDefined();
            expect(response.body.name).toBe(testNormalUser.name);
            expect(response.body.email).toBe(testNormalUser.email);
            expect(response.body.isAdmin).toBe(false);
        });

        it('should return a 401 error if email or password is incorrect', async () => {
            const response = await supertest(app).post('/api/users/auth').send({
                email: testNormalUser.email,
                password: 'wrongPassword',
            });

            expect(response.statusCode).toBe(401);
            expect(response.body.message).toBe('Invalid email or password');
        });

        it('should return an admin user object', async () => {
            const response = await supertest(app).post('/api/users/auth').send({
                email: testAdminUser.email,
                password: plainPassword,
            });

            expect(response.statusCode).toBe(200);
            expect(response.body._id).toBeDefined();
            expect(response.body.name).toBe(testAdminUser.name);
            expect(response.body.email).toBe(testAdminUser.email);
            expect(response.body.isAdmin).toBe(true);
        });
    });
});
