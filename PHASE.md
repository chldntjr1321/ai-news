# 구현 체크리스트

## Phase 1 — 기반 세팅

- [x] pnpm으로 Next.js 14 + TypeScript + TailwindCSS 설치
- [x] supabase-js, cheerio, rss-parser 설치
- [x] `CLAUDE.md`, `PHASE.md` 작성
- [x] `types/index.ts` 작성
- [x] `supabase/schema.sql` 작성
- [x] `lib/supabase.ts` 작성 (client 생성 + upsertNews + getNews 함수)

## Phase 2 — 크롤러 구현

- [x] `lib/crawl/gemini.ts` — RSS 파싱
- [x] `lib/crawl/openai.ts` — RSS 파싱
- [x] `lib/crawl/claude.ts` — HTML 파싱 (cheerio)
- [x] `lib/crawl/index.ts` — 오케스트레이터
- [x] `app/api/crawl/route.ts` — Route Handler

## Phase 3 — 페이지 UI

- [x] `components/NewsCard.tsx` — 제목, 툴 뱃지, 날짜, 링크
- [x] `components/NewsGrid.tsx` — 카드 목록 (반응형 그리드)
- [x] `components/ToolFilter.tsx` — GPT/Claude/Gemini 탭 (Client Component)
- [x] `app/page.tsx` — Supabase에서 뉴스 조회 후 렌더링

## Phase 4 — 자동화 + 배포

- [x] `vercel.json` Cron 등록 (Phase 6에서 제거 예정)
- [x] Vercel 환경변수 등록
- [x] Vercel 배포
- [ ] Supabase 대시보드에서 데이터 저장 확인

## Phase 5 — UI 개편

- [x] `components/Header.tsx` — 전체 폭 헤더, 로고 클릭 시 홈, GitHub 링크
- [x] `components/Banner.tsx` — 최신 글 1건 크게 표시 (검정 배경)
- [x] `components/DigestSummary.tsx` — 종합 요약 박스 (placeholder)
- [x] `components/LastUpdated.tsx` — 마지막 업데이트 날짜 표시
- [x] `components/ToolFilter.tsx` — 가로 탭 → 좌측 사이드바 내비로 변경
- [x] `lib/badge.ts` — tool 배지 색상 매핑 (NewsCard/Banner 공유)

## Phase 6 — GitHub Actions 크롤링 이전

Vercel Hobby 플랜 10초 타임아웃 문제로 크롤링 책임을 GitHub Actions로 이전한다.
이 단계에서는 LLM 요약 없이 기존 크롤러를 그대로 GitHub Actions에서 실행하는 것이 목표다.

- [x] 0단계: Anthropic, Gemini 개별 기사 페이지 SSR 여부 확인
  - Anthropic ✅ SSR / Gemini ✅ SSR / OpenAI ❌ Cloudflare 403 (contentSnippet 유지)
- [ ] 1단계: `vercel.json` Cron 제거, `app/api/crawl/route.ts` 삭제
- [ ] 2단계: `scripts/crawl.js` 작성 (기존 크롤러 그대로 — LLM 없음)
  - tsx 없이 Node.js에서 직접 실행하기 위해 JS로 작성
- [ ] 3단계: `.github/workflows/crawl.yml` 작성 (매일 KST 9시 + 수동 트리거)
- [ ] 4단계: GitHub Secrets 등록 (`NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`)
- [ ] 5단계: 수동 실행 후 Supabase 데이터 저장 확인

## Phase 7 — 본문 fetch + LLM 한국어 요약

Phase 6 완료 후 진행. GitHub Actions 환경에서 본문 fetch와 Gemini 요약을 추가한다.

- [ ] `@google/generative-ai` 패키지 설치
- [ ] `src/lib/summarize.js` 작성 (Gemini 2.5 Flash-Lite 한국어 요약)
- [ ] 크롤러에 본문 fetch 추가 (`claude.ts`, `gemini.ts` / `openai.ts`는 contentSnippet 유지)
- [ ] `scripts/crawl.js` — 요약 생성 로직 추가
- [ ] GitHub Secrets에 `GOOGLE_GENERATIVE_AI_API_KEY` 추가
- [ ] 수동 실행 후 한국어 요약 저장 확인

## Phase 8 — DigestSummary 실제 데이터 연동

- [ ] 당일 수집된 기사 전체를 Gemini로 종합 요약
- [ ] `components/DigestSummary.tsx` placeholder → 실제 데이터로 교체
