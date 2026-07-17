import React from 'react'
import { Search } from 'lucide-react'

export default React.memo(function HeaderSearchButton() {
  return (
    <button type="button" className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50">
      <Search size={18} />
    </button>
  )
})
