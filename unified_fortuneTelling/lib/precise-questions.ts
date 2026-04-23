export type AnswerScore = {
  urgency_add?: number;
  suppression?: number;     // 抑圧度（Q2）
  strength_lack?: number;   // 強み未活用度（Q3）
  tenure?: string;          // 在籍・転職経験（Q4）
  mbti?: string;            // MBTIタイプ（Q5）
  motivation?: string;      // モチベーション源（Q6）
  stress_type?: string;     // ストレス反応型（Q7）
  leadership?: string;      // リーダー像（Q8）
  comm_type?: string;       // コミュニケーション型（Q9）
  decision?: string;        // 意思決定スタイル（Q10）
  current_industry?: string; // 現業界（Q11）
  industry?: string;        // 業界マッチング（Q12）
  role?: string;            // 職種マッチング（Q12）
  area?: string;            // 希望エリア（Q13）
  prefecture?: string;      // 希望都道府県（Q14）
  independent?: number;     // 独立志向スコア（Q15）
  salary_focus?: number;    // 年収重視スコア（Q16）
  barrier?: string;         // 転職障壁（Q17）
  work_style?: string;      // 働き方タイプ（Q18）
  org_size?: string;        // 組織規模（Q19）
  wlb?: string;             // WLB優先度（Q20）
  vision?: string;          // キャリアビジョン（Q21）
  market_value?: number;    // 市場価値スコア（Q22）
  external_view?: string;   // 他者評価（Q23）
  action_start?: string;    // 行動起点（Q24）
  readiness_add?: number;   // 行動準備スコア追加（Q24）
  determination?: number;   // 変容への覚悟（Q25）
};

export type QuestionOption = {
  sym: string;
  main: string;
  hint: string;
  s: AnswerScore;
  relatedIndustries?: string[]; // Q12専用: 指定業界選択時のみ表示（未指定=常時表示）
  relatedAreas?: string[];      // Q14専用: 指定地方選択時のみ表示（未指定=常時表示）
};

export type Question = {
  block: number;
  tag: string;
  planet: string;
  q: string;
  hint: string;
  opts: QuestionOption[];
  multi?: boolean;  // 複数選択可
};

export const QUESTIONS: Question[] = [
  // ── BLOCK 1: 土星が刻む「今の場所と時間」 ──
  {
    block: 1,
    tag: '🪐 土星が問う — 魂の消耗度',
    planet: '土星',
    q: '今の職場に「もう限界かも」と感じ始めたのはいつ頃から？',
    hint: '土星は「忍耐と試練」を司る惑星。あなたの正直な感覚が最も精度の高い星読みになります。',
    opts: [
      { sym: 'AlertCircle', main: '入社当初から感じていた',   hint: '最初から合わないと直感していた',     s: { urgency_add: 4 } },
      { sym: 'Clock',       main: '1年以内に感じ始めた',      hint: '働き始めてすぐに違和感が生まれた',   s: { urgency_add: 3 } },
      { sym: 'Calendar',    main: '2〜3年経ってから',         hint: '積み重なって気づいたら限界だった',   s: { urgency_add: 2 } },
      { sym: 'Zap',         main: '最近になって急に',          hint: '何かをきっかけに突然感じ始めた',     s: { urgency_add: 4 } },
    ],
  },
  {
    block: 1,
    tag: '🌑 月が映す — 本音の深さ',
    planet: '月',
    q: '仕事の悩みを、誰かに打ち明けられないまま心の奥にしまっていることはある？',
    hint: '月は「隠れた感情と本音」を映す惑星。夜中に浮かぶ思いこそが、今の星の声です。',
    opts: [
      { sym: 'Lock',          main: 'いつもそう感じている',   hint: '誰にも言えない本音がある',   s: { urgency_add: 2, suppression: 3 } },
      { sym: 'MessageCircle', main: 'たまにある',             hint: '時々心が重くなる夜がある',   s: { urgency_add: 1, suppression: 2 } },
      { sym: 'MessageSquare', main: 'あまりない',             hint: '比較的話せている方かも',     s: { urgency_add: 0, suppression: 1 } },
      { sym: 'Heart',         main: 'ほとんどない',           hint: '今は心が穏やかな状態',       s: { urgency_add: 0, suppression: 0 } },
    ],
  },
  {
    block: 1,
    tag: '☿ 水星が見る — 才能の使われ方',
    planet: '水星',
    q: '今の職場で「自分の得意なことが活かせている」と感じる場面は？',
    hint: '水星は「才能と言葉」を司る惑星。今の環境で輝けているかが転職判断の鍵になります。',
    opts: [
      { sym: 'Sparkles',       main: 'たくさんある',       hint: '毎日が充実していると感じる',         s: { urgency_add: 0, strength_lack: 0 } },
      { sym: 'CloudSun',       main: '少しはある',         hint: '一部は活かせているけど物足りない',   s: { urgency_add: 1, strength_lack: 1 } },
      { sym: 'Cloud',          main: 'あまり感じない',     hint: '実力が発揮できていないもどかしさ',   s: { urgency_add: 2, strength_lack: 2 } },
      { sym: 'CloudLightning', main: 'まったく感じない',   hint: '才能が埋まっている感覚がずっとある', s: { urgency_add: 3, strength_lack: 3 } },
    ],
  },
  {
    block: 1,
    tag: '🪐 土星が刻む — 時間の積み重ね',
    planet: '土星',
    q: '今の職場に何年いる？また、転職は今回が何回目になる？',
    hint: '土星は「時間と経験の蓄積」を司る惑星。あなたが積み上げてきたものが、市場価値を決めます。',
    opts: [
      { sym: 'Sprout', main: '在籍3年未満・初転職',        hint: '社会人経験が浅め。若さが武器',       s: { urgency_add: 1, tenure: 'short_first' } },
      { sym: 'Star',   main: '在籍3年未満・転職経験あり',   hint: '柔軟な動き方を知っている',           s: { urgency_add: 1, tenure: 'short_exp' } },
      { sym: 'Leaf',   main: '在籍3〜7年・初転職',         hint: '専門性が蓄積されてきた時期',         s: { urgency_add: 2, tenure: 'mid_first' } },
      { sym: 'Gem',    main: '在籍3〜7年・転職経験あり',   hint: 'キャリアの方向性を見定めている段階', s: { urgency_add: 2, tenure: 'mid_exp' } },
      { sym: 'Trophy', main: '在籍7年以上',               hint: '深い専門性と実績がある',             s: { urgency_add: 3, tenure: 'long' } },
    ],
  },

  // ── BLOCK 2: 惑星が読み解く「魂の色」 ──
  {
    block: 2,
    tag: '☿ 水星が映す — 思考の星型',
    planet: '水星',
    q: 'あなたのMBTIタイプに近いのはどれ？わからない場合は、直感で一番しっくりくるものを選んで',
    hint: '水星は「思考と言語」を司る惑星。あなたの思考パターンが職種マッチングの精度を高めます。',
    opts: [
      { sym: 'Brain',         main: 'INTJ / INTP / ENTJ / ENTP（論理・戦略・革新系）', hint: 'NT型 — 理論的・独立した思考', s: { mbti: 'NT' } },
      { sym: 'Lightbulb',     main: 'INFJ / INFP / ENFJ / ENFP（理念・共感・ビジョン系）', hint: 'NF型 — 直感的・感情的', s: { mbti: 'NF' } },
      { sym: 'ClipboardList', main: 'ISTJ / ISFJ / ESTJ / ESFJ（責任・秩序・サポート系）', hint: 'SJ型 — 実務的・安定志向', s: { mbti: 'SJ' } },
      { sym: 'Target',        main: 'ISTP / ISFP / ESTP / ESFP（行動・適応・実践系）',    hint: 'SP型 — 柔軟・現実対応型', s: { mbti: 'SP' } },
      { sym: 'HelpCircle',    main: 'よくわからない・診断したことがない',                  hint: '直感で選んだもので大丈夫', s: { mbti: 'unknown' } },
    ],
  },
  {
    block: 2,
    tag: '♀ 金星が問う — 魂が喜ぶ瞬間',
    planet: '金星',
    q: '仕事の中で「時間を忘れるほど没頭できる」のは、どんな瞬間？',
    hint: '金星は「喜びと情熱」を司る惑星。没頭できるものこそ、あなたの天性の強みのサイン。',
    opts: [
      { sym: 'Handshake', main: '誰かの役に立てていると感じる時', hint: '貢献・サポートが原動力', s: { motivation: 'contribution' } },
      { sym: 'Search',    main: '新しいことを発見・学んでいる時', hint: '好奇心・探求が原動力',   s: { motivation: 'learning' } },
      { sym: 'Palette',   main: '自分のアイデアが形になる時',     hint: '創造・表現が原動力',     s: { motivation: 'creation' } },
      { sym: 'BarChart2', main: '数字や結果が出た時',             hint: '成果・達成感が原動力',   s: { motivation: 'achievement' } },
    ],
  },
  {
    block: 2,
    tag: '♂ 火星が試す — プレッシャーへの応え方',
    planet: '火星',
    q: '締め切りや急なトラブルが来たとき、あなたの星はどう反応する？',
    hint: '火星は「行動と闘争心」を司る惑星。プレッシャーへの反応が、あなたに向く職場環境を示します。',
    opts: [
      { sym: 'Flame',  main: '燃えて集中力が増す',          hint: '追い込まれた方が力が出るタイプ', s: { stress_type: 'energize' } },
      { sym: 'Waves',  main: '冷静に一つずつ対処する',       hint: '感情を抑えて手を動かせる',       s: { stress_type: 'steady' } },
      { sym: 'Wind',   main: '焦りながらも何とかこなす',     hint: '焦りはあるが最後はやり切る',     s: { stress_type: 'anxious' } },
      { sym: 'Anchor', main: '固まってしまい動けなくなる',   hint: '穏やかな環境で本領発揮できる',   s: { stress_type: 'freeze' } },
    ],
  },
  {
    block: 2,
    tag: '🪐 土星が示す — 理想のリーダー像',
    planet: '土星',
    q: '上司にするなら、どんなタイプの人のもとで一番力が発揮できる？',
    hint: '土星は「組織と規律」を司る惑星。相性のいい上司タイプが、職場環境選びの指針になります。',
    opts: [
      { sym: 'UserCheck', main: '方向性を示してあとは任せてくれる人',   hint: '自律性を重視するタイプ',       s: { leadership: 'delegate' } },
      { sym: 'Leaf',      main: '細かく丁寧にサポートしてくれる人',     hint: '手厚いサポートで伸びるタイプ', s: { leadership: 'support' } },
      { sym: 'Scale',     main: '対等に意見を言い合える人',             hint: 'フラットな関係性が合うタイプ', s: { leadership: 'equal' } },
      { sym: 'Target',    main: '結果だけ求めて干渉しない人',           hint: '完全な裁量で動くタイプ',       s: { leadership: 'results' } },
    ],
  },
  {
    block: 2,
    tag: '☿ 水星が照らす — 言葉の使い方',
    planet: '水星',
    q: '自分の考えを一番うまく伝えられるのは、どんな方法？',
    hint: '水星は「コミュニケーション」を司る惑星。あなたの得意な伝え方が、活きる職種のヒントになります。',
    opts: [
      { sym: 'MessageCircle', main: '直接話す・対面が一番伝わる',         hint: '言葉で熱量を伝えるタイプ',         s: { comm_type: 'verbal' } },
      { sym: 'PenLine',       main: '文章・メッセージで整理して伝える',   hint: '言語化・ライティングが強いタイプ', s: { comm_type: 'written' } },
      { sym: 'BarChart2',     main: '資料・図解にまとめて見せる',         hint: '視覚的説得力があるタイプ',         s: { comm_type: 'visual' } },
      { sym: 'MessageSquare', main: '少人数でじっくり話し合う',           hint: '深い対話・傾聴が得意なタイプ',     s: { comm_type: 'deep' } },
    ],
  },
  {
    block: 2,
    tag: '☀️ 太陽が問う — 直感か論理か',
    planet: '太陽',
    q: '大事な決断をするとき、あなたの太陽はどちらに光を当てる？',
    hint: '太陽は「本質と自己表現」を照らす惑星。意思決定スタイルが、向く仕事の深さを示します。',
    opts: [
      { sym: 'Sparkles',      main: '「なんとなくこれだ」という直感を信じる', hint: '内側の声を信頼するタイプ', s: { decision: 'intuition' } },
      { sym: 'Brain',         main: '情報を集めて論理的に判断する',           hint: '根拠を大切にするタイプ',   s: { decision: 'logic' } },
      { sym: 'Scale',         main: '直感と論理を両方使う',                   hint: 'バランス型・統合タイプ',   s: { decision: 'both' } },
      { sym: 'Users',         main: '誰かに相談してから決める',               hint: '対話で考えが整うタイプ',   s: { decision: 'consult' } },
    ],
  },

  // ── BLOCK 3: 木星が照らす「次の場所」 ──
  {
    block: 3,
    tag: '♃ 木星が照らす — 今いる星の世界',
    planet: '木星',
    q: 'これまで働いてきた業種（業界）を教えてください。（複数選択可）',
    hint: '木星は「あなたが今いる場所の可能性」を司る惑星。現在地を知ることで、次のステージへの道が鮮明になります。',
    multi: true,
    opts: [
      { sym: '💻', main: 'IT・Web・通信',           hint: 'テクノロジー・デジタル系',         s: { current_industry: 'it' } },
      { sym: '🏭', main: '製造・メーカー',            hint: 'ものづくり・製品開発系',           s: { current_industry: 'maker' } },
      { sym: '🏥', main: '医療・福祉・介護',          hint: '医療・ヘルスケア系',               s: { current_industry: 'healthcare' } },
      { sym: '💰', main: '金融・保険・不動産',        hint: '金融・資産・不動産系',             s: { current_industry: 'finance' } },
      { sym: '🛒', main: '小売・飲食・サービス',      hint: '消費者向けサービス系',             s: { current_industry: 'retail' } },
      { sym: '📚', main: '教育・学習',                hint: '学校・塾・研修系',                 s: { current_industry: 'education' } },
      { sym: '🎯', main: 'コンサル・経営・士業',      hint: '戦略・専門家・士業系',             s: { current_industry: 'consulting' } },
      { sym: '🏛', main: '公務員・非営利・NPO',       hint: '行政・公益・社会貢献系',           s: { current_industry: 'public' } },
      { sym: '🔨', main: '建設・インフラ',            hint: '建設・土木・エネルギー系',         s: { current_industry: 'construction' } },
      { sym: '🎨', main: 'メディア・エンタメ・広告',  hint: '創作・メディア・クリエイティブ系', s: { current_industry: 'media' } },
      { sym: '🌐', main: 'その他',                    hint: '上記に当てはまらない',             s: { current_industry: 'other' } },
    ],
  },
  {
    block: 3,
    tag: '♃ 木星が開く — 引き寄せられる世界',
    planet: '木星',
    q: '星の引力に従うとしたら、次のステージで飛び込みたい業界はどこ？（複数選択可）',
    hint: '木星は「拡大と幸運」を司る惑星。直感で選んでみてください。',
    multi: true,
    opts: [
      { sym: '💻', main: 'IT・Web',             hint: 'デジタル・テック系', s: { industry: 'it' } },
      { sym: '🎯', main: 'コンサル・経営企画',  hint: '戦略・プロ系',       s: { industry: 'consulting' } },
      { sym: '🏥', main: '医療・ヘルスケア',    hint: '人の健康に関わる',   s: { industry: 'healthcare' } },
      { sym: '💰', main: '金融・不動産',        hint: 'お金・資産系',       s: { industry: 'finance' } },
      { sym: '🎨', main: 'クリエイティブ・広告',hint: '表現・ブランディング',s: { industry: 'creative' } },
      { sym: '📚', main: '教育・福祉',          hint: '人の成長に関わる',   s: { industry: 'education' } },
      { sym: '🏭', main: 'メーカー・製造業',      hint: 'ものづくりに関わる',         s: { industry: 'maker' } },
      { sym: '👥', main: 'HR・人材・エージェント',hint: '人と組織を支える',           s: { industry: 'hr' } },
      { sym: '🛒', main: 'EC・小売・サービス',    hint: '消費者に価値を届ける',       s: { industry: 'ec' } },
      { sym: '🌐', main: 'その他・幅広く見たい',  hint: '枠にとらわれない',           s: { industry: 'other' } },
    ],
  },
  {
    block: 3,
    tag: '♃ 木星が授ける — 天から与えられた役割',
    planet: '木星',
    q: '次のステージで担いたい仕事の役割は？（複数選択可）',
    hint: '木星は「使命と才能の開花」を告げる惑星。あなたが輝ける役割を直感で選んでください。',
    multi: true,
    opts: [
      // 常時表示（業界問わず）
      { sym: '👑', main: 'チームをまとめるマネージャー',         hint: '人を動かし成果を出す',               s: { role: 'manager' } },
      { sym: '🤝', main: '顧客と向き合う営業・CS',               hint: '人と信頼関係を築く',                 s: { role: 'sales' } },
      { sym: '📊', main: '数字・データで動くアナリスト',         hint: 'ファクトから価値を見つける',         s: { role: 'analyst' } },
      { sym: '🔬', main: 'スペシャリスト・エキスパート',         hint: '専門を深めてプロになる',             s: { role: 'expert' } },
      { sym: '✏️', main: 'ものをつくるクリエイター',             hint: '0から形を生み出す',                 s: { role: 'creator' } },
      { sym: '📣', main: 'マーケティングプランナー',             hint: '市場を動かす戦略を立てる',           s: { role: 'marketer' } },
      // IT
      { sym: '💻', main: 'エンジニア・開発',                     hint: 'プロダクトを技術で作る',             s: { role: 'engineer' },        relatedIndustries: ['it'] },
      { sym: '🎯', main: 'プロダクトマネージャー（PM）',         hint: 'プロダクトの方向を決める',           s: { role: 'pm' },              relatedIndustries: ['it', 'consulting'] },
      { sym: '🎨', main: 'UX/UIデザイナー',                     hint: 'ユーザー体験を設計する',             s: { role: 'ux' },              relatedIndustries: ['it', 'creative'] },
      // コンサル・経営
      { sym: '💼', main: '事業開発・新規事業',                   hint: '0から新しいビジネスを作る',           s: { role: 'biz_dev' },         relatedIndustries: ['consulting', 'it'] },
      // 医療
      { sym: '🏥', main: '医療営業・MR',                         hint: '医療現場と企業をつなぐ',             s: { role: 'medical_sales' },   relatedIndustries: ['healthcare'] },
      { sym: '💊', main: '医療IT・デジタルヘルス',               hint: 'テクノロジーで医療を変える',         s: { role: 'healthcare_it' },   relatedIndustries: ['healthcare', 'it'] },
      // 金融
      { sym: '💰', main: 'ファイナンシャルアドバイザー',         hint: '資産・金融で人の人生を支える',       s: { role: 'finance_advisor' }, relatedIndustries: ['finance'] },
      // 教育・HR
      { sym: '📚', main: '教育・研修コンテンツ開発',             hint: '人の学びと成長を設計する',           s: { role: 'edu_content' },     relatedIndustries: ['education', 'hr'] },
      { sym: '🌱', main: 'HRBP・人材育成',                       hint: '組織と人の力を引き出す',             s: { role: 'hr_bp' },           relatedIndustries: ['education', 'hr'] },
      { sym: '🔍', main: 'キャリアアドバイザー',                 hint: '人の転職・成長を支える',             s: { role: 'recruiter' },       relatedIndustries: ['hr'] },
      // メーカー
      { sym: '🔧', main: '商品開発・R&D',                         hint: '新しい製品を世に出す',               s: { role: 'product_dev' },     relatedIndustries: ['maker'] },
      // EC
      { sym: '🛒', main: 'ECマーケター・バイヤー・MD',           hint: 'EC・小売で購買体験を作る',           s: { role: 'ec_buyer' },        relatedIndustries: ['ec'] },
    ],
  },
  {
    block: 3,
    tag: '♃ 木星が示す — 次の舞台',
    planet: '木星',
    q: '転職後の勤務エリアに希望はありますか？（複数選択可）',
    hint: '木星は「拡大と可能性」を司る惑星。活躍の舞台を広げることが、転職成功の鍵になります。',
    multi: true,
    opts: [
      { sym: '🌐', main: 'エリアにはこだわらない', hint: '全国・リモートも含め幅広く',                           s: { area: 'any' } },
      { sym: '🌨️', main: '北海道・東北',           hint: '北海道・青森・岩手・宮城・秋田・山形・福島',           s: { area: 'hokkaido_tohoku' } },
      { sym: '🗼',  main: '関東',                   hint: '東京・神奈川・埼玉・千葉・茨城・栃木・群馬',           s: { area: 'kanto' } },
      { sym: '🗻',  main: '中部',                   hint: '新潟・富山・石川・福井・山梨・長野・岐阜・静岡・愛知', s: { area: 'chubu' } },
      { sym: '🏮',  main: '近畿',                   hint: '三重・滋賀・京都・大阪・兵庫・奈良・和歌山',           s: { area: 'kinki' } },
      { sym: '🏯',  main: '中国地方',               hint: '鳥取・島根・岡山・広島・山口',                         s: { area: 'chugoku' } },
      { sym: '🌊',  main: '四国',                   hint: '徳島・香川・愛媛・高知',                               s: { area: 'shikoku' } },
      { sym: '🌺',  main: '九州・沖縄',             hint: '福岡・佐賀・長崎・熊本・大分・宮崎・鹿児島・沖縄',     s: { area: 'kyushu_okinawa' } },
    ],
  },
  {
    block: 3,
    tag: '♃ 木星が示す — 魂の拠点',
    planet: '木星',
    q: '具体的に希望する都道府県を教えてください。（複数選択可）',
    hint: '木星は「あなたが輝く場所」を示す惑星。より具体的な希望が、精度の高いマッチングにつながります。',
    multi: true,
    opts: [
      { sym: '🌐', main: 'こだわらない', hint: '都道府県の指定なし', s: { prefecture: 'any' } },
      // 北海道・東北
      { sym: '📍', main: '北海道', hint: '', s: { prefecture: '北海道' }, relatedAreas: ['hokkaido_tohoku'] },
      { sym: '📍', main: '青森県', hint: '', s: { prefecture: '青森県' }, relatedAreas: ['hokkaido_tohoku'] },
      { sym: '📍', main: '岩手県', hint: '', s: { prefecture: '岩手県' }, relatedAreas: ['hokkaido_tohoku'] },
      { sym: '📍', main: '宮城県', hint: '', s: { prefecture: '宮城県' }, relatedAreas: ['hokkaido_tohoku'] },
      { sym: '📍', main: '秋田県', hint: '', s: { prefecture: '秋田県' }, relatedAreas: ['hokkaido_tohoku'] },
      { sym: '📍', main: '山形県', hint: '', s: { prefecture: '山形県' }, relatedAreas: ['hokkaido_tohoku'] },
      { sym: '📍', main: '福島県', hint: '', s: { prefecture: '福島県' }, relatedAreas: ['hokkaido_tohoku'] },
      // 関東
      { sym: '📍', main: '東京都',   hint: '', s: { prefecture: '東京都' },   relatedAreas: ['kanto'] },
      { sym: '📍', main: '神奈川県', hint: '', s: { prefecture: '神奈川県' }, relatedAreas: ['kanto'] },
      { sym: '📍', main: '埼玉県',   hint: '', s: { prefecture: '埼玉県' },   relatedAreas: ['kanto'] },
      { sym: '📍', main: '千葉県',   hint: '', s: { prefecture: '千葉県' },   relatedAreas: ['kanto'] },
      { sym: '📍', main: '茨城県',   hint: '', s: { prefecture: '茨城県' },   relatedAreas: ['kanto'] },
      { sym: '📍', main: '栃木県',   hint: '', s: { prefecture: '栃木県' },   relatedAreas: ['kanto'] },
      { sym: '📍', main: '群馬県',   hint: '', s: { prefecture: '群馬県' },   relatedAreas: ['kanto'] },
      // 中部
      { sym: '📍', main: '新潟県', hint: '', s: { prefecture: '新潟県' }, relatedAreas: ['chubu'] },
      { sym: '📍', main: '富山県', hint: '', s: { prefecture: '富山県' }, relatedAreas: ['chubu'] },
      { sym: '📍', main: '石川県', hint: '', s: { prefecture: '石川県' }, relatedAreas: ['chubu'] },
      { sym: '📍', main: '福井県', hint: '', s: { prefecture: '福井県' }, relatedAreas: ['chubu'] },
      { sym: '📍', main: '山梨県', hint: '', s: { prefecture: '山梨県' }, relatedAreas: ['chubu'] },
      { sym: '📍', main: '長野県', hint: '', s: { prefecture: '長野県' }, relatedAreas: ['chubu'] },
      { sym: '📍', main: '岐阜県', hint: '', s: { prefecture: '岐阜県' }, relatedAreas: ['chubu'] },
      { sym: '📍', main: '静岡県', hint: '', s: { prefecture: '静岡県' }, relatedAreas: ['chubu'] },
      { sym: '📍', main: '愛知県', hint: '', s: { prefecture: '愛知県' }, relatedAreas: ['chubu'] },
      // 近畿
      { sym: '📍', main: '三重県',   hint: '', s: { prefecture: '三重県' },   relatedAreas: ['kinki'] },
      { sym: '📍', main: '滋賀県',   hint: '', s: { prefecture: '滋賀県' },   relatedAreas: ['kinki'] },
      { sym: '📍', main: '京都府',   hint: '', s: { prefecture: '京都府' },   relatedAreas: ['kinki'] },
      { sym: '📍', main: '大阪府',   hint: '', s: { prefecture: '大阪府' },   relatedAreas: ['kinki'] },
      { sym: '📍', main: '兵庫県',   hint: '', s: { prefecture: '兵庫県' },   relatedAreas: ['kinki'] },
      { sym: '📍', main: '奈良県',   hint: '', s: { prefecture: '奈良県' },   relatedAreas: ['kinki'] },
      { sym: '📍', main: '和歌山県', hint: '', s: { prefecture: '和歌山県' }, relatedAreas: ['kinki'] },
      // 中国地方
      { sym: '📍', main: '鳥取県', hint: '', s: { prefecture: '鳥取県' }, relatedAreas: ['chugoku'] },
      { sym: '📍', main: '島根県', hint: '', s: { prefecture: '島根県' }, relatedAreas: ['chugoku'] },
      { sym: '📍', main: '岡山県', hint: '', s: { prefecture: '岡山県' }, relatedAreas: ['chugoku'] },
      { sym: '📍', main: '広島県', hint: '', s: { prefecture: '広島県' }, relatedAreas: ['chugoku'] },
      { sym: '📍', main: '山口県', hint: '', s: { prefecture: '山口県' }, relatedAreas: ['chugoku'] },
      // 四国
      { sym: '📍', main: '徳島県', hint: '', s: { prefecture: '徳島県' }, relatedAreas: ['shikoku'] },
      { sym: '📍', main: '香川県', hint: '', s: { prefecture: '香川県' }, relatedAreas: ['shikoku'] },
      { sym: '📍', main: '愛媛県', hint: '', s: { prefecture: '愛媛県' }, relatedAreas: ['shikoku'] },
      { sym: '📍', main: '高知県', hint: '', s: { prefecture: '高知県' }, relatedAreas: ['shikoku'] },
      // 九州・沖縄
      { sym: '📍', main: '福岡県',   hint: '', s: { prefecture: '福岡県' },   relatedAreas: ['kyushu_okinawa'] },
      { sym: '📍', main: '佐賀県',   hint: '', s: { prefecture: '佐賀県' },   relatedAreas: ['kyushu_okinawa'] },
      { sym: '📍', main: '長崎県',   hint: '', s: { prefecture: '長崎県' },   relatedAreas: ['kyushu_okinawa'] },
      { sym: '📍', main: '熊本県',   hint: '', s: { prefecture: '熊本県' },   relatedAreas: ['kyushu_okinawa'] },
      { sym: '📍', main: '大分県',   hint: '', s: { prefecture: '大分県' },   relatedAreas: ['kyushu_okinawa'] },
      { sym: '📍', main: '宮崎県',   hint: '', s: { prefecture: '宮崎県' },   relatedAreas: ['kyushu_okinawa'] },
      { sym: '📍', main: '鹿児島県', hint: '', s: { prefecture: '鹿児島県' }, relatedAreas: ['kyushu_okinawa'] },
      { sym: '📍', main: '沖縄県',   hint: '', s: { prefecture: '沖縄県' },   relatedAreas: ['kyushu_okinawa'] },
    ],
  },
  {
    block: 3,
    tag: '⛢ 天王星が呼ぶ — 変革への渇望',
    planet: '天王星',
    q: '転職とは別に、副業・フリーランス・起業といった「自分の可能性を広げる動き」に興味はある？',
    hint: '天王星は「革新と自由」を司る惑星。あなたの枠を超えたい気持ちが、星の読みに深みを加えます。',
    opts: [
      { sym: 'Star',       main: '強く興味がある。すでに動き始めている', hint: '自分の世界を切り開こうとしている', s: { independent: 4, urgency_add: 1 } },
      { sym: 'Cloud',      main: 'いつかはやりたいと思っている',         hint: '思い描いている未来がある',         s: { independent: 3, urgency_add: 1 } },
      { sym: 'HelpCircle', main: '興味はあるがまだ現実的でない',         hint: 'ぼんやりと憧れている',            s: { independent: 2, urgency_add: 0 } },
      { sym: 'Building2',  main: '今は安定した環境を優先したい',         hint: '土台を固めることを重視している',  s: { independent: 1, urgency_add: 0 } },
    ],
  },
  {
    block: 3,
    tag: '♀ 金星が正直に問う — お金と魂の優先順位',
    planet: '金星',
    q: '年収について、あなたの星は今どこを向いている？',
    hint: '金星は「豊かさと価値観」を司る惑星。お金への正直な気持ちが、転職の方向性を決めます。',
    opts: [
      { sym: 'Leaf',       main: '年収より「やりがい」と「環境」を重視したい', hint: '心の豊かさを優先',                 s: { salary_focus: 1 } },
      { sym: 'TrendingUp', main: '今より少し上がれば十分',                    hint: '最低限のベースアップを望んでいる', s: { salary_focus: 2 } },
      { sym: 'Gem',        main: '明確に年収アップを狙いたい',               hint: '収入アップが主要な動機',           s: { salary_focus: 4, urgency_add: 1 } },
      { sym: 'Trophy',     main: '将来のために今は年収にこだわる',           hint: '長期的な経済設計を考えている',     s: { salary_focus: 3, urgency_add: 1 } },
    ],
  },
  {
    block: 3,
    tag: '🌑 月が深夜に問う — 踏み出せない本当の理由',
    planet: '月',
    q: '転職への一歩を止めているのは、どんな月の影？',
    hint: '月は「恐怖と無意識の声」を映す惑星。本当の障壁を知ることが、最初の一歩につながります。',
    opts: [
      { sym: 'AlertTriangle', main: '失敗して今より悪くなるのが怖い',           hint: '安全への欲求が強い',           s: { barrier: 'failure_fear', urgency_add: 1 } },
      { sym: 'HelpCircle',    main: '次の職場が自分に合うかわからない',          hint: '判断材料が足りていない',       s: { barrier: 'uncertainty', urgency_add: 1 } },
      { sym: 'Heart',         main: '今の職場や同僚への申し訳なさ',              hint: '他者への責任感が強い',         s: { barrier: 'guilt', urgency_add: 0 } },
      { sym: 'TrendingDown',  main: '自分に市場価値があるか自信がない',          hint: '自己評価が低めになっている',   s: { barrier: 'self_doubt', urgency_add: 2 } },
    ],
  },

  // ── BLOCK 4: 月が守る「魂の居場所」 ──
  {
    block: 4,
    tag: '🌙 月が安らぐ — 魂が解放される環境',
    planet: '月',
    q: '月があなたに「ここが正しい場所だ」と告げるのは、どんな働き方をしている時？',
    hint: '月は「安心と居場所」を司る惑星。心から安らげる環境を選ぶことが転職成功の鍵です。',
    opts: [
      { sym: 'Home',     main: '家やカフェで集中して働くリモートワーク', hint: '自分のペースで深く集中できる環境',       s: { work_style: 'remote' } },
      { sym: 'Building2',main: '仲間と同じ空間で働くオフィス勤務',       hint: 'チームの空気感でモチベーションが上がる', s: { work_style: 'office' } },
      { sym: 'Compass',  main: '時間や場所を自分で決められる自由な働き方',hint: '裁量と自律性が最大の原動力',             s: { work_style: 'flexible' } },
      { sym: 'Users',    main: '現場・お客様と直接向き合う仕事',          hint: 'リアルな接点が喜びのタイプ',             s: { work_style: 'field' } },
    ],
  },
  {
    block: 4,
    tag: '♃ 木星が選ぶ — 星が輝く組織の大きさ',
    planet: '木星',
    q: '木星があなたの才能を最も輝かせる職場の規模感は？',
    hint: '木星は「スケールと可能性」を司る惑星。自分に合う組織の大きさが転職先選びを変えます。',
    opts: [
      { sym: 'Rocket',   main: '少数精鋭・スタートアップ（裁量大・変化が速い）', hint: '変化を楽しめる人向き',       s: { org_size: 'startup' } },
      { sym: 'Building2',main: '中堅〜大企業（安定・ブランド・組織力）',          hint: '安定と信頼感を重視',         s: { org_size: 'large' } },
      { sym: 'Globe',    main: '外資系・グローバル企業（実力主義・国際環境）',    hint: '実力で評価される環境',       s: { org_size: 'global' } },
      { sym: 'Key',      main: 'どんな規模でも役割と文化次第',                    hint: 'カルチャーフィットを最優先', s: { org_size: 'culture_first' } },
    ],
  },
  {
    block: 4,
    tag: '♀ 金星が守る — 仕事以外の大切なもの',
    planet: '金星',
    q: '仕事以外の時間で、金星が絶対に守りたいものは？',
    hint: '金星は「愛と喜び」を司る惑星。仕事以外の大切なものを知ると、本当に合う職場が見えてきます。',
    opts: [
      { sym: 'Heart',    main: '家族・パートナーと過ごす時間', hint: '大切な人との時間を最優先', s: { wlb: 'family' } },
      { sym: 'Activity', main: '自分の体と心の健康',           hint: 'セルフケアを何より大切に', s: { wlb: 'health' } },
      { sym: 'Smile',    main: '趣味・好きなことへの時間',     hint: '人生の彩りを仕事以外にも', s: { wlb: 'hobby' } },
      { sym: 'Moon',     main: 'プライベートの時間全般',       hint: 'オフタイムをしっかり確保', s: { wlb: 'private' } },
    ],
  },
  {
    block: 4,
    tag: '♃ 木星が描く — 5年後の星図',
    planet: '木星',
    q: '5年後、木星があなたをどこへ連れて行ってほしい？',
    hint: '木星は「成長と未来」を司る惑星。5年後のビジョンが、今どこに転職すべきかを示しています。',
    opts: [
      { sym: 'Crown',      main: 'チームや組織を率いるリーダーの位置',          hint: '人を動かす立場で輝きたい',       s: { vision: 'leader', urgency_add: 1 } },
      { sym: 'Microscope', main: '誰にも負けない専門性を持つスペシャリスト',    hint: '深さで価値を出したい',           s: { vision: 'specialist', urgency_add: 1 } },
      { sym: 'Star',       main: '起業・副業・フリーランスで自分の道を切り開く',hint: '自分のブランドで生きたい',       s: { vision: 'independent', urgency_add: 2 } },
      { sym: 'Leaf',       main: '今より豊かで安定した環境で働いている',         hint: '心と生活の安定を手に入れたい', s: { vision: 'stable', urgency_add: 0 } },
    ],
  },

  // ── BLOCK 5: 星が映す「隠れた自分」 ──
  {
    block: 5,
    tag: '🪐 土星が測る — 自分の市場価値',
    planet: '土星',
    q: '今の自分のスキルや経験について、土星の目で正直に見るとどう思う？',
    hint: '土星は「現実と評価」を司る惑星。自己評価の正直さが、最適なキャリア戦略を生みます。',
    opts: [
      { sym: 'Gem',        main: '胸を張って他社でも通用すると思う',       hint: '市場価値に自信がある',       s: { market_value: 90, urgency_add: 1 } },
      { sym: 'TrendingUp', main: 'まだ途中だが確実に積み上がっている',     hint: '成長の軌道に乗っている',     s: { market_value: 70 } },
      { sym: 'TrendingDown',main: '正直なところ自信があまりない',           hint: '市場価値を上げる動きが必要', s: { market_value: 40 } },
      { sym: 'Search',     main: '自分では判断できないので診断したい',     hint: '第三者の目線で把握したい',   s: { market_value: 55 } },
    ],
  },
  {
    block: 5,
    tag: '☀️ 太陽が輝く — 周囲から見た自分の星',
    planet: '太陽',
    q: '職場の人や友人から「あなたってこういう人だよね」と言われることに近いのは？',
    hint: '太陽は「他者から見た輝き」を示す惑星。周囲からの評価が、あなたの客観的な強みです。',
    opts: [
      { sym: 'Target',     main: '頼りになる・決断が速い',       hint: 'リーダーシップ・実行力タイプ', s: { external_view: 'leader' } },
      { sym: 'Lightbulb',  main: 'アイデアが豊富・発想が面白い', hint: 'クリエイティブ・革新タイプ',   s: { external_view: 'creative' } },
      { sym: 'Handshake',  main: '面倒見がいい・空気を読む',     hint: 'サポート・協調性タイプ',       s: { external_view: 'supporter' } },
      { sym: 'Microscope', main: '細かい・丁寧・正確',           hint: '分析・品質重視タイプ',         s: { external_view: 'analyst' } },
    ],
  },
  {
    block: 5,
    tag: '♂ 火星が動かす — 最初の一手',
    planet: '火星',
    q: '転職活動を始めるなら、あなたの火星が最初に動かすのはどれ？',
    hint: '火星は「最初の行動」を司る惑星。あなたの行動起点が、エージェント活用法のヒントになります。',
    opts: [
      { sym: 'Search',        main: 'まず転職サイトに登録して求人を見る', hint: '情報収集から入るタイプ',       s: { action_start: 'job_site', readiness_add: 5 } },
      { sym: 'Users',         main: '転職エージェントに相談する',         hint: 'プロの力を借りるタイプ',       s: { action_start: 'agent', readiness_add: 10 } },
      { sym: 'ClipboardList', main: '自分のスキルや経歴を整理する',       hint: '自己分析から始めるタイプ',     s: { action_start: 'self_analyze', readiness_add: 5 } },
      { sym: 'MessageSquare', main: '転職した友人・知人に話を聞く',       hint: '口コミ・体験談を重視するタイプ', s: { action_start: 'network', readiness_add: 5 } },
    ],
  },

  // ── BLOCK 6: 冥王星が問う「最後の扉」 ──
  {
    block: 6,
    tag: '🌟 冥王星が照らす — 変容への覚悟',
    planet: '冥王星',
    q: 'すべての星を読み終えた今、あなたはどんな言葉が一番心に響く？',
    hint: '冥王星は「変容と再生」を司る惑星。最後の選択が、あなたの星の総意を表しています。',
    opts: [
      { sym: 'Zap',      main: '「もう動くタイミングは来ている。あとは踏み出すだけ」', hint: '行動への確信がある',       s: { determination: 4, urgency_add: 3 } },
      { sym: 'Sparkles', main: '「星の示す方向を信じて、まず一歩だけ踏み出してみて」', hint: '慎重に、でも動き始めたい', s: { determination: 3, urgency_add: 2 } },
      { sym: 'Moon',     main: '「焦らなくていい。準備を整えれば必ず道は開ける」',     hint: 'じっくり準備を整えたい',  s: { determination: 2, urgency_add: 1 } },
      { sym: 'Sprout',   main: '「まだ今じゃない。今は力を蓄える時期」',               hint: '今はまだ充電が必要',      s: { determination: 1, urgency_add: 0 } },
    ],
  },
];

/** ブロックのメタ情報 */
export const BLOCKS = [
  { num: 1, title: '土星が刻む「今の場所と時間」', icon: '🪐', questionCount: 4 },
  { num: 2, title: '惑星が読み解く「魂の色」',       icon: '✨', questionCount: 6 },
  { num: 3, title: '木星が照らす「次の場所」',         icon: '♃', questionCount: 8 },
  { num: 4, title: '月が守る「魂の居場所」',           icon: '🌙', questionCount: 4 },
  { num: 5, title: '星が映す「隠れた自分」',           icon: '☀️', questionCount: 3 },
  { num: 6, title: '冥王星が問う「最後の扉」',         icon: '🌟', questionCount: 1 },
];
