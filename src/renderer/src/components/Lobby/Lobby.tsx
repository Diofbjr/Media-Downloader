import { LobbyCard } from './LobbyCard'
import { SITES } from '../../config/sites'

interface LobbyProps {
  onSelectSite: (site: any) => void
}

export const Lobby = ({ onSelectSite }: LobbyProps) => {
  return (
    <div className="min-h-screen bg-[#0a0c0f] flex flex-col items-center justify-center p-6 animate-in fade-in duration-700">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-black text-white mb-4 tracking-tighter">
          MEDIA<span className="text-blue-500">HUB</span>
        </h1>
        <p className="text-gray-500 font-medium">Selecione uma fonte para começar a navegar</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full">
        {SITES.map((site) => (
          <LobbyCard
            key={site.id}
            name={site.name}
            description={site.description}
            color={site.color}
            icon={site.icon}
            onClick={() => onSelectSite(site)}
          />
        ))}
      </div>

      <footer className="mt-20 text-[10px] font-bold text-gray-700 tracking-[0.3em] uppercase">
        v2.0.0 — Desktop App
      </footer>
    </div>
  )
}
