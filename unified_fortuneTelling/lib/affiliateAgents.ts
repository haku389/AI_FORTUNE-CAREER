/**
 * 承認済みアフィリエイト案件(転職エージェント等)から、診断結果に合った案件を選定する。
 *
 * データソース: data/approved-affiliate-programs.json
 * このファイルは /Users/to_fu/GitHub/AffiliateProgram_Manager (別リポジトリ) が生成する
 * approved_programs.json のコピー。あちらのNotionレビュー結果が変わったら、
 * 都度このファイルへ再コピーしてからデプロイする必要がある。
 *
 * 選定・表現ルールは CLAUDE.md（プロジェクトルート）を参照。
 * - status !== 'active'、hasConditionChanged、siteMatchStatus === '非掲載' の案件は除外
 * - 案件固有の ngWords / prohibitedExpressions、commonNgWords は表示文言で使わない
 * - バナー画像・広告コード(rawCode)・報酬額は表示しない。遷移先URL(destinationUrl)は
 *   改変せずそのまま使う（トラッキングを壊さないため）
 *
 * 表示は「案件名 + 診断結果に基づくおすすめ理由」のみとし、ASP側の販促コピーや
 * 報酬額は出さない方針（2026-07-17変更: バナー・報酬額の表示は誤解を招くため廃止）。
 * リスティングNGワード(社名・サービス名を検索広告のキーワードにしない、という意味)は
 * 検索連動型広告特有の制約であり、この記事内で案件名に触れること自体とは無関係
 * （CLAUDE.mdのlistingRules説明「記事作成では通常関係ない」を参照）。
 */
import approvedData from '@/data/approved-affiliate-programs.json';
import { INDUSTRY_LABELS } from './jobMatch';

export type AdLink = {
  linkType: 'banner' | 'text' | 'mail_text' | string;
  rawCode: string;
  destinationUrl?: string;
  imageUrl?: string;
};

export type ApprovedProgram = {
  programName: string;
  advertiserName: string;
  category: string;
  status: string;
  confirmationRate?: number;
  epc?: number;
  adLinks?: AdLink[];
  hasConditionChanged?: boolean;
  siteMatchStatus?: string;
};

export type MatchedAgent = {
  programName: string;
  advertiserName: string;
  category: string;
  /** 業界・年代・希望勤務地など、診断結果に基づくおすすめ理由 */
  recommendReason: string;
  /** 遷移先URL（トラッキングURL）。改変しないこと。 */
  destinationUrl: string;
};

export type MatchProfile = {
  /** 年齢（不明な場合は省略可） */
  age?: number | null;
  /** 希望勤務エリアキー（precise-questionsのQ14回答。'any'や未回答は省略可） */
  areaKey?: string | null;
};

export type GenericAgent = {
  name: string;
  url: string;
};

/**
 * アフィリエイト提携のない、誰でも該当する汎用転職エージェント。
 * 非アフィリエイト(通常のリンク)として、おすすめ枠とは別に「他にもこんな選択肢も」として言及する。
 * ここに追加する際は、アフィリエイト案件とみなされないよう通常のリンクのみとし、
 * 追跡パラメータなどは付与しない。
 */
export const GENERIC_AGENTS: GenericAgent[] = [
  { name: 'マイナビ転職', url: 'https://tenshoku.mynavi.jp/' },
  { name: 'リクルートエージェント', url: 'https://www.r-agent.com/' },
  { name: 'doda', url: 'https://doda.jp/' },
];

// jobMatch.ts の業界キー → 案件のcategory/programName/advertiserNameを照合するための手がかりキーワード。
// 実データ(approved_programs.json、2026-07-16同期分)のprogramNameを確認して調整済み。
const INDUSTRY_KEYWORDS: Record<string, string[]> = {
  it: ['IT', 'Web', 'エンジニア', 'システム', 'DX', 'SAP', 'データサイエンス'],
  consulting: ['コンサル', '経営', 'ハイクラス'],
  healthcare: ['医療', 'ヘルスケア', '看護', '介護', 'MR', '薬剤師', '歯科', '治療家'],
  finance: ['金融', '保険', '不動産', '会計', '経理', '宅建', '税理士'],
  creative: ['クリエイティブ', 'クリエイター', '広告', 'マーケ', 'デザイン', 'ゲーム', 'エンタメ'],
  education: ['教育', '福祉', '学習', '研修', '保育'],
  maker: ['メーカー', '製造', 'ものづくり', '工場', '建設'],
  hr: ['人材', 'HR', '採用'],
  ec: ['EC', '小売', '販売', 'サービス', 'アパレル', '飲食'],
  other: [],
};

/**
 * 「転職エージェント紹介」として掲載してよい案件カテゴリ。
 * approved_programs.jsonには就職・転職以外にも幅広いASP案件(投資/家具/引越/資格取得等)が
 * 混在しているため、無関係な案件が紛れ込まないようハードフィルタする。
 * (CLAUDE.md「記事テーマとcategoryの関連が高いものを選ぶ」に対応)
 */
const CAREER_AGENT_CATEGORIES = ['就職・転職'];

// precise-questions.ts Q14(希望勤務エリア)の area キー → 表示ラベル。'any'は指定なし扱いで省略。
const AREA_LABELS: Record<string, string> = {
  hokkaido_tohoku: '北海道・東北',
  kanto: '関東',
  chubu: '中部',
  kinki: '近畿',
  chugoku: '中国',
  shikoku: '四国',
  kyushu_okinawa: '九州・沖縄',
};

function pickDestinationUrl(program: ApprovedProgram): string | null {
  const links = (program.adLinks ?? []).filter(
    l => (l.linkType === 'banner' || l.linkType === 'text') && l.destinationUrl
  );
  return links[0]?.destinationUrl ?? null;
}

function isEligible(program: ApprovedProgram): boolean {
  if (program.status !== 'active') return false;
  if (program.hasConditionChanged) return false;
  if (program.siteMatchStatus === '非掲載') return false;
  if (!CAREER_AGENT_CATEGORIES.includes(program.category)) return false;
  if (!pickDestinationUrl(program)) return false;
  return true;
}

/** 案件が一致した業界キー（複数候補中、最初に一致したもの）。一致なしはnull */
function matchedIndustryKey(program: ApprovedProgram, topIndustryKeys: string[]): string | null {
  const haystack = `${program.category} ${program.programName} ${program.advertiserName}`;
  for (const key of topIndustryKeys) {
    const keywords = INDUSTRY_KEYWORDS[key] ?? [];
    if (keywords.length > 0 && keywords.some(kw => haystack.includes(kw))) return key;
  }
  return null;
}

function ageDecadeLabel(age?: number | null): string | null {
  if (!age || age < 18) return null;
  const decade = Math.floor(age / 10) * 10;
  return decade >= 50 ? '50代以上' : `${decade}代`;
}

function buildRecommendReason(industryLabel: string | null, ageLabel: string | null, areaLabel: string | null): string {
  const audience: string[] = [];
  if (industryLabel) audience.push(`${industryLabel}分野でのキャリアを考えている方`);
  if (ageLabel) audience.push(`${ageLabel}の方`);
  if (areaLabel) audience.push(`${areaLabel}での勤務を希望する方`);

  if (audience.length === 0) {
    return '幅広い求人の中からじっくり転職先を探したい方におすすめです。';
  }
  return `${audience.join('、')}におすすめです。`;
}

/**
 * 診断で向いていると出た業界(複数)を優先しつつ、
 * EPC(優先度指標) × 確定率 で承認済み案件をランキングする。
 *
 * 業界マッチの有無を最優先の並び替えキーとし、EPC×確定率は同じマッチ層の中でのみ
 * 比較する（段階的ソート）。実データはEPCが案件間で数十〜数百倍差になることがあり、
 * 単純な加算スコア(industryHit*定数 + epc*...)だとEPCの差が業界マッチのボーナスを
 * 飲み込んでしまい、診断結果に関わらず同じ高EPC案件ばかり出る結果になってしまうため。
 */
export function matchAffiliateAgents(
  topIndustryKeys: string[],
  profile: MatchProfile = {},
  limit = 3,
): MatchedAgent[] {
  const programs = (approvedData as { programs: ApprovedProgram[] }).programs ?? [];
  const eligible = programs.filter(isEligible);

  const ageLabel = ageDecadeLabel(profile.age);
  const areaLabel = profile.areaKey ? AREA_LABELS[profile.areaKey] ?? null : null;

  const scored = eligible.map(program => {
    const matchedKey = matchedIndustryKey(program, topIndustryKeys);
    const industryHit = matchedKey ? 1 : 0;
    const epc = program.epc ?? 0;
    const confirmationRate = program.confirmationRate ?? 50; // 未取得時は中間値扱い
    // 確定率が極端に低い案件はEPCが高く見えても割り引く（CLAUDE.md記載の判断基準に準拠）
    const confirmationFactor = Math.max(0.3, confirmationRate / 100);
    const epcScore = epc * confirmationFactor;
    return { program, matchedKey, industryHit, epcScore };
  });

  scored.sort((a, b) => {
    if (b.industryHit !== a.industryHit) return b.industryHit - a.industryHit;
    return b.epcScore - a.epcScore;
  });

  const result: MatchedAgent[] = [];
  for (const { program, matchedKey } of scored) {
    if (result.length >= limit) break;
    const destinationUrl = pickDestinationUrl(program);
    if (!destinationUrl) continue;
    const industryLabel = matchedKey ? INDUSTRY_LABELS[matchedKey]?.name ?? null : null;
    result.push({
      programName: program.programName,
      advertiserName: program.advertiserName,
      category: program.category,
      recommendReason: buildRecommendReason(industryLabel, ageLabel, areaLabel),
      destinationUrl,
    });
  }
  return result;
}
