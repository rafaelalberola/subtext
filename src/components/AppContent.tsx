'use client'

import { useSidebar } from '@/components/AppShell'

export default function AppContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed, mounted } = useSidebar()

  return (
    <div
      className={`
        flex flex-col min-h-screen bg-bg-primary pb-44 md:pb-8
        ${mounted ? 'transition-[padding-left] duration-200 ease-out' : ''}
        ${isCollapsed ? 'md:pl-16' : 'md:pl-64'}
      `}
    >
      <main className="flex-1 flex flex-col px-section pt-4">
        {children}
      </main>
    </div>
  )
}
