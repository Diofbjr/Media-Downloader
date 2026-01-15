import { useState } from 'react'
import { MediaItem } from '../../types'
import { CATEGORY_COLORS } from '@renderer/services/ehentai'

interface MediaGridProps {
  items: MediaItem[]
  selectedIds: string[]
  isSelectionMode: boolean
  onToggleItem: (id: string) => void
  onViewItem: (item: MediaItem) => void
  onFavorite: (item: MediaItem) => void
  isFavorite: (id: string) => boolean
}

export const MediaGrid = ({
  items,
  selectedIds,
  isSelectionMode,
  onToggleItem,
  onViewItem,
  onFavorite,
  isFavorite,
}: MediaGridProps) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {items.map((item) => {
        const isSelected = selectedIds.includes(item.id)
        const favorite = isFavorite(item.id)
        const isHovered = hoveredId === item.id && item.type === 'video' && !!item.fileUrl

        const isEhentai = item.fileUrl.includes('e-hentai.org')
        const isEromeAlbum = item.fileUrl.includes('erome.com/a/')

        const categoryName = isEhentai ? item.tags[0] : null
        // Agora usa a constante importada
        const categoryColor = categoryName ? CATEGORY_COLORS[categoryName] || '#808080' : null

        const hasNoPreview = item.type === 'video' && !item.previewUrl

        return (
          <div
            key={item.id}
            className={`group relative aspect-3/4 rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 bg-slate-900 ${
              isSelected
                ? 'ring-4 ring-blue-500 scale-[0.98]'
                : 'hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]'
            }`}
            onMouseEnter={() => setHoveredId(item.id)}
            onMouseLeave={() => setHoveredId(null)}
            onClick={() => (isSelectionMode ? onToggleItem(item.id) : onViewItem(item))}
          >
            {/* TAG DE CATEGORIA COLORIDA (E-Hentai) */}
            {isEhentai && categoryName && (
              <div className="absolute top-0 left-0 right-0 z-40 flex justify-center pt-2 pointer-events-none">
                <span
                  className="px-3 py-0.5 rounded-full text-[10px] font-black text-white shadow-xl backdrop-blur-sm uppercase tracking-tight"
                  style={{ backgroundColor: `${categoryColor}E6` }}
                >
                  {categoryName}
                </span>
              </div>
            )}

            <div className="w-full h-full pointer-events-none flex items-center justify-center">
              {isHovered ? (
                <video
                  src={item.fileUrl}
                  className="w-full h-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              ) : hasNoPreview ? (
                <video
                  src={`${item.fileUrl}#t=0.5`}
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                  muted
                  playsInline
                  preload="metadata"
                />
              ) : (
                <img
                  src={item.previewUrl || item.fileUrl}
                  alt=""
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  loading="lazy"
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).src =
                      'https://placehold.co/400x600/16191d/666?text=Sem+Capa'
                  }}
                />
              )}
            </div>

            {/* SELO DE ÁLBUM (Apenas Erome) */}
            {isEromeAlbum && (
              <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-blue-600/90 backdrop-blur-md px-3 py-1 rounded-full text-[8px] font-black text-white z-10 shadow-lg">
                📁 ÁLBUM
              </div>
            )}

            {/* Marcador de Tipo Vídeo */}
            {item.type === 'video' && !isHovered && (
              <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md text-[9px] font-black text-white z-10">
                VIDEO
              </div>
            )}

            {/* Seleção Checkbox */}
            <div
              onClick={(e) => {
                e.stopPropagation()
                onToggleItem(item.id)
              }}
              className={`absolute top-3 left-3 w-7 h-7 rounded-lg border-2 z-30 transition-all flex items-center justify-center ${
                isSelected
                  ? 'bg-blue-500 border-blue-500 scale-110 shadow-lg'
                  : isSelectionMode
                    ? 'bg-black/20 border-white/60 opacity-100'
                    : 'bg-black/30 border-white/40 opacity-0 group-hover:opacity-100'
              }`}
            >
              {isSelected && <span className="text-white text-sm font-bold">✓</span>}
            </div>

            {/* Gradiente de fundo corrigido para Tailwind v3/v4 */}
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Botão Favoritar */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                onFavorite(item)
              }}
              className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md z-30 transition-all duration-300 ${
                favorite
                  ? 'bg-pink-500 text-white'
                  : 'bg-black/40 text-white opacity-0 group-hover:opacity-100'
              }`}
            >
              {favorite ? '❤️' : '🤍'}
            </button>
          </div>
        )
      })}
    </div>
  )
}
