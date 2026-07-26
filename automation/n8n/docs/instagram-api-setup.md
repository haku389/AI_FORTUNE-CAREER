# Instagram Graph API アクセストークンの取得方法

最終更新: 2026-07-26

n8n Workflow04のInstagram投稿ノード（未実装、[`workflow-design.md`](./workflow-design.md)参照）で使う、長期アクセストークンの取得手順。[`threads-api-setup.md`](./threads-api-setup.md)とほぼ同じ流れ（同じMeta Developerアプリ、同じ3ステップのトークン交換）。

## 現在のトークン状況（2026-07-26取得済み）

- 発行日: 2026-07-26 / 失効目安: **2026-09-24**（60日後）
- n8n credential名: `Instagram Access Token`（Header Auth。まだInstagram投稿ノード自体は未実装のため、どのノードにも未割り当て）
- アカウント確認済み: `{"id":"27238292145850546","username":"reiko_career1","account_type":"MEDIA_CREATOR"}`
- Instagram App ID/App SecretはThreadsとは別の値。`automation/n8n/.env`の`INSTAGRAM_APP_ID`/`INSTAGRAM_APP_SECRET`/`INSTAGRAM_BUSINESS_ACCOUNT_ID`に保存済み

## 前提

- @reiko_career1のInstagramアカウントがプロアカウント（ビジネス/クリエイター）かつFacebookページと連携済み（ユーザー確認済み、2026-07-26時点）
- 使うのは新しい「Instagram API with Instagram Login」（Facebookページのトークンを経由しない、Threadsと同じ形の直接ログイン方式）。旧来の「Instagram API with Facebook Login」（Facebookページトークン経由）ではない

### 重要: Instagram App ID/App SecretはThreadsとは別の値（2026-07-26判明）

同じMeta Developerアプリ（App ID `1388493776510420`）内にThreads・Instagramそれぞれのユースケースを追加した場合でも、**OAuth用のclient_id/client_secretはユースケースごとに個別発行される**。Threadsの「ThreadsアプリID」をInstagramの認可URLに使うと`Invalid Request: Invalid platform app`エラーになる。Instagram用の「InstagramアプリID」「Instagramのapp secret」は、Instagramユースケースの同じカスタマイズ画面内（Threadsの時と同じレイアウト）に別途表示されているので、そちらを使うこと。

## 手順

### 0. Meta Developerダッシュボードでユースケースを追加・設定する

1. Threadsと同じアプリのダッシュボードを開く
2. ユースケース一覧に「Instagram」（Instagram API with Instagram Login）を追加し、「カスタマイズ」画面を開く
3. 「アクセス許可と機能」で以下を有効化:
   - `instagram_business_basic`
   - `instagram_business_content_publish`
4. 「Webhooksを設定する」は**スキップしてよい**（投稿専用の用途では不要。そもそもアプリが公開済み状態でないと受信できない）
5. 「Instagramビジネスログインを設定」のリダイレクトURLに`https://career-uranai.site/`を入力（Threadsと同じ値を使い回してよい）
6. アンインストール/削除のコールバックURLも出てきたらThreadsと同じものを使い回す:
   - コールバックURLをアンインストール: `https://career-uranai.site/api/threads/deauthorize`
   - コールバックURLを削除: `https://career-uranai.site/api/threads/data-deletion`
7. **「アプリレビューを申請」は不要**。@reiko_career1（自分のアカウント）だけで使う用途なので、テスター登録だけで足りる（Threadsと同じ理屈）
8. @reiko_career1をこのユースケースの「Instagram Tester」として招待し、Instagramアプリ側（設定→アカウント→ウェブサイトの許可）で承認する

### 1. 認可URLを開いて許可する

`client_id`はInstagram用のアプリID（Threadsとは別。2026-07-26時点: `2356219111452220`）を使う。

```
https://www.instagram.com/oauth/authorize?client_id=2356219111452220&redirect_uri=https://career-uranai.site/&scope=instagram_business_basic,instagram_business_content_publish&response_type=code
```

- リダイレクト後のURLに`?code=...`が付与される（1時間・1回限り有効。末尾に`#_`が付くことがあるので、それは取り除く）

### 2. 認可コードを短期アクセストークンと交換する

`client_secret`もInstagram用のapp secretを使う。

```bash
curl -X POST https://api.instagram.com/oauth/access_token \
  -F client_id=2356219111452220 \
  -F client_secret=<Instagram用のApp Secret> \
  -F grant_type=authorization_code \
  -F redirect_uri=https://career-uranai.site/ \
  -F code=<手順1で得たcode>
```

レスポンスは`{"access_token": "...", "user_id": ..., "permissions": [...]}`という形（フラットなオブジェクト。ドキュメント上は`data`配列でラップされる記載もあったが、実際のレスポンスはラップなしだった）。この`user_id`が投稿APIで使うInstagramアカウントのID（`IG_ID`）。

### 3. 長期アクセストークン（60日間有効）に交換する

```bash
curl "https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=<Instagram用のApp Secret>&access_token=<手順2で得たaccess_token>"
```

### 4. n8nにcredentialとして登録する

Header Auth credential（`Authorization: Bearer <長期トークン>`）を作成し、Instagram投稿ノード実装時に設定する。

## 有効期限・更新について

Threadsと同じく60日間有効。失効前に以下で延長できる（発行から24時間以上経過・失効前であること）。

```bash
curl "https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=<現在の長期トークン>"
```

## 投稿時に使うエンドポイント（実装時の参考）

- ベースURL: `https://graph.instagram.com/<version>`
- 単一画像投稿: `POST /{IG_ID}/media`（`image_url`必須。画像は公開URLでホスティングされている必要がある。JPEGのみ対応）→ `POST /{IG_ID}/media_publish`（`creation_id`）
- カルーセル投稿: 各画像を`is_carousel_item=true`付きで`POST /{IG_ID}/media`し、できたコンテナID群（最大10個）を`children`にカンマ区切りで渡して`media_type=CAROUSEL`で`POST /{IG_ID}/media`→`POST /{IG_ID}/media_publish`
- レート制限: 24時間で100投稿まで（カルーセルは1投稿としてカウント）

## 参考

- [OAuth Authorize - Instagram Platform｜Meta for Developers](https://developers.facebook.com/docs/instagram-platform/reference/oauth-authorize/)
- [Business Login for Instagram｜Meta for Developers](https://developers.facebook.com/documentation/instagram-platform/instagram-api-with-instagram-login/business-login)
- [Publish Content｜Meta for Developers](https://developers.facebook.com/docs/instagram-platform/content-publishing/)
- [Long-Lived Access Tokens｜Meta for Developers](https://developers.facebook.com/docs/instagram-platform/reference/access_token)
