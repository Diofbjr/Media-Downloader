import { MediaItem } from '../types'
import { SiteProvider } from './providers'

export const Rule34VideoProvider: SiteProvider = {
  limit: 20, // Adicionado para satisfazer SiteProvider [cite: 22]
  search: async (tags: string, page: number = 1): Promise<MediaItem[]> => {
    const response = await window.electron.ipcRenderer.invoke('scrape:rule34video', { tags, page })
    return response
  },

  getAlbumContent: async (videoPageUrl: string): Promise<MediaItem[]> => {
    const response = await window.electron.ipcRenderer.invoke('scrape:rule34video:album', {
      url: videoPageUrl,
    })
    return response
  },
}
