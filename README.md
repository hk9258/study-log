# Study Log

공부 회고를 작성하면 AI가 5가지 관점으로 분석해 맞춤형 피드백과 실천 TODO를 자동 생성하는 학습 회고 서비스.

🔗 **[study-log-psi.vercel.app](https://study-log-psi.vercel.app)**

---

# 프로젝트 개요

- **프로젝트 목적**: 학습 후 회고를 작성하는 습관을 돕고, AI 피드백으로 학습 효율을 높이는 서비스
- **주요 기능**: 학습 기록 CRUD, Gemini 기반 AI 피드백 (실시간 스트리밍), 공개 피드 탐색, 통계 대시보드
- **어떤 문제를 해결하는지**: 혼자 공부할 때 내 학습이 올바른 방향인지 확인하기 어렵고, 회고를 작성해도 피드백이 없어 개선 방향을 찾기 힘든 문제
- **프로젝트 진행 배경**: AI 에이전트(Claude Code)를 활용한 풀스택 웹 서비스 개발 실습 프로젝트

---

# 기술 스택

## Frontend

- Next.js 16 (App Router)
- React 19 / TypeScript
- Tailwind CSS

## Backend

- Supabase (PostgreSQL + Row Level Security)
- Supabase Auth (Google OAuth)
- Next.js API Routes (BFF 패턴)

## AI

- Google Gemini 2.5 Flash (`@google/genai`)
- Server-Sent Events (SSE) 실시간 스트리밍

## Deploy

- Vercel

## AI Agent

- Claude Code (Anthropic)

---

# 주요 기능

- **학습 기록 CRUD**: 제목, 내용, 날짜, 학습 시간, 태그 입력 / 공개·비공개 설정
- **AI 피드백**: 핵심 요약 / 잘한 점 / 개선할 점 / 다음 학습 방향 / 실천 TODO 5가지 분석, SSE 스트리밍으로 실시간 표시
- **피드백 버전 관리**: 재생성할 때마다 V1·V2·V3 형태로 이전 버전 보존 및 비교
- **피드백 평가**: 도움됐어요 / 별로예요 평가 기능
- **실천 TODO 체크리스트**: AI가 생성한 TODO를 체크박스로 완료 처리
- **탐색 페이지**: 다른 사용자의 공개 기록을 키워드·태그로 검색
- **마이페이지 & 통계**: 총 학습 시간, 연속 학습 스트릭, 태그 분석, 월별 현황

---

# 프로젝트 구조

```text
app/
 ├── (auth)/             # 로그인 페이지
 ├── (dashboard)/        # 대시보드 레이아웃
 │    ├── home/          # 홈 대시보드
 │    ├── logs/          # 학습 기록 목록 / 상세 / 작성
 │    ├── explore/       # 공개 기록 탐색
 │    └── profile/       # 마이페이지 & 통계
 └── api/
      ├── study-logs/    # CRUD API
      ├── feedbacks/     # AI 피드백 생성 / 버전 / 평가
      │    └── stream/   # SSE 스트리밍
      ├── explore/       # 공개 기록 검색
      ├── profile/       # 통계 집계
      └── statistics/    # 기본 통계
components/
 ├── common/             # Navigation
 ├── study-log/          # 기록 카드, 폼, 목록
 └── feedback/           # 피드백 패널, 항목, TODO 체크리스트
hooks/                   # useAuth, useStudyLogs, useFeedback, useFeedbackStream
services/                # ai-service, study-log-service, feedback-service
lib/                     # supabase 클라이언트, api-client, utils
```

---

# 실행 방법

## 1. 프로젝트 설치

```bash
git clone https://github.com/hk9258/study-log.git
cd study-log
npm install
```

## 2. 환경변수 설정

`.env.local`

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
```

## 3. Supabase 스키마 적용

Supabase SQL Editor에서 순서대로 실행:

```bash
supabase-schema.sql          # 기본 테이블 생성
supabase-schema-update.sql   # 피드백 버전·평가 컬럼 추가
```

## 4. 실행

```bash
npm run dev
```

`http://localhost:3000` 접속

---

# Supabase 설정

**Authentication**
- Google OAuth 사용 (`@supabase/ssr`)
- 미들웨어에서 세션 자동 갱신

**사용한 테이블**

| 테이블 | 설명 |
|--------|------|
| `study_logs` | 학습 기록 (제목, 내용, 날짜, 시간, 태그, 공개 여부) |
| `feedbacks` | AI 피드백 (5가지 분석 결과, 버전, 평가) |

**주요 RLS 정책**
- 본인의 기록만 생성·수정·삭제 가능
- `is_public = true`인 기록은 모든 인증 사용자가 조회 가능
- 피드백은 본인 기록에만 생성·조회 가능

**Storage**: 미사용

---

# AI 에이전트 활용 방식

**사용한 도구**: Claude Code (Anthropic)

**어떤 작업에 활용했는지**
- 프로젝트 전체 구조 설계 및 구현
- API Routes, 서비스 레이어, 훅, 컴포넌트 작성
- Supabase RLS 정책 설계
- SSE 스트리밍 구현
- 버그 수정 및 디버깅

**문서 기반 작업 방식**
- `STUDY_LOG_BRIEF.md` 기획서를 기반으로 구현 범위와 우선순위 결정
- 기능별 Phase로 나눠 순차적으로 구현

**코드 검증 방식**
- 각 기능 구현 후 직접 브라우저에서 시나리오 테스트
- TypeScript 컴파일 오류 즉시 확인 (`tsc --noEmit`)
- 에러 발생 시 스크린샷을 통해 Claude Code와 함께 원인 분석

**주요 활용 예시**
- Google OAuth + Supabase 세션 유지 구현
- Gemini API 스트리밍 연동
- 피드백 버전 관리 DB 설계 및 구현
- 마이페이지 통계 집계 로직 (스트릭, 태그 분석, 월별 현황)
- README 및 기획서 문서 작성

---

# 트러블 슈팅

## 1. AI API 크레딧 문제

**문제 상황**
OpenAI API를 사용하려 했으나 크레딧 부족으로 429 오류 발생.

**원인**
무료 크레딧 만료 후 충전 없이 호출 시도.

**해결 방법**
Google Gemini API로 전환. `@google/genai` 패키지를 사용하고 `gemini-2.5-flash` 모델로 최종 적용.
(gemini-2.0-flash, gemini-2.0-flash-lite는 신규 사용자에게 deprecated 처리됨)

---

## 2. Gemini 스트리밍 청크 형식 오류

**문제 상황**
AI 피드백이 "분석 중..." 상태에서 멈추고 결과가 표시되지 않음.

**원인**
OpenAI 스트리밍 형식(`chunk.choices[0]?.delta?.content`)을 그대로 사용해 Gemini 응답을 읽지 못함.

**해결 방법**
Gemini `@google/genai` 형식에 맞게 `chunk.text ?? ""`로 수정.

---

## 3. Next.js App Router params 비동기 처리

**문제 상황**
동적 라우트(`[id]`)에서 params를 동기적으로 접근하자 타입 오류 및 런타임 경고 발생.

**원인**
Next.js 16에서 Route Handler의 params가 `Promise`로 변경됨.

**해결 방법**
- Server Component: `const { id } = use(params)`
- Route Handler: `const { id } = await params`

---

## 4. 로그인 후 세션 유지 실패

**문제 상황**
Google OAuth 로그인 후 `/` 로 리다이렉트되어 로그인 상태가 유지되지 않음.

**원인**
`@supabase/auth-helpers-nextjs` 대신 `@supabase/ssr`을 사용해야 하는데 클라이언트·서버 클라이언트 구분 없이 동일하게 사용.

**해결 방법**
- 클라이언트 컴포넌트: `createBrowserClient`
- 서버(Route Handler, Server Component): `createServerClient` with cookie 처리
- 미들웨어에서 세션 자동 갱신 처리

---

# 회고

**어려웠던 점**
- AI API 선택 과정에서 OpenAI 크레딧 문제로 Gemini로 전환하는 시간이 소요됨
- Gemini 모델별 지원 버전이 달라 deprecated 오류를 여러 번 겪음
- Next.js 16의 breaking change(async params)를 처음 접해 적응이 필요했음

**개선하고 싶은 점**
- 태그 시스템을 text[] 배열 대신 정규화 테이블로 관리하면 태그 자동완성 등 확장이 용이할 것
- 무한스크롤 페이지네이션 미구현 — 기록이 많아지면 성능 이슈 가능성
- 피드백 스트리밍 중 부분 파싱으로 실시간 UI 업데이트가 JSON 완성 시에만 가능한 구조

**새롭게 배운 점**
- Server-Sent Events(SSE)를 활용한 실시간 스트리밍 구현 방식
- Supabase RLS로 API 레벨이 아닌 DB 레벨에서 권한을 제어하는 방법
- Next.js App Router의 Route Group, Server/Client Component 분리 전략

**AI 에이전트를 사용하며 느낀 점**
- 반복적인 보일러플레이트 코드 작성 속도가 크게 향상됨
- 에러 스크린샷을 공유하면 원인 분석과 해결책 제시가 빠름
- 단, 생성된 코드를 이해하지 않으면 디버깅이 어려워짐 — 코드 검증 필수
- AI가 제안한 코드도 프로젝트 맥락에 맞게 수정이 필요한 경우가 많음

---

# 참고 자료

- [Next.js 공식 문서](https://nextjs.org/docs)
- [Supabase 공식 문서](https://supabase.com/docs)
- [Supabase SSR 가이드](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [Google Gemini API 문서](https://ai.google.dev/gemini-api/docs)
- [@google/genai npm](https://www.npmjs.com/package/@google/genai)
- [Tailwind CSS 공식 문서](https://tailwindcss.com/docs)
