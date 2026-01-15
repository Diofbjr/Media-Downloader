import axios from 'axios'
import { MediaItem, SiteProvider } from '../types'

// Interface para a resposta do Danbooru
interface DanbooruPost {
  id: number
  file_url?: string
  preview_file_url?: string
  large_file_url?: string
  tag_string: string
  rating: string
  file_ext: string
}

export const DanbooruProvider: SiteProvider = {
  async search(tags, page = 0): Promise<MediaItem[]> {
    try {
      const { data } = await axios.get<DanbooruPost[]>('https://danbooru.donmai.us/posts.json', {
        params: {
          tags: tags.trim(),
          page: page + 1, // Danbooru começa em 1
          limit: 50,
          login: 'yggix',
          api_key: '6fBJ1AWbzr1p3busY5CF1xP7',
        },
      })

      if (!Array.isArray(data)) return []

      return data
        .filter((post) => post.file_url || post.large_file_url)
        .map((post): MediaItem => {
          const isVideo = ['mp4', 'webm'].includes(post.file_ext)
          const isGif = post.file_ext === 'gif'

          return {
            id: `dan-${post.id}`,
            // O Danbooru às vezes não provê preview_file_url, usamos o large ou file como fallback
            previewUrl: post.preview_file_url || post.large_file_url || post.file_url!,
            fileUrl: post.file_url || post.large_file_url!,
            tags: post.tag_string.split(' '),
            type: isVideo ? 'video' : isGif ? 'gif' : 'image',
            rating: post.rating,
          }
        })
    } catch (error) {
      console.error('Erro ao buscar no Danbooru:', error)
      return []
    }
  },
}
