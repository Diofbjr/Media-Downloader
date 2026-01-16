import { app, shell, BrowserWindow, ipcMain, dialog, session, Menu } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { autoUpdater } from 'electron-updater'
import icon from '../../resources/icon.png?asset'
import axios from 'axios'
import fs from 'fs'
import path from 'path'

// --- NOVO: CAMINHO DO ARQUIVO DE FAVORITOS ---
const FAVORITES_PATH = path.join(app.getPath('userData'), 'favorites.json')

// Configuração do updater
autoUpdater.logger = console
autoUpdater.autoDownload = false
autoUpdater.allowPrerelease = true

let mainWindow: BrowserWindow

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 750,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      webSecurity: false,
    },
  })

  // ... (Sua lógica de autoUpdater permanece idêntica aqui)

  Menu.setApplicationMenu(null)

  // Cookies E-Hentai
  session.defaultSession.cookies.set({
    url: 'https://e-hentai.org',
    name: 'uh',
    value: 'y',
    domain: '.e-hentai.org',
    path: '/',
    expirationDate: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
  })

  // Bypass de CORS e CSP
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    const responseHeaders = { ...details.responseHeaders }
    delete responseHeaders['content-security-policy']
    delete responseHeaders['content-security-policy-report-only']
    delete responseHeaders['x-webkit-csp']
    delete responseHeaders['x-frame-options']
    delete responseHeaders['x-content-type-options']

    responseHeaders['Access-Control-Allow-Origin'] = ['*']
    responseHeaders['Access-Control-Allow-Methods'] = ['GET, POST, OPTIONS']
    responseHeaders['Access-Control-Allow-Headers'] = ['*']

    callback({ cancel: false, responseHeaders })
  })

  // Gerenciamento de Referer e User-Agent
  session.defaultSession.webRequest.onBeforeSendHeaders(
    { urls: ['*://*/*'] },
    (details, callback) => {
      details.requestHeaders['User-Agent'] =
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

      const url = details.url
      if (url.includes('erome.com')) details.requestHeaders['Referer'] = 'https://www.erome.com/'
      else if (url.includes('e-hentai.org'))
        details.requestHeaders['Referer'] = 'https://e-hentai.org/'
      else if (url.includes('donmai.us'))
        details.requestHeaders['Referer'] = 'https://danbooru.donmai.us/'
      else if (url.includes('rule34video.com') || url.includes('r34v.com')) {
        details.requestHeaders['Referer'] = 'https://rule34video.com/'
        details.requestHeaders['Origin'] = 'https://rule34video.com'
      }

      callback({ cancel: false, requestHeaders: details.requestHeaders })
    },
  )

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
    if (app.isPackaged) {
      autoUpdater.checkForUpdatesAndNotify()
    }
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.diofbjr.mediadownloader')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // --- Handlers do IPC para o Updater ---
  ipcMain.on('start_download', () => {
    autoUpdater.downloadUpdate()
  })

  ipcMain.on('restart_app', () => {
    autoUpdater.quitAndInstall()
  })

  // --- Handlers de Sistema ---
  ipcMain.handle('dialog:openDirectory', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      properties: ['openDirectory', 'createDirectory'],
      title: 'Selecione a pasta de destino',
    })
    return canceled ? null : filePaths[0]
  })

  // --- NOVO: HANDLERS DE FAVORITOS ---
  ipcMain.handle('favorites:load', () => {
    if (!fs.existsSync(FAVORITES_PATH)) return []
    try {
      const data = fs.readFileSync(FAVORITES_PATH, 'utf-8')
      return JSON.parse(data)
    } catch (e) {
      console.error('Erro ao ler favoritos:', e)
      return []
    }
  })

  ipcMain.on('favorites:save', (_, favorites) => {
    try {
      fs.writeFileSync(FAVORITES_PATH, JSON.stringify(favorites, null, 2))
    } catch (e) {
      console.error('Erro ao salvar favoritos:', e)
    }
  })

  // --- Handler de Download ---
  ipcMain.handle('download:file', async (_event, { url, destPath, fileName }) => {
    try {
      let referer = 'https://www.google.com/'
      if (url.includes('erome.com')) referer = 'https://www.erome.com/'
      if (url.includes('e-hentai.org')) referer = 'https://e-hentai.org/'
      if (url.includes('rule34video.com') || url.includes('r34v.com'))
        referer = 'https://rule34video.com/'

      const response = await axios({
        method: 'GET',
        url: url,
        responseType: 'stream',
        headers: {
          Referer: referer,
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
      })

      if (!fs.existsSync(destPath)) fs.mkdirSync(destPath, { recursive: true })
      const fullPath = path.join(destPath, fileName)
      const writer = fs.createWriteStream(fullPath)
      response.data.pipe(writer)

      return new Promise<void>((resolve, reject) => {
        writer.on('finish', resolve)
        writer.on('error', reject)
      })
    } catch (error) {
      console.error('Erro no download:', error)
      throw error
    }
  })

  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
