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
- [ ] 로컬에서 수동 POST 호출로 크롤링 동작 확인 (Supabase 연결 후 진행)
- [ ] Supabase 대시보드에서 데이터 저장 확인

## Phase 3 — 페이지 UI

- [x] `components/NewsCard.tsx` — 제목, 툴 뱃지, 날짜, 링크
- [x] `components/NewsGrid.tsx` — 카드 목록 (반응형 그리드)
- [x] `components/ToolFilter.tsx` — GPT/Claude/Gemini 탭 (Client Component)
- [x] `app/page.tsx` — Supabase에서 뉴스 조회 후 렌더링

## Phase 4 — 자동화 + 배포

- [x] `vercel.json` Cron 등록
- [ ] Vercel 환경변수 등록
- [ ] Vercel 배포
- [ ] 배포 후 `/api/crawl` 수동 호출로 DB 초기 데이터 채우기
