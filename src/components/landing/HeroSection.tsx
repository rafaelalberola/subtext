'use client'

import PlatformCarousel from '@/components/landing/PlatformCarousel'
import FreeAnalysisInput from '@/components/landing/FreeAnalysisInput'
import { useI18n } from '@/lib/i18n'
import { ChevronDown } from 'lucide-react'

interface HeroSectionProps {
  onSubmit: (data: { text?: string; screenshot?: string; honeypot?: string }) => void
  isLoading: boolean
  error?: string | null
}

export default function HeroSection({ onSubmit, isLoading, error }: HeroSectionProps) {
  const { t } = useI18n()

  const heroText = t('landing_hero_v2')
  const accentWord = t('landing_hero_accent')
  const parts = heroText.split(accentWord)

  return (
    <section>
      {/* Full-viewport hero with centered content */}
      <div className="min-h-[calc(100dvh-128px)] flex flex-col items-center justify-center relative">
        {/* Ambient glow — breaks out of max-w container to fill viewport */}
        <div className="absolute -top-20 -bottom-40 left-1/2 w-screen overflow-hidden pointer-events-none opacity-40 md:opacity-60" style={{ transform: 'translateX(-50%)', maskImage: 'linear-gradient(to bottom, black 40%, transparent 80%)', WebkitMaskImage: 'linear-gradient(to bottom, black 40%, transparent 80%)' }}>
          <div className="absolute -inset-[30%] animate-glow-breathe" style={{ willChange: 'transform' }}>
            {/* Amber — top right */}
            <div className="absolute top-[5%] right-[5%] w-[60%] h-[50%] rounded-full blur-[60px] sm:blur-[140px]" style={{ backgroundColor: 'rgba(255,160,40,0.18)' }} />
            {/* Rose — upper center-right */}
            <div className="absolute top-[12%] right-[15%] w-[50%] h-[40%] rounded-full blur-[55px] sm:blur-[130px]" style={{ backgroundColor: 'rgba(255,77,141,0.14)' }} />
            {/* Sky blue — bottom left */}
            <div className="absolute bottom-[8%] left-[5%] w-[60%] h-[50%] rounded-full blur-[60px] sm:blur-[140px]" style={{ backgroundColor: 'rgba(0,191,255,0.16)' }} />
            {/* Violet — mid left */}
            <div className="absolute top-[28%] left-[5%] w-[45%] h-[45%] rounded-full blur-[50px] sm:blur-[120px]" style={{ backgroundColor: 'rgba(155,89,182,0.12)' }} />
            {/* Mint — bottom center */}
            <div className="absolute bottom-[12%] left-[25%] w-[50%] h-[40%] rounded-full blur-[55px] sm:blur-[130px]" style={{ backgroundColor: 'rgba(0,206,209,0.14)' }} />
          </div>
        </div>

        <div className="text-center flex flex-col gap-4 w-full relative z-10">
          <div className="flex flex-col gap-4">
            <h1 className="font-serif text-display text-text-primary leading-tight mx-auto opacity-0 animate-fade-in-up whitespace-nowrap" style={{ animationFillMode: 'forwards' }}>
              {parts[0]}
              <span className="text-accent">{accentWord}</span>
              {parts[1]}
            </h1>
            <p className="text-body text-text-secondary max-w-[320px] md:max-w-md mx-auto opacity-0 animate-fade-in-up" style={{ animationDelay: '100ms', animationFillMode: 'forwards', textWrap: 'balance' } as React.CSSProperties}>
              {t('landing_subtitle_v2')}
            </p>
          </div>

          <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
            <FreeAnalysisInput
              onSubmit={onSubmit}
              isLoading={isLoading}
              error={error}
            />
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 inset-x-0 mx-auto w-fit flex flex-col items-center gap-1 opacity-0 animate-fade-in-up z-10" style={{ animationDelay: '800ms', animationFillMode: 'forwards' }}>
          <span className="text-[11px] text-text-tertiary font-medium tracking-wide uppercase">{t('scroll_discover')}</span>
          <ChevronDown size={16} strokeWidth={1.5} className="text-text-tertiary animate-bounce-subtle" />
        </div>
      </div>

      <PlatformCarousel />
    </section>
  )
}
