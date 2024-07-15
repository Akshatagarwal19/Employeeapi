import dotenv from 'dotenv';
import path from 'path';

const env = process.env.NODE_ENV || 'development';

if (env === 'development') {
  dotenv.config({ path: path.resolve(__dirname, '.env.local') });
} else {
  dotenv.config();
}

export default {
  db: {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  },
  port: process.env.PORT || 3000,
};
