require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());

// Health check route
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'CleanFanatics API is running' });
});

// Routes will be added here
app.use('/api/auth', require('./src/routes/auth.routes'));
app.use('/api/bookings', require('./src/routes/booking.routes'));
app.use('/api/provider', require('./src/routes/provider.routes'));
app.use('/api/admin', require('./src/routes/admin.routes'));

// Error handling middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
