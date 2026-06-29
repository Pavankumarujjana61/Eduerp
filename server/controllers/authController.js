const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Parent, Teacher, Student } = require('../models');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'eduerp_secret_key_2026_super_secure';

exports.login = async (req, res) => {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
        return res.status(400).json({ success: false, message: 'Please provide email, password, and role' });
    }

    try {
        const user = await User.findOne({ where: { email } });
        
        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }

        if (user.role !== role) {
            return res.status(400).json({ success: false, message: 'Access denied. Selected role does not match account.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch && password !== user.password) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }

        let roleInfo = {};
        if (role === 'teacher') {
            const teacher = await Teacher.findOne({ where: { email: user.email } });
            if (teacher) roleInfo = teacher.toJSON();
        } else if (role === 'parent') {
            const parent = await Parent.findOne({ where: { email: user.email } });
            if (parent) roleInfo = parent.toJSON();
        } else if (role === 'student') {
            const student = await Student.findOne({ where: { email: user.email } });
            if (student) roleInfo = student.toJSON();
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role, name: user.name },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        return res.json({
            success: true,
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                profile_pic: user.profile_pic,
                ...roleInfo
            }
        });
    } catch (err) {
        console.error("Error logging in:", err);
        return res.status(500).json({ success: false, message: 'Server error during authentication' });
    }
};
