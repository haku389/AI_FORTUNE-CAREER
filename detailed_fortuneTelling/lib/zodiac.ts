export type ZodiacInfo = {
  name: string;
  en: string;
  emoji: string;
  keyword: string;
  element: 'fire' | 'earth' | 'air' | 'water';
};

export const ZODIAC: ZodiacInfo[] = [
  { name: '山羊座', en: 'Capricorn',   emoji: '♑', keyword: '忍耐・野心・現実主義',     element: 'earth' },
  { name: '水瓶座', en: 'Aquarius',    emoji: '♒', keyword: '革新・自由・独創性',       element: 'air'   },
  { name: '魚座',   en: 'Pisces',      emoji: '♓', keyword: '直感・共感・夢想',         element: 'water' },
  { name: '牡羊座', en: 'Aries',       emoji: '♈', keyword: '行動力・情熱・勝負師',     element: 'fire'  },
  { name: '牡牛座', en: 'Taurus',      emoji: '♉', keyword: '安定・粘り強さ・美意識',   element: 'earth' },
  { name: '双子座', en: 'Gemini',      emoji: '♊', keyword: '好奇心・コミュ力・多才',   element: 'air'   },
  { name: '蟹座',   en: 'Cancer',      emoji: '♋', keyword: '思いやり・家庭愛・保護本能', element: 'water' },
  { name: '獅子座', en: 'Leo',         emoji: '♌', keyword: '表現力・自信・カリスマ',   element: 'fire'  },
  { name: '乙女座', en: 'Virgo',       emoji: '♍', keyword: '几帳面・分析力・完璧主義', element: 'earth' },
  { name: '天秤座', en: 'Libra',       emoji: '♎', keyword: '協調性・美的センス・公平', element: 'air'   },
  { name: '蠍座',   en: 'Scorpio',     emoji: '♏', keyword: '情熱・洞察力・変革',       element: 'water' },
  { name: '射手座', en: 'Sagittarius', emoji: '♐', keyword: '自由・探求・楽観主義',     element: 'fire'  },
];

const BOUNDARY_DAYS = [20, 19, 21, 20, 21, 21, 23, 23, 23, 23, 22, 22];

export function getZodiac(month: number, day: number): ZodiacInfo {
  const idx = day >= BOUNDARY_DAYS[month - 1] ? month % 12 : month - 1;
  return ZODIAC[idx];
}
