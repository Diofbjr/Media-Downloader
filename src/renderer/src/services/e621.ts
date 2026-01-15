import axios from 'axios'
import { MediaItem, SiteProvider } from '../types'

// Definição da estrutura exata da API do e621 para eliminar o 'any'
interface E621Response {
  posts: Array<{
    id: number
    file: {
      url: string | null
      ext: string
    }
    preview: {
      url: string | null
    }
    tags: {
      general: string[]
      character: string[]
    }
    rating: string
  }>
}

export const E621Provider: SiteProvider = {
  async search(tags, page = 0): Promise<MediaItem[]> {
    try {
      // O e621 exige um User-Agent descritivo para não bloquear seu IP
      const { data } = await axios.get<E621Response>('https://e621.net/posts.json', {
        params: {
          tags: tags.trim(),
          page: page + 1, // e621 começa a contagem em 1
          limit: 50,
          login: 'M4ny6', // Opcional
          api_key: 'Vu91ZV379YWrUNEwuDj8FiZH',
        },
        headers: {
          'User-Agent': 'MediaPro/1.0 (by seu_usuario_e621)',
        },
      })

      const posts = data.posts || []

      // Tipamos o post de acordo com a interface acima
      return posts
        .filter((post) => post.file.url !== null) // Remove posts sem link de arquivo
        .map((post): MediaItem => {
          const isVideo = ['webm', 'mp4'].includes(post.file.ext.toLowerCase())
          const isGif = post.file.ext.toLowerCase() === 'gif'

          return {
            id: `e621-${post.id}`,
            // Se não houver preview, usamos o arquivo original (fallback)
            previewUrl: post.preview.url || post.file.url!,
            fileUrl: post.file.url!,
            tags: [...post.tags.general, ...post.tags.character],
            type: isVideo ? 'video' : isGif ? 'gif' : 'image',
            rating: post.rating,
          }
        })
    } catch (error) {
      console.error('Erro ao buscar no e621:', error)
      return []
    }
  },
}
