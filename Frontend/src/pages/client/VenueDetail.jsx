import React, { useEffect, useState, lazy, Suspense } from 'react'
import { useParams } from 'react-router-dom'
import venueApi from '../../api/venueApi'
import courtApi from '../../api/courtApi'
import reviewApi from '../../api/reviewApi'
import VenueSkeleton from '../../components/client/venue/VenueSkeleton'
import VenueEmptyState from '../../components/client/venue/VenueEmptyState'
import VenueHero from '../../components/client/venue/VenueHero'
import VenueInfo from '../../components/client/venue/VenueInfo'
import VenueGallery from '../../components/client/venue/VenueGallery'
import VenueStats from '../../components/client/venue/VenueStats'
import VenueCourts from '../../components/client/venue/VenueCourts'
import BookingPanel from '../../components/client/venue/BookingPanel'
import VenueReviews from '../../components/client/venue/VenueReviews'

const RelatedVenues = lazy(() =>
  import('../../components/client/venue/RelatedVenues')
)

export default function VenueDetail() {
  const { id } = useParams()
  const [venue, setVenue] = useState(null)
  const [courts, setCourts] = useState([])
  const [reviews, setReviews] = useState([])
  const [allVenues, setAllVenues] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)

        const [venueRes, courtsRes, reviewsRes, venuesRes] = await Promise.all([
          venueApi.get(id),
          courtApi.list({ venue_id: id }),
          reviewApi.list({ venue_id: id, limit: 100 }),
          venueApi.list({ limit: 100 }),
        ])

        const venueData = venueRes.data?.data?.venue
        if (!venueData) {
          setError('Sân không tồn tại')
          setVenue(null)
          return
        }

        setVenue(venueData)
        setCourts(courtsRes.data?.data?.courts || [])
        setReviews(reviewsRes.data?.data?.reviews || [])
        setAllVenues(venuesRes.data?.data?.venues || [])
      } catch (err) {
        console.error('Error loading venue:', err)
        setError(
          err.response?.status === 404
            ? 'Sân không tồn tại'
            : 'Không thể tải chi tiết sân. Vui lòng thử lại.'
        )
        setVenue(null)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      loadData()
    }
  }, [id])

  if (loading) {
    return <VenueSkeleton />
  }

  if (error || !venue) {
    return <VenueEmptyState error={error} />
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="bg-gradient-to-b from-slate-900 to-slate-800 py-10 px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <VenueHero venue={venue} courts={courts} reviews={reviews} />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.95fr]">
          <div className="space-y-8">
            <VenueInfo venue={venue} />
            <VenueGallery venue={venue} courts={courts} />
            <VenueStats venue={venue} bookingCount={courts.length} />
          </div>

          <aside>
            <BookingPanel courts={courts} venueId={venue?.venue_id} />
          </aside>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.95fr]">
          <div className="space-y-8">
            <VenueCourts courts={courts} venueId={venue?.venue_id} />
            <VenueReviews reviews={reviews} />
          </div>

          <aside>
            <Suspense fallback={null}>
              <RelatedVenues
                venues={allVenues}
                currentVenueCity={venue?.city}
                currentVenueId={venue?.venue_id}
              />
            </Suspense>
          </aside>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="rounded-[28px] bg-gradient-to-r from-blue-600 to-blue-700 p-12 text-center shadow-lg">
          <h2 className="text-3xl font-bold text-white mb-4">Sẵn sàng đặt sân?</h2>
          <p className="text-blue-100 mb-6 text-lg">
            Hãy chọn sân con bên cạnh và đặt ngay thôi!
          </p>
        </div>
      </section>
    </main>
  )
}
