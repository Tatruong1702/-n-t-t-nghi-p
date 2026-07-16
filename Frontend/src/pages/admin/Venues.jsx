import React, { useCallback, useEffect, useMemo, useState } from 'react'
import venueApi from '../../api/venueApi'
import courtApi from '../../api/courtApi'
import VenueStats from '../../components/admin/VenueStats'
import VenueFilters from '../../components/admin/VenueFilters'
import VenueTable from '../../components/admin/VenueTable'
import VenueCards from '../../components/admin/VenueCards'
import VenueModal from '../../components/admin/VenueModal'
import VenueAnalytics from '../../components/admin/VenueAnalytics'

const initialVenueState = {
  venue_name: '',
  address: '',
  city: '',
  owner_id: '',
  description: '',
  image: '',
  status: 1,
}

const formatCurrency = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0)

const initialFilters = {
  search: '',
  city: '',
  ownerId: '',
  minRevenue: '',
  maxRevenue: '',
  minCourts: '',
  maxCourts: '',
  status: '',
  cityOptions: [],
  ownerOptions: [],
}

export default function AdminVenues() {
  const [venues, setVenues] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState('table')
  const [filters, setFilters] = useState(initialFilters)
  const [sortBy, setSortBy] = useState('venue_name')
  const [sortDirection, setSortDirection] = useState('asc')
  const [selectedIds, setSelectedIds] = useState([])
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('add')
  const [currentVenue, setCurrentVenue] = useState(initialVenueState)
  const [imagePreview, setImagePreview] = useState('')
  const [courts, setCourts] = useState([])
  const [venueDetails, setVenueDetails] = useState(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [courtsLoading, setCourtsLoading] = useState(false)
  const [venueModalLoading, setVenueModalLoading] = useState(false)
  const [formErrors, setFormErrors] = useState({})

  const loadVenues = useCallback(async () => {
    setLoading(true)
    try {
      const response = await venueApi.list()
      const data = response.data.data.venues || []
      setVenues(data)
      setFilters((prev) => ({
        ...prev,
        cityOptions: [...new Set(data.map((venue) => (venue.city || '').trim()).filter(Boolean))],
        ownerOptions: Array.from(
          data
            .map((venue) => ({ id: venue.owner_id, label: venue.owner_name || `Owner #${venue.owner_id}` }))
            .filter((item) => item.id)
            .reduce((map, owner) => map.set(owner.id, owner), new Map())
            .values()
        ),
      }))
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadVenues()
  }, [loadVenues])

  const stats = useMemo(() => {
    const totalVenues = venues.length
    const activeVenues = venues.filter((venue) => Number(venue.status) === 1).length
    const pausedVenues = totalVenues - activeVenues
    const totalCourts = venues.reduce((sum, venue) => sum + Number(venue.courts_count || 0), 0)
    const totalRevenue = venues.reduce((sum, venue) => sum + Number(venue.revenue || 0), 0)
    const monthRevenue = venues.reduce((sum, venue) => sum + Number(venue.month_revenue || 0), 0)
    const newVenuesThisMonth = venues.filter((venue) => {
      if (!venue.created_at) return false
      const created = new Date(venue.created_at)
      const now = new Date()
      return created.getFullYear() === now.getFullYear() && created.getMonth() === now.getMonth()
    }).length
    const cityCounts = venues.reduce((acc, venue) => {
      const city = (venue.city || 'Chưa phân loại').trim()
      acc[city] = (acc[city] || 0) + 1
      return acc
    }, {})
    const topCity = Object.entries(cityCounts).sort((a, b) => b[1] - a[1])[0] || ['Chưa có', 0]
    return {
      totalVenues,
      activeVenues,
      pausedVenues,
      totalCourts,
      totalRevenue,
      monthRevenue,
      newVenuesThisMonth,
      topCityLabel: topCity[0],
      topCityCount: topCity[1],
      trendPercent: totalVenues ? `${((activeVenues / totalVenues) * 100).toFixed(1)}%` : '0%',
    }
  }, [venues])

  const filteredVenues = useMemo(() => {
    const normalized = venues.map((venue) => ({
      ...venue,
      revenue: Number(venue.revenue || 0),
      courts_count: Number(venue.courts_count || 0),
    }))

    return normalized
      .filter((venue) => {
        const query = filters.search.trim().toLowerCase()
        const matchesSearch =
          !query ||
          venue.venue_name?.toLowerCase().includes(query) ||
          venue.city?.toLowerCase().includes(query) ||
          venue.owner_name?.toLowerCase().includes(query)
        const matchesCity = !filters.city || venue.city === filters.city
        const matchesStatus = filters.status === '' || String(venue.status) === filters.status
        const matchesOwner = !filters.ownerId || String(venue.owner_id) === String(filters.ownerId)
        const matchesRevenue =
          (!filters.minRevenue || venue.revenue >= Number(filters.minRevenue)) &&
          (!filters.maxRevenue || venue.revenue <= Number(filters.maxRevenue))
        const matchesCourts =
          (!filters.minCourts || venue.courts_count >= Number(filters.minCourts)) &&
          (!filters.maxCourts || venue.courts_count <= Number(filters.maxCourts))
        return matchesSearch && matchesCity && matchesStatus && matchesOwner && matchesRevenue && matchesCourts
      })
      .sort((a, b) => {
        if (sortBy === 'venue_name') {
          return sortDirection === 'asc'
            ? a.venue_name.localeCompare(b.venue_name)
            : b.venue_name.localeCompare(a.venue_name)
        }
        if (sortBy === 'city') {
          return sortDirection === 'asc' ? a.city.localeCompare(b.city) : b.city.localeCompare(a.city)
        }
        if (sortBy === 'revenue') {
          return sortDirection === 'asc' ? a.revenue - b.revenue : b.revenue - a.revenue
        }
        if (sortBy === 'created_at') {
          return sortDirection === 'asc'
            ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
            : new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        }
        return 0
      })
  }, [venues, filters, sortBy, sortDirection])

  const pageCount = Math.max(1, Math.ceil(filteredVenues.length / pageSize))
  const pagedVenues = filteredVenues.slice((page - 1) * pageSize, page * pageSize)

  const handleFilterChange = useCallback((field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
    setPage(1)
  }, [])

  const handleResetFilters = useCallback(() => {
    setFilters((prev) => ({
      ...initialFilters,
      cityOptions: prev.cityOptions,
      ownerOptions: prev.ownerOptions,
    }))
    setPage(1)
  }, [])

  const handleSort = useCallback((field) => {
    setSortBy(field)
    setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))
  }, [])

  const handleSelectAll = useCallback(
    (checked) => {
      setSelectedIds(checked ? pagedVenues.map((venue) => venue.venue_id) : [])
    },
    [pagedVenues]
  )

  const handleSelectVenue = useCallback((venueId, checked) => {
    setSelectedIds((prev) => (checked ? [...prev, venueId] : prev.filter((id) => id !== venueId)))
  }, [])

  const handleOpenVenue = useCallback(async (venue) => {
    setVenueDetails(venue)
    setDrawerOpen(true)
    setCourtsLoading(true)
    try {
      const response = await courtApi.list({ venue_id: venue.venue_id })
      setCourts(response.data.data.courts || [])
    } catch (error) {
      console.error(error)
      setCourts([])
    } finally {
      setCourtsLoading(false)
    }
  }, [])

  const handleBulkAction = useCallback(
    async (action) => {
      if (!selectedIds.length) return
      try {
        await Promise.all(
          selectedIds.map((id) => {
            if (action === 'delete') return venueApi.delete(id)
            if (action === 'pause') return venueApi.update(id, { status: 0 })
            if (action === 'activate') return venueApi.update(id, { status: 1 })
            return Promise.resolve()
          })
        )
        await loadVenues()
        setSelectedIds([])
      } catch (error) {
        console.error(error)
      }
    },
    [selectedIds, loadVenues]
  )

  const handleOpenModal = useCallback((venue = null) => {
    if (venue) {
      setModalMode('edit')
      setCurrentVenue({
        venue_id: venue.venue_id,
        venue_name: venue.venue_name,
        address: venue.address,
        city: venue.city,
        owner_id: venue.owner_id,
        description: venue.description,
        image: venue.image,
        status: Number(venue.status),
      })
      setImagePreview(venue.image || '')
      setCourts([])
    } else {
      setModalMode('add')
      setCurrentVenue(initialVenueState)
      setImagePreview('')
      setCourts([])
    }
    setFormErrors({})
    setIsModalOpen(true)
  }, [])

  const handleCloseModal = useCallback(() => setIsModalOpen(false), [])

  const handleImageChange = useCallback((image) => {
    setImagePreview(image)
  }, [])

  const handleRemoveImage = useCallback(() => {
    setImagePreview('')
  }, [])

  const handleVenueChange = useCallback((field, value) => {
    setCurrentVenue((prev) => ({ ...prev, [field]: value }))
  }, [])

  const handleCourtsChange = useCallback((updatedCourts) => {
    setCourts(updatedCourts)
  }, [])

  const handleVenueSubmit = useCallback(async () => {
    setVenueModalLoading(true)
    try {
      const payload = {
        venue_name: currentVenue.venue_name,
        address: currentVenue.address,
        city: currentVenue.city,
        owner_id: Number(currentVenue.owner_id) || null,
        description: currentVenue.description,
        image: imagePreview || currentVenue.image,
        status: Number(currentVenue.status),
      }

      let venueId
      if (modalMode === 'edit') {
        await venueApi.update(currentVenue.venue_id, payload)
        venueId = currentVenue.venue_id
      } else {
        const response = await venueApi.create(payload)
        venueId = response.data.data.venue_id
      }

      // Save courts
      if (courts.length > 0) {
        await Promise.all(
          courts.map((court) => {
            const courtPayload = {
              venue_id: venueId,
              court_name: court.court_name,
              sport_type: court.sport_type,
              price_per_hour: Number(court.price_per_hour),
              status: Number(court.status),
              image: court.image || '',
            }
            if (court.court_id && !court.court_id.toString().startsWith('temp_')) {
              return courtApi.update(court.court_id, courtPayload)
            } else {
              return courtApi.create(courtPayload)
            }
          })
        )
      }

      await loadVenues()
      setIsModalOpen(false)
    } catch (error) {
      console.error(error)
      setFormErrors({ api: error?.response?.data?.message || 'Thao tác thất bại' })
    } finally {
      setVenueModalLoading(false)
    }
  }, [currentVenue, imagePreview, courts, loadVenues, modalMode])

  return (
    <section className="min-h-screen bg-slate-100 text-sm font-sans">
      <div className="flex min-h-screen overflow-hidden">
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
            <header className="border-b border-slate-200 bg-white px-6 py-5 shadow-sm rounded-b-3xl">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Admin Venue</p>
                  <h1 className="mt-2 text-3xl font-semibold text-slate-950">Quản lý hệ thống sân bóng</h1>
                  <p className="mt-2 text-sm text-slate-500">Nâng cao trải nghiệm quản trị với báo cáo, bộ lọc, quản lý sân con và media.</p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <button
                    type="button"
                    onClick={() => loadVenues()}
                    className="inline-flex items-center justify-center rounded-3xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                  >
                    Tải lại dữ liệu
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenModal()}
                    className="inline-flex items-center justify-center rounded-3xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    Thêm sân mới
                  </button>
                </div>
              </div>
            </header>

            <main className="flex-1 overflow-y-auto px-6 py-6">
              <div className="space-y-6">
                <VenueStats stats={stats} />
                <VenueFilters
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onReset={handleResetFilters}
                  onSort={handleSort}
                  sortBy={sortBy}
                  sortDirection={sortDirection}
                  viewMode={viewMode}
                  onToggleView={setViewMode}
                  selectedCount={selectedIds.length}
                  onBulkAction={handleBulkAction}
                  loading={loading}
                />

                {viewMode === 'table' ? (
                  <VenueTable
                    venues={pagedVenues}
                    loading={loading}
                    selectedIds={selectedIds}
                    onSelectAll={handleSelectAll}
                    onSelectVenue={handleSelectVenue}
                    onSelectRow={handleOpenVenue}
                    sortBy={sortBy}
                    sortDirection={sortDirection}
                    onSort={handleSort}
                    page={page}
                    pageSize={pageSize}
                    setPage={setPage}
                    pageCount={pageCount}
                    totalCount={filteredVenues.length}
                  />
                ) : (
                  <VenueCards
                    venues={pagedVenues}
                    loading={loading}
                    selectedIds={selectedIds}
                    onSelectVenue={handleSelectVenue}
                    onOpenVenue={handleOpenVenue}
                  />
                )}

                <VenueAnalytics venues={venues} />
              </div>
            </main>
          </div>
        </div>
      </div>

      <VenueModal
        isOpen={isModalOpen}
        mode={modalMode}
        venue={currentVenue}
        errors={formErrors}
        onClose={handleCloseModal}
        onChange={handleVenueChange}
        onSubmit={handleVenueSubmit}
        loading={venueModalLoading}
        imagePreview={imagePreview}
        onImageChange={handleImageChange}
        onRemoveImage={handleRemoveImage}
        courts={courts}
        onCourtsChange={handleCourtsChange}
      />

      {drawerOpen && (
        <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-3xl flex-col border-l border-slate-200 bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Chi tiết sân</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-950">{venueDetails?.venue_name || 'Không có dữ liệu'}</h2>
            </div>
            <button type="button" onClick={() => setDrawerOpen(false)} className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">
              Đóng
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-5">
                {venueDetails?.image && (
                  <div className="rounded-[1.5rem] overflow-hidden border border-slate-200">
                    <img src={venueDetails.image} alt={venueDetails.venue_name} className="w-full h-48 object-cover" />
                  </div>
                )}
                <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-5">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Thông tin chung</p>
                  <div className="mt-4 space-y-3 text-sm text-slate-700">
                    <p><span className="font-semibold text-slate-900">Chủ sân:</span> {venueDetails?.owner_name || `Owner #${venueDetails?.owner_id || '—'}`}</p>
                    <p><span className="font-semibold text-slate-900">Email:</span> {venueDetails?.owner_email || 'Chưa có'}</p>
                    <p><span className="font-semibold text-slate-900">Điện thoại:</span> {venueDetails?.owner_phone || 'Chưa có'}</p>
                    <p><span className="font-semibold text-slate-900">Địa chỉ:</span> {venueDetails?.address || 'Chưa có'}</p>
                    <p><span className="font-semibold text-slate-900">Doanh thu:</span> {formatCurrency(venueDetails?.revenue)}</p>
                    <p><span className="font-semibold text-slate-900">Lượt đặt:</span> {venueDetails?.booking_count ?? 0}</p>
                    <p><span className="font-semibold text-slate-900">Tỷ lệ lấp đầy:</span> {venueDetails?.occupancy_rate ? `${venueDetails.occupancy_rate}%` : 'Chưa có'}</p>
                  </div>
                </div>
                <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-5">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Sân con</p>
                  <div className="mt-4 space-y-4">
                    {courtsLoading ? (
                      <p className="text-sm text-slate-500">Đang tải...</p>
                    ) : courts.length > 0 ? (
                      courts.map((court) => (
                        <div key={court.court_id} className="rounded-3xl border border-slate-200 bg-white p-4">
                          {court.image && <img src={court.image} alt={court.court_name} className="w-full h-24 object-cover rounded-2xl mb-3" />}
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <p className="font-semibold text-slate-900">{court.court_name}</p>
                              <p className="text-xs text-slate-500">{court.sport_type || 'Chưa xác định'}</p>
                            </div>
                            <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${Number(court.status) === 1 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                              {Number(court.status) === 1 ? 'Hoạt động' : 'Tạm dừng'}
                            </span>
                          </div>
                          <div className="mt-3 flex items-center justify-between text-sm text-slate-500">
                            <span>Giá/giờ: {court.price_per_hour ? formatCurrency(court.price_per_hour) : 'Chưa có'}</span>
                            <span>Doanh thu: {court.revenue ? formatCurrency(court.revenue) : 'Chưa có'}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-slate-500">Chưa có sân con.</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="space-y-5">
                <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-5">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Tình trạng sân</p>
                  <div className="mt-4 grid gap-3">
                    <div className="rounded-3xl bg-white p-4 shadow-sm">
                      <p className="text-sm text-slate-500">Trạng thái</p>
                      <p className="mt-2 text-xl font-semibold text-slate-900">{Number(venueDetails?.status) === 1 ? 'Hoạt động' : 'Tạm dừng'}</p>
                    </div>
                    <div className="rounded-3xl bg-white p-4 shadow-sm">
                      <p className="text-sm text-slate-500">Số sân con</p>
                      <p className="mt-2 text-xl font-semibold text-slate-900">{venueDetails?.courts_count ?? 0}</p>
                    </div>
                    <div className="rounded-3xl bg-white p-4 shadow-sm">
                      <p className="text-sm text-slate-500">Ngày tạo</p>
                      <p className="mt-2 text-xl font-semibold text-slate-900">{venueDetails?.created_at ? new Date(venueDetails.created_at).toLocaleDateString('vi-VN') : '—'}</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-5">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Nhãn hiệu</p>
                  <div className="mt-4 text-sm text-slate-700">
                    <p><span className="font-semibold text-slate-900">Doanh thu trung bình/sân:</span> {venueDetails?.revenue && venueDetails?.courts_count ? formatCurrency(venueDetails.revenue / Math.max(1, venueDetails.courts_count)) : 'Chưa có'}</p>
                    <p className="mt-3"><span className="font-semibold text-slate-900">Khung giờ đông khách:</span> {venueDetails?.peak_hour || 'Chưa xác định'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
