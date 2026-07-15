import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function RegionSection({ regions }) {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
      <div className="mb-10">
        <p className="text-sm uppercase tracking-[0.3em] text-emerald-600">Khu vực nổi bật</p>
        <h2 className="mt-3 text-3xl font-semibold text-slate-950 sm:text-4xl">Sân theo vùng miền</h2>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-5">
        {regions.map((region, index) => (
          <Link key={region.name} to={`/?city=${region.name}`}>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="group relative overflow-hidden rounded-[28px] bg-slate-950/5 shadow-[0_24px_56px_rgba(15,23,42,0.08)]"
            >
              <img src={region.image} alt={region.name} className="h-56 w-full object-cover transition duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <p className="text-xl font-semibold">{region.name}</p>
                <p className="mt-1 text-sm text-slate-100/80">Khám phá sân hàng đầu</p>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </section>
  )
}
