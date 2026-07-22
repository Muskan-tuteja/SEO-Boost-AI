import express from 'express';
import cors from 'cors';
import "dotenv/config";
import dns from 'dns';
import connectDB from './config/db.js';

// DNS fix — connectDB() se PEHLE set karo
dns.setServers(['8.8.8.8', '8.8.4.4']);

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {    
    console.log(`Server is running on port ${PORT}`);
});