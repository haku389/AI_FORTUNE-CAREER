'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Stars from '@/components/Stars'
import MoonImage from '@/components/MoonImage'
import ScoreRing from '@/components/result/ScoreRing'
import AffiliBlock from '@/components/result/AffiliBlock'
import ShareBlock from '@/components/result/ShareBlock'
import Image from 'next/image'
import { getZodiac, ZodiacInfo } from '@/lib/zodiac'
import { QUESTIONS, PLANETS } from '@/lib/questions'
import { calcScore, TYPES, TIMINGS, MOONS, SATURNS, DiagnosisResult } from '@/lib/scoring'
import { getKansen } from '@/lib/kansen'

/* ─── Types ─── */
type Step = 'input' | 'questions' | 'loading' | 'result' | 'wait'

type UserData = {
  nickname: string
  year: number
  month: number
  day: number
  zodiac: ZodiacInfo
}

type FullResult = {
  userData: UserData
  diagResult: DiagnosisResult
  kansenText: string
}

/* ─── Helpers ─── */
const LOAD_STEPS = ['星座の位置を確認', '月の影響を読み取り', '転職運を計算', '鑑定文を生成']

function pad2(n: number) {
  return String(n).padStart(2, '0')
}

/* ─── Main Component ─── */
export default function DiagnosisPage() {
  const router = useRouter()

  const [step, setStep] = useState<Step>('input')

  // input state
  const [nickname, setNickname] = useState('')
  const [year, setYear] = useState(0)
  const [month, setMonth] = useState(0)
  const [day, setDay] = useState(0)
  const [zodiac, setZodiac] = useState<ZodiacInfo | null>(null)

  // questions state
  const [curQ, setCurQ] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])

  // loading state
  const [loadActiveStep, setLoadActiveStep] = useState(-1)
  const [loadText, setLoadText] = useState('星の声を聞いています')

  // result state
  const [result, setResult] = useState<FullResult | null>(null)

  // wait state
  const [countdown, setCountdown] = useState('00:00:00')
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null)

  /* ── Countdown ── */
  const startCountdown = useCallback(() => {
    const update = () => {
      const now = new Date()
      const next = new Date()
      next.setHours(0, 0, 0, 0)
      next.setDate(next.getDate() + 1)
      const diff = next.getTime() - now.getTime()
      const h = Math.floor(diff / 3600000)
      const m = Math.floor((diff % 3600000) / 60000)
      const s = Math.floor((diff % 60000) / 1000)
      setCountdown(`${pad2(h)}:${pad2(m)}:${pad2(s)}`)
    }
    update()
    countdownRef.current = setInterval(update, 1000)
  }, [])

  useEffect(() => () => { if (countdownRef.current) clearInterval(countdownRef.current) }, [])

  /* ── 1日1回チェック (on mount) ── */
  useEffect(() => {
    const stored = localStorage.getItem('shindan_last')
    if (stored) {
      const last = new Date(parseInt(stored))
      if (last.toDateString() === new Date().toDateString()) {
        const saved = localStorage.getItem('shindan_result')
        if (saved) {
          try {
            const obj: FullResult = JSON.parse(saved)
            setResult(obj)
          } catch (_) {}
        }
        setStep('wait')
        startCountdown()
      }
    }
  }, [startCountdown])

  /* ── Zodiac update when birthday changes ── */
  useEffect(() => {
    if (month && day) setZodiac(getZodiac(month, day))
    else setZodiac(null)
  }, [month, day])

  /* ── Input: start quiz ── */
  const handleStartQuiz = () => {
    if (!nickname || !year || !month || !day) return
    setCurQ(0)
    setAnswers([])
    setStep('questions')
  }

  /* ── Questions ── */
  const pick = (optIdx: number) => {
    setAnswers(prev => {
      const next = [...prev]
      next[curQ] = optIdx
      return next
    })
  }

  const nextQ = () => {
    if (answers[curQ] === undefined) return
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
    if (!zodiac) return
    setLoadActiveStep(-1)
    setLoadText('星の声を聞いています')
    setStep('loading')

    // スコア計算はすぐ確定し、API呼び出しをアニメーションと並列実行
    const diagResult = calcScore(answers)
    const userData: UserData = { nickname, year, month, day, zodiac }

    const kansenPromise = fetch('/api/kansen', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nickname,
        zodiacName: zodiac.name,
        zodiacKeyword: zodiac.keyword,
        score: diagResult.score,
        timing: diagResult.timing,
        typeName: TYPES[diagResult.type].name,
      }),
    })
      .then(r => r.json())
      .then(d => (d.text as string) || null)
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
            // API結果を待つ（アニメーション中に終わっていればほぼ即座）
            const aiText = await kansenPromise
            const kansenText = aiText ?? getKansen(zodiac, nickname)
            const full: FullResult = { userData, diagResult, kansenText }

            localStorage.setItem('shindan_last', Date.now().toString())
            localStorage.setItem('shindan_result', JSON.stringify(full))
            setResult(full)
            setStep('result')

            // save to API (fire-and-forget)
            fetch('/api/diagnose', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                nickname,
                birthday: `${year}-${pad2(month)}-${pad2(day)}`,
                zodiac: zodiac.name,
                career_type: diagResult.type,
                score: diagResult.score,
                timing: diagResult.timing,
                recommended_service: TYPES[diagResult.type].affili,
                kansen_text: kansenText,
              }),
            }).catch(() => {})
          }, 2000)
        }, 600)
      }
    }, 700)
  }

  /* ── Wait: retry ── */
  const handleRetry = () => {
    localStorage.removeItem('shindan_last')
    localStorage.removeItem('shindan_result')
    if (countdownRef.current) clearInterval(countdownRef.current)
    setAnswers([])
    setCurQ(0)
    setNickname('')
    setYear(0)
    setMonth(0)
    setDay(0)
    setZodiac(null)
    setStep('input')
  }

  const handleShowSaved = () => {
    const saved = localStorage.getItem('shindan_result')
    if (!saved) return
    try {
      const obj: FullResult = JSON.parse(saved)
      setResult(obj)
      setStep('result')
    } catch (_) {}
  }

  /* ─── Render helpers ─── */
  const inputReady = !!nickname && !!year && !!month && !!day

  const years: number[] = []
  const cur = new Date().getFullYear()
  for (let y = cur; y >= 1960; y--) years.push(y)

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

  const rbHeadStyle: React.CSSProperties = {
    fontSize: 13,
    fontWeight: 700,
    color: '#f0c060',
    marginBottom: 8,
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  }

  /* ══════════════════════════════════════
     INPUT
  ══════════════════════════════════════ */
  if (step === 'input') return (
    <div style={{ background: '#060914', minHeight: '100dvh' }}>
      <Stars />
      <div style={{ ...pageStyle, justifyContent: 'center' }}>
        <div style={cardStyle}>
          <h2 style={{ fontFamily: 'var(--font-mincho)', fontSize: 20, fontWeight: 700, textAlign: 'center', marginBottom: 6, color: '#f0f4ff' }}>
            あなたの星を読む
          </h2>
          <p style={{ fontSize: 12, color: '#7888b8', textAlign: 'center', marginBottom: 28 }}>
            誕生日とニックネームを入力してください
          </p>

          {/* ニックネーム */}
          <div style={{ marginBottom: 22 }}>
            <label style={{ display: 'block', fontSize: 11, letterSpacing: 2, color: '#c8952a', marginBottom: 8 }}>
              ニックネーム
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
          <div style={{ marginBottom: 22 }}>
            <label style={{ display: 'block', fontSize: 11, letterSpacing: 2, color: '#c8952a', marginBottom: 8 }}>
              誕生日
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
              {/* 年 */}
              <select
                value={year || ''}
                onChange={e => setYear(Number(e.target.value))}
                style={{
                  width: '100%',
                  background: '#111c36',
                  border: `1px solid ${year ? '#c8952a' : '#2a3f72'}`,
                  borderRadius: 8,
                  padding: '13px 10px',
                  color: year ? '#f0f4ff' : '#3a4870',
                  fontSize: 14,
                  fontFamily: 'var(--font-sans)',
                  outline: 'none',
                  cursor: 'pointer',
                  textAlign: 'center',
                }}
              >
                <option value="">年</option>
                {years.map(y => <option key={y} value={y}>{y}年</option>)}
              </select>

              {/* 月 */}
              <select
                value={month || ''}
                onChange={e => setMonth(Number(e.target.value))}
                style={{
                  width: '100%',
                  background: '#111c36',
                  border: `1px solid ${month ? '#c8952a' : '#2a3f72'}`,
                  borderRadius: 8,
                  padding: '13px 10px',
                  color: month ? '#f0f4ff' : '#3a4870',
                  fontSize: 14,
                  fontFamily: 'var(--font-sans)',
                  outline: 'none',
                  cursor: 'pointer',
                  textAlign: 'center',
                }}
              >
                <option value="">月</option>
                {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                  <option key={m} value={m}>{m}月</option>
                ))}
              </select>

              {/* 日 */}
              <select
                value={day || ''}
                onChange={e => setDay(Number(e.target.value))}
                style={{
                  width: '100%',
                  background: '#111c36',
                  border: `1px solid ${day ? '#c8952a' : '#2a3f72'}`,
                  borderRadius: 8,
                  padding: '13px 10px',
                  color: day ? '#f0f4ff' : '#3a4870',
                  fontSize: 14,
                  fontFamily: 'var(--font-sans)',
                  outline: 'none',
                  cursor: 'pointer',
                  textAlign: 'center',
                }}
              >
                <option value="">日</option>
                {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                  <option key={d} value={d}>{d}日</option>
                ))}
              </select>
            </div>

            {/* 星座表示 */}
            {zodiac && (
              <div style={{ marginTop: 12, padding: '14px', background: 'linear-gradient(135deg, #1a1830, #0d1428)', border: '1px solid #7c6bdc', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 16, animation: 'fade-in .4s ease' }}>
                <Image src={`/assets/img/${zodiac.en}.png`} alt={zodiac.name} width={52} height={52} style={{ objectFit: 'contain', flexShrink: 0 }} priority />
                <div>
                  <strong style={{ color: '#a898f8', display: 'block', fontSize: 14 }}>{zodiac.name}</strong>
                  <span style={{ fontSize: 11, color: '#7888b8' }}>{zodiac.keyword}</span>
                </div>
              </div>
            )}
          </div>

          {/* 開始ボタン */}
          <button
            onClick={handleStartQuiz}
            disabled={!inputReady}
            style={{
              width: '100%',
              padding: 16,
              background: 'linear-gradient(135deg, #c8952a, #e0a830)',
              border: 'none',
              borderRadius: 12,
              color: '#1a0c00',
              fontSize: 15,
              fontWeight: 700,
              cursor: inputReady ? 'pointer' : 'not-allowed',
              opacity: inputReady ? 1 : 0.4,
              transition: 'opacity .2s',
              fontFamily: 'var(--font-sans)',
              letterSpacing: 1,
            }}
          >
            診断を始める →
          </button>
        </div>
      </div>
    </div>
  )

  /* ══════════════════════════════════════
     QUESTIONS
  ══════════════════════════════════════ */
  if (step === 'questions') {
    const q = QUESTIONS[curQ]
    const planet = PLANETS[curQ]
    const pct = ((curQ + 1) / QUESTIONS.length) * 100

    return (
      <div style={{ background: '#060914', minHeight: '100dvh' }}>
        <Stars />
        <div style={{ ...pageStyle, justifyContent: 'flex-start', paddingTop: 28 }}>
          {/* オービット */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
              background: 'radial-gradient(circle at 35% 35%, #f0d890, #c8952a 40%, #7a4a08 80%)',
              boxShadow: '0 0 16px #c8952a44',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14,
            }}>
              {planet.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 9, letterSpacing: 3, color: '#c8952a', marginBottom: 2 }}>
                {planet.name}
              </div>
              <div style={{ height: 3, background: '#1e2d52', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${pct}%`,
                  background: 'linear-gradient(90deg, #c8952a, #a898f8)',
                  borderRadius: 2,
                  transition: 'width .5s cubic-bezier(.4,0,.2,1)',
                }} />
              </div>
            </div>
            <div style={{ fontSize: 11, color: '#7888b8', whiteSpace: 'nowrap', marginLeft: 8 }}>
              {curQ + 1} / {QUESTIONS.length}
            </div>
          </div>

          {/* 問題カード */}
          <div style={{
            background: '#0d1428',
            border: '1px solid #2a3f72',
            borderRadius: 16,
            padding: '28px 22px',
            marginBottom: 16,
            animation: 'q-enter .35s cubic-bezier(.4,0,.2,1)',
          }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              fontSize: 9, letterSpacing: 2, color: '#a898f8',
              background: '#7c6bdc12', border: '1px solid #7c6bdc33',
              padding: '3px 10px', borderRadius: 20, marginBottom: 14,
            }}>
              ✦ {q.tag}
            </div>
            <div style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 19, fontWeight: 700,
              color: '#f0f4ff', lineHeight: 1.45, marginBottom: 8,
            }}>
              {q.q}
            </div>
            <div style={{
              fontSize: 11, color: '#3a4870', fontStyle: 'italic',
              marginBottom: 22, lineHeight: 1.6, paddingLeft: 12,
              borderLeft: '2px solid #c8952a44',
            }}>
              {q.hint}
            </div>

            {/* 選択肢 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {q.opts.map((opt, i) => {
                const picked = answers[curQ] === i
                return (
                  <button
                    key={i}
                    onClick={() => pick(i)}
                    style={{
                      background: picked ? 'linear-gradient(135deg, #c8952a14, #7c6bdc08)' : '#111c36',
                      border: `1px solid ${picked ? '#c8952a' : '#1e2d52'}`,
                      borderRadius: 10,
                      padding: '14px 16px',
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
                    <span style={{ fontSize: 20, flexShrink: 0, lineHeight: 1.4 }}>{opt.sym}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, color: picked ? '#f0f4ff' : '#dde4f8', fontWeight: 500, lineHeight: 1.4, marginBottom: 2 }}>
                        {opt.main}
                      </div>
                      <div style={{ fontSize: 10, color: '#3a4870', lineHeight: 1.4 }}>
                        {opt.hint}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* ナビゲーション */}
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={prevQ}
              style={{
                padding: '13px 18px',
                background: 'transparent',
                border: '1px solid #2a3f72',
                borderRadius: 10,
                color: '#7888b8',
                fontSize: 13,
                cursor: 'pointer',
                opacity: curQ === 0 ? 0.3 : 1,
                pointerEvents: curQ === 0 ? 'none' : 'auto',
                fontFamily: 'var(--font-sans)',
                transition: 'all .2s',
              }}
            >
              ← 戻る
            </button>
            <button
              onClick={nextQ}
              disabled={answers[curQ] === undefined}
              style={{
                flex: 1,
                padding: 15,
                background: 'linear-gradient(135deg, #c8952a, #e0a830)',
                border: 'none',
                borderRadius: 10,
                color: '#1a0c00',
                fontSize: 14,
                fontWeight: 700,
                cursor: answers[curQ] !== undefined ? 'pointer' : 'not-allowed',
                opacity: answers[curQ] !== undefined ? 1 : 0.35,
                transition: 'all .2s',
                fontFamily: 'var(--font-sans)',
              }}
            >
              {curQ === QUESTIONS.length - 1 ? '結果を見る ✨' : '次へ →'}
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
          <h2 style={{
            fontFamily: 'var(--font-mincho)',
            fontSize: 22, fontWeight: 900, color: '#f0f4ff',
            marginBottom: 6, opacity: 0,
            animation: 'fade-up .8s ease .2s forwards',
          }}>
            {loadText}
          </h2>
          <p style={{
            fontSize: 12, color: '#7888b8', marginBottom: 40, opacity: 0,
            animation: 'fade-up .8s ease .4s forwards',
          }}>
            あなたのための鑑定を生成中…
          </p>

          {/* スピナー */}
          <div style={{ position: 'relative', width: 140, height: 140, marginBottom: 32 }}>
            <div style={{
              width: 140, height: 140, borderRadius: '50%',
              border: '2px solid transparent',
              borderTopColor: '#c8952a',
              borderRightColor: '#c8952a66',
              animation: 'spin-fwd 1.6s cubic-bezier(.4,0,.2,1) infinite',
              boxShadow: '0 0 18px #c8952a44',
            }} />
            <div style={{
              position: 'absolute',
              inset: 14,
              borderRadius: '50%',
              border: '2px solid transparent',
              borderBottomColor: '#a898f8',
              borderLeftColor: '#a898f844',
              animation: 'spin-rev 2.4s cubic-bezier(.4,0,.2,1) infinite',
            }} />
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <img src="/crystalBall.png" alt="" style={{ width: 44, height: 44 }} />
            </div>
          </div>

          {/* ステップリスト */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 240 }}>
            {LOAD_STEPS.map((label, i) => {
              const isOn = i === loadActiveStep
              const isDone = i < loadActiveStep
              return (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  fontSize: 12,
                  color: isDone ? '#3cc4a8' : isOn ? '#c8952a' : '#3a4870',
                  background: isOn ? '#c8952a08' : 'transparent',
                  border: `1px solid ${isOn ? '#c8952a33' : 'transparent'}`,
                  borderRadius: 8, padding: '6px 10px',
                  transition: 'all .3s',
                }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                    background: isDone ? '#3cc4a8' : isOn ? '#c8952a' : '#1e2d52',
                    boxShadow: isOn ? '0 0 8px #c8952a' : 'none',
                  }} />
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
     WAIT
  ══════════════════════════════════════ */
  if (step === 'wait') return (
    <div style={{ background: '#060914', minHeight: '100dvh' }}>
      <Stars />
      <MoonImage />
      <div style={{ ...pageStyle, alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div style={{ marginBottom: 20, height: 200 }} />
        <h2 style={{ fontFamily: 'var(--font-mincho)', fontSize: 22, fontWeight: 700, color: '#f0f4ff', marginBottom: 10 }}>
          今日の星読みは終わりました
        </h2>
        <p style={{ fontSize: 13, color: '#7888b8', lineHeight: 1.8, marginBottom: 28 }}>
          星は毎日、新しいメッセージを届けます。
          <br />次の診断は明日の0:00から受け取れます。
        </p>
        <div style={{ fontFamily: 'var(--font-mincho)', fontSize: 40, fontWeight: 900, color: '#f0c060', marginBottom: 4 }}>
          {countdown}
        </div>
        <div style={{ fontSize: 11, color: '#7888b8', marginBottom: 32 }}>次の診断まで</div>

        {result && (
          <button
            onClick={handleShowSaved}
            style={{
              width: '100%', padding: 16,
              background: 'linear-gradient(135deg, #c8952a, #e0a830)',
              border: 'none', borderRadius: 12,
              color: '#1a0c00', fontSize: 15, fontWeight: 700,
              cursor: 'pointer', fontFamily: 'var(--font-sans)',
              letterSpacing: 1, marginBottom: 12,
            }}
          >
            前回の結果を見る
          </button>
        )}

        <button
          onClick={handleRetry}
          style={{
            width: '100%', padding: 14,
            background: 'transparent',
            border: '1px solid #2a3f72',
            borderRadius: 12,
            color: '#7888b8', fontSize: 13,
            cursor: 'pointer', fontFamily: 'var(--font-sans)',
          }}
        >
          再診断する（制限をリセット）
        </button>
      </div>
    </div>
  )

  /* ══════════════════════════════════════
     RESULT
  ══════════════════════════════════════ */
  if (step === 'result' && result) {
    const { userData: u, diagResult: r, kansenText } = result
    const typeData = TYPES[r.type]
    const timingData = TIMINGS[r.timing]
    const moonData = MOONS[r.stress]
    const saturnData = SATURNS[r.mars]

    const origin = typeof window !== 'undefined' ? window.location.origin : ''
    const ogParams = new URLSearchParams({
      zodiac: u.zodiac.en,
      zodiacName: u.zodiac.name,
      score: String(r.score),
      timing: r.timing,
      type: r.type,
    })
    const shareUrl = `${origin}?${ogParams.toString()}`
    const shareText = `🔮 転職運命診断やってみた！\n\n${u.zodiac.emoji}${u.zodiac.name}×${typeData.name}\n転職運スコア：${r.score}点\n\nあなたも試してみて👇\n${shareUrl}`

    const timingColors: Record<string, string> = {
      now: '#ffa040',
      '3m': '#f0c060',
      '6m': '#a898f8',
      wait: '#3cc4a8',
    }

    return (
      <div style={{ background: '#060914', minHeight: '100dvh' }}>
        <Stars />
        <div style={pageStyle}>
          {/* ヘッダー */}
          <div style={{
            border: '1px solid #2a3f72',
            borderRadius: 8,
            padding: '10px 16px',
            marginTop: 16,
            marginBottom: 10,
            background: '#060914',
            textAlign: 'center',
            fontSize: 16,
            color: '#7888b8',
          }}>
            <span style={{ color: '#f0c060', fontWeight: 700 }}>{u.nickname}</span>さんの鑑定結果
          </div>

          {/* 星座 + スコアカード */}
          <div style={{
            ...cardStyle,
            background: 'linear-gradient(135deg, #111c36, #0d1428)',
            textAlign: 'center',
            padding: '20px 22px 22px',
          }}>
            {/* 誕生日・星座ボックス */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              border: '1px solid #2a3f72',
              borderRadius: 8,
              padding: '8px 16px',
              marginBottom: 16,
              background: '#060914',
            }}>
              <span style={{ fontSize: 12, color: '#7888b8' }}>{u.year}年{u.month}月{u.day}日生まれ</span>
              <span style={{ color: '#2a3f72' }}>|</span>
              <Image src={`/assets/img/${u.zodiac.en}.png`} alt={u.zodiac.name} width={18} height={18} style={{ objectFit: 'contain', verticalAlign: 'middle' }} />
              <span style={{ fontSize: 12, color: '#a898f8', fontWeight: 700 }}>{u.zodiac.name}</span>
            </div>
            <div style={{ fontSize: 17, color: '#a898f8', fontWeight: 700, marginBottom: 2 }}>
              {typeData.name}
            </div>
            <div style={{ fontSize: 14, color: '#a898f8', letterSpacing: 2, marginBottom: 20 }}>
              {u.zodiac.keyword}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <ScoreRing score={r.score} />
              <div style={{ flex: 1, textAlign: 'left' }}>
                <div style={{ fontSize: 11, color: '#7888b8', marginBottom: 8 }}>タイミング診断</div>
                <div style={{
                  display: 'inline-block',
                  padding: '5px 12px',
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 700,
                  color: timingColors[r.timing] || '#f0c060',
                  border: `1px solid ${timingColors[r.timing] || '#f0c060'}44`,
                  background: `${timingColors[r.timing] || '#f0c060'}12`,
                }}>
                  {timingData.badge}
                </div>
              </div>
            </div>
          </div>

          {/* タイミングテキスト */}
          <div style={cardStyle}>
            <div style={rbHeadStyle}>🌙 今の星の声</div>
            <div style={{ fontSize: 13, color: '#dde4f8', lineHeight: 1.8 }}>
              {timingData.text}
            </div>
          </div>

          {/* 鑑定文 */}
          <div style={{
            ...cardStyle,
            background: 'linear-gradient(135deg, #1a1430, #0d1428)',
            border: '1px solid #7c6bdc44',
          }}>
            <div style={rbHeadStyle}>✦ ルナからのメッセージ</div>
            <p style={{ fontSize: 13, color: '#dde4f8', lineHeight: 1.9 }}>
              {kansenText}
            </p>
          </div>

          {/* 月ブロック */}
          <div style={cardStyle}>
            <div style={rbHeadStyle}>🌑 {moonData.head}</div>
            <div
              style={{ fontSize: 13, color: '#dde4f8', lineHeight: 1.8 }}
              dangerouslySetInnerHTML={{ __html: moonData.body.replace(/<em>/g, '<em style="color:#f0c060;font-style:normal">') }}
            />
          </div>

          {/* 土星ブロック */}
          <div style={cardStyle}>
            <div style={rbHeadStyle}>⛈️ {saturnData.head}</div>
            <div
              style={{ fontSize: 13, color: '#dde4f8', lineHeight: 1.8 }}
              dangerouslySetInnerHTML={{ __html: saturnData.body.replace(/<em>/g, '<em style="color:#f0c060;font-style:normal">') }}
            />
          </div>

          {/* アフィリブロック */}
          <AffiliBlock zodiacName={u.zodiac.name} typeData={typeData} />

          {/* 精密診断プロモ */}
          <div style={{
            ...cardStyle,
            border: '1px solid #a898f844',
            background: 'linear-gradient(135deg, #1a1430, #0d1428)',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>💎</div>
            <div style={{ fontFamily: 'var(--font-mincho)', fontSize: 17, fontWeight: 900, color: '#f0f4ff', marginBottom: 8 }}>
              もっと深く知りたい方へ
            </div>
            <div style={{ fontSize: 12, color: '#7888b8', lineHeight: 1.7, marginBottom: 16 }}>
              AIルナによる精密鑑定（LINEで受け取り）
              <br />生年月日×星読み×転職運の完全版レポート
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 18, textAlign: 'left' }}>
              {['本命星・月星座まで使った深い鑑定', '転職に向く職種・業界の絞り込み', '今後3ヶ月の行動アドバイス'].map(t => (
                <div key={t} style={{ fontSize: 12, color: '#dde4f8', display: 'flex', gap: 8 }}>
                  <span style={{ color: '#a898f8', fontSize: 9, marginTop: 3, flexShrink: 0 }}>✦</span>
                  {t}
                </div>
              ))}
            </div>
            <button
              onClick={() => router.push('/premium')}
              style={{
                width: '100%', padding: '13px 0',
                background: 'linear-gradient(135deg, #7c6bdc, #a898f8)',
                border: 'none', borderRadius: 10,
                color: '#fff', fontSize: 13, fontWeight: 700,
                cursor: 'pointer', fontFamily: 'var(--font-sans)',
                letterSpacing: 1,
              }}
            >
              💎 精密鑑定を受ける →
            </button>
          </div>

          {/* シェア */}
          <ShareBlock
            shareText={shareText}
            shareUrl={shareUrl}
          />

          {/* もう一度 */}
          <button
            onClick={handleRetry}
            style={{
              width: '100%', padding: 14,
              background: 'transparent',
              border: '1px solid #2a3f72',
              borderRadius: 12,
              color: '#7888b8', fontSize: 13,
              cursor: 'pointer', fontFamily: 'var(--font-sans)',
            }}
          >
            もう一度診断する
          </button>
        </div>
      </div>
    )
  }

  return null
}
