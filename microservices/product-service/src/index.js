import express from 'express';
import dotenv from 'dotenv';
import productRoutes from './routes/ProductRoute.js';
import { connectDB } from './db/config.js';
const PORT = process.env.PORT || 3001;
dotenv.config();
const app = express();

app.use(express.json());

app.use('/api/products', productRoutes);

app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on port ${PORT}`);
});


