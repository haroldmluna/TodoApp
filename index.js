require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sql = require('mssql');
const connectToDatabase = require('./db');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const port = process.env.PORT || 3000;
const SECRET_KEY = 'your-secret-key'; // Use a secure secret key in production

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Create HTTP Server and initialize Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Allow requests from the frontend
        methods: ["GET", "POST", "PUT", "DELETE"],
    },
});

// Handle Socket.IO connections
io.on('connection', (socket) => {
    console.log('A user connected.');

    socket.on('disconnect', () => {
        console.log('A user disconnected.');
    });
});

// Function to broadcast updates to all connected clients
function broadcastTodosUpdate() {
    io.emit('todos-updated');
}

// Connect to the database
let pool;
(async () => {
    pool = await connectToDatabase();

    // Password hashing logic
    const hashedPassword1 = await bcrypt.hash('password3', 10);
    const hashedPassword2 = await bcrypt.hash('password4', 10);

    try {
        await pool.request()
            .query(`UPDATE Users SET PasswordHash = '${hashedPassword1}' WHERE Username = 'testuser3'`);
        await pool.request()
            .query(`UPDATE Users SET PasswordHash = '${hashedPassword2}' WHERE Username = 'testuser4'`);
        console.log('Password hashes updated.');
    } catch (err) {
        console.error('Error updating passwords:', err);
    }
})();

// Test Route
app.get('/', (req, res) => {
    res.send('Server is working!');
});

// **User Authentication Routes**

// Register User
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        await pool.request()
            .input('username', sql.NVarChar, username)
            .input('password', sql.NVarChar, hashedPassword)
            .query('INSERT INTO Users (Username, PasswordHash) VALUES (@username, @password)');
        res.status(201).send('User registered successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error registering user');
    }
});

// Login User
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const result = await pool.request()
            .input('username', sql.NVarChar, username)
            .query('SELECT * FROM Users WHERE Username = @username');

        if (result.recordset.length === 0) {
            return res.status(401).send('Invalid credentials');
        }

        const user = result.recordset[0];
        const isPasswordValid = await bcrypt.compare(password, user.PasswordHash);

        if (!isPasswordValid) {
            return res.status(401).send('Invalid credentials');
        }

        const token = jwt.sign({ userId: user.UserId }, SECRET_KEY, { expiresIn: '1h' });
        res.send({ token });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error logging in');
    }
});

// **To-Do Management Routes**

// Create To-Do
app.post('/todos', async (req, res) => {
    const { userId, task } = req.body;

    try {
        await pool.request()
            .input('userId', sql.Int, userId)
            .input('task', sql.NVarChar, task)
            .query('INSERT INTO Todos (UserId, Task) VALUES (@userId, @task)');
        broadcastTodosUpdate(); // Notify all clients
        res.status(201).send('Task created');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error creating task');
    }
});

// Get To-Do List
app.get('/todos/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const result = await pool.request()
            .input('userId', sql.Int, userId)
            .query('SELECT * FROM Todos WHERE UserId = @userId');
        res.send(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching tasks');
    }
});

// Mark To-Do as Completed
app.put('/todos/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await pool.request()
            .input('id', sql.Int, id)
            .query('UPDATE Todos SET IsCompleted = 1 WHERE TodoId = @id');
        broadcastTodosUpdate(); // Notify all clients
        res.send('Task marked as completed');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating task');
    }
});

// Delete To-Do
app.delete('/todos/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM Todos WHERE TodoId = @id');
        broadcastTodosUpdate(); // Notify all clients
        res.send('Task deleted');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting task');
    }
});

// Start the server with SignalR
server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});