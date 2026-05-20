import { Signal, Wifi, BatteryFull } from 'lucide-react'

export default function StatusBar() {
  const now = new Date()
  const time = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0')

  return (
    <div className="flex items-center justify-between px-6 py-3 text-xs text-white/60">
      <span className="font-medium tracking-tight">{time}</span>
      <div className="flex items-center gap-1.5">
        <Signal size={14} strokeWidth={1.5} />
        <Wifi size={14} strokeWidth={1.5} />
        <div className="relative">
          <BatteryFull size={14} strokeWidth={1.5} className="text-white/60" />
          <div className="absolute inset-[3px] right-[3px] rounded-[1px] bg-white/60" />
        </div>
      </div>
    </div>
  )
}