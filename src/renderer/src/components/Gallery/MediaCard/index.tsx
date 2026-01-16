import { useRef, useState } from 'react'
import { MediaItem } from '../../../types'
import { CardMedia } from './CardMedia'
import { CardOverlays } from './CardOverlays'
import { CardPressEffect } from './CardPressEffect'

interface ExtendedMediaItem extends MediaItem {
  thumbnailUrl?: string
  thumbnail?: string
  title?: string
}

interface MediaCardProps {
  item: ExtendedMediaItem
  isSelected: boolean
  isFavorite: boolean
  onClick: () => void
  onToggleItem: (id: string) => void
  onFavorite: (item: MediaItem) => void
}

export const MediaCard = ({
  item,
  isSelected,
  isFavorite,
  onClick,
  onToggleItem,
  onFavorite,
}: MediaCardProps) => {
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const clickStartTime = useRef<number>(0)
  const [isPressing, setIsPressing] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseDown = (): void => {
    clickStartTime.current = Date.now()
    setIsPressing(true)

    // Se o usuário segurar por 500ms, seleciona automaticamente
    timerRef.current = setTimeout(() => {
      onToggleItem(item.id)
      setIsPressing(false)
      timerRef.current = null // Limpa a referência após disparar
    }, 500)
  }

  const handleMouseUp = (e: React.MouseEvent): void => {
    const duration = Date.now() - clickStartTime.current
    setIsPressing(false)

    // Importante: Limpar o timer para não selecionar depois de soltar o botão
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }

    // Se o toque foi rápido (menos de 250ms), abre a lightbox
    // Se durou mais que isso, o setTimeout acima já cuidou da seleção
    if (duration < 250) {
      e.preventDefault()
      e.stopPropagation()
      onClick()
    }
  }

  const handleMouseLeave = (): void => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    setIsPressing(false)
    setIsHovered(false)
  }

  return (
    <div
      className={`group relative aspect-3/4 rounded-xl overflow-hidden bg-[#16191d] border-2 transition-all duration-300 select-none cursor-pointer ${
        isSelected
          ? 'border-blue-500 scale-[0.96] shadow-lg shadow-blue-500/20'
          : 'border-transparent hover:border-white/10'
      }`}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      {/* Efeito visual de preenchimento (feedback de pressão) */}
      {isPressing && <CardPressEffect />}

      {/* Componente que lida com as thumbnails/vídeos */}
      <CardMedia item={item} isHovered={isHovered} />

      {/* Badges de álbum, ícone de favorito e check de seleção */}
      <CardOverlays
        item={item}
        isSelected={isSelected}
        isSelectionMode={isSelected}
        onFavorite={onFavorite}
        isFavorite={() => isFavorite}
      />

      {/* Legenda inferior */}
      <div className="absolute inset-x-0 bottom-0 p-3 z-30 bg-linear-to-t from-black/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <p className="text-[10px] text-white font-medium truncate">{item.title || item.id}</p>
      </div>
    </div>
  )
}
