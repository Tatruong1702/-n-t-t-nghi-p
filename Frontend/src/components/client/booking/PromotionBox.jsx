import React from 'react'

export default React.memo(function PromotionBox({ promotions = [], selectedPromo, onSelectPromo }) {
  if (!promotions.length) {
    return null
  }

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Ưu đãi</p>
      <div className="mt-4 space-y-4">
        {promotions.map((promo) => (
          <button
            type="button"
            key={promo.id}
            onClick={() => onSelectPromo(promo.code)}
            className={`w-full rounded-3xl border px-4 py-4 text-left transition ${
              selectedPromo === promo.code
                ? 'border-emerald-500 bg-emerald-50 text-slate-900'
                : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">{promo.title}</p>
                <p className="mt-1 text-sm text-slate-500">{promo.description}</p>
              </div>
              <span className="text-sm font-semibold text-emerald-600">{promo.discountLabel}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
})
