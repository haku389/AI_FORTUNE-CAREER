import { supabaseAdmin } from './supabaseAdmin';
import type { TimingKey, DiagnosisStats } from './diagnosisLabels';

/**
 * precise_diagnoses / agent_events を集計し、管理画面のアナリティクスページに表示するための
 * 診断結果・エージェント推奨のサマリを作る。
 *
 * precise_diagnoses はこのリポジトリのマイグレーション管理外(別途Supabase上に作成済み)のため、
 * 必要な列だけをここでゆるく型定義している（lib/supabase.tsのPreciseDiagnoseRowとは別定義）。
 *
 * ラベル定数・型定義は lib/diagnosisLabels.ts 側にある（クライアントコンポーネントから
 * 安全にimportできるよう、supabaseAdmin依存のこのファイルとは意図的に分離している）。
 */

type PreciseDiagnoseAnalyticsRow = {
  score_total: number | null;
  score_timing: number | null;
  mbti_type: string | null;
  zodiac_sun: string | null;
  top_jobs: unknown;
  top_industries: unknown;
  recommended_agents: unknown;
  created_at: string;
};

function timingFromScore(score: number): TimingKey {
  if (score >= 80) return 'now';
  if (score >= 60) return '3m';
  if (score >= 40) return '6m';
  return 'wait';
}

// [下限, 上限, 表示ラベル]
const SCORE_BUCKET_RANGES: [number, number, string][] = [
  [90, 100, '90〜100点'],
  [80, 89, '80〜89点'],
  [70, 79, '70〜79点'],
  [60, 69, '60〜69点'],
  [50, 59, '50〜59点'],
  [0, 49, '〜49点'],
];

function topEntries(counts: Map<string, number>, limit?: number): { name: string; count: number }[] {
  const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  return (limit ? sorted.slice(0, limit) : sorted).map(([name, count]) => ({ name, count }));
}

export async function getDiagnosisStats(): Promise<DiagnosisStats> {
  const { data } = await supabaseAdmin
    .from('precise_diagnoses')
    .select('score_total, score_timing, mbti_type, zodiac_sun, top_jobs, top_industries, recommended_agents, created_at');

  const rows = (data ?? []) as PreciseDiagnoseAnalyticsRow[];

  const scoreBucketCounts = new Map(SCORE_BUCKET_RANGES.map(([, , label]) => [label, 0]));
  const timing: Record<TimingKey, number> = { now: 0, '3m': 0, '6m': 0, wait: 0 };
  const mbti: Record<string, number> = {};
  const jobCounts = new Map<string, number>();
  const industryCounts = new Map<string, number>();
  const zodiacCounts = new Map<string, number>();
  const dailyCounts = new Map<string, number>();

  let scoreSum = 0;
  let scoreCount = 0;

  for (const row of rows) {
    if (typeof row.score_total === 'number') {
      scoreSum += row.score_total;
      scoreCount++;
      const bucket = SCORE_BUCKET_RANGES.find(([min, max]) => row.score_total! >= min && row.score_total! <= max);
      if (bucket) scoreBucketCounts.set(bucket[2], (scoreBucketCounts.get(bucket[2]) ?? 0) + 1);
    }
    if (typeof row.score_timing === 'number') {
      timing[timingFromScore(row.score_timing)]++;
    }
    const mbtiKey = row.mbti_type ?? 'unknown';
    mbti[mbtiKey] = (mbti[mbtiKey] ?? 0) + 1;

    if (row.zodiac_sun) zodiacCounts.set(row.zodiac_sun, (zodiacCounts.get(row.zodiac_sun) ?? 0) + 1);

    if (Array.isArray(row.top_jobs) && row.top_jobs[0] && typeof row.top_jobs[0] === 'object' && 'job' in (row.top_jobs[0] as object)) {
      const job = (row.top_jobs[0] as { job?: unknown }).job;
      if (typeof job === 'string' && job) jobCounts.set(job, (jobCounts.get(job) ?? 0) + 1);
    }
    if (Array.isArray(row.top_industries) && row.top_industries[0] && typeof row.top_industries[0] === 'object' && 'name' in (row.top_industries[0] as object)) {
      const name = (row.top_industries[0] as { name?: unknown }).name;
      if (typeof name === 'string' && name) industryCounts.set(name, (industryCounts.get(name) ?? 0) + 1);
    }

    if (row.created_at) {
      const date = row.created_at.slice(0, 10);
      dailyCounts.set(date, (dailyCounts.get(date) ?? 0) + 1);
    }
  }

  return {
    total: rows.length,
    avgScore: scoreCount > 0 ? Math.round(scoreSum / scoreCount) : null,
    scoreBuckets: SCORE_BUCKET_RANGES.map(([, , label]) => ({ range: label, count: scoreBucketCounts.get(label) ?? 0 })),
    timing,
    mbti,
    topJobs: topEntries(jobCounts, 8).map(({ name, count }) => ({ job: name, count })),
    topIndustries: topEntries(industryCounts, 8),
    zodiacSun: topEntries(zodiacCounts),
    dailyCounts: [...dailyCounts.entries()].sort((a, b) => a[0].localeCompare(b[0])).slice(-30).map(([date, count]) => ({ date, count })),
  };
}

export type AgentStats = {
  programName: string;
  recommendedCount: number;
  impressions: number;
  clicks: number;
  clickRate: number; // %
};

export async function getAgentStats(): Promise<AgentStats[]> {
  const [{ data: diagRows }, { data: eventRows }] = await Promise.all([
    supabaseAdmin.from('precise_diagnoses').select('recommended_agents'),
    supabaseAdmin.from('agent_events').select('program_name, event_type'),
  ]);

  const recommendedCounts = new Map<string, number>();
  for (const row of (diagRows ?? []) as { recommended_agents: unknown }[]) {
    const agents = row.recommended_agents;
    if (!Array.isArray(agents)) continue;
    for (const a of agents) {
      const name = a && typeof a === 'object' ? (a as { programName?: unknown }).programName : null;
      if (typeof name === 'string' && name) {
        recommendedCounts.set(name, (recommendedCounts.get(name) ?? 0) + 1);
      }
    }
  }

  const impressionCounts = new Map<string, number>();
  const clickCounts = new Map<string, number>();
  for (const e of (eventRows ?? []) as { program_name: string; event_type: string }[]) {
    if (e.event_type === 'impression') {
      impressionCounts.set(e.program_name, (impressionCounts.get(e.program_name) ?? 0) + 1);
    } else if (e.event_type === 'click') {
      clickCounts.set(e.program_name, (clickCounts.get(e.program_name) ?? 0) + 1);
    }
  }

  const names = new Set([...recommendedCounts.keys(), ...impressionCounts.keys(), ...clickCounts.keys()]);
  const stats: AgentStats[] = [...names].map(programName => {
    const impressions = impressionCounts.get(programName) ?? 0;
    const clicks = clickCounts.get(programName) ?? 0;
    return {
      programName,
      recommendedCount: recommendedCounts.get(programName) ?? 0,
      impressions,
      clicks,
      clickRate: impressions > 0 ? Math.round((clicks / impressions) * 100) : 0,
    };
  });

  stats.sort((a, b) => b.recommendedCount - a.recommendedCount);
  return stats;
}
