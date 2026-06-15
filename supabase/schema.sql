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

-- RLS 활성화
alter table news enable row level security;

-- 일반 사용자(anon key)는 읽기만 가능
create policy "public read"
  on news for select
  using (true);
