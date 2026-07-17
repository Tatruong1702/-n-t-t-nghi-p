import React from 'react'
import { motion } from 'framer-motion'

export default function StatCard({ title, value, subtitle, icon: Icon, tone = 'default', trend, loading = false }) {
  const toneStyles = {
    default: 'from-slate-900 to-slate-800 text-white',
    cyan: 'from-cyan-600 to-sky-600 text-white',
    orange: 'from-orange-500 to-amber-500 text-white',
    success: 'from-emerald-500 to-cyan-500 text-white',
    warning: 'from-amber-500 to-orange-500 text-white',
    danger: 'from-rose-500 to-orange-500 text-white',
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="group relative overflow-hidden rounded-[24px] border border-slate-200/70 bg-white/90 p-5 shadow-[0_20px_60px_-24px_rgba(15,23,42,0.28)] backdrop-blur-xl"
    >
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${toneStyles[tone] || toneStyles.default}`} />
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">{title}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
            {loading ? '—' : value}
          </p>
          {subtitle ? <p className="mt-2 text-sm text-slate-600">{subtitle}</p> : null}
        </div>
        {Icon ? (
          <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${toneStyles[tone] || toneStyles.default}`}>
            <Icon className="h-5 w-5" />
          </div>
        ) : null}
      </div>
      {trend ? <div className="mt-4 text-sm font-medium text-cyan-700">{trend}</div> : null}
    </motion.article>
  )
}
