import BottomNav from '@/components/BottomNav'
import { ToastProvider } from '@/components/ui/Toast'
import I18nProvider from '@/components/I18nProvider'
import { SubscriptionProvider } from '@/lib/subscription-context'

export const dynamic = 'force-dynamic'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <I18nProvider>
      <ToastProvider>
        <SubscriptionProvider>
          <div className="min-h-screen bg-bg-primary pb-44">
            <main className="max-w-2xl mx-auto px-section pt-8">
              {children}
            </main>
            <BottomNav />
          </div>
        </SubscriptionProvider>
      </ToastProvider>
    </I18nProvider>
  )
}
