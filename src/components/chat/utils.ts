import { DecodedPair } from '@/types/analysis'

export function classifySpeakers(pairs: DecodedPair[]): Map<string, 'left' | 'right'> {
  const map = new Map<string, 'left' | 'right'>()
  const youVariants = ['you', 'tú', 'tu', 'yo']

  for (const pair of pairs) {
    const speaker = pair.speaker?.trim()
    if (!speaker || map.has(speaker)) continue

    if (youVariants.includes(speaker.toLowerCase())) {
      map.set(speaker, 'right')
    } else if (map.size === 0) {
      map.set(speaker, 'left')
    } else if (!Array.from(map.values()).includes('right')) {
      map.set(speaker, 'right')
    } else {
      map.set(speaker, 'left')
    }
  }

  return map
}

export function groupConsecutiveSpeakers(pairs: DecodedPair[]): boolean[] {
  return pairs.map((pair, i) => {
    if (i === 0) return true
    return pair.speaker !== pairs[i - 1].speaker
  })
}
