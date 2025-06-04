const { pool } = require('../database/db');
const bcrypt = require('bcrypt');
const sendEmail = require('../utils/mailer');

async function initiateBuyerSignup(req, res) {
  try {
const { email, password, businessName } = req.body;

if (!email || !password || !businessName) {
  return res.status(400).json({ message: 'Email, password, and business name are required' });
}

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query('DELETE FROM pending_users WHERE email = $1', [email]);

  await pool.query(
  `INSERT INTO pending_users (email, password_hash, business_name, otp) 
   VALUES ($1, $2, $3, $4)`,
  [email, hashedPassword, businessName, otp]
);


    await sendEmail({
      to: email,
      subject: 'Your OTP for Signup',
      text: `Your OTP is: ${otp}`,
      html: `<p>Your OTP is: <b>${otp}</b></p>`
    });

    res.status(200).json({ message: 'OTP sent successfully, please verify' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { initiateBuyerSignup };
