interface Props {
  onPrev: () => void
  onNext: () => void
}

export const LightboxControls = ({ onPrev, onNext }: Props) => {
  return (
    <>
      <button
        onClick={(e) => {
          e.stopPropagation()
          onPrev()
        }}
        className="absolute left-4 p-4 bg-black/20 hover:bg-blue-600 rounded-2xl text-white transition-all z-50 border border-white/5 group"
      >
        <span className="group-hover:scale-125 block transition-transform">❮</span>
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation()
          onNext()
        }}
        className="absolute right-4 p-4 bg-black/20 hover:bg-blue-600 rounded-2xl text-white transition-all z-50 border border-white/5 group"
      >
        <span className="group-hover:scale-125 block transition-transform">❯</span>
      </button>
    </>
  )
}
