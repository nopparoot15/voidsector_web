CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(200) UNIQUE NOT NULL,
  password_hash VARCHAR(200) NOT NULL,
  xp INTEGER DEFAULT 0,
  streak INTEGER DEFAULT 0,
  last_streak_date DATE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS languages (
  id SERIAL PRIMARY KEY,
  code VARCHAR(10) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  native_name VARCHAR(100) NOT NULL,
  flag VARCHAR(10) NOT NULL
);

CREATE TABLE IF NOT EXISTS units (
  id SERIAL PRIMARY KEY,
  language_id INTEGER REFERENCES languages(id) ON DELETE CASCADE,
  order_num INTEGER NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  icon VARCHAR(50) DEFAULT '📚',
  level VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS lessons (
  id SERIAL PRIMARY KEY,
  unit_id INTEGER REFERENCES units(id) ON DELETE CASCADE,
  order_num INTEGER NOT NULL,
  title VARCHAR(200) NOT NULL,
  xp_reward INTEGER DEFAULT 10
);

CREATE TABLE IF NOT EXISTS exercises (
  id SERIAL PRIMARY KEY,
  lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
  order_num INTEGER NOT NULL,
  type VARCHAR(50) NOT NULL,
  data JSONB NOT NULL
);

CREATE TABLE IF NOT EXISTS user_lesson_progress (
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, lesson_id),
  score INTEGER NOT NULL DEFAULT 0,
  xp_earned INTEGER NOT NULL DEFAULT 0,
  completed_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS vocab (
  id SERIAL PRIMARY KEY,
  language_id INTEGER REFERENCES languages(id) ON DELETE CASCADE,
  word VARCHAR(200) NOT NULL,
  reading VARCHAR(200),
  translation VARCHAR(500) NOT NULL,
  example TEXT,
  example_translation TEXT,
  tags TEXT[] DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS user_vocab_progress (
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  vocab_id INTEGER REFERENCES vocab(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, vocab_id),
  ease_factor FLOAT DEFAULT 2.5,
  interval_days INTEGER DEFAULT 1,
  repetitions INTEGER DEFAULT 0,
  next_review TIMESTAMP DEFAULT NOW(),
  last_review TIMESTAMP
);
