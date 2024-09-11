// Import required packages
const express = require('express');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Create an instance of express
const app = express();

// Middleware to parse incoming JSON requests
app.use(express.json());

// Import routes (to be created)
const userRoutes = require('./routes/userRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

// Use the routes (example for users and transactions)
app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);

// Home route for basic health check
app.get('/', (req, res) => {
    res.send('Money Tracking App API is running...');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'An error occurred!',
        error: err.message,
    });
});

// Set the port from environment or use 5000 as default
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
