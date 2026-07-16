import React, { lazy, Suspense, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import venueApi from '../../api/venueApi'
import courtApi from '../../api/courtApi'
import reviewApi from '../../api/reviewApi'
import getImageUrl from '../../utils/getImageUrl'

const HeroSection = lazy(() => import('../../components/home/HeroSection'))
const StatsSection = lazy(() => import('../../components/home/StatsSection'))
const FeaturedVenues = lazy(() => import('../../components/home/FeaturedVenues'))
const RegionSection = lazy(() => import('../../components/home/RegionSection'))
const SportsSection = lazy(() => import('../../components/home/SportsSection'))
const BookingSteps = lazy(() => import('../../components/home/BookingSteps'))
const PromotionSection = lazy(() => import('../../components/home/PromotionSection'))
const Testimonials = lazy(() => import('../../components/home/Testimonials'))
const NewsSection = lazy(() => import('../../components/home/NewsSection'))
const CTASection = lazy(() => import('../../components/home/CTASection'))

const placeholderImage = 'https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=1400&q=80'

function buildRegions(venues) {
  const cityMap = venues.reduce((acc, venue) => {
    const city = venue.city || 'Không rõ'
    if (!acc[city]) {
      acc[city] = { city, count: 0, image: getImageUrl(venue.image) || placeholderImage }
    }
    acc[city].count += 1
    return acc
  }, {})

  return Object.values(cityMap)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
    .map((region) => ({
      name: region.city,
      image: region.image,
      count: region.count,
    }))
}

function buildSports(courts) {
  const sportMap = courts.reduce((acc, court) => {
    const sport = court.sport_type || 'Khác'
    if (!acc[sport]) acc[sport] = { name: sport, count: 0, image: getImageUrl(court.image) || placeholderImage }
    acc[sport].count += 1
    return acc
  }, {})

  return Object.values(sportMap)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
}

function buildPromotions(venues) {
  return venues
    .slice(0, 3)
    .map((venue) => ({
      id: venue.venue_id,
      title: venue.venue_name,
      description: `Sân ${venue.venue_name} tại ${venue.city || 'địa điểm chưa xác định'} với ${venue.courts_count || 0} sân con và giá từ ${venue.min_price ? venue.min_price.toLocaleString() + '₫' : 'liên hệ'}.`,
      accent: 'bg-emerald-500/10',
      button: 'Xem sân',
      image: getImageUrl(venue.image) || placeholderImage,
    }))
}

function buildNews(venues) {
  return venues
    .slice(0, 2)
    .map((venue) => ({
      id: venue.venue_id,
      title: `Sân ${venue.venue_name} đáng chú ý`,
      meta: venue.city || 'Địa điểm chưa xác định',
      description: `Khám phá các sân tại ${venue.city || 'khu vực gần bạn'} với ${venue.booking_count || 0} lượt đặt và ${venue.courts_count || 0} sân.`,
      image: getImageUrl(venue.image) || placeholderImage,
    }))
}

function buildTestimonials(reviews) {
  return reviews.slice(0, 5).map((review) => ({
    id: review.review_id || `${review.court?.id}-${review.user?.id}`,
    name: review.user?.name || 'Người dùng',
    role: review.venue?.city || 'Khách hàng',
    rating: Number(review.rating) || 4,
    review: review.comment || 'Khách hàng chưa để lại đánh giá chi tiết.',
    avatar: '',
  }))
}

function buildStats(venues, courts, reviews) {
  const venueCount = venues.length
  const courtCount = courts.reduce((sum, court) => sum + 1, 0)
  const cityCount = new Set(venues.map((venue) => venue.city).filter(Boolean)).size
  const reviewCount = reviews.length

  return [
    { label: 'Sân bóng', value: `${venueCount}` },
    { label: 'Sân con', value: `${courtCount}` },
    { label: 'Tỉnh thành', value: `${cityCount}` },
    { label: 'Đánh giá', value: `${reviewCount}` },
  ]
}

export default function Home() {
  const [searchFilters, setSearchFilters] = useState({})

  const { data: venues = [], isLoading: venuesLoading, error: venuesError } = useQuery({
    queryKey: ['venues', searchFilters],
    queryFn: () => venueApi.search(searchFilters).then((res) => res.data.data.venues || []),
    keepPreviousData: true,
  })

  const { data: courts = [], isLoading: courtsLoading } = useQuery({
    queryKey: ['courts'],
    queryFn: () => courtApi.list().then((res) => res.data.data.courts || []),
  })

  const { data: reviews = [], isLoading: reviewsLoading } = useQuery({
    queryKey: ['reviews'],
    queryFn: () => reviewApi.list().then((res) => res.data.data.reviews || []),
  })

  const ratingsByVenue = useMemo(() => {
    return reviews.reduce((acc, review) => {
      const venueId = review.venue?.id
      if (!venueId) return acc
      const rating = Number(review.rating) || 0
      const existing = acc[venueId] || { total: 0, count: 0 }
      existing.total += rating
      existing.count += 1
      acc[venueId] = existing
      return acc
    }, {})
  }, [reviews])

  const venuesWithMeta = useMemo(
    () =>
      venues.map((venue) => {
        const venueRating = ratingsByVenue[venue.venue_id]
        return {
          ...venue,
          image: getImageUrl(venue.image) || placeholderImage,
          name: venue.venue_name || venue.name,
          location: venue.city || venue.address || 'Chưa rõ địa điểm',
          price: venue.min_price || 0,
          badge: venue.booking_count > 20 ? 'HOT' : venue.courts_count > 0 ? 'Mới' : 'Đề cử',
          avgRating: venueRating ? Number((venueRating.total / venueRating.count).toFixed(1)) : null,
        }
      }),
    [venues, ratingsByVenue],
  )

  const regions = useMemo(() => buildRegions(venuesWithMeta), [venuesWithMeta])
  const sports = useMemo(() => buildSports(courts), [courts])
  const promotions = useMemo(() => buildPromotions(venuesWithMeta), [venuesWithMeta])
  const news = useMemo(() => buildNews(venuesWithMeta), [venuesWithMeta])
  const testimonials = useMemo(() => buildTestimonials(reviews), [reviews])
  const stats = useMemo(() => buildStats(venuesWithMeta, courts, reviews), [venuesWithMeta, courts, reviews])

  const handleSearch = (values) => {
    setSearchFilters({
      location: values.location || undefined,
      sport_type: values.type || undefined,
      date: values.date || undefined,
      time: values.time || undefined,
    })
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Suspense fallback={<div className="min-h-screen bg-slate-50" />}> 
        <HeroSection onSearch={handleSearch} />
        <StatsSection stats={stats} loading={venuesLoading || courtsLoading || reviewsLoading} />
        <FeaturedVenues venues={venuesWithMeta} loading={venuesLoading} error={venuesError} />
        <RegionSection regions={regions} />
        <SportsSection sports={sports} />
        <BookingSteps />
        <PromotionSection promotions={promotions} loading={venuesLoading} />
        <Testimonials testimonials={testimonials} loading={reviewsLoading} />
        <NewsSection news={news} loading={venuesLoading} />
        <CTASection />
      </Suspense>
    </main>
  )
}
