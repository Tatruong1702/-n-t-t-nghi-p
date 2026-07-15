import React from 'react'
import { motion } from 'framer-motion'
import { Activity, BarChart3, Users, Globe2 } from 'lucide-react'

const iconMap = {
  'Sân bóng': Activity,
  'Sân con': BarChart3,
  'Tỉnh thành': Globe2,
  'Đánh giá': Users,
}

export default function StatsSection({ stats = [], loading }) {
  if (loading) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center text-slate-500">Đang tải số liệu...</div>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid gap-4 md:grid-cols-4">
        {stats.map((item, index) => {
          const Icon = iconMap[item.label] || Activity
          return (
            <motion.article
              key={item.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="rounded-[28px] border border-slate-200/20 bg-white/80 p-6 shadow-[0_32px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-950/10 text-slate-950">
                <Icon size={24} />
              </div>
              <p className="mt-6 text-3xl font-semibold text-slate-950">{item.value}</p>
              <p className="mt-2 text-sm text-slate-500">{item.label}</p>
            </motion.article>
          )
        })}
      </div>
    </section>
  )
}
