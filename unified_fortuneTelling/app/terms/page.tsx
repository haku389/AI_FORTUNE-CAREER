import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '利用規約 | キャリア未来鑑定士 白石玲子',
  description: '転職運命診断（career-uranai.site）の利用規約です。',
}

const pageStyle: React.CSSProperties = {
  maxWidth: 720,
  margin: '0 auto',
  padding: '48px 20px 80px',
}

const h2Style: React.CSSProperties = {
  fontFamily: 'var(--font-mincho)',
  fontSize: 17,
  fontWeight: 700,
  color: '#f0c060',
  marginTop: 36,
  marginBottom: 12,
}

const pStyle: React.CSSProperties = {
  fontSize: 13,
  color: '#dde4f8',
  lineHeight: 1.9,
  marginBottom: 10,
}

const liStyle: React.CSSProperties = {
  fontSize: 13,
  color: '#dde4f8',
  lineHeight: 1.9,
  marginBottom: 6,
}

export default function TermsPage() {
  return (
    <div style={{ background: '#060914', minHeight: '100dvh', color: '#dde4f8' }}>
      <div style={pageStyle}>
        <div style={{ fontSize: 11, letterSpacing: 4, color: '#c8952a', marginBottom: 8 }}>✦ TERMS OF SERVICE</div>
        <h1 style={{ fontFamily: 'var(--font-mincho)', fontSize: 24, fontWeight: 900, color: '#f0f4ff', marginBottom: 8 }}>
          利用規約
        </h1>
        <p style={{ fontSize: 12, color: '#7888b8', marginBottom: 24 }}>制定日：2026年7月20日</p>

        <p style={pStyle}>
          本利用規約（以下「本規約」といいます）は、白石玲子キャリア診断運営事務局（以下「当事務局」といいます）が提供する「転職運命診断」（career-uranai.site、以下「本サービス」といいます）のご利用条件を定めるものです。本サービスをご利用いただいた時点で、本規約に同意いただいたものとみなします。
        </p>

        <h2 style={h2Style}>第1条（サービス内容）</h2>
        <p style={pStyle}>
          本サービスは、生年月日や質問への回答をもとに、星座・九星気学・MBTI等の要素を組み合わせた占い・診断コンテンツを提供するものです。本サービスが提供する診断結果、鑑定文、アドバイス等（以下「診断結果等」）は、娯楽・参考情報としての提供を目的としており、転職・キャリアに関する専門的な助言、心理カウンセリング、あるいは結果を保証するものではありません。
        </p>

        <h2 style={h2Style}>第2条（LINE連携）</h2>
        <p style={pStyle}>
          精密診断のご利用にはLINEアカウントによるログインが必要です。LINE連携をされた場合、診断結果の送付や、診断内容にもとづく情報を目的として、当事務局のLINE公式アカウントからメッセージ（定期配信を含みます）をお送りすることがあります。配信の停止をご希望の場合は、LINE公式アカウントのブロックまたは友だち解除により、いつでも配信を停止いただけます。
        </p>

        <h2 style={h2Style}>第3条（禁止事項）</h2>
        <p style={pStyle}>本サービスのご利用にあたり、以下の行為を禁止します。</p>
        <ul style={{ paddingLeft: 20, marginBottom: 10 }}>
          <li style={liStyle}>虚偽の情報を入力する行為</li>
          <li style={liStyle}>他者になりすまして本サービスを利用する行為</li>
          <li style={liStyle}>不正アクセス、その他本サービスの運営を妨害する行為</li>
          <li style={liStyle}>診断結果等を、当事務局に無断で複製・転載・商用利用する行為</li>
          <li style={liStyle}>その他、法令または公序良俗に反する行為</li>
        </ul>

        <h2 style={h2Style}>第4条（広告について）</h2>
        <p style={pStyle}>
          本サービスには、提携する広告主・ASP（アフィリエイトサービスプロバイダ）事業者へのリンク（アフィリエイト広告を含みます）が含まれる場合があります。広告を含むコンテンツには、その旨（【PR】表記等）を表示します。これらのリンク先の内容・取引条件・お問い合わせ対応等については、各リンク先事業者の責任において提供されるものであり、当事務局は一切の責任を負いません。
        </p>

        <h2 style={h2Style}>第5条（知的財産権）</h2>
        <p style={pStyle}>
          本サービス上のコンテンツ（文章、キャラクター設定、デザイン等）に関する知的財産権は、当事務局または正当な権利を有する第三者に帰属します。当事務局の事前の許諾なく、これらを複製、転載、改変、販売等することを禁止します。
        </p>

        <h2 style={h2Style}>第6条（免責事項）</h2>
        <ul style={{ paddingLeft: 20, marginBottom: 10 }}>
          <li style={liStyle}>診断結果等は娯楽・参考情報であり、その正確性・完全性・特定の目的への適合性を保証するものではありません。</li>
          <li style={liStyle}>診断結果等を参考にした利用者の判断・行動（転職活動を含みます）により生じた損害について、当事務局は一切の責任を負いません。</li>
          <li style={liStyle}>本サービスは、システムの保守、障害、その他やむを得ない事情により、予告なく一時停止・中断・終了する場合があります。</li>
          <li style={liStyle}>当事務局は、本サービスの利用に関連して利用者に生じた損害について、当事務局に故意または重過失がある場合を除き、責任を負わないものとします。</li>
        </ul>

        <h2 style={h2Style}>第7条（サービス内容の変更・終了）</h2>
        <p style={pStyle}>
          当事務局は、利用者への事前の通知なく、本サービスの内容を変更し、または本サービスの提供を終了することができるものとします。
        </p>

        <h2 style={h2Style}>第8条（本規約の変更）</h2>
        <p style={pStyle}>
          当事務局は、必要と判断した場合、利用者への事前の通知なく本規約を変更できるものとします。変更後の規約は、本サービス上に掲載した時点から効力を生じるものとします。
        </p>

        <h2 style={h2Style}>第9条（準拠法・管轄）</h2>
        <p style={pStyle}>
          本規約の解釈にあたっては、日本法を準拠法とします。本サービスに関して紛争が生じた場合には、当事務局の所在地を管轄する裁判所を第一審の専属的合意管轄裁判所とします。
        </p>

        <h2 style={h2Style}>第10条（お問い合わせ）</h2>
        <p style={pStyle}>
          本規約に関するお問い合わせは、下記までお願いいたします。<br />
          白石玲子キャリア診断運営事務局<br />
          メールアドレス：luna.aicareeruranai@gmail.com
        </p>

        <div style={{ marginTop: 40, textAlign: 'center' }}>
          <a href="/" style={{ fontSize: 12, color: '#a898f8', textDecoration: 'underline', textUnderlineOffset: 3 }}>
            ← トップへ戻る
          </a>
        </div>
      </div>
    </div>
  )
}
