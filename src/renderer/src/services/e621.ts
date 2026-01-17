import axios from 'axios'
import { MediaItem, SiteProvider } from './providers'

interface E621Post {
  id: number
  file: { url: string | null; ext: string }
  preview: { url: string | null }
  tags: { [key: string]: string[] }
  rating: string
}

interface E621Response {
  posts: E621Post[]
}

export const E621Provider: SiteProvider = {
  limit: 50,
  async search(tags: string, page: number): Promise<MediaItem[]> {
    const { data } = await axios.get<E621Response>('https://e621.net/posts.json', {
      params: { tags: tags.trim(), page: page + 1, limit: 50 },
      headers: { 'User-Agent': 'MediaPro/1.0' },
    })

    return (data.posts || [])
      .filter((post) => post.file.url !== null)
      .map(
        (post): MediaItem =>
          ({
            id: `e621-${post.id}`,
            type: ['webm', 'mp4'].includes(post.file.ext.toLowerCase())
              ? 'video'
              : post.file.ext.toLowerCase() === 'gif'
                ? 'gif'
                : 'image',
            fileUrl: post.file.url!,
            previewUrl: post.preview.url || post.file.url!,
            tags: Object.values(post.tags).flat(),
            source: 'E621',
          }) as MediaItem,
      )
  },
}
