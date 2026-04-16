import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import Stars from '@/components/Stars'

export const metadata: Metadata = {
  title: '月星座と転職 — 月星座ガイド | 転職占い師ルナ',
  description: '月星座があなたの感情・本音・職場での心地よさに与える影響をルナが解説します。',
}

const MOON_ZODIAC_LIST = [
  {
    name: '牡羊座', en: 'Aries', emoji: '♈', dates: '3/21 〜 4/19',
    element: '火', elementColor: '#f07a30',
    keyword: '即興・情熱・自立心',
    emotion: '感情が直接行動に結びつく即興タイプ。感じたらすぐ動かないとストレスが溜まります。承認より自由な裁量を求めます。',
    workplace: '自分でペースをコントロールできる環境が理想。細かい管理や長い承認プロセスは大きなストレスに。',
    career_need: 'スピード感のある職場・決裁権のあるポジション・スタートアップ・プロジェクトリード',
    stress_sign: '「動けない」状況が続くと急に爆発的な不満が出てきます。その衝動こそが転職シグナルです。',
  },
  {
    name: '牡牛座', en: 'Taurus', emoji: '♉', dates: '4/20 〜 5/20',
    element: '土', elementColor: '#c8952a',
    keyword: '安心・安定・感覚的満足',
    emotion: '感情の変化が穏やかで安定志向。環境が急に変わると不安を感じやすいが、慣れると揺るぎない安定感を発揮。',
    workplace: '居心地のよさと物質的な安定（給与・福利厚生）が重要。雑然とした職場や頻繁な組織変更は大きなストレスに。',
    career_need: '安定した大手・専門職・長期的なキャリア形成ができる環境',
    stress_sign: '「なんとなく居心地が悪い」が長く続いたとき。体の不調として現れることも多い牡牛座月のサインです。',
  },
  {
    name: '双子座', en: 'Gemini', emoji: '♊', dates: '5/21 〜 6/21',
    element: '風', elementColor: '#a898f8',
    keyword: '知的刺激・変化・コミュニケーション',
    emotion: '感情を言語化するのが得意。気持ちが変わりやすく、同じことの繰り返しに飽きを感じやすいタイプ。',
    workplace: '会話・情報交換・学びが絶えない環境が理想。孤立した作業や変化のない日常ルーティンは消耗します。',
    career_need: 'コミュニケーションが多い職種・複数プロジェクト・新しい情報に触れ続けられる環境',
    stress_sign: '「同じことの繰り返し」「退屈」という感覚が強くなったとき。情報への飢えが転職衝動に変わります。',
  },
  {
    name: '蟹座', en: 'Cancer', emoji: '♋', dates: '6/22 〜 7/22',
    element: '水', elementColor: '#60c8f0',
    keyword: '安心・共感・つながり',
    emotion: '感受性が非常に高く、職場の雰囲気や人間関係を肌で感じ取るタイプ。信頼できる環境でこそ実力発揮。',
    workplace: '家族的な雰囲気・長期的な人間関係・心理的安全性が確保された職場が理想。冷たいドライな職場は精神的に消耗。',
    career_need: 'チームワーク重視・ケア系職種・長くいられる職場・人の役に立てる仕事',
    stress_sign: '「誰も分かってくれない」「ここにいたくない」という気持ちが続いたとき。感情の変動が大きくなったらサインです。',
  },
  {
    name: '獅子座', en: 'Leo', emoji: '♌', dates: '7/23 〜 8/22',
    element: '火', elementColor: '#f07a30',
    keyword: '承認・表現・誇り',
    emotion: '感情は豊かで表現力旺盛。認められることに強い欲求があり、無視や軽視は深く傷つきます。',
    workplace: '自分の貢献が目に見える形で認められる環境が必須。陰で働き続けることや評価されない環境は大きなストレスに。',
    career_need: '表舞台に立てるポジション・クリエイティブな職種・リーダー経験が積める職場',
    stress_sign: '「頑張っているのに認められない」という気持ちが繰り返し出てきたとき。もっと輝ける場所へのサインです。',
  },
  {
    name: '乙女座', en: 'Virgo', emoji: '♍', dates: '8/23 〜 9/22',
    element: '土', elementColor: '#c8952a',
    keyword: '秩序・有用性・完璧志向',
    emotion: '感情より分析・思考で物事を処理する傾向が強い。「役に立てているか」という感覚が自己評価に直結します。',
    workplace: '明確なプロセスと役割分担・高い基準・改善を続けられる環境が理想。雑然・非効率・質が低い職場は強いストレスに。',
    career_need: '専門性を磨ける環境・品質重視の職種・改善提案が歓迎される職場',
    stress_sign: '「もっとうまくできるのに」「この職場の質が低すぎる」という批判的な思考が止まらなくなったとき。',
  },
  {
    name: '天秤座', en: 'Libra', emoji: '♎', dates: '9/23 〜 10/23',
    element: '風', elementColor: '#a898f8',
    keyword: '調和・公平・美しさ',
    emotion: '人間関係のバランスに敏感で、不公平や争いに強いストレスを感じます。美しい環境や洗練された職場を好む。',
    workplace: '礼儀正しく協力的なチーム・公平な評価制度・美的センスが活かせる職場が理想。対立の多い職場は消耗します。',
    career_need: '対人スキルを活かす職種・デザイン・ブランディング・調整役・穏やかな職場環境',
    stress_sign: '「この職場は公平じゃない」「人間関係が疲れる」という気持ちが積み重なったとき。',
  },
  {
    name: '蠍座', en: 'Scorpio', emoji: '♏', dates: '10/24 〜 11/22',
    element: '水', elementColor: '#60c8f0',
    keyword: '深さ・信頼・変容',
    emotion: '感情は深く強烈だが、表に出さないことが多い。信頼と裏切りに非常に敏感で、一度信頼を失うと戻りにくい。',
    workplace: '深い専門性・真剣な仕事・信頼できる少数の仲間が理想。浅い人間関係や秘密が多い職場は特に消耗します。',
    career_need: '深い専門性を磨ける職種・調査・分析・心理・医療・戦略的なポジション',
    stress_sign: '「この職場を信用できない」「もっと深い仕事がしたい」という感覚が強まったとき。',
  },
  {
    name: '射手座', en: 'Sagittarius', emoji: '♐', dates: '11/23 〜 12/21',
    element: '火', elementColor: '#f07a30',
    keyword: '自由・成長・意味',
    emotion: '楽観的で感情を引きずらないが、自由を制限されると強いフラストレーションを感じます。「意味のある仕事」への欲求が強い。',
    workplace: '自律性・学びの機会・広い視野が持てる環境が必須。狭い世界・細かいルール・成長感がない職場は大きなストレスに。',
    career_need: '海外・グローバル・自由度の高い職場・スキルアップ機会が豊富・広い裁量',
    stress_sign: '「成長している感じがしない」「もっと広い世界へ行きたい」という衝動が出てきたとき。',
  },
  {
    name: '山羊座', en: 'Capricorn', emoji: '♑', dates: '12/22 〜 1/19',
    element: '土', elementColor: '#c8952a',
    keyword: '達成・責任・実績',
    emotion: '感情を仕事の中でコントロールし、目標達成に向けて着実に動く。「努力が報われない」ことに深い失望を感じます。',
    workplace: '明確なキャリアパス・実力主義の評価・長期的な成長が見える職場が理想。結果が出ない環境や不公正な評価は消耗。',
    career_need: 'キャリアアップが見える職場・マネジメント機会・専門性と地位が結びつく仕事',
    stress_sign: '「頑張っても上に行けない」「努力が評価されない」という気持ちが積み重なったとき。環境を変えることで評価が一変します。',
  },
  {
    name: '水瓶座', en: 'Aquarius', emoji: '♒', dates: '1/20 〜 2/18',
    element: '風', elementColor: '#a898f8',
    keyword: '独自性・理想・仲間',
    emotion: '感情を普遍的・客観的に捉えるクールなタイプ。「社会のために何かしたい」という理想への欲求が強い。',
    workplace: '革新的で平等・多様性を認める職場が理想。古い慣習・階層的すぎる組織・個性を否定される環境は強いストレスに。',
    career_need: 'テクノロジー・社会変革・フラットな組織・個性が活きる職種',
    stress_sign: '「この会社は時代遅れだ」「自分らしくいられない」という息苦しさが続いたとき。',
  },
  {
    name: '魚座', en: 'Pisces', emoji: '♓', dates: '2/19 〜 3/20',
    element: '水', elementColor: '#60c8f0',
    keyword: '共感・夢・感受性',
    emotion: '境界線が薄く、職場の雰囲気や他者の感情を吸収しやすい。「意味のある仕事」「人の役に立てる仕事」への欲求が強い。',
    workplace: '温かみがあり・創造性や感性が活きる職場が理想。競争的・ドライ・プレッシャーが強すぎる環境は深く消耗します。',
    career_need: 'クリエイティブ・福祉・ヒーリング・アート・感受性が強みになる職種',
    stress_sign: '「疲れすぎて何も感じなくなった」「仕事に意味を感じられない」という感覚が出てきたとき。',
  },
]

export default function TsukiPage() {
  return (
    <div style={{ background: '#070c1a', color: '#f0f4ff', minHeight: '100dvh', fontFamily: 'var(--font-sans)' }}>
      <Stars />

      {/* HERO */}
      <div style={{ maxWidth: 430, margin: '0 auto', padding: '64px 24px 40px', textAlign: 'center', position: 'relative' }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 80% 60% at 50% 0%, #0d2a4a88, transparent)',
          pointerEvents: 'none',
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-block', fontSize: 9, letterSpacing: 5, color: '#a898f8', border: '1px solid #a898f855', background: '#a898f80a', padding: '4px 14px', borderRadius: 2, marginBottom: 20 }}>
            ✦ 月星座
          </div>
          <h1 style={{ fontFamily: 'var(--font-mincho)', fontSize: 'clamp(26px,7vw,34px)', fontWeight: 900, lineHeight: 1.2, marginBottom: 12 }}>
            月星座と転職の関係
          </h1>
          <p style={{ fontSize: 13, color: '#8898c8', lineHeight: 2, maxWidth: 340, margin: '0 auto' }}>
            月星座はあなたの「感情・本音・心地よさ」を示します。<br />
            太陽星座が「表の顔」なら、月星座は心の奥底の欲求。<br />
            職場でのストレスと幸福感は月星座に大きく左右されます。
          </p>
        </div>
      </div>

      {/* 月星座とは */}
      <div style={{ maxWidth: 430, margin: '0 auto', padding: '0 20px 32px' }}>
        <div style={{ background: '#0d1428', border: '1px solid #a898f844', borderRadius: 16, padding: '20px 18px' }}>
          <div style={{ fontSize: 10, color: '#a898f8', letterSpacing: 2, marginBottom: 12 }}>🌙 月星座とは</div>
          <p style={{ fontSize: 13, color: '#b0bcd8', lineHeight: 1.9, marginBottom: 12 }}>
            月星座は、あなたが生まれた瞬間に月がどの星座にいたかで決まります。約2.5日ごとに星座を移動する月は、感情・直感・本能的な欲求を司ります。
          </p>
          <p style={{ fontSize: 13, color: '#b0bcd8', lineHeight: 1.9 }}>
            太陽星座が「どう行動するか」を示すのに対し、月星座は「何を感じているか・何に安心するか」を示します。転職においては、<span style={{ color: '#a898f8' }}>どんな職場環境や人間関係に心地よさを感じるか</span>に深く関わります。
          </p>
        </div>
      </div>

      {/* 星座リスト */}
      <div style={{ maxWidth: 430, margin: '0 auto', padding: '0 20px 60px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {MOON_ZODIAC_LIST.map((z) => (
          <div key={z.name} style={{
            background: '#0d1428',
            border: '1px solid #2a3f72',
            borderRadius: 16,
            overflow: 'hidden',
          }}>
            {/* カラーバー */}
            <div style={{ height: 3, background: `linear-gradient(90deg, ${z.elementColor}, transparent)` }} />

            <div style={{ padding: '18px 18px 16px' }}>
              {/* ヘッダー */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
                <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#111c36', border: `1px solid ${z.elementColor}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Image src={`/assets/img/${z.en}.png`} alt={z.name} width={36} height={36} style={{ objectFit: 'contain' }} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 2 }}>
                    <span style={{ fontFamily: 'var(--font-serif)', fontSize: 18, fontWeight: 700, color: '#f0f4ff' }}>🌙 {z.name}</span>
                    <span style={{ fontSize: 10, color: '#7888b8' }}>{z.dates}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <span style={{ fontSize: 10, color: z.elementColor, background: `${z.elementColor}18`, border: `1px solid ${z.elementColor}44`, borderRadius: 4, padding: '1px 8px' }}>{z.element}のグループ</span>
                  </div>
                </div>
              </div>

              {/* キーワード */}
              <div style={{ fontSize: 11, color: z.elementColor, letterSpacing: 1, marginBottom: 8 }}>✦ {z.keyword}</div>

              {/* 感情パターン */}
              <p style={{ fontSize: 12, color: '#b0bcd8', lineHeight: 1.9, marginBottom: 12 }}>{z.emotion}</p>

              {/* 職場の好み */}
              <div style={{ background: '#111c36', borderRadius: 10, padding: '10px 14px', marginBottom: 10 }}>
                <div style={{ fontSize: 10, color: '#7888b8', marginBottom: 4, letterSpacing: 1 }}>職場環境の好み</div>
                <div style={{ fontSize: 12, color: '#dde4f8', lineHeight: 1.7 }}>{z.workplace}</div>
              </div>

              {/* 向いている仕事 */}
              <div style={{ background: '#111c36', borderRadius: 10, padding: '10px 14px', marginBottom: 10 }}>
                <div style={{ fontSize: 10, color: '#7888b8', marginBottom: 4, letterSpacing: 1 }}>向いている仕事</div>
                <div style={{ fontSize: 12, color: '#dde4f8' }}>{z.career_need}</div>
              </div>

              {/* ストレスサイン */}
              <div style={{ background: `${z.elementColor}0a`, border: `1px solid ${z.elementColor}33`, borderRadius: 10, padding: '10px 14px' }}>
                <div style={{ fontSize: 10, color: z.elementColor, marginBottom: 4, letterSpacing: 1 }}>🌙 転職タイミングのサイン</div>
                <div style={{ fontSize: 12, color: '#b0bcd8', lineHeight: 1.8 }}>{z.stress_sign}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* フッター */}
      <div style={{ maxWidth: 430, margin: '0 auto', padding: '0 24px 48px' }}>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link href="/guide/seiyou" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: '#0d1428', border: '1px solid #2a3f72', borderRadius: 10, padding: '12px', fontSize: 12, color: '#a898f8', textDecoration: 'none', fontWeight: 700 }}>
            ← 西洋占星術に戻る
          </Link>
          <Link href="/shindan" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: 'linear-gradient(135deg, #c8952a, #e0a830)', borderRadius: 10, padding: '12px', fontSize: 12, color: '#1a0c00', textDecoration: 'none', fontWeight: 700 }}>
            ✨ 占いを始める →
          </Link>
        </div>
      </div>
    </div>
  )
}
