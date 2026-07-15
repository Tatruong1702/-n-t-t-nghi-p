import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

export default function Testimonials({ testimonials = [], loading }) {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    if (!testimonials.length) return undefined
    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length)
    }, 7000)
    return () => window.clearInterval(interval)
  }, [testimonials.length])

  if (loading) {
    return (
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="text-center text-slate-500">Đang tải đánh giá...</div>
      </section>
    )
  }

  if (!testimonials.length) {
    return null
  }

  const activeTestimonial = testimonials[activeIndex]

  return (
    <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
      <div className="mb-10">
        <p className="text-sm uppercase tracking-[0.3em] text-emerald-600">Đánh giá khách hàng</p>
        <h2 className="mt-3 text-3xl font-semibold text-slate-950 sm:text-4xl">Người chơi đánh giá</h2>
      </div>

      <div className="relative overflow-hidden rounded-[32px] border border-slate-200/80 bg-white/85 p-8 shadow-[0_35px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl">
        <motion.div
          key={activeTestimonial.id || activeIndex}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.5 }}
          className="space-y-7"
        >
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              {activeTestimonial.avatar ? (
                <img src={activeTestimonial.avatar} alt={activeTestimonial.name} className="h-20 w-20 rounded-3xl object-cover" />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-100 text-2xl font-semibold text-emerald-700">
                  {activeTestimonial.name?.charAt(0) || 'A'}
                </div>
              )}
              <div>
                <h3 className="text-2xl font-semibold text-slate-950">{activeTestimonial.name}</h3>
                <p className="text-sm text-slate-500">{activeTestimonial.role}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-amber-500">
              {Array.from({ length: activeTestimonial.rating }).map((_, idx) => (
                <Star key={idx} size={18} />
              ))}
            </div>
          </div>
          <p className="text-lg leading-8 text-slate-700">“{activeTestimonial.review}”</p>
        </motion.div>

        <div className="mt-8 flex justify-center gap-3">
          {testimonials.map((item, index) => (
            <button
              key={item.id || index}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`h-2.5 w-10 rounded-full transition ${index === activeIndex ? 'bg-emerald-500' : 'bg-slate-300/60 hover:bg-slate-400/80'}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
