const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');
const auth = require('../middleware/auth');

router.get('/dashboard', auth, teacherController.getDashboard);
router.post('/attendance', auth, teacherController.submitAttendance);

// Homework APIs for Teacher
router.get('/homework', auth, teacherController.getHomework);
router.post('/homework', auth, teacherController.addHomework);
router.put('/homework/:id', auth, teacherController.updateHomework);
router.delete('/homework/:id', auth, teacherController.deleteHomework);

// Marks APIs for Teacher
router.get('/marks', auth, teacherController.getMarks);
router.post('/marks', auth, teacherController.addOrUpdateMark);

module.exports = router;
