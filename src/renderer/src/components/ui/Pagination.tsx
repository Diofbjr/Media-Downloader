interface Props {
  isVisible: boolean
  page: number
  onPrev: () => void
  onNext: () => void
}

export const Pagination = ({ isVisible, page, onPrev, onNext }: Props) => {
  if (!isVisible) return null
  return (
    <div className="flex items-center justify-center gap-8 py-16">
      <button
        disabled={page === 0}
        onClick={onPrev}
        className="px-10 py-3 bg-white/5 border border-white/5 rounded-2xl disabled:opacity-20 font-black text-[10px] tracking-widest hover:bg-white/10 transition-colors"
      >
        ❮ ANTERIOR
      </button>
      <div className="text-center">
        <p className="text-[10px] text-blue-500 font-black tracking-tighter">PAGE</p>
        <p className="text-xl font-mono leading-none">{page + 1}</p>
      </div>
      <button
        onClick={onNext}
        className="px-10 py-3 bg-white/5 border border-white/5 rounded-2xl font-black text-[10px] tracking-widest hover:bg-white/10 transition-colors"
      >
        PRÓXIMA ❯
      </button>
    </div>
  )
}
