# ワークフロー雛形の使い方

このディレクトリのJSONは、n8nへimportして手を加えるための**雛形（骨組み）**。credentialは含まれておらず、実際のAPIキー・接続先ノードは空 or プレースホルダーになっている。設計の詳細は [`../docs/workflow-design.md`](../docs/workflow-design.md) を参照。

## import手順

1. n8nにログイン（`http://localhost:5678`）
2. 左上メニュー → `Import from File`（またはワークフロー一覧右上の「+」→「Import from File」）
3. `workflows/*.template.json` を選択
4. import後、赤いエラー表示が出ているノード（credential未設定・URL未設定）を1つずつ開いて設定する
5. 手動実行（`Test workflow`）でエラーが出ないことを確認してから、必要に応じてトリガーを有効化する

## 各ワークフローで事前に用意しておくcredential

| ワークフロー | 必要なcredential | 補足 |
|---|---|---|
| `01_collect_trends` | （実装するデータソースによる） | 現状はプレースホルダーのみ。実装時に追加 |
| `02_generate_sns_posts` | Anthropic API, Notion API | Notionは事前に「SNS投稿下書き」DBを作成しておく（[workflow-design.md §3](../docs/workflow-design.md#3-workflow-02-sns投稿案生成)） |
| `03_generate_seo_article_brief` | Anthropic API, HTTP Header Auth（career-uranai.site用） | HTTP Header Authは `Authorization: Bearer <CAREER_SITE_N8N_API_KEY>` を設定する |
| `04_approval_to_publish` | Notion API | Workflow 02と同じNotion DBを参照する |

### career-uranai.site 用 HTTP Header Auth credentialの作り方

1. n8n UI → Credentials → New → `Header Auth`
2. Name: `Authorization`
3. Value: `Bearer <CAREER_SITE_N8N_API_KEYの値>`
4. Workflow 03のHTTP Requestノード（`POST /api/n8n/articles` 等）でこのcredentialを選択する

## ファイル一覧

- `01_collect_trends.template.json` — 情報収集（プレースホルダー中心。データソース未確定）
- `02_generate_sns_posts.template.json` — SNS投稿案生成 → Notion保存
- `03_generate_seo_article_brief.template.json` — SEO記事生成 → career-uranai.siteへ下書き保存
- `04_approval_to_publish.template.json` — Notionの承認済みSNS投稿案を検知・整理
