export interface HeaderProps {
  onBack: () => void
  isInsideAlbum: boolean
  showFavorites: boolean
  onToggleFavorites: () => void
  searchTag: string
  setSearchTag: (val: string) => void
  onSearch: () => void
  downloadPath: string
  onSelectPath: () => void
  onDownload: () => void
  canDownload: boolean
  isDownloading: boolean
  selectedCount: number
  siteName: string
  activeCategories: string[]
  onToggleCategory: (cat: string) => void
  isEHentai: boolean
}
