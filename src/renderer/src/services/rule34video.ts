import { MediaItem, SiteProvider } from '../types'

export const Rule34VideoProvider: SiteProvider = {
  search: async (tags: string, page: number = 0): Promise<MediaItem[]> => {
    try {
      // O site conta páginas a partir de 1. Se page for 0, vira 1.
      const pageToFetch = page + 1
      const formattedTags = tags.trim().toLowerCase().replace(/\s+/g, '-')

      let url = ''

      if (formattedTags) {
        // Padrão: /search/nome-da-tag/pagina/
        url = `https://rule34video.com/search/${formattedTags}/${pageToFetch}/`
      } else {
        // Caso não haja busca, vai para os updates recentes
        url = `https://rule34video.com/latest-updates/${pageToFetch}/`
      }

      const response = await fetch(url)
      if (!response.ok) return []

      const html = await response.text()
      const parser = new DOMParser()
      const doc = parser.parseFromString(html, 'text/html')

      // Seletores atualizados para a grade de vídeos do site
      const videoElements = doc.querySelectorAll('.item, .col-video, .video-item')
      const items: MediaItem[] = []

      videoElements.forEach((el) => {
        const link = el.querySelector('a')
        const img = el.querySelector('img')

        if (link && img) {
          const href = link.getAttribute('href') || ''
          // Filtra para garantir que é um link de vídeo e não de categoria/tag
          if (!href.includes('/video/')) return

          const videoPageUrl = href.startsWith('http') ? href : `https://rule34video.com${href}`

          // data-original contém a thumb real, src costuma ser um placeholder
          let preview = img.getAttribute('data-original') || img.getAttribute('src') || ''
          if (preview.startsWith('//')) preview = `https:${preview}`

          const idMatch = href.match(/video\/(\d+)/)
          const id = idMatch ? idMatch[1] : Math.random().toString(36).substring(7)

          // Evita duplicatas no mesmo array
          if (items.find((i) => i.id === `r34v-${id}`)) return

          items.push({
            id: `r34v-${id}`,
            type: 'video',
            previewUrl: preview,
            fileUrl: videoPageUrl,
            tags: (img.getAttribute('alt') || '').split(' ').filter((t) => t.length > 2),
            rating: 'nsfw',
          })
        }
      })
      return items
    } catch (error) {
      console.error('Erro Rule34Video Search:', error)
      return []
    }
  },

  getAlbumContent: async (videoPageUrl: string): Promise<MediaItem[]> => {
    try {
      const response = await fetch(videoPageUrl)
      const html = await response.text()
      const parser = new DOMParser()
      const doc = parser.parseFromString(html, 'text/html')

      // 1. Tentativa direta via tag de vídeo
      const videoSource = doc.querySelector('video source') as HTMLSourceElement
      const videoTag = doc.querySelector('video') as HTMLVideoElement
      let videoUrl = videoSource?.src || videoTag?.src

      // 2. Fallback: Extração via Regex no script (comum em players premium/bloqueados)
      if (!videoUrl || videoUrl.includes('blob:')) {
        const scripts = Array.from(doc.querySelectorAll('script'))
        for (const script of scripts) {
          const content = script.textContent || ''
          // Procura por padrões comuns de variáveis de vídeo em JS
          const match =
            content.match(/video_url:\s*['"](https?:[^'"]+)['"]/) ||
            content.match(/file:\s*['"](https?:[^'"]+)['"]/) ||
            content.match(/video_file:\s*['"](https?:[^'"]+)['"]/)
          if (match) {
            videoUrl = match[1]
            break
          }
        }
      }

      if (videoUrl) {
        if (videoUrl.startsWith('//')) videoUrl = `https:${videoUrl}`
        return [
          {
            id: `direct-${Date.now()}`,
            type: 'video',
            previewUrl: '',
            fileUrl: videoUrl,
            tags: [],
            rating: 'nsfw',
          },
        ]
      }
      return []
    } catch (err) {
      console.error('Erro ao extrair vídeo:', err)
      return []
    }
  },
}
