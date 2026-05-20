import { ChevronRight, Edit3 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { AssetItem } from '@/types'

interface AssetCardProps {
  asset: AssetItem
  index: number
}

const TYPE_LABELS: Record<string, string> = {
  bank: '储蓄卡',
  wechat: '微信',
  alipay: '支付宝',
}

function formatAmount(amount: number): string {
  return amount.toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export default function AssetCard({ asset, index }: AssetCardProps) {
  const navigate = useNavigate()
  const delay = 100 + index * 80

  return (
    <div
      className="glass-card rounded-2xl overflow-hidden"
      style={{
        animation: `slideUp 0.5s ease-out ${delay}ms forwards`,
        opacity: 0,
      }}
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
              style={{ backgroundColor: `${asset.color}20` }}
            >
              {asset.icon}
            </div>
            <div>
              <h3 className="text-white font-medium text-sm leading-tight">{asset.name}</h3>
              <span className="text-[11px] text-white/35">
                {TYPE_LABELS[asset.type]}
              </span>
            </div>
          </div>
          <button
            onClick={() => navigate(`/edit/${asset.id}`)}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/5 transition-colors"
          >
            <Edit3 size={14} className="text-white/35" />
          </button>
        </div>

        <div className="space-y-1.5 mb-3">
          {asset.subAccounts.map((sub) => (
            <div key={sub.id} className="flex items-center justify-between pl-[52px]">
              <span className="text-xs text-white/45">{sub.name}</span>
              <span className="text-xs text-white/70 font-mono font-medium">
                ¥{formatAmount(sub.balance)}
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-2.5 border-t border-white/5">
          <span className="text-[11px] text-white/35">总计</span>
          <div className="flex items-center gap-0.5">
            <span className="text-sm text-accent font-mono font-semibold">
              ¥{formatAmount(asset.balance)}
            </span>
            <ChevronRight size={14} className="text-white/20" />
          </div>
        </div>
      </div>
    </div>
  )
}