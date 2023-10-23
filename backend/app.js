import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import express from 'express';
import connectDB from './config/db.js';
import connectTestDB from './config/dbTest.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';
import productRoutes from './routes/products.routes.js';
import userRoutes from './routes/user.routes.js';

dotenv.config();

if (process.env.NODE_ENV === 'test') {
    connectTestDB();
} else {
    connectDB();
}

const app = express();

// body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// cookie parser middleware
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send('Server is ready');
});
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
