-- アナリティクスダッシュボード用に、記事イベントの種類と数値項目を拡張する。
-- dwell_time(滞在秒数)は value に格納し、cta_target は cta_click 専用のまま維持する。

alter table article_events
  add column if not exists value integer;

alter table article_events
  drop constraint if exists article_events_event_type_check;

alter table article_events
  add constraint article_events_event_type_check
  check (event_type in (
    'view',
    'scroll_25', 'scroll_50', 'scroll_75', 'scroll_100',
    'cta_click',
    'dwell_time',
    'recommended_impression',
    'recommended_click'
  ));
