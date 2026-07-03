# SEO記事CMS — 実装記録・チェックリスト

最終更新: 2026-07-01（予約投稿機能、新規作成ページのタグ残留バグ修正）
関連設計書: [`career-uranai-content-automation-design.md`](career-uranai-content-automation-design.md)（SNS+SEO自動化の全体構想）

---

## 1. 決定事項（v1スコープ）

設計書で提案されていた「収集クローラー → 分析 → SNS/SEO自動生成 → 自動投稿」という全体構想のうち、**v1ではSEO記事のCMS機能のみ**を実装する。記事の元ネタはn8n等の外部ツールで収集し、本文は人間（または別ツール）が用意してCMSに貼り付ける運用を前提とし、サイト内でのAI下書き生成機能は今回作らない。SNS自動投稿・収集クローラー・分析エンジンは未着手（将来フェーズ）。

| 決定項目 | 内容 |
|---|---|
| v1スコープ | 記事の作成・編集・公開のみ（AI下書き生成なし） |
| 管理画面の保護方法 | 共有パスワード + Cookie（Supabase Authなどの個別アカウント認証は使わない） |
| 公開記事のURL | `/column/[slug]` |
| 記事データの保存先 | Supabase（新規テーブル `seo_articles`） |

---

## 2. 実装チェックリスト

### 完了

- [x] DBスキーマ設計・マイグレーションSQL作成（[`supabase/migrations/0001_seo_articles.sql`](../supabase/migrations/0001_seo_articles.sql)）
- [x] 管理者認証（共有パスワード方式）
  - [x] [`lib/adminAuth.ts`](../lib/adminAuth.ts) — パスワード照合・セッショントークン生成/検証
  - [x] [`proxy.ts`](../proxy.ts) — `/admin/*`・`/api/admin/*` を保護（Next.js 16の新規約。旧middleware.tsから移行済み）
  - [x] [`app/admin/login/page.tsx`](../app/admin/login/page.tsx) — ログイン画面
  - [x] [`app/api/admin/login/route.ts`](../app/api/admin/login/route.ts) / [`logout/route.ts`](../app/api/admin/logout/route.ts)
- [x] 記事管理API（service_role経由、`/admin/*`と同じCookie保護の配下）
  - [x] [`lib/supabaseAdmin.ts`](../lib/supabaseAdmin.ts) — service_roleクライアント
  - [x] [`app/api/admin/articles/route.ts`](../app/api/admin/articles/route.ts) — 一覧取得 / 新規作成
  - [x] [`app/api/admin/articles/[id]/route.ts`](../app/api/admin/articles/%5Bid%5D/route.ts) — 取得 / 更新 / 削除
- [x] 管理画面UI
  - [x] [`app/admin/articles/page.tsx`](../app/admin/articles/page.tsx) — 記事一覧（下書き/公開バッジ付き）
  - [x] [`app/admin/articles/new/page.tsx`](../app/admin/articles/new/page.tsx) — 新規作成フォーム
  - [x] [`app/admin/articles/[id]/page.tsx`](../app/admin/articles/%5Bid%5D/page.tsx) — 編集フォーム（削除ボタン付き）
  - [x] [`app/admin/articles/ArticleForm.tsx`](../app/admin/articles/ArticleForm.tsx) — 新規/編集共通フォーム（タイトル・スラッグ・メタディスクリプション・Markdown本文・公開ステータス）
- [x] 公開ページ
  - [x] [`app/column/page.tsx`](../app/column/page.tsx) — 公開記事の一覧
  - [x] [`app/column/[slug]/page.tsx`](../app/column/%5Bslug%5D/page.tsx) — 記事詳細（Markdown→HTML変換、`generateMetadata`でSEOメタ情報出力）
  - [x] `marked` パッケージ追加、`app/globals.css` に `.column-article-body` のスタイル追加
- [x] `.env.local.example` に `ADMIN_PASSWORD` / `ADMIN_SESSION_SECRET` を追記

- [x] **Supabaseマイグレーションの本番適用** — プロジェクトを再開し、`seo_articles` テーブルを作成済み（RLS有効・ポリシーなし）
- [x] **環境変数の設定**（Vercel本番環境）
  - [x] `ADMIN_PASSWORD`（生成済み・Vercel Production環境変数として登録。値はユーザーに別途共有）
  - [x] `ADMIN_SESSION_SECRET`（生成済み・Vercel Production環境変数として登録）
  - ※ `SUPABASE_SERVICE_ROLE_KEY` は既存の他機能ですでに設定済みのため追加不要
- [x] **本番デプロイ**（`vercel --prod`、2026-06-30）
- [x] 動作確認
  - [x] 未認証で `/admin/articles` → `/admin/login` にリダイレクト（307）されることを確認
  - [x] 未認証で `/api/admin/articles` → 401 が返ることを確認
  - [x] 誤ったパスワードでログイン → 401 が返ることを確認
  - [x] 正しいパスワードでログイン → Cookie発行・管理画面アクセス可能を確認
  - [x] テスト記事を作成・公開 → `/column` 一覧と `/column/test-sunday-night-blues` に反映されることを確認

- [x] アイキャッチ・本文内画像のアップロード
  - [x] Supabase Storageに公開バケット `article-images` を作成（[`supabase/migrations/0002_seo_articles_images_tags.sql`](../supabase/migrations/0002_seo_articles_images_tags.sql)）
  - [x] [`app/api/admin/upload/route.ts`](../app/api/admin/upload/route.ts) — 画像アップロードAPI（5MB制限・jpeg/png/webp/gif）
  - [x] `ArticleForm.tsx` にアイキャッチアップロード欄・本文へのカーソル位置画像挿入ボタンを追加
  - [x] `/column` 一覧・`/column/[slug]` にアイキャッチ表示、OGP画像にも反映
- [x] 記事へのタグ付け（`seo_articles.tags`, text[]）
  - [x] [`lib/articleTags.ts`](../lib/articleTags.ts) — 選択可能なタグの正式語彙（星座・転職タイプ・本命星・MBTI傾向(NT/NF/SJ/SP)・タイミング）。診断結果側で実際に生成される値と一致させてある
  - [x] `ArticleForm.tsx` をカンマ区切りのフリーテキストからドロップダウン選択+チップ表示に変更（誤字によるレコメンド漏れを防止）
- [x] コラムから診断への導線CTA
  - [x] `/column/[slug]` 末尾に「簡易診断（→`/shindan`）」「精密診断（→`/premium`）」の2ボタンを設置
- [x] 診断結果に応じた記事レコメンド
  - [x] [`lib/articleRecommend.ts`](../lib/articleRecommend.ts) — 診断結果からタグを組み立て、一致する公開記事を取得（一致なしは最新記事にフォールバック）
  - [x] [`app/api/articles/recommended/route.ts`](../app/api/articles/recommended/route.ts) — クライアントコンポーネントから利用する公開API
  - [x] `components/result/RecommendedArticles.tsx`（表示用） / `RecommendedArticlesClient.tsx`（クライアント側フェッチ）
  - [x] `/shindan/form`・`/premium/form`・`/premium/result/[id]` の結果末尾に表示。タグは星座・転職タイプ・月星座・本命星・MBTI・タイミングから自動生成
- [x] 診断フローに残っていた「星が読み解く」等の表現を修正（`/premium`, `lib/precise-questions.ts`）
- [x] 「白石玲子が/の」を「キャリア未来鑑定士が/の」に言い換え（個人名より専門職としての訴求に統一。署名・クレジット表記は除く）
- [x] 精密診断のLINEログイン画面の見出し・アイコン装飾を調整（最終的に：グラデーションリング＋ソフトグロー。光暈・星の装飾は過剰だったため削除しシンプル化）
- [x] n8n連携用API（[`docs/n8n-integration.md`](n8n-integration.md) 参照）
  - [x] [`lib/n8nAuth.ts`](../lib/n8nAuth.ts) — `Authorization: Bearer <N8N_API_KEY>` によるAPIキー認証
  - [x] `GET /api/n8n/tags` — タグ語彙の取得
  - [x] `POST /api/n8n/upload` — 画像アップロード（multipartファイル or `image_url`指定の両対応）
  - [x] `POST /api/n8n/articles` — 記事の自動作成（既定はdraft保存。語彙外タグは無視しdroppedTagsで通知）
  - [x] `N8N_API_KEY` を生成しVercel本番環境変数に設定済み
- [x] テスト記事を本番コンテンツに書き換え・公開（`/column/sunday-night-blues`、タグ: 環境改善型・安定志向型・6m・wait）
- [x] 本番デプロイ・動作確認（タグ一致レコメンド・フォールバック・アップロードAPI/n8n APIの認証保護・CTA表示・新記事URL公開・旧URL404化を確認）
- [x] タグに年齢層・性別・業種を追加
  - [x] [`lib/articleTags.ts`](../lib/articleTags.ts) に年齢層（20代前半〜40代以上、誕生日から自動算出）・性別（男性/女性/その他）・業種（精密診断Q11「これまで働いてきた業種」、複数選択可）を追加
  - [x] `buildResultTags` / `ageToTag` / `calcAgeFromBirthday` をサーバー依存のない `lib/articleTags.ts` に集約（クライアントコンポーネントから安全にimportできるようにするため、DB接続を持つ`lib/articleRecommend.ts`から分離）
  - [x] 簡易診断（性別・年齢層）、精密診断（同+業種・複数可）それぞれのタグ生成に反映。`premium/result/[id]`は`answers`カラムをSELECTに追加して業種を復元
  - [x] タグ選択ドロップダウンは、選択後に選んだ値とゴールド文字色を表示したまま保持するように変更（選択状態が一目でわかるように）
- [x] レコメンドを「完全一致のみ」から「ベストマッチ＋一致率%算出」に変更
  - [x] [`lib/articleRecommend.ts`](../lib/articleRecommend.ts) の `getRecommendedArticles` を、公開記事を一括取得してタグ一致数でスコアリング・並べ替えする方式に変更（一致ゼロでも自然に新着順へフォールバックする）
  - [x] `matchPercent`（一致タグ数 ÷ 診断結果タグ数 × 100）をデータとして算出・保持。**UIにはまだ表示していない**（計算式・有効化方法は[5章](#5-一致率matchpercentについて)を参照）
- [x] 白石玲子のメッセージ部分を吹き出し風に装飾
  - [x] [`components/result/ReikoBubble.tsx`](../components/result/ReikoBubble.tsx) — しっぽ付き吹き出しのラッパーコンポーネント
  - [x] `/shindan/form`・`/premium/form`・`/premium/result/[id]` の鑑定メッセージ部分に適用
- [x] LINEログイン画面（`/premium/form`）の最終調整
  - [x] アイコン装飾をグラデーションリングから白枠（`border: 3px solid #f0f4ff`）に変更
  - [x] 案内文（LINEアカウントが必要です…）を吹き出しで囲み、吹き出し左上に小さいアイコン+「白石玲子｜キャリア未来鑑定士」を重ねて表示する構成に変更（大きい単独アイコンは廃止し、吹き出しと一体化）
- [x] 新規作成ページ（`/admin/articles/new`）でタグ・入力内容が前回訪問時の値のまま残るバグを修正
  - [x] 原因: `dynamic = 'force-dynamic'` が付いていなかったため、Next.js App RouterのClient Router Cacheが静的ルートとして5分間キャッシュし、再訪問時に古い`ArticleForm`のReact state（前回選択したタグ等）を再利用していた。`[id]/page.tsx`（編集ページ）には元々付いていたが`new/page.tsx`に付け忘れていたのが原因
  - [x] [`app/admin/articles/new/page.tsx`](../app/admin/articles/new/page.tsx) に `export const dynamic = 'force-dynamic'` を追加。あわせて `ArticleForm.tsx` のフォームに `autoComplete="off"` を追加（ブラウザ側のフォーム値復元に対する保険）
- [x] 予約投稿機能
  - [x] DB: `seo_articles` に `scheduled_at`（timestamptz）を追加、`status` に `'scheduled'` を追加（[`supabase/migrations/0003_seo_articles_scheduled.sql`](../supabase/migrations/0003_seo_articles_scheduled.sql)）
  - [x] [`lib/articleStatus.ts`](../lib/articleStatus.ts) — status/scheduled_atの検証ロジックを共通化し、admin APIとn8n APIの両方から使う
  - [x] `app/api/admin/articles/route.ts`・`[id]/route.ts`・`app/api/n8n/articles/route.ts` すべてで `status: "scheduled"` + `scheduled_at` を受け付けるように対応
  - [x] `ArticleForm.tsx` に「下書き／予約投稿／公開」の3択と、予約投稿選択時に表示される `datetime-local` 日時ピッカーを追加。ブラウザのローカル時刻⇄ISO文字列の変換込み
  - [x] `/admin/articles` 一覧に「予約中」バッジと公開予定日時を表示
  - [x] 自動公開の仕組みは2系統を併用（**Vercel Hobbyプランはcronが1日1回までという制約があるため**、cronだけに頼らない設計にしている）:
    1. [`lib/publishScheduled.ts`](../lib/publishScheduled.ts) の `publishDueScheduledArticles()` — `scheduled_at` を過ぎた記事を公開状態に切り替えるSQL。`/column` と `/column/[slug]` へのアクセス時に毎回呼び出すため、サイト訪問さえあれば実質リアルタイムに近い遅延で反映される
    2. [`app/api/cron/publish-scheduled/route.ts`](../app/api/cron/publish-scheduled/route.ts) + [`vercel.json`](../vercel.json)（`0 3 * * *`、毎日3時）— アクセスが全くない期間があっても取りこぼさないための安全網
  - [x] `CRON_SECRET` を生成しVercel本番環境変数に設定済み（cronエンドポイントの認証、Vercelが自動でAuthorizationヘッダを付与）
  - [x] 本番で実地確認済み（2026-07-01）: 予約投稿記事を1分後の`scheduled_at`で作成 → 期限前は`/column/[slug]`が404 → 期限後に同URLへアクセスすると200で本文が表示され、自動公開を確認。cronエンドポイントは未認証401・正しいCRON_SECRETで200を確認。テスト記事はSupabaseから削除済み

### 今回作らなかったもの（将来フェーズ・設計書の構想）

- [ ] 情報収集クローラー（Google Trends / X / 知恵袋 等）
- [ ] 収集データのAIタグ付け・バズスコア/SEOスコア算出
- [ ] X / Instagram / Threads への投稿生成・予約投稿
- [ ] キーワード入力からのAI記事下書き生成（サイト内では未実装。n8n側で生成しAPI経由で投稿する運用）
- [ ] 記事内の内部リンク自動提案
- [ ] GA4 / Search Console連携による成果分析
- [ ] 複数管理者向けの個別アカウントログイン
- [ ] n8nからの自動公開（`status: "published"`）は技術的に可能だが、品質が安定するまでは下書き保存＋人間レビューを推奨

---

## 3. 使い方

1. `/admin/login` で `ADMIN_PASSWORD` に設定したパスワードを入力してログイン（7日間有効なCookieが発行される）
2. `/admin/articles` で記事一覧を確認、「+ 新規作成」で記事を追加
3. タイトル・スラッグ（半角英数字とハイフンのみ、`/column/スラッグ` が公開URLになる）・メタディスクリプション・アイキャッチ画像・本文（Markdown）・タグを入力
   - 本文中に画像を入れたい場合は「+ 画像を挿入」でカーソル位置にアップロード
   - タグは診断結果と記事を紐づけるためのもの。星座・転職タイプ・本命星・MBTI傾向・タイミング・年齢層・性別・業種の8つのドロップダウンから選ぶとチップとして追加される（フリーテキストではない）。選択するとドロップダウン自体もゴールド文字で選択値を表示する
4. 公開ステータスは「下書き」「予約投稿」「公開」の3択
   - 「公開」で保存すると、即座に `/column/[slug]` に反映される
   - 「予約投稿」を選ぶと日時ピッカーが表示される。指定した日時を過ぎると自動で公開に切り替わる（詳しくは[5章](#5-予約投稿の自動公開について)）
5. ログアウトは画面右上の「ログアウト」ボタンから

タグを設定した記事は、診断結果ページ（簡易・精密どちらも）の末尾に自動でおすすめ表示される。完全一致を要求するものではなく、一致するタグの数が多い記事ほど優先表示され、一致がまったくなければ最新の公開記事にフォールバックする。

---

## 4. データモデル

`seo_articles` テーブル（Supabase, RLS有効・ポリシーなし＝service_role経由のみアクセス可）

| カラム | 型 | 説明 |
|---|---|---|
| `id` | uuid | 主キー |
| `title` | text | 記事タイトル |
| `slug` | text | 公開URLの一部（unique） |
| `meta_description` | text | 検索結果に表示される説明文 |
| `body_md` | text | 本文（Markdown。画像は `![](URL)` 形式で埋め込み） |
| `eyecatch_url` | text | アイキャッチ画像のURL（Supabase Storage `article-images` バケット） |
| `tags` | text[] | 診断結果レコメンド用タグ（星座・転職タイプ・MBTI・本命星・タイミング・年齢層・性別・業種） |
| `status` | text | `draft` / `scheduled` / `published` |
| `scheduled_at` | timestamptz | 予約投稿の公開予定日時（`status='scheduled'` のときのみ意味を持つ） |
| `published_at` | timestamptz | 初回公開日時（公開に切り替えた時点で自動セット。予約投稿が自動公開された場合は実際に処理された時刻） |
| `created_at` / `updated_at` | timestamptz | 作成・更新日時 |

---

## 5. 予約投稿の自動公開について

`status: 'scheduled'` の記事は、`scheduled_at` を過ぎた時点で自動的に `status: 'published'` へ切り替わる。この処理（[`lib/publishScheduled.ts`](../lib/publishScheduled.ts) の `publishDueScheduledArticles()`）は2つの経路から呼ばれる。

1. **サイト訪問時のフォールバック（実質的な主経路）**: `/column` と `/column/[slug]` が呼ばれるたびに、期限が来た予約記事がないかチェックして公開する。両ページとも `revalidate = 60` のISRなので、実際にDBへ問い合わせが走るのはおおよそ60秒に1回程度（アクセスがある場合）。サイトに一定のアクセスがある限り、体感としては「指定時刻から1分前後で公開される」動きになる。
2. **Vercel Cron（安全網）**: [`app/api/cron/publish-scheduled/route.ts`](../app/api/cron/publish-scheduled/route.ts) を [`vercel.json`](../vercel.json) から `0 3 * * *`（毎日3時）で叩く。**Vercel Hobbyプランはcronの実行間隔が1日1回までに制限されており、これより頻繁な設定はデプロイ自体が失敗する**ため、この間隔にしている。アクセスが全くない期間があっても、最悪でも1日以内には回収される。

つまり体感の反映速度は「①のサイトアクセス頻度」に依存する。アクセスがほぼ常にあるサイトなら実用上ほぼリアルタイム、閑散期があっても②が保証となる。より高頻度・高精度なcron（Proプラン: 最短1分間隔）に変更したい場合は `vercel.json` の `schedule` を変更すればよい。

`published_at` には（元々の `scheduled_at` ではなく）この処理が実際に走った時刻が入る。複数記事をまとめて更新するSQLの都合上、行ごとに異なる `scheduled_at` の値をそのまま書き込めないための割り切り。ずれは通常数十秒〜数分程度。

---

## 6. 一致率（matchPercent）について

診断結果と記事のレコメンド一致度を、`lib/articleRecommend.ts` の `getRecommendedArticles` 内で `matchPercent`（0〜100の整数）として算出している。**現時点ではUI上には一切表示していない**（表示するかどうかは未決定のため）。

**作成方法（計算式）**
```
matchPercent = round(一致したタグ数 ÷ 診断結果側のタグ数 × 100)
```
例: 診断結果のタグが5個（牡羊座・キャリアアップ型・NT型・30代前半・now）あり、ある記事のタグに「牡羊座」「NT」の2個が含まれる場合 → 2/5 = 40%。
記事側のタグ数ではなく診断結果側のタグ数を分母にしているのは、「あなたの診断結果のうち何%をこの記事がカバーしているか」という、読者本人にとって直感的な指標にするため。

レコメンドの並び順自体は、この一致率の元になっている「一致タグ数」の降順（同数なら新着順）で決まる。一致がゼロの記事も候補から除外されないため、タグが何も一致しなくても自然に「最新の公開記事」がフォールバックとして表示される。

**使用方法（表示する場合）**
`ArticlePreview` 型（`lib/articleRecommend.ts`）にはすでに `matchPercent` が含まれているため、表示したくなったら [`components/result/RecommendedArticles.tsx`](../components/result/RecommendedArticles.tsx) のカード内に `{article.matchPercent}% 一致` のようなバッジを追加するだけでよい。データ取得側（API・サーバーコンポーネント）の変更は不要。

---

## 7. n8n連携に向けたメモ（2026-06-30時点の方針）

ユーザー方針: n8nでの自動情報収集をもとに、SEO記事とSNS投稿文を**並行して**生成する。記事をSNSに転用するのではなく、同じ元情報から媒体ごとに最適化した別コンテンツ（記事はSEO意識、SNSは各プラットフォームのアルゴリズム意識）を作る設計。

現状のCMSはブラウザ経由の手動投稿のみ対応（Cookie認証のフォーム送信）。n8nから直接記事を投稿したくなった場合は、別途トークン認証のAPI（例: `Authorization` ヘッダでのAPIキー照合）を `/api/admin/articles` とは別経路で用意するのが安全。現時点では未実装・未着手。

---

## 8. 管理画面の認証チェックについて（2026-07-03、当初の記載を訂正）

**当初、この章に「Cookie認証チェックが全ページ・APIルートに欠落しており、未ログインでも記事の閲覧・編集・公開・削除が可能だった」という重大な脆弱性を発見・修正したと記録していたが、これは誤りだった。** 実際にはプロジェクトルートの `proxy.ts`（Next.js 16のmiddleware相当。`config.matcher: ['/admin/:path*', '/api/admin/:path*']`）が、`app/admin/articles/page.tsx` 等の個別ページ・APIルートとは独立に、`/admin/*` と `/api/admin/*` 配下を**まとめて** `verifySessionCookie()` でガードしており、当初から未認証アクセスは全てブロックされていた（未認証時: ページは `/admin/login?next=...` へリダイレクト、APIは401）。

**誤りの原因**: 認証チェックの有無を確認した際、`grep -rln "verifySessionCookie|..." app/ lib/` のように `app/` と `lib/` 配下しか検索しておらず、プロジェクトルート直下の `proxy.ts` を見落とした。加えて、Next.jsの旧来の慣習である `middleware.ts` というファイル名で `find` していたため、Next.js 16で名称が変わった `proxy.ts` にヒットしなかった。「未ログインだと401/リダイレクトになる」という動作確認自体は当時も今も正しいが、それが自分で追加したページ/APIルート単位のチェックによるものだと誤認していた（`proxy.ts`が先に効いていたため、追加チェックの有無に関わらず同じ結果になっていた）。

**現状**: 誤って追加した6ファイル（`app/admin/articles/page.tsx` / `[id]/page.tsx` / `new/page.tsx`、`app/api/admin/articles/route.ts` / `[id]/route.ts`、`app/api/admin/upload/route.ts`）へのチェックはそのまま残している。`proxy.ts`と処理が重複するが、多層防御（`proxy.ts`の設定ミス・matcher変更漏れ等があっても個々のルートで防げる）として実害はないため、あえて削除はしていない。なお `/admin/analytics`（9章）は新規追加時にこの誤りを踏まえて `proxy.ts` 側のみに任せており、ページ側の重複チェックは付けていない。

---

## 9. 記事ごとのアナリティクス（2026-07-03）

**目的**: 記事単位で「見られているか」「読まれているか」「診断への導線として機能しているか」を可視化する。サイト全体の計測はGoogle Analyticsで別途行っているため、こちらは記事単位の内訳に特化している。

**データの流れ**: `article_events` テーブル（`0004_article_events.sql` で作成、`0005_article_events_extend.sql` で `value` 列とイベント種別を拡張）に、クライアント側から `/api/analytics/track`（認証不要・匿名イベント投稿用API）経由で1行ずつ記録する。集計は `lib/articleAnalytics.ts` の `getStatsByArticleId()` が `article_events` を全件読み出してJS側で集計する方式（記事数・イベント数がこの規模のブログでは十分な性能のため、DB側の集計ビュー等は作っていない）。

**イベント種別と発火場所**:
| event_type | 発火場所 | 内容 |
| --- | --- | --- |
| `view` | `components/column/ArticleAnalytics.tsx` | 記事ページのマウント時に1回 |
| `scroll_25`/`50`/`75`/`100` | 同上 | スクロール到達率のしきい値を初めて超えた時に1回ずつ（ページ内で複数回は発火しない） |
| `dwell_time`（`value`列に秒数） | 同上 | `visibilitychange`（タブが非表示になった時）または`pagehide`で、マウントからの経過秒数を送信 |
| `cta_click`（`cta_target`列に `quick_diagnosis`/`detailed_diagnosis`） | `components/column/TrackedCtaLink.tsx` | 記事末尾の「簡易診断する」「精密診断を見る」リンクのクリック時 |
| `recommended_impression` | `components/result/RecommendedArticles.tsx` | 診断結果画面で記事がおすすめとして表示された時（記事ごとに1回のみ） |
| `recommended_click` | 同上 | おすすめ記事リンクのクリック時 |

**管理者自身のプレビュー閲覧はカウントしない**: `app/column/[slug]/page.tsx` で `isPreview`（下書き/予約投稿を管理者が確認している状態）の時は `ArticleAnalytics` を描画しないようにしている。公開後の実アクセスのみが計測対象。

**表示箇所**:
- `/admin/articles`（一覧）: 各記事に表示回数・完読数（`scroll_100`）・75%到達数・診断遷移数を簡易表示（`ArticleListTable.tsx`）
- `/admin/analytics`（新規ページ）: 表示回数・完読率（`scroll_100 / views`）・平均滞在時間・簡易診断/精密診断への遷移数・おすすめ表示回数・おすすめ経由クリック率を、列見出しクリックでソートできる表形式（`AnalyticsTable.tsx`）で一覧表示。GA同様「どの指標で並べ替えるか」をユーザー側で選べる設計にしており、単一の合成スコアで「一番良い記事」を決め打ちすることはしていない（何を「良い」とするかは目的次第で変わるため）。

**既知の制約（意図的な割り切り）**:
- 同一訪問者が同じ記事を複数回閲覧すると `view` がその都度加算される（セッション単位の重複排除はしていない）。プレビュー除外以外のボット・重複対策は入れていない。
- `dwell_time` は「ページを開いていた時間」であり、タブを裏で開きっぱなしにした時間も含まれうる（厳密な「読んでいた時間」ではない）。
