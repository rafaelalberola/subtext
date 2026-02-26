import ReadReceipt from './ReadReceipt'

interface ChatBubbleProps {
  text: string
  side: 'left' | 'right'
  timestamp?: string
  showTail?: boolean
  readReceipt?: 'sent' | 'delivered' | 'read'
  speaker?: string
  animated?: boolean
  delay?: number
}

export default function ChatBubble({
  text,
  side,
  timestamp,
  showTail = false,
  readReceipt,
  speaker,
  animated = false,
  delay = 0,
}: ChatBubbleProps) {
  const isLeft = side === 'left'

  const bubbleClasses = [
    'relative pt-6 pr-6 pb-6 pl-4 shadow-sm',
    isLeft ? 'bg-wa-bubble-in' : 'bg-wa-bubble-out',
    showTail
      ? isLeft
        ? 'rounded-lg rounded-tl-none bubble-tail-left'
        : 'rounded-lg rounded-tr-none bubble-tail-right'
      : 'rounded-lg',
    animated ? 'opacity-0 animate-fade-in-up' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className="flex flex-col">
      {speaker && showTail && (
        <span className="text-[11px] font-medium text-wa-green-dark mb-0.5">
          {speaker}
        </span>
      )}
      <div
        className={bubbleClasses}
        style={animated ? { animationDelay: `${delay}ms`, animationFillMode: 'forwards' } : undefined}
      >
        <span className="text-[14.5px] leading-[19px] text-[#111B21]">
          {text}
        </span>
        {timestamp && (
          <span className="float-right mt-1 ml-2 flex items-center gap-0.5">
            <span className="text-[11px] text-wa-time leading-none">{timestamp}</span>
            {readReceipt && side === 'right' && <ReadReceipt status={readReceipt} />}
          </span>
        )}
      </div>
    </div>
  )
}
