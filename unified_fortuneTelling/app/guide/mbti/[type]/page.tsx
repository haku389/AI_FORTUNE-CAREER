import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Stars from '@/components/Stars'

type MbtiEntry = {
  code: string
  name: string
  tagline: string
  group: '分析家' | '外交官' | '番人' | '探検家'
  groupColor: string
  strengths: [string, string, string]
  weaknesses: [string, string]
  workStyle: string
  careerAdvice: string
  topJobs: { job: string; reason: string }[]
  compatibleZodiac: [string, string, string]
}

const MBTI_DATA: Record<string, MbtiEntry> = {
  intj: {
    code: 'INTJ',
    name: '建築家',
    tagline: '長期視点で職場を選ぶ戦略家',
    group: '分析家',
    groupColor: '#a898f8',
    strengths: ['複雑な問題を体系的に解決する力', '高い自律性と自己規律', '長期目標を設計し逆算して実行する能力'],
    weaknesses: ['感情面のコミュニケーションが苦手', '完璧主義すぎて行動が遅れがち'],
    workStyle: '静かな環境で深く集中することを好む。裁量が大きく、成果で評価される職場で最も力を発揮する。',
    careerAdvice: '安定した大企業よりも、専門性が問われる環境や成長フェーズの組織を好む傾向がある。転職の動機は「成長の頭打ち」であることが多い。',
    topJobs: [
      { job: 'ITアーキテクト', reason: '全体設計と長期技術戦略が求められるため' },
      { job: '経営コンサルタント', reason: '複雑な課題への論理的アプローチが活きる' },
      { job: '研究開発職', reason: '深い集中と独自の視点が強みになる' },
    ],
    compatibleZodiac: ['山羊座', '乙女座', '蠍座'],
  },
  intp: {
    code: 'INTP',
    name: '論理学者',
    tagline: '知的好奇心で世界を分解する探究者',
    group: '分析家',
    groupColor: '#a898f8',
    strengths: ['抽象的な概念を扱う高い知性', '独創的な問題解決アプローチ', '客観性と論理的一貫性'],
    weaknesses: ['完成まで至らないアイデアが多い', '細部の実装や事務作業を嫌う'],
    workStyle: '自分のペースで思考を深められる環境を好む。ルールよりも理論的な裏付けを重視し、意味を感じない作業はモチベーションが落ちる。',
    careerAdvice: '「なぜそれをするのか」が腑に落ちない職場では長続きしない。知的刺激と自由度が転職先選びの最重要基準。',
    topJobs: [
      { job: 'データサイエンティスト', reason: 'パターン分析と理論構築が合致する' },
      { job: 'ソフトウェアエンジニア', reason: '論理的思考と独自のアルゴリズム設計が強み' },
      { job: '研究員・アナリスト', reason: '深掘りと仮説検証のサイクルに向いている' },
    ],
    compatibleZodiac: ['水瓶座', '双子座', '射手座'],
  },
  entj: {
    code: 'ENTJ',
    name: '指揮官',
    tagline: '組織を動かし結果をつくるリーダー',
    group: '分析家',
    groupColor: '#a898f8',
    strengths: ['強いリーダーシップと決断力', '戦略的思考と目標達成への執着', '効率化と組織最適化の才能'],
    weaknesses: ['他者への配慮や共感が不足しがち', '自分の基準を人に押し付けることがある'],
    workStyle: '権限と責任を持って物事を推進する環境を好む。結果が出ない停滞した組織や、意思決定が遅い場所は大きなストレスになる。',
    careerAdvice: '実力主義の組織で早く昇進する傾向がある。転職は「より大きな舞台を求めて」が多く、年収・ポジション・影響力をすべて上げる判断ができる。',
    topJobs: [
      { job: '事業部長・マネージャー', reason: 'チームをまとめ成果を出す場面で輝く' },
      { job: '起業家', reason: 'ビジョンを形にする行動力と統率力がある' },
      { job: '経営コンサルタント', reason: '組織変革と戦略立案を得意とする' },
    ],
    compatibleZodiac: ['牡羊座', '獅子座', '山羊座'],
  },
  entp: {
    code: 'ENTP',
    name: '討論者',
    tagline: 'アイデアと議論で常識を覆す革新者',
    group: '分析家',
    groupColor: '#a898f8',
    strengths: ['素早いアイデア発想と概念の組み合わせ', '論理的な反論と議論を楽しむ力', '変化への高い適応力'],
    weaknesses: ['飽きやすく継続性に欠ける', '反論することが目的化することがある'],
    workStyle: 'ルールや慣例に縛られない自由な環境で力を発揮。ブレインストーミングや議論が多い職場が合う。単調な繰り返し業務は向かない。',
    careerAdvice: '「これって本当に正しいのか？」という問いが常にある。転職動機は「現状への疑問と飽き」で、スタートアップや新規事業に惹かれやすい。',
    topJobs: [
      { job: '事業開発・BizDev', reason: '新しい可能性を探る動きに直結する' },
      { job: 'UXデザイナー', reason: '既存の常識を疑い再設計するプロセスが合う' },
      { job: 'マーケター', reason: 'アイデアを素早く試しながら改善できる' },
    ],
    compatibleZodiac: ['双子座', '水瓶座', '牡羊座'],
  },
  infj: {
    code: 'INFJ',
    name: '提唱者',
    tagline: '深い洞察と使命感で人を導く理想家',
    group: '外交官',
    groupColor: '#3cc4a8',
    strengths: ['深い共感力と人間理解', '長期的なビジョンを持ち粘り強く実行する力', '意味と価値を重視した判断'],
    weaknesses: ['理想が高すぎて現実との乖離に苦しむ', 'バーンアウトしやすい'],
    workStyle: '自分の価値観と仕事が一致している環境でのみ高いパフォーマンスを発揮する。意味を感じられない業務は著しく消耗する。',
    careerAdvice: '転職の動機は「この仕事に意味を感じられなくなった」が最も多い。単なる条件よりも「何に貢献できるか」が転職先の最優先基準になる。',
    topJobs: [
      { job: 'キャリアカウンセラー', reason: '人の潜在能力を引き出すことに喜びを感じる' },
      { job: 'UXライター・コンテンツ制作', reason: '伝えたい意味を深く考え言語化できる' },
      { job: '非営利・社会起業家', reason: 'ミッション起動で動ける環境が合う' },
    ],
    compatibleZodiac: ['蠍座', '魚座', '乙女座'],
  },
  infp: {
    code: 'INFP',
    name: '仲介者',
    tagline: '価値観と創造性で世界を豊かにする夢想家',
    group: '外交官',
    groupColor: '#3cc4a8',
    strengths: ['豊かな想像力と創造性', '他者への深い共感と誠実さ', '個人の価値観に忠実な行動力'],
    weaknesses: ['批判を過剰に受け取りやすい', '現実的な問題解決が苦手'],
    workStyle: '自分の価値観と業務内容が一致している環境で最大限に力を発揮する。競争的な環境や数字だけで評価される場所は合わない。',
    careerAdvice: '転職のきっかけは「会社の方針と自分の信念が合わなくなった」が多い。給与よりも「この仕事が好きか」が最重要。',
    topJobs: [
      { job: 'ライター・エディター', reason: '言葉で価値観を表現する仕事が最も合う' },
      { job: 'グラフィックデザイナー', reason: '感性と美的センスを活かした表現ができる' },
      { job: 'カウンセラー・支援職', reason: '相手に寄り添い理解を深める姿勢が強み' },
    ],
    compatibleZodiac: ['魚座', '蟹座', '天秤座'],
  },
  enfj: {
    code: 'ENFJ',
    name: '主人公',
    tagline: '人を鼓舞し可能性を引き出す天性のリーダー',
    group: '外交官',
    groupColor: '#3cc4a8',
    strengths: ['人を動かすカリスマ性と共感力', 'チームをまとめ方向性を示す力', '他者の成長を本気で喜べる'],
    weaknesses: ['他者のために自分を犠牲にしすぎる', '批判に対して防御的になりやすい'],
    workStyle: '人と深く関わり、チーム全体の目標達成に貢献する仕事で充実感を感じる。孤立した作業環境や成果主義すぎる職場は合わない。',
    careerAdvice: '「チームの成長を感じられない」「自分の貢献が見えない」という理由で転職を考えることが多い。人材・教育・リーダーポジションへの転職が向いている。',
    topJobs: [
      { job: '人事・HRBPー', reason: '人の成長を支える仕事に天職を感じる' },
      { job: '営業マネージャー', reason: 'チームを導き結果をつくるプロセスが合う' },
      { job: '研修・コーチ', reason: '他者の可能性を引き出すことが喜びになる' },
    ],
    compatibleZodiac: ['獅子座', '牡羊座', '射手座'],
  },
  enfp: {
    code: 'ENFP',
    name: '広報運動家',
    tagline: '情熱と共感で人と世界を繋ぐ自由人',
    group: '外交官',
    groupColor: '#3cc4a8',
    strengths: ['人との繋がりを作る卓越したコミュ力', '新しいアイデアへの情熱と行動力', '多様な人を惹きつけるエネルギー'],
    weaknesses: ['集中力が持続しにくい', '細かいルールや手続きを嫌う'],
    workStyle: '自由度が高く、多くの人と関わりながら新しいことに挑戦できる環境が最適。ルーティン業務や厳格な管理体制はストレスになる。',
    careerAdvice: '「もっと自由に動きたい」「もっと人と深く関わりたい」が転職の動機になりやすい。スタートアップ・フリーランス・社会的な仕事に惹かれる。',
    topJobs: [
      { job: 'マーケター・PRプランナー', reason: '人を巻き込み熱量を伝えることが得意' },
      { job: 'イベントプロデューサー', reason: '人と人を繋ぎ場を作る力が強み' },
      { job: 'スタートアップ創業メンバー', reason: '混沌とした環境でエネルギーを発揮できる' },
    ],
    compatibleZodiac: ['射手座', '双子座', '牡羊座'],
  },
  istj: {
    code: 'ISTJ',
    name: '管理者',
    tagline: '誠実さと責任感で組織の礎を担う守護者',
    group: '番人',
    groupColor: '#60c8f0',
    strengths: ['高い信頼性と責任感', '詳細への注意力と正確性', '一貫した手順で着実に成果を出す力'],
    weaknesses: ['変化への対応が遅い', '新しいアプローチを試すことへの抵抗感'],
    workStyle: '明確なルール・手順・責任範囲がある環境で安定した成果を出す。急な変更や曖昧な指示はストレスになる。',
    careerAdvice: '長期間同じ職場で信頼を積み上げることが多い。転職の動機は「組織の方向性への不信感」や「評価されない不満」が多い。',
    topJobs: [
      { job: '経理・財務', reason: '正確性と規律が求められる環境が合う' },
      { job: 'プロジェクトマネージャー', reason: '計画・管理・実行のサイクルを得意とする' },
      { job: '品質管理・コンプライアンス', reason: '細部への注意力と一貫性が強みになる' },
    ],
    compatibleZodiac: ['山羊座', '乙女座', '牡牛座'],
  },
  isfj: {
    code: 'ISFJ',
    name: '擁護者',
    tagline: '細やかな気遣いで周囲を支え続ける縁の下の力持ち',
    group: '番人',
    groupColor: '#60c8f0',
    strengths: ['深い共感力と奉仕精神', '細かい気遣いと観察力', '安定した関係を維持する忠実さ'],
    weaknesses: ['自分の意見を主張することが苦手', '変化に対して不安を感じやすい'],
    workStyle: '人のために役立てる環境で強い満足感を感じる。感謝が見えにくい職場や競争的な雰囲気は消耗する。',
    careerAdvice: '「もっと人の役に立てる仕事をしたい」が転職のきっかけになることが多い。医療・福祉・教育・サポート職への転職が向いている。',
    topJobs: [
      { job: '医療事務・看護師', reason: 'サポートと細かい注意力が活きる現場' },
      { job: 'カスタマーサクセス', reason: '顧客の成功を支える姿勢が強み' },
      { job: '学校の教員・塾講師', reason: '継続的なサポートと関係構築に長ける' },
    ],
    compatibleZodiac: ['蟹座', '乙女座', '魚座'],
  },
  estj: {
    code: 'ESTJ',
    name: '幹部',
    tagline: '秩序と実行力で組織をまとめる管理者',
    group: '番人',
    groupColor: '#60c8f0',
    strengths: ['組織を効率よくまとめるリーダーシップ', '実務能力と迅速な意思決定', '明確な目標に向かって動かす力'],
    weaknesses: ['柔軟性に欠け、感情面への配慮が薄い', '自分のやり方を変えることへの抵抗'],
    workStyle: '明確な役割・ルール・目標がある組織でベストパフォーマンスを発揮。曖昧な環境や無秩序な職場はストレス。',
    careerAdvice: '昇進・昇給・肩書きが転職の動機になりやすい。管理職ポジションやチームリーダーへの転職でさらに力を発揮できる。',
    topJobs: [
      { job: '営業マネージャー', reason: '数字目標に向かってチームを動かす力がある' },
      { job: '工場・製造ライン管理職', reason: '秩序と効率を重視する現場に向いている' },
      { job: '行政・公務員', reason: '規律と手続きを守る環境が合う' },
    ],
    compatibleZodiac: ['山羊座', '牡牛座', '牡羊座'],
  },
  esfj: {
    code: 'ESFJ',
    name: '領事',
    tagline: 'チームの調和を守るホスピタリティの達人',
    group: '番人',
    groupColor: '#60c8f0',
    strengths: ['場の空気を読み調和を保つ能力', '人を気遣い協力関係を作る力', '伝統と安定を大切にする実直さ'],
    weaknesses: ['批判や対立を極度に嫌う', '変化が多い環境では不安定になる'],
    workStyle: '人と協力し、チームが円滑に機能するための縁の下の力持ちとして輝く。感謝を実感できる職場環境が大切。',
    careerAdvice: '職場の人間関係の悪化や、感謝されない環境が転職のきっかけになりやすい。接客・医療・教育・コーディネーター系が向いている。',
    topJobs: [
      { job: 'ホテル・ブライダル', reason: '人を幸せにするおもてなしの仕事が天職' },
      { job: '人事・採用担当', reason: '人との関係構築と組織の調和維持が得意' },
      { job: '児童福祉・保育士', reason: 'ケアと安定した関係が求められる場で輝く' },
    ],
    compatibleZodiac: ['蟹座', '乙女座', '天秤座'],
  },
  istp: {
    code: 'ISTP',
    name: '巨匠',
    tagline: '手を動かして問題を即座に解決する職人',
    group: '探検家',
    groupColor: '#c8952a',
    strengths: ['冷静な状況判断と即興力', '手を動かして物事を実装・修正する力', '独立して問題を解決する能力'],
    weaknesses: ['長期計画や感情面のコミュニケーションが苦手', '約束や締め切りへの意識が低い'],
    workStyle: '実際に手を動かし、結果がすぐに見える仕事が合う。細かい管理や長い会議、意味のない手続きはストレスになる。',
    careerAdvice: '「実際に動いて成果が出る仕事をしたい」が転職の動機になりやすい。技術職・現場職・フリーランスへの転身が向いている。',
    topJobs: [
      { job: 'エンジニア・プログラマー', reason: '論理的な問題解決と実装が直結する' },
      { job: '機械・電気系技術者', reason: '手を動かして問題を修正する仕事が合う' },
      { job: 'フリーランスデザイナー', reason: '自律的に動き結果を出せる環境が向いている' },
    ],
    compatibleZodiac: ['山羊座', '乙女座', '牡牛座'],
  },
  isfp: {
    code: 'ISFP',
    name: '冒険家',
    tagline: '感性と実践で今この瞬間を生きるアーティスト',
    group: '探検家',
    groupColor: '#c8952a',
    strengths: ['豊かな感性と美的センス', '現在に集中して行動できる柔軟さ', '人の感情に寄り添う優しさ'],
    weaknesses: ['長期計画が苦手で将来への見通しが甘くなりやすい', '競争的な環境でモチベーションが下がる'],
    workStyle: '創造的で自由度の高い環境か、人のために直接貢献できる仕事が合う。マイクロマネジメントや競争激しい職場は合わない。',
    careerAdvice: '「この仕事が楽しくない」「もっと自分らしくいられる職場で働きたい」が転職の動機。感性を活かせる仕事への転職で輝く。',
    topJobs: [
      { job: 'グラフィック・イラストレーター', reason: '感性と美意識を直接表現できる仕事' },
      { job: '美容師・ネイリスト', reason: '目の前の人を喜ばせる実感がある仕事' },
      { job: '動物看護士・介護士', reason: '生き物・人への寄り添いが自然にできる' },
    ],
    compatibleZodiac: ['魚座', '天秤座', '蟹座'],
  },
  estp: {
    code: 'ESTP',
    name: '起業家',
    tagline: '瞬発力と交渉力で現場を動かす行動派',
    group: '探検家',
    groupColor: '#c8952a',
    strengths: ['高い瞬発力と現場対応能力', '人を説得し動かす交渉・営業力', 'リスクを恐れず挑戦する大胆さ'],
    weaknesses: ['長期計画や細かいルールへの忍耐が低い', '衝動的な意思決定でリスクを取りすぎることがある'],
    workStyle: '結果がすぐに見え、スピードと判断力が求められる現場で最大限に輝く。会議や書類仕事の多い環境は苦手。',
    careerAdvice: '「もっと動いて稼ぎたい」「スピード感のある環境に行きたい」が転職の動機。営業・起業・現場マネジメントで結果を出す。',
    topJobs: [
      { job: 'トップ営業職', reason: '交渉力と瞬発力で高い成果を出せる' },
      { job: '起業家・経営者', reason: 'リスクを取りスピーディに決断する天性がある' },
      { job: 'プロデューサー', reason: '人と現場をまとめ動かす能力が活きる' },
    ],
    compatibleZodiac: ['牡羊座', '獅子座', '射手座'],
  },
  esfp: {
    code: 'ESFP',
    name: 'エンターテイナー',
    tagline: '場を明るくし人を巻き込む生粋の表現者',
    group: '探検家',
    groupColor: '#c8952a',
    strengths: ['場を盛り上げるコミュニケーション能力', '他者への自然な気遣いと明るさ', '今ここに集中して楽しむ力'],
    weaknesses: ['長期計画や将来への準備が後回しになりがち', '批判に敏感で傷つきやすい'],
    workStyle: '人と関わり、喜びや楽しさを共有できる仕事で輝く。孤立した作業やルーティンだけの職場は合わない。',
    careerAdvice: '「もっと人と関われる仕事がしたい」「楽しい職場で働きたい」が転職の動機。接客・エンタメ・イベント系で天職を見つける。',
    topJobs: [
      { job: 'タレント・MC・ナレーター', reason: '表現力と存在感が最大限に活きる舞台' },
      { job: 'イベントスタッフ・プランナー', reason: '人を楽しませる場を作ることが得意' },
      { job: '美容・ファッション', reason: '人との関わりとトレンドへの感度が合う' },
    ],
    compatibleZodiac: ['獅子座', '双子座', '射手座'],
  },
}

export function generateStaticParams() {
  return Object.keys(MBTI_DATA).map((type) => ({ type }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ type: string }>
}): Promise<Metadata> {
  const { type } = await params
  const data = MBTI_DATA[type.toLowerCase()]
  if (!data) return { title: 'MBTI | 転職占い師ルナ' }
  return {
    title: `${data.code}（${data.name}）の転職傾向 | 転職占い師ルナ`,
    description: `${data.code}タイプ「${data.name}」の強み・弱み・向いている職種・転職傾向を徹底解説。MBTIと星座を掛け合わせたルナの鑑定で転職運命を読み解きます。`,
  }
}

const DIVIDER = ({ label }: { label: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
    <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, #2a3f72)' }} />
    <span style={{ fontSize: 10, letterSpacing: 4, color: '#5a6a9a', whiteSpace: 'nowrap' }}>{label}</span>
    <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, #2a3f72, transparent)' }} />
  </div>
)

export default async function MbtiTypePage({
  params,
}: {
  params: Promise<{ type: string }>
}) {
  const { type } = await params
  const data = MBTI_DATA[type.toLowerCase()]
  if (!data) notFound()

  const { code, name, tagline, group, groupColor, strengths, weaknesses, workStyle, careerAdvice, topJobs, compatibleZodiac } = data

  return (
    <div
      style={{
        background: '#070c1a',
        color: '#f0f4ff',
        minHeight: '100dvh',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <Stars />

      {/* ── BREADCRUMB ── */}
      <div
        style={{
          maxWidth: 430,
          margin: '0 auto',
          padding: '20px 24px 0',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          fontSize: 11,
          color: '#5a6a9a',
        }}
      >
        <Link href="/guide" style={{ color: '#5a6a9a', textDecoration: 'none' }}>占い図鑑</Link>
        <span>›</span>
        <Link href="/guide/mbti" style={{ color: '#5a6a9a', textDecoration: 'none' }}>MBTI</Link>
        <span>›</span>
        <span style={{ color: groupColor }}>{code}</span>
      </div>

      {/* ── HERO ── */}
      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          maxWidth: 430,
          margin: '0 auto',
          padding: '40px 24px 48px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${groupColor}22, transparent)`,
            pointerEvents: 'none',
          }}
        />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div
            style={{
              fontSize: 'clamp(52px, 15vw, 72px)',
              fontWeight: 900,
              fontFamily: 'var(--font-mincho)',
              letterSpacing: '0.1em',
              background: `linear-gradient(135deg, #f0c060, ${groupColor})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              lineHeight: 1,
              marginBottom: 12,
            }}
          >
            {code}
          </div>
          <div
            style={{
              display: 'inline-block',
              background: `${groupColor}22`,
              border: `1px solid ${groupColor}66`,
              color: groupColor,
              fontSize: 10,
              letterSpacing: 2,
              padding: '3px 12px',
              borderRadius: 2,
              marginBottom: 12,
            }}
          >
            {group}
          </div>
          <div
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 20,
              fontWeight: 700,
              color: '#f0f4ff',
              marginBottom: 8,
            }}
          >
            {name}
          </div>
          <div style={{ fontSize: 13, color: '#8898c8' }}>{tagline}</div>
        </div>
      </div>

      {/* ── 基本特徴 ── */}
      <div style={{ maxWidth: 430, margin: '0 auto', padding: '0 24px 48px' }}>
        <DIVIDER label="基本特徴" />

        <div
          style={{
            background: '#0d1428',
            border: '1px solid #2a3f72',
            borderRadius: 14,
            padding: '20px 20px',
            marginBottom: 14,
          }}
        >
          <div style={{ fontSize: 11, letterSpacing: 2, color: '#f0c060', marginBottom: 12 }}>STRENGTHS</div>
          {strengths.map((s) => (
            <div key={s} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'flex-start' }}>
              <span style={{ color: '#f0c060', fontSize: 10, marginTop: 3, flexShrink: 0 }}>✦</span>
              <span style={{ fontSize: 13, color: '#d0d8f0', lineHeight: 1.7 }}>{s}</span>
            </div>
          ))}
        </div>

        <div
          style={{
            background: '#0d1428',
            border: '1px solid #2a3f72',
            borderRadius: 14,
            padding: '20px 20px',
            marginBottom: 14,
          }}
        >
          <div style={{ fontSize: 11, letterSpacing: 2, color: '#5a6a9a', marginBottom: 12 }}>WEAKNESSES</div>
          {weaknesses.map((w) => (
            <div key={w} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'flex-start' }}>
              <span style={{ color: '#5a6a9a', fontSize: 10, marginTop: 3, flexShrink: 0 }}>△</span>
              <span style={{ fontSize: 13, color: '#7888b8', lineHeight: 1.7 }}>{w}</span>
            </div>
          ))}
        </div>

        <div
          style={{
            background: '#0d1428',
            border: '1px solid #2a3f72',
            borderRadius: 14,
            padding: '20px 20px',
          }}
        >
          <div style={{ fontSize: 11, letterSpacing: 2, color: '#5a6a9a', marginBottom: 12 }}>WORK STYLE</div>
          <p style={{ fontSize: 13, color: '#b0bcd8', lineHeight: 2, margin: 0 }}>{workStyle}</p>
        </div>
      </div>

      {/* ── 転職傾向 ── */}
      <div style={{ maxWidth: 430, margin: '0 auto', padding: '0 24px 48px' }}>
        <DIVIDER label="転職傾向" />
        <div
          style={{
            background: 'linear-gradient(135deg, #0d1428, #12102a)',
            border: `1px solid ${groupColor}44`,
            borderRadius: 14,
            padding: '20px 20px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 2,
              background: `linear-gradient(90deg, ${groupColor}, transparent)`,
            }}
          />
          <p style={{ fontSize: 13, color: '#b0bcd8', lineHeight: 2, margin: 0 }}>{careerAdvice}</p>
        </div>
      </div>

      {/* ── 向いている職種TOP3 ── */}
      <div style={{ maxWidth: 430, margin: '0 auto', padding: '0 24px 48px' }}>
        <DIVIDER label="向いている職種TOP3" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {topJobs.map(({ job, reason }, i) => (
            <div
              key={job}
              style={{
                background: '#0d1428',
                border: '1px solid #2a3f72',
                borderRadius: 12,
                padding: '14px 16px',
                display: 'flex',
                gap: 14,
                alignItems: 'flex-start',
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: `${groupColor}22`,
                  border: `1px solid ${groupColor}66`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                  fontWeight: 800,
                  color: groupColor,
                  flexShrink: 0,
                }}
              >
                {i + 1}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#f0f4ff', marginBottom: 4 }}>{job}</div>
                <div style={{ fontSize: 12, color: '#7888b8', lineHeight: 1.6 }}>{reason}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 相性の良い星座 ── */}
      <div style={{ maxWidth: 430, margin: '0 auto', padding: '0 24px 48px' }}>
        <DIVIDER label="相性の良い星座" />
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          {compatibleZodiac.map((zodiac) => (
            <div
              key={zodiac}
              style={{
                background: '#0d1428',
                border: `1px solid ${groupColor}55`,
                borderRadius: 20,
                padding: '8px 18px',
                fontSize: 13,
                color: groupColor,
                fontWeight: 600,
              }}
            >
              {zodiac}
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA ── */}
      <div style={{ maxWidth: 430, margin: '0 auto', padding: '0 24px 72px' }}>
        <Link
          href="/premium"
          style={{
            display: 'block',
            padding: '16px 0',
            background: 'linear-gradient(135deg, #c8952a, #e0a830)',
            borderRadius: 10,
            color: '#1a0c00',
            fontSize: 14,
            fontWeight: 800,
            textAlign: 'center',
            textDecoration: 'none',
            letterSpacing: 1,
          }}
        >
          あなたのMBTI×星座を鑑定する →
        </Link>
      </div>
    </div>
  )
}
