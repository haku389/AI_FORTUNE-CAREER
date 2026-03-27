import { describe, it, expect } from 'vitest'
import { getKansen } from '../kansen'
import { ZODIAC } from '../zodiac'

describe('getKansen', () => {
  it('ニックネームが鑑定文に含まれる', () => {
    for (const z of ZODIAC) {
      const text = getKansen(z, 'テスト')
      expect(text).toContain('テスト')
    }
  })

  it('全12星座で文字列を返す', () => {
    for (const z of ZODIAC) {
      const text = getKansen(z, 'ルナ')
      expect(typeof text).toBe('string')
      expect(text.length).toBeGreaterThan(10)
    }
  })

  it('{n}プレースホルダーが残らない', () => {
    for (const z of ZODIAC) {
      const text = getKansen(z, 'さくら')
      expect(text).not.toContain('{n}')
    }
  })

  it('存在しない星座名でもフォールバックする', () => {
    const fake = { name: '存在しない星座', en: 'Unknown', emoji: '❓', keyword: 'test' }
    const text = getKansen(fake, 'テスト')
    expect(typeof text).toBe('string')
    expect(text).toContain('テスト')
  })
})
