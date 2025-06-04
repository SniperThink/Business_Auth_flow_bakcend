const { pool } = require('../database/db');

async function cleanupPendingUsers() {
  const cutoff = new Date(Date.now() - 15 * 60 * 1000); // 15 minutes ago
  try {
    const result = await pool.query('DELETE FROM pending_users WHERE created_at < $1', [cutoff]);
    console.log(`[CRON] Deleted ${result.rowCount} expired pending users.`);
  } catch (err) {
    console.error('[CRON] Failed to clean up pending users:', err.message);
  }
}

module.exports = cleanupPendingUsers;
