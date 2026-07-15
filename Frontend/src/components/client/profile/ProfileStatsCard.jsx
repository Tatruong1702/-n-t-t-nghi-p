import React from 'react'

export default React.memo(function ProfileStatsCard({ title, value, description, accent }) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-gradient-to-br from-slate-950/90 to-slate-900/80 p-6 shadow-[0_30px_85px_rgba(15,23,42,0.12)] text-white">
      <p className="text-sm uppercase tracking-[0.28em] text-slate-300">{title}</p>
      <p className={`mt-4 text-3xl font-semibold ${accent || 'text-white'}`}>{value}</p>
      <p className="mt-2 text-sm text-slate-300">{description}</p>
    </div>
  )
})
