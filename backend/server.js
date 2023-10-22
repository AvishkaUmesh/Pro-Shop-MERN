import dotenv from 'dotenv';
import app from './app.js';

dotenv.config();

const port = process.env.PORT || 5000;

const server = app.listen(port, () => {
    console.log(`Serve at http://localhost:${port}`);
});

export default server;
