// server/server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');

dotenv.config({ path: './.env' }); // Load .env file

connectDB(); // Connect to MongoDB

const app = express();

// Middleware
app.use(cors()); // Allow cross-origin requests from your React app
app.use(express.json()); // Enable parsing of JSON request bodies

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

// Simple route for testing
app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});