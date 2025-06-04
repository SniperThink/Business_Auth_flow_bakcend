const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const { pool } = require('../database/db'); 
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.googleLogin = async (req, res) => {
  console.log('Google login started');
  const { credential } = req.body;

  if (!credential) {
    return res.status(400).json({ message: 'Credential token is required' });
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    console.log('Google ID token verified');

    const payload = ticket.getPayload();
    const email = payload.email;
    const name = payload.name;
    const emailVerified = payload.email_verified;

    if (!emailVerified) {
      return res.status(403).json({ message: 'Email not verified by Google' });
    }

    const userResult = await pool.query(
      'SELECT id, email, role FROM users WHERE email = $1',
      [email]
    );

    let user;
    if (userResult.rows.length > 0) {
      user = userResult.rows[0];
      console.log('User found:', user.email);
    } else {
      // Create new user with default role buyer_admin
      console.log('User not found, creating new user');
      const newUserResult = await pool.query(
        `INSERT INTO users (email, name, role)
         VALUES ($1, $2, 'buyer_admin')
         RETURNING id, email, role`,
        [email, name]
      );
      user = newUserResult.rows[0];
      console.log('New user created:', user.email);
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res
      .cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .json({ message: 'Login successful', user });

    console.log('Response sent successfully');
  } catch (error) {
    console.error('Google Login Error:', error);
    res.status(401).json({ message: 'Invalid Google token' });
  }
};
