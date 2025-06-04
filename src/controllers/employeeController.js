const { pool } = require('../database/db');
const bcrypt = require('bcrypt');

async function addEmployee(req, res) {
  try {
    const { email, password, role } = req.body;
    const { role: userRole, companyId } = req.user; 

    if (userRole !== 'buyer_admin') {
      return res.status(403).json({ message: 'Only buyer admins can add employees' });
    }

    if (!email || !password || !['employee', 'support'].includes(role)) {
      return res.status(400).json({ message: 'Invalid input' });
    }

    const existing = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      'INSERT INTO users (email, password_hash, role, company_id) VALUES ($1, $2, $3, $4)',
      [email, hashedPassword, role, companyId]
    );

    res.status(201).json({ message: 'Employee added successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = { addEmployee };
