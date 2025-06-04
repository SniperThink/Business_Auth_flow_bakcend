const express = require('express');
const router = express.Router();
const { impersonateBuyer } = require('../controllers/impersonationController');
const {authenticateToken} = require('../middleware/authMiddleware'); // must decode seller JWT

router.post('/impersonate-buyer', authenticateToken, impersonateBuyer);

module.exports = router;
