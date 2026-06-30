const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const parentRoutes = require('./routes/parentRoutes');
const { syncAndSeed } = require('./models/sync');

const app = express();
const PORT = process.env.PORT || 8080;

const path = require('path');

// Middleware
app.use(cors());
app.use(express.json());

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/parent', parentRoutes);

// Serve static React build files
app.use(express.static(path.join(__dirname, 'public')));

// Catch-all route for React
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Start server
async function startServer() {
    // 1. Start listening immediately — Hostinger health check passes
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`DB_HOST: ${process.env.DB_HOST}`);
        console.log(`DB_USER: ${process.env.DB_USER}`);
        console.log(`DB_NAME: ${process.env.DB_NAME}`);
    });

    // 2. Init DB + tables + seed in background
    try {
        await syncAndSeed();
        console.log("DB init complete — ready!");
    } catch (err) {
        console.error("DB init failed:", err.message);
    }
}

startServer();
