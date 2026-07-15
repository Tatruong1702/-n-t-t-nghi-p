import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export default function NewsSection({ news = [], loading }) {
  if (loading) {
    return (
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="text-center text-slate-500">Đang tải tin tức...</div>
      </section>
    )
  }

  if (!news.length) {
    return null
  }

  return (
    <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-emerald-600">Tin tức và cập nhật</p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-950 sm:text-4xl">Cập nhật sân nổi bật</h2>
        </div>
        <button className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-50">
          Xem tất cả
          <ArrowRight size={16} />
        </button>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        {news.map((item, index) => (
          <motion.article
            key={item.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="overflow-hidden rounded-[32px] border border-slate-200/80 bg-white shadow-[0_28px_80px_rgba(15,23,42,0.08)]"
          >
            <div className="relative h-72 overflow-hidden">
              <img src={item.image} alt={item.title} className="h-full w-full object-cover transition duration-700 hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent"></div>
            </div>
            <div className="p-8">
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-600">
                {item.meta}
              </div>
              <h3 className="mt-5 text-2xl font-semibold text-slate-950">{item.title}</h3>
              <p className="mt-4 text-sm leading-7 text-slate-600">{item.description}</p>
              <Link to={`/venue/${item.id}`} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 transition hover:text-emerald-500">
                Xem thêm
                <ArrowRight size={16} />
              </Link>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  )
}
