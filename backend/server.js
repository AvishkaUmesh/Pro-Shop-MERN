import dotenv from 'dotenv';
import express from 'express';
import connectDB from './config/db.js';
import connectTestDB from './config/dbTest.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';
import productRoutes from './routes/products.routes.js';

dotenv.config();

const port = process.env.PORT || 5000;
// connectDB();

if (process.env.NODE_ENV === 'test') {
    connectTestDB();
} else {
    connectDB();
}

const app = express();

app.get('/', (req, res) => {
    res.send('Server is ready');
});
app.use('/api/products', productRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Serve at http://localhost:${port}`);
});

export default app;
