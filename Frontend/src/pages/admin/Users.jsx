import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'
import userApi from '../../api/userApi'
import UserFilters from '../../components/admin/UserFilters'
import UserStats from '../../components/admin/UserStats'
import UserTable from '../../components/admin/UserTable'
import UserModal from '../../components/admin/UserModal'

const initialModalState = {
  full_name: '',
  email: '',
  role: 'customer',
  status: 1,
  password: '',
  phone: '',
}

const formatDateTime = (value) => {
  if (!value) return '---'
  const date = typeof value === 'string' ? new Date(value) : value
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return String(value)
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

const normalizeUser = (user) => ({
  ...user,
  created_at: user.created_at || user.createdAt || '',
  status: Number(user.status),
})

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchText, setSearchText] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [sortBy, setSortBy] = useState('full_name')
  const [sortDirection, setSortDirection] = useState('asc')
  const [page, setPage] = useState(1)
  const [selectedUserIds, setSelectedUserIds] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('add')
  const [currentUser, setCurrentUser] = useState(initialModalState)
  const [formErrors, setFormErrors] = useState({})
  const [toast, setToast] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await userApi.list()
        const rawUsers = response.data?.data?.users || []
        setUsers(rawUsers.map(normalizeUser))
      } catch (err) {
        console.error(err)
        setError('Không thể tải danh sách người dùng.')
      } finally {
        setLoading(false)
      }
    }

    loadUsers()
  }, [])

  const stats = useMemo(() => {
    const totalUsers = users.length
    const activeUsers = users.filter((user) => user.status === 1).length
    const newUsers = users.filter((user) => {
      if (!user.created_at) return false
      const date = new Date(user.created_at)
      const today = new Date()
      return date.getFullYear() === today.getFullYear() && date.getMonth() === today.getMonth()
    }).length
    const adminCount = users.filter((user) => user.role === 'admin').length

    return {
      totalUsers,
      activeUsers,
      newUsers,
      adminCount,
    }
  }, [users])

  const filteredUsers = useMemo(() => {
    const searchLower = searchText.trim().toLowerCase()

    return users.filter((user) => {
      const matchSearch =
        !searchLower ||
        (user.full_name || user.username || '').toLowerCase().includes(searchLower) ||
        (user.email || '').toLowerCase().includes(searchLower)

      const matchRole = !roleFilter || user.role === roleFilter
      const isActive = user.status === 1
      const matchStatus =
        !statusFilter ||
        (statusFilter === 'Active' ? isActive : statusFilter === 'Inactive' ? !isActive : true)

      return matchSearch && matchRole && matchStatus
    })
  }, [users, searchText, roleFilter, statusFilter])

  const sortedUsers = useMemo(() => {
    const sorted = [...filteredUsers]
    sorted.sort((a, b) => {
      const aValue = a[sortBy] || ''
      const bValue = b[sortBy] || ''
      if (sortBy === 'created_at') {
        const aDate = new Date(aValue).getTime() || 0
        const bDate = new Date(bValue).getTime() || 0
        return sortDirection === 'asc' ? aDate - bDate : bDate - aDate
      }
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      }
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue
    })
    return sorted
  }, [filteredUsers, sortBy, sortDirection])

  const pageSize = 10
  const pageCount = Math.max(1, Math.ceil(sortedUsers.length / pageSize))

  useEffect(() => {
    if (page > pageCount) setPage(1)
  }, [page, pageCount])

  const currentRows = useMemo(() => {
    const start = (page - 1) * pageSize
    return sortedUsers.slice(start, start + pageSize)
  }, [sortedUsers, page])

  const makeToast = useCallback((message, type = 'success') => {
    setToast({ message, type })
    window.setTimeout(() => setToast(null), 3600)
  }, [])

  const handleResetFilters = useCallback(() => {
    setSearchText('')
    setRoleFilter('')
    setStatusFilter('')
    setPage(1)
  }, [])

  const handleSort = useCallback(
    (field) => {
      if (sortBy === field) {
        setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))
      } else {
        setSortBy(field)
        setSortDirection('asc')
      }
    },
    [sortBy]
  )

  const handleSelectAll = useCallback(
    (checked) => {
      if (checked) {
        setSelectedUserIds(currentRows.map((user) => user.user_id))
      } else {
        setSelectedUserIds([])
      }
    },
    [currentRows]
  )

  const handleSelectUser = useCallback((id, checked) => {
    setSelectedUserIds((prev) =>
      checked ? [...prev, id] : prev.filter((userId) => userId !== id)
    )
  }, [])

  const openAddModal = useCallback(() => {
    setModalMode('add')
    setCurrentUser(initialModalState)
    setFormErrors({})
    setIsModalOpen(true)
  }, [])

  const openEditModal = useCallback((user) => {
    setModalMode('edit')
    setCurrentUser({ ...user, password: '' })
    setFormErrors({})
    setIsModalOpen(true)
  }, [])

  const openViewModal = useCallback((user) => {
    setModalMode('view')
    setCurrentUser(user)
    setFormErrors({})
    setIsModalOpen(true)
  }, [])

  const closeModal = useCallback(() => {
    setIsModalOpen(false)
    setFormErrors({})
    setCurrentUser(initialModalState)
  }, [])

  const validateForm = useCallback(() => {
    const errors = {}
    if (!currentUser.full_name?.trim()) {
      errors.full_name = 'Vui lòng nhập họ tên'
    }
    if (!currentUser.email?.trim() || !validateEmail(currentUser.email)) {
      errors.email = 'Email không hợp lệ'
    }
    if (modalMode === 'add' && !currentUser.password?.trim()) {
      errors.password = 'Mật khẩu là bắt buộc'
    }
    if (modalMode === 'add' && currentUser.password && currentUser.password.length < 6) {
      errors.password = 'Mật khẩu phải từ 6 ký tự trở lên'
    }
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }, [currentUser, modalMode])

  const handleSaveUser = useCallback(async () => {
    if (!validateForm()) return

    setSaving(true)
    try {
      if (modalMode === 'add') {
        const payload = {
          full_name: currentUser.full_name,
          email: currentUser.email,
          role: currentUser.role,
          password: currentUser.password,
        }
        const response = await userApi.create(payload)
        const addedUser = normalizeUser(response.data.data.user)
        setUsers((prev) => [addedUser, ...prev])
        makeToast('Thêm người dùng thành công')
      } else if (modalMode === 'edit') {
        const payload = {
          full_name: currentUser.full_name,
          email: currentUser.email,
          role: currentUser.role,
          status: currentUser.status,
        }
        if (currentUser.password) {
          payload.password = currentUser.password
        }
        const response = await userApi.update(currentUser.user_id, payload)
        const updatedUser = normalizeUser(response.data.data.user)
        setUsers((prev) => prev.map((user) => (user.user_id === updatedUser.user_id ? updatedUser : user)))
        makeToast('Cập nhật người dùng thành công')
      }
      closeModal()
    } catch (err) {
      console.error(err)
      makeToast(err?.response?.data?.message || 'Lưu người dùng thất bại', 'error')
    } finally {
      setSaving(false)
    }
  }, [currentUser, makeToast, modalMode, validateForm, closeModal])

  const handleDeleteUser = useCallback(async (user) => {
    const result = await Swal.fire({
      title: 'Xác nhận xóa',
      text: `Bạn có chắc chắn muốn xóa ${user.full_name || user.email}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
      reverseButtons: true,
    })

    if (result.isConfirmed) {
      try {
        await userApi.delete(user.user_id)
        setUsers((prev) => prev.filter((item) => item.user_id !== user.user_id))
        makeToast('Xóa người dùng thành công')
      } catch (err) {
        console.error(err)
        makeToast('Xóa người dùng thất bại', 'error')
      }
    }
  }, [makeToast])

  const handleToggleStatus = useCallback(async (user) => {
    const nextStatus = user.status === 1 ? 0 : 1
    try {
      await userApi.update(user.user_id, { status: nextStatus })
      setUsers((prev) => prev.map((item) => (item.user_id === user.user_id ? { ...item, status: nextStatus } : item)))
      makeToast(nextStatus === 1 ? 'Mở khóa tài khoản thành công' : 'Khoá tài khoản thành công')
    } catch (err) {
      console.error(err)
      makeToast('Cập nhật trạng thái thất bại', 'error')
    }
  }, [makeToast])

  const handleModalChange = useCallback((field, value) => {
    setCurrentUser((prev) => ({ ...prev, [field]: value }))
  }, [])

  return (
    <section className="min-h-screen bg-slate-100 text-slate-900">
      <div className="flex min-h-screen overflow-hidden">
        <div className="flex min-h-screen flex-1 flex-col overflow-hidden">
          <div className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
            <header className="rounded-3xl border border-slate-border bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Admin / Người dùng</p>
                  <h1 className="mt-2 text-2xl font-semibold text-slate-900">Quản lý người dùng</h1>
                  <p className="mt-1 text-sm text-slate-500">Xem, lọc, thao tác và quản lý toàn bộ tài khoản.</p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <button
                    type="button"
                    onClick={openAddModal}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-navy-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-navy-700"
                  >
                    <i className="ti ti-plus text-base" />
                    Thêm người dùng
                  </button>
                </div>
              </div>
            </header>

            <main className="mt-6 flex-1 overflow-y-auto pb-10">
              <div className="space-y-6">
                <UserStats stats={stats} />

                <div className="space-y-6">
                  <UserFilters
                    searchText={searchText}
                    roleFilter={roleFilter}
                    statusFilter={statusFilter}
                    onSearchChange={(value) => {
                      setSearchText(value)
                      setPage(1)
                    }}
                    onRoleChange={(value) => {
                      setRoleFilter(value)
                      setPage(1)
                    }}
                    onStatusChange={(value) => {
                      setStatusFilter(value)
                      setPage(1)
                    }}
                    onResetFilters={handleResetFilters}
                  />

                  {error && (
                    <div className="rounded-3xl border border-rose-100 bg-rose-50 p-5 text-sm text-rose-700">
                      {error}
                    </div>
                  )}

                  <UserTable
                    users={currentRows}
                    loading={loading}
                    selectedUserIds={selectedUserIds}
                    onSelectAll={handleSelectAll}
                    onSelectUser={handleSelectUser}
                    onDeleteUser={handleDeleteUser}
                    onToggleStatus={handleToggleStatus}
                    onEditUser={openEditModal}
                    onViewUser={openViewModal}
                    onSort={handleSort}
                    sortBy={sortBy}
                    sortDirection={sortDirection}
                    page={page}
                    pageSize={pageSize}
                    setPage={setPage}
                    pageCount={pageCount}
                    totalCount={sortedUsers.length}
                  />
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>

      {toast && (
        <div className={`fixed right-5 top-5 z-50 rounded-3xl px-5 py-4 shadow-2xl transition ${toast.type === 'error' ? 'bg-rose-600 text-white' : 'bg-slate-900 text-white'}`}>
          <p className="text-sm font-medium">{toast.message}</p>
        </div>
      )}

      <UserModal
        isOpen={isModalOpen}
        mode={modalMode}
        user={currentUser}
        errors={formErrors}
        onClose={closeModal}
        onChange={handleModalChange}
        onSave={handleSaveUser}
        onEditMode={() => setModalMode('edit')}
        saving={saving}
      />
    </section>
  )
}
