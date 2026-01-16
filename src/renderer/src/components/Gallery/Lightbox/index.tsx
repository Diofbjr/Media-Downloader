import { useEffect, useState, useCallback } from 'react'
import { MediaItem } from '../../../types'
import { LightboxHeader } from './LightboxHeader'
import { LightboxFooter } from './LightboxFooter'
import { LightboxContent } from './LightboxContent'
import { LightboxControls } from './LightboxControls'

interface LightboxProps {
  item: MediaItem
  nextItem?: MediaItem
  onClose: () => void
  onNext: () => void
  onPrev: () => void
  onTagClick: (tag: string) => void
  isFavorite: boolean
  onFavorite: () => void
  downloadPath: string
}

export const Lightbox = ({
  item,
  nextItem,
  onClose,
  onNext,
  onPrev,
  onTagClick,
  isFavorite,
  onFavorite,
  downloadPath,
}: LightboxProps) => {
  // Estado de Volume Persistente
  const [volume, setVolume] = useState(() => Number(localStorage.getItem('lb-volume') ?? 1))
  const [isMuted, setIsMuted] = useState(() => localStorage.getItem('lb-muted') === 'true')
  const [direction, setDirection] = useState<'next' | 'prev' | null>(null)

  const handleVolumeChange = (v: number, m: boolean) => {
    setVolume(v)
    setIsMuted(m)
    localStorage.setItem('lb-volume', v.toString())
    localStorage.setItem('lb-muted', m.toString())
  }

  const navigate = useCallback(
    (way: 'next' | 'prev') => {
      setDirection(way)
      way === 'next' ? onNext() : onPrev()
    },
    [onNext, onPrev],
  )

  useEffect(() => {
    const handleKeys = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') navigate('next')
      if (e.key === 'ArrowLeft') navigate('prev')
    }
    window.addEventListener('keydown', handleKeys)
    return () => window.removeEventListener('keydown', handleKeys)
  }, [navigate, onClose])

  return (
    <div className="fixed inset-0 z-50 bg-black/98 flex flex-col items-center justify-between p-2 backdrop-blur-xl animate-in fade-in duration-300">
      {/* 1. Pre-fetching */}
      {nextItem?.type === 'image' && <link rel="prefetch" href={nextItem.fileUrl} />}

      <LightboxHeader
        item={item}
        isFavorite={isFavorite}
        onFavorite={onFavorite}
        onClose={onClose}
        downloadPath={downloadPath}
      />

      <div className="relative flex-1 w-full flex items-center justify-center overflow-hidden">
        <LightboxControls onPrev={() => navigate('prev')} onNext={() => navigate('next')} />

        {/* 2. Content com Transição de Slide e Zoom */}
        <LightboxContent
          key={item.id} // Key muda para disparar animação de entrada
          item={item}
          volume={volume}
          isMuted={isMuted}
          onVolumeChange={handleVolumeChange}
          direction={direction}
        />
      </div>

      <LightboxFooter item={item} onTagClick={onTagClick} />
    </div>
  )
}
