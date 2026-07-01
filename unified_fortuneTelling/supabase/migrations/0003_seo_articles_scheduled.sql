-- 予約投稿用: scheduled_at を追加し、status に 'scheduled' を許可する

alter table seo_articles
  add column if not exists scheduled_at timestamptz;

alter table seo_articles
  drop constraint if exists seo_articles_status_check;

alter table seo_articles
  add constraint seo_articles_status_check
  check (status in ('draft', 'scheduled', 'published'));

-- cron / フォールバック処理が「公開時刻が来た予約記事」を素早く探すためのインデックス
create index if not exists seo_articles_scheduled_at_idx
  on seo_articles (scheduled_at)
  where status = 'scheduled';
