import { useState } from 'react'
import { MediaItem } from '../types'
import { EromeProvider } from '../services/erome'
import { EHentaiProvider, getEHentaiDirectImageUrl } from '../services/ehentai'

export function useDownloadManager() {
  const [downloading, setDownloading] = useState(false)
  const [progress, setProgress] = useState({ current: 0, total: 0 })

  const startDownload = async (items: MediaItem[], path: string) => {
    setDownloading(true)
    const queue: MediaItem[] = []

    for (const item of items) {
      const isAlbum =
        item.fileUrl.includes('erome.com/a/') || item.fileUrl.includes('e-hentai.org/g/')
      if (isAlbum) {
        const content = item.fileUrl.includes('erome')
          ? await EromeProvider.getAlbumContent?.(item.fileUrl)
          : await EHentaiProvider.getAlbumContent?.(item.fileUrl)
        if (content) queue.push(...content)
      } else {
        queue.push(item)
      }
    }

    setProgress({ current: 0, total: queue.length })

    for (let i = 0; i < queue.length; i++) {
      let item = queue[i]
      if (item.fileUrl.includes('e-hentai.org/s/')) {
        const direct = await getEHentaiDirectImageUrl(item.fileUrl)
        item = { ...item, fileUrl: direct || item.fileUrl }
      }
      const ext = item.fileUrl.split('.').pop()?.split('?')[0] || 'jpg'
      await window.electron.ipcRenderer.invoke('download:file', {
        url: item.fileUrl,
        destPath: path,
        fileName: `${item.id.replace(/[^a-z0-9]/gi, '_')}.${ext}`,
      })
      setProgress((p) => ({ ...p, current: i + 1 }))
    }
    setDownloading(false)
  }

  return { downloading, progress, startDownload }
}
