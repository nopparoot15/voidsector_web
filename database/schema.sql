-- =====================================================
-- USERS
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,

  -- profile
  avatar_path TEXT,
  bio TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- QUIZ LATEST SCORES (1 row per user per quiz)
-- ใช้สำหรับ leaderboard: นับคะแนนจาก "ครั้งล่าสุด" ที่ทำ quiz ของแต่ละบท
-- quiz_key รูปแบบ: <category>:<episodeIndex>
-- =====================================================
CREATE TABLE IF NOT EXISTS quiz_latest (
  user_id INTEGER NOT NULL,
  quiz_key TEXT NOT NULL,
  category TEXT NOT NULL,
  episode_idx INTEGER NOT NULL,
  score INTEGER NOT NULL,
  total INTEGER NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  PRIMARY KEY (user_id, quiz_key),

  CONSTRAINT fk_quiz_latest_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_quiz_latest_user_time
  ON quiz_latest(user_id, updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_quiz_latest_key
  ON quiz_latest(quiz_key);

-- =====================================================
-- FRIEND REQUESTS
-- =====================================================
CREATE TABLE IF NOT EXISTS friend_requests (
  id SERIAL PRIMARY KEY,
  from_user_id INTEGER NOT NULL,
  to_user_id INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- pending | accepted | declined
  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT fk_fr_from
    FOREIGN KEY (from_user_id)
    REFERENCES users(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_fr_to
    FOREIGN KEY (to_user_id)
    REFERENCES users(id)
    ON DELETE CASCADE,

  CONSTRAINT fr_unique UNIQUE (from_user_id, to_user_id)
);

CREATE INDEX IF NOT EXISTS idx_friend_requests_to
  ON friend_requests(to_user_id);

-- =====================================================
-- FRIENDSHIPS (DIRECTED: 1 ROW PER DIRECTION)
-- =====================================================
CREATE TABLE IF NOT EXISTS friendships (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  friend_user_id INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT fk_fs_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_fs_friend
    FOREIGN KEY (friend_user_id)
    REFERENCES users(id)
    ON DELETE CASCADE,

  CONSTRAINT fs_unique UNIQUE (user_id, friend_user_id)
);

CREATE INDEX IF NOT EXISTS idx_friendships_user
  ON friendships(user_id);

-- =====================================================
-- CHAT ROOMS
-- =====================================================
CREATE TABLE IF NOT EXISTS chat_rooms (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  is_public BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ✅ ป้องกัน DM room ซ้ำ (dm:1:5)
CREATE UNIQUE INDEX IF NOT EXISTS uq_chat_rooms_name
  ON chat_rooms(name);

-- =====================================================
-- CHAT ROOM MEMBERS
-- ใช้ควบคุมสิทธิ์เข้า ROOM (สำคัญมากสำหรับ DM)
-- =====================================================
CREATE TABLE IF NOT EXISTS chat_room_members (
  room_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  joined_at TIMESTAMPTZ DEFAULT NOW(),

  PRIMARY KEY (room_id, user_id),

  CONSTRAINT fk_crm_room
    FOREIGN KEY (room_id)
    REFERENCES chat_rooms(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_crm_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_chat_room_members_user
  ON chat_room_members(user_id);

-- =====================================================
-- CHAT READS (per-user last read time, for unread badges)
-- =====================================================
CREATE TABLE IF NOT EXISTS chat_reads (
  room_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  last_read_at TIMESTAMPTZ DEFAULT NOW(),

  PRIMARY KEY (room_id, user_id),

  CONSTRAINT fk_cr_room
    FOREIGN KEY (room_id)
    REFERENCES chat_rooms(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_cr_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_chat_reads_user
  ON chat_reads(user_id, room_id);

-- =====================================================
-- POSTS (FEED)
-- =====================================================
CREATE TABLE IF NOT EXISTS posts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  text TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT fk_posts_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_posts_updated
  ON posts(updated_at DESC);

CREATE TABLE IF NOT EXISTS post_media (
  id SERIAL PRIMARY KEY,
  post_id INTEGER NOT NULL,
  url TEXT NOT NULL,
  mime TEXT NOT NULL,
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT fk_post_media_post
    FOREIGN KEY (post_id)
    REFERENCES posts(id)
    ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_post_media_post
  ON post_media(post_id);

-- =====================================================
-- CHAT MESSAGES
-- Global chat ใช้ room_id = 1
-- DM ใช้ room_id ของ dm:<uid1>:<uid2>
-- =====================================================
CREATE TABLE IF NOT EXISTS chat_messages (
  id SERIAL PRIMARY KEY,
  room_id INTEGER NOT NULL,

  -- NULL ได้ (รองรับ system / guest)
  user_id INTEGER NULL,

  -- เก็บ username ซ้ำไว้เพื่อ history
  username TEXT NOT NULL,

  message TEXT NOT NULL,

  -- ✅ used for optimistic UI + dedupe + safe history queries
  client_msg_id TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT fk_cm_room
    FOREIGN KEY (room_id)
    REFERENCES chat_rooms(id)
    ON DELETE CASCADE,

  -- user ถูกลบไม่ลบข้อความ
  CONSTRAINT fk_cm_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_chat_messages_room_time
  ON chat_messages(room_id, created_at);

-- ✅ optional but recommended: quick lookup/dedupe by client_msg_id
CREATE INDEX IF NOT EXISTS idx_chat_messages_client_msg_id
  ON chat_messages(client_msg_id);

-- =====================================================
-- DEFAULT GLOBAL CHAT ROOM (id = 1)
-- =====================================================
INSERT INTO chat_rooms (id, name, is_public)
VALUES (1, 'Global', TRUE)
ON CONFLICT (id) DO NOTHING;
