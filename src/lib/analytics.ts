declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
  }
}

function trackEvent(eventName: string, params?: Record<string, unknown>) {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, params)
  }
}

export const analytics = {
  pageView: () => trackEvent('PageView'),
  lead: () => trackEvent('Lead'),
  signUp: () => trackEvent('CompleteRegistration'),
  firstAnalysis: () => trackEvent('ViewContent', { content_name: 'first_analysis' }),
  viewPricing: () => trackEvent('ViewContent', { content_name: 'pricing' }),
  initiateCheckout: (plan: string, value: number) =>
    trackEvent('InitiateCheckout', { content_name: plan, value, currency: 'USD' }),
  subscribe: (value: number) =>
    trackEvent('Subscribe', { value, currency: 'USD' }),
  purchase: (value: number) =>
    trackEvent('Purchase', { value, currency: 'USD' }),
}
