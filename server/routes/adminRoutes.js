const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');

router.get('/dashboard', auth, adminController.getDashboard);

// Student CRUD
router.get('/students', auth, adminController.getStudents);
router.post('/students', auth, adminController.addStudent);
router.get('/students/:id', auth, adminController.getStudentDetails);
router.put('/students/:id', auth, adminController.updateStudent);
router.delete('/students/:id', auth, adminController.deleteStudent);

// Teacher CRUD
router.get('/teachers', auth, adminController.getTeachers);
router.post('/teachers', auth, adminController.addTeacher);
router.put('/teachers/:id', auth, adminController.updateTeacher);
router.delete('/teachers/:id', auth, adminController.deleteTeacher);

// Parent CRUD
router.get('/parents', auth, adminController.getParents);
router.post('/parents', auth, adminController.addParent);
router.put('/parents/:id', auth, adminController.updateParent);
router.delete('/parents/:id', auth, adminController.deleteParent);

// Classes CRUD
router.get('/classes', auth, adminController.getClasses);
router.post('/classes', auth, adminController.addClass);
router.put('/classes/:id', auth, adminController.updateClass);
router.delete('/classes/:id', auth, adminController.deleteClass);

// Sections CRUD
router.get('/sections', auth, adminController.getSections);
router.post('/sections', auth, adminController.addSection);
router.put('/sections/:id', auth, adminController.updateSection);
router.delete('/sections/:id', auth, adminController.deleteSection);

// Subjects CRUD
router.get('/subjects', auth, adminController.getSubjects);
router.post('/subjects', auth, adminController.addSubject);
router.put('/subjects/:id', auth, adminController.updateSubject);
router.delete('/subjects/:id', auth, adminController.deleteSubject);

// Fees CRUD
router.get('/fees', auth, adminController.getFees);
router.post('/fees', auth, adminController.addFee);
router.post('/fees/class', auth, adminController.updateClassFee);
router.put('/fees/:id', auth, adminController.updateFee);
router.delete('/fees/:id', auth, adminController.deleteFee);

// Exams CRUD
router.get('/exams', auth, adminController.getExams);
router.post('/exams', auth, adminController.addExam);
router.put('/exams/:id', auth, adminController.updateExam);

// Homeworks CRUD
router.get('/homeworks', auth, adminController.getHomeworks);
router.post('/homeworks', auth, adminController.addHomework);
router.put('/homeworks/:id', auth, adminController.updateHomework);

// Alerts/Notices CRUD
router.get('/alerts', auth, adminController.getAlerts);
router.post('/alerts', auth, adminController.createAlert);

// Library CRUD
router.get('/library', auth, adminController.getLibrary);
router.post('/library', auth, adminController.addLibraryBook);
router.put('/library/:id', auth, adminController.updateLibraryBook);

// Transport CRUD
router.get('/transport', auth, adminController.getTransport);
router.post('/transport', auth, adminController.addRoute);
router.put('/transport/:id', auth, adminController.updateRoute);

// Events CRUD
router.get('/events', auth, adminController.getEvents);
router.post('/events', auth, adminController.addEvent);
router.put('/events/:id', auth, adminController.updateEvent);
router.get('/reports/student', auth, adminController.getStudentReportData);

router.get('/attendance', auth, adminController.getAttendance);
router.post('/attendance', auth, adminController.submitAttendance);

module.exports = router;
