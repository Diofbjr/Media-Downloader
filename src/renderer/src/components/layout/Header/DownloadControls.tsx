interface Props {
  downloadPath: string
  onSelectPath: () => void
  onDownload: () => void
  canDownload: boolean
  isDownloading: boolean
  selectedCount: number
}

export const DownloadControls = ({
  downloadPath,
  onSelectPath,
  onDownload,
  canDownload,
  isDownloading,
  selectedCount,
}: Props) => (
  <div className="flex items-center gap-2 shrink-0 ml-auto">
    <button
      onClick={onSelectPath}
      title={downloadPath || 'Selecionar pasta de destino'}
      className={`h-10 px-4 border rounded-xl font-bold text-[10px] transition-all truncate max-w-37.5 ${
        downloadPath
          ? 'border-green-500/50 text-green-500 bg-green-500/5'
          : 'border-white/10 text-gray-400 hover:bg-white/5'
      }`}
    >
      {downloadPath ? '📂 PASTA OK' : '📁 DEFINIR PASTA'}
    </button>

    <button
      onClick={onDownload}
      disabled={!canDownload || isDownloading}
      className={`h-10 px-6 rounded-xl text-[10px] font-black text-white transition-all active:scale-95 flex items-center gap-2 ${
        isDownloading
          ? 'bg-blue-600 animate-pulse'
          : 'bg-green-600 hover:bg-green-500 disabled:bg-gray-800 disabled:text-gray-500'
      }`}
    >
      {isDownloading ? (
        'BAIXANDO...'
      ) : (
        <>
          <span>BAIXAR</span>
          {selectedCount > 0 && (
            <span className="bg-white/20 px-2 py-0.5 rounded-full text-[9px]">{selectedCount}</span>
          )}
        </>
      )}
    </button>
  </div>
)
