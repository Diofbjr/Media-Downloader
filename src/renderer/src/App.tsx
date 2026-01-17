/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useCallback, useMemo } from 'react'
import { SiteSelector } from './components/SiteSelector'
import { MediaGrid } from './components/Gallery/MediaGrid'
import { Lightbox } from './components/Gallery/Lightbox'
import { ChangelogModal } from './components/Modals/ChangelogModal'
import { UpdateModal } from './components/Modals/UpdateModal'
import { Header } from './components/layout/Header'
import { DownloadProgress } from './components/layout/DownloadProgress'
import { Pagination } from './components/layout/Pagination'

// Hooks e Contextos
import { useMediaSearch } from './hooks/useMediaSearch'
import { useDebounce } from './hooks/useDebounce'

// Services e Types
import { EromeProvider } from './services/erome'
import { EHentaiProvider, getEHentaiDirectImageUrl, EHENTAI_CATEGORIES } from './services/ehentai'
import { MediaItem } from './types'
import { SiteConfig } from './config/sites'
import { useFavorites } from './contexts/useFavorites'

function App(): React.ReactElement {
  // --- ESTADOS DE NAVEGAÇÃO ---
  const [selectedSite, setSelectedSite] = useState<SiteConfig | null>(null)
  const [isInsideAlbum, setIsInsideAlbum] = useState(false)
  const [showChangelog, setShowChangelog] = useState(false)
  const [viewingItem, setViewingItem] = useState<MediaItem | null>(null)
  const [showFavorites, setShowFavorites] = useState(false)

  // --- ESTADOS DE BUSCA E SELEÇÃO ---
  const [searchTag, setSearchTag] = useState('')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [activeCategories, setActiveCategories] = useState<string[]>(
    Object.keys(EHENTAI_CATEGORIES),
  )

  // --- ESTADOS DE DOWNLOAD ---
  const [downloadPath, setDownloadPath] = useState<string>(() => {
    return localStorage.getItem('app-download-path') || ''
  })
  const [downloading, setDownloading] = useState(false)
  const [progress, setProgress] = useState({ current: 0, total: 0 })

  // --- HOOKS ---
  const { media, setMedia, loading, setLoading, page, search, currentTags, clear, canNext } =
    useMediaSearch()

  // Hook de Contexto Global de Favoritos
  const { favorites, toggleFavorite, isFavorite } = useFavorites()

  // Hook de Debounce: Atrasamos a tag em 500ms para evitar spam na API
  const debouncedSearchTag = useDebounce(searchTag, 500)

  // --- LÓGICA DE EXIBIÇÃO ---
  const isSelectionMode = selectedIds.length > 0

  const displayMedia = useMemo(
    () => (showFavorites ? favorites : media),
    [showFavorites, favorites, media],
  )

  const catsBitmask = useMemo(() => {
    let mask = 0
    Object.entries(EHENTAI_CATEGORIES).forEach(([name, bit]) => {
      if (!activeCategories.includes(name)) mask += bit
    })
    return mask.toString()
  }, [activeCategories])

  // --- FUNÇÕES DE BUSCA ---
  const executeSearch = useCallback(
    (tags: string, pageNum: number, useCursor: boolean = false) => {
      // Bloqueia busca se estiver vendo favoritos ou dentro de um álbum
      if (!selectedSite || showFavorites || isInsideAlbum) return

      const options: { cats: string; nextId?: string } = { cats: catsBitmask }

      if (selectedSite.id === 'ehentai' && useCursor) {
        const nextId = (window as any)._ehNextCursor
        if (nextId) options.nextId = nextId
      }
      search(selectedSite, tags, pageNum, options)
    },
    [selectedSite, catsBitmask, showFavorites, isInsideAlbum, search],
  )

  // Efeito principal de busca: Agora observa 'debouncedSearchTag'
  useEffect(() => {
    if (selectedSite && !showFavorites && !isInsideAlbum) {
      executeSearch(debouncedSearchTag, 0)
    }
  }, [debouncedSearchTag, selectedSite, catsBitmask, showFavorites, isInsideAlbum, executeSearch])

  // Reset de estados ao trocar de site
  useEffect(() => {
    setSearchTag('')
    setIsInsideAlbum(false)
    setShowFavorites(false)
    setSelectedIds([])
    setActiveCategories(Object.keys(EHENTAI_CATEGORIES))
  }, [selectedSite])

  // --- HANDLERS DE SELEÇÃO E VISUALIZAÇÃO ---
  const handleToggleItem = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))
  }

  const handleViewItem = useCallback(
    async (item: MediaItem) => {
      // 1. CORREÇÃO CRUCIAL: Se já existe algo selecionado,
      // QUALQUER clique (curto ou longo) deve apenas alternar a seleção.
      if (selectedIds.length > 0) {
        handleToggleItem(item.id)
        return
      }

      // Se chegou aqui, é um clique simples para abrir a mídia
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
          document.querySelector('main')?.scrollTo(0, 0)
        }
        setLoading(false)
        return
      }

      if (item.fileUrl.includes('e-hentai.org/s/')) {
        setLoading(true)
        const direct = await getEHentaiDirectImageUrl(item.fileUrl)
        setViewingItem({ ...item, fileUrl: direct || item.fileUrl })
        setLoading(false)
      } else {
        setViewingItem(item)
      }
    },
    [selectedIds, setLoading, setMedia, handleToggleItem], // Adicionado selectedIds e handleToggleItem aqui
  )

  // --- LÓGICA DE DOWNLOAD ---
  const handleDownload = async () => {
    if (!downloadPath || selectedIds.length === 0) return
    setDownloading(true)

    // 1. Identificar quais itens selecionados são álbuns e quais são mídias diretas
    const selectedItems = displayMedia.filter((m) => selectedIds.includes(m.id))
    const finalDownloadQueue: MediaItem[] = []

    for (const item of selectedItems) {
      const isAlbum =
        item.fileUrl.includes('erome.com/a/') || item.fileUrl.includes('e-hentai.org/g/')

      if (isAlbum) {
        // Se for álbum, buscamos o conteúdo interno antes de baixar
        const content = item.fileUrl.includes('erome')
          ? await EromeProvider.getAlbumContent?.(item.fileUrl)
          : await EHentaiProvider.getAlbumContent?.(item.fileUrl)

        if (content) {
          finalDownloadQueue.push(...content)
        }
      } else {
        // Se for mídia direta, vai direto para a fila
        finalDownloadQueue.push(item)
      }
    }

    // 2. Executar o download da fila final acumulada
    setProgress({ current: 0, total: finalDownloadQueue.length })

    for (let i = 0; i < finalDownloadQueue.length; i++) {
      let item = finalDownloadQueue[i]

      // Resolução de links do E-Hentai se necessário
      if (item.fileUrl.includes('e-hentai.org/s/')) {
        const direct = await getEHentaiDirectImageUrl(item.fileUrl)
        item = { ...item, fileUrl: direct || item.fileUrl }
      }

      const ext = item.fileUrl.split('.').pop()?.split('?')[0] || 'jpg'

      await window.electron.ipcRenderer.invoke('download:file', {
        url: item.fileUrl,
        destPath: downloadPath,
        // Dica: Para álbuns, talvez você queira criar uma subpasta aqui futuramente
        fileName: `${item.id.replace(/[^a-z0-9]/gi, '_')}.${ext}`,
      })

      setProgress((p) => ({ ...p, current: i + 1 }))
    }

    setDownloading(false)
    setSelectedIds([])
  }

  // --- RENDERIZAÇÃO LOBBY ---
  if (!selectedSite) {
    return (
      <>
        <SiteSelector onSelect={setSelectedSite} onOpenChangelog={() => setShowChangelog(true)} />
        {showChangelog && <ChangelogModal onClose={() => setShowChangelog(false)} />}
        <UpdateModal />
      </>
    )
  }

  // --- RENDERIZAÇÃO GALERIA ---
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
          // Chama o Electron para abrir o seletor de pastas
          const path = await window.electron.ipcRenderer.invoke('dialog:openDirectory')
          if (path) {
            setDownloadPath(path)
            // SALVA O CAMINHO: Garante que ao reabrir o app a pasta esteja lá
            localStorage.setItem('app-download-path', path)
          }
        }}
        onDownload={handleDownload}
        onToggleCategory={(cat) =>
          setActiveCategories((prev) =>
            prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
          )
        }
      />

      <main className="flex-1 overflow-y-auto p-6 custom-scrollbar">
        <MediaGrid
          items={displayMedia}
          selectedIds={selectedIds}
          isSelectionMode={isSelectionMode}
          onToggleItem={handleToggleItem}
          onViewItem={handleViewItem}
          onFavorite={toggleFavorite}
          isFavorite={isFavorite}
        />

        <Pagination
          page={page}
          isVisible={displayMedia.length > 0 && !isInsideAlbum && !showFavorites}
          isLoading={loading}
          canNext={canNext}
          onNext={() => {
            executeSearch(currentTags, page + 1, true)
            document.querySelector('main')?.scrollTo(0, 0)
          }}
          onPrev={() => executeSearch(currentTags, page - 1)}
        />
      </main>

      {downloading && <DownloadProgress current={progress.current} total={progress.total} />}

      {viewingItem && (
        <Lightbox
          item={viewingItem}
          isFavorite={isFavorite(viewingItem.id)}
          onClose={() => setViewingItem(null)}
          onFavorite={() => toggleFavorite(viewingItem)}
          onNext={() => {
            const idx = displayMedia.findIndex((m) => m.id === viewingItem.id)
            if (idx < displayMedia.length - 1) handleViewItem(displayMedia[idx + 1])
          }}
          onPrev={() => {
            const idx = displayMedia.findIndex((m) => m.id === viewingItem.id)
            if (idx > 0) handleViewItem(displayMedia[idx - 1])
          }}
          onTagClick={(tag) => {
            setIsInsideAlbum(false)
            setSearchTag(tag)
            // A busca aqui é imediata ao clicar em uma tag da lightbox
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
