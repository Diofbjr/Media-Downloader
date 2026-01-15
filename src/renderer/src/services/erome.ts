import { MediaItem } from '../types'

export const EromeProvider = {
  search: async (tags: string, page: number = 0): Promise<MediaItem[]> => {
    try {
      const pageToFetch = page + 1
      const url = tags
        ? `https://www.erome.com/search?q=${encodeURIComponent(tags)}&page=${pageToFetch}`
        : `https://www.erome.com/explore?page=${pageToFetch}`

      const response = await fetch(url)
      const html = await response.text()
      const parser = new DOMParser()
      const doc = parser.parseFromString(html, 'text/html')

      const allLinks = doc.querySelectorAll('a[href*="/a/"]')
      const items: MediaItem[] = []
      const processedIds = new Set()

      allLinks.forEach((linkElement: Element) => {
        const link = linkElement as HTMLAnchorElement
        const href = link.getAttribute('href')
        if (!href) return

        const albumUrl = href.startsWith('http') ? href : 'https://www.erome.com' + href
        const albumId = albumUrl.split('/').pop()

        if (albumId && !processedIds.has(albumId)) {
          const container = link.closest('.album-obj') || link.parentElement
          const img = container?.querySelector('img')

          let preview = img?.getAttribute('data-src') || img?.getAttribute('src') || ''

          if (preview.startsWith('//')) preview = 'https:' + preview
          if (preview.includes('clear.png') || !preview) return

          processedIds.add(albumId)

          // Coleta tags iniciais do título na busca
          const titleTags =
            container?.querySelector('.album-title')?.textContent?.trim().split(/\s+/) || []

          items.push({
            id: albumId,
            type: 'image',
            previewUrl: preview,
            fileUrl: albumUrl,
            tags: titleTags,
            rating: 'q',
          })
        }
      })

      return items
    } catch (error) {
      console.error('Erro no processamento Erome:', error)
      return []
    }
  },

  getAlbumContent: async (albumUrl: string): Promise<MediaItem[]> => {
    try {
      const response = await fetch(albumUrl)
      const html = await response.text()
      const parser = new DOMParser()
      const doc = parser.parseFromString(html, 'text/html')
      const items: MediaItem[] = []

      // --- EXTRAÇÃO DE TAGS DO EROME ---
      // No Erome, as tags costumam estar em links dentro de .album-tags ou na descrição
      const tagElements = doc.querySelectorAll(
        '.album-tags a, #album_description a[href*="/search?q="]',
      )
      const albumTags = Array.from(tagElements)
        .map((a) => a.textContent?.trim().replace('#', '') || '')
        .filter((t) => t !== '' && t.length > 1)

      // Se não achar tags específicas, tenta pegar palavras-chave do título
      if (albumTags.length === 0) {
        const title = doc.querySelector('h1')?.textContent || ''
        albumTags.push(...title.split(/\s+/).filter((word) => word.length > 3))
      }

      const processedUrls = new Set<string>()
      const medias = doc.querySelectorAll('.media-group, .video-lg, .img-album')

      medias.forEach((el, i) => {
        const video = el.querySelector('video source')
        const img = el.querySelector('img.img-back')

        if (video) {
          let vUrl = video.getAttribute('src') || ''
          if (vUrl.startsWith('//')) vUrl = 'https:' + vUrl

          if (vUrl && !processedUrls.has(vUrl)) {
            processedUrls.add(vUrl)
            items.push({
              id: `v-${i}-${Math.random().toString(36).substr(2, 5)}`,
              type: 'video',
              previewUrl: '',
              fileUrl: vUrl,
              tags: albumTags, // Injeta as tags no vídeo
              rating: 'q',
            })
          }
        } else if (img) {
          let iUrl = img.getAttribute('data-src') || img.getAttribute('src') || ''
          if (iUrl.startsWith('//')) iUrl = 'https:' + iUrl

          if (iUrl && !processedUrls.has(iUrl)) {
            processedUrls.add(iUrl)
            items.push({
              id: `i-${i}-${Math.random().toString(36).substr(2, 5)}`,
              type: 'image',
              previewUrl: iUrl,
              fileUrl: iUrl,
              tags: albumTags, // Injeta as tags na imagem
              rating: 'q',
            })
          }
        }
      })
      return items
    } catch {
      return []
    }
  },
}
