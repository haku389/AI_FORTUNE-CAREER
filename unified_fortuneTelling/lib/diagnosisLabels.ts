/**
 * 診断結果アナリティクスの表示ラベル・型定義。
 *
 * lib/diagnosisAnalytics.ts (supabaseAdmin依存・サーバー専用) とは意図的に分離している。
 * DiagnosisStatsView.tsx はクライアントコンポーネント(AnalyticsTabs.tsx)から読み込まれるため、
 * もしこのファイルの内容を lib/diagnosisAnalytics.ts に置いたままだと、value importを通じて
 * supabaseAdmin の初期化コードごとブラウザバンドルに混入し、
 * ブラウザ側で SUPABASE_SERVICE_ROLE_KEY が読めず "supabaseKey is required" で
 * ハイドレーションごと壊れてしまう。
 */

export type TimingKey = 'now' | '3m' | '6m' | 'wait';

export const MBTI_LABELS: Record<string, string> = {
  NT: 'NT型（論理・戦略・革新系）',
  NF: 'NF型（理念・共感・ビジョン系）',
  SJ: 'SJ型（責任・秩序・サポート系）',
  SP: 'SP型（行動・適応・実践系）',
  unknown: '未診断',
};

export const TIMING_LABELS: Record<TimingKey, string> = {
  now: '🔥 今すぐ動き時',
  '3m': '✨ 3ヶ月以内',
  '6m': '🌿 半年後',
  wait: '💧 充電期',
};

export type DiagnosisStats = {
  total: number;
  avgScore: number | null;
  scoreBuckets: { range: string; count: number }[];
  timing: Record<TimingKey, number>;
  mbti: Record<string, number>;
  topJobs: { job: string; count: number }[];
  topIndustries: { name: string; count: number }[];
  zodiacSun: { name: string; count: number }[];
  dailyCounts: { date: string; count: number }[];
};
