import { useState, useCallback } from 'react'
import { TrendingUp, TrendingDown, RefreshCw } from 'lucide-react'
import { useAssetStore } from '@/store/assetStore'

function formatAmount(amount: number): string {
  return amount.toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export default function TotalAssetCard() {
  const total = useAssetStore((s) => s.getTotalBalance())
  const assets = useAssetStore((s) => s.assets)
  const [refreshing, setRefreshing] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  const handleRefresh = useCallback(() => {
    setRefreshing(true)
    setCurrentTime(new Date())
    setTimeout(() => setRefreshing(false), 800)
  }, [])

  const latestUpdate = assets.length > 0
    ? currentTime.toLocaleString('zh-CN', {
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '暂无数据'

  return (
    <div
      className="relative overflow-hidden"
      style={{ animation: 'fadeInUp 0.6s ease-out 0.05s forwards', opacity: 0 }}
    >
      <div className="glass-card rounded-3xl p-6 relative z-10">
        <div className="absolute top-0 right-0 w-48 h-48 bg-accent-glow rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-white/45 tracking-wider">总资产净值</span>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-1.5 text-[10px] text-white/30 hover:text-white/50 transition-colors"
            >
              <RefreshCw
                size={10}
                className={refreshing ? 'animate-spin' : ''}
              />
              <span>{latestUpdate}</span>
            </button>
          </div>

          <div className="flex items-baseline gap-1 mb-3">
            <span className="text-lg text-white/30 font-mono font-light">¥</span>
            <span className="text-4xl font-mono font-bold tracking-tight text-white">
              {formatAmount(total)}
            </span>
          </div>

          {assets.length > 0 && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-positive/10 text-positive">
                <TrendingUp size={12} />
                <span>已同步</span>
              </div>
              <span className="text-[11px] text-white/30">{assets.length} 项资产</span>
            </div>
          )}
        </div>
      </div>

      <div className="absolute -bottom-2 left-4 right-4 h-4 bg-accent/5 rounded-b-2xl blur-sm" />
      <div className="absolute -bottom-4 left-8 right-8 h-4 bg-accent/3 rounded-b-2xl blur-sm" />
    </div>
  )
}