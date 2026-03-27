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

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'

export const metadata: Metadata = {
  title: '転職精密鑑定 | AI占い師ルナ',
  description:
    '誕生日・月星座・本命星×MBTIで、あなた固有の転職タイミング・向いている職種・3ヶ月アドバイスを鑑定します。',
  openGraph: {
    title: '転職精密鑑定 | AI占い師ルナ',
    description: '太陽星座＋月星座＋本命星×MBTIで深く読み解く、有料の転職精密鑑定。',
    type: 'website',
    images: [
      {
        url: `${BASE_URL}/api/og`,
        width: 1200,
        height: 630,
        alt: '転職精密鑑定 | AI占い師ルナ',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '転職精密鑑定 | AI占い師ルナ',
    description: '太陽星座＋月星座＋本命星×MBTIで深く読み解く精密鑑定。',
    images: [`${BASE_URL}/api/og`],
  },
}

const ZODIAC_IMAGES = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
]

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="ja"
      className={`${noto.variable} ${shippori.variable} ${zen.variable}`}
    >
      <head>
        {ZODIAC_IMAGES.map(name => (
          <link key={name} rel="preload" as="image" href={`/assets/img/${name}.png`} />
        ))}
      </head>
      <body>{children}</body>
    </html>
  )
}
