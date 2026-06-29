const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
require('dotenv').config();

let pool;

async function initializeDatabase() {
    const config = {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
    };

    try {
        // 1. Connect without db to create database
        const connection = await mysql.createConnection(config);
        const dbName = process.env.DB_NAME || 'eduerp_db';
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
        await connection.end();

        // 2. Establish connection pool with db
        pool = mysql.createPool({
            ...config,
            database: dbName,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });

        console.log(`Database connected successfully: ${dbName}`);

        // 3. Check if table 'users' exists
        const [tables] = await pool.query(`SHOW TABLES LIKE 'users'`);
        if (tables.length === 0) {
            console.log("Database tables not found. Initializing schema...");
            await setupSchema();
            console.log("Schema initialized. Seeding default data...");
            await seedData();
        } else {
            console.log("Database tables verified.");
        }

    } catch (err) {
        console.error("Database connection/initialization failed:", err.message);
        console.log("Make sure MySQL is running and credentials in .env are correct.");
    }
}

async function setupSchema() {
    // We execute schema statements
    const connection = await pool.getConnection();
    try {
        const schemaPath = path.join(__dirname, '../database/schema.sql');
        let schemaSql;
        if (fs.existsSync(schemaPath)) {
            schemaSql = fs.readFileSync(schemaPath, 'utf8');
        } else {
            throw new Error("schema.sql not found at " + schemaPath);
        }

        // Split queries by semicolon (taking care of comments and strings)
        // A simple split by semicolon works if we remove comments
        const queries = schemaSql
            .split(';')
            .map(q => q.trim())
            .filter(q => q.length > 0 && !q.startsWith('--'));

        for (const query of queries) {
            if (query.toUpperCase().startsWith('USE')) continue;
            await connection.query(query);
        }
        console.log("All tables created successfully.");
    } catch (error) {
        console.error("Error setting up schema:", error);
    } finally {
        connection.release();
    }
}

async function seedData() {
    const connection = await pool.getConnection();
    try {
        const seedPath = path.join(__dirname, '../database/seed.sql');
        let seedSql;
        if (fs.existsSync(seedPath)) {
            seedSql = fs.readFileSync(seedPath, 'utf8');
        } else {
            throw new Error("seed.sql not found at " + seedPath);
        }

        // Remove comments
        const queries = seedSql
            .split(';')
            .map(q => q.trim())
            .filter(q => q.length > 0 && !q.startsWith('--'));

        // Disable foreign keys check before seeding
        await connection.query('SET FOREIGN_KEY_CHECKS = 0');

        for (const query of queries) {
            if (query.toUpperCase().startsWith('USE')) continue;
            await connection.query(query);
        }

        // Re-enable foreign keys check
        await connection.query('SET FOREIGN_KEY_CHECKS = 1');
        console.log("Seed data loaded successfully.");
    } catch (error) {
        console.error("Error seeding database:", error);
    } finally {
        connection.release();
    }
}

// Initialize on load
initializeDatabase();

module.exports = {
    query: (text, params) => {
        if (!pool) {
            throw new Error("Database pool not initialized. Check server logs.");
        }
        return pool.query(text, params);
    },
    pool
};
