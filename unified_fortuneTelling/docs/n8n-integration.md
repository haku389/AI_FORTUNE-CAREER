# n8n連携 — SEO記事の自動投稿API

最終更新: 2026-07-01（予約投稿対応、タグ語彙に年齢層/性別/業種を追加）
関連: [`cms-implementation-log.md`](cms-implementation-log.md)、[`career-uranai-content-automation-design.md`](career-uranai-content-automation-design.md)

n8nの自動情報収集→記事生成フローから、SEO記事CMS（`seo_articles`）へ直接記事を投稿するための専用API。`/admin`のCookieログインとは別系統で、APIキー認証のみで動作する。

---

## 1. 認証

すべてのエンドポイントで、HTTPヘッダに以下を付与する。

```
Authorization: Bearer <N8N_API_KEY>
```

`N8N_API_KEY` はVercel本番環境変数に設定済み（値は別途共有）。n8nのHTTP Requestノードでは「Authentication: Generic Credential Type → Header Auth」または「Bearer Token」で設定する。

キーが一致しない場合はすべてのエンドポイントが `401 { "error": "unauthorized" }` を返す。

---

## 2. エンドポイント一覧

### `GET /api/n8n/tags`

選択可能なタグの語彙を取得する。記事生成プロンプトに埋め込み、LLMが語彙外のタグを作らないよう制約するのに使う。

**レスポンス例:**
```json
{
  "tagGroups": [
    { "name": "星座（太陽・月）", "options": [{ "value": "牡羊座", "label": "牡羊座" }, ...] },
    { "name": "転職タイプ", "options": [{ "value": "キャリアアップ型", "label": "キャリアアップ型" }, ...] },
    { "name": "本命星", "options": [...] },
    { "name": "MBTI傾向", "options": [{ "value": "NT", "label": "NT型（論理・戦略・革新系）" }, ...] },
    { "name": "タイミング", "options": [{ "value": "now", "label": "今すぐ" }, ...] },
    { "name": "年齢層", "options": [{ "value": "20代前半", "label": "20代前半" }, ...] },
    { "name": "性別", "options": [{ "value": "男性", "label": "男性" }, ...] },
    { "name": "業種", "options": [{ "value": "IT・Web・通信", "label": "IT・Web・通信" }, ...] }
  ]
}
```

`value` の文字列がそのままタグとして保存される。`label`は人間向けの表示用。

### `POST /api/n8n/upload`

アイキャッチ・本文用の画像をアップロードし、公開URLを取得する。次の2通りの送り方に対応。

**A. ファイルを直接送る（multipart/form-data）**
```
POST /api/n8n/upload
Content-Type: multipart/form-data
file: <画像バイナリ>
```

**B. 画像生成ノードなどが返したURLを渡す（JSON）**
```json
POST /api/n8n/upload
Content-Type: application/json

{ "image_url": "https://example.com/generated-image.png" }
```
サーバー側でURLを取得し、当サイトのストレージに保存し直す（外部URLが期限切れになっても記事側は壊れない）。

**共通の制約**: jpeg/png/webp/gifのみ、5MBまで。

**レスポンス例:**
```json
{ "url": "https://xxxx.supabase.co/storage/v1/object/public/article-images/xxxxx.png" }
```

この `url` をそのまま次の記事作成リクエストの `eyecatch_url`、または本文Markdown中に `![](url)` として埋め込む。

### `POST /api/n8n/articles`

記事を作成する（下書き保存 / 予約投稿 / 即時公開）。

**リクエストボディ:**
```json
{
  "title": "記事タイトル（必須）",
  "slug": "article-slug-in-english",
  "meta_description": "検索結果に表示される説明文",
  "body_md": "## 見出し\n\n本文をMarkdownで（必須）",
  "eyecatch_url": "https://.../xxxxx.png",
  "tags": ["牡羊座", "キャリアアップ型", "now"],
  "status": "draft",
  "scheduled_at": "2026-07-10T09:00:00+09:00"
}
```

| フィールド | 必須 | 説明 |
|---|---|---|
| `title` | ✅ | 記事タイトル |
| `body_md` | ✅ | Markdown本文 |
| `slug` | — | 半角英小文字・数字・ハイフンのみ。省略 or 不正な形式の場合は自動採番（例: `article-lz3k2j-9f3a`）。日本語タイトルから機械的に変換するより、n8n側のLLMで意味の通るスラッグを生成して渡すのが望ましい |
| `meta_description` | — | 省略可 |
| `eyecatch_url` | — | `/api/n8n/upload` で取得したURL |
| `tags` | — | `/api/n8n/tags` の語彙に含まれる値のみ有効。語彙外の値は無視され、レスポンスの `droppedTags` で確認できる |
| `status` | — | `draft`（既定値・下書き保存） / `scheduled`（予約投稿。`scheduled_at` が必須） / `published`（即時公開） |
| `scheduled_at` | `status: "scheduled"` のとき必須 | ISO 8601形式の日時文字列（タイムゾーン付き推奨。省略すると環境依存でUTC扱いになる） |

**レスポンス例:**
```json
{
  "article": { "id": "...", "slug": "...", "status": "draft", ... },
  "droppedTags": []
}
```

スラッグが重複している場合は `409 { "error": "このスラッグは既に使用されています" }`。`status: "scheduled"` で `scheduled_at` が未指定・不正な形式の場合は `400` エラーを返す。

**予約投稿の反映タイミングについて**: `scheduled_at` を過ぎると自動で `published` に切り替わる。反映は「誰かがサイト（`/column`系ページ）にアクセスしたタイミング」と「1日1回のバッチ処理（Vercel Cron、Hobbyプランの制約で1日1回が上限）」の両方でチェックされる。サイトに一定のアクセスがある前提では、実質的に数十秒〜数分程度の遅延で反映される。

---

## 3. 公開の安全運用について

`status` を省略すると常に `draft`（下書き）で保存される。n8nから直接 `published` を指定すれば即時公開もできるが、**最初のうちは `draft` のまま保存し、`/admin/articles` で人間が内容を確認してから公開ステータスに切り替える運用を推奨**する（設計書 `career-uranai-content-automation-design.md` の「完全自動より半自動が安全」という方針に沿う）。

運用に慣れて品質が安定してきたら、n8n側で `status: "published"` を直接送る完全自動公開に切り替えればよい。

---

## 4. 推奨ワークフロー（n8n側）

```
1. 情報収集・テーマ決定（既存の収集フローから）
2. GET /api/n8n/tags でタグ語彙を取得
3. LLMで記事生成（title / meta_description / body_md / tags を、取得した語彙内で生成）
4. 画像生成 or 画像検索 → POST /api/n8n/upload → eyecatch_url を取得
5. POST /api/n8n/articles （status: "draft"）で記事を保存
6. （任意・自動化が安定してから）status: "published" で直接公開
```
