import { NavbarProps } from './types'
import { NavNavigation } from './NavNavigation'
import { NavSearch } from './NavSearch'
import { NavActions } from './NavActions'

export const Navbar = (p: NavbarProps) => {
  return (
    <nav className="z-40 bg-[#0a0c0f]/80 backdrop-blur-xl flex items-center justify-between px-8 py-4 border-b border-white/5 shadow-2xl shrink-0">
      {/* Esquerda: Navegação básica */}
      <NavNavigation
        onBack={p.onBack}
        showFavorites={p.showFavorites}
        setShowFavorites={p.setShowFavorites}
      />

      {/* Centro: Busca */}
      {!p.showFavorites && (
        <NavSearch
          searchTag={p.searchTag}
          setSearchTag={p.setSearchTag}
          onSearch={p.onSearch}
          siteName={p.selectedSite.name}
        />
      )}

      {/* Direita: Ações em massa */}
      <NavActions
        isAllSelected={p.isAllSelected}
        onToggleAll={p.onToggleAll}
        downloadPath={p.downloadPath}
        onSelectFolder={p.onSelectFolder}
        onDownloadSelected={p.onDownloadSelected}
        selectedCount={p.selectedCount}
        isDownloading={p.isDownloading}
      />
    </nav>
  )
}
