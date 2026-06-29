const { Op } = require('sequelize');
const { User, Parent, Student, Class, Attendance, Homework, FeePayment, Fee, Mark, Result, Notice, Subject, Exam } = require('../models');

exports.getDashboard = async (req, res) => {
    if (req.user.role !== 'parent' && req.user.role !== 'student') {
        return res.status(403).json({ success: false, message: 'Access denied. Parents/Students only.' });
    }

    try {
        let student = null;

        if (req.user.role === 'student') {
            student = await Student.findOne({
                where: { email: req.user.email },
                include: [{ model: Class }]
            });
        } else {
            const parent = await Parent.findOne({ where: { email: req.user.email } });
            if (parent) {
                student = await Student.findOne({
                    where: { parent_id: parent.id },
                    include: [{ model: Class }]
                });
            }
        }

        if (!student) {
            return res.status(404).json({ success: false, message: 'Student record not found for this user.' });
        }

        // 1. Fee Stats
        const classFeeRecord = await Fee.findOne({ where: { class_id: student.class_id || 1 } });
        const totalFeeAmount = classFeeRecord ? parseFloat(classFeeRecord.amount) : 45000.00;

        const paidPayments = await FeePayment.findAll({
            where: { student_id: student.id, status: 'Paid' }
        });
        const paidFeeSum = paidPayments.reduce((acc, curr) => acc + parseFloat(curr.amount_paid), 0);
        const pendingFeeSum = Math.max(0, totalFeeAmount - paidFeeSum);
        const nextDueDate = classFeeRecord ? classFeeRecord.due_date : '2024-06-30';

        // 2. Attendance Stats
        const totalDays = await Attendance.count({ where: { student_id: student.id } });
        const presentDays = await Attendance.count({ where: { student_id: student.id, status: 'Present' } });
        const attendancePct = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 100;

        // 3. Latest Result
        const latestResult = await Result.findOne({
            where: { student_id: student.id },
            include: [{ model: Exam }],
            order: [['id', 'DESC']]
        });
        const latestScore = latestResult ? `${latestResult.total_marks}/600` : 'N/A';
        const latestScoreRank = latestResult && latestResult.rank ? `Rank: ${latestResult.rank} in class` : 'N/A';

        // 4. Pending Homework
        const pendingHw = await Homework.count({
            where: { class_id: student.class_id }
        });

        // 5. Notices / Alerts List
        const notices = await Notice.findAll({
            where: {
                [Op.or]: [
                    { target_role: 'All' },
                    { target_role: 'Parent' }
                ]
            },
            order: [['id', 'DESC']]
        });

        const alertsList = notices.map(n => ({
            title: n.title,
            message: n.content,
            channel: n.target_role === 'Parent' ? 'SMS' : 'WhatsApp',
            time: n.created_at
        }));

        // 6. Child Specific Data Lists for Tabs
        const feesList = await FeePayment.findAll({
            where: { student_id: student.id },
            order: [['payment_date', 'DESC']]
        });

        const attendanceList = await Attendance.findAll({
            where: { student_id: student.id },
            order: [['date', 'DESC']]
        });

                const marksList = await Mark.findAll({
            where: { student_id: student.id },
            include: [{ model: Exam }, { model: Subject }],
            order: [['id', 'DESC']]
        });
        const homeworkList = await Homework.findAll({
            where: { class_id: student.class_id || 1 },
            order: [['due_date', 'DESC']]
        });

        const subjectsList = await Subject.findAll({
            where: { class_id: student.class_id || 1 },
            order: [['subject_name', 'ASC']]
        });

        const examsList = await Exam.findAll({
            where: { class_id: student.class_id || 1 },
            order: [['exam_date', 'DESC']]
        });

        res.json({
            success: true,
            child: {
                id: student.id,
                name: `${student.first_name} ${student.last_name}`,
                class_name: student.Class ? student.Class.class_name : 'N/A',
                roll_no: student.roll_number,
                admission_no: student.admission_number,
                profile_pic: student.photo || 'student_avatar.png'
            },
            stats: {
                totalFee: totalFeeAmount,
                paidFee: paidFeeSum,
                pendingFee: pendingFeeSum,
                feeDueDate: nextDueDate,
                attendancePct,
                attendanceDays: `${presentDays} / ${totalDays || 0} days`,
                latestScore,
                latestScoreRank,
                pendingHw,
                completedHw: 0
            },
            alerts: alertsList,
            fees: feesList.map(f => ({
                id: f.id,
                receipt_no: f.receipt_no,
                date: f.payment_date,
                amount: f.amount_paid,
                mode: f.payment_mode,
                status: f.status
            })),
            attendance: attendanceList.map(a => ({
                id: a.id,
                date: a.date,
                status: a.status
            })),
            results: marksList.map(m => ({
                id: m.id,
                exam_name: m.Exam ? m.Exam.exam_name : 'Term Exam',
                subject_name: m.Subject ? m.Subject.subject_name : 'N/A',
                marks_obtained: m.marks_obtained,
                max_marks: m.max_marks,
                grade: m.grade,
                remarks: m.remarks
            })),
            homeworks: homeworkList.map(h => ({
                id: h.id,
                title: h.title,
                class_name: student.Class ? student.Class.class_name : 'N/A',
                due_date: h.due_date,
                description: h.description
            })),
            subjects: subjectsList.map(sub => ({
                id: sub.id,
                subject_name: sub.subject_name,
                subject_code: sub.subject_code
            })),
            exams: examsList.map(e => ({
                id: e.id,
                name: e.exam_name,
                exam_date: e.exam_date,
                max_marks: e.max_marks
            }))
        });

    } catch (err) {
        console.error("Parent portal dashboard error:", err);
        res.status(500).json({ success: false, message: 'Server error retrieving parent dashboard statistics' });
    }
};
