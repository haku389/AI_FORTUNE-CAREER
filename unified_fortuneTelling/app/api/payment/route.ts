import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const PRICE = 1980 // ¥1980

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

  try {
    const body = await req.json()
    const { nickname } = body

    const paymentIntent = await stripe.paymentIntents.create({
      amount: PRICE,
      currency: 'jpy',
      automatic_payment_methods: { enabled: true },
      metadata: {
        nickname: nickname ?? '',
        product: '転職精密鑑定',
      },
    })

    return NextResponse.json({ clientSecret: paymentIntent.client_secret })
  } catch (err) {
    console.error('[/api/payment] error:', err)
    return NextResponse.json({ error: '決済の初期化に失敗しました' }, { status: 500 })
  }
}
