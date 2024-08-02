import express from "express";
import pg from "pg";
import bodyParser from "body-parser";
import employeeRoutes from "./src/routes/employeeRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";
import cors from "cors";
import dotenv from 'dotenv';
import errorHandler from "./src/middlewares/errorhandler.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

const { Client } = pg

const db = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
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

app.get('/v1', (req, res) => {
    console.log("welcome to my api")
    res.send('Welcome to the Employee Management System API');
});

app.use('/v1/auth', authRoutes);
app.use('/v1/employees', employeeRoutes);

// app.use((req, res, next) => {
//     console.log(`${req.method} ${req.url}`);
//     next();
// });

app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server is running on ${port}`);
});

export default db;