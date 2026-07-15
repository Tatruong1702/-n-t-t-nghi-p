import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Gift } from 'lucide-react'

export default function PromotionSection({ promotions = [], loading }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const slideCount = promotions.length

  const activePromo = useMemo(() => promotions[activeIndex] || {}, [activeIndex, promotions])

  useEffect(() => {
    if (!slideCount) return undefined
    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slideCount)
    }, 6000)
    return () => window.clearInterval(interval)
  }, [slideCount])

  if (loading) {
    return (
      <section className="bg-slate-950 px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center text-slate-300">Đang tải ưu đãi...</div>
      </section>
    )
  }

  if (!promotions.length) {
    return null
  }

  return (
    <section className="bg-slate-950 px-4 py-16 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-emerald-400">Ưu đãi đặc sắc</p>
            <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">Khuyến mãi nổi bật</h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setActiveIndex((current) => (current - 1 + slideCount) % slideCount)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/15"
            >
              <ArrowLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => setActiveIndex((current) => (current + 1) % slideCount)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/15"
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/10 p-6 shadow-[0_35px_80px_rgba(15,23,42,0.18)] sm:p-8">
          <motion.div
            key={activePromo.id || activeIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
            className={`rounded-[32px] ${activePromo.accent || 'bg-emerald-500/10'} p-8`}
          >
            <div className="inline-flex items-center gap-3 rounded-3xl bg-white/10 px-4 py-3 text-sm font-semibold text-white">
              <Gift size={18} />
              Khuyến mãi {activeIndex + 1}
            </div>
            <h3 className="mt-7 text-3xl font-semibold text-white sm:text-4xl">{activePromo.title}</h3>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-100/80 sm:text-base">{activePromo.description}</p>
            <Link to={`/venue/${activePromo.id}`} className="mt-8 inline-flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400">
              {activePromo.button}
              <ArrowRight size={16} />
            </Link>
          </motion.div>

          <div className="mt-8 flex items-center justify-center gap-3">
            {promotions.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`h-2.5 w-10 rounded-full transition ${index === activeIndex ? 'bg-emerald-400' : 'bg-white/30 hover:bg-white/60'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
