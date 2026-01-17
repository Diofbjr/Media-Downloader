import axios from 'axios'
import { MediaItem, SiteProvider } from './providers'

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
  limit: 20,
  async search(tags: string, page: number): Promise<MediaItem[]> {
    const pageNum = page + 1
    const { data } = await axios.get<DanbooruPost[]>('https://danbooru.donmai.us/posts.json', {
      params: { tags: tags.trim(), page: pageNum, limit: 20 },
      headers: {
        'User-Agent': 'MediaPro/1.0',
        Accept: 'application/json',
      },
    })

    return (data || [])
      .filter((post) => post.file_url || post.large_file_url)
      .map((post): MediaItem => {
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
        }
      })
  },
}
