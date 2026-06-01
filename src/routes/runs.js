import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.js';
import pool from '../db.js';

const router = Router();

router.post('/', authenticateToken, async (req, res) => {
  try {
    const { duration_seconds, kills, victory, currency_earned, team_level, teammate_id } = req.body;

    const result = await pool.query(
      `INSERT INTO run_history (user_id, duration_seconds, kills, victory, currency_earned, team_level, teammate_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, created_at`,
      [req.userId, duration_seconds, kills, victory, currency_earned, team_level || 1, teammate_id || null],
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('POST run error:', err);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT rh.*,
              u_teammate.nickname AS teammate_nickname,
              u_host.nickname AS host_nickname
       FROM run_history rh
       LEFT JOIN users u_teammate ON rh.teammate_id = u_teammate.id
       LEFT JOIN users u_host ON rh.user_id = u_host.id
       WHERE rh.user_id = $1 OR rh.teammate_id = $1
       ORDER BY rh.created_at DESC`,
      [req.userId],
    );

    res.json(result.rows);
  } catch (err) {
    console.error('GET runs error:', err);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

export default router;
