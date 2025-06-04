const { pool } = require('../database/db');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const sendEmail = require('../utils/mailer');

async function requestPasswordReset(req, res) {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email required' });

  const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  if (userResult.rows.length === 0) {
    return res.json({ message: 'If this email exists, a reset link has been sent.' });
  }

  const user = userResult.rows[0];
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); 

  await pool.query(
    'INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
    [user.id, token, expiresAt]
  );

  const resetUrl = `http://yourfrontend.com/reset-password?token=${token}`;

  await sendEmail({
    to: email,
    subject: 'Reset Your Password',
    text: `Click the link to reset your password: ${resetUrl}`,
    html: `<p>Click the link below to reset your password:</p><a href="${resetUrl}">${resetUrl}</a>`
  });

  res.json({ message: 'If this email exists, a reset link has been sent.' });
}



async function resetPassword(req, res) {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) {
    return res.status(400).json({ message: 'Token and new password required' });
  }

  const tokenResult = await pool.query(
    'SELECT * FROM password_reset_tokens WHERE token = $1 AND used = FALSE AND expires_at > NOW()',
    [token]
  );

  if (tokenResult.rows.length === 0) {
    return res.status(400).json({ message: 'Invalid or expired reset token' });
  }

  const resetRecord = tokenResult.rows[0];
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await pool.query('UPDATE users SET password_hash = $1 WHERE id = $2', [
    hashedPassword,
    resetRecord.user_id
  ]);
  await pool.query('UPDATE password_reset_tokens SET used = TRUE WHERE id = $1', [
    resetRecord.id
  ]);

  res.json({ message: 'Password updated successfully' });
}

module.exports = { requestPasswordReset, resetPassword };
