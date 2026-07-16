# CLAUDE.md

<!-- このファイルはサイトリポジトリの直下に CLAUDE.md として設置する。
     サイト自体の説明（技術構成・記事の場所・ビルド方法など）は適宜追記してよい。 -->

# アフィリエイト広告の組み込みルール（AffiliateProgram_Manager 連携）

このリポジトリとは別に、ASPアフィリエイト案件を管理するツール
`AffiliateProgram_Manager`（`/Users/to_fu/GitHub/AffiliateProgram_Manager`）があり、
案件情報をJSONで出力している。記事の作成・修正でアフィリエイト広告を扱うときは、
必ずこのJSONを読んで判断すること。

## データソース

- **承認済み案件（掲載に使えるのはここに載っている案件だけ）**:
  `/Users/to_fu/GitHub/AffiliateProgram_Manager/output/json/approved_programs.json`
- 全案件（テーマに合う候補を探す時の参考。掲載には使用不可）:
  `/Users/to_fu/GitHub/AffiliateProgram_Manager/output/json/claude_programs.json`

JSONの構造:

- `generatedAt` … 出力日時（古い場合は後述の更新手順をユーザーに案内する）
- `usageGuidelines` … 利用ルール（本書と同内容。必ず従う）
- `commonNgWords` … 全案件共通で避けるべき表現
  - `dangerousWords`（公式・最安値・絶対・必ず・100%・No.1・確実・保証・誰でも・必勝・完全無料）
  - `guaranteeExpressions`（成果保証系表現）
  - `officialConfusionExpressions`（公式誤認系表現）
- `counts` … 件数サマリ
- `programs[]` … 案件本体。主なフィールド:
  - `programName` / `advertiserName` / `category` … 案件名・広告主・カテゴリ
  - `status` … 提携状態（`active` 以外は使用不可）
  - `reward` … 報酬（`type`: fixed/percentage/tiered、`amount`: 円、`rate`: %、`rawText`: 原文）
  - `confirmationRate` … 確定率（%）、`epc` … EPC（案件の優先度判断に使う）
  - `conversionCondition` … 成果発生条件
  - `rejectionConditions[]` … 否認条件（これに該当する誘導をしない）
  - `ngWords[]` / `prohibitedExpressions[]` … 案件固有の禁止語・禁止表現
  - `listingRules` … リスティング（検索広告）条件。記事作成では通常関係ないが、rawTextに条件バッジ情報あり
  - `adLinks[]` … 広告素材（`linkType`: banner/text/mail_text、`rawCode`: 広告コード原文、`imageUrl` など）
  - `lastCheckedAt` … 最終確認日、`hasConditionChanged` … 条件変更フラグ
  - `reviewStatus` … レビュー状態、`notes` … 人間のメモ、`siteMatchStatus` … 掲載方針

## 案件の選び方

1. `approved_programs.json` の `programs` からだけ選ぶ
2. 記事テーマと `category` / `programName` / `advertiserName` の関連が高いものを選ぶ
3. 複数候補がある場合は `reward` の額・`confirmationRate`・`epc` を参考に優先度を付ける
   （報酬が高くても確定率が極端に低い案件は期待値が低い）
4. 次に該当する案件は選ばない:
   - `status` が `active` 以外
   - `hasConditionChanged` が `true`（条件変更後の再レビュー待ち）
   - `siteMatchStatus` が `非掲載`
5. `lastCheckedAt` が1ヶ月以上前の案件を使う場合は、掲載前に条件の再確認をユーザーに促す
6. `notes` に人間のメモがある場合は必ず読み、その指示を優先する

## 表現ルール（必須）

- 選んだ案件の `ngWords` / `prohibitedExpressions` に含まれる語句を記事・広告文に使わない
- `commonNgWords` の3リストに含まれる表現を使わない
  （案件によっては使用可の場合もあるが、その判断はユーザーに委ね、自分では使わない）
- 成果・効果を保証する表現を書かない（「必ず稼げる」「絶対痩せる」等）
- 広告主の公式サイトと誤認される表現・構成にしない
- `conversionCondition`（成果条件）と矛盾する説明を書かない
  （例: 「登録だけで報酬」ではないのにそう読める書き方）
- `rejectionConditions`（否認条件）に該当する誘導をしない
  （例: 本人申込NG案件で「自分で申し込んでみましょう」と書く等）

## 広告コードの扱い（必須）

- `adLinks[].rawCode` は**一切改変せず、そのまま**記事に埋め込む
  （URLパラメータの変更・短縮・タグの書き換えはトラッキングを壊すため禁止）
- 記事に使うのは `linkType` が `banner` または `text` のもの。`mail_text` はメール用の文面
- 広告を含む記事には、広告より前の位置にPR表記を必ず入れる
  （例: 「【PR】本記事にはアフィリエイト広告が含まれます」。ステマ規制対応）

## 禁止事項

- 記事の自動公開・自動デプロイはしない。広告を組み込んだら必ずユーザーの確認を待つ
- `approved_programs.json` に載っていない案件を使わない
- 広告コードの改変・自作・記憶からの再構成をしない（必ずJSONの `rawCode` をコピーする）

## データが空・古い場合の対応

`programs` が空、`counts.approved` が 0、または `generatedAt` が古い場合は、
自分でデータを直そうとせず、ユーザーに以下の実行を案内する:

```bash
cd /Users/to_fu/GitHub/AffiliateProgram_Manager
# Notionでのレビュー結果を取り込んでJSONを更新
npm run notion:sync -- --direction from && npm run export:claude

# ASPから最新情報を取り直す場合はその前に
npm run crawl:a8 && npm run notion:sync
```
