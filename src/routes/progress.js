import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.js';
import pool from '../db.js';

const router = Router();

router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT currency, meta_attack_unlocked, meta_defense_unlocked,
              meta_speed_unlocked, meta_max_hp_unlocked,
              total_kills, total_games
       FROM player_progress
       WHERE user_id = $1`,
      [req.userId],
    );

    if (result.rows.length === 0) {
      return res.json({
        currency: 0, meta_attack_unlocked: false, meta_defense_unlocked: false,
        meta_speed_unlocked: false, meta_max_hp_unlocked: false,
        total_kills: 0, total_games: 0,
      });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('GET progress error:', err);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

router.put('/', authenticateToken, async (req, res) => {
  try {
    const {
      currency, meta_attack_unlocked, meta_defense_unlocked,
      meta_speed_unlocked, meta_max_hp_unlocked, total_kills, total_games,
    } = req.body;

    const result = await pool.query(
      `UPDATE player_progress SET
        currency = COALESCE($1, currency),
        meta_attack_unlocked = COALESCE($2, meta_attack_unlocked),
        meta_defense_unlocked = COALESCE($3, meta_defense_unlocked),
        meta_speed_unlocked = COALESCE($4, meta_speed_unlocked),
        meta_max_hp_unlocked = COALESCE($5, meta_max_hp_unlocked),
        total_kills = COALESCE($6, total_kills),
        total_games = COALESCE($7, total_games),
        updated_at = NOW()
       WHERE user_id = $8
       RETURNING currency, meta_attack_unlocked, meta_defense_unlocked,
                 meta_speed_unlocked, meta_max_hp_unlocked,
                 total_kills, total_games`,
      [currency, meta_attack_unlocked, meta_defense_unlocked,
       meta_speed_unlocked, meta_max_hp_unlocked, total_kills, total_games, req.userId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Прогресс не найден' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('PUT progress error:', err);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

export default router;
