import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'

export default function Register() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [terms, setTerms] = useState(false)
  const [showTermsDetails, setShowTermsDetails] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.')
      return
    }

    if (!terms) {
      setError('Bạn phải đồng ý với điều khoản để tiếp tục.')
      return
    }

    setLoading(true)
    try {
      await register({ email, password, full_name: fullName, phone })
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.')
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
            <h2 className="text-3xl font-semibold text-slate-900 text-center">Tạo tài khoản</h2>
            <p className="mt-2 text-center text-sm text-slate-600">Đăng ký để truy cập ưu đãi và đặt sân dễ dàng</p>

            {error && (
              <div className="mt-6 rounded-3xl bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Họ và tên</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="input-field w-full rounded-3xl border border-slate-300 bg-slate-50 px-6 py-4 text-slate-900 outline-none transition focus:border-black focus:ring-4 focus:ring-black/10"
                />
              </div>

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
                <label className="mb-2 block text-sm font-medium text-slate-700">Số điện thoại</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
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

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Xác nhận mật khẩu</label>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="input-field w-full rounded-3xl border border-slate-300 bg-slate-50 px-6 py-4 pr-16 text-slate-900 outline-none transition focus:border-black focus:ring-4 focus:ring-black/10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((prev) => !prev)}
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-500"
                  >
                    {showConfirm ? 'Ẩn' : 'Hiện'}
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <label className="inline-flex cursor-pointer items-center gap-3 text-sm text-slate-600">
                    <input
                      type="checkbox"
                      checked={terms}
                      onChange={(e) => setTerms(e.target.checked)}
                      className="h-5 w-5 rounded-lg border border-slate-300 text-black focus:ring-black"
                    />
                    Tôi đồng ý với <span className="text-black underline">Điều khoản</span> và <span className="text-black underline">Chính sách bảo mật</span>
                  </label>
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => setShowTermsDetails((prev) => !prev)}
                    className="text-sm font-medium text-slate-900 hover:underline"
                  >
                    {showTermsDetails ? 'Thu gọn điều khoản' : 'Xem chi tiết điều khoản'}
                  </button>
                </div>
              </div>

              {showTermsDetails && (
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm leading-7 text-slate-700">
                  <p className="font-semibold text-slate-900 mb-3">Điều khoản sử dụng</p>
                  <p>Bằng việc tạo tài khoản, bạn đồng ý tuân thủ các quy định và chính sách của NEXA.</p>
                  <p className="mt-3">- Không chia sẻ thông tin đăng nhập với người khác.</p>
                  <p>- Không sử dụng dịch vụ cho các mục đích trái pháp luật.</p>
                  <p>- Chúng tôi có thể cập nhật điều khoản và bạn sẽ được thông báo khi có thay đổi.</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-3xl bg-black py-5 text-sm font-semibold text-white transition hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? 'Đang đăng ký...' : 'ĐĂNG KÝ'}
              </button>

              <p className="text-center text-sm text-slate-600">
                Đã có tài khoản?{' '}
                <Link to="/auth/login" className="font-medium text-slate-900 hover:underline">
                  Đăng nhập
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
