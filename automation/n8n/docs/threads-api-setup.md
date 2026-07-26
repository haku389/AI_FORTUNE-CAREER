# Threads API アクセストークンの取得方法

最終更新: 2026-07-26

n8n Workflow04（[`workflow-design.md` §4.2](./workflow-design.md#42-threadsへの実投稿2026-07-26実装)）のThreads投稿ノードで使う、長期アクセストークンの取得手順。

## 現在のトークン状況

- 発行日: 2026-07-26 / 失効目安: **2026-09-24**（60日後）
- n8n credential名: `Threads Access Token`（`Threads:`で始まる9ノード全てに設定済み）
- App Secret: `automation/n8n/.env`の`THREADS_APP_SECRET`に保存済み（更新時に使う）
- 失効が近づいたら、下記「有効期限・更新について」のcurlコマンドで更新し、n8nのcredential値も上書きすること

## 前提

Meta Developerアプリで`threads_basic`・`threads_content_publish`権限の審査を通過していること（ユーザー確認済み、2026-07-26時点）。App ID・App Secretは Meta App Dashboard → 対象アプリ → 「App settings」→「Basic」で確認できる。

## 手順

### 1. 認可URLを開いて許可する

以下の形式のURLをブラウザで開く（`client_id`・`redirect_uri`は自分のアプリの値に差し替える）。

```
https://threads.net/oauth/authorize?client_id=<APP_ID>&redirect_uri=<REDIRECT_URI>&scope=threads_basic,threads_content_publish&response_type=code
```

- `redirect_uri`は、Meta App Dashboardの「Threads」ユースケース設定で事前に登録した有効なリダイレクトURIと完全一致させる必要がある。専用の受け口がなければ、`https://career-uranai.site`のように自分が管理しているドメインをそのまま登録しておけばよい（リダイレクト先で何か処理させる必要はなく、次のステップでURLバーから`code`をコピーするだけ）
- 開くと@reiko_career1（投稿に使うThreadsアカウント）でログイン・許可を求められる。許可すると`redirect_uri`へ`?code=...`付きでリダイレクトされる
- **この`code`は1時間だけ有効・1回しか使えない**ので、リダイレクト後すぐ次のステップに進むこと

### 2. 認可コードを短期アクセストークンと交換する

```bash
curl -X POST https://graph.threads.net/oauth/access_token \
  -F client_id=<APP_ID> \
  -F client_secret=<APP_SECRET> \
  -F grant_type=authorization_code \
  -F redirect_uri=<REDIRECT_URI> \
  -F code=<手順1で得たcode>
```

レスポンスの`access_token`が短期トークン（有効期限は短い、後述の長期交換をすぐ行う前提）。

### 3. 長期アクセストークン（60日間有効）に交換する

```bash
curl "https://graph.threads.net/access_token?grant_type=th_exchange_token&client_secret=<APP_SECRET>&access_token=<手順2で得た短期トークン>"
```

レスポンスの`access_token`が、n8nのcredentialに設定する本命のトークン。

### 4. n8nにcredentialとして登録する

1. n8n UI → Credentials → New → **Header Auth**
2. Name: 例）`Threads Access Token`
3. Header Name: `Authorization`
4. Header Value: `Bearer <手順3で得た長期トークン>`（`Bearer `込みで入力）
5. `Threads:`から始まる9個のHTTP Requestノード（メイン投稿-作成/公開/permalink取得、リプライ1-作成/公開、CTA-作成/公開、診断リプライ-作成/公開、いずれもWorkflow04）にこのcredentialを選択する

## 有効期限・更新について（重要）

長期トークンは**60日間**で失効する。失効前に以下のエンドポイントを叩けば、失効前かつ発行から24時間以上経っていれば再び60日間延長できる。

```bash
curl "https://graph.threads.net/refresh_access_token?grant_type=th_refresh_token&access_token=<現在の長期トークン>"
```

**現状、この更新は自動化されていない**（n8n側に更新用ワークフローは未実装）。60日おきに手動でこのcurlを実行し、n8nのcredential値を更新するか、忘れると投稿が突然失敗し始める（Discordのエラー通知スレッドで気づける設計にはなっている）。定期的に更新するのが面倒であれば、将来的にn8nの`Schedule Trigger`（例: 45日毎）＋この`refresh_access_token`呼び出し＋credential自動更新、というワークフローを追加することも検討できる（Xのcredentialのような3-legged OAuthではなく単純なHTTPコールなので実装コスト自体は低い）。

## 参考

- [Get Access Tokens - Threads API｜Meta for Developers](https://developers.facebook.com/docs/threads/get-started/get-access-tokens-and-permissions/)
- [Long-Lived Access Tokens - Threads API｜Meta for Developers](https://developers.facebook.com/docs/threads/get-started/long-lived-tokens)
