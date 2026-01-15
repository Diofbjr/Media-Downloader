import { changelogData } from '../../data/changelog'

interface ChangelogModalProps {
  onClose: () => void
}

export const ChangelogModal = ({ onClose }: ChangelogModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-[#16191d] border border-white/10 w-full max-w-2xl max-h-[80vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
          <div>
            <h2 className="text-xl font-black text-white tracking-tight">O QUE HÁ DE NOVO?</h2>
            <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">
              Notas de Atualização
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full text-gray-400 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          {changelogData.map((v) => (
            <div key={v.version} className="relative pl-6 border-l-2 border-blue-500/30">
              <div className="absolute -left-2.25 top-0 w-4 h-4 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />

              <div className="flex items-center gap-3 mb-2">
                <span className="text-lg font-mono font-bold text-white">v{v.version}</span>
                <span className="text-[10px] bg-white/5 px-2 py-1 rounded text-gray-500 font-bold">
                  {v.date}
                </span>
              </div>

              <ul className="space-y-2">
                {v.changes.map((change, idx) => (
                  <li key={idx} className="text-sm text-gray-400 flex gap-2">
                    <span className="text-blue-500">•</span>
                    {change}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 bg-black/20 border-t border-white/5 flex justify-center">
          <button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black px-8 py-3 rounded-xl transition-all active:scale-95"
          >
            ENTENDI
          </button>
        </div>
      </div>
    </div>
  )
}
