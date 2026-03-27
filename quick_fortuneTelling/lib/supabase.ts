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
