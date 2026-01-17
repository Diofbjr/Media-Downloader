/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useCallback } from 'react'
import { SiteSelector } from './components/SiteSelector'
import { MediaGrid } from './components/Gallery/MediaGrid'
import { Lightbox } from './components/Gallery/Lightbox'
import { ChangelogModal } from './components/Modals/ChangelogModal'
import { UpdateModal } from './components/Modals/UpdateModal'
import { Header } from './components/layout/Header'
import { DownloadProgress } from './components/layout/DownloadProgress'
import { Pagination } from './components/layout/Pagination'

import { useMediaSearch } from './hooks/useMediaSearch'
import { useDownloadManager } from './hooks/useDownloadManager'
import { useAppNavigation } from './hooks/useAppNavigation'
import { useDebounce } from './hooks/useDebounce'
import { useFavorites } from './contexts/useFavorites'
import { EHENTAI_CATEGORIES } from './services/ehentai' // Removido getEHentaiDirectImageUrl daqui pois o useDownloadManager já cuida disso
import { EromeProvider } from './services/erome'
import { EHentaiProvider } from './services/ehentai'
import { MediaItem } from './types'

export default function App() {
  // --- ESTADOS DE UI ---
  const [selectedSite, setSelectedSite] = useState<any>(null)
  const [showChangelog, setShowChangelog] = useState(false)
  const [showFavorites, setShowFavorites] = useState(false)
  const [searchTag, setSearchTag] = useState('')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [activeCategories, setActiveCategories] = useState(Object.keys(EHENTAI_CATEGORIES))
  const [downloadPath, setDownloadPath] = useState(localStorage.getItem('app-download-path') || '')

  // --- HOOKS ---
  const { media, setMedia, loading, page, setPage, search, currentTags, clear, canNext } =
    useMediaSearch()
  const { downloading, progress, startDownload } = useDownloadManager()
  const { favorites, toggleFavorite, isFavorite } = useFavorites()
  const nav = useAppNavigation()
  const debouncedSearchTag = useDebounce(searchTag, 500)

  const displayMedia = showFavorites ? favorites : media

  // --- BUSCA AUTOMÁTICA ---
  useEffect(() => {
    if (!selectedSite || showFavorites) return
    if (nav.isReturningFromAlbum.current) {
      nav.isReturningFromAlbum.current = false
      return
    }
    if (!nav.isInsideAlbum) search(selectedSite, debouncedSearchTag, 0)
  }, [debouncedSearchTag, selectedSite, showFavorites, nav.isInsideAlbum])

  // --- HANDLERS ---
  const handleToggleItem = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))
  }

  const handleViewItem = useCallback(
    async (item: MediaItem) => {
      if (selectedIds.length > 0) return handleToggleItem(item.id)

      const isAlbum =
        item.fileUrl.includes('erome.com/a/') || item.fileUrl.includes('e-hentai.org/g/')
      if (isAlbum) {
        nav.prepareBackup(media, page, currentTags)
        const content = item.fileUrl.includes('erome')
          ? await EromeProvider.getAlbumContent?.(item.fileUrl)
          : await EHentaiProvider.getAlbumContent?.(item.fileUrl)
        if (content) {
          setMedia(content)
          nav.setIsInsideAlbum(true)
        }
      } else {
        nav.setViewingItem(item)
      }
    },
    [selectedIds, media, page, currentTags],
  )

  const handleBack = () => {
    if (nav.isInsideAlbum && nav.navigationBackup) {
      nav.isReturningFromAlbum.current = true
      nav.setIsInsideAlbum(false)
      setMedia(nav.navigationBackup.media)
      setPage(nav.navigationBackup.page)
      nav.setNavigationBackup(null)
    } else {
      setSelectedSite(null)
      clear()
    }
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
        isInsideAlbum={nav.isInsideAlbum}
        showFavorites={showFavorites}
        searchTag={searchTag}
        setSearchTag={setSearchTag}
        onBack={handleBack}
        onSearch={() => search(selectedSite, searchTag, 0)}
        onToggleFavorites={() => setShowFavorites(!showFavorites)}
        selectedCount={selectedIds.length}
        downloadPath={downloadPath}
        onDownload={() =>
          startDownload(
            displayMedia.filter((m) => selectedIds.includes(m.id)),
            downloadPath,
          )
        }
        isDownloading={downloading}
        canDownload={selectedIds.length > 0 && !!downloadPath}
        activeCategories={activeCategories}
        onToggleCategory={(cat) =>
          setActiveCategories((prev) =>
            prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
          )
        }
        onSelectPath={async () => {
          const path = await window.electron.ipcRenderer.invoke('dialog:openDirectory')
          if (path) {
            setDownloadPath(path)
            localStorage.setItem('app-download-path', path)
          }
        }}
        isEHentai={selectedSite.id === 'ehentai'}
      />

      <main className="flex-1 overflow-y-auto p-6 custom-scrollbar">
        <MediaGrid
          items={displayMedia}
          selectedIds={selectedIds}
          isSelectionMode={selectedIds.length > 0}
          onToggleItem={handleToggleItem}
          onViewItem={handleViewItem}
          onFavorite={toggleFavorite}
          isFavorite={isFavorite}
        />

        <Pagination
          page={page}
          isVisible={media.length > 0 && !nav.isInsideAlbum && !showFavorites}
          isLoading={loading}
          canNext={canNext}
          onNext={() => search(selectedSite, currentTags, page + 1)}
          onPrev={() => search(selectedSite, currentTags, page - 1)}
        />
      </main>

      {downloading && <DownloadProgress current={progress.current} total={progress.total} />}

      {nav.viewingItem && (
        <Lightbox
          item={nav.viewingItem}
          onClose={() => nav.setViewingItem(null)}
          isFavorite={isFavorite(nav.viewingItem.id)}
          onFavorite={() => toggleFavorite(nav.viewingItem!)}
          onNext={() => {
            const idx = displayMedia.findIndex((m) => m.id === nav.viewingItem!.id)
            if (idx < displayMedia.length - 1) handleViewItem(displayMedia[idx + 1])
          }}
          onPrev={() => {
            const idx = displayMedia.findIndex((m) => m.id === nav.viewingItem!.id)
            if (idx > 0) handleViewItem(displayMedia[idx - 1])
          }}
          onTagClick={(tag) => {
            nav.setIsInsideAlbum(false)
            setSearchTag(tag)
            search(selectedSite, tag, 0)
            nav.setViewingItem(null)
          }}
          downloadPath={downloadPath}
        />
      )}
    </div>
  )
}
