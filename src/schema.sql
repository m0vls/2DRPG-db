CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    nickname VARCHAR(32) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS player_progress (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    currency INTEGER DEFAULT 0,
    meta_attack_unlocked BOOLEAN DEFAULT FALSE,
    meta_defense_unlocked BOOLEAN DEFAULT FALSE,
    meta_speed_unlocked BOOLEAN DEFAULT FALSE,
    meta_max_hp_unlocked BOOLEAN DEFAULT FALSE,
    total_kills INTEGER DEFAULT 0,
    total_games INTEGER DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS run_history (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    duration_seconds DOUBLE PRECISION NOT NULL,
    kills INTEGER NOT NULL DEFAULT 0,
    victory BOOLEAN NOT NULL DEFAULT FALSE,
    currency_earned INTEGER NOT NULL DEFAULT 0,
    team_level INTEGER NOT NULL DEFAULT 1,
    teammate_id INTEGER REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_nickname ON users(nickname);
CREATE INDEX IF NOT EXISTS idx_run_history_user ON run_history(user_id);
