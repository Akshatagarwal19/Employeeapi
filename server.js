import express from "express";
import pg from "pg";
import bodyParser from "body-parser";
import employeeRoutes from "./src/routes/employeeRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";
import cors from "cors";
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Client } = pg

const db = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

db.connect()
    .then(() => console.log('Connected to the database'))
    .catch(err => {
        console.error('Database connection error:', err.message);
        console.error('Stack Trace:', err.stack);
        process.exit(1);  // Exit the application if the database connection fails
    });

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Welcome to the Employee Management System API');
});

app.use('/auth', authRoutes);
app.use('/employees', employeeRoutes);

app.listen(port, () => {
    console.log(`Server is running on ${port}`);
});

export default db;
