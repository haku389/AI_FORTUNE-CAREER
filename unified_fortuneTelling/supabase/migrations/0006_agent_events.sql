-- おすすめ転職エージェント(アフィリエイト案件)のインプレッション・クリックを記録するテーブル。
-- precise_diagnoses はこのリポジトリのマイグレーション管理外(別途Supabase上に作成済み)のため、
-- diagnose_id は外部キー制約を付けずゆるい参照として保持する。
-- 書き込み・読み取りはすべてservice role(supabaseAdmin)経由のAPI/管理画面からのみ行うため、
-- anon/authenticatedロール向けのポリシーは作成しない(RLS有効・deny-allのまま)。

create table if not exists agent_events (
  id uuid primary key default gen_random_uuid(),
  diagnose_id uuid,
  program_name text not null,
  event_type text not null check (event_type in ('impression', 'click')),
  source text,
  created_at timestamptz not null default now()
);

create index if not exists agent_events_program_name_idx
  on agent_events (program_name);

create index if not exists agent_events_program_name_type_idx
  on agent_events (program_name, event_type);

alter table agent_events enable row level security;
