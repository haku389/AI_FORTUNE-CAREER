import { QUESTIONS } from './precise-questions';

export type TimingKey = 'now' | '3m' | '6m' | 'wait';

export type PreciseScoreResult = {
  score_total: number;      // 総合スコア 22-97
  score_timing: number;     // タイミングスコア 22-97
  score_readiness: number;  // 準備スコア 22-97
  score_market: number;     // 市場相性スコア 22-97
  timing: TimingKey;
  urgency: number;          // 内部urgency値（デバッグ用）
};

export type TimingData = {
  badge: string;
  text: string;
  color: string;
};

export const TIMINGS: Record<TimingKey, TimingData> = {
  now: {
    badge: '⚡ 今すぐが転職の好機',
    text: '惑星の配置があなたに「変化」を強く促しています。迷っている時間が一番もったいない時期。まず情報収集から始めるだけで、流れが変わります。',
    color: '#ffa040',
  },
  '3m': {
    badge: '🌕 3ヶ月以内が転職好機',
    text: '木星があなたの転職運を後押しする時期が近づいています。今は準備を進めて、タイミングが来たら一気に動いて。',
    color: '#f0c060',
  },
  '6m': {
    badge: '🌙 半年後に転職の波が来る',
    text: '今すぐではなく、じっくり準備を進める時期。焦らず自分の軸を固めておくことで、来たる波に乗れます。',
    color: '#a898f8',
  },
  wait: {
    badge: '🌱 今は充電・準備の時期',
    text: '星はまだ「待つこと」を勧めています。今の環境でできることを深め、自分の価値を高めながら来るべきタイミングを待って。',
    color: '#3cc4a8',
  },
};

/** 回答配列からスコアを計算 */
export function calcPreciseScore(
  answers: (number | number[])[],
): PreciseScoreResult {
  const Q = QUESTIONS;

  // ── urgency 計算（タイミングスコアの元となる値）──
  // Q0(Block1-Q1), Q1(Q2), Q2(Q3), Q3(Q4) はBlockにそのまま対応
  // 各質問のurgency_addを合計する
  let urgency = 0;

  for (let i = 0; i < Q.length; i++) {
    const ans = answers[i];
    if (ans === undefined || ans === null) continue;

    if (Array.isArray(ans)) {
      // multi-select: urgency_addを最大値のoptのみ反映（or 全合計）
      for (const idx of ans) {
        urgency += Q[i].opts[idx]?.s?.urgency_add ?? 0;
      }
    } else {
      urgency += Q[i].opts[ans]?.s?.urgency_add ?? 0;
    }
  }

  // urgency最大値の理論値: Q0:4 + Q1:2 + Q2:3 + Q3:3 + Q12:1 + Q13:1 + Q14:1 + Q19:2 + Q22:3 = ~20
  // 実際の最大は約22なので正規化係数は22
  const MAX_URGENCY = 22;
  const score_timing = Math.max(22, Math.min(97, Math.round((urgency / MAX_URGENCY) * 75 + 22)));

  // timing判定
  const timing: TimingKey =
    urgency >= 15 ? 'now' :
    urgency >= 10 ? '3m' :
    urgency >= 5  ? '6m' :
    'wait';

  // ── readiness スコア ──
  // Q19(index 19): 市場価値 → market_value
  // Q20(index 20): 他者評価 → external_view（各optがmarket_valueを持たないが、固定スコアで代替）
  // Q21(index 21): 行動起点 → readiness_add

  const q20Ans = answers[19]; // Q20 is index 19 (0-indexed)
  const q21Ans = answers[20]; // Q21 is index 20
  const q22Ans = answers[21]; // Q22 is index 21

  const marketValueMap = [90, 70, 40, 55]; // 💎📈😔🔍
  const externalViewScore = [80, 75, 70, 75]; // 🎯🌈🤝🔬

  const mvScore = typeof q20Ans === 'number' ? (marketValueMap[q20Ans] ?? 55) : 55;
  const evScore = typeof q21Ans === 'number' ? (externalViewScore[q21Ans] ?? 70) : 70;
  const readinessAdd = typeof q22Ans === 'number' ? (Q[21].opts[q22Ans]?.s?.readiness_add ?? 0) : 0;

  const score_readiness = Math.max(22, Math.min(97, Math.round((mvScore + evScore) / 2 + readinessAdd)));

  // ── market スコア ──
  // Q12(index 12): 副業志向 → independent
  // Q13(index 13): 年収優先度 → salary_focus
  // Q18(index 18): 5年ビジョン → vision urgency_add

  const q13Ans = answers[12]; // Q13 index 12
  const q14Ans = answers[13]; // Q14 index 13

  const independentScores = [85, 70, 55, 40]; // 🌟💭🤔🏛
  const salaryScores = [50, 65, 85, 75]; // 🌿📈💎🏆

  const indScore = typeof q13Ans === 'number' ? (independentScores[q13Ans] ?? 60) : 60;
  const salScore = typeof q14Ans === 'number' ? (salaryScores[q14Ans] ?? 65) : 65;

  const score_market = Math.max(22, Math.min(97, Math.round((indScore + salScore) / 2)));

  // ── 総合スコア ──
  const score_total = Math.max(22, Math.min(97, Math.round((score_timing + score_readiness + score_market) / 3)));

  return { score_total, score_timing, score_readiness, score_market, timing, urgency };
}
