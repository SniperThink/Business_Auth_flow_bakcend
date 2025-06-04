const jwt = require('jsonwebtoken');
const { pool } = require('../database/db');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

async function impersonateBuyer(req, res) {
  try {
    const { buyerId } = req.body;
    const { userId, role } = req.user; 

    if (role !== 'seller') {
      return res.status(403).json({ message: 'Only sellers can impersonate buyers' });
    }

    const buyerRes = await pool.query(
      'SELECT id, email, role, company_id FROM users WHERE id = $1 AND role = $2',
      [buyerId, 'buyer_admin']
    );

    if (buyerRes.rows.length === 0) {
      return res.status(404).json({ message: 'Buyer not found' });
    }

    const buyer = buyerRes.rows[0];

    const token = jwt.sign(
      {
        userId: buyer.id,
        email: buyer.email,
        role: buyer.role,
        companyId: buyer.company_id,
        impersonatedBy: userId // seller ID
      },
      JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.json({ message: 'Impersonation token generated', token });
  } catch (err) {
    console.error('Error during impersonation:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { impersonateBuyer };
