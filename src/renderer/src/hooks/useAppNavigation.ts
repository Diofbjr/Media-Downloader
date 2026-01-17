import { useState, useRef, useCallback } from 'react'
import { MediaItem } from '../types'

export function useAppNavigation() {
  const [isInsideAlbum, setIsInsideAlbum] = useState(false)
  const [viewingItem, setViewingItem] = useState<MediaItem | null>(null)
  const [navigationBackup, setNavigationBackup] = useState<{
    media: MediaItem[]
    page: number
    tags: string
  } | null>(null)

  const isReturningFromAlbum = useRef(false)

  const prepareBackup = useCallback((media: MediaItem[], page: number, tags: string) => {
    setNavigationBackup({ media, page, tags })
  }, [])

  return {
    isInsideAlbum,
    setIsInsideAlbum,
    viewingItem,
    setViewingItem,
    navigationBackup,
    setNavigationBackup,
    isReturningFromAlbum,
    prepareBackup,
  }
}
