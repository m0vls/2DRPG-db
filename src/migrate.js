import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import pool from './db.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const schema = readFileSync(join(__dirname, 'schema.sql'), 'utf-8');

try {
  await pool.query(schema);
  console.log('Migration applied successfully');
} catch (err) {
  console.error('Migration failed:', err.message);
  process.exitCode = 2;
} finally {
  await pool.end();
}
