import { SiteConfig } from '@renderer/config/sites'

export interface NavbarProps {
  selectedSite: SiteConfig
  searchTag: string
  setSearchTag: (val: string) => void
  onSearch: () => void
  onBack: () => void
  showFavorites: boolean
  setShowFavorites: (val: boolean) => void
  selectedCount: number
  downloadPath: string
  onSelectFolder: () => void
  onDownloadSelected: () => void
  isDownloading: boolean
  isAllSelected: boolean
  onToggleAll: () => void
}
