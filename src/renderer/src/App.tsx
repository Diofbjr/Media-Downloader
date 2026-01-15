import { useState, useEffect, useCallback } from 'react'
import { SiteSelector } from './components/SiteSelector'
import { MediaGrid } from './components/Gallery/MediaGrid'
import { Lightbox } from './components/Gallery/Lightbox'
import { ChangelogModal } from './components/Modals/ChangelogModal'
import { UpdateModal } from './components/Modals/UpdateModal' // Novo Import
import { useMediaSearch } from './hooks/useMediaSearch'
import { useFavorites } from './hooks/useFavorites'
import { EromeProvider } from './services/erome'
import { EHentaiProvider, getEHentaiDirectImageUrl } from './services/ehentai'
import { SiteConfig, MediaItem } from './types'
import { DownloadProgress } from './components/layout/DownloadProgress'

function App(): React.ReactElement {
  // Estados de Navegação
  const [selectedSite, setSelectedSite] = useState<SiteConfig | null>(null)
  const [isInsideAlbum, setIsInsideAlbum] = useState(false)
  const [showChangelog, setShowChangelog] = useState(false)

  // Estados de Dados e UI
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [searchTag, setSearchTag] = useState('')
  const [downloadPath, setDownloadPath] = useState<string>('')
  const [viewingItem, setViewingItem] = useState<MediaItem | null>(null)
  const [showFavorites, setShowFavorites] = useState(false)

  const { media, setMedia, loading, setLoading, page, search, currentTags, clear } =
    useMediaSearch()
  const { favorites, toggleFavorite, isFavorite } = useFavorites()

  // Estados de Download
  const [downloading, setDownloading] = useState(false)
  const [progress, setProgress] = useState({ current: 0, total: 0 })

  const isSelectionMode = selectedIds.length > 0
  const displayMedia = showFavorites ? favorites : media

  // Hook para carregar dados iniciais ao selecionar um site
  useEffect(() => {
    if (selectedSite && !showFavorites && media.length === 0) {
      search?.(selectedSite, '', 0)
    }
  }, [selectedSite, showFavorites, media.length, search])

  // Resolve URLs de imagens (ex: e-hentai)
  const resolveMediaItem = useCallback(async (item: MediaItem): Promise<MediaItem> => {
    if (item.fileUrl.includes('e-hentai.org/s/')) {
      const directUrl = await getEHentaiDirectImageUrl(item.fileUrl)
      return { ...item, fileUrl: directUrl || item.fileUrl }
    }
    return item
  }, [])

  // Navegação do Lightbox
  const handleNavigateLightbox = async (direction: 'next' | 'prev') => {
    if (!viewingItem) return
    const currentIndex = displayMedia.findIndex((m) => m.id === viewingItem.id)
    if (currentIndex === -1) return

    let nextIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1
    if (nextIndex < 0) nextIndex = displayMedia.length - 1
    if (nextIndex >= displayMedia.length) nextIndex = 0

    const nextItem = displayMedia[nextIndex]
    if (nextItem.fileUrl.includes('e-hentai.org/s/')) {
      setLoading(true)
      const resolved = await resolveMediaItem(nextItem)
      setViewingItem(resolved)
      setLoading(false)
    } else {
      setViewingItem(nextItem)
    }
  }

  // Visualizar item ou entrar em álbum
  const handleViewItem = async (item: MediaItem) => {
    const isEromeAlbum = item.fileUrl.includes('erome.com/a/')
    const isEHentaiAlbum = item.fileUrl.includes('e-hentai.org/g/')

    if (isEromeAlbum || isEHentaiAlbum) {
      setLoading(true)
      try {
        let albumContent: MediaItem[] = []
        if (isEromeAlbum) albumContent = (await EromeProvider.getAlbumContent?.(item.fileUrl)) || []
        else if (isEHentaiAlbum)
          albumContent = (await EHentaiProvider.getAlbumContent?.(item.fileUrl)) || []

        if (albumContent.length > 0) {
          setMedia(albumContent)
          setIsInsideAlbum(true)
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
      return
    }

    if (item.fileUrl.includes('e-hentai.org/s/')) {
      setLoading(true)
      const resolved = await resolveMediaItem(item)
      setViewingItem(resolved)
      setLoading(false)
    } else {
      setViewingItem(item)
    }
  }

  // Lógica de Download
  const handleDownload = async () => {
    if (!downloadPath || selectedIds.length === 0) return
    setDownloading(true)
    setProgress({ current: 0, total: selectedIds.length })

    const itemsToDownload = displayMedia.filter((m) => selectedIds.includes(m.id))
    for (let i = 0; i < itemsToDownload.length; i++) {
      let item = itemsToDownload[i]
      if (item.fileUrl.includes('e-hentai.org/s/')) item = await resolveMediaItem(item)
      const ext =
        item.fileUrl.split('.').pop()?.split('?')[0] || (item.type === 'video' ? 'mp4' : 'jpg')
      try {
        await window.electron.ipcRenderer.invoke('download:file', {
          url: item.fileUrl,
          destPath: downloadPath,
          fileName: `${item.id.replace(/[^a-z0-9]/gi, '_')}.${ext}`,
        })
      } catch (err) {
        console.error(err)
      }
      setProgress((prev) => ({ ...prev, current: i + 1 }))
    }
    setDownloading(false)
    setSelectedIds([])
  }

  // TELA INICIAL (Site Selector)
  if (!selectedSite) {
    return (
      <>
        <SiteSelector onSelect={setSelectedSite} onOpenChangelog={() => setShowChangelog(true)} />
        {showChangelog && <ChangelogModal onClose={() => setShowChangelog(false)} />}
        <UpdateModal /> {/* Monitoramento de update na Home */}
      </>
    )
  }

  // TELA DE GALERIA
  return (
    <div className="flex flex-col h-screen bg-[#0a0c0f] text-slate-200">
      <nav className="z-40 bg-[#0d1014] border-b border-white/5 px-6 py-4 flex items-center gap-4 shrink-0">
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              if (isInsideAlbum) {
                setIsInsideAlbum(false)
                search?.(selectedSite, currentTags, page)
              } else {
                setSelectedSite(null)
                clear()
              }
            }}
            className="h-10 px-3 bg-white/5 hover:bg-white/10 rounded-xl text-blue-500 font-bold text-[10px] border border-white/5"
          >
            {isInsideAlbum ? '← VOLTAR' : '← SAIR'}
          </button>

          <button
            onClick={() => setShowFavorites(!showFavorites)}
            className={`h-10 px-4 rounded-xl text-[10px] font-black transition-all border border-white/5 ${
              showFavorites ? 'bg-pink-600 text-white' : 'bg-white/5 text-gray-400'
            }`}
          >
            {showFavorites ? '❤️ FAVORITOS' : '♡ FAVORITOS'}
          </button>

          <button
            onClick={() => setShowChangelog(true)}
            className="h-10 w-10 flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-lg"
          >
            🚀
          </button>
        </div>

        {!showFavorites && (
          <div className="flex-1 max-w-2xl flex gap-2">
            <input
              type="text"
              className="flex-1 bg-black/40 border border-white/10 rounded-xl px-5 h-10 text-sm outline-none focus:ring-2 focus:ring-blue-500/50"
              placeholder={`Pesquisar em ${selectedSite.name}...`}
              value={searchTag}
              onChange={(e) => setSearchTag(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && search?.(selectedSite, searchTag, 0)}
            />
          </div>
        )}

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={async () => {
              const path = await window.electron.ipcRenderer.invoke('dialog:openDirectory')
              if (path) setDownloadPath(path)
            }}
            className={`h-10 px-4 border rounded-xl font-bold text-[10px] ${
              downloadPath
                ? 'border-green-500/50 text-green-500 bg-green-500/5'
                : 'border-white/10 text-gray-400'
            }`}
          >
            {downloadPath ? 'PASTA OK' : 'PASTA'}
          </button>
          <button
            onClick={handleDownload}
            disabled={!isSelectionMode || !downloadPath || downloading}
            className="h-10 px-6 bg-green-600 disabled:bg-gray-800 rounded-xl text-[10px] font-black text-white"
          >
            {downloading ? 'BAIXANDO...' : `BAIXAR (${selectedIds.length})`}
          </button>
        </div>
      </nav>
      <main className="flex-1 overflow-y-auto p-6 custom-scrollbar scroll-smooth">
        {loading && !showFavorites && !viewingItem ? (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[10px] font-black text-blue-500 animate-pulse tracking-widest">
              CARREGANDO
            </p>
          </div>
        ) : (
          <>
            <MediaGrid
              items={displayMedia}
              selectedIds={selectedIds}
              isSelectionMode={isSelectionMode}
              onToggleItem={(id) =>
                setSelectedIds((prev) =>
                  prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
                )
              }
              onViewItem={handleViewItem}
              onFavorite={toggleFavorite}
              isFavorite={isFavorite}
            />
            {!showFavorites && !isInsideAlbum && displayMedia.length > 0 && (
              <div className="flex items-center justify-center gap-8 py-16">
                <button
                  disabled={page === 0}
                  onClick={() => {
                    search?.(selectedSite, currentTags, page - 1)
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                  className="px-8 py-3 bg-white/5 border border-white/5 rounded-2xl disabled:opacity-10 font-black text-[10px] hover:bg-white/10"
                >
                  ❮ ANTERIOR
                </button>
                <div className="text-center min-w-20">
                  <p className="text-[10px] text-blue-500 font-black mb-1 uppercase">Página</p>
                  <p className="text-xl font-mono leading-none">{page + 1}</p>
                </div>
                <button
                  onClick={() => {
                    search?.(selectedSite, currentTags, page + 1)
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                  className="px-8 py-3 bg-white/5 border border-white/5 rounded-2xl font-black text-[10px] hover:bg-white/10"
                >
                  PRÓXIMA ❯
                </button>
              </div>
            )}
          </>
        )}
      </main>
      {/* MODAIS E OVERLAYS */}
      {showChangelog && <ChangelogModal onClose={() => setShowChangelog(false)} />}
      {downloading && <DownloadProgress current={progress.current} total={progress.total} />}
      <UpdateModal /> {/* Monitoramento de update na Galeria */}
      {viewingItem && (
        <Lightbox
          item={viewingItem}
          onClose={() => setViewingItem(null)}
          onNext={() => handleNavigateLightbox('next')}
          onPrev={() => handleNavigateLightbox('prev')}
          onTagClick={(tag) => {
            setIsInsideAlbum(false)
            setSearchTag(tag)
            search?.(selectedSite, tag, 0)
            setViewingItem(null)
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
