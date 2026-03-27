import { QUESTIONS } from './questions';

export type CareerType = 'career' | 'env' | 'calling' | 'stable';
export type TimingKey = 'now' | '3m' | '6m' | 'wait';
export type StressKey = 'human' | 'growth' | 'future' | 'calm';
export type MarsKey = 'suppressed' | 'misfit' | 'calm' | 'bored';

export type DiagnosisResult = {
  urgency: number;
  score: number;
  timing: TimingKey;
  type: CareerType;
  stress: StressKey;
  mars: MarsKey;
};

export type TypeData = {
  name: string;
  affili: string;
  url: string;
  desc: string;
  reason: string;
  luna: string;
};

export type TimingData = {
  badge: string; // タイミングラベルテキスト（badge用）
  text: string;
};

export type MoonData = {
  head: string;
  body: string; // HTMLを含む可能性あり（<em>タグ）
};

export type SaturnData = {
  head: string;
  body: string; // HTMLを含む可能性あり（<em>タグ）
};

// ── アフィリサービスマッピング ──
export const TYPES: Record<CareerType, TypeData> = {
  career: {
    name: 'キャリアアップ型',
    affili: 'BIZREACH',
    url: 'https://bizreach.jp',
    desc: 'ハイクラス・スカウト特化',
    reason: '年収・昇進を重視するあなたには、企業から直接オファーが届くスカウト型が最適です。',
    luna: '登録するだけで自分の市場価値がわかるよ。見るだけでもOK🌙',
  },
  env: {
    name: '環境改善型',
    affili: 'doda',
    url: 'https://doda.jp',
    desc: '社員口コミ・職場環境情報が豊富',
    reason: '職場環境・人間関係を重視するあなたには、口コミ情報が充実したdodaが最適。',
    luna: '職場の雰囲気の情報が多くて、入社後のギャップが少ないって評判だよ✨',
  },
  calling: {
    name: '天職探し型',
    affili: 'ハタラクティブ',
    url: 'https://hataractive.jp',
    desc: '丁寧な面談・方向性から一緒に考える',
    reason: 'やりたいことが見えていなくても大丈夫。アドバイザーと話すだけで方向性が見えてきます。',
    luna: '何がやりたいかわからなくても相談できる。話すだけで気持ちが整理されるよ🌿',
  },
  stable: {
    name: '安定志向型',
    affili: 'マイナビ転職',
    url: 'https://tenshoku.mynavi.jp',
    desc: '幅広い求人・安定企業・福利厚生充実',
    reason: '安定・ワークライフバランスを重視するあなたには、条件で絞れるマイナビ転職が最適。',
    luna: '急がなくていい。自分の条件を入力して、いい求人がくるのを待つのも正解だよ🛡️',
  },
};

// ── タイミングデータ ──
export const TIMINGS: Record<TimingKey, TimingData> = {
  now: {
    badge: '⚡ 今すぐが転職の好機',
    text: '星の配置があなたに「変化」を強く促しています。迷っている時間が一番もったいない時期。まず情報収集から始めるだけで、流れが変わります。',
  },
  '3m': {
    badge: '🌕 3ヶ月以内が転職好機',
    text: '木星があなたの転職運を後押しする時期が近づいています。今は準備を進めて、タイミングが来たら一気に動いて。',
  },
  '6m': {
    badge: '🌙 半年後に転職の波が来る',
    text: '今すぐではなく、じっくり準備を進める時期。焦らず自分の軸を固めておくことで、来たる波に乗れます。',
  },
  wait: {
    badge: '🌱 今は充電・準備の時期',
    text: '星はまだ「待つこと」を勧めています。今の環境でできることを深め、自分の価値を高めながら来るべきタイミングを待って。',
  },
};

// ── 月（ストレス）データ ──
export const MOONS: Record<StressKey, MoonData> = {
  human: {
    head: '月の声：人間関係に変化の兆し',
    body: '月は感情と対人関係を司ります。深夜に仕事の人間関係が浮かぶのは、<em>月が「この環境は合っていない」と知らせているサイン</em>かもしれません。',
  },
  growth: {
    head: '月の声：内なる成長欲求',
    body: '深夜に「別の自分」を想像するのは、<em>あなたの魂が次のステージを求めているサイン</em>。月は変化への準備が整ったことを告げています。',
  },
  future: {
    head: '月の声：未来への焦りは変化の合図',
    body: '月が示す焦りは、停滞への警告です。<em>「何かが足りない」という感覚こそ、星があなたに送っている変化の合図</em>。その直感を信じて。',
  },
  calm: {
    head: '月の声：今は静かな内省の時',
    body: '深夜に何も浮かばないのは、<em>あなたが今の時間を自分のものにできている証拠</em>。月は「焦らなくていい、今は自分を満たす時期」と告げています。',
  },
};

// ── 土星（日曜夜）データ ──
export const SATURNS: Record<MarsKey, SaturnData> = {
  suppressed: {
    head: '土星の試練：魂の消耗',
    body: '日曜の夜に胃が重くなるのは、<em>土星があなたに「これ以上ここにいてはいけない」と告げているサイン</em>。体の感覚は星よりも正直です。',
  },
  misfit: {
    head: '土星の試練：環境との不一致',
    body: '「なんとなく気が重い」という感覚は、<em>土星があなたの星座と今の環境の不一致を映し出している</em>状態。慣れることで見えなくなっていた本音が、そこにあります。',
  },
  calm: {
    head: '土星の試練：静観の時',
    body: '今は土星があなたに「力を蓄える時間」を与えています。<em>穏やかな心は次の挑戦に向けたエネルギーの充電</em>。急がなくていい。',
  },
  bored: {
    head: '土星の試練：刺激を求める魂',
    body: '翌日が楽しみなこともある、というのは恵まれた状態です。ただ土星は<em>「現状に満足しながらも、まだ見ぬ可能性があなたを待っている」</em>と告げています。',
  },
};

// ── スコア計算 ──
export function calcScore(answers: number[]): DiagnosisResult {
  const Q = QUESTIONS;

  let urgency = Q[0].opts[answers[0]].s.urgency ?? 0;
  urgency += Q[2].opts[answers[2]].s.urgency_add ?? 0;
  urgency += Q[3].opts[answers[3]].s.urgency_add ?? 0;
  urgency += Q[4].opts[answers[4]].s.urgency_add ?? 0;

  const type = (Q[1].opts[answers[1]].s.type ?? 'career') as CareerType;
  const stress = (Q[2].opts[answers[2]].s.stress ?? 'calm') as StressKey;
  const mars = (Q[3].opts[answers[3]].s.mars ?? 'calm') as MarsKey;

  const marsBonus = mars === 'suppressed' || mars === 'misfit' ? 8 : 0;
  let score = Math.min(urgency * 7 + 20 + marsBonus, 97);
  score = Math.max(score, 22);

  const timing: TimingKey =
    urgency >= 8 ? 'now' :
    urgency >= 6 ? '3m' :
    urgency >= 3 ? '6m' :
    'wait';

  return { urgency, score, timing, type, stress, mars };
}
