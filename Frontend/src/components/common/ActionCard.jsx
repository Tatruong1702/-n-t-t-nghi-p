import React from 'react'
import { motion } from 'framer-motion'

export default function ActionCard({ title, description, icon: Icon, actionLabel, onClick, accent = 'cyan' }) {
  const accentStyles = {
    cyan: 'from-cyan-500/15 to-sky-500/10 text-cyan-700 border-cyan-200/70',
    orange: 'from-orange-500/15 to-amber-500/10 text-orange-700 border-orange-200/70',
    slate: 'from-slate-900/10 to-slate-700/5 text-slate-700 border-slate-200/70',
  }

  return (
    <motion.button
      whileHover={{ y: -3, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`group rounded-[24px] border bg-gradient-to-br ${accentStyles[accent] || accentStyles.cyan} p-5 text-left shadow-[0_16px_50px_-24px_rgba(15,23,42,0.28)] transition`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-lg font-semibold">{title}</p>
          <p className="mt-2 text-sm leading-6 opacity-80">{description}</p>
        </div>
        {Icon ? <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/70"><Icon className="h-5 w-5" /></div> : null}
      </div>
      {actionLabel ? <div className="mt-6 text-sm font-semibold">{actionLabel} →</div> : null}
    </motion.button>
  )
}
