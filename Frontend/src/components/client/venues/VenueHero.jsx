import React from 'react'
import { Search, MapPin, Zap } from 'lucide-react'
import { motion } from 'framer-motion'

export default function VenueHero({ stats = { total: 0, bookings: 0 } }) {
  return (
    <section className="relative min-h-[600px] overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 pt-16 pb-20 px-6 lg:px-8">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative mx-auto max-w-7xl">
        <motion.div
          className="space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Title & Description */}
          <div className="max-w-3xl space-y-4">
            <h1 className="text-5xl lg:text-6xl font-black text-white leading-tight">
              Tìm sân bóng <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">phù hợp</span> cho trận đấu của bạn
            </h1>
            <p className="text-lg text-slate-300 max-w-2xl">
              Khám phá hàng nghìn sân bóng chất lượng, đặt ngay với giá tốt nhất, và trải nghiệm dịch vụ tuyệt vời
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 sm:gap-6 sm:grid-cols-4 max-w-2xl">
            <div className="rounded-[20px] bg-white/5 border border-white/10 backdrop-blur-sm p-4 text-center">
              <p className="text-sm text-slate-400">Tổng sân</p>
              <p className="text-3xl font-bold text-emerald-400 mt-2">{stats.total || 0}</p>
            </div>
            <div className="rounded-[20px] bg-white/5 border border-white/10 backdrop-blur-sm p-4 text-center">
              <p className="text-sm text-slate-400">Tổng đặt</p>
              <p className="text-3xl font-bold text-cyan-400 mt-2">{stats.bookings || 0}</p>
            </div>
            <div className="rounded-[20px] bg-white/5 border border-white/10 backdrop-blur-sm p-4 text-center">
              <p className="text-sm text-slate-400">Thành phố</p>
              <p className="text-3xl font-bold text-violet-400 mt-2">20+</p>
            </div>
            <div className="rounded-[20px] bg-white/5 border border-white/10 backdrop-blur-sm p-4 text-center">
              <p className="text-sm text-slate-400">Rating</p>
              <p className="text-3xl font-bold text-yellow-400 mt-2">4.8★</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-slate-50 to-transparent" />
    </section>
  )
}
