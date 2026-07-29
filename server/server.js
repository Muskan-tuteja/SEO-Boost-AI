import express from 'express';
import cors from 'cors';
import "dotenv/config";
import dns from 'dns';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';

// import rankRouter from './routes/rankRoutes.js';
import rankRoutes from './routes/rankRoutes.js';
import analysisRouter from './routes/analysisRoutes.js';
import { startRankTrackingCron } from './cron/rankTrackingCron.js';

// DNS fix — connectDB() se PEHLE set karo
dns.setServers(['8.8.8.8', '8.8.4.4']);

connectDB();

const app = express();
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://seo-boost-ai-black.vercel.app"
  ],
  credentials: true,
}));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.use('/api/auth', authRoutes);
app.use('/api/rank', rankRoutes);
app.use('/api/analysis', analysisRouter);

// Start cron jobs
startRankTrackingCron()


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {    
    console.log(`Server is running on port ${PORT}`);
});