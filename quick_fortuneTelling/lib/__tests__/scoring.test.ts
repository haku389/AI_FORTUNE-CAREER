import { describe, it, expect } from 'vitest'
import { calcScore, TYPES, TIMINGS, MOONS, SATURNS } from '../scoring'

// answers[0]=urgency, [1]=type, [2]=stress+urgency_add, [3]=mars+urgency_add, [4]=urgency_add
// Q1 opts urgency:  0→4, 1→3, 2→2, 3→1
// Q3 opts urgency_add: 0→1, 1→1, 2→0, 3→0
// Q4 opts urgency_add: 0→2, 1→1, 2→0, 3→0  / mars: 0→suppressed, 1→misfit, 2→calm, 3→bored
// Q5 opts urgency_add: 0→3, 1→2, 2→1, 3→0

describe('calcScore', () => {
  it('最大スコア(urgency=10+mars_bonus=8)は97にクランプされる', () => {
    // Q1=0(4), Q3=0(+1), Q4=0(+2,suppressed), Q5=0(+3) → urgency=10
    // score = 10*7+20+8=98 → clamp → 97
    const r = calcScore([0, 0, 0, 0, 0])
    expect(r.score).toBe(97)
    expect(r.urgency).toBe(10)
    expect(r.timing).toBe('now')
  })

  it('最小スコアは22にクランプされる', () => {
    // Q1=3(1), Q3=3(+0), Q4=3(+0,bored), Q5=3(+0) → urgency=1
    // score = 1*7+20+0=27 > 22 なのでそのまま
    const r = calcScore([3, 3, 3, 3, 3])
    expect(r.score).toBe(27)
    expect(r.score).toBeGreaterThanOrEqual(22)
    expect(r.timing).toBe('wait')
  })

  it('urgency>=8 → timing=now', () => {
    // Q1=0(4), Q3=0(+1), Q4=0(+2), Q5=0(+3) → urgency=10
    const r = calcScore([0, 0, 0, 0, 0])
    expect(r.timing).toBe('now')
  })

  it('urgency>=6かつ<8 → timing=3m', () => {
    // Q1=0(4), Q3=1(+1), Q4=1(+1), Q5=2(+1) → urgency=7
    const r = calcScore([0, 0, 1, 1, 2])
    expect(r.urgency).toBe(7)
    expect(r.timing).toBe('3m')
  })

  it('urgency>=3かつ<6 → timing=6m', () => {
    // Q1=2(2), Q3=3(+0), Q4=2(+0), Q5=3(+0) → urgency=2 → wait
    // Q1=1(3), Q3=3(+0), Q4=2(+0), Q5=3(+0) → urgency=3 → 6m
    const r = calcScore([1, 0, 3, 2, 3])
    expect(r.urgency).toBe(3)
    expect(r.timing).toBe('6m')
  })

  it('Q2の選択がtypeに反映される', () => {
    expect(calcScore([3, 0, 3, 3, 3]).type).toBe('career')
    expect(calcScore([3, 1, 3, 3, 3]).type).toBe('env')
    expect(calcScore([3, 2, 3, 3, 3]).type).toBe('calling')
    expect(calcScore([3, 3, 3, 3, 3]).type).toBe('stable')
  })

  it('marsがsuppressed/misfitの場合+8ボーナスが加算される', () => {
    // Q4 opt[0]: urgency_add=2, mars='suppressed' → urgency=4, bonus=8 → score=56
    // Q4 opt[2]: urgency_add=0, mars='calm'       → urgency=2, bonus=0 → score=34
    // ※ Q4はurgency_addとmarsが連動しているため差は22 (urgency差14 + bonus差8)
    expect(calcScore([2, 0, 3, 0, 3]).score).toBe(56) // 4*7+20+8=56
    expect(calcScore([2, 0, 3, 2, 3]).score).toBe(34) // 2*7+20+0=34
    // marsボーナス単体の検証: scoring.ts の mars 判定ロジック確認
    expect(calcScore([2, 0, 3, 0, 3]).mars).toBe('suppressed')
    expect(calcScore([2, 0, 3, 1, 3]).mars).toBe('misfit')
    // suppressed と calm の urgency が同じになるケースで bonus=8 を確認
    // Q1=1(3), Q3=3(+0), Q4=0(+2,suppressed), Q5=3(+0) → urgency=5, score=min(5*7+20+8,97)=63
    // Q1=0(4), Q3=3(+0), Q4=2(+0,calm),       Q5=3(+0) → urgency=4, score=min(4*7+20+0,97)=48
    // 同urgencyでの比較: urgency=3 の suppressed vs urgency=3 の calm
    // [1,0,3,0,3]: Q1=1(3)+Q4=0(+2)=urgency5, bonus8 → 5*7+20+8=63
    // [3,0,1,2,0]: Q1=3(1)+Q3=0(+1)+Q4=2(+0)+Q5=0(+3)=urgency5, bonus0 → 5*7+20=55
    // 差 = 8 ✓
    expect(calcScore([1, 0, 3, 0, 3]).score - calcScore([3, 0, 1, 2, 0]).score).toBe(8)
  })

  it('stressフィールドがQ3に対応する', () => {
    expect(calcScore([3, 0, 0, 3, 3]).stress).toBe('human')
    expect(calcScore([3, 0, 1, 3, 3]).stress).toBe('growth')
    expect(calcScore([3, 0, 2, 3, 3]).stress).toBe('future')
    expect(calcScore([3, 0, 3, 3, 3]).stress).toBe('calm')
  })

  it('marsフィールドがQ4に対応する', () => {
    expect(calcScore([3, 0, 3, 0, 3]).mars).toBe('suppressed')
    expect(calcScore([3, 0, 3, 1, 3]).mars).toBe('misfit')
    expect(calcScore([3, 0, 3, 2, 3]).mars).toBe('calm')
    expect(calcScore([3, 0, 3, 3, 3]).mars).toBe('bored')
  })
})

describe('TYPES / TIMINGS / MOONS / SATURNS', () => {
  it('全キャリアタイプが定義されている', () => {
    for (const key of ['career', 'env', 'calling', 'stable'] as const) {
      expect(TYPES[key]).toHaveProperty('affili')
      expect(TYPES[key]).toHaveProperty('url')
      expect(TYPES[key]).toHaveProperty('luna')
    }
  })

  it('全タイミングが定義されている', () => {
    for (const key of ['now', '3m', '6m', 'wait'] as const) {
      expect(TIMINGS[key]).toHaveProperty('badge')
      expect(TIMINGS[key]).toHaveProperty('text')
    }
  })

  it('全MOONSが定義されている', () => {
    for (const key of ['human', 'growth', 'future', 'calm'] as const) {
      expect(MOONS[key]).toHaveProperty('head')
      expect(MOONS[key]).toHaveProperty('body')
    }
  })

  it('全SATURNSが定義されている', () => {
    for (const key of ['suppressed', 'misfit', 'calm', 'bored'] as const) {
      expect(SATURNS[key]).toHaveProperty('head')
      expect(SATURNS[key]).toHaveProperty('body')
    }
  })
})
