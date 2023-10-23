import supertest from 'supertest';
import app from '../app.js';
import {
    plainPassword,
    testAdminUser,
    testNormalUser,
} from '../data/testData.js';
import User from '../models/userModel.js';

describe('User Controller', () => {
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

    /**
     * User login tests
     */
    describe('authUser', () => {
        it('should return user object if email and password are correct', async () => {
            const response = await supertest(app).post('/api/users/auth').send({
                email: testNormalUser.email,
                password: testNormalUser.password,
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
                password: testAdminUser.password,
            });

            expect(response.statusCode).toBe(200);
            expect(response.body._id).toBeDefined();
            expect(response.body.name).toBe(testAdminUser.name);
            expect(response.body.email).toBe(testAdminUser.email);
            expect(response.body.isAdmin).toBe(true);
        });
    });

    /**
     * Unauthorized requests tests
     */
    describe('Unauthorized requests', () => {
        describe('accessing protected routes when not logged in', () => {
            it('should return 401 status', async () => {
                await supertest(app).get('/api/users').expect(401);
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
                        password: testNormalUser.password,
                    });

                expect(response.statusCode).toBe(200);

                // Get the token from the http-only cookie
                const cookie = response.headers['set-cookie'][0];
                const token = cookie.split('=')[1].split(';')[0];

                await supertest(app)
                    .get('/api/users')
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

    /**
     * Requests Authorized with valid token tests
     */
    describe('Authorized request', () => {
        describe('accessing protected routes', () => {
            it('should return 200 status', async () => {
                const response = await supertest(app)
                    .post('/api/users/auth')
                    .send({
                        email: testNormalUser.email,
                        password: testNormalUser.password,
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
                        password: testAdminUser.password,
                    });

                expect(response.statusCode).toBe(200);

                // Get the token from the http-only cookie
                const cookie = response.headers['set-cookie'][0];
                const token = cookie.split('=')[1].split(';')[0];

                await supertest(app)
                    .get('/api/users')
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

    /**
     * User registration tests
     */
    describe('Register user', () => {
        describe('Given valid data', () => {
            it('should return 201 status and user object & token', async () => {
                const response = await supertest(app).post('/api/users').send({
                    name: 'Registered User',
                    email: 'reg@example.com',
                    password: '123456',
                });

                expect(response.statusCode).toBe(201);
                expect(response.body._id).toBeDefined();
                expect(response.body.name).toBe('Registered User');
                expect(response.body.email).toBe('reg@example.com');
                expect(response.body.isAdmin).toBe(false);

                // Get the token from the http-only cookie
                const cookie = response.headers['set-cookie'][0];
                const token = cookie.split('=')[1].split(';')[0];

                expect(token).toBeDefined();
            });
        });

        describe('Given invalid data', () => {
            it('should return 500 status if name is missing', async () => {
                const response = await supertest(app).post('/api/users').send({
                    email: 'test@test.com',
                    password: '123456',
                });

                expect(response.statusCode).toBe(500);
                expect(response.body.message).toBe(
                    'User validation failed: name: Path `name` is required.'
                );
            });

            it('should return 500 status if email is missing', async () => {
                const response = await supertest(app).post('/api/users').send({
                    name: 'Test User',
                    password: '123456',
                });

                expect(response.statusCode).toBe(500);
                expect(response.body.message).toBe(
                    'User validation failed: email: Path `email` is required.'
                );
            });

            it('should return 500 status if password is missing', async () => {
                const response = await supertest(app).post('/api/users').send({
                    name: 'Test User',
                    email: 'test@test.com',
                });

                expect(response.statusCode).toBe(500);
                expect(response.body.message).toBe(
                    'User validation failed: password: Path `password` is required.'
                );
            });
        });

        describe('Given already exist email', () => {
            it('should return 400 User already exists', async () => {
                const response = await supertest(app).post('/api/users').send({
                    name: 'Registered User',
                    email: 'reg@example.com',
                    password: '123456',
                });

                expect(response.statusCode).toBe(400);
                expect(response.body.message).toBe('User already exists');
            });
        });
    });
});
