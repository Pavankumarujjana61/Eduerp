const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const { 
    User, Parent, Student, Teacher, Class, Section, Subject, 
    Attendance, Homework, Exam, Mark, Result, Fee, FeePayment, 
    Notice, Vehicle, Route, Event, Setting, LibraryBook 
} = require('../models');

// GET Dashboard data
exports.getDashboard = async (req, res) => {
    try {
        const studentCount = await Student.count();
        const teacherCount = await Teacher.count();
        const parentCount = await Parent.count();
        const classCount = await Class.count();

        // Fee collection
        const totalPaid = await FeePayment.sum('amount_paid', { where: { status: 'Paid' } }) || 0;
        const totalPending = await FeePayment.sum('amount_paid', { where: { status: 'Pending' } }) || 0;

        // Attendance stats
        const totalAttendance = await Attendance.count();
        const presentAttendance = await Attendance.count({ where: { status: 'Present' } });
        const avgAttendanceRate = totalAttendance > 0 ? ((presentAttendance / totalAttendance) * 100).toFixed(1) : "87.3";

        // New admissions
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0,0,0,0);
        const newAdmissions = await Student.count({ where: { created_at: { [Op.gte]: startOfMonth } } });

        // Notifications sent
        const notificationsCount = await Notice.count();

        res.json({
            success: true,
            stats: {
                totalStudents: studentCount || 1072,
                studentsChange: '+4.5%',
                studentsSub: '48 new this month',
                totalTeachers: teacherCount || 86,
                teachersChange: '+2',
                teachersSub: 'Across all departments',
                totalClasses: classCount || 32,
                classesChange: '12 sections active',
                feeCollected: `Rs. ${(totalPaid / 100000).toFixed(1)}L`,
                feeCollectedChange: '+12%',
                feeCollectedSub: 'This academic year',
                pendingFees: `Rs. ${(totalPending / 100000).toFixed(1)}L`,
                pendingFeesChange: '-8%',
                pendingFeesSub: 'From outstanding dues',
                avgAttendance: `${avgAttendanceRate}%`,
                attendanceChange: '+1.2%',
                attendanceSub: 'This week',
                newAdmissions: newAdmissions || 48,
                admissionsChange: '+15%',
                admissionsSub: 'June 2024',
                notificationsSent: notificationsCount || 1248,
                notificationsChange: '+15%',
                notificationsSub: 'This month'
            },
            feeCollectionChart: [
                { month: 'Jan', collected: 4.2, pending: 2.1 },
                { month: 'Feb', collected: 3.8, pending: 1.8 },
                { month: 'Mar', collected: 5.2, pending: 3.2 },
                { month: 'Apr', collected: 4.6, pending: 2.5 },
                { month: 'May', collected: 4.8, pending: 1.9 },
                { month: 'Jun', collected: totalPaid > 0 ? parseFloat((totalPaid / 100000).toFixed(1)) : 5.5, pending: totalPending > 0 ? parseFloat((totalPending / 100000).toFixed(1)) : 2.5 }
            ],
            attendanceAnalysis: {
                present: totalAttendance > 0 ? Math.round((presentAttendance / totalAttendance) * 100) : 87,
                absent: totalAttendance > 0 ? Math.round((await Attendance.count({ where: { status: 'Absent' } }) / totalAttendance) * 100) : 9,
                late: totalAttendance > 0 ? Math.round((await Attendance.count({ where: { status: 'Late' } }) / totalAttendance) * 100) : 4
            }
        });
    } catch (err) {
        console.error("Dashboard error:", err);
        res.status(500).json({ success: false, message: 'Server error retrieving dashboard statistics' });
    }
};

// STUDENTS CRUD
exports.getStudents = async (req, res) => {
    try {
        const students = await Student.findAll({
            include: [
                { model: Class, attributes: ['class_name'] },
                { model: Parent, attributes: ['father_name', 'phone', 'email'] }
            ],
            order: [['id', 'DESC']]
        });
        
        const mapped = students.map(s => ({
            id: s.id,
            student_id: s.admission_number,
            name: `${s.first_name} ${s.last_name}`,
            email: s.email,
            class_name: s.Class ? s.Class.class_name : 'N/A',
            roll_no: s.roll_number,
            parent_name: s.Parent ? s.Parent.father_name : 'N/A',
            parent_email: s.Parent ? s.Parent.email : 'parent@eduerp.in',
            parent_phone: s.Parent ? s.Parent.phone : '98765 43210',
            mobile: s.phone || (s.Parent ? s.Parent.phone : 'N/A'),
            status: s.status
        }));
        
        res.json(mapped);
    } catch (err) {
        console.error("Get students error:", err);
        res.status(500).json({ success: false, message: 'Server error retrieving students list' });
    }
};

exports.getStudentDetails = async (req, res) => {
    const { id } = req.params;
    try {
        const student = await Student.findByPk(id, {
            include: [
                { model: Class },
                { model: Parent }
            ]
        });
        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }

        const attendance = await Attendance.findAll({
            where: { student_id: student.id },
            order: [['date', 'DESC']]
        });

        const marks = await Mark.findAll({
            where: { student_id: student.id },
            include: [{ model: Subject }, { model: Exam }],
            order: [['id', 'DESC']]
        });

        const fees = await FeePayment.findAll({
            where: { student_id: student.id },
            order: [['payment_date', 'DESC']]
        });

        res.json({
            success: true,
            student: {
                id: student.id,
                name: `${student.first_name} ${student.last_name}`,
                student_id: student.admission_number,
                class_name: student.Class ? student.Class.class_name : 'N/A',
                roll_no: student.roll_number,
                parent_name: student.Parent ? student.Parent.father_name : 'N/A',
                parent_email: student.Parent ? student.Parent.email : 'N/A',
                parent_phone: student.Parent ? student.Parent.phone : 'N/A',
                email: student.email,
                mobile: student.phone || (student.Parent ? student.Parent.phone : 'N/A'),
                status: student.status
            },
            attendance: attendance.map(a => ({
                id: a.id,
                date: a.date,
                status: a.status
            })),
            marks: marks.map(m => ({
                id: m.id,
                exam_name: m.Exam ? m.Exam.exam_name : 'N/A',
                subject_name: m.Subject ? m.Subject.subject_name : 'N/A',
                marks_obtained: m.marks_obtained,
                max_marks: m.max_marks,
                grade: m.grade,
                remarks: m.remarks
            })),
            fees: fees.map(f => ({
                id: f.id,
                receipt_no: f.receipt_no,
                date: f.payment_date,
                amount: f.amount_paid,
                mode: f.payment_mode,
                status: f.status
            }))
        });
    } catch (err) {
        console.error("Get student details error:", err);
        res.status(500).json({ success: false, message: 'Server error retrieving student details' });
    }
};

exports.addStudent = async (req, res) => {
    const { name, email, password, class_name, roll_no, admission_no, parent_name, parent_email, parent_phone } = req.body;
    if (!name || !email || !class_name || !roll_no || !admission_no) {
        return res.status(400).json({ success: false, message: 'Missing required student fields' });
    }

    try {
        const [first_name, ...lastParts] = name.split(' ');
        const last_name = lastParts.join(' ') || 'Student';

        // 1. Parent lookup or creation
        let parent = null;
        if (parent_email) {
            parent = await Parent.findOne({ where: { email: parent_email } });
        }
        if (!parent) {
            let parentUser = await User.findOne({ where: { email: parent_email } });
            if (!parentUser) {
                const defaultPasswordHash = await bcrypt.hash('password', 10);
                parentUser = await User.create({
                    email: parent_email || `parent_${Date.now()}@eduerp.in`,
                    password: defaultPasswordHash,
                    name: parent_name || 'Parent Name',
                    role: 'parent'
                });
            }

            parent = await Parent.create({
                user_id: parentUser.id,
                father_name: parent_name || 'Parent Name',
                phone: parent_phone || '98765 43210',
                email: parent_email || `parent_${Date.now()}@eduerp.in`
            });
        }

        // 2. Class lookup and auto-link to teacher
        let teacherId = 1;
        if (class_name.includes('9')) {
            teacherId = 2;
        }
        let [cls] = await Class.findOrCreate({
            where: { class_name },
            defaults: { class_name, class_teacher_id: teacherId }
        });
        if (!cls.class_teacher_id) {
            cls.class_teacher_id = teacherId;
            await cls.save();
        }

        // Create student user login account
        let user = await User.findOne({ where: { email } });
        if (!user) {
            const passwordHash = await bcrypt.hash(password || 'password123', 10);
            user = await User.create({
                email,
                password: passwordHash,
                name,
                role: 'student'
            });
        }

        const student = await Student.create({
            user_id: user.id,
            parent_id: parent.id,
            admission_number: admission_no,
            roll_number: parseInt(roll_no),
            first_name,
            last_name,
            class_id: cls.id,
            status: 'Active',
            email,
            phone: '98765 43210',
            admission_date: new Date().toISOString().split('T')[0]
        });

        res.status(201).json({ success: true, message: 'Student created successfully!', data: student });
    } catch (err) {
        console.error("Add student error:", err);
        res.status(500).json({ success: false, message: 'Server error adding student' });
    }
};

exports.updateStudent = async (req, res) => {
    const { id } = req.params;
    const { name, email, class_name, roll_no, status, parent_name, parent_email, parent_phone } = req.body;
    try {
        const student = await Student.findByPk(id);
        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }

        if (name) {
            const [first_name, ...lastParts] = name.split(' ');
            student.first_name = first_name;
            student.last_name = lastParts.join(' ') || 'Student';
        }
        if (email) student.email = email;
        if (roll_no) student.roll_number = parseInt(roll_no);
        if (status) student.status = status;

        if (class_name) {
            let teacherId = 1;
            if (class_name.includes('9')) teacherId = 2;
            let [cls] = await Class.findOrCreate({
                where: { class_name },
                defaults: { class_name, class_teacher_id: teacherId }
            });
            if (!cls.class_teacher_id) {
                cls.class_teacher_id = teacherId;
                await cls.save();
            }
            student.class_id = cls.id;
        }

        // Parent update/linking
        if (parent_email) {
            let parent = await Parent.findOne({ where: { email: parent_email } });
            if (!parent) {
                let parentUser = await User.findOne({ where: { email: parent_email } });
                if (!parentUser) {
                    const defaultPasswordHash = await bcrypt.hash('password', 10);
                    parentUser = await User.create({
                        email: parent_email,
                        password: defaultPasswordHash,
                        name: parent_name || 'Parent Name',
                        role: 'parent'
                    });
                }
                parent = await Parent.create({
                    user_id: parentUser.id,
                    father_name: parent_name || 'Parent Name',
                    phone: parent_phone || '98765 43210',
                    email: parent_email
                });
            } else {
                if (parent_name) parent.father_name = parent_name;
                if (parent_phone) parent.phone = parent_phone;
                await parent.save();
            }
            student.parent_id = parent.id;
        }

        await student.save();
        res.json({ success: true, message: 'Student updated successfully!' });
    } catch (err) {
        console.error("Update student error:", err);
        res.status(500).json({ success: false, message: 'Server error updating student' });
    }
};

exports.deleteStudent = async (req, res) => {
    const { id } = req.params;
    try {
        const student = await Student.findByPk(id);
        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }
        await student.destroy();
        res.json({ success: true, message: 'Student deleted successfully!' });
    } catch (err) {
        console.error("Delete student error:", err);
        res.status(500).json({ success: false, message: 'Server error deleting student' });
    }
};

// TEACHERS CRUD
exports.getTeachers = async (req, res) => {
    try {
        const { Class, Section } = require('../models');
        const teachers = await Teacher.findAll({ order: [['id', 'DESC']] });
        const classes = await Class.findAll({
            include: [{ model: Section }]
        });

        const mapped = teachers.map(t => {
            const assignedClasses = classes.filter(c => c.class_teacher_id === t.id);
            const classesString = assignedClasses.map(c => {
                const secStr = c.Sections && c.Sections.length > 0 ? c.Sections.map(s => s.section_name).join('/') : '';
                return secStr ? `${c.class_name}-${secStr}` : c.class_name;
            }).join(', ') || 'None';

            const firstClass = assignedClasses[0];
            const firstSection = firstClass && firstClass.Sections && firstClass.Sections.length > 0 ? firstClass.Sections[0] : null;

            return {
                id: t.id,
                emp_id: t.teacher_id,
                name: t.name,
                email: t.email,
                phone: t.phone,
                department: t.qualification ? t.qualification.split(',')[0] : 'General',
                classes_assigned: classesString,
                assigned_classes: assignedClasses.map(c => c.class_name),
                assigned_section: firstSection ? firstSection.section_name : '',
                qualification: t.qualification || 'M.Sc, B.Ed',
                status: t.status
            };
        });
        res.json(mapped);
    } catch (err) {
        console.error("Get teachers error:", err);
        res.status(500).json({ success: false, message: 'Server error retrieving teachers' });
    }
};

exports.addTeacher = async (req, res) => {
    const { name, email, phone, qualification, emp_id, assigned_classes, assigned_section } = req.body;
    try {
        const { Class, Section } = require('../models');
        let user = await User.findOne({ where: { email } });
        if (!user) {
            const passwordHash = await bcrypt.hash('password123', 10);
            user = await User.create({
                email,
                password: passwordHash,
                name,
                role: 'teacher'
            });
        }

        let teacher = await Teacher.findOne({ where: { email } });
        if (!teacher) {
            teacher = await Teacher.create({
                user_id: user.id,
                teacher_id: emp_id || `EMP${Math.floor(1000 + Math.random() * 9000)}`,
                name,
                email,
                phone: phone || '98000 00000',
                qualification: qualification || 'M.Sc, B.Ed',
                joining_date: new Date().toISOString().split('T')[0],
                status: 'Active'
            });
        } else {
            if (name) teacher.name = name;
            if (phone) teacher.phone = phone;
            if (qualification) teacher.qualification = qualification;
            if (emp_id) teacher.teacher_id = emp_id;
            await teacher.save();
        }

        if (Array.isArray(assigned_classes) && assigned_classes.length > 0) {
            await Class.update({ class_teacher_id: teacher.id }, {
                where: { class_name: { [Op.in]: assigned_classes } }
            });

            if (assigned_section) {
                const assignedCls = await Class.findAll({ where: { class_name: { [Op.in]: assigned_classes } } });
                for (const cls of assignedCls) {
                    await Section.findOrCreate({
                        where: { class_id: cls.id, section_name: assigned_section }
                    });
                }
            }
        }

        res.status(201).json({ success: true, message: 'Teacher added successfully!', data: teacher });
    } catch (err) {
        console.error("Add teacher error:", err);
        res.status(500).json({ success: false, message: 'Server error adding teacher' });
    }
};

exports.updateTeacher = async (req, res) => {
    const { id } = req.params;
    const { name, email, phone, qualification, status, emp_id, assigned_classes, assigned_section } = req.body;
    try {
        const { Class, Section } = require('../models');
        const teacher = await Teacher.findByPk(id);
        if (!teacher) return res.status(404).json({ success: false, message: 'Teacher not found' });

        if (name) teacher.name = name;
        if (email) teacher.email = email;
        if (phone) teacher.phone = phone;
        if (qualification) teacher.qualification = qualification;
        if (status) teacher.status = status;
        if (emp_id) teacher.teacher_id = emp_id;

        await teacher.save();

        await Class.update({ class_teacher_id: null }, { where: { class_teacher_id: teacher.id } });

        if (Array.isArray(assigned_classes) && assigned_classes.length > 0) {
            await Class.update({ class_teacher_id: teacher.id }, {
                where: { class_name: { [Op.in]: assigned_classes } }
            });

            if (assigned_section) {
                const assignedCls = await Class.findAll({ where: { class_name: { [Op.in]: assigned_classes } } });
                for (const cls of assignedCls) {
                    await Section.findOrCreate({
                        where: { class_id: cls.id, section_name: assigned_section }
                    });
                }
            }
        }

        res.json({ success: true, message: 'Teacher updated successfully!' });
    } catch (err) {
        console.error("Update teacher error:", err);
        res.status(500).json({ success: false, message: 'Server error updating teacher' });
    }
};

exports.deleteTeacher = async (req, res) => {
    const { id } = req.params;
    try {
        const teacher = await Teacher.findByPk(id);
        if (!teacher) return res.status(404).json({ success: false, message: 'Teacher not found' });
        await teacher.destroy();
        res.json({ success: true, message: 'Teacher deleted successfully!' });
    } catch (err) {
        console.error("Delete teacher error:", err);
        res.status(500).json({ success: false, message: 'Server error deleting teacher' });
    }
};

// PARENTS CRUD
exports.getParents = async (req, res) => {
    try {
        const parents = await Parent.findAll({
            include: [{ 
                model: Student,
                include: [{ model: Class, attributes: ['class_name'] }]
            }],
            order: [['id', 'DESC']]
        });
        
        const mapped = parents.map(p => {
            const firstChild = p.Students && p.Students.length > 0 ? p.Students[0] : null;
            const childClassName = firstChild && firstChild.Class ? firstChild.Class.class_name : 'N/A';
            return {
                id: p.id,
                parent_id: `PAR${p.id.toString().padStart(3, '0')}`,
                name: p.father_name,
                child_name: firstChild ? `${firstChild.first_name} ${firstChild.last_name}` : 'N/A',
                student_id: firstChild ? `STU${firstChild.id.toString().padStart(3, '0')}` : '',
                class_name: childClassName,
                phone: p.phone,
                email: p.email || 'parent@eduerp.in',
                last_login: '24 Jun 2024',
                notifications: 'Enabled',
                status: 'Active',
                address: p.address || ''
            };
        });
        res.json(mapped);
    } catch (err) {
        console.error("Get parents error:", err);
        res.status(500).json({ success: false, message: 'Server error retrieving parents' });
    }
};

exports.addParent = async (req, res) => {
    const { name, email, phone, address, student_id } = req.body;
    try {
        let student = null;
        if (student_id && student_id.trim()) {
            const match = student_id.match(/\d+/);
            const studentDbId = match ? parseInt(match[0], 10) : null;
            if (studentDbId) {
                student = await Student.findByPk(studentDbId);
            }
            if (!student) {
                student = await Student.findOne({
                    where: {
                        [Op.or]: [
                            { roll_number: student_id },
                            { admission_number: student_id }
                        ]
                    }
                });
            }
            if (!student) {
                return res.status(404).json({ success: false, message: 'Student not found with matching Student ID/roll/admission number' });
            }
        }

        // Check if student already has a parent associated
        let parent = null;
        if (student && student.parent_id) {
            parent = await Parent.findByPk(student.parent_id);
        }

        if (parent) {
            // Update existing parent
            if (name) parent.father_name = name;
            if (phone) parent.phone = phone;
            if (email) parent.email = email;
            if (address) parent.address = address;
            await parent.save();

            // Update associated User details if name or email changed
            const user = await User.findByPk(parent.user_id);
            if (user) {
                if (name) user.name = name;
                if (email) user.email = email;
                await user.save();
            }

            return res.json({ success: true, message: 'Student parent details updated successfully!', data: parent });
        }

        // If no parent is associated yet, create a new one (or use email)
        let user = await User.findOne({ where: { email } });
        if (!user) {
            const passwordHash = await bcrypt.hash('password123', 10);
            user = await User.create({
                email,
                password: passwordHash,
                name,
                role: 'parent'
            });
        }

        parent = await Parent.findOne({ where: { email } });
        if (!parent) {
            parent = await Parent.create({
                user_id: user.id,
                father_name: name,
                phone: phone || '98765 43210',
                email,
                address: address || 'N/A'
            });
        } else {
            if (name) parent.father_name = name;
            if (phone) parent.phone = phone;
            if (address) parent.address = address;
            await parent.save();
        }

        // Link the parent to the student if search returned student
        if (student) {
            student.parent_id = parent.id;
            await student.save();
        }

        res.status(201).json({ success: true, message: 'Parent account created successfully!', data: parent });
    } catch (err) {
        console.error("Add parent error:", err);
        res.status(500).json({ success: false, message: 'Server error adding parent' });
    }
};

exports.updateParent = async (req, res) => {
    const { id } = req.params;
    const { name, email, phone, address, student_id } = req.body;
    try {
        const parent = await Parent.findByPk(id);
        if (!parent) return res.status(404).json({ success: false, message: 'Parent not found' });

        if (name) parent.father_name = name;
        if (email) parent.email = email;
        if (phone) parent.phone = phone;
        if (address) parent.address = address;

        await parent.save();

        if (student_id) {
            let student = null;
            if (student_id.toUpperCase().startsWith('STU')) {
                const numericId = parseInt(student_id.toUpperCase().replace('STU', ''));
                if (!isNaN(numericId)) {
                    student = await Student.findOne({ where: { id: numericId } });
                }
            }
            if (!student) {
                student = await Student.findOne({ where: { admission_number: student_id } });
            }
            if (!student) {
                const parsedInt = parseInt(student_id);
                if (!isNaN(parsedInt)) {
                    student = await Student.findByPk(parsedInt);
                }
            }

            if (student) {
                student.parent_id = parent.id;
                await student.save();
            }
        }

        res.json({ success: true, message: 'Parent updated successfully!' });
    } catch (err) {
        console.error("Update parent error:", err);
        res.status(500).json({ success: false, message: 'Server error updating parent' });
    }
};

exports.deleteParent = async (req, res) => {
    const { id } = req.params;
    try {
        const parent = await Parent.findByPk(id);
        if (!parent) return res.status(404).json({ success: false, message: 'Parent not found' });
        await parent.destroy();
        res.json({ success: true, message: 'Parent deleted successfully!' });
    } catch (err) {
        console.error("Delete parent error:", err);
        res.status(500).json({ success: false, message: 'Server error deleting parent' });
    }
};

// CLASSES CRUD
exports.getClasses = async (req, res) => {
    try {
        const classes = await Class.findAll({
            include: [{ model: Teacher, as: 'classTeacher', attributes: ['name'] }]
        });
        const mapped = classes.map(c => ({
            id: c.id,
            class_name: c.class_name,
            teacher_name: c.classTeacher ? c.classTeacher.name : 'Mrs. Kavitha Reddy'
        }));
        res.json(mapped);
    } catch (err) {
        console.error("Get classes error:", err);
        res.status(500).json({ success: false, message: 'Server error retrieving classes' });
    }
};

exports.addClass = async (req, res) => {
    const { class_name } = req.body;
    try {
        const cls = await Class.create({ class_name, class_teacher_id: 1 });
        res.status(201).json({ success: true, message: 'Class created successfully!', data: cls });
    } catch (err) {
        console.error("Add class error:", err);
        res.status(500).json({ success: false, message: 'Server error creating class' });
    }
};

exports.updateClass = async (req, res) => {
    const { id } = req.params;
    const { class_name } = req.body;
    try {
        const cls = await Class.findByPk(id);
        if (!cls) return res.status(404).json({ success: false, message: 'Class not found' });
        if (class_name) cls.class_name = class_name;
        await cls.save();
        res.json({ success: true, message: 'Class updated successfully!' });
    } catch (err) {
        console.error("Update class error:", err);
        res.status(500).json({ success: false, message: 'Server error updating class' });
    }
};

exports.deleteClass = async (req, res) => {
    try {
        await Class.destroy({ where: { id: req.params.id } });
        res.json({ success: true, message: 'Class deleted successfully!' });
    } catch (err) {
        console.error("Delete class error:", err);
        res.status(500).json({ success: false, message: 'Server error deleting class' });
    }
};

// SECTIONS CRUD
exports.getSections = async (req, res) => {
    try {
        const sections = await Section.findAll({ include: [{ model: Class }] });
        const mapped = sections.map(s => ({
            id: s.id,
            section_name: s.section_name,
            class_name: s.Class ? s.Class.class_name : 'N/A'
        }));
        res.json(mapped);
    } catch (err) {
        console.error("Get sections error:", err);
        res.status(500).json({ success: false, message: 'Server error retrieving sections' });
    }
};

exports.addSection = async (req, res) => {
    const { section_name, class_name } = req.body;
    try {
        let [cls] = await Class.findOrCreate({ where: { class_name }, defaults: { class_name } });
        const sec = await Section.create({ section_name, class_id: cls.id });
        res.status(201).json({ success: true, message: 'Section created successfully!', data: sec });
    } catch (err) {
        console.error("Add section error:", err);
        res.status(500).json({ success: false, message: 'Server error creating section' });
    }
};

exports.updateSection = async (req, res) => {
    const { id } = req.params;
    const { section_name, class_name } = req.body;
    try {
        const sec = await Section.findByPk(id);
        if (!sec) return res.status(404).json({ success: false, message: 'Section not found' });
        if (section_name) sec.section_name = section_name;
        if (class_name) {
            let [cls] = await Class.findOrCreate({ where: { class_name }, defaults: { class_name } });
            sec.class_id = cls.id;
        }
        await sec.save();
        res.json({ success: true, message: 'Section updated successfully!' });
    } catch (err) {
        console.error("Update section error:", err);
        res.status(500).json({ success: false, message: 'Server error updating section' });
    }
};

exports.deleteSection = async (req, res) => {
    try {
        await Section.destroy({ where: { id: req.params.id } });
        res.json({ success: true, message: 'Section deleted successfully!' });
    } catch (err) {
        console.error("Delete section error:", err);
        res.status(500).json({ success: false, message: 'Server error deleting section' });
    }
};
// SUBJECTS CRUD
exports.getSubjects = async (req, res) => {
    try {
        const subjects = await Subject.findAll({
            include: [{ model: Class, attributes: ['class_name'] }],
            order: [['id', 'DESC']]
        });
        const mapped = subjects.map(s => ({
            id: s.id,
            subject_name: s.subject_name,
            subject_code: s.subject_code,
            class_name: s.Class ? s.Class.class_name : 'N/A'
        }));
        res.json(mapped);
    } catch (err) {
        console.error("Get subjects error:", err);
        res.status(500).json({ success: false, message: 'Server error retrieving subjects' });
    }
};

exports.addSubject = async (req, res) => {
    const { subject_name, subject_code, class_name } = req.body;
    try {
        let classId = null;
        if (class_name) {
            const cls = await Class.findOne({ where: { class_name } });
            if (cls) classId = cls.id;
        }
        const sub = await Subject.create({ 
            subject_name, 
            subject_code: subject_code || `SUB-${Date.now()}`,
            class_id: classId
        });
        res.status(201).json({ success: true, message: 'Subject created successfully!', data: sub });
    } catch (err) {
        console.error("Add subject error:", err);
        res.status(500).json({ success: false, message: 'Server error creating subject' });
    }
};

exports.updateSubject = async (req, res) => {
    const { id } = req.params;
    const { subject_name, subject_code, class_name } = req.body;
    try {
        const sub = await Subject.findByPk(id);
        if (!sub) return res.status(404).json({ success: false, message: 'Subject not found' });
        if (subject_name) sub.subject_name = subject_name;
        if (subject_code) sub.subject_code = subject_code;
        if (class_name !== undefined) {
            if (class_name) {
                const cls = await Class.findOne({ where: { class_name } });
                sub.class_id = cls ? cls.id : null;
            } else {
                sub.class_id = null;
            }
        }
        await sub.save();
        res.json({ success: true, message: 'Subject updated successfully!' });
    } catch (err) {
        console.error("Update subject error:", err);
        res.status(500).json({ success: false, message: 'Server error updating subject' });
    }
};

exports.deleteSubject = async (req, res) => {
    try {
        await Subject.destroy({ where: { id: req.params.id } });
        res.json({ success: true, message: 'Subject deleted successfully!' });
    } catch (err) {
        console.error("Delete subject error:", err);
        res.status(500).json({ success: false, message: 'Server error deleting subject' });
    }
};

// FEES CRUD
exports.getFees = async (req, res) => {
    try {
        const students = await Student.findAll({
            include: [{ model: Class }, { model: Parent }]
        });
        
        const payments = await FeePayment.findAll({
            include: [{ model: Student, include: [Class] }, { model: Fee }],
            order: [['payment_date', 'DESC']]
        });

        // Get class fees
        const classFees = await Fee.findAll();

        const studentSummaries = students.map(s => {
            const classFee = classFees.find(f => f.class_id === s.class_id);
            const totalFee = classFee ? parseFloat(classFee.amount) : 45000.00;

            const studentPayments = payments.filter(p => p.student_id === s.id && p.status === 'Paid');
            const paidFee = studentPayments.reduce((acc, curr) => acc + parseFloat(curr.amount_paid), 0);
            const pendingFee = Math.max(0, totalFee - paidFee);

            return {
                id: s.id,
                student_id: s.admission_number,
                name: `${s.first_name} ${s.last_name}`,
                class_name: s.Class ? s.Class.class_name : 'N/A',
                class_id: s.class_id,
                parent_name: s.Parent ? s.Parent.father_name : 'N/A',
                total_fee: totalFee,
                paid_fee: paidFee,
                pending_fee: pendingFee
            };
        });

        const paymentsMapped = payments.map(p => ({
            id: p.id,
            student_id: p.Student ? p.Student.admission_number : 'N/A',
            student_name: p.Student ? `${p.Student.first_name} ${p.Student.last_name}` : 'N/A',
            class_name: p.Student && p.Student.Class ? p.Student.Class.class_name : 'N/A',
            receipt_no: p.receipt_no,
            date: p.payment_date,
            amount: p.amount_paid,
            mode: p.payment_mode,
            status: p.status
        }));

        res.json({
            success: true,
            students: studentSummaries,
            payments: paymentsMapped
        });
    } catch (err) {
        console.error("Get fees error:", err);
        res.status(500).json({ success: false, message: 'Server error retrieving fees' });
    }
};

exports.addFee = async (req, res) => {
    const { student_id, receipt_no, amount, mode, status, date } = req.body;
    try {
        const student = await Student.findByPk(student_id);
        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }
        
        let fee = await Fee.findOne({ where: { class_id: student.class_id || 1 } });
        if (!fee) {
            fee = await Fee.create({
                class_id: student.class_id || 1,
                title: 'Annual Tuition Fee',
                amount: 45000.00,
                due_date: new Date().toISOString().split('T')[0],
                academic_year: '2024-2025'
            });
        }
        
        const payment = await FeePayment.create({
            student_id: student.id,
            fee_id: fee.id,
            receipt_no: receipt_no || `RCP-${Date.now()}`,
            amount_paid: parseFloat(amount),
            payment_date: date || new Date().toISOString().split('T')[0],
            payment_mode: mode || 'Online',
            status: status || 'Paid'
        });

        res.status(201).json({ success: true, message: 'Fee record added successfully!', data: payment });
    } catch (err) {
        console.error("Add fee error:", err);
        res.status(500).json({ success: false, message: 'Server error saving fee payment record' });
    }
};

exports.updateFee = async (req, res) => {
    const { id } = req.params;
    const { receipt_no, amount, mode, status, date } = req.body;
    try {
        const payment = await FeePayment.findByPk(id);
        if (!payment) return res.status(404).json({ success: false, message: 'Fee record not found' });
        if (receipt_no) payment.receipt_no = receipt_no;
        if (amount) payment.amount_paid = parseFloat(amount);
        if (mode) payment.payment_mode = mode;
        if (status) payment.status = status;
        if (date) payment.payment_date = date;
        await payment.save();
        res.json({ success: true, message: 'Fee payment updated successfully!' });
    } catch (err) {
        console.error("Update fee error:", err);
        res.status(500).json({ success: false, message: 'Server error updating fee payment record' });
    }
};

exports.deleteFee = async (req, res) => {
    const { id } = req.params;
    try {
        const payment = await FeePayment.findByPk(id);
        if (!payment) return res.status(404).json({ success: false, message: 'Fee record not found' });
        await payment.destroy();
        res.json({ success: true, message: 'Fee payment deleted successfully!' });
    } catch (err) {
        console.error("Delete fee error:", err);
        res.status(500).json({ success: false, message: 'Server error deleting fee payment' });
    }
};

exports.updateClassFee = async (req, res) => {
    const { class_id, amount } = req.body;
    try {
        let fee = await Fee.findOne({ where: { class_id } });
        if (fee) {
            fee.amount = parseFloat(amount);
            await fee.save();
        } else {
            fee = await Fee.create({
                class_id,
                title: 'Annual Tuition Fee',
                amount: parseFloat(amount),
                due_date: new Date().toISOString().split('T')[0],
                academic_year: '2024-2025'
            });
        }
        res.json({ success: true, message: 'Class fee updated successfully!', data: fee });
    } catch (err) {
        console.error("Update class fee error:", err);
        res.status(500).json({ success: false, message: 'Server error updating class fee' });
    }
};

// EXAMS CRUD
exports.getExams = async (req, res) => {
    try {
        const exams = await Exam.findAll({
            include: [{ model: Class, attributes: ['class_name'] }],
            order: [['exam_date', 'DESC']]
        });
        const mapped = exams.map(e => ({
            id: e.id,
            name: e.exam_name,
            class_name: e.Class ? e.Class.class_name : 'N/A',
            exam_date: e.exam_date,
            max_marks: e.max_marks
        }));
        res.json(mapped);
    } catch (err) {
        console.error("Get exams error:", err);
        res.status(500).json({ success: false, message: 'Server error retrieving exams' });
    }
};

exports.addExam = async (req, res) => {
    const { name, exam_date, max_marks, class_name } = req.body;
    try {
        let classId = 1; // Fallback
        if (class_name) {
            const cls = await Class.findOne({ where: { class_name } });
            if (cls) {
                classId = cls.id;
            }
        }
        const exam = await Exam.create({
            exam_name: name,
            exam_date: exam_date || new Date().toISOString().split('T')[0],
            max_marks: parseInt(max_marks || 100),
            class_id: classId
        });
        res.status(201).json({ success: true, message: 'Exam timetable created successfully!', data: exam });
    } catch (err) {
        console.error("Add exam error:", err);
        res.status(500).json({ success: false, message: 'Server error adding exam' });
    }
};

exports.updateExam = async (req, res) => {
    const { id } = req.params;
    const { name, exam_date, max_marks } = req.body;
    try {
        const exam = await Exam.findByPk(id);
        if (!exam) return res.status(404).json({ success: false, message: 'Exam not found' });
        if (name) exam.exam_name = name;
        if (exam_date) exam.exam_date = exam_date;
        if (max_marks) exam.max_marks = parseInt(max_marks);
        await exam.save();
        res.json({ success: true, message: 'Exam timetable updated successfully!' });
    } catch (err) {
        console.error("Update exam error:", err);
        res.status(500).json({ success: false, message: 'Server error updating exam timetable' });
    }
};

// HOMEWORKS CRUD
exports.getHomeworks = async (req, res) => {
    try {
        const hw = await Homework.findAll({
            include: [{ model: Teacher }],
            order: [['due_date', 'DESC']]
        });
        
        const mapped = hw.map(h => ({
            id: h.id,
            title: h.title,
            class_name: '10-A',
            due_date: h.due_date,
            status: 'Pending',
            teacher_name: h.Teacher ? h.Teacher.name : 'Mrs. Kavitha Reddy',
            description: h.description || ''
        }));
        res.json(mapped);
    } catch (err) {
        console.error("Get homework error:", err);
        res.status(500).json({ success: false, message: 'Server error retrieving homework list' });
    }
};

exports.addHomework = async (req, res) => {
    const { title, due_date, description } = req.body;
    try {
        const hw = await Homework.create({
            title,
            due_date: due_date || new Date().toISOString().split('T')[0],
            description: description || '',
            teacher_id: 1,
            class_id: 1,
            section_id: 1,
            subject_id: 1
        });
        res.status(201).json({ success: true, message: 'Homework assignments updated successfully!', data: hw });
    } catch (err) {
        console.error("Add homework error:", err);
        res.status(500).json({ success: false, message: 'Server error adding homework assignment' });
    }
};

exports.updateHomework = async (req, res) => {
    const { id } = req.params;
    const { title, due_date, description } = req.body;
    try {
        const hw = await Homework.findByPk(id);
        if (!hw) return res.status(404).json({ success: false, message: 'Homework not found' });
        if (title) hw.title = title;
        if (due_date) hw.due_date = due_date;
        if (description !== undefined) hw.description = description;
        await hw.save();
        res.json({ success: true, message: 'Homework assignment updated successfully!' });
    } catch (err) {
        console.error("Update homework error:", err);
        res.status(500).json({ success: false, message: 'Server error updating homework assignment' });
    }
};

// NOTIFICATIONS/ALERTS CRUD
exports.getAlerts = async (req, res) => {
    try {
        const notices = await Notice.findAll({ order: [['id', 'DESC']] });
        const mapped = notices.map(n => ({
            id: n.id,
            title: n.title,
            message: n.content,
            channel: n.target_role === 'Parent' ? 'SMS' : 'WhatsApp',
            created_at: n.created_at
        }));
        res.json(mapped);
    } catch (err) {
        console.error("Get alerts error:", err);
        res.status(500).json({ success: false, message: 'Server error retrieving alerts' });
    }
};

exports.createAlert = async (req, res) => {
    const { title, message, channel } = req.body;
    try {
        const notice = await Notice.create({
            title,
            content: message,
            target_role: 'All',
            created_by: 1
        });
        res.status(201).json({ success: true, message: 'Alert broadcasted successfully!', data: notice });
    } catch (err) {
        console.error("Create alert error:", err);
        res.status(500).json({ success: false, message: 'Server error broadcasting alert notice' });
    }
};

// Library CRUD
exports.getLibrary = async (req, res) => {
    try {
        const books = await LibraryBook.findAll();
        res.json(books);
    } catch (err) {
        console.error("Get library error:", err);
        res.status(500).json({ success: false, message: 'Server error retrieving library books' });
    }
};

exports.addLibraryBook = async (req, res) => {
    const { title, author, isbn, quantity } = req.body;
    try {
        const qty = parseInt(quantity || 10);
        const book = await LibraryBook.create({
            title, author, isbn, quantity: qty, available_quantity: qty
        });
        res.status(201).json({ success: true, message: 'Book added to library successfully!', data: book });
    } catch (err) {
        console.error("Add library book error:", err);
        res.status(500).json({ success: false, message: 'Server error adding library book' });
    }
};

exports.updateLibraryBook = async (req, res) => {
    const { id } = req.params;
    const { title, author, isbn, quantity } = req.body;
    try {
        const book = await LibraryBook.findByPk(id);
        if (!book) return res.status(404).json({ success: false, message: 'Book not found' });
        if (title) book.title = title;
        if (author) book.author = author;
        if (isbn) book.isbn = isbn;
        if (quantity) {
            const qty = parseInt(quantity);
            book.quantity = qty;
            book.available_quantity = qty;
        }
        await book.save();
        res.json({ success: true, message: 'Book updated successfully!' });
    } catch (err) {
        console.error("Update library book error:", err);
        res.status(500).json({ success: false, message: 'Server error updating library book' });
    }
};

// Transport CRUD
exports.getTransport = async (req, res) => {
    try {
        const routes = await Route.findAll({ include: [{ model: Vehicle }] });
        const mapped = routes.map(r => ({
            id: r.id,
            route_name: r.route_name,
            driver_name: r.Vehicle ? r.Vehicle.driver_name : 'N/A',
            vehicle_no: r.Vehicle ? r.Vehicle.vehicle_no : 'N/A',
            pickup_point: r.pickup_point
        }));
        res.json(mapped);
    } catch (err) {
        console.error("Get transport error:", err);
        res.status(500).json({ success: false, message: 'Server error retrieving transport routes' });
    }
};

exports.addRoute = async (req, res) => {
    const { route_name, driver_name, vehicle_no, pickup_point } = req.body;
    try {
        let vehicle = await Vehicle.findOne({ where: { vehicle_no } });
        if (!vehicle) {
            vehicle = await Vehicle.create({
                vehicle_no,
                driver_name,
                driver_phone: '98989 89898'
            });
        }
        const route = await Route.create({
            route_name,
            pickup_point,
            vehicle_id: vehicle.id
        });
        res.status(201).json({ success: true, message: 'Transport route created successfully!', data: route });
    } catch (err) {
        console.error("Add route error:", err);
        res.status(500).json({ success: false, message: 'Server error creating transport route' });
    }
};

exports.updateRoute = async (req, res) => {
    const { id } = req.params;
    const { route_name, driver_name, vehicle_no, pickup_point } = req.body;
    try {
        const route = await Route.findByPk(id);
        if (!route) return res.status(404).json({ success: false, message: 'Route not found' });
        if (route_name) route.route_name = route_name;
        if (pickup_point) route.pickup_point = pickup_point;
        if (vehicle_no) {
            let vehicle = await Vehicle.findOne({ where: { vehicle_no } });
            if (!vehicle) {
                vehicle = await Vehicle.create({
                    vehicle_no,
                    driver_name: driver_name || 'Driver Name',
                    driver_phone: '98989 89898'
                });
            } else {
                if (driver_name) {
                    vehicle.driver_name = driver_name;
                    await vehicle.save();
                }
            }
            route.vehicle_id = vehicle.id;
        }
        await route.save();
        res.json({ success: true, message: 'Transport route updated successfully!' });
    } catch (err) {
        console.error("Update route error:", err);
        res.status(500).json({ success: false, message: 'Server error updating transport route' });
    }
};

// Events CRUD
exports.getEvents = async (req, res) => {
    try {
        const events = await Event.findAll({ order: [['start_date', 'ASC']] });
        res.json(events);
    } catch (err) {
        console.error("Get events error:", err);
        res.status(500).json({ success: false, message: 'Server error retrieving events' });
    }
};
exports.addEvent = async (req, res) => {
    const { title, start_date, event_type, description } = req.body;
    try {
        const ev = await Event.create({
            title,
            start_date: start_date || new Date().toISOString().split('T')[0],
            event_type: event_type || 'Event',
            description: description || ''
        });

        // Auto-create matching notice broadcast
        await Notice.create({
            title: `New Event: ${title}`,
            content: `Event Date: ${start_date || new Date().toISOString().split('T')[0]}. Description: ${description || 'No description provided.'}`,
            target_role: 'All'
        });

        res.status(201).json({ success: true, message: 'School event added successfully!', data: ev });
    } catch (err) {
        console.error("Add event error:", err);
        res.status(500).json({ success: false, message: 'Server error adding school event' });
    }
};

exports.updateEvent = async (req, res) => {
    const { id } = req.params;
    const { title, start_date, event_type, description } = req.body;
    try {
        const ev = await Event.findByPk(id);
        if (!ev) return res.status(404).json({ success: false, message: 'Event not found' });
        if (title) ev.title = title;
        if (start_date) ev.start_date = start_date;
        if (event_type) ev.event_type = event_type;
        if (description !== undefined) ev.description = description;
        await ev.save();
        res.json({ success: true, message: 'School event updated successfully!' });
    } catch (err) {
        console.error("Update event error:", err);
        res.status(500).json({ success: false, message: 'Server error updating school event' });
    }
};

exports.getStudentReportData = async (req, res) => {
    if (req.user.role !== 'admin' && req.user.role !== 'teacher') {
        return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const { studentId } = req.query;
    if (!studentId) {
        return res.status(400).json({ success: false, message: 'Student ID query parameter is required' });
    }

    try {
        // Parse ID number if formatted as STU009 or similar
        const match = studentId.match(/\d+/);
        const id = match ? parseInt(match[0], 10) : null;

        let student = null;
        if (id) {
            student = await Student.findOne({ where: { id }, include: [{ model: Class }] });
        }
        if (!student) {
            student = await Student.findOne({
                where: {
                    [Op.or]: [
                        { roll_number: studentId },
                        { admission_number: studentId }
                    ]
                },
                include: [{ model: Class }]
            });
        }

        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found with matching ID, roll number, or admission number' });
        }

        // Fetch logs
        const attendance = await Attendance.findAll({
            where: { student_id: student.id },
            order: [['date', 'DESC']]
        });

        const payments = await FeePayment.findAll({
            where: { student_id: student.id },
            order: [['payment_date', 'DESC']]
        });

        const marks = await Mark.findAll({
            where: { student_id: student.id },
            include: [
                { model: Subject, attributes: ['subject_name', 'subject_code'] },
                { model: Exam, attributes: ['exam_name'] }
            ],
            order: [['id', 'DESC']]
        });

        res.json({
            success: true,
            student: {
                id: student.id,
                displayId: `STU${String(student.id).padStart(3, '0')}`,
                name: `${student.first_name} ${student.last_name}`,
                class_name: student.Class ? student.Class.class_name : 'N/A',
                roll_no: student.roll_number,
                admission_no: student.admission_number
            },
            attendance: attendance.map(a => ({
                date: a.date,
                status: a.status
            })),
            fees: payments.map(p => ({
                receipt_no: p.receipt_no,
                date: p.payment_date,
                amount: p.amount_paid,
                mode: p.payment_mode,
                status: p.status
            })),
            marks: marks.map(m => ({
                exam_name: m.Exam ? m.Exam.exam_name : 'N/A',
                subject_name: m.Subject ? m.Subject.subject_name : 'N/A',
                marks_obtained: m.marks_obtained,
                max_marks: m.max_marks,
                grade: m.grade,
                remarks: m.remarks
            }))
        });
    } catch (err) {
        console.error("Get student report data error:", err);
        res.status(500).json({ success: false, message: 'Server error compiling student report data' });
    }
};

exports.getAttendance = async (req, res) => {
    if (req.user.role !== 'admin' && req.user.role !== 'teacher') {
        return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const { date } = req.query;
    try {
        const todayStr = date || new Date().toISOString().split('T')[0];
        const records = await Attendance.findAll({
            where: { date: todayStr }
        });
        res.json(records);
    } catch (err) {
        console.error("Get attendance error:", err);
        res.status(500).json({ success: false, message: 'Server error retrieving attendance records' });
    }
};

exports.submitAttendance = async (req, res) => {
    if (req.user.role !== 'admin' && req.user.role !== 'teacher') {
        return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const { records, date } = req.body;
    if (!records || !Array.isArray(records)) {
        return res.status(400).json({ success: false, message: 'Invalid records format' });
    }

    try {
        const todayStr = date || new Date().toISOString().split('T')[0];

        for (const record of records) {
            const { student_id, status } = record;
            
            const existing = await Attendance.findOne({
                where: { student_id, date: todayStr }
            });

            if (existing) {
                existing.status = status;
                await existing.save();
            } else {
                await Attendance.create({
                    student_id,
                    date: todayStr,
                    status
                });
            }
        }

        res.json({ success: true, message: 'Attendance submitted successfully!' });
    } catch (err) {
        console.error("Submit attendance error:", err);
        res.status(500).json({ success: false, message: 'Server error submitting attendance' });
    }
};
