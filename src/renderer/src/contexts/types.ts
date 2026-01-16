import { MediaItem } from '../types'

export interface FavoritesContextData {
  favorites: MediaItem[]
  toggleFavorite: (item: MediaItem) => void
  isFavorite: (id: string) => boolean
}
