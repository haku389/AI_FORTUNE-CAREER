# Google Search Console 設定ガイド

career-uranai.site をSearch Consoleに登録し、将来的にWorkflow 01（情報収集）からAPI経由で検索パフォーマンスデータを取得できるようにするための手順。

大きく2段階に分かれる。

- **Part A**: サイトの所有権確認（人間がブラウザで操作 + 私がコード変更）— これをやると検索順位・クリック数などをWeb画面で見られるようになる
- **Part B**: n8nから自動でデータを取得するためのAPI連携設定（人間がGoogle Cloud Consoleで操作）— Workflow 01を実装する時に使う

Part Aだけ済ませればSearch Console自体は使えるようになる。Part Bは急がなくてよい（Workflow 01着手時にまとめて行う想定）。

---

## Part A: サイトの所有権確認

### A-1. Search Consoleでプロパティを追加する（あなたの作業）

1. https://search.google.com/search-console/welcome にアクセスし、サイトの管理に使いたいGoogleアカウントでログインする（個人のGmailで問題ない）
2. 表示された画面で、プロパティタイプは **「URLプレフィックス」**（右側）を選ぶ
   - 「ドメイン」プロパティの方が本来はhttp/https・wwwありなし全部まとめて確認できて理想的だが、確認にDNSのTXTレコード設定（ドメインを購入・管理しているサービスへのログイン）が必要になる。今回はコードで完結する方法を優先し、まずはURLプレフィックスで始める。後からドメインプロパティを追加することも可能
3. 入力欄に `https://career-uranai.site` と入力して「続行」
4. 所有権の確認方法の一覧が出るので、**「HTMLタグ」**を選ぶ（デフォルトで「おすすめの方法」として一番上か、タブの中に表示される）
5. `<meta name="google-site-verification" content="XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX" />` という1行が表示される。この **content=""の中身の文字列だけ** をコピーして、私に貼ってください（「確認」ボタンはまだ押さない）

### A-2. コードに反映する（私の作業）

あなたから文字列を受け取ったら、[app/layout.tsx](../../../unified_fortuneTelling/app/layout.tsx) の `metadata` に以下を追加してVercelにデプロイする。

```ts
export const metadata: Metadata = {
  // ...既存の内容はそのまま
  verification: {
    google: 'あなたから受け取った文字列',
  },
}
```

これによって `<head>` に `<meta name="google-site-verification" content="..." />` が出力される。コミットはこちらでは行わない方針なので、変更後にあなたの方でcommit・pushしてください（これまでと同じ運用）。

### A-3. 確認を完了する（あなたの作業）

1. Vercelのデプロイが完了したら、`https://career-uranai.site` をブラウザで開いて、右クリック→「ページのソースを表示」（または表示→開発者ツール）で `google-site-verification` のmetaタグが実際に出力されているか一応目視確認する
2. Search Consoleの画面に戻り、「確認」ボタンをクリックする
3. 「所有権を確認しました」と表示されれば完了

---

## Part B: n8nからAPIでデータ取得できるようにする（Workflow 01用）

Search Console にはn8n専用のノードが無いため、**HTTP Requestノード + Googleサービスアカウント認証** の組み合わせで叩く。OAuth2ではなくサービスアカウントを使うのは、一度設定すれば有効期限切れの再認証が発生せず、自動実行のワークフローに向いているため。

### B-1. Google Cloudでサービスアカウントを作る

1. https://console.cloud.google.com/ にアクセスし、画面上部のプロジェクト選択メニューから「新しいプロジェクト」を作成する（プロジェクト名は例: `career-uranai-automation`）
2. 左メニュー「APIとサービス」→「ライブラリ」を開き、検索窓で **「Google Search Console API」** を検索して「有効にする」をクリック
3. 左メニュー「APIとサービス」→「認証情報」を開き、「+ 認証情報を作成」→「サービスアカウント」を選ぶ
4. サービスアカウント名を入力（例: `n8n-search-console`）して「作成して続行」。ロールの割り当ては空のままでよい（Search Console側の権限は後述のA-4で個別に付与するため）。「完了」を押す
5. 作成されたサービスアカウントの一覧から今作ったものを開き、「キー」タブ→「鍵を追加」→「新しい鍵を作成」→形式は **JSON** を選んで「作成」。JSONファイルがPCにダウンロードされる（このファイルは秘密鍵を含むので取り扱いに注意。Gitには絶対にコミットしない）
6. ダウンロードしたJSONファイルを開き、`client_email` の値（`xxxxx@xxxxx.iam.gserviceaccount.com` の形式）をコピーしておく

### B-2. サービスアカウントにSearch Consoleの閲覧権限を渡す

1. Search Console（https://search.google.com/search-console ）に戻り、対象プロパティ（career-uranai.site）を開く
2. 左メニュー下部の「設定」→「ユーザーと権限」を開く
3. 「ユーザーを追加」をクリックし、B-1-6でコピーした `client_email` の値を貼り付ける
4. 権限は **「制限付き」**（閲覧のみ）で十分（n8n側でデータを書き換えることはしないため）
5. 「追加」

### B-3. n8nにサービスアカウント認証情報を登録する

1. n8nの画面左メニュー「Credentials」→右上「Add credential」
2. 検索窓で「Google Service Account」と入力して選択
3. ダウンロードしたJSONファイルから以下をコピーして貼り付ける
   - **Service Account Email**: `client_email` の値
   - **Private Key**: `private_key` の値（前後の `"` は含めずに、中身の文字列だけを貼る。`-----BEGIN PRIVATE KEY-----` から `-----END PRIVATE KEY-----` まで全部含める）
4. 下の方にある **「Set up for use in HTTP Request node」** をONにする
5. Scope(s) の欄に以下を追加する
   ```
   https://www.googleapis.com/auth/webmasters.readonly
   ```
6. 「Save」

### B-4. HTTP Requestノードでの叩き方（Workflow 01実装時に使う参考情報）

検索パフォーマンス（クエリ・クリック数・表示回数・掲載順位）を取得するエンドポイント:

```
POST https://www.googleapis.com/webmasters/v3/sites/{siteUrl}/searchAnalytics/query
```

- `{siteUrl}` は登録したプロパティのURLをそのままURLエンコードしたもの。URLプレフィックスプロパティの場合は `https%3A%2F%2Fcareer-uranai.site%2F`
- 認証: n8nのHTTP Requestノードの Authentication で `Generic Credential Type` → `Google Service Account` を選び、B-3で作った認証情報を選択
- リクエストボディ例（直近28日間の検索クエリ上位25件を取得）:
  ```json
  {
    "startDate": "2026-06-03",
    "endDate": "2026-07-01",
    "dimensions": ["query"],
    "rowLimit": 25
  }
  ```

Workflow 01を実装する段階で、このエンドポイントをHTTP Requestノードとして組み込む（現時点ではまだ雛形のみでこの呼び出しは入っていない）。

---

## 補足: なぜドメインプロパティ（DNS認証）を今回は使わなかったか

Search Console公式の推奨は「ドメイン」プロパティ（http/https・wwwあり/なしを一括で計測できる）だが、確認にはドメインのDNS設定へのアクセス（career-uranai.siteをどこで購入・管理しているかに依存し、Vercel Domainsか外部レジストラかで手順が変わる）が必要になる。今回はコード変更だけで完結する「URLプレフィックス + HTMLタグ」を優先した。

DNSへのアクセスがあり、より網羅的な計測に切り替えたくなった場合は、Search Console上で「プロパティを追加」からドメインプロパティを別途追加できる（既存のURLプレフィックスプロパティを削除する必要はない）。
