-- アイキャッチ画像URL・診断レコメンド用タグを追加
alter table seo_articles
  add column if not exists eyecatch_url text,
  add column if not exists tags text[] not null default '{}';

create index if not exists seo_articles_tags_idx on seo_articles using gin (tags);

-- 記事内画像・アイキャッチ画像の保存先（公開バケット）
insert into storage.buckets (id, name, public)
values ('article-images', 'article-images', true)
on conflict (id) do nothing;
