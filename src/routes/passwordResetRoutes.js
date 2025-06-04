const express = require('express');
const router = express.Router();

const { requestPasswordReset, resetPassword } = require('../controllers/passwordResetController');

router.post('/request', requestPasswordReset);
router.post('/reset', resetPassword);

module.exports = router;
