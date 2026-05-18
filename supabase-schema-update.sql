-- 피드백 버전 관리 + 평가 기능을 위한 스키마 업데이트
-- Supabase SQL Editor에서 실행하세요.

-- 1. study_log_id UNIQUE 제약 제거 (다중 버전 허용)
ALTER TABLE feedbacks DROP CONSTRAINT IF EXISTS feedbacks_study_log_id_key;

-- 2. 버전 컬럼 추가
ALTER TABLE feedbacks ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1 NOT NULL;

-- 3. 평가 컬럼 추가: 1 = 도움됐어요, -1 = 별로예요, NULL = 미평가
ALTER TABLE feedbacks ADD COLUMN IF NOT EXISTS rating INTEGER DEFAULT NULL;

-- 4. 성능을 위한 인덱스 생성
CREATE INDEX IF NOT EXISTS feedbacks_study_log_version_idx
  ON feedbacks (study_log_id, version DESC);

-- 기존 데이터에 version = 1 적용 (이미 DEFAULT 1이므로 자동 처리됨)
