import axios from 'axios'
import { MediaItem, SiteProvider } from './providers'

interface Rule34Post {
  id: number
  preview_url: string
  file_url: string
  tags: string
  rating: string
}

export const Rule34Provider: SiteProvider = {
  limit: 42,
  // Removido o "= 0" do page para ser estritamente compatível com SiteProvider
  async search(tags: string, page: number): Promise<MediaItem[]> {
    try {
      const limit = 42
      const pid = page * limit

      const { data } = await axios.get<Rule34Post[]>('https://api.rule34.xxx/index.php', {
        params: {
          page: 'dapi',
          s: 'post',
          q: 'index',
          json: 1,
          tags: tags.trim(),
          pid: pid,
          limit: limit,
          // Mantendo os IDs que tinhas no teu ficheiro original
          api_key:
            '7e602b5729c3a32b77f7e839f73beec34c5c248e8734460061debabf967e5cb16eec248bb70ed9eeed87f1ac1ef6283afa6132a8b4b78336f0369a0bfc720a6e',
          user_id: '5702014',
        },
      })

      if (!data || !Array.isArray(data)) return []

      return data.map((post): MediaItem => {
        // Normaliza as URLs que vêm como //img.rule34.xxx/...
        const fixUrl = (url: string): string => (url.startsWith('//') ? `https:${url}` : url)
        const fileUrl = fixUrl(post.file_url)

        const isVideo =
          fileUrl.toLowerCase().endsWith('.mp4') || fileUrl.toLowerCase().endsWith('.webm')
        const isGif = fileUrl.toLowerCase().endsWith('.gif')

        return {
          id: `r34-${post.id}`,
          type: isVideo ? 'video' : isGif ? 'gif' : 'image',
          fileUrl: fileUrl,
          previewUrl: fixUrl(post.preview_url),
          tags: post.tags.split(' '),
          rating: post.rating,
        }
      })
    } catch (error) {
      console.error('Erro no Rule34:', error)
      return []
    }
  },
}
