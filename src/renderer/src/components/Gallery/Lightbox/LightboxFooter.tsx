import { MediaItem } from '../../../types'

interface Props {
  item: MediaItem
  onTagClick: (tag: string) => void
}

export const LightboxFooter = ({ item, onTagClick }: Props) => {
  return (
    <div
      className="w-full max-w-4xl mt-2 px-4 py-2 bg-[#16191d]/60 backdrop-blur-md rounded-2xl border border-white/5 z-50 mb-1"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <span className="text-[8px] font-black text-blue-500 uppercase tracking-widest">
            Tags
          </span>
          <div className="h-px flex-1 bg-white/5"></div>
        </div>
        <div className="flex flex-wrap gap-1 max-h-16 overflow-y-auto pr-2 custom-scrollbar">
          {item.tags.map((tag) => (
            <button
              key={tag}
              onClick={() => onTagClick(tag)}
              className="text-[8px] bg-blue-500/10 hover:bg-blue-600 border border-blue-500/10 text-blue-400 hover:text-white px-2 py-0.5 rounded-md transition-all whitespace-nowrap"
            >
              #{tag.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
