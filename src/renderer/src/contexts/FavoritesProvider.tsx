import React, { useState, useEffect } from 'react'
import { MediaItem } from '../types'
import { FavoritesContext } from './FavoritesContext'

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // A sua lógica original de Lazy Initializer
  const [favorites, setFavorites] = useState<MediaItem[]>(() => {
    const saved = localStorage.getItem('@my-downloader/favorites')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch {
        return []
      }
    }
    return []
  })

  // Sincronização automática para o localStorage
  useEffect(() => {
    localStorage.setItem('@my-downloader/favorites', JSON.stringify(favorites))
  }, [favorites])

  const toggleFavorite = (item: MediaItem) => {
    setFavorites((prev) => {
      const exists = prev.find((f) => f.id === item.id)
      if (exists) return prev.filter((f) => f.id !== item.id)
      return [item, ...prev]
    })
  }

  const isFavorite = (id: string) => favorites.some((f) => f.id === id)

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  )
}
