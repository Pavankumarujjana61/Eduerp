const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const parentRoutes = require('./routes/parentRoutes');
const { syncAndSeed } = require('./models/sync');

const app = express();
const PORT = process.env.PORT || 5000;

const path = require('path');

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
    console.log(`[REQUEST] ${req.method} ${req.url}`, req.body);
    const originalJson = res.json;
    res.json = function(data) {
        console.log(`[RESPONSE] ${req.method} ${req.url} -> Status ${res.statusCode}:`, data);
        return originalJson.call(this, data);
    };
    next();
});

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/parent', parentRoutes);

// Serve static React build files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Catch-all route to serve React app for client routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Sync database and start server
async function startServer() {
    // Start listening immediately so Hostinger health check passes
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });

    // Then connect to DB in background
    try {
        await syncAndSeed();
        console.log("Database sync complete.");
    } catch (err) {
        console.error("Database sync failed (server still running):", err.message);
    }
}

startServer();

