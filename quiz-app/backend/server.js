import express from 'express';
import mysql from 'mysql2/promise';  
import dotenv from 'dotenv';
import cors from 'cors';
import apiRoutes from './routes/apiRoutes.js';  
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

const app = express();
app.use(cors());  
app.use(express.json());


let db;

async function initializeDB() {
  db = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });
}

app.use('/api', apiRoutes);  
app.use('/api/admin', adminRoutes);


app.get('/', (req, res) => {
  res.send('Welcome to the QuizApp backend!');
});

async function startServer() {
  await initializeDB();
  app.listen(process.env.PORT || 5000, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT || 5000}`);
  });
}

startServer();
