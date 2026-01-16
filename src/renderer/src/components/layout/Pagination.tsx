interface PaginationProps {
  page: number
  hasMedia: boolean
  onNext: () => void
  onPrev: () => void
  canPrev: boolean
}

export function Pagination({ page, hasMedia, onNext, onPrev, canPrev }: PaginationProps) {
  if (!hasMedia) return null

  return (
    <div className="flex items-center justify-center gap-8 py-16">
      <button
        disabled={!canPrev}
        onClick={onPrev}
        className="px-8 py-3 bg-white/5 border border-white/5 rounded-2xl disabled:opacity-10 font-black text-[10px] hover:bg-white/10 transition-colors"
      >
        ❮ ANTERIOR
      </button>
      <div className="text-center">
        <p className="text-[10px] text-blue-500 font-black uppercase tracking-widest">Página</p>
        <p className="text-xl font-mono text-white">{page + 1}</p>
      </div>
      <button
        onClick={onNext}
        className="px-8 py-3 bg-white/5 border border-white/5 rounded-2xl font-black text-[10px] hover:bg-white/10 transition-colors"
      >
        PRÓXIMA ❯
      </button>
    </div>
  )
}
