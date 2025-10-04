import express from 'express';
import dotenv from 'dotenv';
import orderRoutes from './routes/orderRoutes.js';
import { connectDB } from './db/config.js';

const PORT = process.env.PORT || 3003;
dotenv.config();
const app = express();

app.use(express.json());

app.use('/api/orders', orderRoutes);

app.listen(PORT, () => {
    connectDB();
    console.log(`Order Service is running on port ${PORT}`);
});
