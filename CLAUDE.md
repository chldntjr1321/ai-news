# AI News — Project Context

## 목적

GPT, Claude, Gemini 세 AI 툴의 최신 소식을 매일 자동으로 수집해서 보여주는 뉴스 페이지.
핵심: 크롤링 자동화 + 뉴스 목록 표시. i18n/SEO는 MVP 범위 외.

---

## 기술 스택

| 역할 | 도구 |
|------|------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict mode) |
| Styling | TailwindCSS |
| DB | Supabase |
| 배포 | Vercel (Cron Job 포함) |
| 패키지 매니저 | pnpm |
| HTML 파싱 | cheerio (Anthropic 전용) |
| RSS 파싱 | rss-parser (OpenAI, Gemini 공용) |

---

## 폴더 구조

```
src/
├── app/
│   ├── page.tsx                  # 메인 뉴스 페이지 (Server Component)
│   ├── layout.tsx
│   └── api/
│       └── crawl/
│           └── route.ts          # POST /api/crawl
│
├── components/
│   ├── Header.tsx                # 전체 폭 헤더 바 (로고 클릭 시 홈으로, GitHub/언어 아이콘)
│   ├── Banner.tsx                # 메인 배너 (현재는 최신 글 1건, 추후 GPT/Claude/Gemini 3건 페이드 전환 예정)
│   ├── DigestSummary.tsx         # 오늘의 종합 요약 박스 (현재 placeholder, LLM 연동 전)
│   ├── ToolFilter.tsx            # 좌측 사이드바 내비 — 전체/GPT/Claude/Gemini (Client Component, URL의 ?tool= 기준)
│   ├── NewsCard.tsx              # 뉴스 카드 1개
│   ├── NewsGrid.tsx              # 카드 목록
│   └── LastUpdated.tsx           # "마지막 업데이트 YYYY년 M월 D일" 표시
│
├── lib/
│   ├── crawl/
│   │   ├── index.ts              # Promise.allSettled로 3개 동시 실행
│   │   ├── openai.ts             # openai.com/news/rss.xml RSS 파싱
│   │   ├── claude.ts             # anthropic.com/news HTML 파싱 (cheerio)
│   │   └── gemini.ts             # Google DeepMind 블로그 RSS 파싱
│   ├── supabase.ts               # DB 저장(upsert) / 조회 (getNews, getLastUpdated)
│   └── badge.ts                  # TOOL_BADGE — tool별 배지 라벨/색상 매핑 (NewsCard, Banner 공유)
│
└── types/index.ts                # NewsItem, Tool 타입

supabase/
└── schema.sql                    # Supabase 대시보드에서 실행할 DDL

vercel.json                       # Cron 설정
```

---

## 크롤링 소스

| AI | URL | 방식 | 파서 |
|----|-----|------|------|
| GPT | `https://openai.com/news/rss.xml` | RSS | rss-parser |
| Claude | `https://www.anthropic.com/news` | HTML fetch + cheerio | cheerio |
| Gemini | `https://blog.google/innovation-and-ai/models-and-research/google-deepmind/rss/` | RSS | rss-parser |

### GPT (openai.ts)
- 추출: `item.title`, `item.link`, `item.pubDate`, `item.contentSnippet`
- 비고: openai.com/news HTML은 Cloudflare 차단 → RSS 피드만 사용

### Claude (claude.ts)
- 추출: `a[href^="/news/"]` (URL), `time` (날짜), 마지막 `span` (제목)
- 비고: URL은 상대경로 → `https://www.anthropic.com` 접두어 필요

### Gemini (gemini.ts)
- 추출: `item.title`, `item.link`, `item.pubDate`, `item.contentSnippet`

---

## DB 스키마

```sql
create table news (
  id           uuid primary key default gen_random_uuid(),
  tool         text not null,
  title        text not null,
  summary      text,
  url          text not null unique,
  published_at timestamptz not null,
  created_at   timestamptz default now()
);

create index idx_news_tool      on news(tool);
create index idx_news_published on news(published_at desc);
```

---

## 환경변수 (`.env.local`)

```
NEXT_PUBLIC_SUPABASE_URL=        # Supabase 프로젝트 URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=   # 공개 anon key (클라이언트용)
SUPABASE_SERVICE_ROLE_KEY=       # service_role key (크롤러 upsert용)
CRON_SECRET=                     # 무단 /api/crawl 호출 방지용 임의 문자열
ANTHROPIC_API_KEY=               # LLM 번역/요약용 (아직 미추가)
```

---

## 작업 현황 (2026-06-16 기준)

### 완료된 작업
- 필터 버튼 `cursor-pointer`, 탭 전환 레이아웃 시프트 수정 (`overflow-y: scroll`)
- `LastUpdated` 컴포넌트 — `news.created_at` 최댓값 기준, 연도 포함·시간 제외
- 메인 페이지 "종합 뉴스" 스타일 개편:
  - `Header.tsx`: 전체 폭 헤더 바, 로고 클릭 시 홈, 우측 GitHub 링크 + 언어 아이콘(툴팁만, 미구현)
  - `Banner.tsx`: 최신 글 1건을 크게 표시 (검정 배경)
  - `DigestSummary.tsx`: 종합 요약 박스 — placeholder, LLM 연동 전
  - `ToolFilter.tsx`: 가로 탭 → 좌측 사이드바 내비로 변경
  - `lib/badge.ts`: tool 배지 색상 매핑 (NewsCard/Banner 공유)

### 다음 할 일 (우선순위 순)

1. **LLM 기반 한국어 번역/재구성** — 크롤링 시점에 Claude Haiku 4.5로 title/summary를 한국어 뉴스 톤으로 재구성해서 DB 저장. `ANTHROPIC_API_KEY` 환경변수 추가 필요. 월 비용 1달러 미만 추정. 다국어 지원 기반으로 확장 가능.
2. **DigestSummary 실제 데이터 연동** — 위 LLM 연동과 같은 타이밍에, 그날 뉴스 전체 요약 호출로 교체 (지금은 하드코딩 placeholder).
3. **Banner 캐러셀** (보류) — GPT/Claude/Gemini 각 최신 1건씩 페이드인/아웃 자동 전환. `useState` + `setInterval` + Tailwind `transition-opacity`. Client Component 필요.
4. **크롤러 썸네일 이미지 추출** (보류) — 카드 사진 배경의 선행 조건. 소스별 추출 방식 상이 (OG 이미지 / RSS media 태그).
5. **종합 요약 박스 모양/위치 재검토** (보류).

---

## 코드 규칙

- 모든 컴포넌트는 기본 Server Component. 클라이언트 상태가 필요한 경우에만 `'use client'` 추가
- `any` 타입 사용 금지
- 크롤러 함수는 반드시 `try/catch`로 감싸고, 실패 시 빈 배열 `[]` 반환
- 환경변수는 `process.env`에서 직접 참조하지 않고, `lib/supabase.ts` 안에서만 사용
- 크롤러가 파싱에 실패하는 항목은 조용히 skip (전체 크롤링 중단 금지)
- Vercel Cron 호출 시 `Authorization: Bearer ${CRON_SECRET}` 헤더 검증 필수
