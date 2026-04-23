export const GA_ID = 'G-EMNLLD2468'

type GtagFn = (...args: unknown[]) => void

export function trackEvent(eventName: string, params?: Record<string, string>) {
  if (typeof window !== 'undefined' && typeof (window as unknown as { gtag?: GtagFn }).gtag === 'function') {
    ;(window as unknown as { gtag: GtagFn }).gtag('event', eventName, params)
  }
}
