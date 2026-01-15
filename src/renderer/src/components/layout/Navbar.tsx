import { SiteConfig } from '../../types'

interface NavbarProps {
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

export const Navbar = ({
  selectedSite,
  searchTag,
  setSearchTag,
  onSearch,
  onBack,
  showFavorites,
  setShowFavorites,
  selectedCount,
  downloadPath,
  onSelectFolder,
  onDownloadSelected,
  isDownloading,
  isAllSelected,
  onToggleAll,
}: NavbarProps) => {
  return (
    <nav className="z-40 bg-[#0a0c0f]/80 backdrop-blur-xl flex items-center justify-between px-8 py-4 border-b border-white/5 shadow-2xl shrink-0">
      {/* Esquerda: Voltar e Toggle Favoritos */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-white/5 rounded-xl text-gray-400 font-bold transition-colors"
          title="Voltar ao Lobby"
        >
          ←
        </button>
        <button
          onClick={() => setShowFavorites(!showFavorites)}
          className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all ${
            showFavorites
              ? 'bg-pink-600 text-white shadow-[0_0_20px_rgba(219,39,119,0.3)]'
              : 'bg-white/5 text-gray-400 hover:bg-white/10'
          }`}
        >
          {showFavorites ? '❤️ FAVORITOS' : '♡ FAVORITOS'}
        </button>
      </div>

      {/* Centro: Barra de Busca (Oculta se estiver nos favoritos) */}
      {!showFavorites && (
        <div className="flex-1 max-w-xl px-8 flex gap-2">
          <input
            type="text"
            className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-2 text-sm focus:ring-2 focus:ring-blue-500/50 outline-none text-white"
            placeholder={`Pesquisar em ${selectedSite.name}...`}
            value={searchTag}
            onChange={(e) => setSearchTag(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSearch()}
          />
          <button
            onClick={onSearch}
            className="bg-blue-600 px-6 rounded-xl text-[10px] font-black text-white hover:bg-blue-500 transition-colors"
          >
            BUSCAR
          </button>
        </div>
      )}

      {/* Direita: Ações de Seleção e Download */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleAll}
          className={`text-[10px] font-bold px-2 transition-colors ${
            isAllSelected ? 'text-blue-500' : 'text-gray-500 hover:text-white'
          }`}
        >
          {isAllSelected ? 'DESMARCAR TUDO' : 'SELECIONAR TUDO'}
        </button>

        <button
          onClick={onSelectFolder}
          className={`text-[10px] px-4 py-2 border rounded-xl font-bold transition-all ${
            downloadPath
              ? 'border-green-500 text-green-500'
              : 'border-white/10 text-gray-400 hover:bg-white/5'
          }`}
        >
          {downloadPath ? 'PASTA OK' : 'DEFINIR PASTA'}
        </button>

        <button
          onClick={onDownloadSelected}
          disabled={selectedCount === 0 || !downloadPath || isDownloading}
          className="bg-green-600 disabled:bg-gray-800 disabled:text-gray-500 px-6 py-2 rounded-xl text-[10px] font-black text-white active:scale-95 transition-all shadow-lg shadow-green-900/20"
        >
          {isDownloading ? 'BAIXANDO...' : `BAIXAR (${selectedCount})`}
        </button>
      </div>
    </nav>
  )
}
