interface DownloadProgressProps {
  current: number
  total: number
}

export const DownloadProgress = ({ current, total }: DownloadProgressProps) => (
  <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-80 bg-[#16191d] border border-blue-500/30 p-4 rounded-2xl shadow-2xl z-50 animate-in slide-in-from-bottom-5">
    <div className="flex justify-between text-[9px] font-black text-blue-500 mb-2 uppercase">
      <span>Baixando Mídias</span>
      <span>
        {current}/{total}
      </span>
    </div>
    <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
      <div
        className="h-full bg-blue-500 transition-all duration-300"
        style={{ width: `${(current / total) * 100}%` }}
      />
    </div>
  </div>
)
