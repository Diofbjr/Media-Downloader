interface Props {
  onBack: () => void
  showFavorites: boolean
  setShowFavorites: (val: boolean) => void
}

export const NavNavigation = ({ onBack, showFavorites, setShowFavorites }: Props) => (
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
)
