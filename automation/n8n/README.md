# n8n セルフホスト環境（career-uranai.site 用）

`career-uranai.site` のSNS投稿生成・SEO記事生成・半自動投稿基盤。まずはこのMac上のDocker Desktopでローカル起動し、動作確認ができてからVPS等への移行を検討する。

関連ドキュメント:
- [`docs/workflow-design.md`](docs/workflow-design.md) — 4つのワークフローの設計・データフロー
- [`docs/mcp-setup.md`](docs/mcp-setup.md) — Claude Codeからn8nを操作するための接続方法
- [`docs/operations.md`](docs/operations.md) — 日常運用（起動/停止/更新/バックアップ）
- [`docs/security-checklist.md`](docs/security-checklist.md) — 公開前に確認すること
- [`workflows/README.md`](workflows/README.md) — ワークフローJSON雛形のimport手順
- [`../../unified_fortuneTelling/docs/n8n-integration.md`](../../unified_fortuneTelling/docs/n8n-integration.md) — career-uranai.site側が既に提供している記事投稿API（`/api/n8n/*`）の仕様

---

## 0. 前提: Docker Desktopのインストール

このMacにはDocker Desktopが入っていない状態からのスタート。Homebrewがあるので以下で入れられる。

```bash
brew install --cask docker
```

インストール後、**一度Dockerアプリを手動で起動し**、初回セットアップ（利用規約への同意、特権ヘルパーのインストール許可）を完了させる。これはGUI操作が必要でターミナルからは自動化できない。

起動できたか確認:

```bash
docker --version
docker compose version
```

## 1. 起動手順

```bash
cd automation/n8n
cp .env.example .env
```

`.env` を開いて、最低限以下を埋める。

1. `POSTGRES_PASSWORD` — 適当な強いパスワードに変更
2. `N8N_ENCRYPTION_KEY` — 以下で生成して貼り付け（**一度決めたら変更しない**）
   ```bash
   openssl rand -hex 32
   ```
3. `ANTHROPIC_API_KEY` — n8n専用に新規発行したキーを推奨（理由は`.env.example`内のコメント参照）
4. `CAREER_SITE_N8N_API_KEY` — career-uranai.site（Vercel）に設定済みの`N8N_API_KEY`と同じ値
5. `NOTION_API_KEY` / `NOTION_SNS_DRAFTS_DATABASE_ID` — SNS投稿案の下書き承認用（詳細は`docs/workflow-design.md`）

他の項目（`GOOGLE_SEARCH_API_KEY`等の情報収集系、`X_API_KEY`等のSNS投稿系）は、対応するワークフローを実際に組むタイミングまで空のままでよい。

起動:

```bash
docker compose pull
docker compose up -d

docker compose logs -f n8n
```

ブラウザで以下へアクセスし、初回管理者アカウント（メール・パスワード）を作成する。

```text
http://localhost:5678
```

## 2. 停止・再起動

```bash
# 停止（データは保持される）
docker compose stop

# 再開
docker compose start

# コンテナごと削除（named volumeは残るのでデータは消えない）
docker compose down

# データも含めて完全に削除する場合のみ（取り返しがつかないので注意）
docker compose down -v
```

## 3. バックアップ

```bash
./backup.sh
```

`backups/YYYYMMDD_HHMMSS/` にPostgreSQLのdumpとn8nデータが保存される。リストア手順は [`restore.md`](restore.md)。

`.env` と `N8N_ENCRYPTION_KEY` はバックアップに含まれないため、別途安全な場所に控えておくこと。

## 4. 将来VPSへ移行する場合

1. VPS上にDocker / Docker Composeをセットアップ
2. このディレクトリ一式（`.env`を除く）をVPSへ配置
3. `.env` の `N8N_HOST` / `N8N_PROTOCOL` / `WEBHOOK_URL` をVPSのドメインに書き換え
4. Caddy または Nginx Proxy Manager でHTTPS化し、`localhost:5678`を直接インターネットに公開しない
5. `docs/operations.md` にリバースプロキシの設定例を追記する

## 5. 初回検証チェックリスト

- [ ] `docker compose up -d` でn8nが起動する
- [ ] PostgreSQLに接続できている（`docker compose logs postgres`にエラーがない）
- [ ] n8n初期ユーザーを作成できる
- [ ] timezoneがAsia/Tokyoになっている（n8n UIの実行ログの時刻で確認）
- [ ] `docker compose restart` してもworkflow/credentialが残る
- [ ] `backup.sh` が動く
- [ ] `workflows/*.template.json` をUIからimportできる
- [ ] Notion / Anthropic / career-uranai.site のcredentialをn8nに登録できる
- [ ] Notionに下書きを保存できる（Workflow 02のテスト実行）
- [ ] `status = approved` のものだけ次の処理へ進む（Workflow 04のテスト実行）
