import axios from 'axios'
import { MediaItem, SiteProvider } from './providers'

interface GelbooruPost {
  id: number
  preview_url: string
  file_url: string
  tags: string
  rating: string
  file_ext: string
}

interface GelbooruResponse {
  post: GelbooruPost[]
}

export const GelbooruProvider: SiteProvider = {
  limit: 20,
  async search(tags: string, page: number): Promise<MediaItem[]> {
    try {
      const { data } = await axios.get<GelbooruResponse>('https://gelbooru.com/index.php', {
        params: {
          page: 'dapi',
          s: 'post',
          q: 'index',
          json: 1,
          tags: tags.trim(),
          pid: page,
          limit: 20,
          api_key:
            'e05855b9757098525da5b5e8219be23dd99af133f91fd8a3497f1b8b2a8ec55090a6684e6efb1fe085e3eeb96bcbda27644c91ab9d02b79bb5f0a44fdd9c0ad9',
          user_id: '1877688',
        },
      })

      if (!data?.post) return []

      return data.post.map((post): MediaItem => {
        // Normalização de URL para o Electron
        const cleanUrl = (url: string) => (url.startsWith('//') ? `https:${url}` : url)

        const fileUrl = cleanUrl(post.file_url)
        const ext = post.file_ext?.toLowerCase() || ''
        const isVideo = ['mp4', 'webm'].includes(ext)

        return {
          id: `gel-${post.id}`,
          type: isVideo ? 'video' : ext === 'gif' ? 'gif' : 'image',
          fileUrl: fileUrl,
          previewUrl: cleanUrl(post.preview_url),
          tags: post.tags ? post.tags.split(' ') : [],
          rating: post.rating,
          source: 'Gelbooru',
        }
      })
    } catch (error) {
      console.error('Gelbooru Search Error:', error)
      return []
    }
  },
}
