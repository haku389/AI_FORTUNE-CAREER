import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import Stars from '@/components/Stars'

export const metadata: Metadata = {
  title: '12星座と転職 — 太陽星座ガイド | 転職占い師ルナ',
  description: '12星座それぞれの特性と、転職における強み・向いている仕事をルナが解説します。',
}

const ZODIAC_LIST = [
  {
    name: '牡羊座', en: 'Aries', emoji: '♈', dates: '3/21 〜 4/19',
    element: '火', elementColor: '#f07a30',
    keyword: '行動力・情熱・開拓者精神',
    nature: '直感で動き、スピード感を重視する先駆者タイプ。チャレンジを恐れず、新しい環境にも素早く適応します。',
    career: 'スタートアップ・営業・新規事業開発・起業家・プロデューサー',
    timing: '「今すぐ動きたい」という衝動がサインです。牡羊座は行動することで運が開きます。',
  },
  {
    name: '牡牛座', en: 'Taurus', emoji: '♉', dates: '4/20 〜 5/20',
    element: '土', elementColor: '#c8952a',
    keyword: '安定・粘り強さ・美意識・着実',
    nature: '長期的な視点と確実な実績積み上げが得意。信頼を時間をかけて築き、専門性を深めていくタイプ。',
    career: '経理・財務・不動産・デザイン・職人・専門職・品質管理',
    timing: '焦りは禁物。じっくり準備してから動く牡牛座は、タイミングを見極めることが大切です。',
  },
  {
    name: '双子座', en: 'Gemini', emoji: '♊', dates: '5/21 〜 6/21',
    element: '風', elementColor: '#a898f8',
    keyword: '好奇心・コミュ力・多才・変化',
    nature: '情報収集と人脈形成が得意な知的タイプ。複数の分野を横断しながら、アイデアで周囲を引っ張ります。',
    career: 'マーケター・PR・編集者・コンサルタント・営業企画・メディア',
    timing: '「なんとなく飽きてきた」という感覚が次へのサインです。変化に乗ると双子座は輝きます。',
  },
  {
    name: '蟹座', en: 'Cancer', emoji: '♋', dates: '6/22 〜 7/22',
    element: '水', elementColor: '#60c8f0',
    keyword: '思いやり・直感・保護本能・共感',
    nature: '人の気持ちに寄り添い、チームの調和を守る感受性豊かなタイプ。安心できる環境でこそ本領発揮。',
    career: '医療・福祉・保育・HR・カスタマーサポート・人事・教育',
    timing: '職場の居心地の悪さを感じたら、それは星のサインです。環境ごと変えることを考えて。',
  },
  {
    name: '獅子座', en: 'Leo', emoji: '♌', dates: '7/23 〜 8/22',
    element: '火', elementColor: '#f07a30',
    keyword: '表現力・カリスマ・リーダーシップ・自信',
    nature: '舞台の中心で輝くことを好む天性のリーダー。認められることがモチベーションになります。',
    career: '経営者・クリエイター・俳優・イベント企画・ブランドマネージャー・セールス',
    timing: '「もっと大きなステージに立ちたい」という渇望が動き時のサインです。',
  },
  {
    name: '乙女座', en: 'Virgo', emoji: '♍', dates: '8/23 〜 9/22',
    element: '土', elementColor: '#c8952a',
    keyword: '分析力・几帳面・完璧主義・誠実',
    nature: '細部への注意力と高い基準を持ち、着実に改善を積み上げるプロフェッショナルタイプ。',
    career: 'データアナリスト・エンジニア・医療・研究職・経営企画・コンサルタント',
    timing: '「もっと正確にできるはず」という思いが高まったとき、新しい挑戦の時期です。',
  },
  {
    name: '天秤座', en: 'Libra', emoji: '♎', dates: '9/23 〜 10/23',
    element: '風', elementColor: '#a898f8',
    keyword: '調和・公平・美意識・バランス感覚',
    nature: '対人関係に優れ、場の空気を整える外交的なタイプ。複数の視点を調整しながら最善解を導きます。',
    career: '法務・弁護士・外交・採用・広報・デザイナー・ブランディング',
    timing: '人間関係のバランスが崩れてきたら、環境を変えることを真剣に考えて。',
  },
  {
    name: '蠍座', en: 'Scorpio', emoji: '♏', dates: '10/24 〜 11/22',
    element: '水', elementColor: '#60c8f0',
    keyword: '洞察力・変革・情熱・深さ・意志力',
    nature: '物事の本質を見抜く深い洞察力を持ち、一度決めたことは徹底的にやり遂げる強靭な意志のタイプ。',
    career: '投資・M&A・心理士・探偵・研究・外科医・危機管理・戦略コンサル',
    timing: '現状への強い違和感と「もっと深くやりたい」という欲求が重なったとき。',
  },
  {
    name: '射手座', en: 'Sagittarius', emoji: '♐', dates: '11/23 〜 12/21',
    element: '火', elementColor: '#f07a30',
    keyword: '自由・探求・楽観主義・大局観',
    nature: '広い視野と自由を愛する冒険家タイプ。型にはまった環境では力を発揮しきれません。',
    career: '海外ビジネス・コンサル・講師・メディア・起業家・ベンチャー',
    timing: '「もっと広い世界を見たい」という気持ちが高まったとき。射手座は動きすぎるくらいで丁度いい。',
  },
  {
    name: '山羊座', en: 'Capricorn', emoji: '♑', dates: '12/22 〜 1/19',
    element: '土', elementColor: '#c8952a',
    keyword: '野心・責任感・忍耐・着実・高い基準',
    nature: '高い目標に向けて着実に努力を積み重ねるプロフェッショナル。長期的な信頼と実績で評価を築きます。',
    career: '経営・金融・不動産・コンサル・公務員・プロジェクトマネージャー',
    timing: '「努力が正当に評価されていない」と感じたとき。山羊座は環境を変えることで評価が変わります。',
  },
  {
    name: '水瓶座', en: 'Aquarius', emoji: '♒', dates: '1/20 〜 2/18',
    element: '風', elementColor: '#a898f8',
    keyword: '革新・独自性・自由・未来志向',
    nature: '時代の一歩先を見通す革新的な視点を持ち、常識にとらわれない独創的な発想で世界を変えます。',
    career: 'テクノロジー・AI・スタートアップ・社会起業・研究・クリエイター',
    timing: '「型にはまっている」という息苦しさが動き時です。水瓶座は変化することで本来の力が出ます。',
  },
  {
    name: '魚座', en: 'Pisces', emoji: '♓', dates: '2/19 〜 3/20',
    element: '水', elementColor: '#60c8f0',
    keyword: '直感・共感・夢・感受性・芸術性',
    nature: '感受性と共感力に溢れ、目に見えないものを感じ取る直感を持つ芸術家タイプ。人の痛みに寄り添えます。',
    career: 'アート・音楽・福祉・医療・カウンセリング・脚本・写真・ヒーラー',
    timing: '「なんとなく違う」という感覚を大切に。魚座の直感はほとんどの場合、正しいです。',
  },
]

const ELEMENT_COLORS: Record<string, string> = {
  '火': '#f07a30', '土': '#c8952a', '風': '#a898f8', '水': '#60c8f0',
}

export default function TaiyouPage() {
  return (
    <div style={{ background: '#070c1a', color: '#f0f4ff', minHeight: '100dvh', fontFamily: 'var(--font-sans)' }}>
      <Stars />

      {/* HERO */}
      <div style={{ maxWidth: 430, margin: '0 auto', padding: '64px 24px 40px', textAlign: 'center', position: 'relative' }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 80% 60% at 50% 0%, #2a0d4a88, transparent)',
          pointerEvents: 'none',
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-block', fontSize: 9, letterSpacing: 5, color: '#f0c060', border: '1px solid #f0c06055', background: '#f0c0600a', padding: '4px 14px', borderRadius: 2, marginBottom: 20 }}>
            ✦ 太陽星座
          </div>
          <h1 style={{ fontFamily: 'var(--font-mincho)', fontSize: 'clamp(26px,7vw,34px)', fontWeight: 900, lineHeight: 1.2, marginBottom: 12 }}>
            12星座と転職の関係
          </h1>
          <p style={{ fontSize: 13, color: '#8898c8', lineHeight: 2, maxWidth: 340, margin: '0 auto' }}>
            太陽星座はあなたの「表の顔」と行動パターンを示します。<br />
            それぞれの星座が持つ本来の強みを知ることで、<br />
            どんな職場・仕事が本当に合っているかが見えてきます。
          </p>
        </div>
      </div>

      {/* 星座リスト */}
      <div style={{ maxWidth: 430, margin: '0 auto', padding: '0 20px 60px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {ZODIAC_LIST.map((z) => (
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
                    <span style={{ fontFamily: 'var(--font-serif)', fontSize: 18, fontWeight: 700, color: '#f0f4ff' }}>{z.name}</span>
                    <span style={{ fontSize: 10, color: '#7888b8' }}>{z.dates}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <span style={{ fontSize: 10, color: z.elementColor, background: `${z.elementColor}18`, border: `1px solid ${z.elementColor}44`, borderRadius: 4, padding: '1px 8px' }}>{z.element}のグループ</span>
                  </div>
                </div>
              </div>

              {/* キーワード */}
              <div style={{ fontSize: 11, color: z.elementColor, letterSpacing: 1, marginBottom: 8 }}>✦ {z.keyword}</div>

              {/* 特性 */}
              <p style={{ fontSize: 12, color: '#b0bcd8', lineHeight: 1.9, marginBottom: 12 }}>{z.nature}</p>

              {/* 向いている職種 */}
              <div style={{ background: '#111c36', borderRadius: 10, padding: '10px 14px', marginBottom: 10 }}>
                <div style={{ fontSize: 10, color: '#7888b8', marginBottom: 4, letterSpacing: 1 }}>向いている仕事</div>
                <div style={{ fontSize: 12, color: '#dde4f8' }}>{z.career}</div>
              </div>

              {/* タイミング */}
              <div style={{ background: `${z.elementColor}0a`, border: `1px solid ${z.elementColor}33`, borderRadius: 10, padding: '10px 14px' }}>
                <div style={{ fontSize: 10, color: z.elementColor, marginBottom: 4, letterSpacing: 1 }}>🌙 転職タイミングのサイン</div>
                <div style={{ fontSize: 12, color: '#b0bcd8', lineHeight: 1.8 }}>{z.timing}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* フッター */}
      <div style={{ maxWidth: 430, margin: '0 auto', padding: '0 24px 48px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Link href="/shindan" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: 'linear-gradient(135deg, #c8952a, #e0a830)', borderRadius: 10, padding: '14px', fontSize: 13, color: '#1a0c00', textDecoration: 'none', fontWeight: 700 }}>
            ✨ 占いを始める →
          </Link>
          <Link href="/guide/seiyou" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: '#0d1428', border: '1px solid #2a3f72', borderRadius: 10, padding: '12px', fontSize: 12, color: '#a898f8', textDecoration: 'none', fontWeight: 700 }}>
            ← 西洋占星術に戻る
          </Link>
        </div>
      </div>
    </div>
  )
}
