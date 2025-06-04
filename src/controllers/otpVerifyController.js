const jwt = require('jsonwebtoken');
const { pool } = require('../database/db');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const JWT_EXPIRES_IN = '1h';

async function verifyBuyerSignup(req, res) {
  try {
    const { email, otp } = req.body;

const pendingUserRes = await pool.query(
  `SELECT email, password_hash, business_name 
   FROM pending_users WHERE email = $1 AND otp = $2`,
  [email, otp]
);


    if (pendingUserRes.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    const { password_hash, business_name, business_type, sector_industry } = pendingUserRes.rows[0];

    const companyExists = await pool.query(
      'SELECT id FROM companies WHERE business_name = $1',
      [business_name]
    );

    if (companyExists.rows.length > 0) {
      return res.status(400).json({ message: 'Company already exists' });
    }

 const companyResult = await pool.query(
  `INSERT INTO companies (business_name) 
   VALUES ($1) RETURNING id`,
  [business_name]
);

    const companyId = companyResult.rows[0].id;

    const userInsert = await pool.query(
      `INSERT INTO users (email, password_hash, role, company_id) 
       VALUES ($1, $2, $3, $4) RETURNING id, role`,
      [email, password_hash, 'buyer_admin', companyId]
    );

    await pool.query('DELETE FROM pending_users WHERE email = $1', [email]);

    const userId = userInsert.rows[0].id;
    const role = userInsert.rows[0].role;

    const token = jwt.sign(
      { userId, email, role, companyId },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

   res
  .cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // true on production
    sameSite: 'Lax', // helps prevent CSRF
    maxAge: 60 * 60 * 1000, // 1 hour in ms (adjust as needed)
  })
  .status(201)
  .json({
    message: 'Signup completed successfully',
    user: { userId, email, role, companyId }
  });


  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { verifyBuyerSignup };
