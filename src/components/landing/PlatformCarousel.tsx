'use client'

import { useRef, useState, useEffect } from 'react'
import PlatformCard from './PlatformCard'

type Platform = 'whatsapp' | 'tinder' | 'messenger'
const platforms: Platform[] = ['whatsapp', 'tinder', 'messenger']

export default function PlatformCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const handleScroll = () => {
      const scrollLeft = el.scrollLeft
      const cardWidth = el.scrollWidth / platforms.length
      const index = Math.round(scrollLeft / cardWidth)
      setActiveIndex(Math.min(index, platforms.length - 1))
    }
    el.addEventListener('scroll', handleScroll, { passive: true })
    return () => el.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToIndex = (index: number) => {
    const el = scrollRef.current
    if (!el) return
    const cards = el.children
    if (cards[index]) {
      (cards[index] as HTMLElement).scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      })
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Scroll container with edge fade */}
      <div className="relative -mx-section">
        <div
          ref={scrollRef}
          className="flex items-stretch gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory pl-section pr-6 md:px-[calc(50%-170px)] bg-transparent"
        >
          {platforms.map((platform, i) => (
            <div key={platform} className="snap-center flex-shrink-0 w-[85vw] max-w-[340px] flex">
              <PlatformCard platform={platform} animationDelay={400 + i * 200} />
            </div>
          ))}
        </div>

        {/* Left fade */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-6 md:w-16 bg-gradient-to-r from-white to-transparent" />
        {/* Right fade */}
        <div className="pointer-events-none absolute inset-y-0 right-0 w-6 md:w-16 bg-gradient-to-l from-white to-transparent" />
      </div>

      {/* Dot indicators */}
      <div className="flex items-center justify-center gap-2">
        {platforms.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to conversation ${i + 1}`}
            className={`h-2 rounded-full transition-all duration-200 ${
              i === activeIndex ? 'bg-accent w-6' : 'bg-border w-2'
            }`}
            onClick={() => scrollToIndex(i)}
          />
        ))}
      </div>
    </div>
  )
}
