import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import { getRoleRedirectPath } from '../../context/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const response = await login({ email, password })
      const user = response?.data?.data?.user || null
      const role = user?.role || user?.user_role || user?.Role || 'user'
      navigate(getRoleRedirectPath(role))
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="relative min-h-screen bg-[url('https://picsum.photos/id/1015/2000/1200')] bg-cover bg-center bg-fixed font-sans text-slate-900">
      <div className="absolute inset-0 w-full h-full bg-black/40"></div>
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="mb-10 text-center text-white">
            <h1 className="text-5xl font-semibold tracking-tighter">NEXA</h1>
            <p className="mt-2 text-gray-200">Thời trang tối giản</p>
          </div>

          <div className="rounded-[32px] border border-white/20 bg-white/70 p-9 shadow-2xl backdrop-blur-xl">
            <h2 className="text-3xl font-semibold text-slate-900 text-center">Đăng nhập</h2>
            <p className="mt-2 text-center text-sm text-slate-600">Nhập email và mật khẩu để tiếp tục</p>

            {error && (
              <div className="mt-6 rounded-3xl bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="input-field w-full rounded-3xl border border-slate-300 bg-slate-50 px-6 py-4 text-slate-900 outline-none transition focus:border-black focus:ring-4 focus:ring-black/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Mật khẩu</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="input-field w-full rounded-3xl border border-slate-300 bg-slate-50 px-6 py-4 pr-16 text-slate-900 outline-none transition focus:border-black focus:ring-4 focus:ring-black/10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-500"
                  >
                    {showPassword ? 'Ẩn' : 'Hiện'}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-3xl bg-black py-5 text-sm font-semibold text-white transition hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? 'Đang đăng nhập...' : 'ĐĂNG NHẬP'}
              </button>

              <div className="flex flex-col gap-3 text-center text-sm text-slate-600 sm:flex-row sm:justify-between">
                <Link to="/auth/register" className="font-medium text-slate-900 hover:underline">
                  Đăng ký tài khoản
                </Link>
                <Link to="/auth/forgot-password" className="font-medium text-slate-900 hover:underline">
                  Quên mật khẩu?
                </Link>
              </div>

              <div className="my-6 flex items-center gap-4">
                <div className="h-px flex-1 bg-slate-200"></div>
                <span className="text-sm text-slate-500">hoặc</span>
                <div className="h-px flex-1 bg-slate-200"></div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setError('Tính năng Google chưa sẵn sàng.')}
                  className="flex items-center justify-center gap-3 rounded-3xl border border-slate-300 bg-white py-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Google
                </button>
                <button
                  type="button"
                  onClick={() => setError('Tính năng Facebook chưa sẵn sàng.')}
                  className="flex items-center justify-center gap-3 rounded-3xl border border-slate-300 bg-white py-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Facebook
                </button>
              </div>
            </form>
          </div>

          <p className="mt-8 text-center text-xs text-white/70">© 2026 NEXA. All rights reserved.</p>
        </div>
      </div>
    </main>
  )
}
