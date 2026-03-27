@AGENTS.md

# 転職運命診断 — 開発仕様書（Claude Code 引き継ぎ用）

> このファイルはClaude Codeでの開発開始時に読み込ませる仕様書です。
> Notionの設計書（https://www.notion.so/32c69571271681559135d44d15595656）の要約版です。

---

## プロジェクト概要

- **プロダクト名**: 転職運命診断（仮）
- **運営キャラクター**: AI占い師◇ルナ（@hoshiyomi_luna）
- **目的**: 転職×占いのSNSアフィリエイト事業。簡易診断HPがメインのCV導線
- **ターゲット**: 28〜38歳の転職を迷う女性

---

## 技術スタック

| 技術 | 用途 |
|------|------|
| Next.js App Router（TypeScript） | フロントエンド |
| Tailwind CSS v4 | スタイリング |
| Supabase | DB（diagnoses テーブル） |
| Vercel | ホスティング（Hobbyプラン） |
| @vercel/og | OGP画像生成（未実装） |
| Vitest | テスト |

---

## 実装済み機能

- ランディングページ（月画像・mix-blend-mode: screen）
- 入力画面（ニックネーム + 生年月日 → 星座自動判定）
- 5問診断（惑星タグ付き）
- ローディング演出（CSSスピナー + 約6秒演出）
- 結果ページ（スコアリング・タイミング判定・鑑定文・アフィリ橋渡し）
- 1日1回制限（localStorage）+ 待機ページ + 再診断ボタン
- SNSシェア機能（X / LINE / URLコピー）
- Supabase保存API（`/api/diagnose`）

---

## ディレクトリ構成

```
uranai-shindan/
├── app/
│   ├── page.tsx                  # ランディング
│   ├── diagnosis/page.tsx        # 入力 → 質問 → 結果の全フロー
│   ├── api/diagnose/route.ts     # 診断保存API（Supabase insert）
│   └── layout.tsx
├── components/
│   ├── Stars.tsx                 # 星背景
│   ├── MoonImage.tsx             # 月画像
│   └── result/
│       ├── ScoreRing.tsx         # スコアリング（SVG円形）
│       ├── AffiliBlock.tsx       # アフィリリンク
│       └── ShareBlock.tsx        # SNSシェア
├── lib/
│   ├── zodiac.ts                 # 星座判定ロジック
│   ├── scoring.ts                # スコア計算ロジック
│   ├── questions.ts              # 5問データ定義
│   ├── kansen.ts                 # 鑑定文テンプレート（12星座×2パターン）
│   └── supabase.ts               # Supabaseクライアント＋型定義
├── public/moon.png
└── CLAUDE.md                     # このファイル
```

---

## Supabase DBスキーマ

### テーブル: `diagnoses`

```sql
CREATE TABLE diagnoses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  diagnosed_at DATE NOT NULL,
  nickname TEXT NOT NULL,
  birthday DATE NOT NULL,
  zodiac TEXT NOT NULL,
  career_type TEXT NOT NULL,       -- career / env / calling / stable
  score INTEGER NOT NULL,          -- 0〜100
  timing TEXT NOT NULL,            -- now / 3m / 6m / wait
  recommended_service TEXT,
  kansen_text TEXT,
  shared BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 1日1回制限のDB側保証
CREATE UNIQUE INDEX diagnoses_daily_unique
  ON diagnoses(diagnosed_at, nickname, birthday);
```

---

## 診断ロジック

### スコア計算（lib/scoring.ts）

```
urgency = Q1.urgency + Q3.urgency_add + Q4.urgency_add + Q5.urgency_add
score   = min(urgency × 7 + 20 + marsBonus, 97)  ← max 97
score   = max(score, 22)                           ← min 22
marsBonus = 8（suppressed or misfit のとき）

timing: urgency >= 8 → 'now'
        urgency >= 6 → '3m'
        urgency >= 3 → '6m'
        else         → 'wait'
```

### アフィリサービスマッピング

| type | サービス |
|------|---------|
| career | BIZREACH |
| env | doda |
| calling | ハタラクティブ |
| stable | マイナビ転職 |

---

## デザイントークン

- 背景: `#060914`（深い宇宙色）
- カード: `#0d1428` / `#111c36`
- ゴールド: `#c8952a` / `#f0c060`
- バイオレット: `#7c6bdc` / `#a898f8`
- フォント: Shippori Mincho / Noto Sans JP / Zen Old Mincho
- 基準デバイス: iPhone 15（390px）、max-width: 430px

---

## 実装上の注意点

1. **月画像**: `mix-blend-mode: screen` を適用。`border-radius` は使わない
2. **1日1回制限**: フロントはlocalStorage、DBはUNIQUE制約で二重保証
3. **ローディング演出**: CSSボーダースピナー（SVGは線アーティファクトが出るため禁止）
4. **ランディング**: `height: 100dvh` + `overflow: hidden`（スクロール禁止）
5. **アフィリ表示**: 「※ アフィリエイト広告を含みます」の表示必須（ステマ規制対応）
6. **API呼び出し**: fire-and-forget（失敗してもUXに影響させない）

---

## 今後の実装優先順位

### ✅ 完了
1. Next.js + Tailwind + フォント設定
2. `lib/` ロジック実装（zodiac / scoring / questions / kansen）
3. 診断フロー全体（ランディング → 入力 → 質問 → ローディング → 結果）
4. Supabase APIルート実装（`/api/diagnose/route.ts`）

### ✅ 完了（続き）
5. **Supabase接続・テーブル作成・動作確認**
   - `.env.local` に `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` / `SUPABASE_SERVICE_ROLE_KEY` を設定
   - `diagnoses` テーブル作成・RLS設定済み
   - 1日1回制限（UNIQUE制約）動作確認済み

6. **OGPシェア画像生成**（`next/og`）
   - `/app/api/og/route.tsx` 実装済み（デフォルト＋パーソナライズ対応）
   - 結果ページのシェアURLにクエリパラム付与済み
   - `layout.tsx` に `og:image` / `twitter:card: summary_large_image` 設定済み

7. **Vercelデプロイ** ✅
   - 本番URL: https://uranai-shindan.vercel.app
   - 環境変数（Supabase・SiteURL）設定済み

### 🔜 次のステップ

8. **精密診断・LINE連携**（後工程）
   - `line_users` / `precise_diagnoses` テーブル追加
   - LINE Messaging API連携

---

## MCP / ツール設定

- **Supabase MCP**: SSE transport、Personal Access Tokenで認証済み
  - 設定: `~/.claude.json`（project scope）
- **Supabase Agent Skills**: `.claude/skills/supabase-postgres-best-practices` にインストール済み
