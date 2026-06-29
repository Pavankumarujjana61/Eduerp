# EduERP - Smart Education Management System

EduERP is a web-based school/college management portal built with **React** (frontend), **Node.js + Express** (backend), and **MySQL** (database). 

It features custom, pixel-perfect, responsive dashboards for three primary user roles:
1. **Admin Portal**: View key metrics (students, teachers, fees, attendance), monthly fee trends, student attendance analysis, and add new student accounts.
2. **Teacher Portal**: Mark student attendance (Present, Absent, Late) for classes, view student rosters, and track class statistics.
3. **Parent Portal (Student Dashboard)**: View child's dashboard banner, check pending fees, attendance percentages, latest exam scores, pending homework, and receive real-time alerts.

---

## Credentials for Demo Exploration

On the Login Page, clicking the **Demo Credentials** button at the bottom will automatically log you in, or you can switch tabs and use the following pre-filled credentials:

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@eduerp.in` | `password` |
| **Teacher** | `teacher@eduerp.in` | `password` |
| **Parent** | `parent@eduerp.in` | `password` |
| **Student** | `student@eduerp.in` | `password` |

---

## Local Setup Instructions

### 1. Database Setup (MySQL)
Ensure MySQL is running on your machine, then:
1. Create database:
   ```sql
   CREATE DATABASE eduerp_db;
   ```
2. Import the tables and dummy data:
   - Run the script: `database/schema.sql`
   - Run the script: `database/seed.sql`
   
*(Note: The Node.js server is designed to automatically detect and auto-initialize the database/tables if they do not exist on startup, making setup highly seamless!)*

### 2. Backend Setup
1. Navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Create/edit the `.env` file with your MySQL credentials:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=eduerp_db
   JWT_SECRET=eduerp_secret_key_2026_super_secure
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the server:
   ```bash
   npm start
   ```
   *(The server will start on port `5000`)*

### 3. Frontend Setup
1. Navigate to the `client` directory:
   ```bash
   cd ../client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the React development server:
   ```bash
   npm start
   ```
   *(The frontend will start on port `3000`)*
