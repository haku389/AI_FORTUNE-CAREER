# SNS媒体別 バズるパターン集（Workflow 02 プロンプト用ナレッジ）

最終更新: 2026-07-01（4プラットフォーム合計60記事以上を調査して全面改訂）

## この文書の位置づけ

実際のX/Instagram/Threads/LINEからライブでバズ投稿を取得することは、公式APIの制限・コスト・利用規約の観点から個人開発では現実的ではないと判断した（詳細は [`workflow-design.md`](./workflow-design.md) 参照）。

代わりに、Web上で公開されている「バズる投稿の型」「コピーライティングの型」をプラットフォーム別に**最低10記事ずつ実際に読み込んで**リサーチし、型として整理したのがこの文書。1回目の調査（記事1本のみ参照）では精度が不十分だったため、2026-07-01に4プラットフォーム並行でリサーチを行い、合計60記事以上（X:15、Instagram:13、Threads:延べ30弱→統合後の実質ユニーク記事数約20、LINE:18）を根拠に全面改訂した。

Workflow 02（SNS投稿案生成）は、`platform` の値に応じてこの中から関連パターンをプロンプトに注入し、Claudeに「そのお題・ペルソナに最も合う型を選んで書く」よう指示する。新しいパターンが見つかった場合はこの文書に追記し、Workflow 02側の「プラットフォーム別パターン選択」ノードも合わせて更新する（ドキュメントだけ更新してもプロンプトには反映されないので注意）。

---

## 0. 全プラットフォーム共通の重要な発見: 「Affinity（共感）＞ Agitation（煽り）」

4プラットフォームすべての調査で、**同じ緊張関係が繰り返し見つかった**。これは偶然ではなく、コピーライティングの効果的な型の多くが本質的に「不安・損失回避・恐怖」を起点に設計されているため。

| プラットフォーム | 煽り寄りになりやすい型 |
|---|---|
| X | 意見表明・持論型の「仮想敵」要素、神話破壊型の強い断定（「誰も教えてくれない真実」） |
| Instagram | フレーミング型（「9割が知らない」）、損失回避型（「知らないと損する」）、カリギュラ効果型（「閲覧注意」） |
| Threads | 否定形・警告型（「絶対にやってはいけない」）、PAS法のAgitationステップ（危機感の醸成） |
| LINE | 限定感・希少性の緊急性訴求（「今日23:59まで」）、「3つの壁」の行動しない壁、損失回避型の訴求 |

白石玲子のキャラクター設定（`unified_fortuneTelling/docs/reiko-character.md`）は「不安を煽らない・断定しすぎない・共感ベース」が既定路線。**これは単なるトーン好みではなく、4媒体共通で見つかった"効果は高いが評価は諸刃の剣"な型を安全に扱うための実務的な指針**でもある。このため、以下の各パターンには次の3段階のトーン適合マークを付けている。

- ✅ **そのまま採用しやすい**: 共感ベースの方針とそのまま合致する
- ⚠️ **要調整**: 効果は高いが、断定・恐怖訴求の表現を「かもしれません」「傾向があります」等の柔らかい言い回しに変換してから使う
- 🚫 **不採用推奨**: 恐怖訴求・煽情的な要素が本質的な型。使うとしても大幅なアレンジが必要

Workflow 02のプロンプトでは、⚠️の型を選んだ場合は自動的に緩和表現へ変換するよう指示し、🚫は選択肢から除外している。

### 共通コピーライティングフレームワーク

| フレームワーク | 構造 | 備考 |
|---|---|---|
| **PAS** | Problem（悩み）→ Agitation（深掘り）→ Solution（解決） | Agitationが煽りに転びやすいため要調整 |
| **PASONA（2026年版）** | Problem → **Affinity**（共感、旧Agitation）→ Solution → Offer → Narrow → Action | Agitationの代わりにAffinityを使う形が2026年の主流。白石玲子の方針と直接合致 |
| **フック＋ベース構造** | フック（続きが気になる一文）→ ベース（本題への橋渡し）→ 本文 | 全媒体共通で最重要。冒頭1〜2行で離脱されると本文が読まれない |
| **3つの壁（読まない/信じない/行動しない）** | 興味喚起 → 信頼構築（実績・口コミ） → 後押し | LINE調査で発見。後押し部分が煽りに転びやすい |
| **三層心理アプローチ** | 注意（実績訴求）→ 感情（ストーリー・共感）→ 理性（データ・比較） | 「感情で動き理屈で正当化する」という説得心理の基本原則 |

### 投稿の3分割ルール（2026-07-08追加）

Xでの実投稿を検証した結果、hook（投稿1）が「感情や状況を述べて完結する一文」になってしまい、続きを読む動機がない、というフィードバックを受けて以下のルールを追加した。

- **hook（投稿1）**: 単なる感情・状況description ではなく、「これは重要な意味があるかもしれない」という断定＋続きがある合図（「続きを。👇」等）で締める。**読者への問いかけでは終わらせない**。答えを知りたくなる"謎かけ"の状態で止める設計にする
- **body（返信1）**: hookで匂わせた内容の"答え"（理由・背景・具体的な洞察）を届け、内容として完結させる
- **cta（返信2）**: 純粋な行動喚起のみ。エンゲージメント型（問いかけ）とコンバージョン型（LINE登録訴求）の2種類があり、内容に応じてどちらかを選ぶ

**注意**: 下記の各プラットフォーム別「型一覧」やX節の「CTA（締め方）の知見」で述べている「問いかけで終える」は、この**返信2（最終CTA）に対する知見**であり、投稿1（hook）には適用しない。投稿1と最終CTAは役割が異なる別物として扱うこと。

---

## 1. X（旧Twitter）

### 型一覧（12種類）

| 型 | 構成 | キャリア領域での応用 | トーン | 主な出典 |
|---|---|---|---|---|
| **数字実績×ノウハウ提示型** | 「3ヶ月で〇〇を達成した5つの施策」等、数字＋実績＋ノウハウ | 「面接〇社受けて分かった通過率が上がる質問への答え方3つ」 | ✅ | [note/kotobashira](https://note.com/kotobashira/n/n72285dc90618) |
| **失敗談・後悔からの学び型** | Before（後悔）→After（今があるのはあの経験のおかげ） | 転職の失敗談→納得感の着地。後悔の強調だけで終わらせないことが必須 | ✅（反転を必ずセットに） | [note/taka_kokoronet](https://note.com/taka_kokoronet/n/neb1ff5e82671) |
| **ストーリー型（Before→壁→解決→After→学び）** | 4〜5段階の物語構成 | 「転職を決意した日の話」等。鑑定士の語り口と自然に融合 | ✅ | [note/fasukun](https://note.com/fasukun/n/nb020083c68c9)、[tinsalo0425](https://tinsalo0425.com/magazine/how-to-make-buzz-using-x/) |
| **あるある・共感型** | 読者が「わかる」と感じる日常/職業シーンの切り取り | 「面接前夜あるある」「退職を伝える日あるある」。最有力候補 | ✅ | [note/kotobashira](https://note.com/kotobashira/n/n72285dc90618) |
| **リスト・チェックリスト型** | 「成功に必要な7つの要素」等の箇条書き | 「転職活動で準備すべき書類チェックリスト」 | ✅ | [note/fasukun](https://note.com/fasukun/n/nb020083c68c9) |
| **権威性×親近感の共感ポスト型** | 実績（権威性）＋プライベートエピソード（親近感） | 「鑑定士としての専門性」と「生活者としての等身大の語り」の両立 | ✅ | [note/taka_kokoronet](https://note.com/taka_kokoronet/n/neb1ff5e82671) |
| **自己開示・カミングアウト型** | 個人的告白 → 理由説明 → 前向きメッセージ | 鑑定士自身の気づきの吐露。個人情報の扱いに注意 | ✅ | [note/taka_kokoronet](https://note.com/taka_kokoronet/n/neb1ff5e82671) |
| **静かな余韻・削る型** | 説明を最小限に削り、改行と間で語らない強さを出す | 鑑定結果や寄り添うメッセージの締めに | ✅ | [note/taka_kokoronet](https://note.com/taka_kokoronet/n/neb1ff5e82671) |
| **視認性・レイアウト最適化型** | 改行・装飾・画像動画添付（画像付きは平均いいね数が約6.5倍というデータあり） | 型を問わず共通適用すべき土台 | ✅ | [note/otoku_yatagarasu](https://note.com/otoku_yatagarasu/n/n67443015b829)、[note/iinoo](https://note.com/iinoo/n/n0b251742cfea) |
| **フック→本文→問いかけの3部構成** | 冒頭の強いフック→根拠・具体例→読者への問いかけで締め | 万能フレーム。あらゆるテーマの土台にする | ✅ | [addness](https://addness.co.jp/media/x-algorithms/)、[free-ai-tools](https://free-ai-tools.jp/guide/x-post-writing-engagement) |
| **Q&A・逆説型（神話破壊型）** | 「誰も教えてくれない真実」等、一般的思い込みを覆す | 「転職エージェントが教えてくれない〇〇」。断定は避け「気づき」レベルに | ⚠️ | [note/kotobashira](https://note.com/kotobashira/n/n72285dc90618) |
| **意見表明・持論型** | 自分の立場を明確に打ち出す。仮想敵（対比構造）を作ることも | 対立構造は共感ベース方針と相性が悪い。使うなら「私はこう感じています」程度に | 🚫（仮想敵要素） | [free-ai-tools](https://free-ai-tools.jp/guide/x-post-writing-engagement) |

### CTA（締め方）の知見

CTAは「対象者の明確化」「具体的な行動指示」「文体調整」の3要素で構成する。**問いかけで終える**ことがリプライ誘発の決定打（複数記事で一致）。リプライはいいねの13.5〜75倍、リプライへの返信（往復）は75〜150倍という非常に重いアルゴリズムシグナルという分析が複数記事で一致していた。白石玲子のCTAは「よかったら教えてください」「もしよければ」など柔らかい語尾を使う。

### 2026年Xアルゴリズムの傾向

2026年1月にXが推薦アルゴリズムを完全オープンソース化し、5月にxAI Grokと同じTransformerアーキテクチャへ移行（ルールベース評価を廃止、AIが文脈そのものを評価）。「テンプレ感のある投稿」はむしろ低評価になり得るため、型を丸写しせず自分の言葉で肉付けする重要性が増している。投稿後30分〜2時間の初動速度、滞在時間・読了率、画像/動画添付が重視される一方、通報はいいねの-738倍相当という重いペナルティ。

### 参考記事一覧（X、実読了15本）

[X投稿で爆伸びする構成テンプレ40パターン集](https://note.com/kotobashira/n/n72285dc90618) ／ [【保存版】2025.07.28～バズったX構文＆投稿テクニックまとめ](https://note.com/taka_kokoronet/n/neb1ff5e82671) ／ [【2026年最新】Xアルゴリズム徹底解説](https://www.comnico.jp/we-love-social/x-algorithm) ／ [【2026年最新】X公式アルゴリズムを解読](https://note.com/ogulinks/n/nf9650ef93883) ／ [【2026年最新】Xアルゴリズム完全攻略](https://addness.co.jp/media/x-algorithms/) ／ [【2026年6月更新】Xの「おすすめ」はどう決まる？](https://www.hottolink.co.jp/column/20251222_120027/) ／ [Xポスト書き方【2026年版】](https://free-ai-tools.jp/guide/x-post-writing-engagement) ／ [バズらせたいのに伸びない…SNSで"バズる投稿"を作る8つのルール](https://note.com/fasukun/n/nb020083c68c9) ／ [拡散されやすいXのアルゴリズムとは](https://sogyotecho.jp/x-algorithm/) ／ [【実例あり】6万人フォロワーがXでバズる方法](https://tinsalo0425.com/magazine/how-to-make-buzz-using-x/) ／ [フォロワーが多い人はXで何をしているのか](https://note.com/iinoo/n/n0b251742cfea) ／ [twitterでシェアをしたくなってしまうコピーライティング](https://xn--28jyap6d.com/twitter%E3%81%A7%E3%82%B7%E3%82%A7%E3%82%A2%E3%82%92%E3%81%97%E3%81%9F%E3%81%8F%E3%81%AA%E3%81%A3%E3%81%A6%E3%81%97%E3%81%BE%E3%81%86%E3%82%B3%E3%83%94%E3%83%BC%E3%83%A9%E3%82%A4%E3%83%86%E3%82%A3) ／ [ツイートをバズらせる5つのテクニック](https://note.com/otoku_yatagarasu/n/n67443015b829) ／ [Xでバズるための投稿テクニック](https://note.com/mark_10_dmcd/n/n2888666fe8ae) ／ [投稿のCTAをAIで量産するテクニック](https://note.com/murasame_tech/n/nbdbb4b63c078)

---

## 2. Instagram

### 型一覧（13種類）

| 型 | 構成 | キャリア領域での応用 | トーン | 主な出典 |
|---|---|---|---|---|
| **ノウハウ・HOW TO型** | 「〇〇のやり方」「失敗しないための3つのポイント」 | 「面接で使える逆質問3選」 | ✅ | [SAKIYOMI](https://sns-sakiyomi.com/blog/tips/instagram-algorithm/) |
| **WHY型（理由・背景解説）** | 「なぜ〇〇が起きるのか」を解説 | 「なぜ30代の転職は"軸"が重要なのか」 | ✅ | [note/shimada_atsushi](https://note.com/shimada_atsushi/n/n5333d977c2d2) |
| **STORY型（共感・ビフォーアフター体験談）** | 象徴的人物のビフォーアフターを物語調で | 相談者の転職ストーリー（属性はぼかす） | ✅ | [note/shimada_atsushi](https://note.com/shimada_atsushi/n/n5333d977c2d2) |
| **まとめ・〇選型** | 「〇〇7選」「確認すべき3つのチェックリスト」 | 「求人票で見るべき3つのポイント」 | ✅ | [slooooth](https://media.slooooth.com/ig-op-saveable-post/) |
| **ビフォーアフター比較型** | 改善前後を並べて見せる | 「職務経歴書のNG例→OK例」。過度な"成功演出"は避ける | ✅ | [slooooth](https://media.slooooth.com/ig-op-saveable-post/) |
| **問いかけ型（質問投げかけ・二択）** | 「あなたはどっち派？」でコメント誘発 | 「今の仕事、続ける？変える？」。内省を促す優しい問いに | ✅ | [tatap](https://tatap.jp/knowledge/instagram-reel-185/) |
| **ターゲット指定型** | 「〇〇な人だけ見てください」と対象を明確に絞る | ペルソナ設計と直結。「今の仕事に違和感がある20代へ」 | ✅ | [tatap](https://tatap.jp/knowledge/instagram-reel-185/) |
| **数字提示型** | 「3つのコツ」「1日5分で」と数字を見出しに | 「転職成功者に共通する3つの習慣」。「絶対」等の断定は避ける | ✅ | [note/_soutao](https://note.com/_soutao/n/n725efa9854f0) |
| **共感つぶやき・あるある型** | 日常の"あるある"に寄り添う短い一言 | 「日曜の夜、また明日かと思うと憂鬱になる」 | ✅ | [kurashi-sukima](https://kurashi-sukima.com/caption/) |
| **カルーセル3部構成型** | 表紙（フック）→本文（1枚1メッセージ）→CTA | 「診断→原因→対処法→CTA」。占い診断コンテンツと好相性 | ✅ | [note/_soutao](https://note.com/_soutao/n/n725efa9854f0) |
| **キャプション「共感→解決策→CTA」型** | 悩みへの共感→解決策→行動喚起の3段階 | 白石玲子の基本フォーマットとして最適 | ✅ | [SAKIYOMI](https://sns-sakiyomi.com/blog/function/instagram-caption/) |
| **フレーミング型** | 「9割の人が知らない」等、切り口を変えて印象を強める | 断定表現になりやすいため要調整（「傾向があります」等に） | ⚠️ | [kaoriblog](https://www.kaoriblog.com/202206instagram_psychology/) |
| **損失回避型** | 「知らないと損する」とプロスペクト理論を利用 | 「知っておくと安心」のような安心提供への言い換えが必要 | ⚠️ | [kaoriblog](https://www.kaoriblog.com/202206instagram_psychology/) |

不採用推奨: カリギュラ効果型（「閲覧注意」）、スノッブ効果型（「残りわずか」）、ショック型フック（「嘘でしょ？」）— いずれも占い・キャリア相談の文脈で必要性が低く、恐怖・緊張を煽る性質が強い。

### キャプション以外の知見

- 保存率が最重要指標（2〜3%が「伸びる投稿」の目安）だが、2026年は**DMシェアがいいね・コメントの約5倍の重み**という指摘が複数記事で一致。「友達にも教えたくなる」設計や「シェアしてね」という直接CTAが今後重要
- カルーセルは7〜10枚、1枚目のデザインで8割決まる。推奨サイズ1080×1350px（4:5縦長）
- ハッシュタグは2025年12月にInstagram公式が**最大5個**を推奨する方針を発表（関連性が最重要、キャプション内キーワードとの整合性が検索表示に影響）
- リールの「リプレイ率（再視聴率）」が新評価軸として浮上。完全に説明しきらず"あえて余白を残す"設計が伸びやすい
- アカウントのジャンル一貫性をAIが評価するため、「キャリア×占い」で軸が明確なcareer-uranai.siteは有利

### 参考記事一覧（Instagram、実読了13本）

[インスタのキャプションの書き方をプロが解説](https://sns-sakiyomi.com/blog/function/instagram-caption/) ／ [インスタのカルーセル投稿のコツ15選](https://note.com/_soutao/n/n725efa9854f0) ／ [インスタフォロワーに思わず「保存」と「シェア」される投稿の型](https://note.com/shimada_atsushi/n/n5333d977c2d2) ／ [Instagramアルゴリズム完全攻略｜2026年最新](https://s--line.co.jp/instagram-algorithm-2026-latest/) ／ [インスタリール攻略完全ガイド【2026年最新】](https://tatap.jp/knowledge/instagram-reel-185/) ／ [インスタ集客／バズを起こす心理学10選](https://www.kaoriblog.com/202206instagram_psychology/) ／ [Instagram運用で意識したい心理的効果とは？17の要素](https://media.slooooth.com/instagram-psychological-effect/) ／ [【2026最新】インスタで保存される投稿の作り方](https://media.slooooth.com/ig-op-saveable-post/) ／ [【2025年最新版】プロがInstagramアルゴリズムを徹底解説](https://sns-sakiyomi.com/blog/tips/instagram-algorithm/) ／ [インスタキャプション例文](https://kurashi-sukima.com/caption/) ／ [【2026年最新】Instagram発見タブの載り方・完全攻略ガイド](https://tatap.jp/knowledge/how-to-appear-on-instagrams-discover-tab/) ／ [【2026年最新版】ハッシュタグ上限5個時代のキャプション設計](https://www.sharecoto.co.jp/instagramlab/hashtag-update) ／ [インスタで自己啓発系の発信に反応が出にくい理由](https://ameblo.jp/nami-business/entry-12666738193.html)

---

## 3. Threads

### 型一覧（13種類、2回の独立調査を統合）

| 型 | 構成 | キャリア領域での応用 | トーン | 主な出典 |
|---|---|---|---|---|
| **共感・違和感フック型** | 冒頭1行で「それ私の話だ」と思わせる問題提起 | 「今の仕事、なんとなく続けているだけになっていませんか」 | ✅ | [solezore](https://solezore.co.jp/blog/threads-algorithm/)、[note/nice_fish9577](https://note.com/nice_fish9577/n/n325bfe5fb108) |
| **結論先出し(BLUF)＋具体例＋問いかけ型** | 結論→理由・体験→問いかけの三段構成 | 「転職で一番後悔しやすいのは"人間関係のリサーチ不足"です」 | ✅ | [吉和の森](https://yoshikazunomori.com/blog/digitalmarketing/how-to-stretch-threads/)、[solezore](https://solezore.co.jp/blog/threads-algorithm/) |
| **二段構え型（メイン投稿＋コメント欄追投稿）** | メインで結論・共感を出し切り、コメント欄で深掘り | 本文「転職活動は"応募前"に9割決まる」→コメントで具体策 | ✅ | [Agent Youフォーラム](https://forum.agentyou.jp/archives/agentlog/threads-post-template/) |
| **質問・問いかけ締め型** | 「あなたはどう思う？」で会話のハードルを下げる | 「あなたは今の職場、あと何年続けたいですか？」 | ✅ | [addness](https://addness.co.jp/media/threads-algorithms/)、[comnico](https://www.comnico.jp/we-love-social/meta-threads) |
| **ストーリーテリング型（体験談）** | 過去（悩み）→変化のきっかけ→結果（今）の時系列 | 匿名化した相談者のケーススタディ的な語り | ✅ | [赤髪SNS研究所](https://akagami.blog/threadst/)、[admarkeg](https://admarkeg.com/threads%E3%83%90%E3%82%BA%E3%82%8A%E6%8A%95%E7%A8%BF%E3%81%AE%E6%B3%95%E5%89%87%EF%BC%9A%E3%83%AA%E3%83%BC%E3%83%81%E3%82%92%E7%88%86%E7%99%BA%E3%81%95%E3%81%9B%E3%82%8B7%E3%81%A4%E3%81%AE%E9%BB%84/) |
| **リスト・チェックリスト・保存型** | 番号付きリストやランキング形式で情報を構造化 | 「面接で聞かれがちな質問トップ3」 | ✅ | [note/inakaonline](https://note.com/inakaonline/n/nd2bfca1da525) |
| **選択肢提示・仮定法型** | 「Aタイプ？Bタイプ？」「もし〇〇だったら？」で自分ごと化 | 「転職で年収重視派？やりがい重視派？」。占いとの相性が良い | ✅ | [solezore](https://solezore.co.jp/blog/threads-algorithm/)、[赤髪SNS研究所](https://akagami.blog/threadst/) |
| **短文×余白型（感情の切り取り）** | 1〜2文の非常に短いテキストで状況・感情だけ切り取る | 「今日も、"辞めたい"を飲み込んで出社した。」 | ✅ | [note/omoto_club](https://note.com/omoto_club/n/n0768f0a96e6e)、[note/nice_fish9577](https://note.com/nice_fish9577/n/n325bfe5fb108) |
| **トレンド・時事便乗型** | 話題のトピック欄や季節ネタに絡める | 「4月の異動シーズン」「ボーナス時期の転職相談急増」 | ✅ | [addness](https://addness.co.jp/media/threads-algorithms/) |
| **数字・具体データ型** | 「〇〇の特徴TOP7」等、数字を見出しに | 「転職活動でつまずきやすい3つのポイント」 | ✅ | [赤髪SNS研究所](https://akagami.blog/threadst/) |
| **逆説・常識否定型** | 「一般的に言われている〇〇は実は間違い」 | 「『転職は35歳が限界』は本当か」。断定しすぎない配慮が必要 | ⚠️ | [赤髪SNS研究所](https://akagami.blog/threadst/)、[admarkeg](https://admarkeg.com/threads%E3%83%90%E3%82%BA%E3%82%8A%E6%8A%95%E7%A8%BF%E3%81%AE%E6%B3%95%E5%89%87%EF%BC%9A%E3%83%AA%E3%83%BC%E3%83%81%E3%82%92%E7%88%86%E7%99%BA%E3%81%95%E3%81%9B%E3%82%8B7%E3%81%A4%E3%81%AE%E9%BB%84/) |
| **否定形・警告型（やってはいけないこと型）** | 避けるべき行動をリスト化 | 「NG」を「気をつけたいポイント」に言い換えて使う | ⚠️ | [赤髪SNS研究所](https://akagami.blog/threadst/) |
| **PAS法（Problem→Agitation→Solution）** | 問題提示→危機感醸成→解決策 | Agitationを「共感の深掘り」に置き換えたアレンジ版を使う | ⚠️ | [赤髪SNS研究所](https://akagami.blog/threadst/) |

### 型以外の運用ノウハウ

- **リプライ（返信）が最重要指標**: Threads全体のビューの50%以上が返信コンテンツというMeta公式データが複数記事で引用。投稿後1時間以内の初速対応が「おすすめ」表示のゲートになる4段階評価（Stage1〜4）の突破に直結
- 投稿頻度は週2〜5回、理想は1日1回以上。ただし量より「投稿設計の質」「継続性・安定性」重視（週3本以上を1ヶ月継続して初めて信頼シグナルとして認識されるとの指摘）
- 投稿時間帯は朝7〜9時・夜18〜22時が反応が出やすい傾向（絶対的なゴールデンタイムはなくフォロワー属性依存という注意点あり）
- 文字数は500文字以内が目安。外部リンクを本文に直接貼るとリーチが制限される傾向（プロフィールリンク活用が推奨）
- アカウントのテーマ一貫性をAIが評価。career-uranai.siteは「キャリア×占い」で軸が明確なため有利
- 2026年1月の広告全世界展開以降、「新規アカウント優遇ボーナス期間」は終了し、実力（エンゲージメント設計力）が問われるフェーズという指摘

### 参考記事一覧（Threads、実読了・統合ユニーク約20本）

[【2026年最新】Threadsアルゴリズム完全攻略｜アドネスラボ](https://addness.co.jp/media/threads-algorithms/) ／ [【保存版】Threadsでバズる！文章テクニック10選｜赤髪SNS研究所](https://akagami.blog/threadst/) ／ [『毎日投稿してるのに伸びない』人へ｜note](https://note.com/omoto_club/n/nfb75b7b1c867) ／ [Threadsアルゴリズムの完全攻略｜solezore](https://solezore.co.jp/blog/threads-algorithm/) ／ [Threads専用"二段構え"の投稿の型｜Agent Youフォーラム](https://forum.agentyou.jp/archives/agentlog/threads-post-template/) ／ [【Meta公式】Threadsの最新アルゴリズムの仕組み｜note](https://note.com/asa_to_ame/n/nf711a8595b4f) ／ [Threads投稿はこう作る！共感・拡散される構成のコツ｜note](https://note.com/omoto_club/n/n0768f0a96e6e) ／ [Threads投稿の正解は？｜赤髪SNS研究所](https://akagami.blog/threadste/) ／ [【Metaに聞いた】Threads運用、7つのコツ｜comnico](https://www.comnico.jp/we-love-social/meta-threads) ／ [Threadsで伸びる時間帯は？｜赤髪SNS研究所](https://akagami.blog/threads-t-2/) ／ [フォロワー1万人を最速で達成するThreads完全設計図｜note](https://note.com/inakaonline/n/nd2bfca1da525) ／ [Threadsバズり投稿の法則：7つの黄金ルール｜admarkeg](https://admarkeg.com/threads%E3%83%90%E3%82%BA%E3%82%8A%E6%8A%95%E7%A8%BF%E3%81%AE%E6%B3%95%E5%89%87%EF%BC%9A%E3%83%AA%E3%83%BC%E3%83%81%E3%82%92%E7%88%86%E7%99%BA%E3%81%95%E3%81%9B%E3%82%8B7%E3%81%A4%E3%81%AE%E9%BB%84/) ／ [Threads研究でわかるバズ投稿と伸びない理由｜SNSサーチ](https://sns-search.com/2025/12/13/post-162/) ／ [【初心者が陥る失敗とその対策】｜JUN BLOG](https://jusan-blog.com/threads-beginner-failure/) ／ [Threadsでバズる投稿を作るために最初に知っておくべきこと｜note](https://note.com/nice_fish9577/n/n325bfe5fb108) ／ [Threadsフォロワー増やし方完全版｜Brain公式メディア](https://media.brain-market.com/threads-followers-monetization-brain/) ／ [なぜあなたのThreadsは集客に繋がらない？｜吉和の森](https://yoshikazunomori.com/blog/digitalmarketing/how-to-stretch-threads/) ／ [Threadsの投稿が伸びない理由はコレ｜赤髪SNS研究所](https://akagami.blog/threadsa/) ／ [【2026年最新】Threadsの使い方とは？｜Ownly SNS Lab](https://www.ownly.jp/sslab/threads-utilization-method)

---

## 4. LINE公式アカウント

### 型一覧（14種類）

| 型 | 構成 | キャリア領域での応用 | トーン | 主な出典 |
|---|---|---|---|---|
| **ベネフィット先出し型** | 冒頭に絵文字＋断定的ベネフィット見出し→説明→CTA | 「あなたに合う求人が◯件届きました」 | ✅ | [al-base](https://al-base.jp/column/11) |
| **情報提供・教育型** | 課題提示→有益な知識の一部→詳細は外部リンクへ | 「面接で聞かれやすい質問トップ3」 | ✅ | [al-base](https://al-base.jp/column/11)、[mico-inc](https://mico-inc.com/blog/line-message-open-rate/) |
| **ストーリーテリング型** | ユーザーの変化・体験談をBefore/Afterで | 「不安だった相談者が一歩踏み出せた話」 | ✅ | [ligla](https://ligla.jp/blog/delivery/contents/) |
| **参加型・双方向型** | アンケート・クイズ・診断への参加を促す | 既存の「診断」コンテンツへの再誘導と直結 | ✅ | [ligla](https://ligla.jp/blog/delivery/contents/) |
| **感謝・共感型** | 登録・利用への感謝→共感的な一言→次のアクション | 白石玲子のキャラクター性と最も親和性が高い基本形 | ✅ | [ligla](https://ligla.jp/blog/delivery/contents/) |
| **パーソナライズ型** | 名前差し込み、行動履歴の言及、診断結果の参照 | 「〇〇さんの診断結果によると」。開封率+15〜20%等の報告あり | ✅ | [engagech](https://engagech.com/media/open-rate-techniques/)、[silveregg](https://www.silveregg.co.jp/archives/blog/2024-01-LINE-Account) |
| **1吹き出し1メッセージ・シンプル型** | 1吹き出しに1訴求・1CTAのみ、300字程度 | 全配信共通の基礎ルールとして採用 | ✅ | [stock-sun](https://stock-sun.com/column/line-step-cast/) |
| **リッチメッセージ・ワンビジュアル型** | 画像で主要訴求を1つだけ、興味喚起系の文言でタップ誘導 | 「あなたの適職タイプは？」で好奇心を刺激 | ✅ | [ab-assist](https://ab-assist.co.jp/blog/rm-clickrate/) |
| **ステップ配信・段階育成型** | 挨拶→育成コンテンツ→本提案→体験談の8〜9通設計 | 「友だち追加→軽い誘導→キャリア情報→本鑑定への誘導」 | ✅ | [stock-sun](https://stock-sun.com/column/line-step-cast/) |
| **上下読み対応型** | 結論→ベネフィット→具体例→ターゲット再提示という対称構成 | 複数吹き出し配信で各吹き出し単体でも意味が通る設計に | ✅ | [hayato0606](https://www.hayato0606.com/linewriting/) |
| **PASONA型（6段階）** | Problem→Affinity→Solution→Offer→Narrow→Action | 「今の仕事に違和感は？（P）→よくわかります（A）→鑑定で見える（S）」 | ✅（Affinity版なら） | [hayato0606](https://www.hayato0606.com/linewriting/) |
| **三層心理アプローチ型** | 注意（実績）→感情（ストーリー）→理性（データ・比較） | ステップ配信やコラム誘導で「気づき→共感→納得材料」の順に | ✅（①を強めすぎなければ） | [markelink](https://markelink.biz/article/27356/) |
| **限定感・希少性強調型** | 対象限定＋期限/人数の明示＋CTA | 「今週だけの特別鑑定枠」程度のソフトな限定に留める | ⚠️ | [al-base](https://al-base.jp/column/11) |
| **3つの壁を超える型** | 興味喚起→信頼構築→期間限定等で後押し | 「行動しない壁」の後押しは「あなたのペースで大丈夫」に変換 | ⚠️ | [hayato0606](https://www.hayato0606.com/linewriting/) |

### 型以外の運用ノウハウ

- **開封率の相場**: LINE公式アカウントの平均開封率は約55〜65%（メルマガの2〜6倍）。リンククリック率は平均約30%程度という報告
- **配信タイミング**: 高開封率の曜日は金曜（次いで月・日という報告と、土曜が最多という報告があり業種依存）。時間帯は朝9時・昼12時・夕方18時・夜21時が共通して挙げられる。ビジネスパーソン層は昼休みと仕事終わり（17〜20時）が特に良い
- **セグメント配信の効果**: 属性（友だち期間・性別・年齢・地域）とオーディエンス（クリック行動・チャットタグ等の行動ベース）の2軸で配信を絞ると効果大。転職業界の実例では行動データ連動配信でLINE経由応募数が7倍になった事例あり
- **リッチメッセージ**: クリック率はテキストのみ3〜8%に対し12〜22%。文言を「詳しくはこちら」から「今すぐcheck！」等の興味喚起型に変えるだけでクリック率が2倍になった事例あり
- **あいさつメッセージ**: 友だち追加直後は最大5吹き出しまで設定可能かつ配信通数カウント外。開封率はほぼ100%に近い最重要タッチポイント

### 転職・キャリア系サービス特有の知見

- 希望条件（職種・勤務地・働き方）を初期にヒアリングしてタグ管理する運用が定番。診断結果や相談内容のタグ化がセグメント配信に直結する
- 「希望と関係のない求人ばかり届く」がブロックの主要因という指摘が複数記事で共通。ミスマッチ配信を避け、セグメント配信を基本にすべき
- 求職期間には検討度合いの波があるため、一度反応がなくてもタイミングを変えて再配信するアプローチが有効（「今すぐ転職」ではなく「あなたのタイミングで」という余白を持たせる設計は白石玲子のトーンとも合致）
- 人材業界の成功事例: ディップ（応募数1.7倍超）、RGF HR Agent（面談設定率1.7倍）、日総工産（応募数約3倍）、フジアルテ（応募数約5倍）、女の転職type（LINE経由応募数7倍）

### 参考記事一覧（LINE、実読了18本）

[LINE公式アカウントのメッセージ配信で真似したい例文34選](https://al-base.jp/column/11) ／ [LINE公式アカウントのメッセージ開封率を上げる方法とは](https://mico-inc.com/blog/line-message-open-rate/) ／ [9割が出来ていないLINEコピーライティング](https://www.hayato0606.com/linewriting/) ／ [【プロンプトも大公開】LINE配信で使える最強ライティング術](https://markelink.biz/article/27356/) ／ [LINE公式アカウントのセグメント配信とは](https://mico-inc.com/blog/line-segment-delivery/) ／ [#23【LINE公式アカウント運用】リッチメッセージの作り方](https://ab-assist.co.jp/blog/rm-clickrate/) ／ [人材業界のLINE公式アカウント活用法](https://mico-inc.com/blog/line-human-resources/) ／ [【転職支援／人材紹介】LINEを活用して求人紹介の反応率を高める方法](https://line-sm.com/blog/lineofficial_recruitment/) ／ [【プロが徹底解説】LINEのステップ配信のやり方は？](https://stock-sun.com/column/line-step-cast/) ／ [【LINE公式の配信内容】ユーザーが飽きない、開封率が上がるメッセージ](https://ligla.jp/blog/delivery/contents/) ／ [LINE公式アカウントのメッセージ開封率を上げる5つのテクニック](https://engagech.com/media/open-rate-techniques/) ／ [LINE公式アカウントの開封率が上がる時間帯とは](https://lme.jp/media/know-how/timing/) ／ [LINEで使えるコピーライティング7つ](https://linestep.jp/2022/04/13/line-copywriting/) ／ [LINE公式アカウント活用術！情報の質を高めてクリック率を上げよう](https://www.silveregg.co.jp/archives/blog/2024-01-LINE-Account) ／ [【事例】人材・求人サイトでのLINE公式アカウント活用](https://blog.socialplus.jp/case/line-for-job-site/) ／ [【コピペOK】LINE公式アカウントのあいさつメッセージ例文](https://mico-inc.com/blog/line-aisatsu-message/) ／ [LINE公式アカウントのメッセージ配信の方法とコツとは](https://line-sm.com/blog/lineofficial_message/) ／ [LINE公式アカウント リッチメッセージとは](https://telas.torchlight.co.jp/column/line_rich-message/)

---

## 5. Workflow 02への反映方針

- `platform` の値（X / Instagram / Threads / LINE）に応じて、上記の該当セクションの型一覧をプロンプトに埋め込む（Codeノード「プラットフォーム別パターン選択」）
- Claudeには「該当プラットフォームの型の中から、post_typeとsource_summaryに最も合うものを1つ選んで書く」よう指示し、どの型を選んだかを `pattern_used` として出力させ、Notion側にも記録する（振り返り用）
- ⚠️の型を選んだ場合は自動的に緩和表現へ変換するよう指示し、🚫（不採用推奨）の型は選択肢に含めない
- 共通ルール（Affinity優先・不安を煽らない・断定しない）は全プラットフォーム共通の前提としてシステムプロンプトの先頭に置く
- **投稿の3分割ルール（上記参照）は、プラットフォーム別の型一覧よりさらに上位の構造ルールとして扱う**。プラットフォーム別の型はhook/body/ctaそれぞれの「トーン・切り口」を選ぶためのものであり、hook単体を問いかけで終わらせてよいという意味ではない
- 新しいパターンが見つかった場合は、この文書と「プラットフォーム別パターン選択」ノードの両方を更新する（本文執筆時のプロンプトにはCodeノード側の短縮版が使われるため、ドキュメントだけの更新では反映されない）
