-- SEO記事CMS用テーブル
-- アクセスはすべて service_role 経由（サーバーサイドのadmin API / 公開ページ）に限定するため、
-- RLSは有効化のみ行いポリシーは作成しない（anon/authenticatedからは一切アクセス不可）。

create table if not exists seo_articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  meta_description text,
  body_md text not null default '',
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists seo_articles_status_published_at_idx
  on seo_articles (status, published_at desc);

alter table seo_articles enable row level security;
