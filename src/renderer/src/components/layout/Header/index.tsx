import { HeaderProps } from './types' // Mova a interface para um arquivo de tipos se preferir
import { SearchBar } from './SearchBar'
import { DownloadControls } from './DownloadControls'
import { CategoryFilters } from './CategoryFilters'

export function Header(p: HeaderProps) {
  return (
    <nav className="z-40 bg-[#0d1014] border-b border-white/5 px-6 py-4 flex flex-col gap-4 shrink-0 glass-nav">
      <div className="flex items-center gap-4">
        {/* Navegação e Favoritos */}
        <div className="flex items-center gap-2">
          <button
            onClick={p.onBack}
            className="h-10 px-3 bg-white/5 hover:bg-white/10 rounded-xl text-blue-500 font-bold text-[10px] border border-white/5 transition-colors"
          >
            {p.isInsideAlbum ? '← VOLTAR' : '← SAIR'}
          </button>

          <button
            onClick={p.onToggleFavorites}
            className={`h-10 px-4 rounded-xl text-[10px] font-black border border-white/5 transition-all ${
              p.showFavorites
                ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/20'
                : 'bg-white/5 text-gray-400'
            }`}
          >
            {p.showFavorites ? '❤️ FAVORITOS' : '♡ FAVORITOS'}
          </button>
        </div>

        {/* Barra de Busca */}
        {!p.showFavorites && (
          <SearchBar
            value={p.searchTag}
            onChange={p.setSearchTag}
            onSearch={p.onSearch}
            siteName={p.siteName}
          />
        )}

        {/* Controles de Download */}
        <DownloadControls
          downloadPath={p.downloadPath}
          onSelectPath={p.onSelectPath}
          onDownload={p.onDownload}
          canDownload={p.canDownload}
          isDownloading={p.isDownloading}
          selectedCount={p.selectedCount}
        />
      </div>

      {/* Filtros de Categoria (Condicional) */}
      <CategoryFilters
        isVisible={p.isEHentai && !p.isInsideAlbum && !p.showFavorites}
        activeCategories={p.activeCategories}
        onToggleCategory={p.onToggleCategory}
      />
    </nav>
  )
}
