const { pool } = require('../database/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET; // Use env variable in production

async function login(req, res) {
  console.log('Login request received');
  try {
    const { email, password, rememberMe } = req.body;
    console.log('Request body:', { email, rememberMe });

    if (!email || !password) {
      console.log('Missing email or password');
      return res.status(400).json({ message: 'Email and password required' });
    }

    // Check if user exists
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    console.log('User query result count:', userResult.rows.length);

    if (userResult.rows.length === 0) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    const user = userResult.rows[0];
    console.log('User found:', user.email);

    // Verify password
    const match = await bcrypt.compare(password, user.password_hash);
    console.log('Password match result:', match);

    if (!match) {
      console.log('Password mismatch');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role, companyId: user.company_id },
      JWT_SECRET,
      { expiresIn: rememberMe ? '30d' : '8h' }
    );

    // Set cookie with token
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : 8 * 60 * 60 * 1000,
    });

    res.json({
      message: 'Login successful',
      token,
      role: user.role,
      user: {
        userId: user.id,
        role: user.role,
        companyId: user.company_id,
      },
    });
    console.log('Login response sent successfully');
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

function getMe(req, res) {
  if (!req.user) {
    console.log('No user found in request');
    return res.json({ user: null });
  }
  console.log('Returning user info:', req.user);
  res.json({
    userId: req.user.userId,
    role: req.user.role,
    companyId: req.user.companyId,
  });
}

module.exports = { login, getMe };
