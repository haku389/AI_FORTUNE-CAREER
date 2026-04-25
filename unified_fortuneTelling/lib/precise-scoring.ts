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
  const score_timing = Math.max(50, Math.min(97, Math.round((urgency / MAX_URGENCY) * 47 + 50)));

  // timing判定
  const timing: TimingKey =
    urgency >= 15 ? 'now' :
    urgency >= 10 ? '3m' :
    urgency >= 5  ? '6m' :
    'wait';

  // ── readiness スコア ──
  // Q22(index 22): 市場価値自己評価 → mvScore
  // Q23(index 23): 他者評価 → evScore
  // Q24(index 24): 行動起点 → readinessAdd
  // Q7(index 6):   ストレス反応 → stressAdj
  // Q9(index 8):   コミュニケーション型 → commAdj

  const q21Ans = answers[22]; // 市場価値自己評価
  const q22Ans = answers[23]; // 他者評価
  const q23Ans = answers[24]; // 行動起点
  const q7Ans  = answers[6];  // ストレス反応
  const q9Ans  = answers[8];  // コミュニケーション型

  const marketValueMap = [92, 74, 48, 60]; // 💎📈😔🔍
  // 他者評価 opt順: 0=leader, 1=creative, 2=supporter, 3=analyst
  const externalViewScores = [90, 80, 65, 78];
  // ストレス反応 opt順: energize(+5), steady(+3), anxious(0), freeze(-5)
  const stressAdjMap = [5, 3, 0, -5];
  // コミュニケーション opt順: verbal(+2), written(+1), visual(+2), deep(0)
  const commAdjMap = [2, 1, 2, 0];

  const mvScore     = typeof q21Ans === 'number' ? (marketValueMap[q21Ans] ?? 60) : 60;
  const evScore     = typeof q22Ans === 'number' ? (externalViewScores[q22Ans] ?? 73) : 73;
  const readinessAdd = typeof q23Ans === 'number' ? (Q[24].opts[q23Ans]?.s?.readiness_add ?? 0) : 0;
  const stressAdj   = typeof q7Ans  === 'number' ? (stressAdjMap[q7Ans] ?? 0) : 0;
  const commAdj     = typeof q9Ans  === 'number' ? (commAdjMap[q9Ans] ?? 0) : 0;

  const score_readiness = Math.max(52, Math.min(97, Math.round((mvScore + evScore) / 2 + readinessAdd + stressAdj + commAdj)));

  // ── market スコア（現職場とのミスマッチ度）──
  // 使用: Q8(index 7)=リーダー像, Q11(index 10)=現業界, Q18(index 18)=働き方, Q19(index 19)=組織規模, Q20(index 20)=WLB

  const INDUSTRY_PROFILES: Record<string, { work_style: string; org_size: string; wlb: string; leader: string }> = {
    it:           { work_style: 'remote',    org_size: 'startup', wlb: 'health',  leader: 'delegate' },
    maker:        { work_style: 'office',    org_size: 'large',   wlb: 'family',  leader: 'support'  },
    healthcare:   { work_style: 'field',     org_size: 'large',   wlb: 'health',  leader: 'support'  },
    finance:      { work_style: 'office',    org_size: 'large',   wlb: 'hobby',   leader: 'results'  },
    retail:       { work_style: 'field',     org_size: 'large',   wlb: 'private', leader: 'results'  },
    education:    { work_style: 'office',    org_size: 'large',   wlb: 'family',  leader: 'support'  },
    consulting:   { work_style: 'office',    org_size: 'large',   wlb: 'hobby',   leader: 'results'  },
    public:       { work_style: 'office',    org_size: 'large',   wlb: 'family',  leader: 'support'  },
    construction: { work_style: 'field',     org_size: 'large',   wlb: 'health',  leader: 'support'  },
    media:        { work_style: 'flexible',  org_size: 'startup', wlb: 'hobby',   leader: 'delegate' },
    other:        { work_style: 'office',    org_size: 'large',   wlb: 'private', leader: 'support'  },
  };

  const wlbHighConflict: Record<string, string[]> = {
    family: ['finance', 'consulting', 'media'],
    health: ['finance', 'consulting', 'retail'],
  };

  // 現業界取得（multi-select対応: 先頭を使用）
  const q11Ans = answers[10];
  const currentIndustryKey = Array.isArray(q11Ans) && q11Ans.length > 0
    ? (Q[10].opts[q11Ans[0]]?.s?.current_industry ?? null)
    : typeof q11Ans === 'number'
    ? (Q[10].opts[q11Ans]?.s?.current_industry ?? null)
    : null;

  const q8Ans  = answers[7];
  const q17Ans = answers[18];
  const q18Ans = answers[19];
  const q19Ans = answers[20];

  const leadership = typeof q8Ans  === 'number' ? (Q[7].opts[q8Ans]?.s?.leadership ?? null) : null;
  const workStyle  = typeof q17Ans === 'number' ? (Q[18].opts[q17Ans]?.s?.work_style ?? null) : null;
  const orgSize    = typeof q18Ans === 'number' ? (Q[19].opts[q18Ans]?.s?.org_size ?? null) : null;
  const wlbPref    = typeof q19Ans === 'number' ? (Q[20].opts[q19Ans]?.s?.wlb ?? null) : null;

  let score_market: number;
  const profile = currentIndustryKey ? INDUSTRY_PROFILES[currentIndustryKey] : null;

  if (!profile) {
    // 現業界未回答の場合は中間値
    score_market = 65;
  } else {
    let mismatch = 0;
    if (workStyle && workStyle !== profile.work_style) mismatch += 20;
    if (orgSize && orgSize !== profile.org_size && orgSize !== 'culture_first') mismatch += 20;
    if (wlbPref) {
      if (wlbHighConflict[wlbPref]?.includes(currentIndustryKey!)) mismatch += 20;
      else if (wlbPref !== profile.wlb) mismatch += 10;
    }
    if (leadership && leadership !== profile.leader) mismatch += 10;
    score_market = Math.max(50, Math.min(97, Math.round((mismatch / 70) * 47 + 50)));
  }

  // ── 総合スコア（加重平均: timing×0.4 + readiness×0.33 + market×0.27）──
  const score_total = Math.max(52, Math.min(97, Math.round(score_timing * 0.4 + score_readiness * 0.33 + score_market * 0.27)));

  return { score_total, score_timing, score_readiness, score_market, timing, urgency };
}
