import { ChevronLeft } from 'lucide-react'
import AvatarCircle from './AvatarCircle'

interface ChatHeaderProps {
  name: string
  online?: boolean
}

export default function ChatHeader({ name, online = true }: ChatHeaderProps) {
  return (
    <div className="bg-wa-green-dark px-3 py-2.5 flex items-center gap-3">
      <ChevronLeft size={20} className="text-white/80" strokeWidth={1.5} />
      <AvatarCircle name={name} size={34} />
      <div className="flex flex-col">
        <span className="text-white text-[15px] font-medium leading-tight">{name}</span>
        {online && (
          <span className="text-[12px] text-white/70 leading-tight">online</span>
        )}
      </div>
    </div>
  )
}
