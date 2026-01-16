interface Props {
  value: string
  onChange: (val: string) => void
  onSearch: () => void
  siteName: string
}

export const SearchBar = ({ value, onChange, onSearch, siteName }: Props) => {
  return (
    <div className="flex-1 max-w-2xl relative group">
      {/* Ícone de busca sutil */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors pointer-events-none">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      <input
        type="text"
        className="w-full bg-black/40 border border-white/10 rounded-xl pl-11 pr-5 h-10 text-sm outline-none 
                   focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 
                   group-hover:border-white/20 transition-all placeholder:text-gray-600"
        placeholder={`Pesquisar em ${siteName}...`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onSearch()}
      />

      {/* Atalho visual "Enter" */}
      {value.length > 0 && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 animate-in fade-in zoom-in duration-200">
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono font-bold text-gray-500 bg-white/5 border border-white/10 rounded-md">
            ENTER
          </kbd>
        </div>
      )}
    </div>
  )
}
