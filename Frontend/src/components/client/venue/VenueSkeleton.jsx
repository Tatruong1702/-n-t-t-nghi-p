import React from 'react'

export default function VenueSkeleton() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="bg-white pb-10 shadow-sm">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.4fr_0.95fr]">
            <div className="space-y-6">
              <div className="h-[500px] w-full animate-pulse rounded-[28px] bg-slate-200" />
              <div className="grid grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-28 w-full animate-pulse rounded-3xl bg-slate-200" />
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-4 rounded-[28px] border border-slate-200 bg-slate-50 p-8">
                <div className="h-8 w-1/2 animate-pulse rounded bg-slate-200" />
                <div className="h-10 w-full animate-pulse rounded bg-slate-200" />
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-6 w-full animate-pulse rounded bg-slate-200" />
                  ))}
                </div>
              </div>
              <div className="h-48 w-full animate-pulse rounded-[28px] bg-slate-200" />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.6fr_0.9fr]">
          <div className="space-y-8">
            <div className="space-y-4 rounded-[28px] bg-white p-8 shadow-sm">
              <div className="h-8 w-1/2 animate-pulse rounded bg-slate-200" />
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-32 w-full animate-pulse rounded-[24px] bg-slate-200" />
                ))}
              </div>
            </div>

            <div className="space-y-4 rounded-[28px] bg-white p-8 shadow-sm">
              <div className="h-8 w-1/2 animate-pulse rounded bg-slate-200" />
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-32 w-full animate-pulse rounded-[24px] bg-slate-200" />
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="h-64 w-full animate-pulse rounded-[28px] bg-slate-200" />
            <div className="h-64 w-full animate-pulse rounded-[28px] bg-slate-200" />
          </div>
        </div>
      </section>
    </main>
  )
}
