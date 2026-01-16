import { useState } from 'react'
import { MediaItem } from '../../../types'

interface Props {
  item: MediaItem
  isFavorite: boolean
  onFavorite: () => void
  onClose: () => void
  downloadPath: string
}

export const LightboxHeader = ({ item, isFavorite, onFavorite, onClose, downloadPath }: Props) => {
  const [isDownloading, setIsDownloading] = useState(false)

  const handleQuickDownload = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!downloadPath || isDownloading) return

    setIsDownloading(true)
    const ext = item.fileUrl.split('.').pop()?.split('?')[0] || 'jpg'

    try {
      await window.electron.ipcRenderer.invoke('download:file', {
        url: item.fileUrl,
        destPath: downloadPath,
        fileName: `${item.id.replace(/[^a-z0-9]/gi, '_')}.${ext}`,
      })
    } catch (error) {
      console.error('Erro no download:', error)
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="w-full flex justify-between items-center px-4 py-1 z-50">
      <div className="flex gap-3 items-center">
        <span className="text-gray-500 font-mono text-[9px] bg-white/5 px-3 py-1 rounded-full border border-white/5 uppercase">
          ID: {item.id}
        </span>

        <button
          onClick={(e) => {
            e.stopPropagation()
            onFavorite()
          }}
          className={`px-3 py-1 rounded-full text-[9px] font-black transition-all border ${
            isFavorite
              ? 'bg-pink-600/20 border-pink-500 text-pink-500'
              : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
          }`}
        >
          {isFavorite ? '❤️ FAVORITO' : '♡ FAVORITAR'}
        </button>

        <button
          onClick={handleQuickDownload}
          disabled={!downloadPath || isDownloading}
          className={`px-3 py-1 rounded-full text-[9px] font-black transition-all border flex items-center gap-2 ${
            !downloadPath
              ? 'bg-gray-800 border-transparent text-gray-600 cursor-not-allowed'
              : isDownloading
                ? 'bg-blue-600/20 border-blue-500 text-blue-500 animate-pulse'
                : 'bg-green-600/20 border-green-500/50 text-green-500 hover:bg-green-600 hover:text-white'
          }`}
        >
          {isDownloading ? 'BAIXANDO...' : !downloadPath ? 'PASTA NÃO DEFINIDA' : '⬇ DOWNLOAD'}
        </button>
      </div>

      <button
        onClick={onClose}
        className="w-8 h-8 flex items-center justify-center bg-white/5 hover:bg-red-500/20 hover:text-red-500 rounded-lg text-white text-xl transition-all"
      >
        &times;
      </button>
    </div>
  )
}
