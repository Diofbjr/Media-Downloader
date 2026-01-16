import { EHENTAI_CATEGORIES } from '@renderer/services/ehentai'

interface Props {
  isVisible: boolean
  activeCategories: string[]
  onToggleCategory: (cat: string) => void
}

export const CategoryFilters = ({ isVisible, activeCategories, onToggleCategory }: Props) => {
  if (!isVisible) return null

  return (
    <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5 animate-in fade-in slide-in-from-top-2 duration-300">
      {Object.keys(EHENTAI_CATEGORIES).map((cat) => (
        <button
          key={cat}
          onClick={() => onToggleCategory(cat)}
          className={`px-3 py-1 rounded-lg text-[9px] font-black border transition-all uppercase tracking-tight ${
            activeCategories.includes(cat)
              ? 'bg-blue-500/10 border-blue-500 text-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.1)]'
              : 'bg-transparent border-white/5 text-gray-600 hover:text-gray-400 hover:border-white/10'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}
