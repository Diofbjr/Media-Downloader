import { MediaItem, SiteProvider } from '../types'

export const CATEGORY_COLORS: Record<string, string> = {
  Doujinshi: '#F45C55',
  Manga: '#F19E1A',
  'Artist CG': '#D3D203',
  'Game CG': '#12AB11',
  Western: '#30D82C',
  'Non-H': '#0BB8CD',
  'Image Set': '#445BD6',
  Cosplay: '#8E29DB',
  'Asian Porn': '#DD76D5',
  Misc: '#808080',
}

export const getEHentaiDirectImageUrl = async (pageUrl: string): Promise<string> => {
  try {
    const response = await fetch(pageUrl)
    const html = await response.text()
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')
    // O ID #img é onde reside a imagem principal na página de visualização
    const img = doc.querySelector('#img') as HTMLImageElement
    return img?.src || ''
  } catch (error) {
    console.error('❌ [E-Hentai] Erro ao obter imagem direta:', error)
    return ''
  }
}

export const EHentaiProvider: SiteProvider = {
  search: async (tags: string, page: number = 0): Promise<MediaItem[]> => {
    try {
      const url = `https://e-hentai.org/?page=${page}${tags ? `&f_search=${encodeURIComponent(tags)}` : ''}`
      const response = await fetch(url)
      const html = await response.text()
      const parser = new DOMParser()
      const doc = parser.parseFromString(html, 'text/html')

      const items: MediaItem[] = []
      const rows = doc.querySelectorAll('table.itg tr')

      rows.forEach((row, i) => {
        const linkElement = row.querySelector('.gl3c a, .gl3e a, .gl1c a') as HTMLAnchorElement
        const imgElement = row.querySelector('img')
        const catElem = row.querySelector('.cn, .gl1c div')
        const category = catElem?.textContent?.trim() || 'Misc'

        if (linkElement) {
          const albumUrl = linkElement.href
          let previewUrl = imgElement?.getAttribute('data-src') || imgElement?.src || ''

          // Correção para thumbnails em CSS Sprites (comum no EH)
          if (!previewUrl || previewUrl.includes('clear.gif')) {
            const thumbDiv = row.querySelector('.glthumb div, .gl1c div') as HTMLElement
            const bg = thumbDiv?.style.backgroundImage
            if (bg) {
              const match = bg.match(/url\(["']?([^"']*)["']?\)/)
              if (match) previewUrl = match[1]
            }
          }

          items.push({
            id: `eh-${albumUrl.split('/')[4] || i}`,
            type: 'image', // No E-Hentai, o resultado da busca é sempre tratado como entrada de álbum
            previewUrl: previewUrl,
            fileUrl: albumUrl,
            tags: [category, linkElement.textContent?.trim() || 'Gallery'],
            rating: 'nsfw',
          })
        }
      })

      return items
    } catch (err) {
      console.error('❌ [E-Hentai Search] Erro:', err)
      return []
    }
  },

  getAlbumContent: async (albumUrl: string): Promise<MediaItem[]> => {
    try {
      const response = await fetch(albumUrl)
      const html = await response.text()
      const parser = new DOMParser()
      const doc = parser.parseFromString(html, 'text/html')

      const tagElements = doc.querySelectorAll('#taglist tr td div a')
      const albumTags = Array.from(tagElements)
        .map((a) => a.textContent?.trim() || '')
        .filter((t) => t !== '')

      const thumbLinks = doc.querySelectorAll('#gdt a')

      return Array.from(thumbLinks).map((link, i): MediaItem => {
        const anchor = link as HTMLAnchorElement
        const img = anchor.querySelector('img')
        let thumbUrl = img?.src || ''
        
        // Trata thumbnails do grid interno
        const innerDiv = anchor.querySelector('div')
        if ((!thumbUrl || thumbUrl.includes('clear.gif')) && innerDiv?.style.backgroundImage) {
          const match = innerDiv.style.backgroundImage.match(/url\(["']?([^"']*)["']?\)/)
          if (match) thumbUrl = match[1]
        }

        return {
          id: `eh-img-${i}-${Math.random().toString(36).substring(2, 7)}`,
          type: 'image',
          previewUrl: thumbUrl,
          fileUrl: anchor.href, // Este link aponta para /s/ (página de visualização)
          tags: albumTags,
          rating: 'nsfw',
        }
      })
    } catch {
      return []
    }
  },
}