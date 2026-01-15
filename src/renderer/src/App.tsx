import { useState, useEffect } from 'react'
import { SiteSelector } from './components/SiteSelector'
import { MediaGrid } from './components/Gallery/MediaGrid'
import { Lightbox } from './components/Gallery/Lightbox'
import { useMediaSearch } from './hooks/useMediaSearch'
import { useFavorites } from './hooks/useFavorites'
import { EromeProvider } from './services/erome'
import { EHentaiProvider, getEHentaiDirectImageUrl } from './services/ehentai'
import { SiteConfig, MediaItem } from './types'
import { UpdateNotifier } from './components/UpdateNotifier' // Importando o novo componente

function App(): React.ReactElement {
  const [selectedSite, setSelectedSite] = useState<SiteConfig | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [searchTag, setSearchTag] = useState('')
  const [downloadPath, setDownloadPath] = useState<string>('')
  const [viewingItem, setViewingItem] = useState<MediaItem | null>(null)
  const [showFavorites, setShowFavorites] = useState(false)

  const { media, setMedia, loading, setLoading, page, search, currentTags, clear } =
    useMediaSearch()
  const { favorites, toggleFavorite, isFavorite } = useFavorites()
  const [downloading, setDownloading] = useState(false)
  const [progress, setProgress] = useState({ current: 0, total: 0 })

  const isSelectionMode = selectedIds.length > 0
  const displayMedia = showFavorites ? favorites : media

  useEffect(() => {
    const triggerSearch = async () => {
      if (selectedSite && !showFavorites) {
        await search?.(selectedSite, searchTag, 0)
      }
    }
    triggerSearch()
  }, [selectedSite, showFavorites, search])

  const resolveMediaItem = async (item: MediaItem): Promise<MediaItem> => {
    if (item.fileUrl.includes('e-hentai.org/s/')) {
      const directUrl = await getEHentaiDirectImageUrl(item.fileUrl)
      return { ...item, fileUrl: directUrl || item.fileUrl }
    }
    return item
  }

  const handleViewItem = async (item: MediaItem) => {
    const isEromeAlbum = item.fileUrl.includes('erome.com/a/')
    const isEHentaiAlbum = item.fileUrl.includes('e-hentai.org/g/')

    if (isEromeAlbum || isEHentaiAlbum) {
      setLoading(true)
      try {
        let albumContent: MediaItem[] = []
        if (isEromeAlbum) {
          albumContent = (await EromeProvider.getAlbumContent?.(item.fileUrl)) || []
        } else if (isEHentaiAlbum) {
          albumContent = (await EHentaiProvider.getAlbumContent?.(item.fileUrl)) || []
        }

        if (albumContent && albumContent.length > 0) {
          setMedia(albumContent)
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }
      } catch (error) {
        console.error('Erro ao abrir álbum:', error)
      } finally {
        setLoading(false)
      }
      return
    }

    if (item.fileUrl.includes('e-hentai.org/s/')) {
      setLoading(true)
      try {
        const resolved = await resolveMediaItem(item)
        setViewingItem(resolved)
      } catch (error) {
        console.error('Erro ao carregar imagem:', error)
      } finally {
        setLoading(false)
      }
    } else {
      setViewingItem(item)
    }
  }

  const handleNavigateLightbox = async (direction: 'next' | 'prev') => {
    if (!viewingItem) return
    const currentIndex = displayMedia.findIndex((m) => m.id === viewingItem.id)
    let newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1

    if (newIndex < 0) newIndex = displayMedia.length - 1
    if (newIndex >= displayMedia.length) newIndex = 0

    const nextItem = displayMedia[newIndex]

    if (nextItem.fileUrl.includes('e-hentai.org/s/')) {
      setLoading(true)
      const resolved = await resolveMediaItem(nextItem)
      setViewingItem(resolved)
      setLoading(false)
    } else {
      setViewingItem(nextItem)
    }
  }

  const handleDownload = async () => {
    if (!downloadPath || selectedIds.length === 0) return
    setDownloading(true)
    setProgress({ current: 0, total: selectedIds.length })

    const itemsToDownload = displayMedia.filter((m) => selectedIds.includes(m.id))

    for (let i = 0; i < itemsToDownload.length; i++) {
      let item = itemsToDownload[i]
      if (item.fileUrl.includes('e-hentai.org/s/')) {
        item = await resolveMediaItem(item)
      }

      const ext =
        item.fileUrl.split('.').pop()?.split('?')[0] || (item.type === 'video' ? 'mp4' : 'jpg')

      try {
        await window.electron.ipcRenderer.invoke('download:file', {
          url: item.fileUrl,
          destPath: downloadPath,
          fileName: `${item.id.replace(/[^a-z0-9]/gi, '_')}.${ext}`,
        })
      } catch (err) {
        console.error('Erro no download:', err)
      }
      setProgress((prev) => ({ ...prev, current: i + 1 }))
    }
    setDownloading(false)
    setSelectedIds([])
  }

  if (!selectedSite) return <SiteSelector onSelect={setSelectedSite} />

  return (
    <div className="flex flex-col h-screen bg-[#0a0c0f] text-slate-200">
      <UpdateNotifier /> {/* Notificador de atualização posicionado acima da UI */}
      <nav className="z-40 glass-nav flex items-center justify-between px-8 py-4 border-b border-white/5 shadow-2xl shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              setSelectedSite(null)
              clear()
            }}
            className="p-2 hover:bg-white/5 rounded-xl text-gray-400 font-bold transition-colors"
          >
            ←
          </button>
          <button
            onClick={() => setShowFavorites(!showFavorites)}
            className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all ${
              showFavorites ? 'bg-pink-600 text-white' : 'bg-white/5 text-gray-400'
            }`}
          >
            {showFavorites ? '❤️ FAVORITOS' : '♡ FAVORITOS'}
          </button>
        </div>

        {!showFavorites && (
          <div className="flex-1 max-w-xl px-8 flex gap-2">
            <input
              type="text"
              className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/50"
              placeholder={`Pesquisar em ${selectedSite.name}...`}
              value={searchTag}
              onChange={(e) => setSearchTag(e.target.value)}
              onKeyDown={(e) =>
                e.key === 'Enter' && selectedSite && search?.(selectedSite, searchTag, 0)
              }
            />
            <button
              onClick={() => selectedSite && search?.(selectedSite, searchTag, 0)}
              className="bg-blue-600 px-6 rounded-xl text-[10px] font-black hover:bg-blue-500 transition-colors"
            >
              BUSCAR
            </button>
          </div>
        )}

        <div className="flex items-center gap-3">
          <button
            onClick={async () => {
              const path = await window.electron.ipcRenderer.invoke('dialog:openDirectory')
              if (path) setDownloadPath(path)
            }}
            className={`text-[10px] px-4 py-2 border rounded-xl font-bold transition-all ${
              downloadPath ? 'border-green-500 text-green-500' : 'border-white/10 text-gray-400'
            }`}
          >
            {downloadPath ? 'PASTA OK' : 'PASTA'}
          </button>

          <button
            onClick={handleDownload}
            disabled={!isSelectionMode || !downloadPath || downloading}
            className="bg-green-600 disabled:bg-gray-800 px-6 py-2 rounded-xl text-[10px] font-black"
          >
            {downloading ? 'BAIXANDO...' : `BAIXAR (${selectedIds.length})`}
          </button>
        </div>
      </nav>
      <main className="flex-1 overflow-y-auto p-6 scroll-smooth custom-scrollbar">
        {loading && !showFavorites && !viewingItem ? (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[10px] font-black text-blue-500 animate-pulse uppercase">
              Carregando...
            </p>
          </div>
        ) : (
          <>
            <MediaGrid
              items={displayMedia}
              selectedIds={selectedIds}
              isSelectionMode={isSelectionMode}
              onToggleItem={(id) => {
                setSelectedIds((prev) =>
                  prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
                )
              }}
              onViewItem={handleViewItem}
              onFavorite={toggleFavorite}
              isFavorite={isFavorite}
            />

            {!showFavorites && displayMedia.length > 0 && (
              <div className="flex items-center justify-center gap-8 py-16">
                <button
                  disabled={page === 0}
                  onClick={() => selectedSite && search?.(selectedSite, currentTags, page - 1)}
                  className="px-10 py-3 bg-white/5 border border-white/5 rounded-2xl disabled:opacity-5 font-black text-[10px]"
                >
                  ❮ ANTERIOR
                </button>
                <div className="text-center">
                  <p className="text-xl font-mono leading-none">{page + 1}</p>
                </div>
                <button
                  onClick={() => selectedSite && search?.(selectedSite, currentTags, page + 1)}
                  className="px-10 py-3 bg-white/5 border border-white/5 rounded-2xl font-black text-[10px]"
                >
                  PRÓXIMA ❯
                </button>
              </div>
            )}
          </>
        )}
      </main>
      {downloading && (
        <div className="fixed bottom-6 right-6 bg-[#16191d] border border-blue-500/30 p-4 rounded-xl shadow-2xl z-50 min-w-50">
          <div className="flex justify-between text-[10px] mb-2 font-bold text-blue-400">
            <span>BAIXANDO...</span>
            <span>
              {progress.current} / {progress.total}
            </span>
          </div>
          <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-blue-500 h-full transition-all duration-300"
              style={{ width: `${(progress.current / progress.total) * 100}%` }}
            />
          </div>
        </div>
      )}
      {viewingItem && (
        <Lightbox
          item={viewingItem}
          onClose={() => setViewingItem(null)}
          onNext={() => handleNavigateLightbox('next')}
          onPrev={() => handleNavigateLightbox('prev')}
          onTagClick={(tag) => {
            if (selectedSite) {
              setSearchTag(tag)
              search?.(selectedSite, tag, 0)
              setViewingItem(null)
            }
          }}
          isFavorite={isFavorite(viewingItem.id)}
          onFavorite={() => toggleFavorite(viewingItem)}
          downloadPath={downloadPath}
        />
      )}
    </div>
  )
}

export default App
