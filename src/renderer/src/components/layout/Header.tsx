import { EHENTAI_CATEGORIES } from '../../services/ehentai'

interface HeaderProps {
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

export function Header(p: HeaderProps) {
  return (
    <nav className="z-40 bg-[#0d1014] border-b border-white/5 px-6 py-4 flex flex-col gap-4 shrink-0">
      <div className="flex items-center gap-4">
        <button
          onClick={p.onBack}
          className="h-10 px-3 bg-white/5 hover:bg-white/10 rounded-xl text-blue-500 font-bold text-[10px] border border-white/5 transition-colors"
        >
          {p.isInsideAlbum ? '← VOLTAR' : '← SAIR'}
        </button>

        <button
          onClick={p.onToggleFavorites}
          className={`h-10 px-4 rounded-xl text-[10px] font-black border border-white/5 transition-all ${
            p.showFavorites ? 'bg-pink-600 text-white' : 'bg-white/5 text-gray-400'
          }`}
        >
          {p.showFavorites ? '❤️ FAVORITOS' : '♡ FAVORITOS'}
        </button>

        {!p.showFavorites && (
          <div className="flex-1 max-w-2xl">
            <input
              type="text"
              className="w-full bg-black/40 border border-white/10 rounded-xl px-5 h-10 text-sm outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              placeholder={`Pesquisar em ${p.siteName}...`}
              value={p.searchTag}
              onChange={(e) => p.setSearchTag(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && p.onSearch()}
            />
          </div>
        )}

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={p.onSelectPath}
            className={`h-10 px-4 border rounded-xl font-bold text-[10px] transition-all ${
              p.downloadPath
                ? 'border-green-500/50 text-green-500 bg-green-500/5'
                : 'border-white/10 text-gray-400'
            }`}
          >
            {p.downloadPath ? 'PASTA OK' : 'PASTA'}
          </button>
          <button
            onClick={p.onDownload}
            disabled={!p.canDownload || p.isDownloading}
            className="h-10 px-6 bg-green-600 disabled:bg-gray-800 rounded-xl text-[10px] font-black text-white transition-all active:scale-95"
          >
            {p.isDownloading ? 'BAIXANDO...' : `BAIXAR (${p.selectedCount})`}
          </button>
        </div>
      </div>

      {p.isEHentai && !p.isInsideAlbum && !p.showFavorites && (
        <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
          {Object.keys(EHENTAI_CATEGORIES).map((cat) => (
            <button
              key={cat}
              onClick={() => p.onToggleCategory(cat)}
              className={`px-3 py-1 rounded-lg text-[9px] font-black border transition-all ${
                p.activeCategories.includes(cat)
                  ? 'bg-blue-500/10 border-blue-500 text-blue-500'
                  : 'bg-transparent border-white/5 text-gray-600 hover:text-gray-400'
              }`}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>
      )}
    </nav>
  )
}
