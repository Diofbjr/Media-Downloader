import { useState, useRef } from 'react'
import { MediaItem } from '../../types'

interface MediaCardProps {
  item: MediaItem
  isSelected: boolean
  isSelectionMode: boolean
  onToggle: (id: string) => void
  onView: (item: MediaItem) => void
  onFavorite: (item: MediaItem) => void
  isFavorite: (id: string) => boolean
}

export const MediaCard = ({
  item,
  isSelected,
  isSelectionMode,
  onToggle,
  onView,
  onFavorite,
  isFavorite,
}: MediaCardProps) => {
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const [isPressing, setIsPressing] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  // Verifica se é um álbum do Erome (contém "/a/" na URL)
  const isAlbum = item.fileUrl.includes('erome.com/a/')
  const fav = isFavorite(item.id)

  // Lógica para seleção via clique longo
  const handleMouseDown = () => {
    if (isSelectionMode) return
    setIsPressing(true)
    timerRef.current = setTimeout(() => {
      onToggle(item.id)
      setIsPressing(false)
    }, 500)
  }

  const handleMouseUp = () => {
    if (isSelectionMode) {
      onToggle(item.id)
    } else if (isPressing) {
      clearTimeout(timerRef.current!)
      setIsPressing(false)
      onView(item)
    }
  }

  return (
    <div
      className={`group relative aspect-3/4 rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 bg-[#16191d] ${
        isSelected
          ? 'ring-4 ring-blue-500 ring-offset-4 ring-offset-[#0a0c0f] scale-[0.98]'
          : 'hover:shadow-2xl hover:shadow-blue-500/10'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        setIsPressing(false)
        if (timerRef.current) clearTimeout(timerRef.current)
      }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      {/* Overlay de Seleção / Hover */}
      <div
        className={`absolute inset-0 z-20 transition-opacity duration-300 ${
          isSelected ? 'bg-blue-500/20' : 'bg-black/0 group-hover:bg-black/20'
        }`}
      />

      {/* Badge de Álbum (Especial para Erome) */}
      {isAlbum && (
        <div className="absolute top-3 left-3 z-30 flex items-center gap-1.5 bg-blue-600 text-white px-2.5 py-1 rounded-lg shadow-lg">
          <span className="text-[10px] font-black tracking-widest">ÁLBUM</span>
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
          </svg>
        </div>
      )}

      {/* Botão Favoritar */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          onFavorite(item)
        }}
        className={`absolute top-3 right-3 z-30 p-2 rounded-xl backdrop-blur-md transition-all duration-300 ${
          fav
            ? 'bg-pink-500 opacity-100'
            : 'bg-black/40 opacity-0 group-hover:opacity-100 hover:bg-black/60'
        }`}
      >
        <span className="text-sm">{fav ? '❤️' : '♡'}</span>
      </button>

      {/* Indicador de Checkbox (Modo Seleção) */}
      {isSelectionMode && (
        <div
          className={`absolute bottom-4 left-4 z-30 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
            isSelected ? 'bg-blue-500 border-blue-500 scale-110' : 'bg-black/40 border-white/40'
          }`}
        >
          {isSelected && <span className="text-white text-[10px] font-bold">✓</span>}
        </div>
      )}

      {/* Conteúdo Visual (Imagem ou Vídeo) */}
      <div className="w-full h-full flex items-center justify-center bg-slate-900">
        {item.type === 'video' ? (
          <>
            {!isHovered ? (
              <img
                src={item.previewUrl}
                className="w-full h-full object-cover"
                alt=""
                loading="lazy"
              />
            ) : (
              <video
                src={item.fileUrl}
                className="w-full h-full object-cover"
                muted
                loop
                autoPlay
                playsInline
              />
            )}
            <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-md z-20">
              <span className="text-[8px] font-black text-white tracking-widest">VIDEO</span>
            </div>
          </>
        ) : (
          <img
            src={item.previewUrl}
            className={`w-full h-full object-cover transition-transform duration-700 ${
              isHovered ? 'scale-110' : 'scale-100'
            }`}
            alt=""
            loading="lazy"
          />
        )}
      </div>

      {/* Efeito de carregamento (Clique longo) */}
      {isPressing && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  )
}
