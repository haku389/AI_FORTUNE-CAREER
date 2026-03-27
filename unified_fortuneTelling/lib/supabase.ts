import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ── 型定義 ──
export type DiagnoseRow = {
  id: string;
  diagnosed_at: string;       // DATE (YYYY-MM-DD)
  nickname: string;
  birthday: string;           // DATE (YYYY-MM-DD)
  zodiac: string;
  career_type: string;
  score: number;
  timing: string;
  recommended_service: string | null;
  kansen_text: string | null;
  shared: boolean;
  created_at: string;
};

export type InsertDiagnose = Omit<DiagnoseRow, 'id' | 'created_at' | 'shared'> & {
  shared?: boolean;
};
export type PreciseDiagnoseRow = {
  id: string;
  nickname: string;
  birthday: string;           // DATE (YYYY-MM-DD)
  birthtime: string | null;   // 'HH:MM' or null
  zodiac_sun: string;
  zodiac_moon: string | null;
  honmei_star: string | null;
  mbti_type: string | null;
  answers: Record<string, unknown>;
  score_total: number | null;
  score_timing: number | null;
  score_readiness: number | null;
  score_market: number | null;
  top_jobs: unknown | null;
  top_industries: unknown | null;
  monthly_advice: unknown | null;
  kansen_text: string | null;
  recommended_agents: unknown | null;
  payment_id: string | null;
  paid_at: string | null;
  amount: number | null;
  shared: boolean;
  created_at: string;
};
