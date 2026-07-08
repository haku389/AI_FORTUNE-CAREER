# career-uranai.site 画像レビューBot

Workflow 03（SEO記事生成）の画像品質チェック（Gemini）でNGと判定された画像を、Discordに送って人間が目視確認するためのbot。

## 何をするか

1. n8nから `POST /review-batch` が呼ばれると、NGになった画像（アイキャッチ・本文画像）を1枚ずつ `#careeruranai` チャンネル内の「画像生成エラー」スレッドに投稿し（設定していれば指定ユーザーをメンション）、各メッセージに🍓🍇🍋のリアクションを付ける
2. ユーザーがリアクションすると:
   - 🍓 承認（このまま使う）→ 即確定
   - 🍇 修正して再生成 → botが「返信で修正指示を送ってください」と聞き返し、その返信内容を受け取ってから確定
   - 🍋 指示なしで作り直す → 即確定
3. **そのバッチ内の全アイテムが確定するまで、n8n側は先に進まない**（複数枚NGが出ていた場合、全部にリアクションが付くまで待つ）
4. n8n側はWaitノード（`resume: timeInterval`、30秒間隔）で `GET /review-batch/:batchId/status` をポーリングしており、全件確定したタイミングで判定結果を受け取ってワークフローを再開する

記事生成が正常完了した際の「投稿内容完了通知」や、SNS投稿の修正完了通知も、`POST /notify` 経由でこのbotが投稿する。通知先スレッドは`thread`パラメータ（`"seo"` / `"sns"` / `"error"`）で切り替わる（省略時は`"seo"`扱い＝「投稿内容完了通知」スレッド）。SEO記事（Workflow 03）とSNS投稿（Workflow 04）の通知が同じスレッドに混ざると見づらいため、SNS側は別スレッド「SNS投稿内容完了通知」に分離している（2026-07-04）。

さらに、Workflow 01〜04のいずれかでエラーが発生した際は、n8n側の「Error Workflow」機能（`05_error_notifications`）経由で `thread: "error"` で通知され、「エラー検知」スレッドに投稿される（2026-07-08）。

**設計メモ**: 当初はn8nのWaitノード（`resume: webhook`）でbotからn8nへ直接resume URLを叩く方式を試したが、n8n内部のトークン/署名/webhookパス照合の挙動が安定せず、コンテナ間ネットワーク越しの呼び出しでも解消しなかったため、単純なポーリング方式（`resume: timeInterval` + ステータス確認エンドポイント）に切り替えた。実運用上のUX差は「反映まで最大30秒のラグがある」程度で、確実さを優先している。

## セットアップ

### 1. Discord Developer Portalでbotを作成

（済んでいれば読み飛ばしてよい）

1. https://discord.com/developers/applications → New Application
2. 「Bot」タブ → Reset Token → トークンを控える
3. 同タブの「Privileged Gateway Intents」で **MESSAGE CONTENT INTENT** をON（**画面下部の「Save Changes」を押し忘れると反映されない**ので要注意）
4. 「OAuth2 > URL Generator」→ SCOPES: `bot` / BOT PERMISSIONS: `Send Messages`, `Create Public Threads`, `Send Messages in Threads`, `Add Reactions`, `Read Message History`, `Attach Files` → 生成されたURLでサーバーに招待
5. 投稿先チャンネルを作成し、開発者モード→チャンネルを右クリック→「チャンネルIDをコピー」
6. （任意）レビュー依頼時にメンションしたいユーザーがいれば、同様に「ユーザーIDをコピー」

### 2. 環境変数の設定

`automation/n8n/.env`（このbotのdocker-composeサービス定義もn8nのcompose fileにまとめているため、同じ.envを使う）に以下を設定する。

```
DISCORD_BOT_TOKEN=<手順1で控えたトークン>
DISCORD_CHANNEL_ID=<手順1で控えたチャンネルID>
MENTION_USER_IDS=<任意、カンマ区切りのユーザーID>
```

### 3. 起動

```
cd automation/n8n
docker compose up -d --build discord-bot
```

n8nのHTTP Requestノードからは、同じdocker-composeネットワーク内なので `http://discord-bot:3100/review-batch` のようにサービス名で到達できる（ポート公開はしていない）。

### ローカルで直接動かす場合（Dockerを使わない場合）

```
cd automation/discord-bot
npm install
cp .env.example .env   # トークン等を記入
npm run dev
```

## HTTP API（n8nから呼ばれる想定）

### `POST /review-batch`

```json
{
  "batchId": "任意の一意なID",
  "articleTitle": "記事タイトル（表示用、null可）",
  "items": [
    {
      "itemKey": "eyecatch や [IMAGE_1] など、n8n側で画像を識別するキー",
      "imageType": "eyecatch または body",
      "errorReason": "Geminiの判定理由テキスト",
      "imageBase64": "画像のbase64データ（data:プレフィックスなし）"
    }
  ]
}
```

### `GET /review-batch/:batchId/status`

n8n側がポーリングする。未確定の間は `{ "resolved": false }`。全件確定すると:

```json
{
  "resolved": true,
  "decisions": [
    { "itemKey": "eyecatch", "imageType": "eyecatch", "action": "approve", "correctionText": null },
    { "itemKey": "[IMAGE_1]", "imageType": "body", "action": "revise", "correctionText": "背景をもっと明るく" },
    { "itemKey": "[IMAGE_2]", "imageType": "body", "action": "redo", "correctionText": null }
  ]
}
```

### `POST /notify`

```json
{ "title": "記事を下書き保存しました", "message": "「転職タイミングを...」", "url": "https://career-uranai.site/admin/articles/xxx", "thread": "seo" }
```

`thread`は省略可（省略時は`"seo"`扱い）。`"seo"` → 「投稿内容完了通知」スレッド、`"sns"` → 「SNS投稿内容完了通知」スレッド。

## データの持ち方

保留中のレビュー状態は `data/review.db`（SQLite、Dockerボリューム `discord_bot_data` に永続化）に持つ。n8nが同じ`batchId`で再送してきた場合（execution retry等）は、既存の同IDバッチを削除してから作り直す（冪等性を持たせている）。
