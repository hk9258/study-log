-- study_logs 테이블
CREATE TABLE study_logs (
  id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id          UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title            TEXT NOT NULL,
  content          TEXT NOT NULL,
  study_date       DATE NOT NULL,
  duration_minutes INTEGER DEFAULT 0,
  tags             TEXT[] DEFAULT '{}',
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- feedbacks 테이블
CREATE TABLE feedbacks (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  study_log_id  UUID REFERENCES study_logs(id) ON DELETE CASCADE NOT NULL UNIQUE,
  user_id       UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  summary       TEXT,
  strengths     TEXT,
  improvements  TEXT,
  next_steps    TEXT,
  encouragement TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- RLS 활성화
ALTER TABLE study_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedbacks  ENABLE ROW LEVEL SECURITY;

-- study_logs 정책: 본인 데이터만 접근
CREATE POLICY "study_logs_owner" ON study_logs
  FOR ALL USING (auth.uid() = user_id);

-- feedbacks 정책: 본인 데이터만 접근
CREATE POLICY "feedbacks_owner" ON feedbacks
  FOR ALL USING (auth.uid() = user_id);
