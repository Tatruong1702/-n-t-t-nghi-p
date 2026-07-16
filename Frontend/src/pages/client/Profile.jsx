import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import useAuth from '../../hooks/useAuth'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import { Lock, MapPin, Mail, Phone, User } from 'lucide-react'
import userApi from '../../api/userApi'
import bookingApi from '../../api/bookingApi'
import { getAvatarUrl } from '../../components/common/avatarUtils'
import formatDate from '../../utils/formatDate'
import formatMoney from '../../utils/formatMoney'
import ProfileBookingItem from '../../components/client/profile/ProfileBookingItem'

const inputStyles = 'w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100'

const profileFields = [
  { name: 'full_name', label: 'Họ và tên', icon: User, type: 'text', required: true },
  { name: 'phone', label: 'Số điện thoại', icon: Phone, type: 'tel', required: false },
  { name: 'address', label: 'Địa chỉ', icon: MapPin, type: 'text', required: false },
]

const passwordFields = [
  { name: 'current_password', label: 'Mật khẩu hiện tại', icon: Lock },
  { name: 'new_password', label: 'Mật khẩu mới', icon: Lock },
  { name: 'confirm_password', label: 'Xác nhận mật khẩu', icon: Lock },
]

export default function Profile() {
  const queryClient = useQueryClient()
  const { saveUser } = useAuth()
  const [avatarUrlError, setAvatarUrlError] = useState('')
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState('')

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      full_name: '',
      phone: '',
      address: '',
      avatar_url: '',
    },
  })

  const watchedAvatarUrl = watch('avatar_url')

  const profileQuery = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await userApi.profile()
      return response.data.data.user
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
  })

  const bookingsQuery = useQuery({
    queryKey: ['profileBookings'],
    queryFn: async () => {
      const response = await bookingApi.list()
      return response.data.data.bookings || []
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
  })

  const profile = profileQuery.data || {}
  const bookings = bookingsQuery.data || []
  const favoritesCount = profile.favorites?.length || 0
  const profileAvatarUrl = useMemo(() => getAvatarUrl(profile), [profile])

  const stats = useMemo(() => [
    {
      title: 'Booking hoàn thành',
      value: bookings.filter((booking) => booking.status === 'completed').length,
      description: 'Đã hoàn thành',
      accent: 'text-emerald-200',
    },
    {
      title: 'Booking đang chờ',
      value: bookings.filter((booking) => booking.status === 'pending').length,
      description: 'Chờ xác nhận',
      accent: 'text-cyan-200',
    },
    {
      title: 'Doanh thu',
      value: formatMoney(bookings.reduce((sum, booking) => sum + Number(booking.total_price || 0), 0)),
      description: 'Tổng giá trị',
      accent: 'text-violet-200',
    },
    {
      title: 'Sở thích',
      value: favoritesCount,
      description: 'Venues yêu thích',
      accent: 'text-white',
    },
  ], [bookings, favoritesCount])

  const recentBookings = useMemo(
    () => bookings.slice(0, 5),
    [bookings]
  )

  const displayedAvatarUrl = useMemo(() => {
    if (avatarUrlError) return profileAvatarUrl
    return avatarPreviewUrl || profileAvatarUrl
  }, [avatarPreviewUrl, profileAvatarUrl, avatarUrlError])

  useEffect(() => {
    if (profile) {
      setValue('full_name', profile.full_name || '')
      setValue('phone', profile.phone || '')
      setValue('address', profile.address || '')
      setValue('avatar_url', profile.avatar_url || profile.avatar || '')
    }
  }, [profile, setValue])

  useEffect(() => {
    if (!watchedAvatarUrl) {
      setAvatarUrlError('')
      setAvatarPreviewUrl('')
      return
    }

    try {
      new URL(watchedAvatarUrl)
      setAvatarUrlError('')
      setAvatarPreviewUrl(watchedAvatarUrl)
    } catch {
      setAvatarUrlError('URL ảnh không hợp lệ')
      setAvatarPreviewUrl('')
    }
  }, [watchedAvatarUrl])

  const profileMutation = useMutation({
    mutationFn: async (payload) => userApi.updateProfile(payload),
    onSuccess: async (response) => {
      const updatedUser = response?.data?.data?.user
      if (updatedUser) saveUser(updatedUser)
      await queryClient.invalidateQueries({ queryKey: ['profile'] })
      toast.success('Cập nhật hồ sơ thành công')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Cập nhật hồ sơ thất bại')
    },
  })

  const passwordMutation = useMutation({
    mutationFn: async (payload) => userApi.updateProfile(payload),
    onSuccess: () => {
      toast.success('Đổi mật khẩu thành công')
      resetPasswordForm()
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Đổi mật khẩu thất bại')
    },
  })

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    watch: watchPassword,
    reset: resetPasswordForm,
    formState: { errors: passwordErrors, isSubmitting: passwordSubmitting },
  } = useForm({
    defaultValues: {
      current_password: '',
      new_password: '',
      confirm_password: '',
    },
  })

  const handleSaveAvatar = async () => {
    const avatarUrl = watchedAvatarUrl || ''
    if (!avatarUrl) {
      setAvatarUrlError('URL ảnh không được để trống')
      return
    }

    if (avatarUrlError) return

    await profileMutation.mutateAsync({ avatar_url: avatarUrl })
  }

  const handleCopyAddress = async () => {
    if (!profile.address) {
      toast.info('Chưa có địa chỉ để sao chép')
      return
    }
    try {
      await navigator.clipboard.writeText(profile.address)
      toast.success('Đã sao chép địa chỉ')
    } catch {
      toast.error('Không thể sao chép địa chỉ')
    }
  }

  const onSubmitProfile = async (values) => {
    await profileMutation.mutateAsync({
      full_name: values.full_name,
      phone: values.phone || '',
      address: values.address || '',
      avatar_url: values.avatar_url || '',
    })
  }

  const onSubmitPassword = async (values) => {
    if (values.new_password !== values.confirm_password) {
      toast.error('Mật khẩu xác nhận không khớp')
      return
    }

    const result = await Swal.fire({
      title: 'Xác nhận đổi mật khẩu',
      text: 'Bạn có muốn thay đổi mật khẩu ngay bây giờ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Đổi mật khẩu',
      cancelButtonText: 'Huỷ',
    })

    if (!result.isConfirmed) return

    await passwordMutation.mutateAsync({ password: values.new_password })
  }

  if (profileQuery.isLoading) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-[24px] border border-slate-200 bg-white p-14 shadow-2xl shadow-slate-200/20">
          <p className="text-center text-slate-500">Đang tải thông tin cá nhân...</p>
        </div>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-1">
          <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white/90 p-6 shadow-2xl shadow-slate-200/20 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-5 text-center">
              <div className="relative h-[140px] w-[140px] overflow-hidden rounded-[24px] bg-slate-100 shadow-lg shadow-slate-200/50">
                {displayedAvatarUrl ? (
                  <img
                    src={displayedAvatarUrl}
                    alt="Avatar"
                    className="h-full w-full object-cover"
                    onError={() => setAvatarUrlError('URL ảnh không hợp lệ')}
                    onLoad={() => setAvatarUrlError('')}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-slate-200 text-xl font-semibold text-slate-700">
                    {profile.full_name ? profile.full_name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase() : 'TT'}
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <p className="text-xl font-semibold text-slate-950">{profile.full_name || 'Chưa cập nhật tên'}</p>
                <p className="text-sm text-slate-500">@{profile.username || 'khachhang'}</p>
                <p className="text-sm font-medium text-slate-600">{profile.role || 'Khách hàng'}</p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <label className="block text-sm font-semibold text-slate-700">Avatar URL</label>
              <input
                type="url"
                placeholder="https://example.com/avatar.jpg"
                {...register('avatar_url')}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
              />
              {avatarUrlError && <p className="text-sm text-rose-600">{avatarUrlError}</p>}

              <button
                type="button"
                onClick={handleSaveAvatar}
                disabled={profileMutation.isLoading}
                className="inline-flex w-full items-center justify-center rounded-3xl bg-green-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {profileMutation.isLoading ? 'Đang lưu avatar...' : 'Lưu Avatar'}
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6 lg:col-span-2">
          <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white/90 p-6 shadow-2xl shadow-slate-200/20 backdrop-blur-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-600">Thông tin tài khoản</p>
                <h1 className="mt-2 text-3xl font-semibold text-slate-950">Hồ sơ của bạn</h1>
              </div>
              <p className="max-w-xl text-sm text-slate-500">Tất cả dữ liệu được đồng bộ trực tiếp. Thiết lập và theo dõi tài khoản một cách rõ ràng.</p>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="rounded-[20px] border border-slate-200 bg-slate-50 p-5 shadow-sm">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Username</p>
                <p className="mt-3 text-sm font-semibold text-slate-900">{profile.username || '---'}</p>
              </div>
              <div className="rounded-[20px] border border-slate-200 bg-slate-50 p-5 shadow-sm">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Email</p>
                <p className="mt-3 text-sm font-semibold text-slate-900">{profile.email || '---'}</p>
              </div>
              <div className="rounded-[20px] border border-slate-200 bg-slate-50 p-5 shadow-sm">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Số điện thoại</p>
                <p className="mt-3 text-sm font-semibold text-slate-900">{profile.phone || '---'}</p>
              </div>
              <div className="rounded-[20px] border border-slate-200 bg-slate-50 p-5 shadow-sm">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Ngày tham gia</p>
                <p className="mt-3 text-sm font-semibold text-slate-900">{formatDate(profile.created_at || profile.createdAt)}</p>
              </div>
              <div className="rounded-[20px] border border-slate-200 bg-slate-50 p-5 shadow-sm">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Role</p>
                <p className="mt-3 text-sm font-semibold text-slate-900">{profile.role || 'Khách hàng'}</p>
              </div>
              <div className="rounded-[20px] border border-slate-200 bg-slate-50 p-5 shadow-sm">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Trạng thái</p>
                <p className="mt-3 text-sm font-semibold text-slate-900">{profile.status || 'Hoạt động'}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white/95 p-6 shadow-2xl shadow-slate-200/20 backdrop-blur-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Địa chỉ</p>
                  <h2 className="mt-2 text-xl font-semibold text-slate-950">Vị trí hiện tại</h2>
                </div>
                <button
                  type="button"
                  onClick={handleCopyAddress}
                  className="rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
                >
                  Copy
                </button>
              </div>
              <p className="mt-5 min-h-[84px] text-sm leading-6 text-slate-600">
                {profile.address || 'Chưa cập nhật địa chỉ'}
              </p>
            </div>

            <div className="overflow-hidden rounded-[24px] bg-gradient-to-br from-emerald-600 via-cyan-500 to-violet-600 p-6 shadow-2xl shadow-slate-900/20">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/80">Account stats</p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">Tóm tắt hiệu suất</h2>
                </div>
                <span className="rounded-3xl bg-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/90">SaaS Dashboard</span>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {stats.map((item) => (
                  <div key={item.title} className="rounded-[20px] border border-white/15 bg-white/10 p-4 shadow-lg shadow-slate-950/10 backdrop-blur-sm">
                    <p className="text-xs uppercase tracking-[0.24em] text-white/70">{item.title}</p>
                    <p className={`mt-3 text-2xl font-semibold text-white ${item.accent}`}>{item.value}</p>
                    <p className="mt-2 text-sm text-white/75">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white/95 p-6 shadow-2xl shadow-slate-200/20 backdrop-blur-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Chỉnh sửa hồ sơ</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-950">Thông tin cá nhân</h2>
            </div>
            <p className="text-sm text-slate-500">Cập nhật liên hệ và thông tin hiển thị.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmitProfile)} className="mt-8 space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {profileFields.map((field) => {
                const Icon = field.icon
                return (
                  <label key={field.name} className="space-y-2">
                    <span className="flex items-center gap-2 text-sm font-medium text-slate-700">
                      <Icon size={16} /> {field.label}
                    </span>
                    <input
                      type={field.type}
                      {...register(field.name, { required: field.required && 'Trường này là bắt buộc' })}
                      className={inputStyles}
                    />
                    {errors[field.name] && <p className="text-sm text-rose-600">{errors[field.name].message}</p>}
                  </label>
                )
              })}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="space-y-2">
                <span className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Mail size={16} /> Email
                </span>
                <input value={profile.email || ''} readOnly className={`${inputStyles} cursor-not-allowed bg-slate-100`} />
              </label>
              <label className="space-y-2">
                <span className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <User size={16} /> Vai trò
                </span>
                <input value={profile.role || 'Khách hàng'} readOnly className={`${inputStyles} cursor-not-allowed bg-slate-100`} />
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex w-full items-center justify-center rounded-3xl bg-emerald-600 px-6 py-4 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </form>
        </div>

        <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white/95 p-6 shadow-2xl shadow-slate-200/20 backdrop-blur-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Đổi mật khẩu</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-950">Bảo mật tài khoản</h2>
            </div>
            <span className="rounded-3xl bg-emerald-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">An toàn</span>
          </div>

          <form onSubmit={handlePasswordSubmit(onSubmitPassword)} className="mt-8 space-y-5">
            {passwordFields.map((field) => {
              const Icon = field.icon
              return (
                <label key={field.name} className="space-y-2">
                  <span className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <Icon size={16} /> {field.label}
                  </span>
                  <input
                    type="password"
                    {...registerPassword(field.name, {
                      required: 'Trường này là bắt buộc',
                      minLength: field.name !== 'current_password' ? { value: 6, message: 'Tối thiểu 6 ký tự' } : undefined,
                      validate: field.name === 'confirm_password'
                        ? (value) => value === watchPassword('new_password') || 'Mật khẩu không khớp'
                        : undefined,
                    })}
                    className={inputStyles}
                  />
                  {passwordErrors[field.name] && <p className="text-sm text-rose-600">{passwordErrors[field.name].message}</p>}
                </label>
              )
            })}

            <button
              type="submit"
              disabled={passwordSubmitting}
              className="inline-flex w-full items-center justify-center rounded-3xl bg-slate-950 px-6 py-4 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {passwordSubmitting ? 'Đang cập nhật...' : 'Đổi mật khẩu'}
            </button>
          </form>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-[24px] border border-slate-200 bg-white/95 p-6 shadow-2xl shadow-slate-200/20 backdrop-blur-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Booking gần đây</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950">5 lượt đặt mới nhất</h2>
          </div>
          <Link to="/my-bookings" className="text-sm font-semibold text-emerald-600 transition hover:text-emerald-500">Xem tất cả</Link>
        </div>
        <div className="mt-6 space-y-3">
          {recentBookings.length ? (
            recentBookings.map((booking) => <ProfileBookingItem key={booking.booking_id || booking.id} booking={booking} />)
          ) : (
            <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-500">
              Không có booking gần đây
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
