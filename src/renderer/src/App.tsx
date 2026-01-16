import { useState, useEffect, useCallback, useMemo } from 'react'
import { SiteSelector } from './components/SiteSelector'
import { MediaGrid } from './components/Gallery/MediaGrid'
import { Lightbox } from './components/Gallery/Lightbox'
import { ChangelogModal } from './components/Modals/ChangelogModal'
import { UpdateModal } from './components/Modals/UpdateModal'
import { Pagination } from './components/layout/Pagination'
import { Header } from './components/layout/Header'
import { useMediaSearch } from './hooks/useMediaSearch'
import { useFavorites } from './hooks/useFavorites'
import { EromeProvider } from './services/erome'
import { EHentaiProvider, getEHentaiDirectImageUrl, EHENTAI_CATEGORIES } from './services/ehentai'
import { SiteConfig, MediaItem } from './types'
import { DownloadProgress } from './components/layout/DownloadProgress'

function App(): React.ReactElement {
  const [selectedSite, setSelectedSite] = useState<SiteConfig | null>(null)
  const [isInsideAlbum, setIsInsideAlbum] = useState(false)
  const [showChangelog, setShowChangelog] = useState(false)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [searchTag, setSearchTag] = useState('')
  const [downloadPath, setDownloadPath] = useState<string>('')
  const [viewingItem, setViewingItem] = useState<MediaItem | null>(null)
  const [showFavorites, setShowFavorites] = useState(false)
  const [activeCategories, setActiveCategories] = useState<string[]>(
    Object.keys(EHENTAI_CATEGORIES),
  )

  const { media, setMedia, loading, setLoading, page, search, currentTags, clear } =
    useMediaSearch()
  const { favorites, toggleFavorite, isFavorite } = useFavorites()
  const [downloading, setDownloading] = useState(false)
  const [progress, setProgress] = useState({ current: 0, total: 0 })

  const isSelectionMode = selectedIds.length > 0
  const displayMedia = showFavorites ? favorites : media

  const catsBitmask = useMemo(() => {
    let mask = 0
    Object.entries(EHENTAI_CATEGORIES).forEach(([name, bit]) => {
      if (!activeCategories.includes(name)) mask += bit
    })
    return mask.toString()
  }, [activeCategories])

  const executeSearch = useCallback(
    (tags: string, pageNum: number, useCursor: boolean = false) => {
      if (!selectedSite || showFavorites || isInsideAlbum) return

      const options: { cats: string; nextId?: string } = { cats: catsBitmask }

      if (selectedSite.id === 'ehentai' && useCursor) {
        const nextId = window._ehNextCursor
        if (nextId) {
          options.nextId = nextId
          console.log('🚀 Enviando busca com cursor:', nextId)
        }
      }

      search(selectedSite, tags, pageNum, options)
    },
    [selectedSite, catsBitmask, showFavorites, isInsideAlbum, search],
  )

  useEffect(() => {
    if (selectedSite && !showFavorites && !isInsideAlbum) executeSearch(searchTag, 0)
  }, [selectedSite, catsBitmask, showFavorites, isInsideAlbum, executeSearch, searchTag])

  useEffect(() => {
    setSearchTag('')
    setIsInsideAlbum(false)
    setShowFavorites(false)
    setSelectedIds([])
    setActiveCategories(Object.keys(EHENTAI_CATEGORIES))
  }, [selectedSite])

  const handleDownload = async () => {
    if (!downloadPath || selectedIds.length === 0) return
    setDownloading(true)
    const items = displayMedia.filter((m) => selectedIds.includes(m.id))
    setProgress({ current: 0, total: items.length })

    for (let i = 0; i < items.length; i++) {
      let item = items[i]
      if (item.fileUrl.includes('e-hentai.org/s/')) {
        const direct = await getEHentaiDirectImageUrl(item.fileUrl)
        item = { ...item, fileUrl: direct || item.fileUrl }
      }
      const ext = item.fileUrl.split('.').pop()?.split('?')[0] || 'jpg'
      await window.electron.ipcRenderer.invoke('download:file', {
        url: item.fileUrl,
        destPath: downloadPath,
        fileName: `${item.id.replace(/[^a-z0-9]/gi, '_')}.${ext}`,
      })
      setProgress((p) => ({ ...p, current: i + 1 }))
    }
    setDownloading(false)
    setSelectedIds([])
  }

  const handleViewItem = async (item: MediaItem) => {
    const isAlbum =
      item.fileUrl.includes('erome.com/a/') || item.fileUrl.includes('e-hentai.org/g/')
    if (isAlbum) {
      setLoading(true)
      const content = item.fileUrl.includes('erome')
        ? await EromeProvider.getAlbumContent?.(item.fileUrl)
        : await EHentaiProvider.getAlbumContent?.(item.fileUrl)
      if (content) {
        setMedia(content)
        setIsInsideAlbum(true)
        window.scrollTo(0, 0)
      }
      setLoading(false)
      return
    }
    if (item.fileUrl.includes('e-hentai.org/s/')) {
      setLoading(true)
      const direct = await getEHentaiDirectImageUrl(item.fileUrl)
      setViewingItem({ ...item, fileUrl: direct || item.fileUrl })
      setLoading(false)
    } else setViewingItem(item)
  }

  if (!selectedSite)
    return (
      <>
        <SiteSelector onSelect={setSelectedSite} onOpenChangelog={() => setShowChangelog(true)} />
        {showChangelog && <ChangelogModal onClose={() => setShowChangelog(false)} />}
        <UpdateModal />
      </>
    )

  return (
    <div className="flex flex-col h-screen bg-[#0a0c0f] text-slate-200">
      <Header
        siteName={selectedSite.name}
        isEHentai={selectedSite.id === 'ehentai'}
        isInsideAlbum={isInsideAlbum}
        showFavorites={showFavorites}
        searchTag={searchTag}
        downloadPath={downloadPath}
        selectedCount={selectedIds.length}
        activeCategories={activeCategories}
        isDownloading={downloading}
        canDownload={isSelectionMode && !!downloadPath}
        onBack={() => {
          if (isInsideAlbum) {
            setIsInsideAlbum(false)
            executeSearch(currentTags, page)
          } else {
            setSelectedSite(null)
            clear()
          }
        }}
        onToggleFavorites={() => setShowFavorites(!showFavorites)}
        setSearchTag={setSearchTag}
        onSearch={() => executeSearch(searchTag, 0)}
        onSelectPath={async () => {
          const path = await window.electron.ipcRenderer.invoke('dialog:openDirectory')
          if (path) setDownloadPath(path)
        }}
        onDownload={handleDownload}
        onToggleCategory={(cat) =>
          setActiveCategories((prev) =>
            prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
          )
        }
      />

      <main className="flex-1 overflow-y-auto p-6 custom-scrollbar">
        {loading && !showFavorites && !viewingItem ? (
          <div className="flex h-full items-center justify-center font-black text-blue-500">
            CARREGANDO...
          </div>
        ) : (
          <>
            <MediaGrid
              items={displayMedia}
              selectedIds={selectedIds}
              isSelectionMode={isSelectionMode}
              onToggleItem={(id) =>
                setSelectedIds((p) => (p.includes(id) ? p.filter((i) => i !== id) : [...p, id]))
              }
              onViewItem={handleViewItem}
              onFavorite={toggleFavorite}
              isFavorite={isFavorite}
            />
            <Pagination
              page={page}
              hasMedia={displayMedia.length > 0 && !isInsideAlbum && !showFavorites}
              canPrev={page > 0}
              onNext={() => {
                executeSearch(currentTags, page + 1, true)
                window.scrollTo(0, 0)
              }}
              onPrev={() => executeSearch(currentTags, page - 1)}
            />
          </>
        )}
      </main>

      {downloading && <DownloadProgress current={progress.current} total={progress.total} />}
      {viewingItem && (
        <Lightbox
          item={viewingItem}
          isFavorite={isFavorite(viewingItem.id)}
          onClose={() => setViewingItem(null)}
          onFavorite={() => toggleFavorite(viewingItem)}
          onNext={() => {}}
          onPrev={() => {}}
          onTagClick={(tag) => {
            setIsInsideAlbum(false)
            setSearchTag(tag)
            executeSearch(tag, 0)
            setViewingItem(null)
          }}
          downloadPath={downloadPath}
        />
      )}
    </div>
  )
}

export default App
