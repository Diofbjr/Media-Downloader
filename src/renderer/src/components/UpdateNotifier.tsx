import { useEffect, useState } from 'react'

export const UpdateNotifier = () => {
  const [status, setStatus] = useState<string | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // Escuta mensagens do sistema
    window.electron.ipcRenderer.on('update-message', (_event, text: string) => {
      setStatus(text)
      if (!text.includes('Erro')) {
        setTimeout(() => setStatus(null), 10000) // Esconde após 10s se não for erro
      }
    })

    // Escuta quando o download termina
    window.electron.ipcRenderer.on('update-downloaded', () => {
      setStatus('Nova versão pronta para instalar!')
      setReady(true)
    })
  }, [])

  if (!status && !ready) return null

  return (
    <div className="fixed bottom-6 left-6 z-999 animate-in fade-in slide-in-from-left-4">
      <div className="bg-[#16191d] border border-blue-500/40 p-4 rounded-2xl shadow-2xl flex flex-col gap-3 min-w-70">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-black text-white uppercase tracking-widest">
            Sistema de Atualização
          </span>
        </div>

        <p className="text-sm text-gray-400 font-medium">{status}</p>

        {ready && (
          <button
            onClick={() => window.electron.restartApp()}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black py-2 rounded-xl transition-all active:scale-95"
          >
            REINICIAR E ATUALIZAR AGORA
          </button>
        )}
      </div>
    </div>
  )
}
