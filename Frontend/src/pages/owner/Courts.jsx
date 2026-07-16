import React, { useCallback, useMemo, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus, Sparkles, ShieldCheck, Activity, Wrench, Lock, Trash2, ChevronRight } from 'lucide-react'
import { toast, ToastContainer } from 'react-toastify'
import Swal from 'sweetalert2'
import 'react-toastify/dist/ReactToastify.css'
import useAuth from '../../hooks/useAuth'
import courtApi from '../../api/courtApi'
import venueApi from '../../api/venueApi'
import CourtStats from '../../components/owner/courts/CourtStats'
import CourtFilters from '../../components/owner/courts/CourtFilters'
import CourtTable from '../../components/owner/courts/CourtTable'
import CourtCard from '../../components/owner/courts/CourtCard'
import CourtModal from '../../components/owner/courts/CourtModal'
import CourtDrawer from '../../components/owner/courts/CourtDrawer'
import CourtAnalytics from '../../components/owner/courts/CourtAnalytics'
import CourtSkeleton from '../../components/owner/courts/CourtSkeleton'
import CourtPagination from '../../components/owner/courts/CourtPagination'
import EmptyCourt from '../../components/owner/courts/EmptyCourt'

const fetchOwnerCourts = async (currentUser, venues) => {
  const response = await courtApi.list()
  const courts = response?.data?.data?.courts || []
  const ownerVenueIds = venues.filter((venue) => String(venue.owner_id) === String(currentUser?.user_id)).map((venue) => venue.venue_id)
  return courts.filter((court) => ownerVenueIds.includes(court.venue_id))
}

const formatCurrency = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0)

export default function OwnerCourts() {
  const { user, loading: authLoading } = useAuth()
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [sportFilter, setSportFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priceFilter, setPriceFilter] = useState('all')
  const [venueFilter, setVenueFilter] = useState('all')
  const [sortBy, setSortBy] = useState('created_at')
  const [sortOrder, setSortOrder] = useState('desc')
  const [viewMode, setViewMode] = useState('table')
  const [selectedIds, setSelectedIds] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('create')
  const [editingCourt, setEditingCourt] = useState(null)
  const [selectedCourt, setSelectedCourt] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const { data: venues = [] } = useQuery({
    queryKey: ['owner-venues', user?.user_id],
    queryFn: () => venueApi.list().then((res) => res?.data?.data?.venues || []),
    enabled: !!user?.user_id,
    staleTime: 30_000,
  })

  const { data: courts = [], isLoading, isFetching } = useQuery({
    queryKey: ['owner-courts', user?.user_id],
    queryFn: () => fetchOwnerCourts(user, venues),
    enabled: !!user?.user_id && venues.length > 0,
    staleTime: 30_000,
  })

  const stats = useMemo(() => {
    const activeCourts = courts.filter((court) => Number(court.status) === 1).length
    const maintenanceCourts = courts.filter((court) => Number(court.status) === 2).length
    const closedCourts = courts.filter((court) => Number(court.status) === 0).length
    const totalBookings = courts.reduce((sum, court) => sum + Number(court.booking_count || 0), 0)
    const monthRevenue = courts.reduce((sum, court) => sum + Number(court.month_revenue || 0), 0)
    const averagePrice = courts.length ? courts.reduce((sum, court) => sum + Number(court.price_per_hour || 0), 0) / courts.length : 0
    const fillRate = courts.length ? Math.round((totalBookings / Math.max(courts.length * 30, 1)) * 100) : 0
    return { totalCourts: courts.length, activeCourts, maintenanceCourts, closedCourts, totalBookings, monthRevenue, fillRate, averagePrice }
  }, [courts])

  const filteredCourts = useMemo(() => {
    const keyword = search.toLowerCase()
    const list = courts.filter((court) => {
      const matchesSearch = `${court.court_name || ''} ${court.sport_type || ''} ${court.Venue?.venue_name || ''}`.toLowerCase().includes(keyword)
      const matchesSport = sportFilter === 'all' || court.sport_type === sportFilter
      const matchesStatus = statusFilter === 'all' || (statusFilter === 'available' ? Number(court.status) === 1 : statusFilter === 'maintenance' ? Number(court.status) === 2 : Number(court.status) === 0)
      const matchesPrice = priceFilter === 'all' || (priceFilter === 'lt100' ? Number(court.price_per_hour || 0) < 100000 : priceFilter === '100_300' ? Number(court.price_per_hour || 0) >= 100000 && Number(court.price_per_hour || 0) <= 300000 : Number(court.price_per_hour || 0) > 300000)
      const matchesVenue = venueFilter === 'all' || String(court.venue_id) === String(venueFilter)
      return matchesSearch && matchesSport && matchesStatus && matchesPrice && matchesVenue
    })

    return [...list].sort((a, b) => {
      const direction = sortOrder === 'asc' ? 1 : -1
      if (sortBy === 'price_per_hour') return (Number(a.price_per_hour || 0) - Number(b.price_per_hour || 0)) * direction
      if (sortBy === 'booking_count') return (Number(a.booking_count || 0) - Number(b.booking_count || 0)) * direction
      if (sortBy === 'created_at') return (new Date(a.created_at || 0) - new Date(b.created_at || 0)) * direction
      return a.court_name.localeCompare(b.court_name) * direction
    })
  }, [courts, search, sportFilter, statusFilter, priceFilter, venueFilter, sortBy, sortOrder])

  const totalPages = Math.max(1, Math.ceil(filteredCourts.length / 15))
  const pagedCourts = useMemo(() => filteredCourts.slice((currentPage - 1) * 15, currentPage * 15), [filteredCourts, currentPage])

  const resetFilters = useCallback(() => {
    setSearch('')
    setSportFilter('all')
    setStatusFilter('all')
    setPriceFilter('all')
    setVenueFilter('all')
    setSortBy('created_at')
    setSortOrder('desc')
    setCurrentPage(1)
  }, [])

  const openCreateModal = useCallback(() => {
    setModalMode('create')
    setEditingCourt(null)
    setIsModalOpen(true)
  }, [])

  const openEditModal = useCallback((court) => {
    setModalMode('edit')
    setEditingCourt(court)
    setIsModalOpen(true)
  }, [])

  const handleSubmit = useCallback(async (form) => {
    setSubmitting(true)
    try {
      if (modalMode === 'create') {
        await courtApi.create(form)
        toast.success('Sân con đã được tạo thành công')
      } else {
        await courtApi.update(editingCourt.court_id, form)
        toast.success('Sân con đã được cập nhật')
      }
      queryClient.invalidateQueries({ queryKey: ['owner-courts'] })
      setIsModalOpen(false)
      setEditingCourt(null)
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Không thể lưu sân con')
    } finally {
      setSubmitting(false)
    }
  }, [editingCourt, modalMode, queryClient])

  const handleDelete = useCallback(async (court) => {
    const result = await Swal.fire({ title: 'Xóa sân con này?', icon: 'warning', showCancelButton: true, confirmButtonText: 'Xóa ngay', cancelButtonText: 'Hủy', confirmButtonColor: '#ef4444' })
    if (!result.isConfirmed) return
    try {
      await courtApi.delete(court.court_id)
      queryClient.invalidateQueries({ queryKey: ['owner-courts'] })
      toast.success('Đã xóa sân con')
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Không thể xóa sân con')
    }
  }, [queryClient])

  const handleBulkDelete = useCallback(async () => {
    if (!selectedIds.length) return
    const result = await Swal.fire({ title: 'Xóa các sân con đã chọn?', icon: 'warning', showCancelButton: true, confirmButtonText: 'Xóa hàng loạt', cancelButtonText: 'Hủy' })
    if (!result.isConfirmed) return
    try {
      await Promise.all(selectedIds.map((id) => courtApi.delete(id)))
      setSelectedIds([])
      queryClient.invalidateQueries({ queryKey: ['owner-courts'] })
      toast.success('Đã xóa các sân con đã chọn')
    } catch (error) {
      toast.error('Không thể xóa hàng loạt')
    }
  }, [queryClient, selectedIds])

  const toggleSelect = useCallback((courtId) => {
    setSelectedIds((prev) => (prev.includes(courtId) ? prev.filter((id) => id !== courtId) : [...prev, courtId]))
  }, [])

  const copyImage = useCallback(async (value) => {
    if (!value) return
    await navigator.clipboard.writeText(value)
    toast.success('Đã sao chép URL ảnh')
  }, [])

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_rgba(34,211,238,0.15),_transparent_40%),linear-gradient(135deg,_#f8fafc_0%,_#eef2ff_100%)] p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="rounded-[28px] border border-slate-200/70 bg-white/70 p-6 shadow-[0_24px_80px_-30px_rgba(15,23,42,0.28)] backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div className="space-y-3">
                <div className="h-8 w-48 animate-pulse rounded-full bg-slate-200" />
                <div className="h-4 w-96 animate-pulse rounded-full bg-slate-200" />
              </div>
              <div className="h-12 w-36 animate-pulse rounded-2xl bg-slate-200" />
            </div>
          </div>
          <CourtSkeleton />
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
                <Sparkles className="h-4 w-4" /> Quản lý sân con
              </div>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Quản Lý Sân Con</h1>
              <p className="mt-3 text-base leading-7 text-slate-600">Theo dõi, tối ưu và vận hành tất cả sân con của bạn từ một hệ thống hiện đại.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button onClick={openCreateModal} className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800">
                <Plus className="h-4 w-4" /> Thêm sân con
              </button>
              {selectedIds.length > 0 && (
                <button onClick={handleBulkDelete} className="inline-flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-100">
                  <Trash2 className="h-4 w-4" /> Xóa đã chọn
                </button>
              )}
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
            <div className="rounded-[24px] border border-slate-200/70 bg-slate-50/80 p-4">
              <div className="flex items-center justify-between text-sm text-slate-500"><span>Tổng số sân con</span><ShieldCheck className="h-4 w-4" /></div>
              <div className="mt-3 text-2xl font-semibold text-slate-900">{stats.totalCourts}</div>
            </div>
            <div className="rounded-[24px] border border-slate-200/70 bg-slate-50/80 p-4">
              <div className="flex items-center justify-between text-sm text-slate-500"><span>Sân đang hoạt động</span><Activity className="h-4 w-4" /></div>
              <div className="mt-3 text-2xl font-semibold text-slate-900">{stats.activeCourts}</div>
            </div>
            <div className="rounded-[24px] border border-slate-200/70 bg-slate-50/80 p-4">
              <div className="flex items-center justify-between text-sm text-slate-500"><span>Sân bảo trì</span><Wrench className="h-4 w-4" /></div>
              <div className="mt-3 text-2xl font-semibold text-slate-900">{stats.maintenanceCourts}</div>
            </div>
            <div className="rounded-[24px] border border-slate-200/70 bg-slate-50/80 p-4">
              <div className="flex items-center justify-between text-sm text-slate-500"><span>Sân đã khóa</span><Lock className="h-4 w-4" /></div>
              <div className="mt-3 text-2xl font-semibold text-slate-900">{stats.closedCourts}</div>
            </div>
          </div>
        </section>

        <CourtStats stats={stats} />
        <CourtFilters search={search} onSearchChange={setSearch} sportFilter={sportFilter} onSportFilterChange={setSportFilter} statusFilter={statusFilter} onStatusFilterChange={setStatusFilter} priceFilter={priceFilter} onPriceFilterChange={setPriceFilter} venueFilter={venueFilter} onVenueFilterChange={setVenueFilter} sortBy={sortBy} onSortByChange={setSortBy} sortOrder={sortOrder} onSortOrderChange={setSortOrder} venues={venues} onReset={resetFilters} />

        {isFetching && <div className="text-sm text-slate-500">Đang cập nhật dữ liệu...</div>}

        <CourtAnalytics analytics={{ totalBookings: stats.totalBookings, todayBookings: 0, weekBookings: 0, monthBookings: 0 }} />

        {!filteredCourts.length ? (
          <EmptyCourt onCreate={openCreateModal} />
        ) : (
          <>
            {viewMode === 'table' ? (
              <CourtTable courts={pagedCourts} selectedIds={selectedIds} onToggleSelect={toggleSelect} onOpenDrawer={(court) => setSelectedCourt(court)} onEdit={openEditModal} onDelete={handleDelete} onCopy={copyImage} />
            ) : (
              <div className="grid gap-6 xl:grid-cols-2">
                {pagedCourts.map((court) => (
                  <CourtCard key={court.court_id} court={court} onOpenDrawer={(court) => setSelectedCourt(court)} onEdit={openEditModal} onDelete={handleDelete} onCopy={copyImage} />
                ))}
              </div>
            )}
            <CourtPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </>
        )}
      </div>

      <CourtModal isOpen={isModalOpen} mode={modalMode} court={editingCourt} venues={venues} onClose={() => setIsModalOpen(false)} onSubmit={handleSubmit} loading={submitting} />
      <CourtDrawer isOpen={!!selectedCourt} court={selectedCourt} onClose={() => setSelectedCourt(null)} />
    </div>
  )
}
