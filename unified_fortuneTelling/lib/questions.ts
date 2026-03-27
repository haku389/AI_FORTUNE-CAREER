export type AnswerScore = {
  urgency?: number;
  urgency_add?: number;
  type?: 'career' | 'env' | 'calling' | 'stable';
  stress?: 'human' | 'growth' | 'future' | 'calm';
  mars?: 'suppressed' | 'misfit' | 'calm' | 'bored';
};

export type QuestionOption = {
  sym: string;
  main: string;
  hint: string;
  s: AnswerScore;
};

export type Question = {
  tag: string;
  q: string;
  hint: string;
  opts: QuestionOption[];
};

export type Planet = {
  icon: string;
  name: string;
};

export const PLANETS: Planet[] = [
  { icon: '🪐', name: '土星 — 今のあなたの現在地を映す' },
  { icon: '🌟', name: '木星 — 人生で守りたいものを知る' },
  { icon: '🌑', name: '月 — 深夜の本音を読み取る' },
  { icon: '⛈️', name: '土星 — 日曜の夜が映す現実' },
  { icon: '🌌', name: '木星 — 5年後の可能性を問う' },
];

export const QUESTIONS: Question[] = [
  {
    tag: '🪐 土星 — 今のあなたの現在地',
    q: '今の職場、正直どう感じていますか？',
    hint: '土星は「現実」を映す惑星。あなたの正直な気持ちが、一番精度の高い星読みになります。',
    opts: [
      { sym: '🌑', main: 'もう限界に近い',             hint: '毎日が消耗している',           s: { urgency: 4 } },
      { sym: '🌘', main: '不満はあるが続けられる',     hint: '変わりたいけど踏み出せない',   s: { urgency: 3 } },
      { sym: '🌓', main: 'まあまあ。でも何か物足りない', hint: 'このままでいいのか不安',       s: { urgency: 2 } },
      { sym: '🌕', main: '特に問題はない',             hint: '念のため情報を集めたい',       s: { urgency: 1 } },
    ],
  },
  {
    tag: '🌟 木星 — 人生で守りたいものを知る',
    q: '仕事で一番大切にしたいことは？',
    hint: '木星は「豊かさ」と「守りたいもの」を司る惑星。考えすぎず、直感で選んでください。',
    opts: [
      { sym: '💰',  main: '年収・キャリアアップ', hint: '稼いで自由を手に入れたい',           s: { type: 'career' } },
      { sym: '🌿',  main: '職場環境・人間関係',   hint: '居心地のいい場所で働きたい',         s: { type: 'env' } },
      { sym: '✨',  main: 'やりがい・天職探し',   hint: '本当にやりたいことで生きたい',       s: { type: 'calling' } },
      { sym: '🛡️', main: '安定・ワークライフ',   hint: '心に余裕のある生活がしたい',         s: { type: 'stable' } },
    ],
  },
  {
    tag: '🌑 月 — 深夜の本音を読み取る',
    q: '深夜にふと目が覚めた時、頭をよぎるのは？',
    hint: '月は「感情と本音」を司る惑星。夜中に浮かぶ思いこそが、今の星の声です。',
    opts: [
      { sym: '🌑', main: '明日の仕事のこと',                   hint: '顔・締め切り・不安が頭から離れない', s: { stress: 'human',  urgency_add: 1 } },
      { sym: '🌌', main: '「もっと違う人生だったら」という想像', hint: '別の自分がいたら、と思う夜がある',   s: { stress: 'growth', urgency_add: 1 } },
      { sym: '💸', main: 'お金や将来への漠然とした焦り',       hint: '何かが足りない感覚が抜けない',       s: { stress: 'future', urgency_add: 0 } },
      { sym: '🌙', main: '特に何も浮かばない',                 hint: '深く眠れている、今は静かな時期',     s: { stress: 'calm',   urgency_add: 0 } },
    ],
  },
  {
    tag: '⛈️ 土星 — 日曜の夜が映す現実',
    q: '日曜の夜、翌朝のことを考えた時の感覚は？',
    hint: '土星は「試練と現実」を司る惑星。日曜の夜の感覚が、今のあなたの現在地を正直に映しています。',
    opts: [
      { sym: '⛈️', main: '胃が重くなる・憂鬱になる',         hint: '月曜が来てほしくない夜がある', s: { mars: 'suppressed', urgency_add: 2 } },
      { sym: '☁️', main: 'なんとなく気が重い（でも慣れた）', hint: 'これが普通だと思っていた',     s: { mars: 'misfit',     urgency_add: 1 } },
      { sym: '⛅', main: '特に何も感じない・普通',           hint: '今はそれほど辛くない',         s: { mars: 'calm',       urgency_add: 0 } },
      { sym: '☀️', main: '翌日が楽しみなこともある',         hint: '仕事は嫌いじゃない',           s: { mars: 'bored',      urgency_add: 0 } },
    ],
  },
  {
    tag: '🌌 木星 — 5年後の可能性を問う',
    q: '5年後、今と同じ職場にいる自分を想像してみて',
    hint: '木星は「未来の可能性」を司る惑星。5年後の自分への反応が、あなたの本当の意志を教えてくれます。',
    opts: [
      { sym: '🔥',  main: '絶対に嫌だ・考えたくない',       hint: 'その未来だけは避けたいと感じた', s: { urgency_add: 3 } },
      { sym: '🌒',  main: 'できれば違う場所にいたい',       hint: '変わりたいけど動けていない',     s: { urgency_add: 2 } },
      { sym: '🌫️', main: 'どちらでもいい・まだわからない', hint: '今は判断できない時期かも',       s: { urgency_add: 1 } },
      { sym: '🌿',  main: '今の職場でもっと成長していたい', hint: '今の場所に愛着がある',           s: { urgency_add: 0 } },
    ],
  },
];
