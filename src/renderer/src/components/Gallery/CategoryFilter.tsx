import { EHENTAI_CATEGORIES } from '../../services/ehentai'

interface Props {
  selectedCats: string[]
  onChange: (cats: string[]) => void
}

export const CategoryFilter = ({ selectedCats, onChange }: Props) => {
  const toggleCat = (name: string) => {
    if (selectedCats.includes(name)) {
      onChange(selectedCats.filter((c) => c !== name))
    } else {
      onChange([...selectedCats, name])
    }
  }

  return (
    <div className="flex flex-wrap gap-2 mb-4 px-1">
      {Object.keys(EHENTAI_CATEGORIES).map((cat) => (
        <button
          key={cat}
          onClick={() => toggleCat(cat)}
          className={`px-3 py-1 rounded-full text-[9px] font-bold transition-all border ${
            selectedCats.includes(cat)
              ? 'bg-blue-600 border-blue-500 text-white'
              : 'bg-white/5 border-white/10 text-gray-500 hover:text-gray-300'
          }`}
        >
          {cat.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
