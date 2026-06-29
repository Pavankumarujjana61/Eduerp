const { User, Student, Teacher, Class, Attendance, Homework, Exam, Mark, Subject } = require('../models');
const { Op } = require('sequelize');

exports.getDashboard = async (req, res) => {
    if (req.user.role !== 'teacher') {
        return res.status(403).json({ success: false, message: 'Access denied. Teachers only.' });
    }

    try {
        const teacher = await Teacher.findOne({ where: { email: req.user.email } });
        if (!teacher) {
            return res.status(404).json({ success: false, message: 'Teacher record not found' });
        }

        // Get classes assigned to teacher
        const classes = await Class.findAll({ where: { class_teacher_id: teacher.id } });
        const classIds = classes.map(c => c.id);

        let studentCount = 0;
        let homeworkPending = 0;
        let examsCount = 0;
        let studentsList = [];
        let avgAttendanceRate = '100%';

        if (classIds.length > 0) {
            studentCount = await Student.count({ where: { class_id: classIds } });
            homeworkPending = await Homework.count({ where: { teacher_id: teacher.id } });
            examsCount = await Exam.count({ where: { class_id: classIds } });

            const students = await Student.findAll({
                where: { class_id: classIds },
                include: [{ model: Class, attributes: ['class_name'] }],
                order: [['class_id', 'ASC'], ['roll_number', 'ASC']]
            });

            const todayStr = new Date().toISOString().split('T')[0];
            const attendanceRecords = await Attendance.findAll({
                where: { date: todayStr }
            });

            const attendanceMap = {};
            attendanceRecords.forEach(rec => {
                attendanceMap[rec.student_id] = rec.status;
            });

            studentsList = students.map(s => ({
                id: s.id,
                roll_no: s.roll_number,
                admission_no: s.admission_number,
                name: `${s.first_name} ${s.last_name}`,
                class_name: s.Class ? s.Class.class_name : 'N/A',
                status: attendanceMap[s.id] || 'Present'
            }));

            const totalAttendanceCount = await Attendance.count({
                where: {
                    student_id: { [Op.in]: students.map(s => s.id) }
                }
            });
            const presentAttendanceCount = await Attendance.count({
                where: {
                    student_id: { [Op.in]: students.map(s => s.id) },
                    status: 'Present'
                }
            });

            if (totalAttendanceCount > 0) {
                avgAttendanceRate = `${Math.round((presentAttendanceCount / totalAttendanceCount) * 100)}%`;
            }
        }

        res.json({
            success: true,
            teacher: {
                id: teacher.id,
                name: teacher.name,
                department: teacher.qualification ? teacher.qualification.split(',')[0] : 'General',
                phone: teacher.phone,
                email: teacher.email
            },
            stats: {
                myStudents: studentCount,
                studentsSub: `Across ${classes.length} classes`,
                avgAttendance: avgAttendanceRate,
                attendanceSub: 'This week',
                toGrade: homeworkPending,
                toGradeSub: 'Pending homeworks',
                upcomingExams: examsCount,
                upcomingExamsSub: 'Next 2 weeks'
            },
            students: studentsList
        });
    } catch (err) {
        console.error("Teacher dashboard error:", err);
        res.status(500).json({ success: false, message: 'Server error retrieving teacher statistics' });
    }
};

exports.submitAttendance = async (req, res) => {
    if (req.user.role !== 'teacher') {
        return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const { records } = req.body;
    if (!records || !Array.isArray(records)) {
        return res.status(400).json({ success: false, message: 'Invalid records format' });
    }

    try {
        const teacher = await Teacher.findOne({ where: { email: req.user.email } });
        const teacherId = teacher ? teacher.id : null;
        const todayStr = new Date().toISOString().split('T')[0];

        for (const record of records) {
            const { student_id, status } = record;
            
            // Check if record exists
            const existing = await Attendance.findOne({
                where: { student_id, date: todayStr }
            });

            if (existing) {
                existing.status = status;
                existing.marked_by_teacher_id = teacherId;
                await existing.save();
            } else {
                await Attendance.create({
                    student_id,
                    date: todayStr,
                    status,
                    marked_by_teacher_id: teacherId
                });
            }
        }

        res.json({ success: true, message: 'Attendance submitted successfully' });
    } catch (err) {
        console.error("Submit attendance error:", err);
        res.status(500).json({ success: false, message: 'Server error submitting attendance' });
    }
};

// Homework handlers
exports.getHomework = async (req, res) => {
    if (req.user.role !== 'teacher') return res.status(403).json({ success: false, message: 'Denied' });
    try {
        const teacher = await Teacher.findOne({ where: { email: req.user.email } });
        if (!teacher) return res.status(404).json({ success: false, message: 'Teacher profile not found' });
        
        const hwList = await Homework.findAll({
            where: { teacher_id: teacher.id },
            include: [{ model: Class, attributes: ['class_name'] }],
            order: [['id', 'DESC']]
        });
        
        res.json(hwList.map(h => ({
            id: h.id,
            title: h.title,
            due_date: h.due_date,
            description: h.description,
            class_name: h.Class ? h.Class.class_name : 'N/A'
        })));
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.addHomework = async (req, res) => {
    if (req.user.role !== 'teacher') return res.status(403).json({ success: false, message: 'Denied' });
    const { title, due_date, description, class_name } = req.body;
    try {
        const teacher = await Teacher.findOne({ where: { email: req.user.email } });
        if (!teacher) return res.status(404).json({ success: false, message: 'Teacher profile not found' });
        
        const cls = await Class.findOne({ where: { class_name } });
        if (!cls) return res.status(404).json({ success: false, message: 'Class not found' });
        
        if (cls.class_teacher_id !== teacher.id) {
            return res.status(403).json({ success: false, message: 'You are not the designated teacher for this class' });
        }

        const hw = await Homework.create({
            title,
            due_date: due_date || new Date().toISOString().split('T')[0],
            description: description || '',
            class_id: cls.id,
            teacher_id: teacher.id,
            section_id: 1,
            subject_id: 1
        });
        res.status(201).json({ success: true, message: 'Homework added successfully!', data: hw });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.updateHomework = async (req, res) => {
    if (req.user.role !== 'teacher') return res.status(403).json({ success: false, message: 'Denied' });
    const { id } = req.params;
    const { title, due_date, description } = req.body;
    try {
        const teacher = await Teacher.findOne({ where: { email: req.user.email } });
        const hw = await Homework.findByPk(id);
        if (!hw) return res.status(404).json({ success: false, message: 'Homework record not found' });
        
        if (hw.teacher_id !== teacher.id) {
            return res.status(403).json({ success: false, message: 'Not authorized to edit this homework' });
        }
        
        if (title) hw.title = title;
        if (due_date) hw.due_date = due_date;
        if (description !== undefined) hw.description = description;
        await hw.save();
        res.json({ success: true, message: 'Homework assignment updated successfully!' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.deleteHomework = async (req, res) => {
    if (req.user.role !== 'teacher') return res.status(403).json({ success: false, message: 'Denied' });
    const { id } = req.params;
    try {
        const teacher = await Teacher.findOne({ where: { email: req.user.email } });
        const hw = await Homework.findByPk(id);
        if (!hw) return res.status(404).json({ success: false, message: 'Homework record not found' });
        
        if (hw.teacher_id !== teacher.id) {
            return res.status(403).json({ success: false, message: 'Not authorized to delete this homework' });
        }
        await hw.destroy();
        res.json({ success: true, message: 'Homework deleted successfully!' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Marks handlers
exports.getMarks = async (req, res) => {
    if (req.user.role !== 'teacher') return res.status(403).json({ success: false, message: 'Denied' });
    try {
        const teacher = await Teacher.findOne({ where: { email: req.user.email } });
        if (!teacher) return res.status(404).json({ success: false, message: 'Teacher profile not found' });
        
        const classes = await Class.findAll({ where: { class_teacher_id: teacher.id } });
        const classIds = classes.map(c => c.id);

        const students = await Student.findAll({ where: { class_id: classIds } });
        const studentIds = students.map(s => s.id);
        const marks = await Mark.findAll({
            where: { student_id: studentIds },
            include: [
                { 
                    model: Student, 
                    attributes: ['first_name', 'last_name', 'roll_number'],
                    include: [{ model: Class, attributes: ['class_name'] }]
                },
                { model: Subject, attributes: ['subject_name'] },
                { model: Exam, attributes: ['exam_name'] }
            ],
            order: [['id', 'DESC']]
        });

        res.json(marks.map(m => ({
            id: m.id,
            student_name: m.Student ? `${m.Student.first_name} ${m.Student.last_name}` : 'N/A',
            roll_no: m.Student ? m.Student.roll_number : 'N/A',
            class_name: m.Student && m.Student.Class ? m.Student.Class.class_name : 'N/A',
            subject_name: m.Subject ? m.Subject.subject_name : 'N/A',
            exam_name: m.Exam ? m.Exam.exam_name : 'N/A',
            marks_obtained: m.marks_obtained,
            max_marks: m.max_marks,
            grade: m.grade,
            remarks: m.remarks
        })));
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.addOrUpdateMark = async (req, res) => {
    if (req.user.role !== 'teacher') return res.status(403).json({ success: false, message: 'Denied' });
    const { student_name, subject_name, exam_name, marks_obtained, max_marks, grade, remarks } = req.body;
    try {
        const teacher = await Teacher.findOne({ where: { email: req.user.email } });
        if (!teacher) return res.status(404).json({ success: false, message: 'Teacher profile not found' });

        const [firstName, ...lastNameParts] = student_name.split(' ');
        const classes = await Class.findAll({ where: { class_teacher_id: teacher.id } });
        const classIds = classes.map(c => c.id);

        const student = await Student.findOne({
            where: {
                first_name: firstName,
                class_id: classIds
            }
        });
        if (!student) return res.status(404).json({ success: false, message: 'Student not found in your classes' });

        const [subject] = await Subject.findOrCreate({
            where: { subject_name },
            defaults: { subject_name, subject_code: `SUB-${Date.now()}` }
        });

        const [exam] = await Exam.findOrCreate({
            where: { exam_name },
            defaults: { exam_name, exam_date: new Date().toISOString().split('T')[0], max_marks: parseInt(max_marks || 100), class_id: student.class_id }
        });

        let mark = await Mark.findOne({
            where: { student_id: student.id, subject_id: subject.id, exam_id: exam.id }
        });

        if (mark) {
            mark.marks_obtained = parseFloat(marks_obtained);
            mark.max_marks = parseInt(max_marks || 100);
            mark.grade = grade || 'A';
            mark.remarks = remarks || '';
            await mark.save();
        } else {
            mark = await Mark.create({
                student_id: student.id,
                subject_id: subject.id,
                exam_id: exam.id,
                marks_obtained: parseFloat(marks_obtained),
                max_marks: parseInt(max_marks || 100),
                grade: grade || 'A',
                remarks: remarks || ''
            });
        }

        res.status(201).json({ success: true, message: 'Marks updated successfully!', data: mark });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
