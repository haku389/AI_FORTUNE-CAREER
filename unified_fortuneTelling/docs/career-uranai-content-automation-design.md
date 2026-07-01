# career-uranai.site — SNS・SEO自動運用ツール設計書

最終更新: 2026-06-30  
対象サイト: https://career-uranai.site/  
対象サービス: 転職占い・キャリア未来鑑定サイト  
運営キャラクター: 白石玲子｜キャリア未来鑑定士  
目的: SNS集客とSEO記事制作を、情報収集・分析・生成・投稿予約まで半自動化する

---

## 1. 結論

実装は可能。  
ただし、完全自動で「大量収集→大量生成→大量投稿」を行うと、SNS側ではスパム判定、SEO側では低品質・大量生成コンテンツ判定を受ける可能性があるため、初期設計は **半自動運用** を推奨する。

最適な方針は以下。

1. 情報収集は自動化する
2. 投稿案・記事案の生成も自動化する
3. 投稿前・記事公開前に人間が承認する
4. 反応データを収集して、次回の投稿テーマ・構成・タイトルに反映する
5. 勝ちパターンが見えたジャンルのみ、自動投稿の比率を上げる

---

## 2. 作りたい装置の全体像

### 2.1 目的

転職・キャリア・占い・MBTI・星座・九星気学・女性の働き方に関する情報を大量に収集し、以下を自動または半自動で作成する。

- X向け投稿
- Instagram向け投稿文
- Instagram画像/カルーセル構成案
- Threads向け投稿
- LINE配信用メッセージ
- SEO記事の企画書
- SEO記事本文
- 記事からSNS投稿への再利用
- SNS反応からSEO記事テーマへの逆流入

### 2.2 サイトとの接続方針

既存サイトは、誕生日・出生時刻・MBTI・転職質問から「転職タイミング」「転職スコア」「向いている業界・職種」を診断し、白石玲子の語り口で鑑定文を表示し、転職アフィリエイトへ送客する設計である。  
そのため、新規ツールも以下の導線に寄せる。

```text
SNS投稿 / SEO記事
  ↓
共感・不安の言語化
  ↓
無料診断 / 精密診断へ誘導
  ↓
診断結果で納得感を作る
  ↓
転職エージェント・転職サイトへ送客
  ↓
LINE登録・再訪・追加配信
```

---

## 3. 重要な前提

### 3.1 完全自動より半自動が安全

SNSの自動投稿自体は可能だが、Xでは重複・スパム的な自動投稿、トレンド操作、無許可の自動返信などが制限対象になる。特にキーワード検索に反応して大量に自動返信する運用は避けるべき。

また、Googleは生成AIによるコンテンツ作成自体を禁止していないが、ユーザー価値を追加しない大量生成ページはスパムポリシーに抵触し得る。したがって、SEO記事は「収集データ」「独自分析」「診断導線」「白石玲子の見解」を加えて、単なるAI記事にしない。

### 3.2 バズる設計は「予測」ではなく「検証」で作る

何百件もの投稿や記事を収集しても、必ずバズる投稿を事前に完全予測することはできない。  
ただし、以下のようなスコアリングにより、バズる確率が高い投稿案を優先することは可能。

- 共感性
- 保存したくなる実用性
- コメントしたくなる問い
- 反論・議論が起きる余白
- ターゲットの悩みとの一致度
- 診断への誘導しやすさ
- 転職アフィリエイトへの接続しやすさ
- 季節性・曜日性
- 過去投稿との類似度の低さ

---

## 4. 推奨システム構成

### 4.1 全体アーキテクチャ

```text
[情報収集クローラー]
    ↓
[収集データDB]
    ↓
[分類・要約・トレンド抽出AI]
    ↓
[企画生成エンジン]
    ↓
[SNS投稿生成エンジン]       [SEO記事生成エンジン]
    ↓                         ↓
[人間レビュー画面]             [人間レビュー画面]
    ↓                         ↓
[予約投稿 / 下書き保存]        [CMS下書き保存]
    ↓                         ↓
[反応データ取得]               [GA/Search Console計測]
    ↓                         ↓
[学習・改善DB]
```

### 4.2 技術スタック候補

既存サイトが Next.js + Supabase + Claude API の構成なので、追加ツールもこの構成に寄せると管理しやすい。

| 領域 | 推奨技術 |
|---|---|
| 管理画面 | Next.js App Router |
| DB | Supabase PostgreSQL |
| AI生成 | Claude API / OpenAI API |
| 定期実行 | Vercel Cron / Supabase Edge Functions / GitHub Actions / Cloud Run Jobs |
| キュー | Supabase Queue相当のテーブル / Cloud Tasks / Upstash Redis |
| SNS投稿管理 | 各SNS API、またはBuffer等の投稿予約ツール連携 |
| SEO公開 | Next.js内の記事MDX生成 / CMS連携 / Supabase保存 |
| 分析 | GA4 / Search Console / SNS API / 手動CSVインポート |
| 画像生成 | 画像生成API / Canvaテンプレ / next/og |

---

## 5. 情報収集ツールの設計

### 5.1 収集対象カテゴリ

収集対象は「転職占い」に近いテーマに限定する。広げすぎるとサイトの専門性が薄くなる。

#### A. 転職・キャリア領域

- 転職理由
- 退職理由
- 会社を辞めたい瞬間
- 20代後半のキャリア不安
- 30代女性の転職
- 未経験転職
- 年収アップ転職
- 人間関係の悩み
- 仕事の限界サイン
- 日曜夜の憂鬱
- 職場のストレス
- 自己分析
- 面接対策
- 転職エージェント比較
- 女性の働き方
- ライフイベントとキャリア

#### B. 占い・診断領域

- 星座別仕事運
- 星座別向いている仕事
- 月星座と働き方
- 九星気学と転職時期
- MBTI別向いている職業
- MBTI別職場ストレス
- MBTI別転職タイミング
- 2026年の仕事運
- 今月の転職運

#### C. SNS反応が取りやすい感情領域

- 「もう辞めたい」と思う瞬間
- 上司との相性
- 評価されないつらさ
- 仕事が合わないサイン
- 頑張っているのに報われない
- 30代でキャリア迷子
- 転職したいけど怖い
- 自分に向いている仕事がわからない
- 会社に行きたくない朝
- 周りと比べて焦る

### 5.2 収集ソース候補

| ソース | 用途 | 注意点 |
|---|---|---|
| Google検索結果 | SEO競合・記事構成調査 | スクレイピング規約に注意。検索API利用推奨 |
| Google Trends | 季節性・上昇ワード把握 | 競合性は別途確認 |
| ラッコキーワード | 関連KW抽出 | API/CSV連携が便利 |
| Yahoo!知恵袋 | 悩みの生データ | 引用ではなく要約・分類に使う |
| X検索 | リアルタイム悩み・言い回し収集 | 自動返信や大量接触は禁止方向で設計 |
| Instagram/Threads | 保存されやすい構成分析 | 公式API制限あり。手動収集も併用 |
| YouTubeコメント | 悩み・共感ワード抽出 | 引用ではなく傾向分析に使う |
| 厚労省・公的資料 | 信頼性補強 | SEO記事の根拠として使用 |
| 転職サービス公式コラム | アフィリエイト導線に近い記事分析 | コピペ厳禁。構成傾向のみ分析 |

### 5.3 収集データの最小単位

1件の収集データを以下の形で保存する。

```ts
type CollectedItem = {
  id: string;
  source_type: 'google' | 'x' | 'instagram' | 'threads' | 'youtube' | 'chiebukuro' | 'official' | 'manual';
  source_url?: string;
  source_title?: string;
  raw_text: string;
  captured_at: string;
  published_at?: string;
  author_name?: string;
  metrics?: {
    likes?: number;
    reposts?: number;
    comments?: number;
    views?: number;
    saves?: number;
  };
  detected_topics: string[];
  detected_emotions: string[];
  detected_persona: '28-38女性' | '20代若手' | '30代管理職手前' | '未経験転職' | '不明';
  legal_use: 'analysis_only' | 'quote_allowed' | 'official_reference';
};
```

### 5.4 収集量の目安

初期は以下の規模で十分。

| 期間 | 収集量 | 目的 |
|---|---:|---|
| 初期1週間 | 300〜500件 | 悩み・表現・競合構成の把握 |
| 運用開始後 | 毎日50〜100件 | 新しい話題・季節性の把握 |
| 月次 | 1,500〜3,000件 | 勝ちパターン分析 |

---

## 6. 収集データの分析設計

### 6.1 分析タグ

収集したデータにはAIで以下のタグを付与する。

```ts
type ContentAnalysis = {
  item_id: string;
  summary: string;
  primary_topic: string;
  sub_topics: string[];
  emotion_tags: string[];
  search_intent: 'know' | 'compare' | 'do' | 'diagnose' | 'buy' | 'worry';
  sns_angle: '共感' | '保存' | '診断' | 'チェックリスト' | 'ストーリー' | '逆説' | '体験談風';
  seo_angle: '解説' | '比較' | '原因' | '対処法' | '診断誘導' | 'ランキング';
  affiliate_fit: 1 | 2 | 3 | 4 | 5;
  diagnosis_fit: 1 | 2 | 3 | 4 | 5;
  buzz_potential: 1 | 2 | 3 | 4 | 5;
  risk_flags: string[];
};
```

### 6.2 バズポテンシャルの評価軸

SNS用に以下のようなスコアを作る。

```ts
type BuzzScore = {
  empathy: number;          // 共感されやすさ
  save_value: number;       // 保存されやすさ
  comment_value: number;    // コメントされやすさ
  share_value: number;      // シェアされやすさ
  controversy_safe: number; // 炎上ではなく議論が起きる余白
  persona_match: number;    // 28〜38歳女性との一致度
  diagnosis_cta_fit: number;// 診断誘導との相性
  uniqueness: number;       // 既存投稿との重複回避
  total: number;
};
```

### 6.3 SEOポテンシャルの評価軸

SEO用には以下のスコアを作る。

```ts
type SeoScore = {
  keyword_demand: number;       // 検索需要
  competition_gap: number;      // 競合が弱い余地
  affiliate_fit: number;        // 転職案件との接続度
  diagnosis_fit: number;        // 診断への誘導しやすさ
  expertise_addition: number;   // 白石玲子の見解を足せる余地
  internal_link_fit: number;    // /guide や /shindan への内部リンク相性
  seasonality: number;          // 季節性
  total: number;
};
```

---

## 7. SNS投稿生成ツールの設計

### 7.1 投稿カテゴリ

白石玲子アカウントでは、以下の投稿カテゴリを回す。

| カテゴリ | 目的 | 例 |
|---|---|---|
| 共感投稿 | フォロー・いいね獲得 | 「日曜の夜に涙が出そうなら、仕事との相性を見直す合図です」 |
| チェックリスト | 保存獲得 | 「転職を考えていいサイン7つ」 |
| MBTI別投稿 | シェア・コメント獲得 | 「INFJが職場で疲れやすい理由」 |
| 星座別投稿 | 占い好き層獲得 | 「乙女座さんが転職で妥協しない方がいい条件」 |
| 九星気学投稿 | 独自性 | 「本命星で見る、動く時期・待つ時期」 |
| 体験談風投稿 | 共感・滞在時間 | 「32歳、転職したいのに動けなかった私へ」 |
| 診断誘導投稿 | CV獲得 | 「今動くべきか迷う方は、転職タイミング診断へ」 |
| SEO記事誘導 | サイト流入 | 記事の要点を短く投稿 |

### 7.2 X投稿テンプレート

#### 共感型

```text
「今の職場、嫌いなわけじゃない」

それでも日曜の夜に胸が重くなるなら、
あなたの心はもう次の場所を探し始めているのかもしれません。

転職は逃げではなく、
自分を守る選択になることもあります。

白石玲子
```

#### チェックリスト型

```text
転職を考えていいサイン

・日曜の夜が毎週つらい
・評価されても嬉しくない
・成長より消耗が大きい
・上司の一言に一日引きずられる
・3年後の自分を想像できない

3つ以上当てはまるなら、
今すぐ辞めるではなく、まず「次の可能性」を見てもいい時期です。
```

#### 診断誘導型

```text
転職で大切なのは、
「辞めるかどうか」よりも
「いつ動くか」です。

今は動く時期なのか。
それとも準備の時期なのか。

迷っている方は、
無料の転職タイミング診断で確認してみてください。
```

### 7.3 Instagramカルーセル構成テンプレート

```text
1枚目: 30代女性が転職を考えていいサイン7つ
2枚目: サイン1 日曜の夜がつらい
3枚目: サイン2 評価されても嬉しくない
4枚目: サイン3 仕事後に何もできない
5枚目: サイン4 相談できる人がいない
6枚目: サイン5 将来像が見えない
7枚目: すぐ辞める必要はありません
8枚目: まずは、今が動く時期かを見てみましょう
9枚目: 無料診断CTA
```

### 7.4 投稿生成プロンプト

```text
あなたは「白石玲子｜キャリア未来鑑定士」として、28〜38歳女性向けに転職・キャリア・占いを組み合わせたSNS投稿を作成します。

条件:
- 一人称は「私」
- 丁寧だが堅すぎない「です・ます」調
- 不安を煽りすぎない
- 「絶対に転職すべき」と断定しない
- 占い感は強すぎず、キャリアアドバイザー寄り
- 最後に自然な診断誘導を入れる場合がある
- 医療・法律・金融の断定は避ける
- アフィリエイト色を出しすぎない

入力:
- 収集データ要約: {{summary}}
- ターゲット感情: {{emotion}}
- 投稿目的: {{goal}}
- 投稿媒体: {{platform}}
- CTA: {{cta}}

出力:
- 投稿本文
- フックの意図
- 想定される反応
- ハッシュタグ案
- リスクチェック
```

---

## 8. SEO記事生成ツールの設計

### 8.1 記事タイプ

| 記事タイプ | 例 | 目的 |
|---|---|---|
| 悩み解決記事 | 仕事辞めたいけど怖い時の考え方 | SEO流入 |
| 診断誘導記事 | 転職タイミングを見極める方法 | 診断CV |
| MBTI記事 | INFJに向いている仕事とは | SNS拡散・SEO両方 |
| 星座記事 | 乙女座に向いている働き方 | 占い流入 |
| 比較記事 | 転職サイトと転職エージェントの違い | アフィリエイトCV |
| 季節記事 | 2026年7月の仕事運・転職運 | 定期流入 |
| まとめ記事 | 30代女性におすすめの転職準備 | CV導線 |

### 8.2 SEO記事の基本構成

```text
# H1: 対策キーワードを含むタイトル

導入文
- 読者の悩みに共感
- 結論を簡潔に提示
- 記事でわかることを提示
- 診断への自然な導線を軽く置く

## H2-1: 読者の悩み・検索意図への回答
## H2-2: 原因・背景
## H2-3: 判断基準・チェックリスト
## H2-4: 選択肢・対処法
## H2-5: 白石玲子からのキャリア未来鑑定コメント
## H2-6: 転職を考える場合に使えるサービス
## H2-7: 無料診断へのCTA

まとめ
- 重要ポイントの再整理
- 急かさず、次の一歩を提案
```

### 8.3 記事生成時の必須要素

- 検索意図に答える
- 競合記事の見出しをそのまま真似しない
- 診断サイト独自の視点を入れる
- 白石玲子のコメントを入れる
- 占い要素は補助的に使う
- 転職アフィリエイトへの導線は自然にする
- 記事末尾だけでなく本文中にも内部リンクを置く
- 体験談風の架空事例を使う場合は「例」と明示する

### 8.4 SEO記事生成プロンプト

```text
あなたは career-uranai.site のSEO記事作成AIです。

サイト概要:
- 転職するか迷っている人向けの占い×転職診断サービス
- 白石玲子｜キャリア未来鑑定士が語る形式
- 収益導線は転職エージェント・転職サイトのアフィリエイト
- 主要ターゲットは28〜38歳女性

記事条件:
- 日本語
- 読者の悩みに寄り添う
- 不安を煽りすぎない
- 転職を断定的にすすめない
- AI大量生成感を出さない
- 独自視点として「転職タイミング」「MBTI」「星座」「九星気学」のいずれかを自然に入れる
- 最後に無料診断または精密診断へ誘導する

入力:
- 対策キーワード: {{keyword}}
- 関連キーワード: {{related_keywords}}
- 収集データの要約: {{research_summary}}
- 競合記事の共通見出し: {{competitor_headings}}
- 差別化ポイント: {{differentiation}}
- 推奨アフィリエイト案件: {{affiliate_items}}

出力:
1. タイトル案5個
2. メタディスクリプション
3. 記事構成
4. 本文
5. 内部リンク案
6. SNS再利用案
7. ファクトチェック項目
```

---

## 9. 管理画面の設計

### 9.1 画面一覧

| 画面 | 機能 |
|---|---|
| ダッシュボード | 今日の収集件数、投稿候補、記事候補、成果 |
| 収集データ一覧 | ソース、悩みタグ、反応数、要約を確認 |
| トレンド分析 | 急上昇ワード、共感ワード、保存されやすいテーマ |
| 投稿案一覧 | SNS投稿の候補を確認・編集・承認 |
| 投稿カレンダー | X/Instagram/LINEの配信予定を管理 |
| SEO記事案一覧 | KW、構成、優先度、CV導線を確認 |
| 記事エディタ | AI本文を編集し、Next.js用MD/MDXに変換 |
| 成果分析 | 投稿別・記事別のクリック/CV/診断開始数を確認 |
| プロンプト管理 | 白石玲子の口調、CTA、禁止表現を管理 |

### 9.2 投稿案一覧の項目

```ts
type GeneratedPost = {
  id: string;
  platform: 'x' | 'instagram' | 'threads' | 'line';
  status: 'draft' | 'approved' | 'scheduled' | 'posted' | 'rejected';
  content_body: string;
  carousel_slides?: string[];
  image_prompt?: string;
  hashtags: string[];
  cta_url?: string;
  source_item_ids: string[];
  buzz_score: number;
  risk_score: number;
  scheduled_at?: string;
  posted_at?: string;
  metrics?: {
    impressions?: number;
    likes?: number;
    comments?: number;
    shares?: number;
    saves?: number;
    clicks?: number;
    diagnosis_starts?: number;
  };
};
```

### 9.3 SEO記事一覧の項目

```ts
type SeoArticleDraft = {
  id: string;
  keyword: string;
  title: string;
  slug: string;
  status: 'idea' | 'outline' | 'draft' | 'review' | 'published' | 'noindex';
  target_persona: string;
  search_intent: string;
  article_type: string;
  outline_md: string;
  body_md: string;
  internal_links: string[];
  affiliate_links: string[];
  seo_score: number;
  fact_check_status: 'pending' | 'checked' | 'needs_revision';
  published_at?: string;
};
```

---

## 10. DB設計案

### 10.1 テーブル一覧

| テーブル | 用途 |
|---|---|
| `content_sources` | 収集元の管理 |
| `collected_items` | 収集した投稿・記事・悩みデータ |
| `content_analyses` | AIによるタグ付け・スコアリング結果 |
| `content_clusters` | 類似テーマのクラスタ |
| `generated_posts` | SNS投稿案 |
| `post_schedules` | 投稿予約 |
| `seo_keywords` | SEOキーワード管理 |
| `seo_article_drafts` | SEO記事案・本文 |
| `affiliate_items` | 案件管理 |
| `prompt_templates` | AIプロンプト管理 |
| `performance_metrics` | 成果データ |
| `review_logs` | 承認・修正履歴 |

### 10.2 `collected_items`

```sql
create table collected_items (
  id uuid primary key default gen_random_uuid(),
  source_type text not null,
  source_url text,
  source_title text,
  raw_text text not null,
  raw_metrics jsonb default '{}',
  author_name text,
  published_at timestamptz,
  captured_at timestamptz default now(),
  legal_use text default 'analysis_only',
  hash text unique,
  created_at timestamptz default now()
);
```

### 10.3 `content_analyses`

```sql
create table content_analyses (
  id uuid primary key default gen_random_uuid(),
  item_id uuid references collected_items(id) on delete cascade,
  summary text,
  primary_topic text,
  sub_topics text[],
  emotion_tags text[],
  search_intent text,
  sns_angle text,
  seo_angle text,
  affiliate_fit int,
  diagnosis_fit int,
  buzz_potential int,
  risk_flags text[],
  created_at timestamptz default now()
);
```

### 10.4 `generated_posts`

```sql
create table generated_posts (
  id uuid primary key default gen_random_uuid(),
  platform text not null,
  status text default 'draft',
  content_body text not null,
  carousel_slides jsonb,
  image_prompt text,
  hashtags text[],
  cta_url text,
  source_item_ids uuid[],
  buzz_score numeric,
  risk_score numeric,
  scheduled_at timestamptz,
  posted_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

### 10.5 `seo_article_drafts`

```sql
create table seo_article_drafts (
  id uuid primary key default gen_random_uuid(),
  keyword text not null,
  title text not null,
  slug text unique not null,
  status text default 'idea',
  target_persona text,
  search_intent text,
  article_type text,
  outline_md text,
  body_md text,
  internal_links text[],
  affiliate_links text[],
  seo_score numeric,
  fact_check_status text default 'pending',
  published_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

---

## 11. 自動化フロー

### 11.1 毎朝の自動収集

```text
毎日 06:00
  ↓
Google Trends / ラッコKW / X / 知恵袋 / 競合記事を収集
  ↓
重複除去
  ↓
AIで要約・タグ付け
  ↓
トレンドクラスタを作成
  ↓
投稿候補20件・記事候補5件を生成
```

### 11.2 SNS投稿生成

```text
収集データ
  ↓
悩みクラスタ抽出
  ↓
投稿カテゴリ選択
  ↓
X投稿 / Instagram構成 / LINE文面を生成
  ↓
バズスコア・リスクスコア計算
  ↓
管理画面で承認
  ↓
予約投稿
```

### 11.3 SEO記事生成

```text
SEOキーワード候補
  ↓
検索意図分類
  ↓
競合見出し抽出
  ↓
差別化ポイント生成
  ↓
記事構成生成
  ↓
本文生成
  ↓
ファクトチェック
  ↓
人間レビュー
  ↓
公開 / 下書き保存
```

### 11.4 反応データの学習

```text
投稿・記事公開
  ↓
24時間 / 72時間 / 7日後に成果取得
  ↓
クリック率・診断開始率・CV率を保存
  ↓
投稿カテゴリ・フック・CTA別に分析
  ↓
次回生成時の重みに反映
```

---

## 12. 投稿頻度の推奨

### 12.1 初期運用

| 媒体 | 頻度 | 内容 |
|---|---:|---|
| X | 1日3〜5投稿 | 共感・チェックリスト・診断誘導 |
| Instagram | 週3〜5投稿 | カルーセル中心 |
| Threads | 1日1〜3投稿 | X投稿の自然変換 |
| LINE | 週1〜2配信 | 診断済みユーザー向け |
| SEO記事 | 週2〜3本 | 悩み系・MBTI系・星座系 |

### 12.2 避けるべき運用

- 同じ文面を複数アカウントで連投
- トレンドワードに自動で便乗投稿
- キーワード検索に自動返信
- アフィリエイトリンクだけの投稿
- AI生成記事を確認なしで大量公開
- 引用元の文章をほぼそのまま使う
- 「絶対当たる」「必ず転職成功」などの断定表現

---

## 13. 収益化導線の設計

### 13.1 SNSからの導線

```text
共感投稿
  ↓
プロフィール遷移
  ↓
無料診断
  ↓
診断結果
  ↓
精密診断 / 転職エージェント
  ↓
LINE登録
```

### 13.2 SEO記事からの導線

```text
検索流入
  ↓
悩み解決記事
  ↓
チェックリスト
  ↓
無料診断CTA
  ↓
診断結果
  ↓
タイプ別転職サービス紹介
```

### 13.3 CTA文言例

```text
今すぐ転職するかどうかを決める必要はありません。
まずは、あなたにとって「動く時期」なのか「整える時期」なのかを見てみましょう。
```

```text
迷いが続いている方は、無料の転職タイミング診断で、今の心の状態と次の一歩を確認してみてください。
```

---

## 14. 白石玲子の投稿トーンルール

### 14.1 基本ルール

- 一人称は「私」
- 名前表記は「白石玲子」
- 肩書きは「キャリア未来鑑定士」
- 占い師ではなく、転職アドバイザー寄り
- 丁寧だが親しみやすい
- 読者を焦らせない
- 転職を無理にすすめない
- 最後は「次の一歩」を軽く提案する

### 14.2 禁止表現

- 絶対に転職すべき
- 今すぐ辞めないと危険
- 必ず年収が上がる
- この星座は転職に失敗する
- このMBTIはこの仕事に向いていない
- 登録しないと損
- 100%当たる

### 14.3 推奨表現

- 「〜かもしれません」
- 「一度見直してもよい時期です」
- 「焦って決める必要はありません」
- 「まずは可能性を知ることから始めてみましょう」
- 「星の流れとしては、整える時期に入っています」
- 「キャリアの選択肢を広げるサインです」

---

## 15. API・規約面の注意

### 15.1 X

Xでは、外部情報を元にした自動投稿や情報・エンタメ目的の自動投稿は条件付きで可能。ただし、重複投稿、スパム、トレンド操作、誤解を招くリンク、自動メンション・自動返信には注意が必要。

実装方針:

- 通常投稿の予約投稿は可能
- 自動返信は原則やらない
- キーワード検索からの自動リプライは禁止運用にする
- 同一文面の再投稿を避ける
- 投稿承認フローを入れる
- 必要に応じて自動運用アカウントであることをプロフィールに明記する

### 15.2 Instagram

InstagramのContent Publishing APIは、Business/Creator系アカウントでの投稿公開に使える。公式仕様ではAPI経由の公開数制限があるため、投稿予約ツールまたは公式APIに合わせて設計する。

実装方針:

- まずは画像・カルーセル構成案を生成
- 投稿は手動または予約ツール経由
- 公式API連携は第2段階
- 画像生成はテンプレ化し、文字量を抑える

### 15.3 LINE

LINE Messaging APIは月間の無料メッセージ通数や料金プランの制限がある。日本の例では無料プラン・有料プランごとに無料通数が異なり、超過時は送信できない場合がある。

実装方針:

- 全員一斉配信ではなく、診断結果タイプ別にセグメント配信する
- 週1〜2回程度に抑える
- 配信前に月間通数を確認する
- ブロック率・クリック率を追う

### 15.4 SEO

Googleは生成AIコンテンツそのものを禁止していないが、価値のない大量生成ページは問題になり得る。特に転職・キャリアは人生に影響するため、誤情報や過度な断定を避ける。

実装方針:

- 収集データをもとに独自分析を入れる
- ファクトチェックを必須にする
- 公的資料や公式資料を参照する
- 著者/監修風のプロフィールを整備する
- 記事ごとに「白石玲子の視点」を入れる
- 診断結果や自サイト内データを活用して独自性を高める

---

## 16. MVP開発手順

### Phase 1: 手動レビュー前提の生成ツール

期間目安: 1〜2週間

実装内容:

- Supabaseに収集データテーブル作成
- 手動CSV/URL入力で収集データ登録
- AIで要約・タグ付け
- X投稿案を10件生成
- SEO記事構成を3件生成
- 管理画面で確認できる状態にする

### Phase 2: 自動収集・投稿カレンダー

期間目安: 2〜4週間

実装内容:

- Google Trends / ラッコKW / RSS / 公的資料の自動収集
- SNS投稿候補の自動生成
- 投稿カレンダー作成
- 承認ステータス管理
- 投稿文の重複チェック
- CTA URL自動付与

### Phase 3: SEO記事下書き生成

期間目安: 3〜6週間

実装内容:

- キーワードDB
- 競合見出し取得
- 記事構成生成
- 本文生成
- 内部リンク提案
- アフィリエイトリンク提案
- MD/MDXとしてエクスポート

### Phase 4: 成果学習

期間目安: 1〜2ヶ月

実装内容:

- GA4/Search Console連携
- SNS成果のCSV/API取り込み
- 投稿タイプ別CTR分析
- 診断開始率分析
- CVに近いテーマの抽出
- 次回生成プロンプトへの反映

### Phase 5: 一部自動投稿

期間目安: 成果が安定してから

実装内容:

- 承認済み投稿のみ自動予約
- X通常投稿の自動化
- Instagramは予約ツールまたはAPI連携
- LINEはセグメント配信
- 投稿後の自動成果取得

---

## 17. 最初に作るべき最小機能

最初から全自動にせず、以下の5機能を先に作るのがよい。

1. **情報収集メモDB**  
   URL・本文・反応数・テーマを保存する。

2. **AIタグ付け機能**  
   悩み、感情、SNS向き、SEO向き、アフィリエイト適性を判定する。

3. **X投稿案生成機能**  
   1テーマから5パターン作る。

4. **SEO記事構成生成機能**  
   1キーワードからタイトル・見出し・CTAを作る。

5. **承認画面**  
   投稿する/修正する/ボツにするを選べる。

---

## 18. ディレクトリ構成案

既存のNext.jsアプリに追加する場合。

```text
unified_fortuneTelling/
  app/
    admin/
      content-lab/
        page.tsx
      content-lab/posts/
        page.tsx
      content-lab/articles/
        page.tsx
      content-lab/sources/
        page.tsx
    api/
      content-lab/
        collect/route.ts
        analyze/route.ts
        generate-posts/route.ts
        generate-article/route.ts
        schedule-post/route.ts
        metrics/route.ts
  lib/
    content-lab/
      collectors/
        google-trends.ts
        rakko.ts
        x-search.ts
        rss.ts
      analyzers/
        classify.ts
        score-buzz.ts
        score-seo.ts
      generators/
        generate-x-post.ts
        generate-instagram-carousel.ts
        generate-seo-outline.ts
        generate-seo-article.ts
      prompts/
        reiko-sns.ts
        reiko-seo.ts
        risk-check.ts
      publishing/
        x.ts
        instagram.ts
        line.ts
      metrics/
        ga4.ts
        search-console.ts
        social.ts
  supabase/
    migrations/
      content_lab_tables.sql
```

---

## 19. 具体的な生成例

### 19.1 収集データのクラスタ例

```text
クラスタ名: 日曜夜の憂鬱
件数: 126件
主な感情: 不安、焦り、消耗、孤独
SNS角度: 共感投稿、チェックリスト
SEO角度: 原因、対処法、転職判断
診断誘導相性: 5/5
アフィリエイト相性: 4/5
```

### 19.2 X投稿案

```text
日曜の夜に、理由もなく心が重くなる。

それは「弱さ」ではなく、
今の働き方と心のリズムが少しずれているサインかもしれません。

すぐに辞める必要はありません。
でも、次の可能性を見ておくことは、
自分を守る準備になります。

白石玲子
```

### 19.3 SEO記事案

```text
対策キーワード: 日曜 夜 仕事 行きたくない
タイトル: 日曜の夜に仕事へ行きたくないのは甘え？原因と転職を考える前に確認したいこと
記事タイプ: 悩み解決 + 診断誘導
CTA: 転職タイミング診断
内部リンク: /shindan, /guide/mbti, /guide/combination
アフィリエイト導線: 環境改善型向け転職エージェント
```

---

## 20. 成果指標

### 20.1 SNS指標

- インプレッション
- いいね率
- 保存率
- コメント率
- プロフィール遷移率
- 診断ページクリック率
- 診断開始率
- 診断完了率
- LINE登録率
- アフィリエイトクリック率

### 20.2 SEO指標

- 表示回数
- 掲載順位
- CTR
- 診断ページ遷移率
- 滞在時間
- 記事内CTAクリック率
- アフィリエイトクリック率
- 記事公開から7日/30日/90日の伸び

### 20.3 最重要指標

最終的には以下を重視する。

```text
SNS投稿/SEO記事 → 診断開始 → 診断完了 → アフィリエイトクリック
```

単純な「いいね数」や「PV数」ではなく、診断・送客につながるテーマを優先する。

---

## 21. リスクと対策

| リスク | 内容 | 対策 |
|---|---|---|
| SNSスパム判定 | 同じ投稿や過剰投稿 | 重複チェック、投稿間隔、承認制 |
| SEO低品質判定 | AI記事の大量公開 | 独自分析、ファクトチェック、人間レビュー |
| 著作権リスク | 収集元の文章を流用 | 要約・分類のみ利用。引用は最小限 |
| 炎上リスク | 転職不安を煽る | 断定禁止、リスクチェック |
| アフィリエイト色が強すぎる | 信頼低下 | 記事・診断価値を先に出す |
| 誤情報 | 転職制度や労働情報の誤り | 公的資料・公式情報で確認 |
| LINE費用増 | 配信数増加 | セグメント配信、月間通数管理 |
| キャラ崩れ | 白石玲子の口調がぶれる | プロンプトと禁止表現を固定 |

---

## 22. 実装優先順位

### 最優先

1. 収集データDB
2. AIタグ付け
3. 投稿案生成
4. SEO構成生成
5. 承認画面

### 次点

6. 投稿カレンダー
7. 記事本文生成
8. MD/MDXエクスポート
9. GA/Search Console連携
10. SNS成果取り込み

### 後回し

11. X自動投稿
12. Instagram API投稿
13. LINEセグメント自動配信
14. 完全自動記事公開
15. 強化学習的な自動改善

---

## 23. 最終方針

このツールは、単なるAI投稿量産装置ではなく、**転職に迷う女性の悩みを大量に観測し、白石玲子の言葉として共感・診断・送客へ変換するコンテンツ運用エンジン**として作るべき。

初期段階では、以下の運用が最も現実的。

```text
情報収集: 自動
分析: 自動
投稿案生成: 自動
記事構成生成: 自動
本文生成: 半自動
公開: 人間承認
成果分析: 自動
改善: 半自動
```

これにより、SNS規約・SEO品質・キャラクター品質を守りながら、投稿数と記事数を増やせる。

---

## 24. 参考情報

- Google Search Central: Google Search's guidance on using generative AI content on your website
- X Help Center: X's automation development rules
- Meta for Developers: Instagram Content Publishing
- LINE Developers: Messaging APIの料金
