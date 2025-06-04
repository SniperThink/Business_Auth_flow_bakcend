const express = require('express');
const router = express.Router();
const { addEmployee } = require('../controllers/employeeController');
const {authenticateToken} = require('../middleware/authMiddleware');

router.post('/add', authenticateToken, addEmployee);

module.exports = router;
