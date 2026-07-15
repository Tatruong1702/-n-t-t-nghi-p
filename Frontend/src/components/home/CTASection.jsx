import React from 'react'
import { motion } from 'framer-motion'

export default function CTASection() {
  return (
    <section className="bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-600 px-4 py-20 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-[36px] border border-white/10 bg-slate-950/90 p-10 shadow-[0_40px_120px_rgba(16,24,40,0.28)] backdrop-blur-xl">
        <div className="grid gap-8 lg:grid-cols-[1.7fr_1fr] lg:items-center">
          <div className="space-y-4">
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
              className="text-sm uppercase tracking-[0.3em] text-emerald-300"
            >
              Sẵn sàng ra sân
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl font-semibold leading-tight text-white sm:text-5xl"
            >
              Sẵn sàng đặt sân cho trận đấu tiếp theo?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-2xl text-base leading-7 text-slate-300"
            >
              Khuyến mãi tốt, đặt sân nhanh và giao diện hỗ trợ mọi thiết bị giúp bạn tập trung vào trận đấu.
            </motion.p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row lg:justify-end">
            <button className="inline-flex h-14 items-center justify-center rounded-full bg-emerald-500 px-8 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400">
              Đặt sân ngay
            </button>
            <button className="inline-flex h-14 items-center justify-center rounded-full border border-white/20 bg-white/10 px-8 text-sm font-semibold text-white transition hover:bg-white/15">
              Xem danh sách sân
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
