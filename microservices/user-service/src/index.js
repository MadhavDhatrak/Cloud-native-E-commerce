import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/authroute.js';
import { connectDB } from './db/config.js';
const PORT = process.env.PORT || 3002;
dotenv.config();

const app = express();

app.use(express.json());

app.use('/api/auth', authRoutes);
app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on port ${PORT}`);
});