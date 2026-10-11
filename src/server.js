const app = require('./app');
const connectDB = require('./config/db');
const { PORT } = require('./config/env');
const Admin = require('./models/Admin');
const bcrypt = require('bcryptjs');

const ensureInitialAdmin = async () => {
  try {
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      const email = (process.env.INITIAL_ADMIN_EMAIL || 'admin@valencedigital.agency').toLowerCase().trim();
      const rawPassword = process.env.INITIAL_ADMIN_PASSWORD || 'AdminValence2026!';
      const name = process.env.INITIAL_ADMIN_NAME || 'Valence Director';

      const passwordHash = await bcrypt.hash(rawPassword, 12);

      await Admin.create({
        name,
        email,
        passwordHash,
        role: 'superadmin',
        isActive: true,
      });

      console.log(`[Admin Init] Initial administrator account created: ${email}`);
    }
  } catch (error) {
    console.error(`[Admin Init Error] Failed to verify initial administrator: ${error.message}`);
  }
};

const startServer = async () => {
  await connectDB();
  await ensureInitialAdmin();

  const server = app.listen(PORT, () => {
    console.log(`[Valence Server] Active on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode.`);
  });

  // Graceful shutdown handling
  const shutdown = () => {
    console.log('\n[Valence Server] Gracefully shutting down...');
    server.close(() => {
      console.log('[Valence Server] HTTP server closed.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
};

startServer();
