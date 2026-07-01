# n8n リストア手順

`backup.sh` で作成したバックアップから復元する手順。

## 1. 事前に必要なもの

- バックアップフォルダ（`backups/YYYYMMDD_HHMMSS/`）
  - `n8n_postgres.sql`
  - `n8n_data.tar.gz`
- 当時の `.env`（特に `N8N_ENCRYPTION_KEY` と `POSTGRES_*`）
  - **`N8N_ENCRYPTION_KEY` が当時と違うと、保存済みのcredential（Notion/Anthropic/career-uranai.siteのAPIキー等）が復号できず全て再設定になる。**

## 2. 新しい環境の準備

```bash
cd automation/n8n
cp .env.example .env
# .env に、バックアップ当時と同じ POSTGRES_USER / POSTGRES_PASSWORD / POSTGRES_DB / N8N_ENCRYPTION_KEY を設定する
```

## 3. コンテナを起動（データは空の状態で一度立ち上げる）

```bash
docker compose up -d postgres
# postgresが healthy になるまで待つ
docker compose ps
```

## 4. PostgreSQLへdumpを流し込む

```bash
cat backups/YYYYMMDD_HHMMSS/n8n_postgres.sql | docker compose exec -T postgres sh -c 'psql -U "$POSTGRES_USER" "$POSTGRES_DB"'
```

## 5. n8nデータボリュームを復元する

```bash
# 先にn8nコンテナを止める（起動前なら不要）
docker compose stop n8n

# ボリューム名を確認（通常は n8n_n8n_data）
docker volume ls --filter "label=com.docker.compose.volume=n8n_data"

# 中身を復元
docker run --rm \
  -v n8n_n8n_data:/data \
  -v "$(pwd)/backups/YYYYMMDD_HHMMSS:/backup" \
  alpine sh -c "rm -rf /data/* && tar -xzf /backup/n8n_data.tar.gz -C /data"
```

## 6. 起動して確認

```bash
docker compose up -d
docker compose logs -f n8n
```

ブラウザで `http://localhost:5678`（またはVPSのURL）にアクセスし、ワークフロー・credentialが復元されていることを確認する。

## 7. うまく復号できない場合

`N8N_ENCRYPTION_KEY` が一致していないと、ワークフロー自体は見えてもcredentialでエラーが出る。この場合は各credential（Notion, Anthropic, career-uranai.site API等）をn8n UIから再設定する。
