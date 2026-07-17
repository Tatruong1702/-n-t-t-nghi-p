import React from 'react'
import { motion } from 'framer-motion'

export default function ChartCard({ title, subtitle, children, action }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-[28px] border border-slate-200/70 bg-white/90 p-5 shadow-[0_20px_60px_-24px_rgba(15,23,42,0.24)] backdrop-blur-xl"
    >
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-950">{title}</h3>
          {subtitle ? <p className="mt-1 text-sm text-slate-600">{subtitle}</p> : null}
        </div>
        {action ? <div>{action}</div> : null}
      </div>
      {children}
    </motion.section>
  )
}
