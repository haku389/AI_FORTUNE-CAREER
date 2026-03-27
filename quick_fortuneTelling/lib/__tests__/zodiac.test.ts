import { describe, it, expect } from 'vitest'
import { getZodiac, ZODIAC } from '../zodiac'

describe('getZodiac', () => {
  it('境界前は前の星座を返す', () => {
    expect(getZodiac(1, 19).name).toBe('山羊座')  // 1/19 は山羊座
    expect(getZodiac(3, 20).name).toBe('魚座')    // 3/20 は魚座
    expect(getZodiac(12, 21).name).toBe('射手座') // 12/21 は射手座
  })

  it('境界日以降は次の星座を返す', () => {
    expect(getZodiac(1, 20).name).toBe('水瓶座')  // 1/20 から水瓶座
    expect(getZodiac(3, 21).name).toBe('牡羊座')  // 3/21 から牡羊座
    expect(getZodiac(12, 22).name).toBe('山羊座') // 12/22 から山羊座
  })

  it('各月の代表日を正しく判定する', () => {
    const cases: [number, number, string][] = [
      [4, 1,  '牡羊座'],
      [5, 1,  '牡牛座'],
      [6, 1,  '双子座'],
      [7, 1,  '蟹座'],
      [8, 1,  '獅子座'],
      [9, 1,  '乙女座'],
      [10, 1, '天秤座'],
      [11, 1, '蠍座'],
      [12, 1, '射手座'],
      [1, 1,  '山羊座'],
      [2, 1,  '水瓶座'],
      [3, 1,  '魚座'],
    ]
    for (const [m, d, name] of cases) {
      expect(getZodiac(m, d).name).toBe(name)
    }
  })

  it('返値に必要なフィールドが揃っている', () => {
    const z = getZodiac(6, 15)
    expect(z).toHaveProperty('name')
    expect(z).toHaveProperty('en')
    expect(z).toHaveProperty('emoji')
    expect(z).toHaveProperty('keyword')
  })

  it('ZODIAC配列が12要素である', () => {
    expect(ZODIAC).toHaveLength(12)
  })
})
