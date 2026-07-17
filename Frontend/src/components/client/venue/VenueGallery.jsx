import React, { useState, useMemo } from 'react'
import getImageUrl from '../../../utils/getImageUrl'

const placeholderImage =
  'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1600&q=80'

const VenueGallery = React.memo(({ venue, courts = [] }) => {
  const [selectedImage, setSelectedImage] = useState(null)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const galleryImages = useMemo(() => {
    const images = []
    if (venue?.image) images.push({ url: getImageUrl(venue.image), title: venue.venue_name })
    courts.forEach((court) => {
      if (court.image) {
        images.push({ url: getImageUrl(court.image), title: court.court_name })
      }
    })
    if (!images.length) {
      images.push({ url: placeholderImage, title: 'Venue Image' })
    }
    return images
  }, [venue, courts])

  const handleOpenLightbox = (idx) => {
    setLightboxIndex(idx)
    setSelectedImage(galleryImages[idx])
  }

  const handleNextImage = () => {
    const nextIdx = (lightboxIndex + 1) % galleryImages.length
    setLightboxIndex(nextIdx)
    setSelectedImage(galleryImages[nextIdx])
  }

  const handlePrevImage = () => {
    const prevIdx = (lightboxIndex - 1 + galleryImages.length) % galleryImages.length
    setLightboxIndex(prevIdx)
    setSelectedImage(galleryImages[prevIdx])
  }

  const handleCloseLightbox = () => {
    setSelectedImage(null)
  }

  return (
    <div className="rounded-[28px] bg-white p-8 shadow-sm border border-slate-200">
      <div className="mb-6">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500 font-semibold">Thư viện ảnh</p>
        <h2 className="mt-3 text-2xl font-semibold text-slate-950">Hình ảnh</h2>
      </div>

      <div className="space-y-6">
        <div
          onClick={() => handleOpenLightbox(0)}
          className="group relative overflow-hidden rounded-[24px] bg-slate-900 cursor-pointer"
        >
          <img
            src={galleryImages[0]?.url || placeholderImage}
            alt="Main"
            className="h-[400px] w-full object-cover transition group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition flex items-center justify-center">
            <svg className="h-16 w-16 text-white opacity-0 group-hover:opacity-100 transition" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
          </div>
        </div>

        {galleryImages.length > 1 && (
          <div className="grid grid-cols-3 gap-4 sm:grid-cols-4">
            {galleryImages.slice(0, 8).map((image, idx) => (
              <button
                key={idx}
                onClick={() => handleOpenLightbox(idx)}
                className="group relative overflow-hidden rounded-[16px] bg-slate-200 hover:ring-2 hover:ring-blue-500 transition"
              >
                <img
                  src={image.url}
                  alt={`Gallery ${idx + 1}`}
                  className="h-24 w-full object-cover transition group-hover:scale-110"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
          <div className="relative max-w-4xl w-full">
            <img
              src={selectedImage.url}
              alt={selectedImage.title}
              className="h-auto w-full rounded-lg"
            />

            <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
              <h3 className="text-lg font-semibold text-white">{selectedImage.title}</h3>
              <button
                onClick={handleCloseLightbox}
                className="rounded-full bg-white/20 p-2 hover:bg-white/30 transition text-white"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {galleryImages.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-2 hover:bg-white/30 transition text-white"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <button
                  onClick={handleNextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-2 hover:bg-white/30 transition text-white"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}

            <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 p-4">
              {galleryImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handleOpenLightbox(idx)}
                  className={`h-2 transition rounded-full ${
                    idx === lightboxIndex ? 'bg-white w-6' : 'bg-white/50 w-2 hover:bg-white/75'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
})

VenueGallery.displayName = 'VenueGallery'

export default VenueGallery
