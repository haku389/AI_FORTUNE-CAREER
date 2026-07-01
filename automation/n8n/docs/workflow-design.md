# ワークフロー設計

最終更新: 2026-07-01

---

## 0. 全体方針

元設計書 [`unified_fortuneTelling/docs/career-uranai-content-automation-design.md`](../../../unified_fortuneTelling/docs/career-uranai-content-automation-design.md) の「完全自動より半自動が安全」という方針を踏襲する。

```text
情報収集: 自動（Workflow 01）
分析・スコアリング: 自動（Workflow 01）
投稿案生成: 自動（Workflow 02 / 03）
本文生成: 自動だが下書き止まり
公開: 人間承認
成果分析: 今回のスコープ外（将来フェーズ）
```

### 重要な設計判断: 承認先を2系統に分ける

ガイド原案では「Workflow 04: 承認後投稿/公開」が SEO記事・SNS投稿の両方をまとめて扱う想定だったが、**SEO記事側は既に承認UIが存在する**ため、二重の仕組みを作らないよう経路を分けた。

| コンテンツ種別 | 下書き保存先 | 承認・公開操作 | 理由 |
|---|---|---|---|
| SEO記事 | career-uranai.site の `seo_articles` テーブル（`/api/n8n/articles` 経由） | `/admin/articles` 管理画面（既存） | 記事CMSを既に構築済み。下書き→予約投稿→公開のステータス管理・画像アップロード・タグ付けが全て揃っている。Notion/Sheetsを経由させると二重管理になる |
| SNS投稿案 | Notion（新規データベース） | Notionのstatusプロパティを人間が変更 | SNS投稿を管理するUIは存在しないため、Notionを軽量な承認インターフェースとして採用。既存の`NOTION_API_KEY`連携を流用できる |

つまり **Workflow 04はSNS投稿専用**になる（SEO記事は Workflow 03 が直接CMSへPOSTして終わり、以降は人間が管理画面で操作する）。

### 使用モデルはコンテンツ種別で使い分ける（2026-07-01時点）

初期は両ワークフローとも `claude-sonnet-4-6`（career-uranai.site本体と同じモデル）にしていたが、テスト運用で1日あたりのAPIコストが想定より嵩んだため、公開物かどうかで使い分ける方針に変更した。

| ワークフロー | モデル | 理由 |
|---|---|---|
| 02（SNS投稿案生成） | `claude-haiku-4-5-20251001` | 短文かつ必ず人間がNotionで承認してから使うため、多少の品質差は実害が小さい。生成頻度も高くなりやすくコスト差が出やすい箇所 |
| 03（SEO記事本文生成） | `claude-sonnet-4-6`（維持） | そのまま`/admin/articles`経由で公開されうる本文のため、文章の質・キャラクターの一貫性を優先する |

コストが気になる場合は `n8n UI → Overview → 対象ワークフローの実行履歴` またはAnthropic Consoleの使用量ダッシュボードで確認できる。

### SNS投稿の「型」はライブ取得ではなくWeb調査ベースのナレッジで代替（2026-07-01時点）

X/Instagram/Threads/LINEから実際にバズっている投稿をリアルタイム取得することは、各社APIの制限（学術/法人向け契約が必要、コストが高い等）と利用規約の観点から個人開発では現実的ではないと判断した。

代わりに、Web上で公開されているバズ投稿・コピーライティングの解説記事をリサーチし、プラットフォーム別の「型」として [`sns-viral-patterns.md`](./sns-viral-patterns.md) にまとめた。Workflow 02はこれを次のように使う。

1. 「プラットフォーム別パターン選択」ノード（Codeノード）が `platform` の値に応じて該当プラットフォームの型一覧テキストを `platform_guide` としてitemに付与する
2. 「Claudeで投稿案生成」ノードのシステムプロンプトが `platform_guide` を埋め込み、「post_type・元ネタに最も合う型を1つ選んで書く」よう指示する
3. Claudeの出力に含まれる `pattern_used`（採用した型の名前）を、他フィールドと同様にNotionの `PatternUsed` プロパティへ記録する

新しいパターンが見つかった場合は `sns-viral-patterns.md` とWorkflow 02の「プラットフォーム別パターン選択」ノードの両方を更新する（ドキュメントだけ更新してもプロンプトには反映されないので注意）。

蓄積された `PatternUsed` の実績は、将来的に「どの型がよく採用され、実際に承認されやすいか」を振り返るための材料になる（成果分析は現状スコープ外だが、データだけは残しておく設計）。

**2026-07-01追記**: 初回調査は記事1本のみの参照で精度不足だったため、4プラットフォーム並行で最低10記事ずつ（実績: X15本・Instagram13本・Threads延べ約20本・LINE18本、合計60本以上）を実際に読み込んで再調査し、`sns-viral-patterns.md` を全面改訂した。合わせて、白石玲子のトーン方針（不安を煽らない・断定しすぎない）と衝突しやすい型が4媒体すべてで共通して見つかったため、型ごとに✅（そのまま使用可）／⚠️（断定・煽り表現を和らげてから使用）／🚫（不使用）のトーン適合マークを付与し、プロンプト側にもその扱い方を明記した。

---

## 1. キャラクター設定（全ワークフロー共通の唯一の参照元）

AI生成ノードで使うキャラクター制約は、**このリポジトリ内の以下2ファイルを唯一の参照元とする**（プロンプトをここでコピー・分岐させない）。

- [`unified_fortuneTelling/docs/reiko-character.md`](../../../unified_fortuneTelling/docs/reiko-character.md) — 口調・文体・禁止事項・良い例/悪い例
- [`unified_fortuneTelling/lib/reiko-knowledge.ts`](../../../unified_fortuneTelling/lib/reiko-knowledge.ts) — サイト本体のAI鑑定文で実際に使っているsystem prompt

n8nのAIノードのsystem promptには、上記の要点を要約した以下を最低限含める。

```text
あなたは「白石玲子｜キャリア未来鑑定士」です。
一人称は「私」。話し方は丁寧な「です・ます」調。ただし堅すぎず、読者に寄り添う。
占い師というより、経験豊富な転職アドバイザーのように話す。
星・未来・タイミングという表現は使ってよいが、怪しすぎる断定は避ける。
読者に不安を煽りすぎず、最後は診断や行動に自然につなげる。
転職エージェント紹介は押し売りではなく「選択肢を増やす」表現にする。
「だよ・ね・かも・かな」などのくだけた女性語は使わない（サイト本体のルールと同じ）。
```

NG表現（サイト本体の禁止事項と同一）:

```text
絶対に転職すべきです / 必ず成功します / このエージェントに登録しないと損です
あなたは今すぐ辞める運命です / 病気・精神疾患の断定 / 法律・医療・金融の断定
```

---

## 2. Workflow 01: 情報収集

ファイル: [`01_collect_trends.template.json`](../workflows/01_collect_trends.template.json)

### 目的
実データ（GSC検索クエリ実績＋転職・キャリア系ニュースの見出し）を根拠に、Workflow 02（SNS投稿案生成）の入力を自動生成する。X/TikTok/Instagramのライブ投稿を直接取得することは個人開発では現実的でないと判断し（[`sns-viral-patterns.md`](./sns-viral-patterns.md) 参照）、その代わりに「実際に検索されている・報じられている話題」を根拠にする設計にした（2026-07-01実装）。

### 処理フロー
1. **RSS取得先一覧**（Codeノード）: 転職・キャリア系ニュースのRSSフィード6件のURLを列挙
   - 東洋経済オンライン・プレジデントオンライン・Yahoo!ニュース ビジネス（いずれもYahoo!ニュース経由）
   - マイナビニュース キャリア・マイナビニュース 転職
   - 日本の人事部
   - いずれも実際にRSSが返ることを確認済み（2026-07-01時点）。新しいフィードを足す場合はこのノードに1行追加するだけでよい
2. **RSSフィードを取得**（RSS Feed Readノード）: 上記6件のURLを順に取得（n8nの標準動作で、入力item数＝6回実行され、結果は自動的に1つのリストにまとまる）
3. **GSC検索パフォーマンス取得**（HTTP Request、並行ブランチ）: Search Console APIで直近28日の検索クエリ上位20件を取得。Google Service Account認証情報が未設定の間はエラーになるが、`onError: continueRegularOutput` を設定してあるため後続処理は止まらない（セットアップ手順: [`google-search-console-setup.md`](./google-search-console-setup.md) Part B）
4. **収集データを整形**（Codeノード）: RSS見出し（直近20件、日付順）と、取得できていればGSCの検索クエリ実績を整形し、Claude用のテキストブロック2つ（`news_summary` / `gsc_summary`）にまとめる。GSC未連携の場合は「ニュースのみで進める」旨の文言に自動フォールバックする
5. **Claudeでアイデア生成**（HTTP Request、`claude-sonnet-4-6`）: 上記データを根拠に、SNS投稿アイデアを **X/Instagram/Threads/LINEに1件ずつ、計4件** 企画させる。各アイデアは `{platform, post_type, target_persona, source_summary}` の形（Workflow 02の入力形式と同じ）
6. **レスポンス整形**（Codeノード）: Claudeの出力（JSON配列）をitem化
7. **Workflow02を実行(アイデア数分)**（Execute Workflowノード）: `02_generate_sns_posts` をアイデア1件につき1回、サブワークフローとして呼び出す。Workflow 02側に追加した「サブワークフロー実行トリガー」ノードがこの入力を受け取り、これまでの手動テスト用「入力例」Setノードをバイパスして直接プロンプト生成に渡す

### なぜこの設計にしたか
- **Google Custom Search API（競合記事取得用）は不採用**: 2026年時点で新規申込みが停止済み・2027年1月に完全終了予定と判明したため、SEO記事側の競合記事リサーチはAnthropicの`web_search`ツール（Workflow 03に直接組み込み、本ドキュメント4章末尾参照）に置き換えた。Workflow 01は競合記事リサーチを扱わない
- **Workflow 02を書き換えずサブワークフロー化**: Workflow 02は「手動実行→入力例（固定値）」の経路を残したまま、「サブワークフロー実行トリガー→（入力例をバイパス）」という並行入口を追加した。これにより、Workflow 02は今まで通り単体でも手動テストでき、かつWorkflow 01から実データを渡して呼び出すこともできる
- **SEO記事（Workflow03）向けの拡張は今回のスコープ外**: main_keyword等の候補生成は将来的にこのワークフローに追加する余地を残してあるが、現時点ではSNS投稿の入力生成のみを行う

### 未着手・既知の制約
- GSC連携（Part B）が未設定のため、実行してもニュースのみを根拠にした結果になる（GSC設定後は自動的に反映される、コード変更は不要）
- RSS収集結果や生成されたアイデアをSupabase等に保存する処理は現時点ではない（実行履歴で追える範囲で十分と判断し、必要になったら追加する）

---

## 3. Workflow 02: SNS投稿案生成

ファイル: [`02_generate_sns_posts.template.json`](../workflows/02_generate_sns_posts.template.json)

### 目的
収集データ（Workflow 01の出力、または手動入力）から、SNS投稿案を複数生成しNotionに保存する。

### 投稿タイプ
共感型 / 占い診断誘導型 / 転職不安解消型 / MBTIあるある型 / 日曜夜の憂鬱型 / 転職エージェント誘導型 / 診断結果シェア促進型

### 保存先: Notion「SNS投稿下書き」データベース

**事前準備（人間が行う）**: Notionで新規データベースを作成し、以下のプロパティを用意してからデータベースIDを`.env`の`NOTION_SNS_DRAFTS_DATABASE_ID`に設定する。

| プロパティ名 | 型 | 説明 |
|---|---|---|
| Name | タイトル | 識別用の短い見出し（hookの冒頭など） |
| Platform | セレクト | X / Instagram / Threads / LINE |
| PostType | セレクト | 投稿タイプ（上記7種） |
| Hook | テキスト | 冒頭の引き |
| Body | テキスト | 投稿本文 |
| CTA | テキスト | 行動喚起文 |
| Hashtags | テキスト | カンマ区切り |
| ImagePrompt | テキスト | 画像生成/選定用プロンプト |
| TargetPersona | テキスト | 想定読者 |
| SourceURLs | テキスト | 元ネタURL（カンマ区切り） |
| ViralityScore | 数値 | [§6](#6-スコアリング設計)参照 |
| Status | セレクト | draft / approved / rejected / posted |
| ScheduledPostDate | 日付 | 任意。投稿予定日（手動投稿の目安） |

`Status` は生成直後は必ず `draft`。人間がNotion上で内容を確認し `approved` に変更したものだけがWorkflow 04の対象になる。

---

## 4. Workflow 03: SEO記事生成 → career-uranai.site へ下書き保存

ファイル: [`03_generate_seo_article_brief.template.json`](../workflows/03_generate_seo_article_brief.template.json)

### 目的
収集データからSEO記事の構成案 **と本文** を生成し、career-uranai.siteのCMSへ下書き（`status: "draft"`）として直接保存する。

ガイド原案では「構成案の生成」までがWorkflow 03の役割で、本文生成・投稿は別工程だったが、以下の理由で本文生成までを1ワークフローにまとめている。

- 既存のCMS（`/admin/articles`）が下書き編集・公開判断のUIを既に持っているため、n8n側は「本文まで作って下書きとしてPOSTする」ところまでで責務を完結させた方がシンプル
- 構成案だけをどこかに保存して、別工程で本文を書く二段階にすると、承認ポイントが増えて運用が煩雑になる

### 処理ステップ
1. トリガー（手動 or Workflow 01の出力を受けて）
2. キーワード・検索意図・差別化ポイントを整理
3. Claude（Anthropic API）で記事を生成
   - 出力: `title` / `meta_description` / `body_md`（Markdown） / `tags`
4. `GET /api/n8n/tags` で選択可能なタグ語彙を取得し、生成した`tags`をこの語彙内に収める（プロンプトに埋め込んで制約する）
5. アイキャッチ画像を用意する場合は `POST /api/n8n/upload` で画像を送りURLを取得
6. `POST /api/n8n/articles` で `status: "draft"` として保存

API仕様の詳細は [`unified_fortuneTelling/docs/n8n-integration.md`](../../../unified_fortuneTelling/docs/n8n-integration.md) を参照（認証ヘッダ・リクエスト/レスポンス形式・予約投稿対応など）。

### 記事テーマ例
転職 タイミング 占い / 仕事 辞めたい 日曜夜 / MBTI 転職 向いてる仕事 / 30代 女性 転職 迷う / 転職するべきか 診断 / キャリア 占い 当たる

### 承認・公開
n8n側では何もしない。人間が `/admin/articles` を開き、内容を確認して「公開」または「予約投稿」に切り替える。

### 未着手: 競合記事リサーチ（web_search組み込み予定）
「main_keywordに近いSEO上位記事を3〜5本参考にする」機能は、Google Custom Search APIが新規申込み停止・2027年1月終了予定と判明したため不採用にし、代わりにAnthropicの`web_search`ツール（`tools: [{type: "web_search_20260318", name: "web_search", max_uses: 5}]`）を「Claudeで記事生成」ノードのリクエストに追加する方針にした。新しい認証情報は不要（既存のAnthropic credentialをそのまま使う）。前提としてAnthropic Consoleの組織管理者が `/settings/privacy` でWeb検索を有効化しておく必要がある。まだ実装していない（2026-07-01時点、タスク管理上は別項目）。

---

## 5. Workflow 04: SNS投稿の承認検知（SNS専用）

ファイル: [`04_approval_to_publish.template.json`](../workflows/04_approval_to_publish.template.json)

### 目的
Notionの「SNS投稿下書き」データベースで `Status = approved` になった行を検知し、実際の投稿準備を整える。

### 現時点のスコープ
SNS各社のAPI（X/Instagram/LINE）は未契約のため、**自動投稿は行わない**。このワークフローは以下までを担当する。

1. Notion DBを定期ポーリング（例: 30分間隔）し `Status = approved` の行を抽出
2. 投稿予定日時（`ScheduledPostDate`）が近いものを整理
3. 承認済みリストの通知（Slack/LINE Notify/メール等、任意）
4. `Status` を `queued` 等に更新して二重処理を防ぐ

SNS APIキーが揃い、実際の自動投稿を実装する段階になったら、このワークフローに投稿ノードを追加する。その際も「同一文面の連投を避ける」「自動リプライはしない」という[設計書](../../../unified_fortuneTelling/docs/career-uranai-content-automation-design.md)の方針を守ること。

---

## 6. スコアリング設計

Workflow 01（収集）およびWorkflow 02（SNS案生成）で使うスコアリング。ガイド原案のロジックをそのまま採用。

### virality_score（SNSで伸びそうか。合計25点）
共感の強さ / 悩みの具体性 / コメント誘発性 / シェアしやすさ / 白石玲子との相性 — 各0-5

### seo_score（SEO記事にしやすいか。合計25点）
検索意図の明確さ / アフィリエイト導線との近さ / 記事化しやすさ / 競合との差別化余地 / 診断ページへの内部リンク相性 — 各0-5

### priority
```text
priority = virality_score + seo_score + affiliate_intent_bonus
```

---

## 7. タグ語彙について（SEO記事）

career-uranai.siteの診断結果ページは、記事の`tags`と診断結果（星座・転職タイプ・本命星・MBTI傾向・タイミング・年齢層・性別・業種）の一致度でおすすめ記事を表示する仕組みが既にある。Workflow 03で記事を生成する際は、`GET /api/n8n/tags` で取得できる語彙から選ぶこと（語彙外の値は保存時に無視される）。

タグの定義本体: [`unified_fortuneTelling/lib/articleTags.ts`](../../../unified_fortuneTelling/lib/articleTags.ts)
レコメンドの仕組み: [`unified_fortuneTelling/docs/cms-implementation-log.md`](../../../unified_fortuneTelling/docs/cms-implementation-log.md) 5章
