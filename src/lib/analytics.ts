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

function trackCustomEvent(eventName: string, params?: Record<string, unknown>) {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('trackCustom', eventName, params)
  }
}

export const analytics = {
  // Standard Meta events
  pageView: () => trackEvent('PageView'),
  lead: () => trackEvent('Lead'),
  signUp: () => trackEvent('CompleteRegistration'),
  viewContent: (contentName: string) =>
    trackEvent('ViewContent', { content_name: contentName }),
  initiateCheckout: (plan: string, value: number) =>
    trackEvent('InitiateCheckout', { content_name: plan, value, currency: 'USD' }),
  purchase: (value: number) =>
    trackEvent('Purchase', { value, currency: 'USD' }),

  // Custom events
  freeAnalysisStarted: () => trackCustomEvent('FreeAnalysisStarted'),
  freeAnalysisCompleted: () => trackCustomEvent('FreeAnalysisCompleted'),
  analysisCompleted: () => trackCustomEvent('AnalysisCompleted'),
  postAnalysisSignupShown: () => trackCustomEvent('PostAnalysisSignupShown'),
  postAnalysisSignupCompleted: () => trackCustomEvent('PostAnalysisSignupCompleted'),
  postAnalysisSignupDismissed: () => trackCustomEvent('PostAnalysisSignupDismissed'),
  upgradeModalViewed: () => trackCustomEvent('UpgradeModalViewed'),
}
