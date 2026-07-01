# Claude Code ⇄ n8n 連携方法

最終更新: 2026-07-01

n8nがまだ起動していないため、この章は**n8n起動後に実際に試して更新する**前提の設計メモ。3つの方法があり、性質が異なるので混同しないよう整理する。

---

## 前提の整理: 2つの異なる「連携」がある

| 方向 | やりたいこと | 手段 |
|---|---|---|
| A. Claude Code → n8n | Claude Codeからワークフローを作成・更新・実行・ログ確認する（このMDが主に想定しているのはこちら） | n8n REST API、またはそれをラップしたMCPサーバー |
| B. n8n → Claude Code / 他のMCPクライアント | n8nの特定ワークフローを「呼び出せるツール」として外部に公開する | n8n組み込みの `MCP Server Trigger` ノード |

ガイド原案の「ワークフロー一覧取得・作成・更新・有効化/無効化・テスト実行・実行ログ確認」はA方向の要件。以下、A方向を中心に3つの実現方法を比較する。

---

## 方法1: n8n REST APIを直接使う（推奨・最初はこれでよい）

MCPサーバーを別途セットアップしなくても、Claude Codeは素のBashツールから直接n8nのREST APIを呼べる。追加インストールが不要で、n8nのバージョンに関係なく動く最も安定した方法。

### 準備
1. n8n UI → 右上のユーザーメニュー → `Settings` → `n8n API` → `Create an API key`
2. 発行されたキーを控える（n8n UI以外では二度と表示されない）

### 使用例

```bash
# ワークフロー一覧
curl -s http://localhost:5678/api/v1/workflows \
  -H "X-N8N-API-KEY: <発行したAPIキー>"

# ワークフローをJSONからインポート（作成）
curl -s -X POST http://localhost:5678/api/v1/workflows \
  -H "X-N8N-API-KEY: <発行したAPIキー>" \
  -H "Content-Type: application/json" \
  -d @workflows/03_generate_seo_article_brief.template.json

# ワークフローの有効化
curl -s -X POST http://localhost:5678/api/v1/workflows/<workflow_id>/activate \
  -H "X-N8N-API-KEY: <発行したAPIキー>"

# 実行履歴の確認
curl -s http://localhost:5678/api/v1/executions \
  -H "X-N8N-API-KEY: <発行したAPIキー>"
```

Claude Codeにこの先「n8nのワークフローを更新して」と頼めば、上記のようなAPI呼び出しをBashツール経由でそのまま実行できる。**まずはこの方法で十分**。

---

## 方法2: n8n自身の `MCP Server Trigger` ノードを使う

n8nには、特定のワークフローを「MCPツールとして外部に公開する」ための公式ノード `MCP Server Trigger` がある。これは方法1と逆方向（n8n→Claude Codeではなく、n8nのワークフローをClaude Codeから呼び出せるツールにする）。

用途の例: 「SEO記事生成ワークフローを実行する」という1つのツールとしてClaude Codeから呼べるようにする、など。

### 手順（試すのはn8n起動後）
1. 新規ワークフローを作り、トリガーノードとして `MCP Server Trigger` を追加
2. 発行されたエンドポイントURL（`https://<n8nのURL>/mcp/<path>` のような形）を確認
3. Claude Codeに接続する

```bash
claude mcp add --transport http n8n-tools http://localhost:5678/mcp/<path> \
  --header "Authorization: Bearer <必要なら認証トークン>"
```

**注意**: これは「ワークフローの汎用CRUD」を提供するものではなく、公開したワークフロー個別の入出力しか呼べない。ワークフロー管理そのものをしたい場合は方法1か方法3を使う。

---

## 方法3: コミュニティ製 n8n-mcp（任意・上級者向け）

n8nコミュニティには、n8nのREST APIをラップしてワークフロー管理系のMCPツール（一覧・作成・更新・実行等）を提供する非公式パッケージがある（例: `n8n-mcp` という名前でnpm/GitHubに公開されているものなど）。

これは**サードパーティ製**であり、n8n本体のバージョンアップに追従しきれていない・メンテナンス状況が変わる可能性がある。導入する場合は、実際に使う直前にGitHubの最新READMEを確認してから進めること（このMDに具体的なインストールコマンドを固定で書かない理由）。

導入する場合の一般的な形（stdio transport, パッケージ名・env変数名は使う実装のREADMEに従うこと）:

```bash
claude mcp add n8n -- npx -y <パッケージ名> \
  --env N8N_API_URL=http://localhost:5678 \
  --env N8N_API_KEY=<発行したAPIキー>
```

---

## 結論・今の推奨

1. 今はセットアップ不要な**方法1（REST API直接）**を使う
2. Claude Codeに「n8nのワークフローを更新して」のように頼めば、このMDの`curl`例をベースに操作できる
3. 定型作業が増えて不便を感じたら、方法2または3を検討する
