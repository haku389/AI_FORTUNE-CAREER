-- 精密占い診断結果テーブル
-- Supabase Dashboard > SQL Editor で実行してください

CREATE TABLE IF NOT EXISTS precise_diagnoses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  -- 基本情報
  nickname TEXT NOT NULL,
  birthday DATE NOT NULL,
  birthtime TEXT,                    -- 任意（月星座の精度向上用）'HH:MM'
  zodiac_sun TEXT NOT NULL,          -- 太陽星座
  zodiac_moon TEXT,                  -- 月星座
  honmei_star TEXT,                  -- 本命星（九星気学）
  mbti_type TEXT,                    -- e.g. 'NT', 'NF', 'SJ', 'SP'
  -- 質問の回答
  answers JSONB NOT NULL DEFAULT '{}',
  -- 結果
  score_total INTEGER,               -- 総合スコア 22-97
  score_timing INTEGER,              -- タイミングスコア 22-97
  score_readiness INTEGER,           -- 準備スコア 22-97
  score_market INTEGER,              -- 市場相性スコア 22-97
  top_jobs JSONB,                    -- 向いている職種TOP3
  top_industries JSONB,              -- 向いている業界
  monthly_advice JSONB,              -- 3ヶ月アドバイス
  kansen_text TEXT,                  -- AI鑑定文
  recommended_agents JSONB,          -- おすすめエージェント
  -- 課金
  payment_id TEXT,                   -- Stripe PaymentIntent ID
  paid_at TIMESTAMPTZ,
  amount INTEGER,                    -- 支払い金額（円）
  -- メタ
  shared BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- インデックス
CREATE INDEX IF NOT EXISTS precise_diagnoses_created_at_idx ON precise_diagnoses(created_at DESC);
CREATE INDEX IF NOT EXISTS precise_diagnoses_payment_id_idx ON precise_diagnoses(payment_id) WHERE payment_id IS NOT NULL;

-- RLS（Row Level Security）
ALTER TABLE precise_diagnoses ENABLE ROW LEVEL SECURITY;

-- Service roleはすべての操作を許可
CREATE POLICY "Service role full access"
  ON precise_diagnoses
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Anon（フロントエンド）はINSERTのみ許可
CREATE POLICY "Anon insert only"
  ON precise_diagnoses
  FOR INSERT
  TO anon
  WITH CHECK (true);
