import React, { useCallback, useMemo, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Copy, Plus, Trash2, ChevronRight, Sparkles, ShieldCheck, Activity, BarChart3 } from 'lucide-react'
import { toast, ToastContainer } from 'react-toastify'
import Swal from 'sweetalert2'
import 'react-toastify/dist/ReactToastify.css'
import useAuth from '../../hooks/useAuth'
import venueApi from '../../api/venueApi'
import VenueStats from '../../components/owner/venues/VenueStats'
import VenueFilters from '../../components/owner/venues/VenueFilters'
import VenueTable from '../../components/owner/venues/VenueTable'
import VenueCard from '../../components/owner/venues/VenueCard'
import VenueModal from '../../components/owner/venues/VenueModal'
import VenueDrawer from '../../components/owner/venues/VenueDrawer'
import CourtManager from '../../components/owner/venues/CourtManager'
import VenueSkeleton from '../../components/owner/venues/VenueSkeleton'
import EmptyVenue from '../../components/owner/venues/EmptyVenue'

const fetchOwnerVenues = async (currentUser) => {
  const response = await venueApi.list()
  const venues = response?.data?.data?.venues || []
  return venues.filter((venue) => String(venue.owner_id) === String(currentUser?.user_id))
}

const formatCurrency = (value) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0)

export default function OwnerVenues() {
  const { user, loading: authLoading } = useAuth()
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [viewMode, setViewMode] = useState('table')
  const [selectedIds, setSelectedIds] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('create')
  const [editingVenue, setEditingVenue] = useState(null)
  const [selectedVenue, setSelectedVenue] = useState(null)
  const [courtManagerOpen, setCourtManagerOpen] = useState(false)
  const [venueToManage, setVenueToManage] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const { data: venues = [], isLoading, isFetching } = useQuery({
    queryKey: ['owner-venues', user?.user_id],
    queryFn: () => fetchOwnerVenues(user),
    enabled: !!user?.user_id,
    staleTime: 30_000,
  })

  const stats = useMemo(() => {
    const activeVenues = venues.filter((venue) => Number(venue.status) === 1).length
    const pausedVenues = venues.filter((venue) => Number(venue.status) !== 1).length
    const totalCourts = venues.reduce((sum, venue) => sum + Number(venue.courts_count || 0), 0)
    const totalBookings = venues.reduce((sum, venue) => sum + Number(venue.booking_count || 0), 0)
    const monthRevenue = venues.reduce((sum, venue) => sum + Number(venue.month_revenue || 0), 0)
    return {
      totalVenues: venues.length,
      activeVenues,
      pausedVenues,
      totalCourts,
      totalBookings,
      monthRevenue,
    }
  }, [venues])

  const filteredVenues = useMemo(() => {
    const keyword = search.toLowerCase()
    const list = venues.filter((venue) => {
      const matchesSearch = `${venue.venue_name || ''} ${venue.address || ''}`.toLowerCase().includes(keyword)
      const matchesStatus = statusFilter === 'all' || (statusFilter === 'active' ? Number(venue.status) === 1 : Number(venue.status) !== 1)
      return matchesSearch && matchesStatus
    })

    return [...list].sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.created_at || 0) - new Date(b.created_at || 0)
        case 'revenue':
          return (b.revenue || 0) - (a.revenue || 0)
        case 'bookings':
          return (b.booking_count || 0) - (a.booking_count || 0)
        default:
          return new Date(b.created_at || 0) - new Date(a.created_at || 0)
      }
    })
  }, [venues, search, statusFilter, sortBy])

  const openCreateModal = useCallback(() => {
    setModalMode('create')
    setEditingVenue(null)
    setIsModalOpen(true)
  }, [])

  const openEditModal = useCallback((venue) => {
    setModalMode('edit')
    setEditingVenue(venue)
    setIsModalOpen(true)
  }, [])

  const handleSubmit = useCallback(async (form) => {
    setSubmitting(true)
    try {
      if (modalMode === 'create') {
        await venueApi.create(form)
        toast.success('Sân đã được tạo thành công')
      } else {
        await venueApi.update(editingVenue.venue_id, form)
        toast.success('Sân đã được cập nhật')
      }
      queryClient.invalidateQueries({ queryKey: ['owner-venues'] })
      setIsModalOpen(false)
      setEditingVenue(null)
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Không thể lưu sân')
    } finally {
      setSubmitting(false)
    }
  }, [editingVenue, modalMode, queryClient])

  const handleDelete = useCallback(async (venue) => {
    const result = await Swal.fire({
      title: 'Xóa sân này?',
      text: 'Hành động này sẽ xóa sân và các sân con liên quan.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xóa ngay',
      cancelButtonText: 'Hủy',
      confirmButtonColor: '#ef4444',
    })

    if (!result.isConfirmed) return

    try {
      await venueApi.delete(venue.venue_id)
      queryClient.invalidateQueries({ queryKey: ['owner-venues'] })
      toast.success('Sân đã được xóa')
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Không thể xóa sân')
    }
  }, [queryClient])

  const handleBulkDelete = useCallback(async () => {
    if (!selectedIds.length) return
    const result = await Swal.fire({
      title: 'Xóa các sân đã chọn?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xóa hàng loạt',
      cancelButtonText: 'Hủy',
    })
    if (!result.isConfirmed) return
    try {
      await Promise.all(selectedIds.map((id) => venueApi.delete(id)))
      setSelectedIds([])
      queryClient.invalidateQueries({ queryKey: ['owner-venues'] })
      toast.success('Đã xóa các sân đã chọn')
    } catch (error) {
      toast.error('Không thể xóa hàng loạt')
    }
  }, [queryClient, selectedIds])

  const toggleSelect = useCallback((venueId) => {
    setSelectedIds((prev) => (prev.includes(venueId) ? prev.filter((id) => id !== venueId) : [...prev, venueId]))
  }, [])

  const openCourtManager = useCallback((venue) => {
    setVenueToManage(venue)
    setCourtManagerOpen(true)
  }, [])

  const copyAddress = useCallback(async (address) => {
    if (!address) return
    await navigator.clipboard.writeText(address)
    toast.success('Đã sao chép địa chỉ')
  }, [])

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_rgba(34,211,238,0.15),_transparent_40%),linear-gradient(135deg,_#f8fafc_0%,_#eef2ff_100%)] p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="rounded-[28px] border border-slate-200/70 bg-white/70 p-6 shadow-[0_24px_80px_-30px_rgba(15,23,42,0.28)] backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div className="space-y-3">
                <div className="h-8 w-44 animate-pulse rounded-full bg-slate-200" />
                <div className="h-4 w-96 animate-pulse rounded-full bg-slate-200" />
              </div>
              <div className="h-12 w-36 animate-pulse rounded-2xl bg-slate-200" />
            </div>
          </div>
          <VenueSkeleton />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_rgba(34,211,238,0.15),_transparent_40%),linear-gradient(135deg,_#f8fafc_0%,_#eef2ff_100%)] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <ToastContainer position="top-right" theme="light" />

        <section className="overflow-hidden rounded-[32px] border border-slate-200/70 bg-white/80 p-6 shadow-[0_24px_80px_-30px_rgba(15,23,42,0.28)] backdrop-blur-xl">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-cyan-50 px-3 py-1 text-sm font-semibold text-cyan-700">
                <Sparkles className="h-4 w-4" /> Quản lý sân
              </div>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Quản Lý Sân</h1>
              <p className="mt-3 text-base leading-7 text-slate-600">Theo dõi và quản lý toàn bộ sân bóng của bạn trong một workspace hiện đại, rõ ràng và tối ưu.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button onClick={openCreateModal} className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800">
                <Plus className="h-4 w-4" /> Thêm sân
              </button>
              {selectedIds.length > 0 && (
                <button onClick={handleBulkDelete} className="inline-flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-100">
                  <Trash2 className="h-4 w-4" /> Xóa đã chọn
                </button>
              )}
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-[24px] border border-slate-200/70 bg-slate-50/80 p-4">
              <div className="flex items-center justify-between text-sm text-slate-500">
                <span>Tổng số sân</span>
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div className="mt-3 text-2xl font-semibold text-slate-900">{stats.totalVenues}</div>
            </div>
            <div className="rounded-[24px] border border-slate-200/70 bg-slate-50/80 p-4">
              <div className="flex items-center justify-between text-sm text-slate-500">
                <span>Sân đang hoạt động</span>
                <Activity className="h-4 w-4" />
              </div>
              <div className="mt-3 text-2xl font-semibold text-slate-900">{stats.activeVenues}</div>
            </div>
            <div className="rounded-[24px] border border-slate-200/70 bg-slate-50/80 p-4">
              <div className="flex items-center justify-between text-sm text-slate-500">
                <span>Tổng sân con</span>
                <BarChart3 className="h-4 w-4" />
              </div>
              <div className="mt-3 text-2xl font-semibold text-slate-900">{stats.totalCourts}</div>
            </div>
            <div className="rounded-[24px] border border-slate-200/70 bg-slate-50/80 p-4">
              <div className="flex items-center justify-between text-sm text-slate-500">
                <span>Doanh thu tháng</span>
                <ChevronRight className="h-4 w-4" />
              </div>
              <div className="mt-3 text-xl font-semibold text-slate-900">{formatCurrency(stats.monthRevenue)}</div>
            </div>
          </div>
        </section>

        <VenueStats stats={stats} />
        <VenueFilters search={search} setSearch={setSearch} statusFilter={statusFilter} setStatusFilter={setStatusFilter} sortBy={sortBy} setSortBy={setSortBy} viewMode={viewMode} setViewMode={setViewMode} onReset={() => { setSearch(''); setStatusFilter('all'); setSortBy('newest') }} />

        {isFetching && <div className="text-sm text-slate-500">Đang cập nhật dữ liệu...</div>}

        {!filteredVenues.length ? (
          <EmptyVenue onCreate={openCreateModal} />
        ) : viewMode === 'table' ? (
          <VenueTable venues={filteredVenues} selectedIds={selectedIds} onToggleSelect={toggleSelect} onOpenDrawer={(venue) => setSelectedVenue(venue)} onEdit={openEditModal} onDelete={handleDelete} onCopyAddress={copyAddress} />
        ) : (
          <div className="grid gap-6 xl:grid-cols-2">
            {filteredVenues.map((venue) => (
              <VenueCard key={venue.venue_id} venue={venue} onOpenDrawer={(venue) => setSelectedVenue(venue)} onEdit={openEditModal} onDelete={handleDelete} onCopyAddress={copyAddress} />
            ))}
          </div>
        )}
      </div>

      <VenueModal isOpen={isModalOpen} mode={modalMode} venue={editingVenue} currentUser={user} onClose={() => setIsModalOpen(false)} onSubmit={handleSubmit} loading={submitting} />
      <VenueDrawer isOpen={!!selectedVenue} venue={selectedVenue} onClose={() => setSelectedVenue(null)} />
      <CourtManager isOpen={courtManagerOpen} venue={venueToManage} onClose={() => setCourtManagerOpen(false)} />
    </div>
  )
}
