import { useEffect, useState } from 'react'

interface UpdateInfo {
  version: string
  releaseNotes?: string | unknown
  releaseDate: string
}

export const UpdateModal = () => {
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState<'available' | 'downloading' | 'ready'>('available')

  useEffect(() => {
    // 1. Escuta se há atualização disponível vinda do Main Process
    window.electron.updater.onUpdateAvailable((info: UpdateInfo) => {
      setUpdateInfo(info)
      setStatus('available')
    })

    // 2. Escuta o progresso do download real
    window.electron.updater.onDownloadProgress((percent: number) => {
      setProgress(Math.round(percent))
      setStatus('downloading')
    })

    // 3. Escuta quando o ficheiro .exe termina de baixar
    window.electron.updater.onUpdateDownloaded(() => {
      setStatus('ready')
    })

    // Limpeza ao desmontar o componente
    return () => {
      window.electron.updater.removeListeners()
    }
  }, [])

  // Se não houver info de update, o componente não renderiza nada (fica invisível)
  if (!updateInfo) return null

  return (
    <div className="fixed inset-0 z-9999 flex items-end justify-center p-8 bg-black/40 backdrop-blur-sm animate-in fade-in duration-500">
      <div className="bg-[#16191d] border border-blue-500/30 w-full max-w-md rounded-3xl p-6 shadow-2xl shadow-blue-500/10 animate-in slide-in-from-bottom-8">
        {/* Header do Modal */}
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 bg-blue-600/20 rounded-2xl flex items-center justify-center text-2xl">
            🚀
          </div>
          <div className="flex-1">
            <h3 className="text-white font-black text-lg leading-tight">NOVA VERSÃO DISPONÍVEL!</h3>
            <p className="text-blue-500 text-[10px] font-bold tracking-widest uppercase">
              Update v{updateInfo.version}
            </p>
          </div>
        </div>

        {/* Estado 1: Botão para Iniciar Download */}
        {status === 'available' && (
          <div className="space-y-4">
            <p className="text-gray-400 text-sm leading-relaxed">
              Uma nova atualização está pronta. Ela traz melhorias de performance e correções
              importantes para o Media Pro.
            </p>
            <button
              onClick={() => window.electron.updater.startDownload()}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-3 rounded-xl transition-all active:scale-95 shadow-lg shadow-blue-600/20"
            >
              ATUALIZAR AGORA
            </button>
          </div>
        )}

        {/* Estado 2: Barra de Progresso */}
        {status === 'downloading' && (
          <div className="space-y-3">
            <div className="flex justify-between text-[10px] font-black text-gray-500 uppercase tracking-widest">
              <span>A baixar atualização...</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Estado 3: Botão para Reiniciar */}
        {status === 'ready' && (
          <div className="space-y-4">
            <p className="text-green-400 text-sm font-medium">
              Pronto! A atualização foi baixada e será instalada ao reiniciar.
            </p>
            <button
              onClick={() => window.electron.updater.restartApp()}
              className="w-full bg-green-600 hover:bg-green-500 text-white font-black py-3 rounded-xl transition-all active:scale-95 shadow-lg shadow-green-600/20"
            >
              REINICIAR E INSTALAR
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
