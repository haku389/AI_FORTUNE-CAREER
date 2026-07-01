# 運用ガイド

最終更新: 2026-07-01

---

## 1. 日常操作

```bash
cd automation/n8n

docker compose ps          # 稼働状況確認
docker compose logs -f n8n # ログをtail
docker compose restart n8n # n8nだけ再起動
docker compose stop        # 停止（データは保持）
docker compose start       # 再開
```

## 2. イメージの更新

```bash
docker compose pull
docker compose up -d
```

更新前に `./backup.sh` を実行しておくこと。マイナーアップデートでも稀に破壊的変更が入ることがあるため、`n8nio/n8n` の[リリースノート](https://docs.n8n.io/release-notes/)を確認してから上げるのが安全。

## 3. バックアップ運用

- 手動: `./backup.sh` を随時実行（[README.md](../README.md) 3章）
- 目安: ワークフローやcredentialを大きく変更した直後、本番運用に切り替える前には必ず取る
- 将来的に定期実行したくなったら、Macの `launchd` や、VPS移行後は `cron` で `backup.sh` を定期実行するように設定する

## 4. 実行データ（Executions）の扱い

`docker-compose.yml` の `EXECUTIONS_DATA_SAVE_ON_SUCCESS` は `.env` の値で切り替わる。

| 状況 | 推奨値 |
|---|---|
| ワークフローを作り込んでいる最中（デバッグしたい） | `all`（`.env.example` の初期値） |
| 個人情報を含むデータを扱うワークフローが本番稼働し始めた | `none` に変更して `docker compose up -d` で再適用 |

`EXECUTIONS_DATA_MAX_AGE`（時間単位、初期値168h=7日）を過ぎた実行履歴は自動的にプルーニングされる。

## 5. VPSへ移行する場合のリバースプロキシ設定例

ローカル検証が終わり、常時稼働のVPSへ移す場合の一例（Caddy）。

`Caddyfile`:
```caddyfile
n8n.example.com {
  reverse_proxy n8n:5678
}
```

`docker-compose.yml` のn8nサービスと同じDockerネットワークにCaddyを参加させるか、VPS上で別途Caddyを動かしホスト経由でリバースプロキシする。`localhost:5678`（n8nのポート）を直接インターネットに公開しないこと。

移行時にやること:
1. VPS上でDocker / Docker Compose Pluginをセットアップ
2. `automation/n8n/`一式（`.env`を除く）を転送
3. `.env`の`N8N_HOST`/`N8N_PROTOCOL`/`WEBHOOK_URL`をVPSのドメインに書き換え
4. `N8N_ENCRYPTION_KEY`は**ローカルで使っていたものと同じ値**にする（変えると既存credentialが復号できない）。移行ではなく最初からVPSで作り直すなら新規生成でよい
5. HTTPS化（Caddy/Nginx Proxy Manager/Cloudflare Tunnel等）
6. career-uranai.site（Vercel）側の許可設定は特に不要（n8nから見に行くのは`career-uranai.site`のAPIであり、逆方向のWebhook等を使わない限りVercel側の追加設定は発生しない）

## 6. Phase 2: queue modeへの移行タイミング

以下に該当し始めたら [`career-uranai-content-automation-design.md`](../../../unified_fortuneTelling/docs/career-uranai-content-automation-design.md) の設計に沿ってqueue mode（Redis + worker）を検討する。

- 1日100件以上の収集・生成を行っている
- AI生成のHTTPリクエストがタイムアウトしやすい
- 実行履歴が詰まってUIが重い
- 複数ワークフローを並列実行したい

`docker-compose.queue.yml` として別ファイルに追加する想定で、既存の `docker-compose.yml` は変更しない。
