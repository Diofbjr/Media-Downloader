interface LobbyCardProps {
  name: string
  description: string
  color: string
  icon: string
  onClick: () => void
}

export const LobbyCard = ({ name, description, color, icon, onClick }: LobbyCardProps) => (
  <button
    onClick={onClick}
    className="group relative flex flex-col items-start p-8 rounded-3xl bg-[#16191d] border border-white/5 hover:border-white/20 transition-all duration-500 hover:-translate-y-2 overflow-hidden shadow-2xl"
  >
    {/* Efeito de brilho no fundo */}
    <div
      className="absolute -right-8 -top-8 w-32 h-32 blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity"
      style={{ backgroundColor: color }}
    />

    <div
      className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-inner"
      style={{ backgroundColor: `${color}20`, color: color }}
    >
      {icon}
    </div>

    <h3 className="text-xl font-black text-white mb-2 tracking-tight">{name}</h3>
    <p className="text-sm text-gray-500 text-left leading-relaxed">{description}</p>

    <div className="mt-8 flex items-center gap-2 text-[10px] font-black tracking-widest text-gray-400 group-hover:text-white transition-colors">
      ACESSAR GALERIA <span className="group-hover:translate-x-1 transition-transform">→</span>
    </div>
  </button>
)
