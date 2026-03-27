export type ZodiacInfo = {
  name: string;
  en: string;
  emoji: string;
  keyword: string;
};

export const ZODIAC: ZodiacInfo[] = [
  { name: '山羊座', en: 'Capricorn',   emoji: '♑', keyword: '忍耐・野心・現実主義' },
  { name: '水瓶座', en: 'Aquarius',    emoji: '♒', keyword: '革新・自由・独創性' },
  { name: '魚座',   en: 'Pisces',      emoji: '♓', keyword: '直感・共感・夢想' },
  { name: '牡羊座', en: 'Aries',       emoji: '♈', keyword: '行動力・情熱・勝負師' },
  { name: '牡牛座', en: 'Taurus',      emoji: '♉', keyword: '安定・粘り強さ・美意識' },
  { name: '双子座', en: 'Gemini',      emoji: '♊', keyword: '好奇心・コミュ力・多才' },
  { name: '蟹座',   en: 'Cancer',      emoji: '♋', keyword: '思いやり・家庭愛・保護本能' },
  { name: '獅子座', en: 'Leo',         emoji: '♌', keyword: '表現力・自信・カリスマ' },
  { name: '乙女座', en: 'Virgo',       emoji: '♍', keyword: '几帳面・分析力・完璧主義' },
  { name: '天秤座', en: 'Libra',       emoji: '♎', keyword: '協調性・美的センス・公平' },
  { name: '蠍座',   en: 'Scorpio',     emoji: '♏', keyword: '情熱・洞察力・変革' },
  { name: '射手座', en: 'Sagittarius', emoji: '♐', keyword: '自由・探求・楽観主義' },
];

// 各月の境界日: この日以降が月の後半の星座に切り替わる
// 例: 1月20日 → 水瓶座開始
const BOUNDARY_DAYS = [20, 19, 21, 20, 21, 21, 23, 23, 23, 23, 22, 22];

export function getZodiac(month: number, day: number): ZodiacInfo {
  // 境界日より前: ZODIAC[month-1]（月前半の星座）
  // 境界日以降:  ZODIAC[month % 12]（月後半の星座）
  const idx = day >= BOUNDARY_DAYS[month - 1] ? month % 12 : month - 1;
  return ZODIAC[idx];
}
