import { ElectronAPI } from '@electron-toolkit/preload'

// Interface para os dados da atualização
interface UpdateInfo {
  version: string
  releaseNotes?: string | unknown
  releaseDate: string
}

// Interface para a API de atualização
interface UpdaterAPI {
  startDownload: () => void
  restartApp: () => void
  onUpdateAvailable: (callback: (info: UpdateInfo) => void) => void
  onDownloadProgress: (callback: (percent: number) => void) => void
  onUpdateDownloaded: (callback: () => void) => void
  removeListeners: () => void
}

declare global {
  interface Window {
    electron: ElectronAPI & {
      // Unificamos o restartApp e o novo objeto updater
      restartApp: () => void
      updater: UpdaterAPI
    }
    api: unknown
  }
}
