import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Activity, ShieldCheck, Sparkles, TrendingUp, Zap } from 'lucide-react'

const icons = {
  'Bóng đá': Activity,
  Pickleball: TrendingUp,
  'Cầu lông': ShieldCheck,
  Tennis: Sparkles,
  'Bóng rổ': Zap,
}

export default function SportsSection({ sports }) {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
      <div className="mb-10">
        <p className="text-sm uppercase tracking-[0.3em] text-emerald-600">Loại hình thể thao</p>
        <h2 className="mt-3 text-3xl font-semibold text-slate-950 sm:text-4xl">Tìm sân theo môn</h2>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-5">
        {sports.map((item, index) => {
          const Icon = icons[item.name] || Activity
          return (
            <Link key={item.name} to={`/?sport_type=${item.name}`}>
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="group overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_24px_56px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 hover:shadow-2xl"
            >
              <div className="flex h-48 items-end justify-center overflow-hidden bg-slate-950/5">
                <img src={item.image} alt={item.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
              </div>
              <div className="space-y-4 p-6 text-slate-950">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-emerald-500/10 text-emerald-500">
                  <Icon size={22} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{item.name}</h3>
                  <p className="mt-2 text-sm text-slate-500">{item.count} sân hiện có</p>
                </div>
              </div>
            </motion.div>
          </Link>
          )
        })}
      </div>
    </section>
  )
}
