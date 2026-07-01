#!/usr/bin/env bash
# automation/n8n/ 配下で実行すること: ./backup.sh
set -euo pipefail
cd "$(dirname "$0")"

BACKUP_DIR="./backups/$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

echo "==> PostgreSQL (n8nのワークフロー・credential・実行履歴) をdumpしています..."
# コンテナ内の環境変数からPOSTGRES_USER/POSTGRES_DBを読むため、ホスト側で.envをパースしない
docker compose exec -T postgres sh -c 'pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB"' > "$BACKUP_DIR/n8n_postgres.sql"

echo "==> n8nデータボリューム(/home/node/.n8n: 暗号化キーで復号する設定ファイル等)をtarでバックアップしています..."
# compose projectのデフォルト名はディレクトリ名（このスクリプトの配置場所 = "n8n"）。
# 環境によって変わる可能性があるため、ラベルで実体のボリューム名を解決する。
N8N_VOLUME=$(docker volume ls -q --filter "label=com.docker.compose.volume=n8n_data" | head -1)
if [ -z "$N8N_VOLUME" ]; then
  echo "警告: com.docker.compose.volume=n8n_data のボリュームが見つかりませんでした。'docker volume ls' で手動確認してください。" >&2
else
  docker run --rm \
    -v "${N8N_VOLUME}:/data:ro" \
    -v "$(pwd)/${BACKUP_DIR}:/backup" \
    alpine sh -c "tar -czf /backup/n8n_data.tar.gz -C /data ."
fi

echo ""
echo "Backup completed: $BACKUP_DIR"
echo ""
echo "重要: .env と N8N_ENCRYPTION_KEY はこのバックアップに含まれていません。"
echo "      別途、パスワードマネージャー等に安全に控えておいてください（restore.md参照）。"
