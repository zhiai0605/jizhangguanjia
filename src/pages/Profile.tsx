import { useNavigate } from 'react-router-dom'
import { ArrowLeft, LogOut, Mail, User as UserIcon, Shield } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'

export default function Profile() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
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
          <h1 className="text-sm font-medium text-white/80">个人主页</h1>
          <div className="w-9" />
        </div>

        <div
          className="text-center mb-8"
          style={{ animation: 'fadeInUp 0.5s ease-out forwards', opacity: 0 }}
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent/10 mb-4">
            <span className="text-3xl font-bold text-accent">
              {user?.nickname?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          </div>
          <h2 className="text-lg font-semibold">{user?.nickname || '用户'}</h2>
          <p className="text-xs text-white/40 mt-1">{user?.email}</p>
        </div>

        <div
          className="glass-card rounded-2xl divide-y divide-white/[0.04] overflow-hidden"
          style={{ animation: 'fadeInUp 0.5s ease-out 0.1s forwards', opacity: 0 }}
        >
          <div className="px-5 py-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center">
              <Mail size={16} className="text-white/50" />
            </div>
            <div>
              <p className="text-xs text-white/35">邮箱</p>
              <p className="text-sm text-white/80">{user?.email}</p>
            </div>
          </div>
          <div className="px-5 py-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center">
              <UserIcon size={16} className="text-white/50" />
            </div>
            <div>
              <p className="text-xs text-white/35">昵称</p>
              <p className="text-sm text-white/80">{user?.nickname}</p>
            </div>
          </div>
          <div className="px-5 py-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center">
              <Shield size={16} className="text-white/50" />
            </div>
            <div>
              <p className="text-xs text-white/35">账户类型</p>
              <p className="text-sm text-white/80">本地账户</p>
            </div>
          </div>
        </div>

        <div
          className="mt-6"
          style={{ animation: 'fadeInUp 0.5s ease-out 0.15s forwards', opacity: 0 }}
        >
          <button
            onClick={handleLogout}
            className="w-full glass-card rounded-2xl px-5 py-4 flex items-center gap-3 hover:bg-white/[0.02] transition-colors group"
          >
            <div className="w-9 h-9 rounded-xl bg-negative/10 flex items-center justify-center group-hover:bg-negative/15 transition-colors">
              <LogOut size={16} className="text-negative" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm text-negative font-medium">退出登录</p>
              <p className="text-xs text-white/30">退出后将返回登录页面</p>
            </div>
          </button>
        </div>

        <div
          className="text-center mt-8"
          style={{ animation: 'fadeInUp 0.5s ease-out 0.2s forwards', opacity: 0 }}
        >
          <p className="text-[10px] text-white/15">记账管家 v1.0 · 数据仅保存在本地</p>
        </div>
      </div>
    </div>
  )
}