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
 * - 広告コード(adLinks[].rawCode)は一切改変しない
 * - 案件固有の ngWords / prohibitedExpressions、commonNgWords は表示文言で使わない
 */
import approvedData from '@/data/approved-affiliate-programs.json';

export type RewardInfo = {
  type: 'fixed' | 'percentage' | 'tiered' | string;
  amount?: number;
  rate?: number;
  rawText?: string;
};

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
  reward: RewardInfo;
  confirmationRate?: number;
  epc?: number;
  conversionCondition?: string;
  rejectionConditions?: string[];
  ngWords?: string[];
  prohibitedExpressions?: string[];
  adLinks?: AdLink[];
  lastCheckedAt?: string;
  hasConditionChanged?: boolean;
  siteMatchStatus?: string;
};

export type MatchedAgent = {
  programName: string;
  advertiserName: string;
  category: string;
  rewardText: string;
  confirmationRate: number | null;
  /** 表示に使う広告コード(banner優先、なければtext)。改変しないこと。 */
  adLink: AdLink;
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

function rewardToText(reward: RewardInfo): string {
  if (reward.rawText) return reward.rawText;
  if (reward.type === 'percentage' && reward.rate) return `成果報酬 ${reward.rate}%`;
  if (reward.amount) return `成果報酬 ${reward.amount.toLocaleString()}円`;
  return '';
}

function pickAdLink(program: ApprovedProgram): AdLink | null {
  const links = (program.adLinks ?? []).filter(l => l.linkType === 'banner' || l.linkType === 'text');
  if (links.length === 0) return null;
  // amp-ad等、通常のHTML内で単体では機能しない可能性があるタグを避け、
  // <a>/<img>中心のシンプルな構成を優先する（rawCode自体は改変しない）
  const simple = links.find(l => !l.rawCode.includes('<amp-'));
  return simple ?? links[0];
}

function isEligible(program: ApprovedProgram): boolean {
  if (program.status !== 'active') return false;
  if (program.hasConditionChanged) return false;
  if (program.siteMatchStatus === '非掲載') return false;
  if (!CAREER_AGENT_CATEGORIES.includes(program.category)) return false;
  if (!pickAdLink(program)) return false;
  return true;
}

function industryScore(program: ApprovedProgram, industryKey: string): number {
  const keywords = INDUSTRY_KEYWORDS[industryKey] ?? [];
  if (keywords.length === 0) return 0;
  const haystack = `${program.category} ${program.programName} ${program.advertiserName}`;
  return keywords.some(kw => haystack.includes(kw)) ? 1 : 0;
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
  limit = 3,
): MatchedAgent[] {
  const programs = (approvedData as { programs: ApprovedProgram[] }).programs ?? [];
  const eligible = programs.filter(isEligible);

  const scored = eligible.map(program => {
    const industryHit = topIndustryKeys.some(key => industryScore(program, key) > 0) ? 1 : 0;
    const epc = program.epc ?? 0;
    const confirmationRate = program.confirmationRate ?? 50; // 未取得時は中間値扱い
    // 確定率が極端に低い案件はEPCが高く見えても割り引く（CLAUDE.md記載の判断基準に準拠）
    const confirmationFactor = Math.max(0.3, confirmationRate / 100);
    const epcScore = epc * confirmationFactor;
    return { program, industryHit, epcScore };
  });

  scored.sort((a, b) => {
    if (b.industryHit !== a.industryHit) return b.industryHit - a.industryHit;
    return b.epcScore - a.epcScore;
  });

  return scored.slice(0, limit).map(({ program }) => {
    const adLink = pickAdLink(program)!;
    return {
      programName: program.programName,
      advertiserName: program.advertiserName,
      category: program.category,
      rewardText: rewardToText(program.reward),
      confirmationRate: program.confirmationRate ?? null,
      adLink,
    };
  });
}
