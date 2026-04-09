import type { Metadata } from 'next'
import { Noto_Sans_JP, Shippori_Mincho, Zen_Old_Mincho } from 'next/font/google'
import './globals.css'

const noto = Noto_Sans_JP({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-noto',
  preload: false,
  display: 'swap',
})

const shippori = Shippori_Mincho({
  weight: ['400', '500', '700', '800'],
  subsets: ['latin'],
  variable: '--font-shippori',
  preload: false,
  display: 'swap',
})

const zen = Zen_Old_Mincho({
  weight: ['400', '700', '900'],
  subsets: ['latin'],
  variable: '--font-zen',
  preload: false,
  display: 'swap',
})

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export const metadata: Metadata = {
  title: '転職運命診断 | AI占い師ルナ',
  description:
    '誕生日と5つの質問から、今すぐ転職すべきかを星が答えます。1日1回無料の転職×占い診断。',
  openGraph: {
    title: '転職運命診断 | AI占い師ルナ',
    description: '誕生日と5つの質問から、転職タイミングを星座で鑑定。',
    type: 'website',
    images: [
      {
        url: `${BASE_URL}/api/og`,
        width: 1200,
        height: 630,
        alt: '転職運命診断 | AI占い師ルナ',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '転職運命診断 | AI占い師ルナ',
    description: '誕生日と5つの質問から、転職タイミングを星座で鑑定。',
    images: [`${BASE_URL}/api/og`],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="ja"
      className={`${noto.variable} ${shippori.variable} ${zen.variable}`}
    >
      <body>{children}</body>
    </html>
  )
}
