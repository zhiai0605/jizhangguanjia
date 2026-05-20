import { useState, useEffect } from 'react'
import { Plus, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import StatusBar from '@/components/StatusBar'
import TotalAssetCard from '@/components/TotalAssetCard'
import AssetChart from '@/components/AssetChart'
import AssetCard from '@/components/AssetCard'
import { useAssetStore } from '@/store/assetStore'
import { useAuthStore } from '@/store/authStore'

export default function Home() {
  const navigate = useNavigate()
  const assets = useAssetStore((s) => s.assets)
  const user = useAuthStore((s) => s.user)
  const [greeting, setGreeting] = useState('')

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 6) setGreeting('夜深了')
    else if (hour < 9) setGreeting('早上好')
    else if (hour < 12) setGreeting('上午好')
    else if (hour < 14) setGreeting('中午好')
    else if (hour < 18) setGreeting('下午好')
    else setGreeting('晚上好')
  }, [])

  const groupedAssets = {
    bank: assets.filter((a) => a.type === 'bank'),
    wechat: assets.filter((a) => a.type === 'wechat'),
    alipay: assets.filter((a) => a.type === 'alipay'),
  }

  const sectionLabels: Record<string, string> = {
    bank: '储蓄卡',
    wechat: '微信钱包',
    alipay: '支付宝',
  }

  return (
    <div className="min-h-dvh bg-surface text-white overflow-y-auto">
      <StatusBar />

      <div className="px-4 pb-24">
        <div
          className="flex items-center justify-between mb-5 px-2"
          style={{ animation: 'fadeInUp 0.6s ease-out forwards', opacity: 0 }}
        >
          <div>
            <h1 className="text-xl font-semibold tracking-tight">{greeting} 👋</h1>
            <p className="text-xs text-white/35 mt-0.5">
              {user?.nickname || '用户'} · 今天也要好好记账哦
            </p>
          </div>
          <div>
            <button
              onClick={() => navigate('/profile')}
              className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-white/10 hover:shadow-[0_0_12px_rgba(0,240,255,0.1)] transition-all duration-200"
            >
              <User size={18} className="text-accent" />
            </button>
          </div>
        </div>

        <div className="mb-5">
          <TotalAssetCard />
        </div>

        <div className="mb-5">
          <AssetChart />
        </div>

        <div className="mb-6">
          <div
            className="flex items-center justify-between mb-4 px-1"
            style={{ animation: 'fadeInUp 0.6s ease-out 0.25s forwards', opacity: 0 }}
          >
            <h2 className="text-sm font-medium text-white/80">资产明细</h2>
            {assets.length > 0 && (
              <span className="text-[11px] text-white/30">{assets.length} 项资产</span>
            )}
          </div>

          {assets.length === 0 ? (
            <div
              className="glass-card rounded-2xl p-10 text-center"
              style={{ animation: 'fadeInUp 0.6s ease-out 0.3s forwards', opacity: 0 }}
            >
              <div className="text-4xl mb-3 opacity-30">📭</div>
              <p className="text-sm text-white/40 mb-1">还没有添加任何资产</p>
              <p className="text-xs text-white/20">点击下方按钮开始添加</p>
            </div>
          ) : (
            <div className="space-y-5">
              {Object.entries(groupedAssets).map(([type, items]) => {
                if (items.length === 0) return null
                return (
                  <div key={type}>
                    <div
                      className="flex items-center gap-2 mb-3 px-1"
                      style={{
                        animation: `fadeInUp 0.4s ease-out forwards`,
                        opacity: 0,
                      }}
                    >
                      <div className="h-px flex-1 bg-white/5" />
                      <span className="text-[10px] text-white/25 tracking-widest uppercase">
                        {sectionLabels[type]}
                      </span>
                      <div className="h-px flex-1 bg-white/5" />
                    </div>
                    <div className="space-y-3">
                      {items.map((asset) => (
                        <AssetCard key={asset.id} asset={asset} index={items.indexOf(asset)} />
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <button
        onClick={() => navigate('/add')}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-accent shadow-[0_0_24px_rgba(0,240,255,0.35)] flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-200 z-50"
      >
        <Plus size={24} className="text-surface" strokeWidth={2.5} />
      </button>
    </div>
  )
}