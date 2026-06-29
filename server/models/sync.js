const bcrypt = require('bcryptjs');
const { 
    sequelize, initSequelize, Role, User, Class, Section, Parent, Student, 
    Teacher, Subject, StudentSubject, Attendance, Homework, Assignment, 
    AssignmentSubmission, Exam, ExamTimetable, Mark, Result, Fee, 
    FeePayment, LibraryBook, BookIssue, Vehicle, Route, Event, Notice, 
    Message, Setting, ActivityLog 
} = require('./index');

async function syncAndSeed() {
    console.log("Starting database synchronization and seeding...");
    
    // 1. Initialize DB creation if not exists
    await initSequelize();

    // 2. Sync schema
    await sequelize.sync({ alter: true });
    console.log("Database schema synchronized successfully.");

    // 3. Seed Roles
    const rolesCount = await Role.count();
    if (rolesCount === 0) {
        console.log("Seeding roles...");
        await Role.bulkCreate([
            { id: 1, name: 'admin' },
            { id: 2, name: 'teacher' },
            { id: 3, name: 'parent' },
            { id: 4, name: 'student' }
        ]);
    }

    // 4. Seed Users
    const usersCount = await User.count();
    if (usersCount === 0) {
        console.log("Seeding users...");
        const passwordHash = await bcrypt.hash('password', 10);
        
        await User.bulkCreate([
            { id: 1, email: 'admin@eduerp.in', password: passwordHash, name: 'Amit Gupta', role: 'admin', role_id: 1, profile_pic: 'admin_avatar.png' },
            { id: 2, email: 'teacher@eduerp.in', password: passwordHash, name: 'Mrs. Kavitha Reddy', role: 'teacher', role_id: 2, profile_pic: 'teacher_avatar.png' },
            { id: 3, email: 'parent@eduerp.in', password: passwordHash, name: 'Raj Sharma', role: 'parent', role_id: 3, profile_pic: 'parent_avatar.png' },
            { id: 4, email: 'ajay@eduerp.in', password: passwordHash, name: 'Mr. Ajay Nair', role: 'teacher', role_id: 2, profile_pic: 'teacher_avatar2.png' },
            { id: 5, email: 'suresh@email.com', password: passwordHash, name: 'Suresh Patel', role: 'parent', role_id: 3 },
            { id: 6, email: 'mohan@email.com', password: passwordHash, name: 'Mohan Kumar', role: 'parent', role_id: 3 },
            { id: 7, email: 'vikram@email.com', password: passwordHash, name: 'Vikram Singh', role: 'parent', role_id: 3 },
            { id: 8, email: 'anil@email.com', password: passwordHash, name: 'Anil Verma', role: 'parent', role_id: 3 }
        ]);
    }

    // 5. Seed Parents
    const parentsCount = await Parent.count();
    let parent1, parent2, parent3, parent4, parent5;
    if (parentsCount === 0) {
        console.log("Seeding parents...");
        parent1 = await Parent.create({ id: 1, user_id: 3, father_name: 'Raj Sharma', mother_name: 'Sita Sharma', occupation: 'Business', phone: '98765 43210', email: 'parent@eduerp.in', address: 'Sector 15, Dwarka, New Delhi' });
        parent2 = await Parent.create({ id: 2, user_id: 5, father_name: 'Suresh Patel', mother_name: 'Rita Patel', occupation: 'Engineer', phone: '98123 45678', email: 'suresh@email.com', address: 'Sector 21, Noida' });
        parent3 = await Parent.create({ id: 3, user_id: 6, father_name: 'Mohan Kumar', mother_name: 'Kiran Kumar', occupation: 'Doctor', phone: '97001 23456', email: 'mohan@email.com', address: 'Vasant Kunj, New Delhi' });
        parent4 = await Parent.create({ id: 4, user_id: 7, father_name: 'Vikram Singh', mother_name: 'Pooja Singh', occupation: 'Teacher', phone: '96543 21098', email: 'vikram@email.com', address: 'Sector 62, Noida' });
        parent5 = await Parent.create({ id: 5, user_id: 8, father_name: 'Anil Verma', mother_name: 'Suman Verma', occupation: 'Manager', phone: '95432 10987', email: 'anil@email.com', address: 'Gurugram, Haryana' });
    } else {
        parent1 = await Parent.findByPk(1);
        parent2 = await Parent.findByPk(2);
        parent3 = await Parent.findByPk(3);
        parent4 = await Parent.findByPk(4);
        parent5 = await Parent.findByPk(5);
    }

    // 6. Seed Teachers
    const teachersCount = await Teacher.count();
    let teacher1, teacher2;
    if (teachersCount === 0) {
        console.log("Seeding teachers...");
        teacher1 = await Teacher.create({ id: 1, user_id: 2, teacher_id: 'EMP2018001', name: 'Mrs. Kavitha Reddy', email: 'teacher@eduerp.in', phone: '98001 23456', qualification: 'M.Sc, B.Ed', experience: '8 years', salary: 45000.00, joining_date: '2018-06-01', status: 'Active', photo: 'teacher_avatar.png' });
        teacher2 = await Teacher.create({ id: 2, user_id: 4, teacher_id: 'EMP2019002', name: 'Mr. Ajay Nair', email: 'ajay@eduerp.in', phone: '97112 34567', qualification: 'M.Sc Physics, B.Ed', experience: '6 years', salary: 42000.00, joining_date: '2019-07-15', status: 'Active', photo: 'teacher_avatar2.png' });
    } else {
        teacher1 = await Teacher.findByPk(1);
        teacher2 = await Teacher.findByPk(2);
    }

    // 7. Seed Classes and Sections
    const classesCount = await Class.count();
    let class10, class9, class8;
    if (classesCount === 0) {
        console.log("Seeding classes and sections...");
        class10 = await Class.create({ id: 1, class_name: 'Class 10', class_teacher_id: 1 });
        class9 = await Class.create({ id: 2, class_name: 'Class 9', class_teacher_id: 2 });
        class8 = await Class.create({ id: 3, class_name: 'Class 8', class_teacher_id: 1 });

        // Add 1 to 7 classes for complete Class 1-10 range
        for (let i = 1; i <= 7; i++) {
            await Class.create({ id: i + 3, class_name: `Class ${i}`, class_teacher_id: 1 });
        }

        await Section.bulkCreate([
            { id: 1, section_name: 'A', class_id: 1 },
            { id: 2, section_name: 'B', class_id: 1 },
            { id: 3, section_name: 'A', class_id: 2 },
            { id: 4, section_name: 'B', class_id: 2 },
            { id: 5, section_name: 'C', class_id: 3 }
        ]);
    } else {
        class10 = await Class.findByPk(1);
        class9 = await Class.findByPk(2);
        class8 = await Class.findByPk(3);
    }

    // 8. Seed Students
    const studentsCount = await Student.count();
    let student1, student2, student3, student4, student5;
    if (studentsCount === 0) {
        console.log("Seeding students...");
        student1 = await Student.create({ id: 1, parent_id: 1, admission_number: 'ADM2026001', roll_number: 1, first_name: 'Aryan', last_name: 'Sharma', gender: 'Male', dob: '2010-05-15', class_id: 1, section_id: 1, status: 'Active', email: 'aryan@eduerp.in', phone: '98765 43210', admission_date: '2020-04-10' });
        student2 = await Student.create({ id: 2, parent_id: 2, admission_number: 'ADM2026002', roll_number: 2, first_name: 'Priya', last_name: 'Patel', gender: 'Female', dob: '2011-08-20', class_id: 2, section_id: 4, status: 'Active', email: 'priya@eduerp.in', phone: '98123 45678', admission_date: '2021-04-10' });
        student3 = await Student.create({ id: 3, parent_id: 3, admission_number: 'ADM2026003', roll_number: 3, first_name: 'Ravi', last_name: 'Kumar', gender: 'Male', dob: '2010-12-02', class_id: 1, section_id: 1, status: 'Active', email: 'ravi@eduerp.in', phone: '97001 23456', admission_date: '2020-04-10' });
        student4 = await Student.create({ id: 4, parent_id: 4, admission_number: 'ADM2026004', roll_number: 4, first_name: 'Anjali', last_name: 'Singh', gender: 'Female', dob: '2012-01-25', class_id: 3, section_id: 5, status: 'Active', email: 'anjali@eduerp.in', phone: '96543 21098', admission_date: '2022-04-10' });
        student5 = await Student.create({ id: 5, parent_id: 5, admission_number: 'ADM2026005', roll_number: 5, first_name: 'Rohit', last_name: 'Verma', gender: 'Male', dob: '2010-07-18', class_id: 1, section_id: 2, status: 'Active', email: 'rohit@eduerp.in', phone: '95432 10987', admission_date: '2020-04-10' });
    } else {
        student1 = await Student.findByPk(1);
        student2 = await Student.findByPk(2);
        student3 = await Student.findByPk(3);
        student4 = await Student.findByPk(4);
        student5 = await Student.findByPk(5);
    }

    // 9. Seed Subjects
    const subjectsCount = await Subject.count();
    let subMath, subPhys, subChem, subEnglish;
    if (subjectsCount === 0) {
        console.log("Seeding subjects...");
        subMath = await Subject.create({ id: 1, subject_name: 'Mathematics', subject_code: 'MATH101' });
        subPhys = await Subject.create({ id: 2, subject_name: 'Physics', subject_code: 'PHYS101' });
        subChem = await Subject.create({ id: 3, subject_name: 'Chemistry', subject_code: 'CHEM101' });
        subEnglish = await Subject.create({ id: 4, subject_name: 'English', subject_code: 'ENG101' });

        await StudentSubject.bulkCreate([
            { student_id: 1, subject_id: 1 },
            { student_id: 1, subject_id: 2 },
            { student_id: 1, subject_id: 3 },
            { student_id: 2, subject_id: 1 },
            { student_id: 3, subject_id: 1 },
            { student_id: 4, subject_id: 1 },
            { student_id: 5, subject_id: 1 }
        ]);
    } else {
        subMath = await Subject.findByPk(1);
        subPhys = await Subject.findByPk(2);
        subChem = await Subject.findByPk(3);
        subEnglish = await Subject.findByPk(4);
    }

    // 10. Seed Attendance
    const attCount = await Attendance.count();
    if (attCount === 0) {
        console.log("Seeding attendance...");
        const today = new Date().toISOString().split('T')[0];
        await Attendance.bulkCreate([
            { student_id: 1, date: today, status: 'Present', marked_by_teacher_id: 1 },
            { student_id: 2, date: today, status: 'Present', marked_by_teacher_id: 1 },
            { student_id: 3, date: today, status: 'Present', marked_by_teacher_id: 1 },
            { student_id: 4, date: today, status: 'Absent', marked_by_teacher_id: 1 },
            { student_id: 5, date: today, status: 'Late', marked_by_teacher_id: 1 }
        ]);
    }

    // 11. Seed Fees and Payments
    const feeCount = await Fee.count();
    let fee10;
    if (feeCount === 0) {
        console.log("Seeding fees...");
        fee10 = await Fee.create({ id: 1, class_id: 1, title: 'Annual Tuition Fee', amount: 50000.00, due_date: '2024-06-30', academic_year: '2024-2025' });
        await Fee.create({ id: 2, class_id: 2, title: 'Annual Tuition Fee', amount: 45000.00, due_date: '2024-06-30', academic_year: '2024-2025' });

        await FeePayment.bulkCreate([
            { student_id: 1, fee_id: 1, receipt_no: 'RCP-2024-001', amount_paid: 12000.00, payment_date: '2024-06-15', payment_mode: 'Online', status: 'Paid', invoice_no: 'INV-2024-001' },
            { student_id: 1, fee_id: 1, receipt_no: 'RCP-2024-002', amount_paid: 8000.00, payment_date: '2024-03-20', payment_mode: 'Cheque', status: 'Paid', invoice_no: 'INV-2024-002' },
            { student_id: 1, fee_id: 1, receipt_no: 'RCP-2024-003', amount_paid: 8000.00, payment_date: '2024-01-10', payment_mode: 'Cash', status: 'Paid', invoice_no: 'INV-2024-003' },
            { student_id: 1, fee_id: 1, receipt_no: 'RCP-2024-004', amount_paid: 7000.00, payment_date: '2024-04-05', payment_mode: 'Online', status: 'Pending', invoice_no: 'INV-2024-004' }
        ]);
    }

    // 12. Seed Homework
    const hwCount = await Homework.count();
    if (hwCount === 0) {
        console.log("Seeding homework...");
        await Homework.bulkCreate([
            { id: 1, title: 'Quadratic Equations Ex 4.2', description: 'Complete questions 1 to 5 from Ex 4.2', class_id: 1, section_id: 1, subject_id: 1, due_date: '2024-06-28', teacher_id: 1 },
            { id: 2, title: 'Trigonometric Identities Project', description: 'Chart presentation on trigonometric identities', class_id: 1, section_id: 1, subject_id: 1, due_date: '2024-06-30', teacher_id: 1 },
            { id: 3, title: 'Probability Worksheet', description: 'Solve problems on coin tosses and card decks', class_id: 1, section_id: 1, subject_id: 1, due_date: '2024-07-02', teacher_id: 1 }
        ]);
    }

    // 13. Seed Exams and Results
    const examCount = await Exam.count();
    let exam1;
    if (examCount === 0) {
        console.log("Seeding exams...");
        exam1 = await Exam.create({ id: 1, exam_name: 'Term-1 Examinations', class_id: 1, exam_date: '2024-05-10', max_marks: 600 });
        await Exam.create({ id: 2, exam_name: 'Weekly Mathematics Test', class_id: 1, exam_date: '2024-06-20', max_marks: 50 });
        
        await Mark.bulkCreate([
            { student_id: 1, exam_id: 1, subject_id: 1, marks_obtained: 88, max_marks: 100, grade: 'A', remarks: 'Good job' },
            { student_id: 1, exam_id: 1, subject_id: 2, marks_obtained: 85, max_marks: 100, grade: 'A', remarks: 'Well done' },
            { student_id: 3, exam_id: 1, subject_id: 1, marks_obtained: 92, max_marks: 100, grade: 'A+', remarks: 'Excellent' },
            { student_id: 5, exam_id: 1, subject_id: 1, marks_obtained: 78, max_marks: 100, grade: 'B', remarks: 'Can improve' }
        ]);

        await Result.bulkCreate([
            { student_id: 1, exam_id: 1, total_marks: 511, percentage: 85.16, grade: 'A', rank: 2, status: 'Pass' },
            { student_id: 3, exam_id: 1, total_marks: 530, percentage: 88.33, grade: 'A+', rank: 1, status: 'Pass' },
            { student_id: 5, exam_id: 1, total_marks: 490, percentage: 81.66, grade: 'A', rank: 3, status: 'Pass' }
        ]);
    }

    // 14. Seed Alerts/Announcements
    const alertCount = await Notice.count();
    if (alertCount === 0) {
        console.log("Seeding notifications/notices...");
        await Notice.bulkCreate([
            { id: 1, title: 'Fee Due Reminder', content: 'Fee for Q3 2024 is due on 30 June 2024. Please pay to avoid late charges.', target_role: 'Parent', created_by: 1 },
            { id: 2, title: 'Exam Schedule Released', content: 'Annual examination schedule for 2024 has been published. Check the exam portal.', target_role: 'Parent', created_by: 1 },
            { id: 3, title: 'Holiday Notice', content: 'School will remain closed on 15 Aug 2024 on account of Independence Day.', target_role: 'All', created_by: 1 }
        ]);
    }

    // 15. Seed Library Books
    const libCount = await LibraryBook.count();
    if (libCount === 0) {
        console.log("Seeding library books...");
        await LibraryBook.bulkCreate([
            { id: 1, title: 'Introduction to Calculus', author: 'R. Courant', isbn: '978-0471154549', publisher: 'Wiley', quantity: 15, available_quantity: 12, price: 650.00 },
            { id: 2, title: 'Fundamentals of Physics', author: 'Halliday & Resnick', isbn: '978-1118230718', publisher: 'Wiley', quantity: 20, available_quantity: 20, price: 890.00 },
            { id: 3, title: 'Organic Chemistry', author: 'Morrison & Boyd', isbn: '978-0136436690', publisher: 'Pearson', quantity: 10, available_quantity: 8, price: 750.00 }
        ]);

        await BookIssue.bulkCreate([
            { book_id: 1, student_id: 1, issue_date: '2024-06-10', due_date: '2024-06-25', status: 'Issued' },
            { book_id: 3, student_id: 1, issue_date: '2024-06-12', due_date: '2024-06-27', status: 'Issued' }
        ]);
    }

    // 16. Seed Transport Vehicles and Routes
    const vehicleCount = await Vehicle.count();
    if (vehicleCount === 0) {
        console.log("Seeding transport...");
        await Vehicle.bulkCreate([
            { id: 1, vehicle_no: 'DL-1CA-1234', vehicle_model: 'Tata Starbus', capacity: 40, driver_name: 'Ramesh Singh', driver_phone: '98989 89898', driver_license: 'DL1234567890' },
            { id: 2, vehicle_no: 'DL-1CA-5678', vehicle_model: 'Force Traveler', capacity: 20, driver_name: 'Suresh Kumar', driver_phone: '97979 79797', driver_license: 'DL0987654321' }
        ]);

        await Route.bulkCreate([
            { id: 1, route_name: 'Route 10A (Dwarka)', start_point: 'School Campus', end_point: 'Dwarka Sec-21', pickup_point: 'Dwarka Mor, Sec-12, Sec-21', vehicle_id: 1 },
            { id: 2, route_name: 'Route 10B (Noida)', start_point: 'School Campus', end_point: 'Noida Sec-62', pickup_point: 'Noida Sec-15, Sec-37, Sec-62', vehicle_id: 2 }
        ]);
    }

    // 17. Seed Settings
    const settingsCount = await Setting.count();
    if (settingsCount === 0) {
        console.log("Seeding settings...");
        await Setting.create({
            school_name: 'EduERP International Academy',
            logo: 'logo.png',
            address: 'Vasant Kunj, New Delhi, India',
            phone: '+91 11 2345 6789',
            email: 'info@eduerp.in',
            session: '2024-2025',
            academic_year: '2024-25'
        });
    }

    console.log("Database seeded successfully!");
}

module.exports = { syncAndSeed };
