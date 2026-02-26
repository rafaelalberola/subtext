interface MessageBlockProps {
  text: string
  speaker?: string
  animated?: boolean
  delay?: number
}

export default function MessageBlock({
  text,
  speaker,
  animated = false,
  delay = 0,
}: MessageBlockProps) {
  return (
    <div
      className={`flex flex-col gap-1 ${animated ? 'opacity-0 animate-fade-in-up' : ''}`}
      style={animated ? { animationDelay: `${delay}ms`, animationFillMode: 'forwards' } : undefined}
    >
      {speaker && (
        <span className="text-caption font-semibold text-text-primary">
          {speaker}
        </span>
      )}
      <div className="relative bg-white rounded-lg rounded-tl-none rounded-b-none bubble-tail-left pt-2 pr-4 pb-2 pl-3 shadow-sm">
        <p className="text-[14.5px] leading-[19px] text-[#111B21]">
          {text}
        </p>
      </div>
    </div>
  )
}
