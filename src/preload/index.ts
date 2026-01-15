import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {}

// Verifica se o isolamento de contexto está ativo
if (process.contextIsolated) {
  try {
    // Expõe as APIs padrão do toolkit + nossas funções customizadas
    contextBridge.exposeInMainWorld('electron', {
      ...electronAPI,
      restartApp: () => ipcRenderer.send('restart_app'),
    })

    // Expõe a constante api vazia (ou com suas funções se desejar)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error('Erro ao expor contextBridge:', error)
  }
} else {
  // Fallback para quando o isolamento está desativado (com cast para evitar erro de TS)
  // @ts-ignore (define in dts)
  window.electron = {
    ...electronAPI,
    restartApp: () => ipcRenderer.send('restart_app'),
  }
  // @ts-ignore (define in dts)
  window.api = api
}
