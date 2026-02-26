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
    'relative px-3 py-2 max-w-[85%] shadow-sm',
    isLeft ? 'bg-wa-bubble-in self-start' : 'bg-wa-bubble-out self-end',
    showTail
      ? isLeft
        ? 'rounded-lg rounded-tl-none bubble-tail-left ml-2'
        : 'rounded-lg rounded-tr-none bubble-tail-right mr-2'
      : 'rounded-lg',
    !showTail && isLeft ? 'ml-2' : '',
    !showTail && !isLeft ? 'mr-2' : '',
    animated ? 'opacity-0 animate-fade-in-up' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={`flex flex-col ${isLeft ? 'items-start' : 'items-end'}`}>
      {speaker && showTail && (
        <span className={`text-[11px] font-medium text-wa-green-dark mb-0.5 ${isLeft ? 'ml-2' : 'mr-2'}`}>
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
