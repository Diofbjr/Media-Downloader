interface Props {
  isAllSelected: boolean
  onToggleAll: () => void
  downloadPath: string
  onSelectFolder: () => void
  onDownloadSelected: () => void
  selectedCount: number
  isDownloading: boolean
}

export const NavActions = ({
  isAllSelected,
  onToggleAll,
  downloadPath,
  onSelectFolder,
  onDownloadSelected,
  selectedCount,
  isDownloading,
}: Props) => (
  <div className="flex items-center gap-3">
    <button
      onClick={onToggleAll}
      className={`text-[10px] font-bold px-2 transition-colors ${
        isAllSelected ? 'text-blue-500' : 'text-gray-500 hover:text-white'
      }`}
    >
      {isAllSelected ? 'DESMARCAR TUDO' : 'SELECIONAR TUDO'}
    </button>

    <button
      onClick={onSelectFolder}
      className={`text-[10px] px-4 py-2 border rounded-xl font-bold transition-all ${
        downloadPath
          ? 'border-green-500/40 text-green-500 bg-green-500/5'
          : 'border-white/10 text-gray-400 hover:bg-white/5'
      }`}
    >
      {downloadPath ? 'PASTA OK' : 'DEFINIR PASTA'}
    </button>

    <button
      onClick={onDownloadSelected}
      disabled={selectedCount === 0 || !downloadPath || isDownloading}
      className="bg-green-600 disabled:bg-gray-800 disabled:text-gray-500 px-6 py-2 rounded-xl text-[10px] font-black text-white active:scale-95 transition-all shadow-lg shadow-green-900/20 flex items-center gap-2"
    >
      {isDownloading ? (
        <span className="flex items-center gap-2">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          BAIXANDO...
        </span>
      ) : (
        `BAIXAR (${selectedCount})`
      )}
    </button>
  </div>
)
