/**
 * 本命星（九星気学）算出ロジック
 * 節分（2月3日）を年の区切りとする。
 * 1月・2月3日より前生まれは前年度で計算。
 */

export const HONMEI_STARS = [
  '一白水星', '二黒土星', '三碧木星', '四緑木星', '五黄土星',
  '六白金星', '七赤金星', '八白土星', '九紫火星',
] as const;

export type HonmeiStar = typeof HONMEI_STARS[number];

const HONMEI_STAR_KEYWORDS: Record<HonmeiStar, string> = {
  '一白水星': '柔軟性・適応力・知恵者',
  '二黒土星': '勤勉・忍耐・縁の下の力持ち',
  '三碧木星': '行動力・革新・リーダー気質',
  '四緑木星': '社交性・信頼・コツコツ型',
  '五黄土星': '強烈な個性・破壊と創造・カリスマ',
  '六白金星': '完璧主義・プライド・清廉潔白',
  '七赤金星': '弁舌・人脈・社交の達人',
  '八白土星': '堅実・蓄積・変革のタイミング',
  '九紫火星': '直感・華やかさ・頂点を目指す',
};

export function getHonmeiStar(year: number, month: number, day: number): HonmeiStar {
  // 節分（2月3日）より前は前年度として計算
  const isBeforeSetsubun = month < 2 || (month === 2 && day <= 3);
  const adjustedYear = isBeforeSetsubun ? year - 1 : year;

  // 九星の計算: (10 - ((adjustedYear - 1) % 9)) % 9
  // 結果が0のとき → 9（九紫火星）
  const idx = (10 - ((adjustedYear - 1) % 9)) % 9;
  const starIdx = idx === 0 ? 8 : idx - 1;
  return HONMEI_STARS[starIdx];
}

export function getHonmeiStarKeyword(star: HonmeiStar): string {
  return HONMEI_STAR_KEYWORDS[star];
}

/** 本命星の五行属性 */
const HONMEI_ELEMENT: Record<HonmeiStar, 'water' | 'earth' | 'wood' | 'metal' | 'fire'> = {
  '一白水星': 'water',
  '二黒土星': 'earth',
  '三碧木星': 'wood',
  '四緑木星': 'wood',
  '五黄土星': 'earth',
  '六白金星': 'metal',
  '七赤金星': 'metal',
  '八白土星': 'earth',
  '九紫火星': 'fire',
};

export function getHonmeiElement(star: HonmeiStar) {
  return HONMEI_ELEMENT[star];
}
