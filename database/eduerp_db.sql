CREATE DATABASE IF NOT EXISTS eduerp_db;
USE eduerp_db;

-- Disable constraints for clean import
SET FOREIGN_KEY_CHECKS = 0;

-- --------------------------------------------------------
-- 1. Users Table
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role ENUM('admin', 'teacher', 'parent') NOT NULL,
    profile_pic VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

TRUNCATE TABLE users;
INSERT INTO users (id, email, password, name, role, profile_pic) VALUES
(1, 'admin@eduerp.in', '$2a$10$tZ2/97G5qL8u5QW6h2/Ea.6K7K9uP4vQvJjK2X8CeeGv73P5GqS3G', 'Amit Gupta', 'admin', 'admin_avatar.png'),
(2, 'teacher@eduerp.in', '$2a$10$tZ2/97G5qL8u5QW6h2/Ea.6K7K9uP4vQvJjK2X8CeeGv73P5GqS3G', 'Mrs. Kavitha Reddy', 'teacher', 'teacher_avatar.png'),
(3, 'parent@eduerp.in', '$2a$10$tZ2/97G5qL8u5QW6h2/Ea.6K7K9uP4vQvJjK2X8CeeGv73P5GqS3G', 'Raj Sharma', 'parent', 'parent_avatar.png'),
(4, 'ajay@eduerp.in', '$2a$10$tZ2/97G5qL8u5QW6h2/Ea.6K7K9uP4vQvJjK2X8CeeGv73P5GqS3G', 'Mr. Ajay Nair', 'teacher', 'teacher_avatar2.png'),
(5, 'suresh@email.com', '$2a$10$tZ2/97G5qL8u5QW6h2/Ea.6K7K9uP4vQvJjK2X8CeeGv73P5GqS3G', 'Suresh Patel', 'parent', NULL),
(6, 'mohan@email.com', '$2a$10$tZ2/97G5qL8u5QW6h2/Ea.6K7K9uP4vQvJjK2X8CeeGv73P5GqS3G', 'Mohan Kumar', 'parent', NULL),
(7, 'vikram@email.com', '$2a$10$tZ2/97G5qL8u5QW6h2/Ea.6K7K9uP4vQvJjK2X8CeeGv73P5GqS3G', 'Vikram Singh', 'parent', NULL),
(8, 'anil@email.com', '$2a$10$tZ2/97G5qL8u5QW6h2/Ea.6K7K9uP4vQvJjK2X8CeeGv73P5GqS3G', 'Anil Verma', 'parent', NULL);

-- --------------------------------------------------------
-- 2. Parents Table
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS parents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    parent_id_code VARCHAR(50) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    address TEXT,
    last_login VARCHAR(50) DEFAULT '24 Jun 2024',
    notifications ENUM('Enabled', 'Disabled') DEFAULT 'Enabled',
    status ENUM('Active', 'Inactive') DEFAULT 'Active',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

TRUNCATE TABLE parents;
INSERT INTO parents (id, user_id, parent_id_code, phone, address, last_login, notifications, status) VALUES
(1, 3, 'PAR001', '98765 43210', 'Sector 15, Dwarka, New Delhi', '24 Jun 2024', 'Enabled', 'Active'),
(2, 5, 'PAR002', '98123 45678', 'Sector 21, Noida', '23 Jun 2024', 'Enabled', 'Active'),
(3, 6, 'PAR003', '97001 23456', 'Vasant Kunj, New Delhi', '24 Jun 2024', 'Enabled', 'Active'),
(4, 7, 'PAR004', '96543 21098', 'Sector 62, Noida', '20 Jun 2024', 'Disabled', 'Active'),
(5, 8, 'PAR005', '95432 10987', 'Gurugram, Haryana', '22 Jun 2024', 'Enabled', 'Active');

-- --------------------------------------------------------
-- 3. Students Table
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    parent_id INT,
    student_id_code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    class_name VARCHAR(50) NOT NULL,
    roll_no INT NOT NULL,
    mobile VARCHAR(20),
    status ENUM('Active', 'Inactive') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES parents(id) ON DELETE SET NULL
);

TRUNCATE TABLE students;
INSERT INTO students (id, parent_id, student_id_code, name, class_name, roll_no, mobile, status) VALUES
(1, 1, 'STU001', 'Aryan Sharma', '10-A', 1, '98765 43210', 'Active'),
(2, 2, 'STU002', 'Priya Patel', '9-B', 2, '98123 45678', 'Active'),
(3, 3, 'STU003', 'Ravi Kumar', '10-A', 3, '97001 23456', 'Active'),
(4, 4, 'STU004', 'Anjali Singh', '8-C', 4, '96543 21098', 'Active'),
(5, 5, 'STU005', 'Rohit Verma', '10-A', 5, '95432 10987', 'Active');

-- --------------------------------------------------------
-- 4. Teachers Table
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS teachers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    emp_id VARCHAR(50) NOT NULL UNIQUE,
    department VARCHAR(100) NOT NULL,
    classes_assigned VARCHAR(255) NOT NULL,
    qualification VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    status ENUM('Active', 'On Leave', 'Inactive') DEFAULT 'Active',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

TRUNCATE TABLE teachers;
INSERT INTO teachers (id, user_id, emp_id, department, classes_assigned, qualification, phone, status) VALUES
(1, 2, 'EMP2018001', 'Mathematics', '10A, 10B, 9A', 'M.Sc, B.Ed', '98001 23456', 'Active'),
(2, 4, 'EMP2019002', 'Physics', '11A, 11B, 12A', 'M.Sc Physics, B.Ed', '97112 34567', 'Active');

-- --------------------------------------------------------
-- 5. Fees Table
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS fees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    receipt_no VARCHAR(50) NOT NULL UNIQUE,
    date DATE NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    mode ENUM('Online', 'Cheque', 'Cash') NOT NULL,
    status ENUM('Paid', 'Pending', 'Partial') DEFAULT 'Pending',
    billing_period VARCHAR(50) NOT NULL,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

TRUNCATE TABLE fees;
INSERT INTO fees (id, student_id, receipt_no, date, amount, mode, status, billing_period) VALUES
(1, 1, 'RCP-2024-001', '2024-06-15', 12000.00, 'Online', 'Paid', 'Q2 2024'),
(2, 1, 'RCP-2024-002', '2024-03-20', 8000.00, 'Cheque', 'Paid', 'Q1 2024'),
(3, 1, 'RCP-2024-003', '2024-01-10', 8000.00, 'Cash', 'Paid', 'Q1 2024'),
(4, 1, 'RCP-2024-004', '2024-04-05', 7000.00, 'Online', 'Pending', 'Q2 2024');

-- --------------------------------------------------------
-- 6. Attendance Table
-- --------------------------------------------------------
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

TRUNCATE TABLE attendance;
INSERT INTO attendance (student_id, date, status, marked_by_teacher_id) VALUES
(1, '2024-06-24', 'Present', 1),
(2, '2024-06-24', 'Present', 1),
(3, '2024-06-24', 'Present', 1),
(4, '2024-06-24', 'Absent', 1),
(5, '2024-06-24', 'Late', 1);

-- --------------------------------------------------------
-- 7. Homework Table
-- --------------------------------------------------------
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

TRUNCATE TABLE homework;
INSERT INTO homework (id, title, class_name, due_date, status, teacher_id) VALUES
(1, 'Quadratic Equations Ex 4.2', '10-A', '2024-06-28', 'Pending', 1),
(2, 'Trigonometric Identities Project', '10-A', '2024-06-30', 'Pending', 1),
(3, 'Probability Worksheet', '10-A', '2024-07-02', 'Pending', 1),
(4, 'Linear Equations Assignment', '10-A', '2024-06-15', 'Graded', 1);

-- --------------------------------------------------------
-- 8. Exams Table
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS exams (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    class_name VARCHAR(50) NOT NULL,
    exam_date DATE NOT NULL,
    max_marks INT DEFAULT 100
);

TRUNCATE TABLE exams;
INSERT INTO exams (id, name, class_name, exam_date, max_marks) VALUES
(1, 'Term-1 Examinations', '10-A', '2024-05-10', 600);

-- --------------------------------------------------------
-- 9. Exam Results
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS exam_results (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    exam_id INT NOT NULL,
    marks_obtained INT NOT NULL,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE
);

TRUNCATE TABLE exam_results;
INSERT INTO exam_results (student_id, exam_id, marks_obtained) VALUES
(1, 1, 511),
(3, 1, 530),
(5, 1, 490);

-- --------------------------------------------------------
-- 10. Alerts Table
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS alerts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    channel ENUM('SMS', 'Email', 'WhatsApp') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

TRUNCATE TABLE alerts;
INSERT INTO alerts (user_id, title, message, channel, created_at) VALUES
(3, 'Fee Due Reminder', 'Fee for Q3 2024 is due on 30 June 2024. Please pay to avoid late charges.', 'SMS', DATE_SUB(NOW(), INTERVAL 2 HOUR)),
(3, 'Exam Schedule Released', 'Annual examination schedule for 2024 has been published. Check the exam portal.', 'Email', DATE_SUB(NOW(), INTERVAL 1 DAY)),
(3, 'Holiday Notice', 'School will remain closed on 15 Aug 2024 on account of Independence Day.', 'WhatsApp', DATE_SUB(NOW(), INTERVAL 3 DAY));

-- Enable constraints back
SET FOREIGN_KEY_CHECKS = 1;
