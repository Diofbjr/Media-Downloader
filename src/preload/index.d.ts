import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI & {
      restartApp: () => void
    }
    api: unknown
  }
}
