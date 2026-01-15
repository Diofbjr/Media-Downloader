import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Interface estrita para as informações da release
interface UpdateInfo {
  version: string
  releaseNotes?: string | unknown // Trocado de any para unknown para satisfazer o linter
  releaseDate: string
}

const updaterAPI = {
  startDownload: () => ipcRenderer.send('start_download'),
  restartApp: () => ipcRenderer.send('restart_app'),

  onUpdateAvailable: (callback: (info: UpdateInfo) => void) => {
    ipcRenderer.on('update_available', (_event, info: UpdateInfo) => callback(info))
  },
  onDownloadProgress: (callback: (percent: number) => void) => {
    ipcRenderer.on('download_progress', (_event, percent: number) => callback(percent))
  },
  onUpdateDownloaded: (callback: () => void) => {
    ipcRenderer.on('update_downloaded', () => callback())
  },
  removeListeners: () => {
    ipcRenderer.removeAllListeners('update_available')
    ipcRenderer.removeAllListeners('download_progress')
    ipcRenderer.removeAllListeners('update_downloaded')
  },
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', {
      ...electronAPI,
      updater: updaterAPI,
    })
    contextBridge.exposeInMainWorld('api', {})
  } catch (error) {
    console.error('Erro ao expor contextBridge:', error)
  }
} else {
  // @ts-ignore: Injected globally when context isolation is disabled
  window.electron = { ...electronAPI, updater: updaterAPI }
  // @ts-ignore: Injected globally when context isolation is disabled
  window.api = {}
}
