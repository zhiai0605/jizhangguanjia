import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js'
import { useAssetStore } from '@/store/assetStore'

ChartJS.register(ArcElement, Tooltip)

const TYPE_CONFIG: Record<string, { label: string; color: string; icon: string }> = {
  bank: { label: '储蓄卡', color: '#00F0FF', icon: '🏦' },
  wechat: { label: '微信', color: '#07C160', icon: '💬' },
  alipay: { label: '支付宝', color: '#1677FF', icon: '🔵' },
}

function formatAmount(amount: number): string {
  return '¥' + amount.toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export default function AssetChart() {
  const assets = useAssetStore((s) => s.assets)

  const balancesByType = {
    bank: assets.filter((a) => a.type === 'bank').reduce((s, a) => s + a.balance, 0),
    wechat: assets.filter((a) => a.type === 'wechat').reduce((s, a) => s + a.balance, 0),
    alipay: assets.filter((a) => a.type === 'alipay').reduce((s, a) => s + a.balance, 0),
  }

  const total = Object.values(balancesByType).reduce((s, v) => s + v, 0)
  const hasData = total > 0

  const labels = Object.entries(balancesByType)
    .filter(([, v]) => v > 0)
    .map(([k]) => TYPE_CONFIG[k].label)

  const dataValues = Object.entries(balancesByType)
    .filter(([, v]) => v > 0)
    .map(([, v]) => v)

  const backgroundColors = Object.entries(balancesByType)
    .filter(([, v]) => v > 0)
    .map(([k]) => TYPE_CONFIG[k].color)

  const chartData = {
    labels,
    datasets: [
      {
        data: hasData ? dataValues : [1],
        backgroundColor: hasData ? backgroundColors : ['rgba(255,255,255,0.05)'],
        borderColor: hasData ? backgroundColors.map(() => 'transparent') : ['transparent'],
        borderWidth: 0,
        hoverOffset: 4,
        spacing: 3,
      },
    ],
  }

  const options = {
    cutout: '78%',
    radius: '90%',
    plugins: {
      tooltip: {
        enabled: hasData,
        backgroundColor: 'rgba(10, 10, 15, 0.9)',
        titleColor: '#fff',
        bodyColor: '#fff',
        padding: 10,
        cornerRadius: 8,
        callbacks: {
          label: (ctx: any) => {
            const value = ctx.parsed as number
            const pct = total > 0 ? ((value / total) * 100).toFixed(1) : '0'
            return `${formatAmount(value)} (${pct}%)`
          },
        },
      },
    },
    maintainAspectRatio: false,
  }

  return (
    <div
      className="glass-card rounded-2xl p-5"
      style={{ animation: 'fadeInUp 0.6s ease-out 0.15s forwards', opacity: 0 }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-accent shadow-[0_0_6px_rgba(0,240,255,0.5)]" />
        </div>
        <h2 className="text-white/80 text-sm font-medium tracking-wide">资产分布</h2>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative w-[120px] h-[120px] shrink-0">
          <Doughnut data={chartData} options={options as any} />
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className="text-[10px] text-white/35">总计</span>
            <span className="text-sm font-mono font-bold gradient-text">
              {formatAmount(total)}
            </span>
          </div>
        </div>

        <div className="flex-1 space-y-3">
          {Object.entries(balancesByType).map(([type, balance]) => (
            <div key={type} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: TYPE_CONFIG[type].color }}
                />
                <span className="text-xs text-white/60">{TYPE_CONFIG[type].label}</span>
              </div>
              <span className="text-xs font-mono text-white/80 font-medium">
                {total > 0 ? ((balance / total) * 100).toFixed(1) : '0.0'}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}