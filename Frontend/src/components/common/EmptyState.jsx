import React from 'react'
import { motion } from 'framer-motion'
import { Inbox } from 'lucide-react'

export default function EmptyState({ title, description, action, icon: Icon = Inbox }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[28px] border border-dashed border-slate-300 bg-slate-50/80 p-10 text-center shadow-[0_12px_36px_-24px_rgba(15,23,42,0.28)]"
    >
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500/15 to-orange-500/10 text-cyan-700">
        <Icon className="h-7 w-7" />
      </div>
      <h3 className="mt-4 text-xl font-semibold text-slate-950">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">{description}</p>
      {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
    </motion.div>
  )
}
