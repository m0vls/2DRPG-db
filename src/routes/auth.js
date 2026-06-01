import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../db.js';

const router = Router();

router.post('/register', async (req, res) => {
  try {
    const { nickname, password } = req.body;

    if (!nickname || !password) {
      return res.status(400).json({ error: 'Nickname и password обязательны' });
    }

    if (nickname.length < 2 || nickname.length > 32) {
      return res.status(400).json({ error: 'Nickname от 2 до 32 символов' });
    }

    if (password.length < 4) {
      return res.status(400).json({ error: 'Пароль минимум 4 символа' });
    }

    const existing = await pool.query(
      'SELECT id FROM users WHERE nickname = $1',
      [nickname],
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Nickname уже занят' });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      'INSERT INTO users (nickname, password_hash) VALUES ($1, $2) RETURNING id, nickname, created_at',
      [nickname, password_hash],
    );

    const user = result.rows[0];

    await pool.query(
      'INSERT INTO player_progress (user_id) VALUES ($1)',
      [user.id],
    );

    const token = jwt.sign(
      { userId: user.id },
      process.env.DB_SUPABASE_JWT_SECRET,
      { expiresIn: '30d' },
    );

    res.status(201).json({ token, user: { id: user.id, nickname: user.nickname } });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { nickname, password } = req.body;

    if (!nickname || !password) {
      return res.status(400).json({ error: 'Nickname и password обязательны' });
    }

    const result = await pool.query(
      'SELECT id, nickname, password_hash FROM users WHERE nickname = $1',
      [nickname],
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Неверный nickname или пароль' });
    }

    const user = result.rows[0];

    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Неверный nickname или пароль' });
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.DB_SUPABASE_JWT_SECRET,
      { expiresIn: '30d' },
    );

    res.json({ token, user: { id: user.id, nickname: user.nickname } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

export default router;
