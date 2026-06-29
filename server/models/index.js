const { Sequelize, DataTypes } = require('sequelize');
const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const dbHost = process.env.DB_HOST || 'localhost';
const dbUser = process.env.DB_USER || 'root';
const dbPassword = process.env.DB_PASSWORD || '';
const dbName = process.env.DB_NAME || 'eduerp_db';

let sequelize;

// Function to ensure database exists and return Sequelize instance
async function initSequelize() {
    try {
        // Create database if not exists
        const connection = await mysql.createConnection({
            host: dbHost,
            user: dbUser,
            password: dbPassword
        });
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
        await connection.end();
        console.log(`Database verified/created: ${dbName}`);
    } catch (err) {
        console.error("Error creating database through raw mysql:", err.message);
    }

    sequelize = new Sequelize(dbName, dbUser, dbPassword, {
        host: dbHost,
        dialect: 'mysql',
        logging: false, // set to console.log to see SQL queries
        define: {
            paranoid: true,
            underscored: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            deletedAt: 'deleted_at'
        }
    });

    return sequelize;
}

// Instantiate immediately so models can be registered, but async database connection will run
sequelize = new Sequelize(dbName, dbUser, dbPassword, {
    host: dbHost,
    dialect: 'mysql',
    logging: false,
    define: {
        paranoid: true,
        underscored: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at'
    }
});

// Define Models
const Role = sequelize.define('Role', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, unique: true, allowNull: false }
}, { tableName: 'roles' });

const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.STRING, allowNull: false }, // fallback string representation
    profile_pic: { type: DataTypes.STRING }
}, { tableName: 'users' });

const Class = sequelize.define('Class', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    class_name: { type: DataTypes.STRING, allowNull: false } // e.g. "Class 10" or "Class 1"
}, { tableName: 'classes' });

const Section = sequelize.define('Section', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    section_name: { type: DataTypes.STRING, allowNull: false } // e.g. "A", "B"
}, { tableName: 'sections' });

const Parent = sequelize.define('Parent', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    father_name: { type: DataTypes.STRING, allowNull: false },
    mother_name: { type: DataTypes.STRING },
    occupation: { type: DataTypes.STRING },
    phone: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING },
    address: { type: DataTypes.TEXT }
}, { tableName: 'parents' });

const Student = sequelize.define('Student', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    admission_number: { type: DataTypes.STRING, unique: true, allowNull: false },
    roll_number: { type: DataTypes.INTEGER, allowNull: false },
    first_name: { type: DataTypes.STRING, allowNull: false },
    last_name: { type: DataTypes.STRING, allowNull: false },
    gender: { type: DataTypes.STRING },
    dob: { type: DataTypes.DATEONLY },
    blood_group: { type: DataTypes.STRING },
    religion: { type: DataTypes.STRING },
    category: { type: DataTypes.STRING },
    phone: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING },
    address: { type: DataTypes.TEXT },
    state: { type: DataTypes.STRING },
    district: { type: DataTypes.STRING },
    city: { type: DataTypes.STRING },
    pin_code: { type: DataTypes.STRING },
    photo: { type: DataTypes.STRING },
    admission_date: { type: DataTypes.DATEONLY },
    status: { type: DataTypes.STRING, defaultValue: 'Active' } // Active, Inactive
}, { tableName: 'students' });

const Teacher = sequelize.define('Teacher', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    teacher_id: { type: DataTypes.STRING, unique: true, allowNull: false }, // Emp ID
    photo: { type: DataTypes.STRING },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: false },
    qualification: { type: DataTypes.STRING },
    experience: { type: DataTypes.STRING },
    salary: { type: DataTypes.DECIMAL(10, 2) },
    joining_date: { type: DataTypes.DATEONLY },
    status: { type: DataTypes.STRING, defaultValue: 'Active' } // Active, Inactive, On Leave
}, { tableName: 'teachers' });
const Subject = sequelize.define('Subject', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    subject_name: { type: DataTypes.STRING, allowNull: false },
    subject_code: { type: DataTypes.STRING, unique: true },
    class_id: { type: DataTypes.INTEGER, allowNull: true }
}, { tableName: 'subjects' });

const StudentSubject = sequelize.define('StudentSubject', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
}, { tableName: 'student_subjects' });

const Attendance = sequelize.define('Attendance', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    date: { type: DataTypes.DATEONLY, allowNull: false },
    status: { type: DataTypes.STRING, allowNull: false } // Present, Absent, Leave, Half Day, Late
}, { tableName: 'attendance' });

const Homework = sequelize.define('Homework', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    due_date: { type: DataTypes.DATEONLY, allowNull: false },
    pdf_url: { type: DataTypes.STRING }
}, { tableName: 'homework' });

const Assignment = sequelize.define('Assignment', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    due_date: { type: DataTypes.DATEONLY, allowNull: false },
    file_url: { type: DataTypes.STRING }
}, { tableName: 'assignments' });

const AssignmentSubmission = sequelize.define('AssignmentSubmission', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    submission_date: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
    file_url: { type: DataTypes.STRING },
    marks: { type: DataTypes.DECIMAL(5, 2) },
    remarks: { type: DataTypes.TEXT }
}, { tableName: 'assignment_submissions' });

const Exam = sequelize.define('Exam', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    exam_name: { type: DataTypes.STRING, allowNull: false },
    exam_date: { type: DataTypes.DATEONLY, allowNull: false },
    max_marks: { type: DataTypes.INTEGER, defaultValue: 100 }
}, { tableName: 'exams' });

const ExamTimetable = sequelize.define('ExamTimetable', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    exam_date: { type: DataTypes.DATEONLY, allowNull: false },
    start_time: { type: DataTypes.STRING },
    end_time: { type: DataTypes.STRING },
    room_no: { type: DataTypes.STRING }
}, { tableName: 'exam_timetable' });

const Mark = sequelize.define('Mark', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    marks_obtained: { type: DataTypes.DECIMAL(5, 2), allowNull: false },
    max_marks: { type: DataTypes.DECIMAL(5, 2), allowNull: false },
    grade: { type: DataTypes.STRING },
    remarks: { type: DataTypes.TEXT }
}, { tableName: 'marks' });

const Result = sequelize.define('Result', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    total_marks: { type: DataTypes.DECIMAL(6, 2) },
    percentage: { type: DataTypes.DECIMAL(5, 2) },
    grade: { type: DataTypes.STRING },
    rank: { type: DataTypes.INTEGER },
    status: { type: DataTypes.STRING } // Pass, Fail
}, { tableName: 'results' });

const Fee = sequelize.define('Fee', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    due_date: { type: DataTypes.DATEONLY, allowNull: false },
    academic_year: { type: DataTypes.STRING }
}, { tableName: 'fees' });

const FeePayment = sequelize.define('FeePayment', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    receipt_no: { type: DataTypes.STRING, unique: true, allowNull: false },
    amount_paid: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    payment_date: { type: DataTypes.DATEONLY, allowNull: false },
    payment_mode: { type: DataTypes.STRING, allowNull: false }, // Online, Cash, Cheque
    status: { type: DataTypes.STRING, defaultValue: 'Paid' }, // Paid, Pending, Partial
    invoice_no: { type: DataTypes.STRING }
}, { tableName: 'fee_payments' });

const LibraryBook = sequelize.define('LibraryBook', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    author: { type: DataTypes.STRING, allowNull: false },
    isbn: { type: DataTypes.STRING },
    publisher: { type: DataTypes.STRING },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    available_quantity: { type: DataTypes.INTEGER, allowNull: false },
    price: { type: DataTypes.DECIMAL(8, 2) }
}, { tableName: 'library_books' });

const BookIssue = sequelize.define('BookIssue', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    issue_date: { type: DataTypes.DATEONLY, allowNull: false },
    due_date: { type: DataTypes.DATEONLY, allowNull: false },
    return_date: { type: DataTypes.DATEONLY },
    fine_amount: { type: DataTypes.DECIMAL(8, 2), defaultValue: 0.00 },
    status: { type: DataTypes.STRING, defaultValue: 'Issued' } // Issued, Returned, Overdue
}, { tableName: 'book_issue' });

const Vehicle = sequelize.define('Vehicle', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    vehicle_no: { type: DataTypes.STRING, unique: true, allowNull: false },
    vehicle_model: { type: DataTypes.STRING },
    capacity: { type: DataTypes.INTEGER },
    driver_name: { type: DataTypes.STRING },
    driver_phone: { type: DataTypes.STRING },
    driver_license: { type: DataTypes.STRING }
}, { tableName: 'vehicles' });

const Route = sequelize.define('Route', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    route_name: { type: DataTypes.STRING, allowNull: false },
    start_point: { type: DataTypes.STRING },
    end_point: { type: DataTypes.STRING },
    pickup_point: { type: DataTypes.STRING }
}, { tableName: 'routes' });

const Event = sequelize.define('Event', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    start_date: { type: DataTypes.DATEONLY, allowNull: false },
    end_date: { type: DataTypes.DATEONLY },
    event_type: { type: DataTypes.STRING }, // Holiday, Event
    location: { type: DataTypes.STRING }
}, { tableName: 'events' });

const Notice = sequelize.define('Notice', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: false },
    target_role: { type: DataTypes.STRING, defaultValue: 'All' } // All, Teacher, Parent
}, { tableName: 'notices' });

const Message = sequelize.define('Message', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    message_text: { type: DataTypes.TEXT, allowNull: false },
    is_read: { type: DataTypes.BOOLEAN, defaultValue: false }
}, { tableName: 'messages' });

const Setting = sequelize.define('Setting', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    school_name: { type: DataTypes.STRING, allowNull: false },
    logo: { type: DataTypes.STRING },
    address: { type: DataTypes.TEXT },
    phone: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING },
    session: { type: DataTypes.STRING },
    academic_year: { type: DataTypes.STRING }
}, { tableName: 'settings' });

const ActivityLog = sequelize.define('ActivityLog', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    action: { type: DataTypes.STRING, allowNull: false },
    details: { type: DataTypes.TEXT },
    ip_address: { type: DataTypes.STRING }
}, { tableName: 'activity_logs' });


// Associations Setup
// User & Role
User.belongsTo(Role, { foreignKey: 'role_id' });
Role.hasMany(User, { foreignKey: 'role_id' });

// User & Parent
Parent.belongsTo(User, { foreignKey: 'user_id' });
User.hasOne(Parent, { foreignKey: 'user_id' });

// User & Teacher
Teacher.belongsTo(User, { foreignKey: 'user_id' });
User.hasOne(Teacher, { foreignKey: 'user_id' });

// User & Student
Student.belongsTo(User, { foreignKey: 'user_id' });
User.hasOne(Student, { foreignKey: 'user_id' });

// Student & Parent
Student.belongsTo(Parent, { foreignKey: 'parent_id' });
Parent.hasMany(Student, { foreignKey: 'parent_id' });

// Class & Section
Section.belongsTo(Class, { foreignKey: 'class_id' });
Class.hasMany(Section, { foreignKey: 'class_id' });

// Class Teacher association
Class.belongsTo(Teacher, { foreignKey: 'class_teacher_id', as: 'classTeacher' });

// Student & Class/Section
Student.belongsTo(Class, { foreignKey: 'class_id' });
Class.hasMany(Student, { foreignKey: 'class_id' });
Student.belongsTo(Section, { foreignKey: 'section_id' });
Section.hasMany(Student, { foreignKey: 'section_id' });

// Student & Subject mapping (Many to Many)
Student.belongsToMany(Subject, { through: StudentSubject, foreignKey: 'student_id' });
Subject.belongsToMany(Student, { through: StudentSubject, foreignKey: 'subject_id' });

// Attendance
Attendance.belongsTo(Student, { foreignKey: 'student_id' });
Student.hasMany(Attendance, { foreignKey: 'student_id' });
Attendance.belongsTo(Teacher, { foreignKey: 'marked_by_teacher_id' });

// Homework
Homework.belongsTo(Class, { foreignKey: 'class_id' });
Homework.belongsTo(Section, { foreignKey: 'section_id' });
Homework.belongsTo(Subject, { foreignKey: 'subject_id' });
Homework.belongsTo(Teacher, { foreignKey: 'teacher_id' });

// Assignment
Assignment.belongsTo(Class, { foreignKey: 'class_id' });
Assignment.belongsTo(Section, { foreignKey: 'section_id' });
Assignment.belongsTo(Subject, { foreignKey: 'subject_id' });
Assignment.belongsTo(Teacher, { foreignKey: 'teacher_id' });

// AssignmentSubmission
AssignmentSubmission.belongsTo(Assignment, { foreignKey: 'assignment_id' });
Assignment.hasMany(AssignmentSubmission, { foreignKey: 'assignment_id' });
AssignmentSubmission.belongsTo(Student, { foreignKey: 'student_id' });
Student.hasMany(AssignmentSubmission, { foreignKey: 'student_id' });

// Exam
Exam.belongsTo(Class, { foreignKey: 'class_id' });

// ExamTimetable
ExamTimetable.belongsTo(Exam, { foreignKey: 'exam_id' });
Exam.hasMany(ExamTimetable, { foreignKey: 'exam_id' });
ExamTimetable.belongsTo(Subject, { foreignKey: 'subject_id' });

// Marks
Mark.belongsTo(Student, { foreignKey: 'student_id' });
Student.hasMany(Mark, { foreignKey: 'student_id' });
Mark.belongsTo(Exam, { foreignKey: 'exam_id' });
Mark.belongsTo(Subject, { foreignKey: 'subject_id' });

// Results
Result.belongsTo(Student, { foreignKey: 'student_id' });
Student.hasMany(Result, { foreignKey: 'student_id' });
Result.belongsTo(Exam, { foreignKey: 'exam_id' });

// Fee & Class
Fee.belongsTo(Class, { foreignKey: 'class_id' });

// Subject & Class
Subject.belongsTo(Class, { foreignKey: 'class_id' });
Class.hasMany(Subject, { foreignKey: 'class_id' });

// FeePayment
FeePayment.belongsTo(Student, { foreignKey: 'student_id' });
Student.hasMany(FeePayment, { foreignKey: 'student_id' });
FeePayment.belongsTo(Fee, { foreignKey: 'fee_id' });
Fee.hasMany(FeePayment, { foreignKey: 'fee_id' });

// BookIssue
BookIssue.belongsTo(LibraryBook, { foreignKey: 'book_id' });
LibraryBook.hasMany(BookIssue, { foreignKey: 'book_id' });
BookIssue.belongsTo(Student, { foreignKey: 'student_id' });
Student.hasMany(BookIssue, { foreignKey: 'student_id' });

// Route & Vehicle
Route.belongsTo(Vehicle, { foreignKey: 'vehicle_id' });
Vehicle.hasMany(Route, { foreignKey: 'vehicle_id' });

// Notice
Notice.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

// Message
Message.belongsTo(User, { as: 'sender', foreignKey: 'sender_id' });
Message.belongsTo(User, { as: 'receiver', foreignKey: 'receiver_id' });

// ActivityLog
ActivityLog.belongsTo(User, { foreignKey: 'user_id' });


module.exports = {
    sequelize,
    initSequelize,
    Role,
    User,
    Class,
    Section,
    Parent,
    Student,
    Teacher,
    Subject,
    StudentSubject,
    Attendance,
    Homework,
    Assignment,
    AssignmentSubmission,
    Exam,
    ExamTimetable,
    Mark,
    Result,
    Fee,
    FeePayment,
    LibraryBook,
    BookIssue,
    Vehicle,
    Route,
    Event,
    Notice,
    Message,
    Setting,
    ActivityLog
};
