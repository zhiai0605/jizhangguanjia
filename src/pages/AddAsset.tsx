import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Trash2, Banknote, MessageCircle, Circle, Plus, X } from 'lucide-react'
import { useAssetStore } from '@/store/assetStore'
import type { AssetType, SubAccount } from '@/types'

const ASSET_TYPES: { type: AssetType; label: string; icon: React.ReactNode; color: string }[] = [
  { type: 'bank', label: '储蓄卡', icon: <Banknote size={18} />, color: '#00F0FF' },
  { type: 'wechat', label: '微信', icon: <MessageCircle size={18} />, color: '#07C160' },
  { type: 'alipay', label: '支付宝', icon: <Circle size={18} />, color: '#1677FF' },
]

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

function formatInputAmount(value: string): string {
  const cleaned = value.replace(/[^\d.]/g, '')
  const parts = cleaned.split('.')
  if (parts.length > 2) return parts[0] + '.' + parts.slice(1).join('')
  if (parts[1]?.length > 2) return parts[0] + '.' + parts[1].slice(0, 2)
  return cleaned
}

export default function AddAsset() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = !!id
  const assets = useAssetStore((s) => s.assets)
  const addAsset = useAssetStore((s) => s.addAsset)
  const updateAsset = useAssetStore((s) => s.updateAsset)
  const deleteAsset = useAssetStore((s) => s.deleteAsset)

  const existingAsset = isEdit ? assets.find((a) => a.id === id) : null

  const [name, setName] = useState(existingAsset?.name || '')
  const [type, setType] = useState<AssetType>(existingAsset?.type || 'bank')
  const [balance, setBalance] = useState(existingAsset?.balance?.toString() || '')
  const [icon, setIcon] = useState(existingAsset?.icon || '')
  const [color, setColor] = useState(existingAsset?.color || '#00F0FF')
  const [subAccounts, setSubAccounts] = useState<SubAccount[]>(existingAsset?.subAccounts || [])
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const getDefaultIcon = (t: AssetType) => {
    switch (t) {
      case 'bank': return '🏦'
      case 'wechat': return '💬'
      case 'alipay': return '🔵'
    }
  }

  useEffect(() => {
    if (!existingAsset) {
      setIcon(getDefaultIcon(type))
    }
  }, [type])

  const handleTypeChange = (t: AssetType) => {
    setType(t)
    if (!existingAsset) {
      setIcon(getDefaultIcon(t))
      switch (t) {
        case 'bank': setColor('#00F0FF'); break
        case 'wechat': setColor('#07C160'); break
        case 'alipay': setColor('#1677FF'); break
      }
    }
  }

  const addSubAccount = () => {
    setSubAccounts([...subAccounts, { id: generateId(), name: '', balance: 0 }])
  }

  const updateSubAccount = (subId: string, field: 'name' | 'balance', value: string) => {
    setSubAccounts(subAccounts.map((s) => {
      if (s.id !== subId) return s
      if (field === 'balance') return { ...s, balance: parseFloat(formatInputAmount(value)) || 0 }
      return { ...s, name: value }
    }))
  }

  const removeSubAccount = (subId: string) => {
    setSubAccounts(subAccounts.filter((s) => s.id !== subId))
  }

  const handleSubmit = () => {
    if (!name.trim()) return
    const totalBalance = subAccounts.reduce((sum, s) => sum + s.balance, 0) || parseFloat(balance) || 0
    const validSubs = subAccounts.filter((s) => s.name.trim())

    if (isEdit && existingAsset) {
      updateAsset(id!, {
        name: name.trim(),
        type,
        balance: totalBalance,
        icon: icon || getDefaultIcon(type),
        color,
        subAccounts: validSubs.length > 0 ? validSubs : [],
      })
    } else {
      addAsset({
        name: name.trim(),
        type,
        balance: totalBalance,
        icon: icon || getDefaultIcon(type),
        color,
        subAccounts: validSubs.length > 0 ? validSubs : [],
      })
    }
    navigate('/')
  }

  const handleDelete = () => {
    if (existingAsset) {
      deleteAsset(existingAsset.id)
    }
    navigate('/')
  }

  return (
    <div className="min-h-dvh bg-surface text-white">
      <div className="px-4 pt-4 pb-6">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/')}
            className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            <ArrowLeft size={18} className="text-white/60" />
          </button>
          <h1 className="text-sm font-medium text-white/80">
            {isEdit ? '编辑资产' : '添加资产'}
          </h1>
          <div className="w-9" />
        </div>

        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-5">
            <label className="text-xs text-white/40 mb-3 block">资产类型</label>
            <div className="flex gap-3">
              {ASSET_TYPES.map((at) => (
                <button
                  key={at.type}
                  onClick={() => handleTypeChange(at.type)}
                  className={`flex-1 flex flex-col items-center gap-2 py-3.5 rounded-xl transition-all duration-200 ${
                    type === at.type
                      ? 'bg-white/10 border border-white/10'
                      : 'bg-white/[0.03] border border-white/[0.06] hover:bg-white/5'
                  }`}
                >
                  <span
                    className={`transition-colors ${
                      type === at.type ? 'text-white' : 'text-white/40'
                    }`}
                  >
                    {at.icon}
                  </span>
                  <span
                    className={`text-xs ${
                      type === at.type ? 'text-white/80' : 'text-white/35'
                    }`}
                  >
                    {at.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-2xl p-5 space-y-4">
            <div>
              <label className="text-xs text-white/40 mb-2 block">资产名称</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={type === 'bank' ? '例如：招商银行' : type === 'wechat' ? '微信' : '支付宝'}
                className="w-full bg-white/[0.04] border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:border-accent/30 transition-colors"
              />
            </div>

            <div>
              <label className="text-xs text-white/40 mb-2 block">图标 (Emoji)</label>
              <input
                type="text"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                placeholder={getDefaultIcon(type)}
                maxLength={2}
                className="w-full bg-white/[0.04] border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:border-accent/30 transition-colors"
              />
            </div>
          </div>

          <div className="glass-card rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs text-white/40">子账户</label>
              <button
                onClick={addSubAccount}
                className="flex items-center gap-1 text-xs text-accent hover:text-accent-dim transition-colors"
              >
                <Plus size={12} />
                添加子账户
              </button>
            </div>

            {subAccounts.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-xs text-white/25">暂无子账户，点击上方添加</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {subAccounts.map((sub) => (
                  <div key={sub.id} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={sub.name}
                      onChange={(e) => updateSubAccount(sub.id, 'name', e.target.value)}
                      placeholder="账户名称"
                      className="flex-1 bg-white/[0.04] border border-white/[0.06] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/20 focus:border-accent/30 transition-colors"
                    />
                    <div className="relative flex-[0.7]">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-white/30 font-mono">¥</span>
                      <input
                        type="text"
                        value={sub.balance > 0 ? sub.balance.toString() : ''}
                        onChange={(e) => updateSubAccount(sub.id, 'balance', e.target.value)}
                        placeholder="0.00"
                        className="w-full bg-white/[0.04] border border-white/[0.06] rounded-xl pl-7 pr-3.5 py-2.5 text-xs text-white placeholder-white/20 font-mono focus:border-accent/30 transition-colors"
                      />
                    </div>
                    <button
                      onClick={() => removeSubAccount(sub.id)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/5 transition-colors"
                    >
                      <X size={14} className="text-white/25" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 pt-3 border-t border-white/5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/40">合计金额</span>
                <span className="text-sm font-mono font-semibold text-accent">
                  ¥{(subAccounts.reduce((s, a) => s + a.balance, 0) || parseFloat(balance) || 0).toLocaleString('zh-CN', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            {isEdit && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-negative/10 border border-negative/20 text-negative text-sm font-medium hover:bg-negative/15 transition-all duration-200 flex-[0.4]"
              >
                <Trash2 size={16} />
              </button>
            )}
            <button
              onClick={handleSubmit}
              disabled={!name.trim()}
              className={`flex-1 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                name.trim()
                  ? 'bg-accent text-surface hover:shadow-[0_0_20px_rgba(0,240,255,0.25)]'
                  : 'bg-white/5 text-white/20'
              }`}
            >
              {isEdit ? '保存修改' : '添加资产'}
            </button>
          </div>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
          <div className="glass-card rounded-2xl p-6 w-full max-w-xs">
            <h3 className="text-sm font-medium text-white/80 mb-2">确认删除</h3>
            <p className="text-xs text-white/40 mb-5">删除后数据将无法恢复，确定要删除"{existingAsset?.name}"吗？</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2.5 rounded-xl bg-white/5 text-white/60 text-xs hover:bg-white/10 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-2.5 rounded-xl bg-negative/20 text-negative text-xs font-medium hover:bg-negative/30 transition-colors"
              >
                删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}