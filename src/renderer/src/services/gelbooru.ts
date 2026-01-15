import axios from 'axios'
import { MediaItem, SiteProvider } from '../types'

interface GelbooruPost {
  id: number
  preview_url: string
  file_url: string
  tags: string
  rating: string
  file_ext: string
}

export const GelbooruProvider: SiteProvider = {
  async search(tags, page = 0): Promise<MediaItem[]> {
    try {
      const { data } = await axios.get('https://gelbooru.com/index.php', {
        params: {
          page: 'dapi',
          s: 'post',
          q: 'index',
          json: 1,
          tags: tags.trim(),
          pid: page, // Gelbooru também usa pid para paginação
          api_key:
            'e05855b9757098525da5b5e8219be23dd99af133f91fd8a3497f1b8b2a8ec55090a6684e6efb1fe085e3eeb96bcbda27644c91ab9d02b79bb5f0a44fdd9c0ad9',
          user_id: '1877688',
        },
      })

      // O Gelbooru retorna um objeto com uma lista dentro de 'post'
      const posts: GelbooruPost[] = data.post || []

      if (!Array.isArray(posts)) return []

      return posts.map((post) => {
        const isVideo = ['mp4', 'webm'].includes(post.file_ext)

        return {
          id: `gel-${post.id}`,
          previewUrl: post.preview_url,
          fileUrl: post.file_url,
          tags: post.tags.split(' '),
          type: isVideo ? 'video' : 'image',
          rating: post.rating,
        }
      })
    } catch (error) {
      console.error('Erro ao buscar no Gelbooru:', error)
      return []
    }
  },
}
