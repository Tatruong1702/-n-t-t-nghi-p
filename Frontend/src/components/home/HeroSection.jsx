import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { CalendarDays, MapPin, Clock, Goal } from 'lucide-react'

const searchFields = [
  { id: 'location', label: 'Địa điểm', icon: MapPin, placeholder: 'Hà Nội, Đà Nẵng...' },
  { id: 'date', label: 'Ngày', icon: CalendarDays, placeholder: 'Chọn ngày' },
  { id: 'time', label: 'Khung giờ', icon: Clock, placeholder: '18:00 - 20:00' },
  { id: 'type', label: 'Loại sân', icon: Goal, placeholder: '3v3, 5v5, 7v7...' },
]

export default function HeroSection({ onSearch }) {
  const [filters, setFilters] = useState({ location: '', date: '', time: '', type: '' })

  const handleChange = (field, value) => {
    setFilters((previous) => ({ ...previous, [field]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (onSearch) onSearch(filters)
  }

  return (
    <section className="relative min-h-[92vh] overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.18),_transparent_35%)]"></div>
      <div
        className="absolute inset-0 bg-cover bg-center opacity-75"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=1600&q=80')",
          transform: 'translateZ(0)',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-950/35 to-slate-950/95" />

      <div className="relative z-10 mx-auto flex min-h-[92vh] max-w-7xl flex-col justify-center px-6 py-10 sm:px-8 lg:px-10">
        <div className="max-w-3xl space-y-6">
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="inline-flex rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium uppercase tracking-[0.24em] text-slate-100/85"
          >
            Sports Marketplace Premium
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
            className="text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl"
          >
            Đặt Sân Bóng Nhanh Chóng &amp; Dễ Dàng
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
            className="max-w-2xl text-base leading-8 text-slate-200 sm:text-lg"
          >
            Khám phá sân bóng chất lượng cao, so sánh giá rõ ràng và đặt sân trong vài giây với giao diện tối ưu cho mọi thiết bị.
          </motion.p>
        </div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: 'easeOut', delay: 0.3 }}
          className="mt-12 rounded-[32px] border border-white/10 bg-white/10 p-5 shadow-2xl shadow-slate-950/30 backdrop-blur-xl md:p-8"
        >
          <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {searchFields.map((field) => {
                const Icon = field.icon
                const inputType = field.id === 'date' ? 'date' : field.id === 'time' ? 'time' : 'text'
                return (
                  <label key={field.id} className="group flex flex-col gap-3 rounded-3xl border border-slate-200/10 bg-slate-950/20 p-4 transition duration-300 hover:border-slate-300/30 hover:bg-white/10">
                    <span className="flex items-center gap-2 text-sm font-medium text-slate-100/85">
                      <Icon size={18} className="text-emerald-300" />
                      {field.label}
                    </span>
                    <input
                      type={inputType}
                      value={filters[field.id]}
                      onChange={(event) => handleChange(field.id, event.target.value)}
                      placeholder={field.placeholder}
                      className="w-full bg-transparent text-base text-white placeholder:text-slate-300 focus:outline-none"
                    />
                  </label>
                )
              })}
            </div>

            <div className="flex items-end justify-end">
              <button type="submit" className="inline-flex h-14 w-full items-center justify-center rounded-[26px] bg-emerald-500 px-6 text-base font-semibold text-white shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-400 md:max-w-xs">
                Tìm sân ngay
              </button>
            </div>
          </div>
        </motion.form>
      </div>
    </section>
  )
}
