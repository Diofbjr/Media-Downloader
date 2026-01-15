import { AVAILABLE_SITES } from '@renderer/constants/sites'
import { SiteConfig } from '../types'

export const SiteSelector = ({ onSelect }: { onSelect: (site: SiteConfig) => void }) => {
  return (
    /* h-screen trava a altura na tela. overflow-y-auto ativa a rolagem se os cards passarem dessa altura. */
    <div className="h-screen w-full bg-[#0a0c0f] flex flex-col items-center bg-[radial-gradient(circle_at_top,var(--tw-gradient-stops))] from-blue-900/20 via-[#0a0c0f] to-[#0a0c0f] overflow-y-auto custom-scrollbar">
      {/* Header - shrink-0 impede que ele seja esmagado quando houver muitos itens */}
      <div className="pt-20 mb-12 text-center animate-in fade-in zoom-in duration-700 shrink-0">
        <h1 className="text-5xl font-black tracking-tighter text-white mb-2">
          MEDIA <span className="text-blue-500">PRO</span>
        </h1>
        <p className="text-gray-500 font-medium">
          Selecione uma fonte para desfrutar dos seus desejos
        </p>
      </div>

      {/* Grid de Sites - max-w-6xl controla a largura e w-full garante que ocupe o espaço necessário */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl w-full px-6 pb-20">
        {AVAILABLE_SITES.map((site) => (
          <button
            key={site.id}
            onClick={() => onSelect(site)}
            className="group relative bg-[#16191d] border border-white/5 p-8 rounded-4xl text-left transition-all hover:border-blue-500/50 hover:shadow-[0_0_40px_rgba(59,130,246,0.15)] hover:-translate-y-2 animate-in fade-in slide-in-from-bottom-4"
          >
            <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 rounded-4xl transition-opacity" />

            <div className="relative z-10">
              <div className="text-5xl mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500 ease-out">
                {site.icon}
              </div>

              <div className="flex items-center gap-3 mb-3">
                <h3 className="text-2xl font-black text-white">{site.name}</h3>
                <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
              </div>

              <p className="text-sm text-gray-500 leading-relaxed font-medium mb-8">
                {site.description}
              </p>

              <div className="flex items-center text-[10px] font-black tracking-[0.2em] text-blue-500">
                <span className="bg-blue-500/10 px-4 py-2 rounded-xl group-hover:bg-blue-500 group-hover:text-white transition-all">
                  CONECTAR FONTE →
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Footer - mb-12 garante que ele não fique colado no fim da página após a rolagem */}
      <div className="mt-auto mb-12 text-[10px] font-bold text-gray-600 tracking-widest uppercase shrink-0">
        V 1.0 • Sistema de Favoritos Ativado
      </div>
    </div>
  )
}
