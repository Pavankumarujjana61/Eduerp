CREATE DATABASE IF NOT EXISTS eduerp_db;
USE eduerp_db;

-- 1. Users Table (Core authentication)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role ENUM('admin', 'teacher', 'parent') NOT NULL,
    profile_pic VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Parents Table
CREATE TABLE IF NOT EXISTS parents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    parent_id_code VARCHAR(50) NOT NULL UNIQUE, -- e.g., 'PAR001'
    phone VARCHAR(20) NOT NULL,
    address TEXT,
    last_login VARCHAR(50) DEFAULT '24 Jun 2024',
    notifications ENUM('Enabled', 'Disabled') DEFAULT 'Enabled',
    status ENUM('Active', 'Inactive') DEFAULT 'Active',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Students Table
CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    parent_id INT, -- Links to parents(id)
    student_id_code VARCHAR(50) NOT NULL UNIQUE, -- e.g. 'STU001'
    name VARCHAR(255) NOT NULL,
    class_name VARCHAR(50) NOT NULL, -- e.g. '10-A', '9-B' (1 to 10th standard)
    roll_no INT NOT NULL,
    mobile VARCHAR(20),
    status ENUM('Active', 'Inactive') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES parents(id) ON DELETE SET NULL
);

-- 4. Teachers Table
CREATE TABLE IF NOT EXISTS teachers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    emp_id VARCHAR(50) NOT NULL UNIQUE, -- e.g. 'EMP2018001'
    department VARCHAR(100) NOT NULL, -- e.g. 'Mathematics', 'Physics'
    classes_assigned VARCHAR(255) NOT NULL, -- e.g. '10A, 10B, 9A'
    qualification VARCHAR(255) NOT NULL, -- e.g. 'M.Sc, B.Ed'
    phone VARCHAR(20) NOT NULL,
    status ENUM('Active', 'On Leave', 'Inactive') DEFAULT 'Active',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 5. Fees Table (Invoices / Payments)
CREATE TABLE IF NOT EXISTS fees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    receipt_no VARCHAR(50) NOT NULL UNIQUE, -- e.g. 'RCP-2024-001'
    date DATE NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    mode ENUM('Online', 'Cheque', 'Cash') NOT NULL,
    status ENUM('Paid', 'Pending', 'Partial') DEFAULT 'Pending',
    billing_period VARCHAR(50) NOT NULL, -- e.g., 'Q3 2024'
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- 6. Attendance Table
CREATE TABLE IF NOT EXISTS attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    date DATE NOT NULL,
    status ENUM('Present', 'Absent', 'Late') NOT NULL,
    marked_by_teacher_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (marked_by_teacher_id) REFERENCES teachers(id) ON DELETE SET NULL,
    UNIQUE KEY unique_student_date (student_id, date)
);

-- 7. Homework Table
CREATE TABLE IF NOT EXISTS homework (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    class_name VARCHAR(50) NOT NULL,
    due_date DATE NOT NULL,
    status ENUM('Pending', 'Graded') DEFAULT 'Pending',
    teacher_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE CASCADE
);

-- 8. Exams Table
CREATE TABLE IF NOT EXISTS exams (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    class_name VARCHAR(50) NOT NULL,
    exam_date DATE NOT NULL,
    max_marks INT DEFAULT 100
);

-- 9. Exam Results
CREATE TABLE IF NOT EXISTS exam_results (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    exam_id INT NOT NULL,
    marks_obtained INT NOT NULL,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE
);

-- 10. Alerts Table
CREATE TABLE IF NOT EXISTS alerts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    channel ENUM('SMS', 'Email', 'WhatsApp') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
