# Study Log

공부 회고를 작성하면 AI가 5가지 관점으로 분석해 맞춤형 피드백과 실천 TODO를 자동 생성하는 학습 회고 서비스.

**[study-log-psi.vercel.app](https://study-log-psi.vercel.app)**

---

## 주요 기능

**학습 기록 관리**
- 제목, 내용, 날짜, 학습 시간, 태그로 회고 작성
- 공개/비공개 설정 — 공개 기록은 탐색 페이지에 노출

**AI 피드백** (Gemini 2.5 Flash)
- 실시간 스트리밍으로 분석 결과 표시
- 5가지 관점 분석: 핵심 요약 / 잘한 점 / 개선할 점 / 다음 학습 방향 / 실천 TODO
- 실천 TODO는 체크박스로 완료 여부 표시
- 재생성 시 버전 관리 (V1, V2, V3...) — 이전 버전 비교 가능
- 피드백 평가 (도움됐어요 / 별로예요)

**탐색**
- 다른 사용자의 공개 기록 탐색
- 키워드 및 태그 필터 검색

**마이페이지 & 통계**
- 총 학습 시간, 연속 학습 스트릭
- 자주 사용한 태그 분석
- 월별 학습 현황

---

## 기술 스택

| 계층 | 기술 |
|------|------|
| Frontend | Next.js 16 (App Router) + TypeScript |
| Styling | Tailwind CSS |
| Auth | Supabase Auth (Google OAuth) |
| Database | Supabase (PostgreSQL + RLS) |
| AI | Google Gemini 2.5 Flash (`@google/genai`) |
| Streaming | Server-Sent Events (SSE) |
| Deployment | Vercel |

---

## 로컬 실행

**1. 레포 클론**
```bash
git clone https://github.com/hk9258/study-log.git
cd study-log
npm install
```

**2. 환경변수 설정**

`.env.local` 파일 생성:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
```

**3. Supabase 스키마 적용**

Supabase SQL Editor에서 `supabase-schema.sql` 실행 후 `supabase-schema-update.sql` 실행.

**4. 개발 서버 실행**
```bash
npm run dev
```

`http://localhost:3000` 접속.

---

## 프로젝트 구조

```
app/
├── (auth)/           # 로그인 페이지
├── (dashboard)/      # 대시보드 (home, logs, explore, profile)
└── api/              # API Routes
components/
├── common/           # Navigation
├── study-log/        # 회고 CRUD UI
└── feedback/         # AI 피드백 UI
hooks/                # useAuth, useStudyLogs, useFeedback, useFeedbackStream
services/             # ai-service, study-log-service, feedback-service
```
