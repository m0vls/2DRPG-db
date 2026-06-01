import pg from 'pg';
import 'dotenv/config';

const pool = new pg.Pool({
  host: process.env.DB_POSTGRES_HOST,
  port: parseInt(process.env.DB_PORT ?? "443", 10),
  database: process.env.DB_POSTGRES_DATABASE,
  user: process.env.DB_POSTGRES_USER,
  password: process.env.DB_POSTGRES_PASSWORD,
});

export default pool;
