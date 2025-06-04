const express = require('express');
const router = express.Router();
const { initiateBuyerSignup } = require('../controllers/otpSignupController');
const { verifyBuyerSignup } = require('../controllers/otpVerifyController');
const { login,getMe } = require('../controllers/authController');
const { authenticateToken } =  require('../middleware/authMiddleware');

router.post('/signup/initiate', initiateBuyerSignup);
router.post('/signup/verify', verifyBuyerSignup);
router.post('/login', login);
router.get('/me', authenticateToken, getMe);

module.exports = router;
