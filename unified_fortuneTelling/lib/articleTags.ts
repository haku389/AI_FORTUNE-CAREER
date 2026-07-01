/**
 * 記事レコメンド用タグの正式な語彙。
 * 診断結果（このファイルの buildResultTags）で実際に生成される値と
 * 一致させること。値がずれるとレコメンドが一致しなくなる。
 *
 * クライアントコンポーネント（管理画面・診断結果ページ）から直接importされるため、
 * このファイルはサーバー専用の依存（lib/supabaseAdmin 等）を持たないこと。
 */

export type TagOption = { value: string; label: string }
export type TagGroup = { name: string; options: TagOption[] }

const toOptions = (values: readonly string[]): TagOption[] => values.map((v) => ({ value: v, label: v }))

// lib/zodiac.ts の ZODIAC と同じ12星座
const ZODIAC_NAMES = [
  '牡羊座', '牡牛座', '双子座', '蟹座', '獅子座', '乙女座',
  '天秤座', '蠍座', '射手座', '山羊座', '水瓶座', '魚座',
] as const

// lib/scoring.ts の TYPES と同じ転職タイプ
const TYPE_NAMES = ['キャリアアップ型', '環境改善型', '天職探し型', '安定志向型'] as const

// lib/honmeiStar.ts の HONMEI_STARS と同じ9本命星
const HONMEI_STARS = [
  '一白水星', '二黒土星', '三碧木星', '四緑木星', '五黄土星',
  '六白金星', '七赤金星', '八白土星', '九紫火星',
] as const

// 精密診断で収集されるのはMBTIの4気質グループ（NT/NF/SJ/SP）であり、個別16タイプではない
const MBTI_GROUPS: TagOption[] = [
  { value: 'NT', label: 'NT型（論理・戦略・革新系）' },
  { value: 'NF', label: 'NF型（理念・共感・ビジョン系）' },
  { value: 'SJ', label: 'SJ型（責任・秩序・サポート系）' },
  { value: 'SP', label: 'SP型（行動・適応・実践系）' },
]

// 簡易・精密診断共通のタイミングキー
const TIMING_OPTIONS: TagOption[] = [
  { value: 'now', label: '今すぐ' },
  { value: '3m', label: '3ヶ月以内' },
  { value: '6m', label: '半年後' },
  { value: 'wait', label: '充電期' },
]

// 年齢層（誕生日から自動算出。サイトの主要ターゲットである20〜40代を想定した区切り）
const AGE_BRACKETS = ['20代前半', '20代後半', '30代前半', '30代後半', '40代以上'] as const

// app/shindan/form, app/premium/form の性別選択肢と一致させる
const GENDER_OPTIONS = ['男性', '女性', 'その他'] as const

// 精密診断Q11「これまで働いてきた業種」の選択肢（lib/precise-questions.ts QUESTIONS[10].opts の main と一致）
const INDUSTRY_NAMES = [
  'IT・Web・通信', '製造・メーカー', '医療・福祉・介護', '金融・保険・不動産',
  '小売・飲食・サービス', '教育・学習', 'コンサル・経営・士業', '公務員・非営利・NPO',
  '建設・インフラ', 'メディア・エンタメ・広告', 'その他',
] as const

export const TAG_GROUPS: TagGroup[] = [
  { name: '星座（太陽・月）', options: toOptions(ZODIAC_NAMES) },
  { name: '転職タイプ', options: toOptions(TYPE_NAMES) },
  { name: '本命星', options: toOptions(HONMEI_STARS) },
  { name: 'MBTI傾向', options: MBTI_GROUPS },
  { name: 'タイミング', options: TIMING_OPTIONS },
  { name: '年齢層', options: toOptions(AGE_BRACKETS) },
  { name: '性別', options: toOptions(GENDER_OPTIONS) },
  { name: '業種', options: toOptions(INDUSTRY_NAMES) },
]

export const ALL_TAG_VALUES: string[] = TAG_GROUPS.flatMap((g) => g.options.map((o) => o.value))

export function tagLabel(value: string): string {
  for (const group of TAG_GROUPS) {
    const found = group.options.find((o) => o.value === value)
    if (found) return found.label
  }
  return value
}

/** 誕生日から年齢を計算する */
export function calcAgeFromBirthday(year: number, month: number, day: number): number {
  const today = new Date()
  let age = today.getFullYear() - year
  if (today.getMonth() + 1 < month || (today.getMonth() + 1 === month && today.getDate() < day)) {
    age--
  }
  return age
}

/** 年齢を年齢層タグに変換する。ターゲット層（20代以上）外は null（タグを付けない） */
export function ageToTag(age: number): string | null {
  if (age < 20) return null
  if (age < 25) return '20代前半'
  if (age < 30) return '20代後半'
  if (age < 35) return '30代前半'
  if (age < 40) return '30代後半'
  return '40代以上'
}

/** 診断結果から、記事レコメンド用のタグ候補を組み立てる（値がないものは無視） */
export function buildResultTags(input: {
  zodiac?: string | null
  moonZodiac?: string | null
  honmeiStar?: string | null
  mbti?: string | null
  type?: string | null
  timing?: string | null
  age?: number | null
  gender?: string | null
  /** 精密診断Q11（複数選択可）で選ばれた業種。シンプル診断では収集していないため省略可 */
  industries?: readonly string[] | null
}): string[] {
  const ageTag = typeof input.age === 'number' ? ageToTag(input.age) : null
  const base = [
    input.zodiac,
    input.moonZodiac,
    input.honmeiStar,
    input.mbti,
    input.type,
    input.timing,
    ageTag,
    input.gender,
  ].filter((v): v is string => !!v && v !== 'unknown')
  const industries = (input.industries ?? []).filter((v): v is string => !!v)
  return [...base, ...industries]
}
