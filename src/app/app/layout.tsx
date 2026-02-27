import BottomNav from '@/components/BottomNav'
import DesktopSidebar from '@/components/DesktopSidebar'
import AppShell from '@/components/AppShell'
import AppContent from '@/components/AppContent'
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
          <AppShell>
            <DesktopSidebar />
            <AppContent>{children}</AppContent>
            <BottomNav />
          </AppShell>
        </SubscriptionProvider>
      </ToastProvider>
    </I18nProvider>
  )
}
