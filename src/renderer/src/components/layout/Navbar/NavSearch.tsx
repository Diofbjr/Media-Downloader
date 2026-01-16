interface Props {
  searchTag: string
  setSearchTag: (val: string) => void
  onSearch: () => void
  siteName: string
}

export const NavSearch = ({ searchTag, setSearchTag, onSearch, siteName }: Props) => (
  <div className="flex-1 max-w-xl px-8 flex gap-2 animate-in fade-in duration-300">
    <input
      type="text"
      className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-2 text-sm focus:ring-2 focus:ring-blue-500/50 outline-none text-white transition-all"
      placeholder={`Pesquisar em ${siteName}...`}
      value={searchTag}
      onChange={(e) => setSearchTag(e.target.value)}
      onKeyDown={(e) => e.key === 'Enter' && onSearch()}
    />
    <button
      onClick={onSearch}
      className="bg-blue-600 px-6 rounded-xl text-[10px] font-black text-white hover:bg-blue-500 transition-colors shadow-lg shadow-blue-900/20"
    >
      BUSCAR
    </button>
  </div>
)
