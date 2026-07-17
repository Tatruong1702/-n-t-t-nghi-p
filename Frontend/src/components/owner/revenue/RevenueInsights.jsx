import React from 'react'
import { Sparkles, TrendingUp, CircleAlert, BadgeCheck } from 'lucide-react'

const RevenueInsights = React.memo(function RevenueInsights({ insights }) {
  return (
    <div className="rounded-[28px] border border-slate-200/70 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-6 text-white shadow-[0_18px_60px_-26px_rgba(15,23,42,0.45)]">
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-300">
        <Sparkles className="h-4 w-4" /> Insight & gợi ý
      </div>
      <div className="mt-5 space-y-3">
        {insights.map((insight, index) => (
          <div key={index} className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
            <div className="flex items-start gap-3">
              {insight.type === 'positive' ? <BadgeCheck className="mt-0.5 h-4 w-4 text-emerald-400" /> : insight.type === 'warning' ? <CircleAlert className="mt-0.5 h-4 w-4 text-amber-400" /> : <TrendingUp className="mt-0.5 h-4 w-4 text-cyan-400" />}
              <div>
                <p className="text-sm font-semibold text-white">{insight.title}</p>
                <p className="mt-1 text-sm text-slate-300">{insight.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
})

export default RevenueInsights
