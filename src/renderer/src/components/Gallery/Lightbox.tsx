import { useEffect, useState } from 'react'
import { MediaItem } from '../../types'

interface LightboxProps {
  item: MediaItem
  onClose: () => void
  onNext: () => void
  onPrev: () => void
  onTagClick: (tag: string) => void
  isFavorite: boolean
  onFavorite: () => void
  downloadPath: string // Nova prop
}

export const Lightbox = ({
  item,
  onClose,
  onNext,
  onPrev,
  onTagClick,
  isFavorite,
  onFavorite,
  downloadPath,
}: LightboxProps) => {
  const [isDownloading, setIsDownloading] = useState(false)

  useEffect(() => {
    const handleKeys = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onNext()
      if (e.key === 'ArrowLeft') onPrev()
    }
    window.addEventListener('keydown', handleKeys)
    return () => window.removeEventListener('keydown', handleKeys)
  }, [onNext, onPrev, onClose])

  const handleQuickDownload = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!downloadPath || isDownloading) return

    setIsDownloading(true)
    const ext = item.fileUrl.split('.').pop()

    try {
      await window.electron.ipcRenderer.invoke('download:file', {
        url: item.fileUrl,
        destPath: downloadPath,
        fileName: `${item.id}.${ext}`,
      })
      // Opcional: Feedback visual de sucesso aqui
    } catch (error) {
      console.error('Erro no download rápido:', error)
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-100 bg-black/98 flex flex-col items-center justify-between p-2 backdrop-blur-xl animate-in fade-in duration-300"
      onClick={onClose}
    >
      {/* Header Atualizado */}
      <div className="w-full flex justify-between items-center px-4 py-1 z-110">
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

          {/* Botão de Download Rápido */}
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

      {/* Área da Mídia */}
      <div className="relative flex-1 w-full flex items-center justify-center overflow-hidden">
        <button
          onClick={(e) => {
            e.stopPropagation()
            onPrev()
          }}
          className="absolute left-4 p-4 bg-black/20 hover:bg-blue-600 rounded-2xl text-white transition-all z-110 border border-white/5 group"
        >
          <span className="group-hover:scale-125 block transition-transform">❮</span>
        </button>

        <div
          className="relative w-full h-full flex items-center justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          {item.type === 'video' ? (
            <video
              src={item.fileUrl}
              controls
              autoPlay
              className="max-w-full max-h-full rounded-lg shadow-2xl"
            />
          ) : (
            <img
              src={item.fileUrl}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              alt=""
            />
          )}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation()
            onNext()
          }}
          className="absolute right-4 p-4 bg-black/20 hover:bg-blue-600 rounded-2xl text-white transition-all z-110 border border-white/5 group"
        >
          <span className="group-hover:scale-125 block transition-transform">❯</span>
        </button>
      </div>

      {/* Footer */}
      <div
        className="w-full max-w-4xl mt-2 px-4 py-2 bg-[#16191d]/60 backdrop-blur-md rounded-2xl border border-white/5 z-110 mb-1"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[8px] font-black text-blue-500 uppercase tracking-widest">
              Tags
            </span>
            <div className="h-px flex-1 bg-white/5"></div>
          </div>
          <div className="flex flex-wrap gap-1 max-h-16 overflow-y-auto pr-2 custom-scrollbar">
            {item.tags.map((tag) => (
              <button
                key={tag}
                onClick={() => onTagClick(tag)}
                className="text-[8px] bg-blue-500/10 hover:bg-blue-600 border border-blue-500/10 text-blue-400 hover:text-white px-2 py-0.5 rounded-md transition-all whitespace-nowrap"
              >
                #{tag.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
