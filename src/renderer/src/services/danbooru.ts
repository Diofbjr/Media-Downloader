import axios from 'axios'
import { MediaItem, SiteProvider } from '../types'

interface DanbooruPost {
  id: number
  file_url?: string
  large_file_url?: string
  preview_file_url?: string
  tag_string: string
  rating: string
  file_ext: string
}

export const DanbooruProvider: SiteProvider = {
  async search(tags, page = 0): Promise<MediaItem[]> {
    console.log(`🔎 Danbooru: Buscando "${tags}" na página ${page}`)

    try {
      const pageNum = page + 1

      const { data } = await axios.get<DanbooruPost[]>('https://danbooru.donmai.us/posts.json', {
        params: {
          tags: tags.trim(),
          page: pageNum,
          limit: 40,
        },
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          Accept: 'application/json',
        },
      })

      if (!data || !Array.isArray(data)) {
        return []
      }

      return data
        .filter((post) => post.file_url || post.large_file_url)
        .map((post: DanbooruPost): MediaItem => {
          const fileUrl = post.large_file_url || post.file_url || ''

          let mediaType: 'video' | 'image' | 'gif' = 'image'
          if (['mp4', 'webm', 'zip'].includes(post.file_ext)) {
            mediaType = 'video'
          } else if (post.file_ext === 'gif') {
            mediaType = 'gif'
          }

          return {
            id: `dan-${post.id}`,
            previewUrl: post.preview_file_url || fileUrl,
            fileUrl: fileUrl,
            tags: post.tag_string.split(' '),
            type: mediaType,
            rating: post.rating,
            width: 0,
            height: 0,
          }
        })
    } catch (error) {
      // Resolve o erro "Unexpected any" tipando como unknown e verificando se é um erro do Axios
      if (axios.isAxiosError(error)) {
        console.error('❌ Erro Axios Danbooru:', error.response?.status, error.message)
      } else {
        console.error('❌ Erro inesperado Danbooru:', error)
      }
      return []
    }
  },
}
