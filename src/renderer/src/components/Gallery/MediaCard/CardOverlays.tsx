import { MediaItem } from '../../../types'
import { CATEGORY_COLORS } from '@renderer/services/ehentai'

interface Props {
  item: MediaItem
  isSelected: boolean
  isSelectionMode: boolean
  onFavorite: (item: MediaItem) => void
  isFavorite: (id: string) => boolean
}

export const CardOverlays = ({
  item,
  isSelected,
  isSelectionMode,
  onFavorite,
  isFavorite,
}: Props) => {
  const isEhentai = item.fileUrl.includes('e-hentai.org')
  const isEromeAlbum = item.fileUrl.includes('erome.com/a/')
  const favorite = isFavorite(item.id)

  // Lógica de Categorias do E-Hentai
  const categoryName = isEhentai ? item.tags[0] : null
  const categoryColor = categoryName ? CATEGORY_COLORS[categoryName] || '#808080' : null

  return (
    <>
      {/* 1. Tag de Categoria Colorida (E-Hentai) */}
      {isEhentai && categoryName && (
        <div className="absolute top-0 left-0 right-0 z-40 flex justify-center pt-2 pointer-events-none">
          <span
            className="px-3 py-0.5 rounded-full text-[9px] font-black text-white shadow-xl backdrop-blur-sm uppercase tracking-tight border border-white/10"
            style={{ backgroundColor: `${categoryColor}E6` }} // E6 adiciona transparência alpha
          >
            {categoryName}
          </span>
        </div>
      )}

      {/* 2. Badge de Álbum (Erome) */}
      {isEromeAlbum && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-blue-600/90 backdrop-blur-md px-3 py-1 rounded-full text-[8px] font-black text-white z-10 shadow-lg border border-white/10">
          📁 ÁLBUM
        </div>
      )}

      {/* 3. Seleção / Checkbox */}
      <div
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

      {/* 4. Botão Favoritar */}
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

      {/* 5. Gradiente de Fundo (Tailwind v4 syntax compat) */}
      <div className="absolute inset-0 bg-linear-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </>
  )
}
