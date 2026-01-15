import axios from 'axios'
import { MediaItem, SiteProvider } from '../types'

interface Rule34Post {
  id: number
  preview_url: string
  file_url: string
  tags: string
  rating: string
}

export const Rule34Provider: SiteProvider = {
  async search(tags, page = 0): Promise<MediaItem[]> {
    console.log(`🔎 Buscando por: "${tags}" na página ${page}`)

    try {
      const { data } = await axios.get<Rule34Post[]>('https://api.rule34.xxx/index.php', {
        params: {
          page: 'dapi',
          s: 'post',
          q: 'index',
          json: 1,
          tags: tags.trim(),
          pid: page,
          api_key:
            '7e602b5729c3a32b77f7e839f73beec34c5c248e8734460061debabf967e5cb16eec248bb70ed9eeed87f1ac1ef6283afa6132a8b4b78336f0369a0bfc720a6e',
          user_id: '5702014',
        },
      })

      if (!data || !Array.isArray(data)) {
        return []
      }

      return data.map((post: Rule34Post): MediaItem => {
        const fixUrl = (url: string): string => (url.startsWith('//') ? `https:${url}` : url)

        const fileUrlLower = post.file_url.toLowerCase()
        let mediaType: 'video' | 'image' | 'gif' = 'image'

        if (fileUrlLower.endsWith('.mp4') || fileUrlLower.endsWith('.webm')) {
          mediaType = 'video'
        } else if (fileUrlLower.endsWith('.gif')) {
          mediaType = 'gif'
        }

        return {
          id: post.id.toString(),
          previewUrl: fixUrl(post.preview_url),
          fileUrl: fixUrl(post.file_url),
          tags: post.tags.split(' '),
          type: mediaType,
          rating: post.rating,
          width: 0,
          height: 0,
        }
      })
    } catch (error) {
      console.error('❌ Erro na busca:', error)
      return []
    }
  },
}
