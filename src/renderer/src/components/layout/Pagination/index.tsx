interface PaginationProps {
  page: number
  isVisible: boolean
  isLoading: boolean
  canNext: boolean
  onNext: () => void
  onPrev: () => void
}

export function Pagination({
  page,
  isVisible,
  isLoading,
  canNext,
  onNext,
  onPrev,
}: PaginationProps) {
  if (!isVisible) return null

  const canPrev = page > 0

  return (
    <div className="flex items-center justify-center gap-8 py-16 animate-in fade-in slide-in-from-bottom-6 duration-700">
      {/* Botão Anterior */}
      <button
        disabled={!canPrev || isLoading}
        onClick={onPrev}
        className="group px-8 py-3 bg-white/5 border border-white/5 rounded-2xl disabled:opacity-20 disabled:cursor-not-allowed font-black text-[10px] hover:bg-white/10 hover:border-white/10 transition-all active:scale-95 text-white tracking-widest flex items-center gap-2"
      >
        <span className="group-hover:-translate-x-1 transition-transform">❮</span>
        ANTERIOR
      </button>

      {/* Indicador de Página Central */}
      <div className="flex flex-col items-center min-w-20">
        <span className="text-[10px] text-blue-500 font-black uppercase tracking-tighter mb-1">
          Página
        </span>
        <div
          className={`relative flex items-center justify-center ${isLoading ? 'animate-pulse' : ''}`}
        >
          <span className="text-2xl font-mono text-white tracking-tighter">
            {isLoading ? '—' : page + 1}
          </span>
          {isLoading && (
            <div className="absolute inset-0 border-b-2 border-blue-500/50 animate-bounce mt-8" />
          )}
        </div>
      </div>

      {/* Botão Próximo */}
      <button
        disabled={!canNext || isLoading}
        onClick={onNext}
        className="group px-8 py-3 bg-white/5 border border-white/5 rounded-2xl disabled:opacity-20 disabled:cursor-not-allowed font-black text-[10px] hover:bg-white/10 hover:border-white/10 transition-all active:scale-95 text-white tracking-widest flex items-center gap-2"
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping" />
            CARREGANDO
          </div>
        ) : (
          <>
            PRÓXIMA
            <span className="group-hover:translate-x-1 transition-transform">❯</span>
          </>
        )}
      </button>
    </div>
  )
}
