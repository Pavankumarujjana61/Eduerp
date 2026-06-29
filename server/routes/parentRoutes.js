const express = require('express');
const router = express.Router();
const parentController = require('../controllers/parentController');
const auth = require('../middleware/auth');

router.get('/dashboard', auth, parentController.getDashboard);

module.exports = router;
