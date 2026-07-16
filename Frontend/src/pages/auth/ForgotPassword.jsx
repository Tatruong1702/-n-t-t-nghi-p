import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import authApi from '../../api/authApi'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    try {
      await authApi.forgotPassword({ email })
      setMessage('Nếu email tồn tại, chúng tôi đã gửi link đặt lại mật khẩu.')
    } catch (err) {
      setError(err.response?.data?.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.')
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
            <p className="mt-2 text-gray-400">Thời trang tối giản</p>
          </div>

          <div className="rounded-[32px] border border-white/20 bg-white/70 p-9 shadow-2xl backdrop-blur-xl">
            <h2 className="text-3xl font-semibold text-slate-900 text-center">Quên mật khẩu</h2>
            <p className="mt-2 text-center text-sm text-slate-600">Nhập email để nhận hướng dẫn đặt lại mật khẩu</p>

            {error && (
              <div className="mt-6 rounded-3xl bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}
            {message && (
              <div className="mt-6 rounded-3xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {message}
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

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-3xl bg-black py-5 text-sm font-semibold text-white transition hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? 'Đang gửi...' : 'GỬI LINK ĐẶT LẠI'}
              </button>

              <p className="text-center text-sm text-slate-600">
                <Link to="/auth/login" className="font-medium text-slate-900 hover:underline">
                  Quay lại đăng nhập
                </Link>
              </p>
            </form>
          </div>

          <p className="mt-8 text-center text-xs text-white/70">© 2026 NEXA. All rights reserved.</p>
        </div>
      </div>
    </main>
  )
}
