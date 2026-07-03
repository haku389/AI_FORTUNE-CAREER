-- 記事ごとのアナリティクス(閲覧数・読了度・診断導線への遷移)を記録するテーブル。
-- 書き込み・読み取りはすべてservice role(supabaseAdmin)経由のAPI/管理画面からのみ行うため、
-- anon/authenticatedロール向けのポリシーは作成しない(RLS有効・deny-allのまま)。

create table if not exists article_events (
  id uuid primary key default gen_random_uuid(),
  article_id uuid not null references seo_articles(id) on delete cascade,
  event_type text not null check (event_type in ('view', 'scroll_25', 'scroll_50', 'scroll_75', 'scroll_100', 'cta_click')),
  cta_target text check (cta_target in ('quick_diagnosis', 'detailed_diagnosis')),
  created_at timestamptz not null default now()
);

create index if not exists article_events_article_id_idx
  on article_events (article_id);

create index if not exists article_events_article_id_type_idx
  on article_events (article_id, event_type);

alter table article_events enable row level security;
