import { useState, useEffect } from 'react'
import { MediaItem } from '../types'

export function useFavorites() {
  // Inicializamos o estado diretamente com uma função (Lazy Initializer)
  // Isso evita o erro de "cascading renders" e melhora a performance
  const [favorites, setFavorites] = useState<MediaItem[]>(() => {
    const saved = localStorage.getItem('@my-downloader/favorites')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        console.error('Erro ao parsear favoritos do localStorage', e)
        return []
      }
    }
    return []
  })

  // Mantemos apenas UM efeito: o de sincronizar para fora (persistência)
  useEffect(() => {
    localStorage.setItem('@my-downloader/favorites', JSON.stringify(favorites))
  }, [favorites])

  const toggleFavorite = (item: MediaItem) => {
    setFavorites((prev) => {
      const exists = prev.find((f) => f.id === item.id)
      if (exists) {
        return prev.filter((f) => f.id !== item.id)
      }
      return [item, ...prev]
    })
  }

  const isFavorite = (id: string) => favorites.some((f) => f.id === id)

  return { favorites, toggleFavorite, isFavorite }
}
