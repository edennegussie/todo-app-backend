// server.js
const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const { Pool } = require('pg');
require('dotenv').config();
const cors = require("cors");

// Middleware
app.use(express.json());
app.use(cors());

const pool = new Pool({
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT
});


// Sample Route
app.get("/", (req, res) => {
    res.json({ message: "Served!" });
});

// Get all tasks
app.get('/tasks', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM task');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving tasks');
    }
});

// Get task by ID
app.get('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM task WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).send('Task not found');
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving task');
    }
});

// Create a new task
app.post('/tasks', async (req, res) => {
    const { title, userid, status, description, dueDate } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO task (title, userid, status, description, due_date) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [title, userid, status, description, dueDate]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error creating task');
    }
});


// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});