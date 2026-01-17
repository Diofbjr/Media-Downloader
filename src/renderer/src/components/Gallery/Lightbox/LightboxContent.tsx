import { useState, useRef, MouseEvent } from 'react'
import { MediaItem } from '../../../types'

// --- EXTENSÃO DE TIPOS (RESOLUÇÃO DE CONFLITO LINT/TS) ---
declare module 'react' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface VideoHTMLAttributes<T> {
    referrerPolicy?: React.HTMLAttributeReferrerPolicy
  }
}

interface Props {
  item: MediaItem
  volume: number
  isMuted: boolean
  onVolumeChange: (v: number, m: boolean) => void
  direction: 'next' | 'prev' | null
}

export const LightboxContent = ({ item, volume, isMuted, onVolumeChange, direction }: Props) => {
  const [isMediaLoading, setIsMediaLoading] = useState(true)
  const [isZoomed, setIsZoomed] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 })
  const containerRef = useRef<HTMLDivElement>(null)

  const slideClass = direction === 'next' ? 'slide-in-from-right' : 'slide-in-from-left'

  const handleMouseMove = (e: MouseEvent) => {
    if (!isZoomed || !containerRef.current) return
    const { left, top, width, height } = containerRef.current.getBoundingClientRect()
    const x = ((e.clientX - left) / width) * 100
    const y = ((e.clientY - top) / height) * 100
    setMousePos({ x, y })
  }

  const toggleZoom = (e: MouseEvent) => {
    e.stopPropagation()
    setIsZoomed(!isZoomed)
    if (isZoomed) setMousePos({ x: 50, y: 50 })
  }

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full flex items-center justify-center p-4 animate-in duration-300 ${slideClass} overflow-hidden`}
      onMouseMove={handleMouseMove}
    >
      {isMediaLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-40">
          <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
        </div>
      )}

      {item.type === 'video' ? (
        <video
          src={item.fileUrl}
          controls
          autoPlay
          referrerPolicy="no-referrer"
          className={`max-w-full max-h-full rounded-lg shadow-2xl transition-opacity ${isMediaLoading ? 'opacity-0' : 'opacity-100'}`}
          onLoadedData={(e) => {
            const v = e.currentTarget
            v.volume = volume
            v.muted = isMuted
            setIsMediaLoading(false)
          }}
          onVolumeChange={(e) => onVolumeChange(e.currentTarget.volume, e.currentTarget.muted)}
        />
      ) : (
        <div
          className={`relative w-full h-full flex items-center justify-center transition-transform duration-75 ${
            isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'
          }`}
          onClick={toggleZoom}
        >
          <img
            src={item.fileUrl}
            referrerPolicy="no-referrer"
            onLoad={() => setIsMediaLoading(false)}
            style={{
              transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
              transform: isZoomed ? 'scale(2.5)' : 'scale(1)',
            }}
            className={`max-w-full max-h-full object-contain shadow-2xl rounded-lg transition-all duration-300 ease-out ${
              isMediaLoading ? 'opacity-0' : 'opacity-100'
            }`}
            alt=""
          />
        </div>
      )}
    </div>
  )
}
