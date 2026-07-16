import React, { useState, useCallback, useMemo } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import venueApi from '../../api/venueApi'
import VenueHero from '../../components/client/venues/VenueHero'
import VenueSearchBar from '../../components/client/venues/VenueSearchBar'
import VenueFilters from '../../components/client/venues/VenueFilters'
import VenueGrid from '../../components/client/venues/VenueGrid'
import VenuePagination from '../../components/client/venues/VenuePagination'
import VenueSkeleton from '../../components/client/venues/VenueSkeleton'
import EmptyVenue from '../../components/client/venues/EmptyVenue'
import TopVenues from '../../components/client/venues/TopVenues'

const ITEMS_PER_PAGE = 16

export default function Venues() {
  const queryClient = useQueryClient()

  // State
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    city: '',
    sport_type: '',
    status: '',
    sort: 'newest',
    maxPrice: 1000000,
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [viewType, setViewType] = useState('grid')

  // Fetch venues
  const { data: venuesData, isLoading, error } = useQuery({
    queryKey: ['venues', { ...filters, search: searchTerm }],
    queryFn: async () => {
      const response = await venueApi.list({
        search: searchTerm,
        ...filters,
      })
      return response.data?.data?.venues || []
    },
    staleTime: 1000 * 60 * 5,
    retry: 2,
  })

  const venues = useMemo(() => venuesData || [], [venuesData])

  // Filter & Search Logic
  const filteredVenues = useMemo(() => {
    let result = [...venues]

    // Search by name, address, or owner
    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase()
      result = result.filter(
        (venue) =>
          venue.venue_name?.toLowerCase().includes(query) ||
          venue.address?.toLowerCase().includes(query) ||
          venue.city?.toLowerCase().includes(query)
      )
    }

    // Filter by city
    if (filters.city) {
      result = result.filter((venue) => venue.city === filters.city)
    }

    // Filter by sport type
    if (filters.sport_type) {
      result = result.filter((venue) =>
        venue.Courts?.some((court) => court.sport_type === filters.sport_type)
      )
    }

    // Filter by status
    if (filters.status !== '') {
      result = result.filter((venue) => venue.status === filters.status)
    }

    // Filter by max price
    if (filters.maxPrice) {
      result = result.filter((venue) => (venue.min_price || 0) <= filters.maxPrice)
    }

    // Sort
    switch (filters.sort) {
      case 'newest':
        result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        break
      case 'oldest':
        result.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
        break
      case 'price_asc':
        result.sort((a, b) => (a.min_price || 0) - (b.min_price || 0))
        break
      case 'price_desc':
        result.sort((a, b) => (b.min_price || 0) - (a.min_price || 0))
        break
      case 'rating':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0))
        break
      case 'bookings':
        result.sort((a, b) => (b.booking_count || 0) - (a.booking_count || 0))
        break
      default:
        break
    }

    return result
  }, [venues, searchTerm, filters])

  // Pagination
  const totalPages = Math.ceil(filteredVenues.length / ITEMS_PER_PAGE)
  const paginatedVenues = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredVenues.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredVenues, currentPage])

  // Get unique cities for filter
  const cities = useMemo(() => {
    const uniqueCities = [...new Set(venues.map((v) => v.city).filter(Boolean))]
    return uniqueCities.sort()
  }, [venues])

  // Handlers
  const handleSearchChange = useCallback((value) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }, [])

  const handleLocationChange = useCallback((value) => {
    handleFilterChange('city', value)
  }, [])

  const handleFilterChange = useCallback((key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
    setCurrentPage(1)
  }, [])

  const handleReset = useCallback(() => {
    setSearchTerm('')
    setFilters({
      city: '',
      sport_type: '',
      status: '',
      sort: 'newest',
      maxPrice: 1000000,
    })
    setCurrentPage(1)
    toast.success('Đã xóa bộ lọc')
  }, [])

  const handleViewChange = useCallback((type) => {
    setViewType(type)
  }, [])

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  // Stats
  const stats = useMemo(
    () => ({
      total: venues.length,
      bookings: venues.reduce((sum, v) => sum + (v.booking_count || 0), 0),
    }),
    [venues]
  )

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <VenueHero stats={stats} />

      {/* Search Bar */}
      <VenueSearchBar
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        onLocationChange={handleLocationChange}
        onViewChange={handleViewChange}
        viewType={viewType}
        locations={cities}
      />

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
          {/* Venues Grid/List */}
          <div>
            {isLoading ? (
              <VenueSkeleton count={16} />
            ) : paginatedVenues.length > 0 ? (
              <>
                <VenueGrid venues={paginatedVenues} viewType={viewType} />
                <VenuePagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={filteredVenues.length}
                  itemsPerPage={ITEMS_PER_PAGE}
                  onPageChange={handlePageChange}
                />
              </>
            ) : (
              <EmptyVenue onReset={handleReset} />
            )}
          </div>

          {/* Sidebar Filters */}
          <div>
            <VenueFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onReset={handleReset}
              locations={cities}
              priceRange={{ min: 0, max: 1000000 }}
            />
          </div>
        </div>
      </div>

      {/* Top Venues Section */}
      {venues.length > 0 && <TopVenues venues={venues} />}
    </main>
  )
}
