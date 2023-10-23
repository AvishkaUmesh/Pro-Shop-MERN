import supertest from 'supertest';
import app from '../app.js';
import {
    plainPassword,
    testAdminUser,
    testNormalUser,
} from '../data/testData.js';
import User from '../models/userModel.js';

describe('User', () => {
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

    describe('authUser', () => {
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

        it('should return a 401 error if password is incorrect', async () => {
            const response = await supertest(app).post('/api/users/auth').send({
                email: testNormalUser.email,
                password: 'wrongPassword',
            });

            expect(response.statusCode).toBe(401);
            expect(response.body.message).toBe('Invalid email or password');
        });

        it('should return a 401 error if email is incorrect', async () => {
            const response = await supertest(app).post('/api/users/auth').send({
                email: 'wrongEmail@example.com',
                password: plainPassword,
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

    describe('Unauthorized requests', () => {
        describe('accessing protected routes when not logged in', () => {
            it('should return 401 status', async () => {
                await supertest(app).get('/api/users/getUsers').expect(401);
                await supertest(app).get('/api/users/profile').expect(401);
                await supertest(app)
                    .put('/api/users/profile')
                    .send({})
                    .expect(401);
                await supertest(app).get('/api/users/123').expect(401);
                await supertest(app).put('/api/users/123').send({}).expect(401);
                await supertest(app).delete('/api/users/123').expect(401);
            });
        });

        describe(' when normal user access admin routes', () => {
            it('should return 401', async () => {
                const response = await supertest(app)
                    .post('/api/users/auth')
                    .send({
                        email: testNormalUser.email,
                        password: plainPassword,
                    });

                expect(response.statusCode).toBe(200);

                // Get the token from the http-only cookie
                const cookie = response.headers['set-cookie'][0];
                const token = cookie.split('=')[1].split(';')[0];

                await supertest(app)
                    .get('/api/users/getUsers')
                    .set('Cookie', `jwt=${token}`)
                    .expect(401);
                await supertest(app)
                    .get('/api/users/123')
                    .set('Cookie', `jwt=${token}`)
                    .expect(401);
                await supertest(app)
                    .put('/api/users/123')
                    .send({})
                    .set('Cookie', `jwt=${token}`)
                    .expect(401);
                await supertest(app)
                    .delete('/api/users/123')
                    .set('Cookie', `jwt=${token}`)
                    .expect(401);
            });
        });
    });

    describe('Authorized request', () => {
        describe('accessing protected routes', () => {
            it('should return 200 status', async () => {
                const response = await supertest(app)
                    .post('/api/users/auth')
                    .send({
                        email: testNormalUser.email,
                        password: plainPassword,
                    });

                expect(response.statusCode).toBe(200);

                // Get the token from the http-only cookie
                const cookie = response.headers['set-cookie'][0];
                const token = cookie.split('=')[1].split(';')[0];

                await supertest(app)
                    .get('/api/users/profile')
                    .set('Cookie', `jwt=${token}`)
                    .expect(200);

                await supertest(app)
                    .put('/api/users/profile')
                    .send({})
                    .set('Cookie', `jwt=${token}`)
                    .expect(200);
            });
        });

        describe('accessing admin routes', () => {
            it('should return 200 status', async () => {
                const response = await supertest(app)
                    .post('/api/users/auth')
                    .send({
                        email: testAdminUser.email,
                        password: plainPassword,
                    });

                expect(response.statusCode).toBe(200);

                // Get the token from the http-only cookie
                const cookie = response.headers['set-cookie'][0];
                const token = cookie.split('=')[1].split(';')[0];

                await supertest(app)
                    .get('/api/users/getUsers')
                    .set('Cookie', `jwt=${token}`)
                    .expect(200);
                await supertest(app)
                    .get('/api/users/123')
                    .set('Cookie', `jwt=${token}`)
                    .expect(200);
                await supertest(app)
                    .put('/api/users/123')
                    .send({})
                    .set('Cookie', `jwt=${token}`)
                    .expect(200);
                await supertest(app)
                    .delete('/api/users/123')
                    .set('Cookie', `jwt=${token}`)
                    .expect(200);
            });
        });
    });
});
