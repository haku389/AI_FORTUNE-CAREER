'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Stars from '@/components/Stars'
import MoonImage from '@/components/MoonImage'
import ShareBlock from '@/components/result/ShareBlock'
import Image from 'next/image'
import * as LucideIcons from 'lucide-react'
import { trackEvent } from '@/lib/gtag'
import { getZodiac, ZodiacInfo } from '@/lib/zodiac'
import { getMoonSign, getMoonSignKeyword } from '@/lib/moonSign'
import { getHonmeiStar, getHonmeiStarKeyword, HonmeiStar } from '@/lib/honmeiStar'
import { QUESTIONS, BLOCKS } from '@/lib/precise-questions'
import { calcPreciseScore, TIMINGS, PreciseScoreResult } from '@/lib/precise-scoring'
import { calcJobMatch, JobMatch, IndustryMatch, AgentMatch } from '@/lib/jobMatch'
import { calcMonthlyAdvice, MonthAdvice } from '@/lib/monthlyAdvice'
import { getPreciseKansen } from '@/lib/precise-kansen'

/* ─── Types ─── */
type Step = 'input' | 'questions' | 'loading' | 'result'

type UserData = {
  nickname: string
  year: number
  month: number
  day: number
  birthtime: string
  sunSign: ZodiacInfo
  moonSign: string
  moonKeyword: string
  honmeiStar: HonmeiStar
  honmeiKeyword: string
  mbti: string
}

type PreciseResult = {
  userData: UserData
  scoreResult: PreciseScoreResult
  topJobs: JobMatch[]
  topIndustries: IndustryMatch[]
  agents: AgentMatch[]
  monthlyAdvice: MonthAdvice[]
  kansenText: string
  paymentIntentId: string
}

/* ─── Helpers ─── */
const LOAD_STEPS = ['星座の位置を確認', '月と本命星を読み取り', '転職運を精密計算', 'MBTIとの相性を分析', '天の声を言葉に降ろしています']

function pad2(n: number) {
  return String(n).padStart(2, '0')
}

/* ─── Lucide Icon Helper ─── */
type LIcon = React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>
function QIcon({ name, picked, size = 18 }: { name: string; picked: boolean; size?: number }) {
  const Icon = (LucideIcons as Record<string, unknown>)[name] as LIcon | undefined
  if (!Icon) return null
  return <Icon size={size} color={picked ? '#f0c060' : '#a898f8'} strokeWidth={1.5} />
}

/* ─── Main Component ─── */
export default function PrecisePage() {
  const [step, setStep] = useState<Step>('input')

  // input state
  const [nickname, setNickname] = useState('')
  const [gender, setGender] = useState('')
  const [year, setYear] = useState(0)
  const [month, setMonth] = useState(0)
  const [day, setDay] = useState(0)
  const [birthtime, setBirthtime] = useState('')
  const [sunSign, setSunSign] = useState<ZodiacInfo | null>(null)

  // questions state
  const [curQ, setCurQ] = useState(0)
  const [answers, setAnswers] = useState<(number | number[])[]>([])

  // loading state
  const [loadActiveStep, setLoadActiveStep] = useState(-1)
  const [loadText, setLoadText] = useState('星の声を聞いています')
  const [loadPct, setLoadPct] = useState(0)
  const loadPctRef = useRef(0)
  const loadTargetRef = useRef(0)

  useEffect(() => {
    const target = loadActiveStep < 0 ? 0 : Math.min(95, Math.round(((loadActiveStep + 1) / LOAD_STEPS.length) * 100))
    loadTargetRef.current = target
  }, [loadActiveStep])

  useEffect(() => {
    if (step !== 'loading') { loadPctRef.current = 0; setLoadPct(0); return }
    const iv = setInterval(() => {
      if (loadPctRef.current < loadTargetRef.current) {
        loadPctRef.current += 1
        setLoadPct(loadPctRef.current)
      }
    }, 35)
    return () => clearInterval(iv)
  }, [step])

  // result state
  const [result, setResult] = useState<PreciseResult | null>(null)
  const [resultId, setResultId] = useState<string | null>(null)

  // LINE state
  const [lineUserId, setLineUserId] = useState<string | null>(null)
  const [lineDisplayName, setLineDisplayName] = useState<string | null>(null)
  const [linePictureUrl, setLinePictureUrl] = useState<string | null>(null)
  const [lineSent, setLineSent] = useState(false)
  const [lineErrorMsg, setLineErrorMsg] = useState<string | null>(null)
  const [lineSendError, setLineSendError] = useState<string | null>(null)
  // stale closure 対策: 常に最新のlineUserIdを参照できるref
  const lineUserIdRef = useRef<string | null>(null)
  useEffect(() => { lineUserIdRef.current = lineUserId }, [lineUserId])

  /* ── LINE プロフィール取得（サーバーAPI経由でcookieを読む）── */
  useEffect(() => {
    fetch('/api/line/profile')
      .then(r => r.json())
      .then((d: { connected: boolean; userId?: string; displayName?: string; pictureUrl?: string }) => {
        if (d.connected && d.userId) {
          setLineUserId(d.userId)
          setLineDisplayName(d.displayName ?? null)
          setLinePictureUrl(d.pictureUrl ?? null)
        }
      })
      .catch(() => {})

    // URLパラメータ確認（useSearchParams不要・window.location使用）
    const urlParams = new URLSearchParams(window.location.search)
    const err = urlParams.get('line_error')
    if (err) {
      const msgs: Record<string, string> = {
        config: 'サーバー設定エラーです。管理者にお問い合わせください。',
        missing_params: 'LINEからの応答が不正です。再度お試しください。',
        state_mismatch: '認証セッションが切れました。再度お試しください。',
        token_failed: 'LINEとの認証に失敗しました。再度お試しください。',
        profile_failed: 'LINEプロフィールの取得に失敗しました。再度お試しください。',
        access_denied: 'LINEログインがキャンセルされました。',
      }
      setLineErrorMsg(msgs[err] ?? `LINEログインでエラーが発生しました（${err}）`)
      window.history.replaceState({}, '', '/premium/form')
    }
  }, [])

  /* ── Zodiac update when birthday changes ── */
  useEffect(() => {
    if (month && day) setSunSign(getZodiac(month, day))
    else setSunSign(null)
  }, [month, day])

  /* ── Input: start quiz ── */
  const handleStartQuiz = () => {
    if (!nickname || !gender || !year || !month || !day) return
    setCurQ(0)
    setAnswers([])
    setStep('questions')
  }

  /* ── Questions ── */
  const currentQ = QUESTIONS[curQ]
  const isMulti = currentQ?.multi ?? false

  const pickSingle = (optIdx: number) => {
    setAnswers(prev => {
      const next = [...prev]
      next[curQ] = optIdx
      return next
    })
  }

  const toggleMulti = (optIdx: number) => {
    setAnswers(prev => {
      const next = [...prev]
      const current = Array.isArray(next[curQ]) ? (next[curQ] as number[]) : []
      if (current.includes(optIdx)) {
        next[curQ] = current.filter(i => i !== optIdx)
      } else {
        next[curQ] = [...current, optIdx]
      }
      return next
    })
  }

  const isAnswered = (i: number): boolean => {
    const ans = answers[i]
    if (ans === undefined || ans === null) return false
    if (Array.isArray(ans)) return ans.length > 0
    return true
  }

  const nextQ = () => {
    if (!isAnswered(curQ)) return
    if (curQ < QUESTIONS.length - 1) {
      setCurQ(q => q + 1)
    } else {
      startLoading()
    }
  }

  const prevQ = () => {
    if (curQ > 0) setCurQ(q => q - 1)
  }

  /* ── Loading ── */
  const startLoading = () => {
    if (!sunSign) return
    setLoadActiveStep(-1)
    setLoadText('星の声を聞いています')
    setStep('loading')

    // 星データ計算
    const moonSignVal = getMoonSign(year, month, day, birthtime || undefined)
    const moonKeywordVal = getMoonSignKeyword(moonSignVal)
    const honmeiStarVal = getHonmeiStar(year, month, day)
    const honmeiKeywordVal = getHonmeiStarKeyword(honmeiStarVal)

    // MBTI・motivation・roles・industriesを回答から抽出
    const mbti = (typeof answers[4] === 'number' ? QUESTIONS[4].opts[answers[4]]?.s?.mbti : null) ?? 'unknown'

    const userData: UserData = {
      nickname,
      year, month, day, birthtime,
      sunSign,
      moonSign: moonSignVal,
      moonKeyword: moonKeywordVal,
      honmeiStar: honmeiStarVal,
      honmeiKeyword: honmeiKeywordVal,
      mbti,
    }

    // スコア計算
    const scoreResult = calcPreciseScore(answers)
    const motivation = (typeof answers[5] === 'number' ? QUESTIONS[5].opts[answers[5]]?.s?.motivation : null) ?? 'achievement'
    const roles = Array.isArray(answers[12]) ? (answers[12] as number[]).map(i => QUESTIONS[12].opts[i]?.s?.role ?? '') : typeof answers[12] === 'number' ? [QUESTIONS[12].opts[answers[12]]?.s?.role ?? ''] : []
    const industries = Array.isArray(answers[11]) ? (answers[11] as number[]).map(i => QUESTIONS[11].opts[i]?.s?.industry ?? '') : typeof answers[11] === 'number' ? [QUESTIONS[11].opts[answers[11]]?.s?.industry ?? ''] : []

    const { topJobs, topIndustries, agents } = calcJobMatch(mbti, motivation, roles, industries, sunSign?.name, moonSignVal, honmeiStarVal)

    // AI鑑定文 & AI3ヶ月アドバイスをバックグラウンドで並列取得
    const kansenPromise = fetch('/api/precise-kansen', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nickname,
        sunSign: sunSign.name,
        sunKeyword: sunSign.keyword,
        moonSign: moonSignVal,
        moonKeyword: moonKeywordVal,
        honmeiStar: honmeiStarVal,
        honmeiKeyword: honmeiKeywordVal,
        mbti,
        score: scoreResult.score_total,
        timing: scoreResult.timing,
        topJob: topJobs[0]?.job ?? '',
      }),
    })
      .then(r => r.json())
      .then(d => (d.text as string) || null)
      .catch(() => null)

    const advicePromise = fetch('/api/precise-advice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nickname,
        sunSign: sunSign.name,
        moonSign: moonSignVal,
        honmeiStar: honmeiStarVal,
        mbti,
        timing: scoreResult.timing,
      }),
    })
      .then(r => r.json())
      .then(d => d.advice ?? null)
      .catch(() => null)

    let i = 0
    const interval = setInterval(() => {
      setLoadActiveStep(i)
      i++
      if (i >= LOAD_STEPS.length) {
        clearInterval(interval)
        setTimeout(() => {
          setLoadText('鑑定結果を確認しています…')
          setTimeout(async () => {
            const [aiText, aiAdvice] = await Promise.all([kansenPromise, advicePromise])
            const kansenText = aiText ?? getPreciseKansen(sunSign, nickname)
            const monthlyAdvice = aiAdvice ?? calcMonthlyAdvice(scoreResult.timing)

            const full: PreciseResult = {
              userData,
              scoreResult,
              topJobs,
              topIndustries,
              agents,
              monthlyAdvice,
              kansenText,
              paymentIntentId: '',
            }

            setResult(full)
            setStep('result')

            // Supabase保存（IDを取得してLINE送信に使用）
            fetch('/api/precise-diagnose', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                nickname,
                gender,
                birthday: `${year}-${pad2(month)}-${pad2(day)}`,
                birthtime: birthtime || null,
                zodiac_sun: sunSign.name,
                zodiac_moon: moonSignVal,
                honmei_star: honmeiStarVal,
                mbti_type: mbti,
                answers: answers.reduce<Record<string, unknown>>((acc, ans, idx) => {
                  acc[`q${idx}`] = ans
                  return acc
                }, {}),
                score_total: scoreResult.score_total,
                score_timing: scoreResult.score_timing,
                score_readiness: scoreResult.score_readiness,
                score_market: scoreResult.score_market,
                top_jobs: topJobs,
                top_industries: topIndustries,
                monthly_advice: monthlyAdvice,
                kansen_text: kansenText,
                recommended_agents: agents,
                payment_id: null,
                amount: 0,
                line_user_id: lineUserIdRef.current ?? undefined,
              }),
            }).then(r => r.json()).then(d => {
              if (d.error) {
                console.error('[precise-diagnose] API error:', d.error)
                return
              }
              const savedId: string = d.id
              setResultId(savedId)

              // LINE送信（LINEログイン済みの場合）
              const currentLineUserId = lineUserIdRef.current
              if (currentLineUserId && savedId) {
                const baseUrl = window.location.origin
                const resultUrl = `${baseUrl}/premium/result/${savedId}`
                fetch('/api/line/send', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    userId: currentLineUserId,
                    nickname,
                    score: scoreResult.score_total,
                    timing: scoreResult.timing,
                    resultUrl,
                  }),
                }).then(r => r.json()).then(res => {
                  if (res.ok) {
                    setLineSent(true)
                  } else {
                    const detail = res.detail ? JSON.parse(res.detail) : {}
                    const msg = detail.message ?? res.error ?? 'unknown error'
                    setLineSendError(`LINE APIエラー [${res.status ?? '?'}]: ${msg}`)
                    console.error('[LINE send] failed:', res)
                  }
                }).catch(e => {
                  setLineSendError(`通信エラー: ${e}`)
                  console.error('[LINE send] fetch error:', e)
                })
              }
            }).catch(e => console.error('[precise-diagnose] fetch error:', e))
          }, 2000)
        }, 600)
      }
    }, 2400)
  }

  /* ─── Shared Styles ─── */
  const pageStyle: React.CSSProperties = {
    position: 'relative',
    zIndex: 1,
    minHeight: '100dvh',
    maxWidth: 430,
    margin: '0 auto',
    padding: '28px 18px 52px',
    display: 'flex',
    flexDirection: 'column',
  }

  const cardStyle: React.CSSProperties = {
    background: '#0d1428',
    border: '1px solid #2a3f72',
    borderRadius: 16,
    padding: '20px 18px',
    marginBottom: 12,
  }

  const years: number[] = []
  const cur = new Date().getFullYear()
  for (let y = cur - 18; y >= 1960; y--) years.push(y)

  /* ══════════════════════════════════════
     INPUT
  ══════════════════════════════════════ */
  if (step === 'input') return (
    <div style={{ background: '#060914', minHeight: '100dvh' }}>
      <Stars />
      <div style={{ ...pageStyle, justifyContent: 'center' }}>

        {lineErrorMsg && (
          <div style={{ background: '#1a0d0d', border: '1px solid #d4607a44', borderRadius: 10, padding: '10px 14px', marginBottom: 10, fontSize: 12, color: '#d4607a' }}>
            ⚠️ {lineErrorMsg}
          </div>
        )}

        {/* ── LINEログイン前: ログイン画面のみ表示 ── */}
        {!lineUserId ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
            <Image src="/assets/img/luna_mainIcon.png" alt="ルナ" width={96} height={96} style={{ borderRadius: '50%', marginBottom: 20, filter: 'drop-shadow(0 0 18px #a898f855)' }} />
            <div style={{ fontFamily: 'var(--font-mincho)', fontSize: 22, fontWeight: 900, color: '#f0f4ff', marginBottom: 8, textAlign: 'center' }}>
              転職占い師ルナの精密鑑定
            </div>
            <div style={{ fontSize: 12, color: '#7888b8', textAlign: 'center', lineHeight: 1.8, marginBottom: 24 }}>
              精密鑑定を受けるには下記の2ステップが必要です。
            </div>

            {/* STEP 1: 友だち追加 */}
            <div style={{ width: '100%', marginBottom: 12 }}>
              <div style={{ fontSize: 10, color: '#a898f8', letterSpacing: 2, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ background: '#a898f8', color: '#060914', borderRadius: '50%', width: 18, height: 18, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 11, flexShrink: 0 }}>1</span>
                まずルナを友だち追加する（LINEアプリが開きます）
              </div>
              <a
                href="https://lin.ee/Q0U8U3a"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  background: '#06c755', borderRadius: 12, padding: '15px 24px',
                  color: '#fff', fontSize: 15, fontWeight: 700, textDecoration: 'none',
                  letterSpacing: 0.5, width: '100%', boxSizing: 'border-box',
                  boxShadow: '0 4px 20px #06c75544',
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" /></svg>
                LINEで友だち追加する
              </a>
            </div>

            {/* 矢印 */}
            <div style={{ color: '#3a4870', fontSize: 20, marginBottom: 12 }}>↓</div>

            {/* STEP 2: LINEログイン */}
            <div style={{ width: '100%', marginBottom: 8 }}>
              <div style={{ fontSize: 10, color: '#c8952a', letterSpacing: 2, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ background: '#c8952a', color: '#060914', borderRadius: '50%', width: 18, height: 18, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 11, flexShrink: 0 }}>2</span>
                友だち追加後、LINEでログインして認証する
              </div>
              <a
                href="/api/line/login"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  background: 'linear-gradient(135deg, #1a2040, #0d1428)',
                  border: '1px solid #06c75566',
                  borderRadius: 12, padding: '15px 24px',
                  color: '#fff', fontSize: 15, fontWeight: 700, textDecoration: 'none',
                  letterSpacing: 0.5, width: '100%', boxSizing: 'border-box',
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#06c755"><path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" /></svg>
                LINEでログインして認証する
              </a>
            </div>
            <div style={{ fontSize: 10, color: '#3a4870', textAlign: 'center', lineHeight: 1.7 }}>
              ※ 友だち追加後にこのページに戻り、ログインしてください
            </div>
          </div>
        ) : (
          <>
            {/* ── LINEログイン済み: 連携済みバナー + フォーム ── */}
            <div style={{ background: '#0d1e14', border: '1px solid #06c75533', borderRadius: 12, padding: '12px 16px', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
              {linePictureUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={linePictureUrl} alt="LINE" width={36} height={36} style={{ borderRadius: '50%', border: '1px solid #06c755', flexShrink: 0 }} />
              )}
              <div>
                <div style={{ fontSize: 12, color: '#06c755', fontWeight: 700 }}>LINEアカウント連携済み ✓</div>
                <div style={{ fontSize: 11, color: '#7888b8' }}>{lineDisplayName}さん・鑑定結果をLINEでお届けします</div>
              </div>
            </div>

            <div style={cardStyle}>
              <h2 style={{ fontFamily: 'var(--font-mincho)', fontSize: 20, fontWeight: 700, textAlign: 'center', marginBottom: 6, color: '#f0f4ff' }}>
                あなたの星を深く読む
              </h2>
              <p style={{ fontSize: 12, color: '#7888b8', textAlign: 'center', marginBottom: 24 }}>
                誕生日・ニックネームを入力してください
              </p>

              {/* ニックネーム */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 11, letterSpacing: 2, color: '#c8952a', marginBottom: 8 }}>
                  ✦ ニックネーム
                </label>
                <input
                  type="text"
                  value={nickname}
                  onChange={e => setNickname(e.target.value)}
                  placeholder="普段呼ばれているお名前"
                  maxLength={10}
                  style={{
                    width: '100%',
                    background: '#111c36',
                    border: `1px solid ${nickname ? '#c8952a' : '#2a3f72'}`,
                    borderRadius: 8,
                    padding: '14px 16px',
                    color: '#f0f4ff',
                    fontSize: 16,
                    fontFamily: 'var(--font-sans)',
                    outline: 'none',
                    transition: 'border-color .2s',
                  }}
                />
              </div>

              {/* 生年月日 */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 11, letterSpacing: 2, color: '#c8952a', marginBottom: 8 }}>
                  ✦ 誕生日
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                  <select
                    value={year || ''}
                    onChange={e => setYear(Number(e.target.value))}
                    style={{ width: '100%', background: '#111c36', border: `1px solid ${year ? '#c8952a' : '#2a3f72'}`, borderRadius: 8, padding: '13px 10px', color: year ? '#f0f4ff' : '#3a4870', fontSize: 14, fontFamily: 'var(--font-sans)', outline: 'none', cursor: 'pointer', textAlign: 'center' }}
                  >
                    <option value="">年</option>
                    {years.map(y => <option key={y} value={y}>{y}年</option>)}
                  </select>
                  <select
                    value={month || ''}
                    onChange={e => setMonth(Number(e.target.value))}
                    style={{ width: '100%', background: '#111c36', border: `1px solid ${month ? '#c8952a' : '#2a3f72'}`, borderRadius: 8, padding: '13px 10px', color: month ? '#f0f4ff' : '#3a4870', fontSize: 14, fontFamily: 'var(--font-sans)', outline: 'none', cursor: 'pointer', textAlign: 'center' }}
                  >
                    <option value="">月</option>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(m => <option key={m} value={m}>{m}月</option>)}
                  </select>
                  <select
                    value={day || ''}
                    onChange={e => setDay(Number(e.target.value))}
                    style={{ width: '100%', background: '#111c36', border: `1px solid ${day ? '#c8952a' : '#2a3f72'}`, borderRadius: 8, padding: '13px 10px', color: day ? '#f0f4ff' : '#3a4870', fontSize: 14, fontFamily: 'var(--font-sans)', outline: 'none', cursor: 'pointer', textAlign: 'center' }}
                  >
                    <option value="">日</option>
                    {Array.from({ length: 31 }, (_, i) => i + 1).map(d => <option key={d} value={d}>{d}日</option>)}
                  </select>
                </div>

                {/* 星座表示 */}
                {sunSign && (
                  <div style={{ marginTop: 12, padding: '14px', background: 'linear-gradient(135deg, #1a1830, #0d1428)', border: '1px solid #7c6bdc', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 16, animation: 'fade-in .4s ease', width: '100%', boxSizing: 'border-box' }}>
                    <Image src={`/assets/img/${sunSign.en}.png`} alt={sunSign.name} width={52} height={52} style={{ objectFit: 'contain', flexShrink: 0 }} priority />
                    <div>
                      <strong style={{ color: '#a898f8', display: 'block', fontSize: 14 }}>{sunSign.name}</strong>
                      <span style={{ fontSize: 11, color: '#7888b8' }}>{sunSign.keyword}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* 出生時間（任意） */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 11, letterSpacing: 2, color: '#c8952a', marginBottom: 8 }}>
                  ✦ 出生時間（任意）
                  <span style={{ fontSize: 10, color: '#3a4870', marginLeft: 8, letterSpacing: 0 }}>月星座の精度UP</span>
                </label>
                <input
                  type="time"
                  value={birthtime}
                  onChange={e => setBirthtime(e.target.value)}
                  style={{ width: '100%', boxSizing: 'border-box', background: '#111c36', border: '1px solid #2a3f72', borderRadius: 8, padding: '13px 16px', color: birthtime ? '#f0f4ff' : '#3a4870', fontSize: 14, fontFamily: 'var(--font-sans)', outline: 'none', WebkitAppearance: 'none', appearance: 'none' }}
                />
              </div>

              {/* 性別 */}
              <div style={{ marginBottom: 28 }}>
                <label style={{ display: 'block', fontSize: 11, letterSpacing: 2, color: '#c8952a', marginBottom: 8 }}>
                  ✦ 性別
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                  {[{ val: '男性', label: '男性' }, { val: '女性', label: '女性' }, { val: 'その他', label: 'その他' }].map(({ val, label }) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setGender(val)}
                      style={{
                        padding: '12px 0',
                        background: gender === val ? 'linear-gradient(135deg, #c8952a14, #7c6bdc14)' : '#111c36',
                        border: `1px solid ${gender === val ? '#c8952a' : '#2a3f72'}`,
                        borderRadius: 8,
                        color: gender === val ? '#f0f4ff' : '#3a4870',
                        fontSize: 14,
                        fontFamily: 'var(--font-sans)',
                        cursor: 'pointer',
                        transition: 'all .2s',
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleStartQuiz}
                disabled={!nickname || !gender || !year || !month || !day}
                style={{
                  width: '100%', padding: 16,
                  background: 'linear-gradient(135deg, #c8952a, #e0a830)',
                  border: 'none', borderRadius: 12,
                  color: '#1a0c00', fontSize: 15, fontWeight: 700,
                  cursor: (!nickname || !gender || !year || !month || !day) ? 'not-allowed' : 'pointer',
                  opacity: (!nickname || !gender || !year || !month || !day) ? 0.4 : 1,
                  transition: 'opacity .2s', fontFamily: 'var(--font-sans)', letterSpacing: 1,
                }}
              >
                26問の精密診断を始める →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )

  /* ══════════════════════════════════════
     QUESTIONS
  ══════════════════════════════════════ */
  if (step === 'questions') {
    const q = QUESTIONS[curQ]
    const currentBlock = BLOCKS.find(b => b.num === q.block) ?? BLOCKS[0]
    const blockStart = QUESTIONS.findIndex(qq => qq.block === q.block)
    const blockQ = curQ - blockStart + 1
    const totalInBlock = currentBlock.questionCount
    const pct = ((curQ + 1) / QUESTIONS.length) * 100
    const curAnswerIsArray = Array.isArray(answers[curQ])
    const selectedMulti = curAnswerIsArray ? (answers[curQ] as number[]) : []

    return (
      <div style={{ background: '#060914', minHeight: '100dvh' }}>
        <Stars />
        <div style={{ ...pageStyle, justifyContent: 'flex-start', paddingTop: 24 }}>
          {/* プログレスヘッダー */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <Image
              src="/moon.png"
              alt=""
              width={32}
              height={32}
              style={{ flexShrink: 0, filter: 'brightness(1.1) drop-shadow(0 0 8px #c8952a88)' }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 9, letterSpacing: 2, color: '#c8952a', marginBottom: 2 }}>
                BLOCK {q.block} — {currentBlock.title}
              </div>
              <div style={{ height: 3, background: '#1e2d52', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg, #c8952a, #a898f8)', borderRadius: 2, transition: 'width .5s cubic-bezier(.4,0,.2,1)' }} />
              </div>
            </div>
            <div style={{ fontSize: 11, color: '#7888b8', whiteSpace: 'nowrap' }}>
              {curQ + 1} / {QUESTIONS.length}
            </div>
          </div>

          {/* ブロック内進捗 */}
          <div style={{ display: 'flex', gap: 4, marginBottom: 18 }}>
            {Array.from({ length: totalInBlock }, (_, i) => (
              <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i < blockQ ? '#c8952a' : '#1e2d52', transition: 'background .3s' }} />
            ))}
          </div>

          {/* 問題カード */}
          <div style={{ background: '#0d1428', border: '1px solid #2a3f72', borderRadius: 16, padding: '24px 20px', marginBottom: 14, animation: 'q-enter .35s cubic-bezier(.4,0,.2,1)' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 9, letterSpacing: 2, color: '#a898f8', background: '#7c6bdc12', border: '1px solid #7c6bdc33', padding: '3px 10px', borderRadius: 20, marginBottom: 12 }}>
              ✦ {q.tag}
            </div>
            {q.multi && (
              <div style={{ fontSize: 10, color: '#3cc4a8', marginBottom: 8, padding: '4px 10px', background: '#3cc4a814', border: '1px solid #3cc4a833', borderRadius: 6, display: 'inline-block' }}>
                ✓ 複数選択可
              </div>
            )}
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: 17, fontWeight: 700, color: '#f0f4ff', lineHeight: 1.5, marginBottom: 8 }}>
              {q.q}
            </div>
            <div style={{ fontSize: 11, color: '#3a4870', fontStyle: 'italic', marginBottom: 20, lineHeight: 1.6, paddingLeft: 12, borderLeft: '2px solid #c8952a44' }}>
              {q.hint}
            </div>

            {/* 選択肢 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {q.opts.map((opt, i) => {
                // Q13(index 12): 選択業界（Q12回答）に関係ない職種オプションを非表示
                if (curQ === 12 && opt.relatedIndustries && opt.relatedIndustries.length > 0) {
                  const selectedInds: string[] = Array.isArray(answers[11])
                    ? (answers[11] as number[]).map((idx: number) => QUESTIONS[11].opts[idx]?.s?.industry ?? '').filter(Boolean)
                    : []
                  if (selectedInds.length > 0 && !selectedInds.some(ind => opt.relatedIndustries!.includes(ind))) {
                    return null
                  }
                }
                // Q15(index 14): 選択地方（Q14回答）に関係ない都道府県オプションを非表示
                if (curQ === 14 && opt.relatedAreas && opt.relatedAreas.length > 0) {
                  const selectedAreas: string[] = Array.isArray(answers[13])
                    ? (answers[13] as number[]).map((idx: number) => QUESTIONS[13].opts[idx]?.s?.area ?? '').filter(Boolean)
                    : []
                  const hasAny = selectedAreas.includes('any')
                  if (!hasAny && selectedAreas.length > 0 && !selectedAreas.some(area => opt.relatedAreas!.includes(area))) {
                    return null
                  }
                }
                const picked = isMulti
                  ? selectedMulti.includes(i)
                  : answers[curQ] === i
                return (
                  <button
                    key={i}
                    onClick={() => isMulti ? toggleMulti(i) : pickSingle(i)}
                    style={{
                      background: picked ? 'linear-gradient(135deg, #c8952a14, #7c6bdc08)' : '#111c36',
                      border: `1px solid ${picked ? '#c8952a' : '#1e2d52'}`,
                      borderRadius: 10,
                      padding: '12px 14px',
                      cursor: 'pointer',
                      transition: 'all .18s',
                      display: 'flex',
                      gap: 12,
                      alignItems: 'flex-start',
                      textAlign: 'left',
                      width: '100%',
                      fontFamily: 'var(--font-sans)',
                    }}
                  >
                    {isMulti && curQ !== 13 && curQ !== 14
                      ? <span style={{ fontSize: 18, flexShrink: 0, lineHeight: 1.4 }}>{opt.sym}</span>
                      : <span style={{ flexShrink: 0, lineHeight: 1, display: 'flex', alignItems: 'center', alignSelf: 'center' }}><QIcon name={opt.sym} picked={picked} size={18} /></span>
                    }
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, color: picked ? '#f0f4ff' : '#dde4f8', fontWeight: 500, lineHeight: 1.4, marginBottom: 2 }}>
                        {opt.main}
                      </div>
                      <div style={{ fontSize: 10, color: '#3a4870', lineHeight: 1.4 }}>
                        {opt.hint}
                      </div>
                    </div>
                    {isMulti && (
                      <div style={{ width: 18, height: 18, borderRadius: 4, border: `2px solid ${picked ? '#c8952a' : '#2a3f72'}`, background: picked ? '#c8952a' : 'transparent', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .18s' }}>
                        {picked && <span style={{ fontSize: 10, color: '#1a0c00', fontWeight: 900 }}>✓</span>}
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* ナビゲーション */}
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={prevQ}
              style={{ padding: '13px 18px', background: 'transparent', border: '1px solid #2a3f72', borderRadius: 10, color: '#7888b8', fontSize: 13, cursor: 'pointer', opacity: curQ === 0 ? 0.3 : 1, pointerEvents: curQ === 0 ? 'none' : 'auto', fontFamily: 'var(--font-sans)', transition: 'all .2s' }}
            >
              ← 戻る
            </button>
            <button
              onClick={nextQ}
              disabled={!isAnswered(curQ)}
              style={{ flex: 1, padding: 15, background: 'linear-gradient(135deg, #c8952a, #e0a830)', border: 'none', borderRadius: 10, color: '#1a0c00', fontSize: 14, fontWeight: 700, cursor: isAnswered(curQ) ? 'pointer' : 'not-allowed', opacity: isAnswered(curQ) ? 1 : 0.35, transition: 'all .2s', fontFamily: 'var(--font-sans)' }}
            >
              {curQ === QUESTIONS.length - 1 ? '診断を完了して鑑定結果を見る ✨' : '次へ →'}
            </button>
          </div>
        </div>
      </div>
    )
  }


  /* ══════════════════════════════════════
     LOADING
  ══════════════════════════════════════ */
  if (step === 'loading') return (
    <div style={{ background: '#060914', minHeight: '100dvh' }}>
      <Stars />
      <div style={{ ...pageStyle, alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
          <h2 style={{ fontFamily: 'var(--font-mincho)', fontSize: 20, fontWeight: 900, color: '#f0f4ff', marginBottom: 6, opacity: 0, animation: 'fade-up .8s ease .2s forwards' }}>
            {loadText}
          </h2>
          <p style={{ fontSize: 11, color: '#7888b8', marginBottom: 36, opacity: 0, animation: 'fade-up .8s ease .4s forwards' }}>
            太陽・月・本命星の声を聞いています…
          </p>

          {/* スピナー */}
          <div style={{ position: 'relative', width: 120, height: 120, marginBottom: 28 }}>
            <div style={{ width: 120, height: 120, borderRadius: '50%', border: '2px solid transparent', borderTopColor: '#c8952a', borderRightColor: '#c8952a66', animation: 'spin-fwd 1.6s cubic-bezier(.4,0,.2,1) infinite', boxShadow: '0 0 18px #c8952a44' }} />
            <div style={{ position: 'absolute', inset: 12, borderRadius: '50%', border: '2px solid transparent', borderBottomColor: '#a898f8', borderLeftColor: '#a898f844', animation: 'spin-rev 2.4s cubic-bezier(.4,0,.2,1) infinite' }} />
            <div style={{ position: 'absolute', inset: 24, borderRadius: '50%', border: '1px solid transparent', borderTopColor: '#3cc4a8', animation: 'spin-fwd 3.2s linear infinite' }} />
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontFamily: 'var(--font-mincho)', fontSize: 26, fontWeight: 900, color: '#f0c060', lineHeight: 1, letterSpacing: -1 }}>{loadPct}</span>
            </div>
          </div>

          {/* ステップリスト */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%', maxWidth: 260 }}>
            {LOAD_STEPS.map((label, i) => {
              const isOn = i === loadActiveStep
              const isDone = i < loadActiveStep
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 11, color: isDone ? '#3cc4a8' : isOn ? '#c8952a' : '#3a4870', background: isOn ? '#c8952a08' : 'transparent', border: `1px solid ${isOn ? '#c8952a33' : 'transparent'}`, borderRadius: 8, padding: '5px 10px', transition: 'all .3s' }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', flexShrink: 0, background: isDone ? '#3cc4a8' : isOn ? '#c8952a' : '#1e2d52', boxShadow: isOn ? '0 0 8px #c8952a' : 'none' }} />
                  {label}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )

  /* ══════════════════════════════════════
     RESULT
  ══════════════════════════════════════ */
  if (step === 'result' && result) {
    const { userData: u, scoreResult: r, topJobs, topIndustries, agents, monthlyAdvice, kansenText } = result
    const timingData = TIMINGS[r.timing]
    const origin = typeof window !== 'undefined' ? window.location.origin : ''
    const shareUrl = origin + '/premium'
    const shareText = `転職占い師ルナの精密鑑定を受けました。\n\n${u.sunSign.name} × 月星座 ${u.moonSign} × ${u.honmeiStar}\n転職スコア ${r.score_total}点\n\nあなたも鑑定を受けてみてください。\n${shareUrl}`

    const timingColors: Record<string, string> = { now: '#ffa040', '3m': '#f0c060', '6m': '#a898f8', wait: '#3cc4a8' }

    return (
      <div style={{ background: '#060914', minHeight: '100dvh' }}>
        <Stars />
        <div style={pageStyle}>
          {/* ヘッダー */}
          <div style={{ border: '1px solid #2a3f72', borderRadius: 8, padding: '10px 16px', marginTop: 16, marginBottom: 10, background: '#060914', textAlign: 'center', fontSize: 16, color: '#7888b8' }}>
            <span style={{ color: '#f0c060', fontWeight: 700 }}>{u.nickname}</span>さんの精密鑑定結果
          </div>

          {/* ══ セクション1: 星のプロフィール ══ */}
          <div style={{ ...cardStyle, background: 'linear-gradient(135deg, #111c36, #0d1428)', padding: '24px 20px' }}>
            <div style={{ fontSize: 11, letterSpacing: 3, color: '#c8952a', marginBottom: 12, textAlign: 'center' }}>
              ✦ あなたの星のプロフィール
            </div>

            {/* 誕生日・星座ボックス */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                border: '1px solid #2a3f72',
                borderRadius: 8,
                padding: '7px 14px',
                background: '#060914',
              }}>
                <span style={{ fontSize: 12, color: '#7888b8' }}>{u.year}年{u.month}月{u.day}日生まれ</span>
                <span style={{ color: '#2a3f72' }}>|</span>
                <Image src={`/assets/img/${u.sunSign.en}.png`} alt={u.sunSign.name} width={18} height={18} style={{ objectFit: 'contain', verticalAlign: 'middle' }} />
                <span style={{ fontSize: 12, color: '#a898f8', fontWeight: 700 }}>{u.sunSign.name}</span>
              </div>
            </div>

            {/* 3つの星 + MBTI（タップで図鑑へ） */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
              {(() => {
                const MBTI_LABELS: Record<string, string> = {
                  NT: 'NT型（論理・戦略・革新系）',
                  NF: 'NF型（理念・共感・ビジョン系）',
                  SJ: 'SJ型（責任・秩序・サポート系）',
                  SP: 'SP型（行動・適応・実践系）',
                  unknown: '未診断',
                }
                const mbtiLabel = MBTI_LABELS[u.mbti] ?? u.mbti
                const mbtiLower = u.mbti?.toLowerCase() ?? ''
                return [
                  { label: '☀️ 太陽星座', value: `${u.sunSign.name}（${u.sunSign.keyword}）`, color: '#f0c060', href: '/guide/seiyou' },
                  { label: '🌙 月星座',   value: `${u.moonSign}（${u.moonKeyword}）`,          color: '#a898f8', href: '/guide/seiyou' },
                  { label: '⭐ 本命星',   value: `${u.honmeiStar}（${u.honmeiKeyword}）`,      color: '#3cc4a8', href: '/guide/kyusei' },
                  { label: '🧠 MBTI',     value: mbtiLabel,                                    color: '#c8952a', href: `/guide/mbti/${mbtiLower}` },
                ]
              })().map(({ label, value, color, href }) => (
                <a key={label} href={href} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, background: '#111c3688', border: '1px solid #1e2d52', borderRadius: 10, padding: '10px 14px', textDecoration: 'none' }}>
                  <span style={{ fontSize: 11, color: '#7888b8', flexShrink: 0, width: 72, lineHeight: 1.6 }}>{label}</span>
                  <span style={{ fontSize: 12, color, fontWeight: 600, lineHeight: 1.6, flex: 1 }}>{value}</span>
                  <span style={{ fontSize: 9, color: '#3a4870', alignSelf: 'center' }}>→</span>
                </a>
              ))}
            </div>


            {/* 3つの星の組み合わせメッセージ */}
            <div style={{ background: '#0a0f1e', border: '1px solid #c8952a33', borderRadius: 10, padding: '14px 16px', fontSize: 12, color: '#dde4f8', lineHeight: 1.8 }}>
              <div style={{ fontSize: 10, color: '#c8952a', letterSpacing: 2, marginBottom: 8 }}>✦ 3つの星が示す本質</div>
              <p>
                太陽星座の<strong style={{ color: '#f0c060' }}>{u.sunSign.keyword.split('・')[0]}</strong>、
                月星座の<strong style={{ color: '#a898f8' }}>{u.moonKeyword.split('・')[0]}</strong>、
                そして本命星<strong style={{ color: '#3cc4a8' }}>{u.honmeiStar}</strong>の<strong style={{ color: '#3cc4a8' }}>{u.honmeiKeyword.split('・')[0]}</strong>が重なるあなたは、
                表の顔と深層の感情と運命の使命が独自のバランスで存在しています。
                この3つの組み合わせが、転職においての最大の指針となります。
              </p>
            </div>
          </div>

          {/* ══ セクション2: 転職スコア詳細 ══ */}
          <div style={cardStyle}>
            <div style={{ fontSize: 11, letterSpacing: 3, color: '#c8952a', marginBottom: 16, textAlign: 'center' }}>
              ✦ 転職スコア（詳細版）
            </div>

            {/* 総合スコア */}
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div style={{ fontFamily: 'var(--font-mincho)', fontSize: 56, fontWeight: 900, color: '#f0c060', lineHeight: 1 }}>
                {r.score_total}
              </div>
              <div style={{ fontSize: 12, color: '#7888b8', marginTop: 4 }}>総合転職スコア</div>
            </div>

            {/* 3軸スコア */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { label: 'タイミングスコア', score: r.score_timing, icon: '⚡', desc: r.score_timing >= 70 ? '今が動き時' : r.score_timing >= 50 ? '準備を始めて' : '充電の時期' },
                { label: '準備スコア',       score: r.score_readiness, icon: '🌙', desc: r.score_readiness >= 70 ? '動く準備ができている' : r.score_readiness >= 50 ? 'あと一歩の準備が必要' : '市場価値を上げる時期' },
                { label: '相性スコア',       score: r.score_market, icon: '✨', desc: r.score_market >= 70 ? '市場との相性は高い' : r.score_market >= 50 ? '方向性を明確に' : '軸を固める時期' },
              ].map(({ label, score, icon, desc }) => (
                <div key={label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ fontSize: 12, color: '#dde4f8' }}>{icon} {label}</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#f0c060' }}>{score}点</span>
                  </div>
                  <div style={{ height: 6, background: '#1e2d52', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${score}%`, background: 'linear-gradient(90deg, #c8952a, #f0c060)', borderRadius: 3, transition: 'width 1s ease' }} />
                  </div>
                  <div style={{ fontSize: 10, color: '#3a4870', marginTop: 4 }}>{desc}</div>
                </div>
              ))}
            </div>

            {/* タイミング判定 */}
            <div style={{ marginTop: 16, padding: '12px 14px', background: '#0a0f1e', border: `1px solid ${timingColors[r.timing]}33`, borderRadius: 10 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: timingColors[r.timing], marginBottom: 6 }}>
                {timingData.badge}
              </div>
              <p style={{ fontSize: 11, color: '#7888b8', lineHeight: 1.7 }}>{timingData.text}</p>
            </div>
          </div>

          {/* ══ セクション3: 向いている職種・業界 ══ */}
          <div style={cardStyle}>
            <div style={{ fontSize: 11, letterSpacing: 3, color: '#c8952a', marginBottom: 16 }}>
              ✦ 向いている職種・業界
            </div>

            <div style={{ fontSize: 11, color: '#7888b8', marginBottom: 10 }}>【TOP 3 職種】</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
              {topJobs.map((job, i) => (
                <div key={job.job} style={{ background: '#111c36', border: `1px solid ${i === 0 ? '#c8952a' : '#1e2d52'}`, borderRadius: 10, padding: '12px 14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 11, color: i === 0 ? '#c8952a' : '#7888b8', fontWeight: 700 }}>{i + 1}位</span>
                      <span style={{ fontSize: 13, color: i === 0 ? '#f0f4ff' : '#dde4f8', fontWeight: 600 }}>{job.job}</span>
                    </div>
                    <span style={{ fontSize: 13, color: '#f0c060', fontWeight: 700 }}>{job.score}%</span>
                  </div>
                  <div style={{ height: 3, background: '#0a0f1e', borderRadius: 2, overflow: 'hidden', marginBottom: 6 }}>
                    <div style={{ height: '100%', width: `${job.score}%`, background: i === 0 ? 'linear-gradient(90deg, #c8952a, #f0c060)' : 'linear-gradient(90deg, #2a3f72, #a898f8)', borderRadius: 2 }} />
                  </div>
                  <p style={{ fontSize: 10, color: '#3a4870', lineHeight: 1.6 }}>{job.reason}</p>
                </div>
              ))}
            </div>

            {/* 向いている業界 */}
            {topIndustries.length > 0 && (
              <>
                <div style={{ fontSize: 11, color: '#7888b8', marginBottom: 8 }}>【向いている業界】</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
                  {topIndustries.map(ind => (
                    <div key={ind.name} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#111c36', border: '1px solid #2a3f72', borderRadius: 20, padding: '6px 14px', fontSize: 12, color: '#dde4f8' }}>
                      <span>{ind.emoji}</span>
                      <span>{ind.name}</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* おすすめエージェント */}
            <div style={{ fontSize: 11, color: '#7888b8', marginBottom: 8 }}>【おすすめ転職エージェント】</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {agents.map(agent => (
                <a
                  key={agent.name}
                  href={agent.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent('affiliate_click', { name: agent.name, source: 'premium_form' })}
                  style={{ display: 'block', background: '#111c36', border: '1px solid #2a3f72', borderRadius: 10, padding: '12px 14px', textDecoration: 'none' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <span style={{ fontSize: 13, color: '#a898f8', fontWeight: 700 }}>{agent.name}</span>
                    <span style={{ fontSize: 10, color: '#3a4870' }}>→ 詳細を見る</span>
                  </div>
                  <div style={{ fontSize: 10, color: '#7888b8', marginBottom: 6 }}>{agent.desc}</div>
                  <div style={{ fontSize: 11, color: '#dde4f8', lineHeight: 1.6 }}>🌙 {agent.luna}</div>
                </a>
              ))}
            </div>
            <p style={{ fontSize: 10, color: '#3a4870', marginTop: 10, textAlign: 'right' }}>※ 広告を含みます</p>
          </div>

          {/* ══ セクション4: 3ヶ月アドバイス ══ */}
          <div style={cardStyle}>
            <div style={{ fontSize: 11, letterSpacing: 3, color: '#c8952a', marginBottom: 16 }}>
              ✦ 今後3ヶ月の行動アドバイス
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {monthlyAdvice.map((ma, i) => (
                <div
                  key={i}
                  style={{
                    background: ma.highlight ? 'linear-gradient(135deg, #c8952a0a, #111c36)' : '#111c36',
                    border: `1px solid ${ma.highlight ? '#c8952a44' : '#1e2d52'}`,
                    borderRadius: 10,
                    padding: '14px 16px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <span style={{ fontSize: 22 }}>{ma.emoji}</span>
                    <div>
                      <span style={{ fontSize: 12, fontWeight: 700, color: ma.highlight ? '#f0c060' : '#dde4f8' }}>
                        【{ma.month}】{ma.label}
                      </span>
                      {ma.highlight && <span style={{ fontSize: 9, color: '#c8952a', marginLeft: 8, letterSpacing: 1 }}>★ 行動月</span>}
                    </div>
                  </div>
                  <p style={{ fontSize: 11, color: '#7888b8', lineHeight: 1.7 }}>{ma.advice}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ══ セクション5: ルナの鑑定メッセージ ══ */}
          <div style={{ ...cardStyle, background: 'linear-gradient(135deg, #1a1830, #0d1428)', border: '1px solid #7c6bdc44' }}>
            <div style={{ fontSize: 11, letterSpacing: 3, color: '#a898f8', marginBottom: 14, textAlign: 'center' }}>
              ✦ ルナからの精密鑑定メッセージ
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
              <Image src="/luna_mainIcon.png" alt="ルナ" width={36} height={36} style={{ borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '1px solid #7c6bdc44' }} />
              <div style={{ fontSize: 11, color: '#7888b8' }}>
                <strong style={{ color: '#a898f8' }}>転職占い師◇ルナ</strong>
                <br />@hoshiyomi_luna
              </div>
            </div>
            <div style={{ background: '#0a0f1e', borderRadius: 12, padding: '16px', border: '1px solid #2a3f72' }}>
              <p style={{ fontSize: 13, color: '#dde4f8', lineHeight: 1.9, whiteSpace: 'pre-wrap', fontFamily: 'var(--font-serif)' }}>
                {kansenText}
              </p>
            </div>
          </div>

          {/* ── シェア ── */}
          <ShareBlock shareText={shareText} shareUrl={shareUrl} />

          {/* ── LINE通知バナー ── */}
          {lineUserId && (
            <div style={{
              background: lineSent ? '#0d1e14' : lineSendError ? '#1a0d0d' : '#111c36',
              border: `1px solid ${lineSent ? '#06c75544' : lineSendError ? '#d4607a44' : '#2a3f72'}`,
              borderRadius: 12,
              padding: '14px 16px',
              marginTop: 4,
              display: 'flex',
              alignItems: 'flex-start',
              gap: 12,
              fontSize: 12,
            }}>
              <span style={{ fontSize: 20, flexShrink: 0 }}>{lineSent ? '✅' : lineSendError ? '⚠️' : '📨'}</span>
              <div>
                {lineSent ? (
                  <>
                    <div style={{ color: '#06c755', fontWeight: 700, marginBottom: 2 }}>LINEに結果を送信しました</div>
                    <div style={{ color: '#7888b8', fontSize: 11 }}>LINEアプリから鑑定結果をいつでも確認できます</div>
                  </>
                ) : lineSendError ? (
                  <>
                    <div style={{ color: '#d4607a', fontWeight: 700, marginBottom: 2 }}>LINE送信に失敗しました</div>
                    <div style={{ color: '#7888b8', fontSize: 10, wordBreak: 'break-all' }}>{lineSendError}</div>
                  </>
                ) : (
                  <>
                    <div style={{ color: '#f0f4ff', fontWeight: 700, marginBottom: 2 }}>LINE送信中…</div>
                    <div style={{ color: '#7888b8', fontSize: 11 }}>鑑定結果をLINEに送っています</div>
                  </>
                )}
              </div>
            </div>
          )}


        </div>
      </div>
    )
  }

  return null
}
