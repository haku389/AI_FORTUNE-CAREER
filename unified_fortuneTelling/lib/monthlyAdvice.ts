/**
 * 3ヶ月の行動アドバイス生成ロジック
 * 現在月を基準にタイミングスコアに応じてアドバイスを生成する
 */

import { TimingKey } from './scoring';

export type MonthAdvice = {
  month: string;      // e.g. '4月'
  label: string;      // e.g. '準備の月'
  emoji: string;      // e.g. '🌱'
  advice: string;     // アドバイス本文
  highlight: boolean; // この月が行動月か
};

const MONTH_NAMES = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

type MonthTemplate = {
  label: string;
  emoji: string;
  advice: string;
  highlight: boolean;
};

// ── タイミング別の3ヶ月パターン定義 ──
const TIMING_PATTERNS: Record<TimingKey, [MonthTemplate, MonthTemplate, MonthTemplate]> = {
  now: [
    {
      label: '行動の月', emoji: '⚡', highlight: true,
      advice: '木星が動き時を知らせています。転職サイトへの登録・エージェントへの相談を今すぐ始めて。情報収集だけでもOK、動き出すことで星が動き始めます。',
    },
    {
      label: '加速の月', emoji: '🔥', highlight: true,
      advice: '面接・企業研究を集中させて。月の配置があなたの「本音の言語化」を後押しする時期。面接で本当の自分を出せるベストタイミングです。',
    },
    {
      label: '収穫の月', emoji: '🌕', highlight: false,
      advice: '内定・条件交渉に有利な配置。入社タイミングとして最適な月です。焦らず自分に合う条件をしっかり確認して。',
    },
  ],
  '3m': [
    {
      label: '種まきの月', emoji: '🌱', highlight: false,
      advice: '今月は情報収集だけでOK。転職サイトに登録して求人を眺めておくと、3ヶ月後の動きが格段にスムーズになります。',
    },
    {
      label: '覚醒の月', emoji: '⚡', highlight: true,
      advice: '木星があなたのキャリア運を直撃する月。エージェントへの相談・面接準備をこの月に集中させて。星の後押しを最大限に使って。',
    },
    {
      label: '決断の月', emoji: '🌕', highlight: true,
      advice: '行動を起こした成果が出始める時期。内定・条件交渉の場面で、あなたの本当の価値が評価されやすい月です。',
    },
  ],
  '6m': [
    {
      label: '土台の月', emoji: '🌱', highlight: false,
      advice: '今は動き時ではなく「準備の時期」。スキルアップや自己分析を深めて、6ヶ月後の転職に向けた土台を作りましょう。',
    },
    {
      label: '整理の月', emoji: '📋', highlight: false,
      advice: '職務経歴書や自己PRの草案を作り始めて。焦らずじっくり「自分の強み」を棚卸しする時間として使いましょう。',
    },
    {
      label: '準備完了の月', emoji: '✨', highlight: true,
      advice: '準備を積み重ねてきた成果が出る月。エージェントへの相談を始めると、スムーズに進められるタイミングです。',
    },
  ],
  wait: [
    {
      label: '充電の月', emoji: '🔋', highlight: false,
      advice: '星は「待つこと」を勧めています。今月は自分を満たすことを優先して。本を読む・好きなことをする時間が、実は転職準備に一番なります。',
    },
    {
      label: '内省の月', emoji: '🌙', highlight: false,
      advice: '自分が本当にやりたいことを深く考える月。日記を書く・信頼できる人に話を聞いてもらうことで、方向性が見えてきます。',
    },
    {
      label: '芽吹きの月', emoji: '🌿', highlight: false,
      advice: '充電した力が少しずつ形になる時期。転職情報を「見るだけ」眺めてみると、自分の直感が反応するものが見つかるかもしれません。',
    },
  ],
};

export function calcMonthlyAdvice(
  timing: TimingKey,
  currentMonth?: number,
): MonthAdvice[] {
  const now = currentMonth ?? new Date().getMonth() + 1; // 1-indexed
  const pattern = TIMING_PATTERNS[timing];

  return pattern.map((template, i) => {
    const monthIdx = ((now - 1 + i) % 12);
    return {
      month: MONTH_NAMES[monthIdx],
      label: template.label,
      emoji: template.emoji,
      advice: template.advice,
      highlight: template.highlight,
    };
  });
}
