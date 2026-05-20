import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Wallet, Eye, EyeOff, UserPlus } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'

export default function Register() {
  const navigate = useNavigate()
  const register = useAuthStore((s) => s.register)
  const [nickname, setNickname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPwd, setConfirmPwd] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!nickname.trim() || !email.trim() || !password.trim()) {
      setError('请填写所有字段')
      return
    }
    if (password.length < 6) {
      setError('密码长度不能少于6位')
      return
    }
    if (password !== confirmPwd) {
      setError('两次密码输入不一致')
      return
    }
    setLoading(true)
    setError('')

    setTimeout(() => {
      const success = register(email.trim(), nickname.trim(), password)
      if (success) {
        navigate('/', { replace: true })
      } else {
        setError('该邮箱已被注册，请直接登录')
      }
      setLoading(false)
    }, 400)
  }

  return (
    <div className="min-h-dvh bg-surface text-white flex flex-col">
      <div className="flex-1 flex flex-col justify-center px-6">
        <div
          className="text-center mb-8"
          style={{ animation: 'fadeInUp 0.6s ease-out forwards', opacity: 0 }}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-accent/10 mb-5">
            <Wallet size={32} className="text-accent" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">创建账号</h1>
          <p className="text-sm text-white/40 mt-2">注册后即可开始管理资产</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
          style={{ animation: 'fadeInUp 0.6s ease-out 0.1s forwards', opacity: 0 }}
        >
          {error && (
            <div className="glass-card-light rounded-xl px-4 py-3">
              <p className="text-xs text-negative">{error}</p>
            </div>
          )}

          <div className="glass-card rounded-2xl p-5 space-y-4">
            <div>
              <label className="text-xs text-white/40 mb-2 block">昵称</label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="输入你的昵称"
                className="w-full bg-white/[0.04] border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:border-accent/30 transition-colors"
              />
            </div>

            <div>
              <label className="text-xs text-white/40 mb-2 block">邮箱</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="输入邮箱地址"
                autoComplete="email"
                className="w-full bg-white/[0.04] border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:border-accent/30 transition-colors"
              />
            </div>

            <div>
              <label className="text-xs text-white/40 mb-2 block">密码</label>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="至少6位密码"
                  autoComplete="new-password"
                  className="w-full bg-white/[0.04] border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:border-accent/30 transition-colors pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/50 transition-colors"
                >
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs text-white/40 mb-2 block">确认密码</label>
              <input
                type={showPwd ? 'text' : 'password'}
                value={confirmPwd}
                onChange={(e) => setConfirmPwd(e.target.value)}
                placeholder="再次输入密码"
                autoComplete="new-password"
                className="w-full bg-white/[0.04] border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:border-accent/30 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
              loading
                ? 'bg-white/5 text-white/20'
                : 'bg-accent text-surface hover:shadow-[0_0_20px_rgba(0,240,255,0.25)]'
            }`}
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
            ) : (
              <UserPlus size={16} />
            )}
            <span>{loading ? '注册中...' : '注册'}</span>
          </button>
        </form>

        <div
          className="text-center mt-8"
          style={{ animation: 'fadeInUp 0.6s ease-out 0.2s forwards', opacity: 0 }}
        >
          <span className="text-xs text-white/30">已有账号？</span>
          <Link
            to="/login"
            className="text-xs text-accent ml-1.5 hover:text-accent-dim transition-colors"
          >
            立即登录
          </Link>
        </div>
      </div>

      <div
        className="text-center pb-8"
        style={{ animation: 'fadeInUp 0.6s ease-out 0.25s forwards', opacity: 0 }}
      >
        <p className="text-[10px] text-white/15">数据仅保存在本地设备，请放心使用</p>
      </div>
    </div>
  )
}