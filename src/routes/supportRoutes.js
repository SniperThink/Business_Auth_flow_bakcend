const express = require('express');
const router = express.Router();
const { supportLogin } = require('../controllers/supportController');
const { requireSupportRole } = require('../middleware/authMiddleware');

// POST /api/support/login
router.post('/login',requireSupportRole, supportLogin);

module.exports = router;
