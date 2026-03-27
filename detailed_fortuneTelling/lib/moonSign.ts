/**
 * 月星座（Moon Sign）算出ロジック
 * 月の平均黄経を使った近似計算。月は約2.28日ごとに星座を移動する。
 * 生年月日だけでは境界付近（±1日）に誤差が出る可能性あり。
 * 出生時間があれば精度が上がる。
 */

const MOON_SIGNS = [
  '牡羊座', '牡牛座', '双子座', '蟹座', '獅子座', '乙女座',
  '天秤座', '蠍座', '射手座', '山羊座', '水瓶座', '魚座',
];

/** グレゴリオ暦からユリウス通日を計算 */
function julianDay(year: number, month: number, day: number, hourFraction = 12): number {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  const jdn =
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045;
  return jdn - 0.5 + hourFraction / 24;
}

/**
 * 生年月日から月星座を返す
 * @param year  生年
 * @param month 生月
 * @param day   生日
 * @param birthtime "HH:MM" 形式（省略可）
 */
export function getMoonSign(
  year: number,
  month: number,
  day: number,
  birthtime?: string,
): string {
  let hourFraction = 12; // デフォルト正午
  if (birthtime) {
    const [h, m] = birthtime.split(':').map(Number);
    if (!isNaN(h) && !isNaN(m)) hourFraction = h + m / 60;
  }

  const jd = julianDay(year, month, day, hourFraction);

  // J2000.0 (2000年1月1.5日) からの経過日数
  const d = jd - 2451545.0;

  // 月の平均黄経（度）
  // 参考: J2000.0 における月の平均黄経 ≈ 218.316°
  // 月の平均運動: 13.1764° / day
  let L = (218.316 + 13.1764 * d) % 360;
  if (L < 0) L += 360;

  // 月の離角（Mean anomaly of Moon）
  let Mm = (134.963 + 13.0650 * d) % 360;
  if (Mm < 0) Mm += 360;

  // 月の黄経補正（equation of center、主要項のみ）
  const MmRad = (Mm * Math.PI) / 180;
  const correction = 6.289 * Math.sin(MmRad);

  let moonLon = (L + correction) % 360;
  if (moonLon < 0) moonLon += 360;

  // 春分点(牡羊座0°)を基準にした星座インデックス
  const signIdx = Math.floor(moonLon / 30) % 12;
  return MOON_SIGNS[signIdx];
}

/** 月星座の英語名を返す */
const MOON_SIGN_EN: Record<string, string> = {
  '牡羊座': 'Aries', '牡牛座': 'Taurus', '双子座': 'Gemini', '蟹座': 'Cancer',
  '獅子座': 'Leo', '乙女座': 'Virgo', '天秤座': 'Libra', '蠍座': 'Scorpio',
  '射手座': 'Sagittarius', '山羊座': 'Capricorn', '水瓶座': 'Aquarius', '魚座': 'Pisces',
};

export function getMoonSignEn(moonSign: string): string {
  return MOON_SIGN_EN[moonSign] ?? moonSign;
}

/** 月星座のキーワードを返す */
const MOON_SIGN_KEYWORDS: Record<string, string> = {
  '牡羊座': '感情が直接的・瞬発力・衝動的',
  '牡牛座': '安定を好む・感覚的・粘り強い',
  '双子座': '感情の変化が速い・好奇心旺盛',
  '蟹座': '感受性が豊か・共感力・母性的',
  '獅子座': '感情表現が豊か・プライド・温かみ',
  '乙女座': '繊細・分析的・心配しやすい',
  '天秤座': '調和を求める・穏やか・優柔不断',
  '蠍座': '感情が深い・執着・直感が鋭い',
  '射手座': '楽観的・自由を好む・感情が開放的',
  '山羊座': '感情を抑える・責任感・クール',
  '水瓶座': '感情を客観視・独立心・反骨精神',
  '魚座': '共感力が高い・感情に流されやすい・霊感',
};

export function getMoonSignKeyword(moonSign: string): string {
  return MOON_SIGN_KEYWORDS[moonSign] ?? '';
}
