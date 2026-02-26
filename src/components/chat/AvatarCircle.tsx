interface AvatarCircleProps {
  name: string
  size?: number
}

const COLORS = ['#6366F1', '#EC4899', '#F59E0B', '#10B981', '#8B5CF6', '#EF4444']

export default function AvatarCircle({ name, size = 32 }: AvatarCircleProps) {
  const initial = name.charAt(0).toUpperCase()
  const colorIndex = name.charCodeAt(0) % COLORS.length
  const bgColor = COLORS[colorIndex]

  return (
    <div
      className="rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0"
      style={{ width: size, height: size, backgroundColor: bgColor, fontSize: size * 0.4 }}
    >
      {initial}
    </div>
  )
}
