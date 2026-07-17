import React from 'react'
import { Search } from 'lucide-react'

export default function SearchBar({ value, onChange, placeholder = 'Tìm kiếm...', rightAction }) {
  return (
    <label className="flex items-center gap-3 rounded-[20px] border border-slate-200/80 bg-white/90 px-4 py-3 shadow-[0_12px_32px_-24px_rgba(15,23,42,0.3)]">
      <Search className="h-4 w-4 text-slate-400" />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full border-none bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
      />
      {rightAction ? <div>{rightAction}</div> : null}
    </label>
  )
}
