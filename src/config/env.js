require('dotenv').config();

const requiredEnvVars = ['JWT_SECRET'];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.warn(`[Warning] Missing environment variable ${envVar}. Using fallback for development.`);
    if (envVar === 'JWT_SECRET') {
      process.env.JWT_SECRET = 'valence_development_jwt_secret_change_in_production_2026';
    }
  }
}

module.exports = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/valence_digital',
  JWT_SECRET: process.env.JWT_SECRET || 'valence_development_jwt_secret_change_in_production_2026',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'https://val-client.vercel.app/',
  UPLOAD_DIR: process.env.UPLOAD_DIR || 'uploads',
};
