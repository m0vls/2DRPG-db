import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();
dotenv.config({ path: '.env.local', override: true });

const rawUrl = process.env.DB_DATABASE_URL;
const connectionString = rawUrl?.replace(/[?&]sslmode=[^&]+/, '');

const pool = rawUrl
  ? new pg.Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
    })
  : new pg.Pool({
      host: process.env.DB_POSTGRES_HOST,
      port: parseInt(process.env.DB_PORT ?? '6543', 10),
      database: process.env.DB_POSTGRES_DATABASE,
      user: process.env.DB_POSTGRES_USER,
      password: process.env.DB_POSTGRES_PASSWORD,
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    });

export default pool;
