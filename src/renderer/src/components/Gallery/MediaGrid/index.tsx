import { MediaItem } from '../../../types'
import { MediaCard } from '../MediaCard'

interface MediaGridProps {
  items: MediaItem[]
  selectedIds: string[]
  isSelectionMode: boolean // Mantemos na interface pois o App.tsx envia
  onToggleItem: (id: string) => void
  onViewItem: (item: MediaItem) => void
  onFavorite: (item: MediaItem) => void
  isFavorite: (id: string) => boolean
}

export const MediaGrid = ({
  items,
  selectedIds,
  isSelectionMode, // Agora vamos usá-lo para decidir o comportamento do clique
  onToggleItem,
  onViewItem,
  onFavorite,
  isFavorite,
}: MediaGridProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
      {items.map((item) => (
        <MediaCard
          key={item.id}
          item={item}
          isSelected={selectedIds.includes(item.id)}
          isFavorite={isFavorite(item.id)}
          // Se estivermos em modo de seleção, o clique normal também seleciona
          onClick={() => {
            if (isSelectionMode) {
              onToggleItem(item.id)
            } else {
              onViewItem(item)
            }
          }}
          // Corrigido: Nome da prop deve ser onToggleItem para bater com o MediaCard
          onToggleItem={onToggleItem}
          onFavorite={onFavorite}
        />
      ))}
    </div>
  )
}
