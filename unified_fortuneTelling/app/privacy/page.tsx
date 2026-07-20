import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'プライバシーポリシー | キャリア未来鑑定士 白石玲子',
  description: '転職運命診断（career-uranai.site）のプライバシーポリシーです。',
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

export default function PrivacyPage() {
  return (
    <div style={{ background: '#060914', minHeight: '100dvh', color: '#dde4f8' }}>
      <div style={pageStyle}>
        <div style={{ fontSize: 11, letterSpacing: 4, color: '#c8952a', marginBottom: 8 }}>✦ PRIVACY POLICY</div>
        <h1 style={{ fontFamily: 'var(--font-mincho)', fontSize: 24, fontWeight: 900, color: '#f0f4ff', marginBottom: 8 }}>
          プライバシーポリシー
        </h1>
        <p style={{ fontSize: 12, color: '#7888b8', marginBottom: 24 }}>制定日：2026年7月20日</p>

        <p style={pStyle}>
          白石玲子キャリア診断運営事務局（以下「当事務局」といいます）は、当事務局が運営する「転職運命診断」（career-uranai.site、以下「本サービス」といいます）における、利用者の個人情報の取り扱いについて、以下のとおりプライバシーポリシー（以下「本ポリシー」といいます）を定めます。
        </p>

        <h2 style={h2Style}>1. 事業者情報</h2>
        <p style={pStyle}>
          名称：白石玲子キャリア診断運営事務局<br />
          お問い合わせ先：luna.aicareeruranai@gmail.com
        </p>

        <h2 style={h2Style}>2. 取得する情報</h2>
        <p style={pStyle}>本サービスでは、ご利用の範囲に応じて以下の情報を取得します。</p>
        <p style={{ ...pStyle, fontWeight: 700, marginBottom: 4 }}>簡易診断をご利用の場合</p>
        <ul style={{ paddingLeft: 20, marginBottom: 10 }}>
          <li style={liStyle}>ニックネーム（自己申告のお名前・呼び名）</li>
          <li style={liStyle}>性別</li>
          <li style={liStyle}>生年月日（および、そこから算出した年齢）</li>
        </ul>
        <p style={{ ...pStyle, fontWeight: 700, marginBottom: 4 }}>精密診断をご利用の場合（上記に加えて）</p>
        <ul style={{ paddingLeft: 20, marginBottom: 10 }}>
          <li style={liStyle}>生まれた時間（任意でご入力いただく場合）</li>
          <li style={liStyle}>MBTIタイプ、および全27問の質問への回答内容（現在の職場に関するお悩み、転職理由、希望する業界・職種・勤務地、現在の年収帯などを含みます）</li>
          <li style={liStyle}>LINEでログインされた場合、LINEのプロフィール情報（ユーザーID・表示名・プロフィール画像）。メールアドレスや電話番号などは取得しません。</li>
        </ul>
        <p style={{ ...pStyle, fontWeight: 700, marginBottom: 4 }}>本サービスを閲覧される場合（共通）</p>
        <ul style={{ paddingLeft: 20, marginBottom: 10 }}>
          <li style={liStyle}>Googleアナリティクスによるアクセス解析情報（閲覧ページ、滞在時間、広告リンクのクリックなど）</li>
          <li style={liStyle}>記事の閲覧状況（記事ごとの表示・スクロール・滞在時間。特定の個人を識別する情報とは紐づけていません）</li>
        </ul>

        <h2 style={h2Style}>3. 利用目的</h2>
        <p style={pStyle}>取得した情報は、以下の目的で利用します。</p>
        <ul style={{ paddingLeft: 20, marginBottom: 10 }}>
          <li style={liStyle}>占い・診断結果（鑑定文、転職スコア、おすすめの職種・業界等）を生成し、お届けするため</li>
          <li style={liStyle}>LINE連携をされた方に、診断結果および診断内容にもとづく転職・キャリア関連情報を、LINEメッセージにて個別にお送りするため（診断直後の個別送信のほか、登録者の皆さまへ<strong>毎週定期的な配信</strong>を行う場合があります）</li>
          <li style={liStyle}>診断結果に応じたおすすめの転職エージェント情報を表示するため</li>
          <li style={liStyle}>本サービスの品質改善、コンテンツの検討・分析のため</li>
          <li style={liStyle}>不正利用の防止のため</li>
        </ul>
        <p style={pStyle}>
          LINEでの定期配信を停止されたい場合は、LINE公式アカウントをブロックまたは友だち解除していただくことで、以後のメッセージ配信を停止できます。
        </p>

        <h2 style={h2Style}>4. 第三者への提供・業務委託について</h2>
        <p style={pStyle}>
          当事務局は、取得した情報を、法令に基づく場合を除き、ご本人の同意なく第三者に販売・提供することはありません。一方で、本サービスの提供にあたり、以下の外部サービスを利用しており、必要な範囲でこれらの事業者に情報を取り扱わせています。
        </p>
        <ul style={{ paddingLeft: 20, marginBottom: 10 }}>
          <li style={liStyle}><strong>Supabase</strong>（データベース）：診断結果等のデータの保管に利用しています。データは日本国内リージョンで保管されています。</li>
          <li style={liStyle}><strong>Anthropic, PBC</strong>（AIサービス）：鑑定文の自動生成のために利用しています。送信するのはニックネーム、星座・本命星・MBTIタイプ、転職スコア、向いている職種など診断結果の一部のみで、生年月日・性別・生まれた時間・各質問への回答内容そのものは送信していません。</li>
          <li style={liStyle}><strong>LINE株式会社</strong>：LINEログインおよびLINEメッセージ配信のために利用しています。</li>
          <li style={liStyle}><strong>Google Analytics（Google LLC）</strong>：アクセス解析のために利用しています。</li>
          <li style={liStyle}><strong>提携アフィリエイト広告主・ASP事業者</strong>：本サービスに掲載するおすすめの転職エージェント等の広告リンクを経由して外部サイトに遷移された場合、遷移先の事業者において別途情報が取得されることがあります。これは遷移先事業者のプライバシーポリシーに基づくものであり、当事務局が関与するものではありません。</li>
        </ul>

        <h2 style={h2Style}>5. Cookie（クッキー）について</h2>
        <p style={pStyle}>
          本サービスでは、LINEログイン状態を保持するため、LINEのプロフィール情報を含むCookieを利用者のブラウザに保存します（保存期間：7日間）。また、Googleアナリティクスによるアクセス解析のためにCookieを利用しています。ブラウザの設定によりCookieの受け入れを拒否することも可能ですが、その場合、LINEログインを要する機能がご利用いただけなくなります。
        </p>

        <h2 style={h2Style}>6. 診断結果ページの取り扱いについて</h2>
        <p style={pStyle}>
          精密診断の結果は、固有のURLが発行されるページに表示されます。このURLはログイン等の認証を必要としないため、URLを知っている第三者が結果を閲覧できる可能性があります。第三者と共有したくない場合は、URLを他者に伝えないようご注意ください。
        </p>

        <h2 style={h2Style}>7. 個人情報の開示・訂正・削除等について</h2>
        <p style={pStyle}>
          ご自身の情報の開示、訂正、削除、利用停止等をご希望される場合は、下記お問い合わせ先までご連絡ください。ご本人であることを確認のうえ、合理的な範囲で速やかに対応いたします。
        </p>

        <h2 style={h2Style}>8. 本ポリシーの変更について</h2>
        <p style={pStyle}>
          本ポリシーの内容は、法令の変更やサービス内容の変更等に応じて、予告なく改定される場合があります。重要な変更を行う場合は、本サービス上でお知らせします。
        </p>

        <h2 style={h2Style}>9. お問い合わせ窓口</h2>
        <p style={pStyle}>
          本ポリシーに関するお問い合わせは、下記までお願いいたします。<br />
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
