require('dotenv').config();
const express = require('express');
const { pool } = require('./src/database/db'); // import your pool
const app = express();

app.use(express.json());
const cookieParser = require('cookie-parser');
app.use(cookieParser());
const cors = require('cors');
const cron = require('node-cron');

app.use(cors({
  origin: 'http://localhost:5173',  // ✅ your Vite frontend
  credentials: true                // ✅ allow cookies/JWTs
}));

const authRoutes = require('./src/routes/authRoutes');
const employeeRoutes = require('./src/routes/employeeRoutes');
const passwordResetRoutes = require('./src/routes/passwordResetRoutes');
const logoutRoutes = require('./src/routes/logoutRoutes');
const supportRoutes = require('./src/routes/supportRoutes');

const impersonationRoutes = require('./src/routes/impersonationRoutes');
const googleAuthRoutes = require('./src/routes/googleAuthRoute');
const cleanupPendingUsers = require('./src/corn/cleanupPendingUsers');





app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);

app.use('/api/auth/password-reset', passwordResetRoutes);


app.use('/api/auth', logoutRoutes);


// Add support routes under /api/support
app.use('/api/support', supportRoutes);


app.use('/api/impersonate', impersonationRoutes);

app.use('/api/auth',googleAuthRoutes)



// Run cleanup every 10 minutes
cron.schedule('*/10 * * * *', () => {
  cleanupPendingUsers();
});

const PORT = process.env.PORT || 7777;

async function startServer() {
  try {
    // Test DB connection
    await pool.query('SELECT NOW()');
    console.log('Database connection test successful');

    // Start server only after DB is ready
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to connect to database:', err);
    process.exit(1); // Exit app if DB connection fails
  }
}

startServer();
