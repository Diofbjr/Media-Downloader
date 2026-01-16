import { MediaItem, SiteProvider } from '../types'

declare global {
  interface Window {
    _ehNextCursor: string | null
  }
}

// Exportamos para garantir que o compilador veja o uso e para possível reuso
export interface EHentaiSearchOptions {
  cats?: string
  nextId?: string
}

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

export const EHENTAI_CATEGORIES = {
  Doujinshi: 2,
  Manga: 4,
  'Artist CG': 8,
  'Game CG': 16,
  Western: 512,
  'Non-H': 256,
  'Image Set': 32,
  Cosplay: 64,
  'Asian Porn': 128,
  Misc: 1,
}

export const getEHentaiDirectImageUrl = async (pageUrl: string): Promise<string> => {
  try {
    const response = await fetch(pageUrl)
    const html = await response.text()
    const doc = new DOMParser().parseFromString(html, 'text/html')
    const img = doc.querySelector('#img') as HTMLImageElement
    return img?.src || ''
  } catch {
    return ''
  }
}

export const EHentaiProvider: SiteProvider = {
  search: async (tags, page = 0, options) => {
    try {
      // Fazemos o cast aqui para o TS parar de reclamar do nextId
      const ehOptions = options as EHentaiSearchOptions
      const params = new URLSearchParams()

      if (ehOptions?.nextId) {
        params.append('next', ehOptions.nextId)
      } else {
        params.append('page', page.toString())
      }

      params.append('f_cats', ehOptions?.cats || '0')
      params.append('f_search', tags)
      params.append('f_apply', 'Apply Filter')

      const response = await fetch(`https://e-hentai.org/?${params.toString()}`)
      const html = await response.text()
      const doc = new DOMParser().parseFromString(html, 'text/html')

      let foundNext: string | null = null
      const nextBtn = Array.from(doc.querySelectorAll('.ptb td a')).find(
        (a) => a.textContent === '>' || a.id === 'ptright',
      ) as HTMLAnchorElement | undefined

      if (nextBtn?.href.includes('next=')) {
        foundNext = new URL(nextBtn.href).searchParams.get('next')
      }

      if (!foundNext) {
        const anyNextLink = doc.querySelector('a[href*="next="]') as HTMLAnchorElement | null
        if (anyNextLink) foundNext = new URL(anyNextLink.href).searchParams.get('next')
      }

      window._ehNextCursor = foundNext

      const items: MediaItem[] = []
      const rows = doc.querySelectorAll('table.itg tr, .gl1t')

      rows.forEach((row, i) => {
        const linkElement = row.querySelector('a[href*="/g/"]') as HTMLAnchorElement
        if (!linkElement) return
        const imgElement = row.querySelector('img')
        const catElem = row.querySelector('.cn, .gl1c div, .cs')
        const previewUrl = imgElement?.getAttribute('data-src') || imgElement?.src || ''

        items.push({
          id: `eh-${linkElement.href.split('/')[4] || i}-${Math.random().toString(36).substring(2, 6)}`,
          type: 'image',
          previewUrl,
          fileUrl: linkElement.href,
          tags: [
            catElem?.textContent?.trim() || 'Misc',
            linkElement.textContent?.trim() || 'Gallery',
          ],
          rating: 'nsfw',
        })
      })

      return items
    } catch (err) {
      console.error(err)
      return []
    }
  },

  getAlbumContent: async (albumUrl: string): Promise<MediaItem[]> => {
    try {
      const response = await fetch(albumUrl)
      const html = await response.text()
      const doc = new DOMParser().parseFromString(html, 'text/html')

      const tagElements = doc.querySelectorAll('#taglist tr td div a')
      const albumTags = Array.from(tagElements)
        .map((a) => a.textContent?.trim() || '')
        .filter(Boolean)

      const thumbLinks = doc.querySelectorAll('#gdt a')
      const items: MediaItem[] = []

      thumbLinks.forEach((el, i) => {
        const anchor = el as HTMLAnchorElement
        const img = anchor.querySelector('img')

        let thumbUrl = ''

        if (img?.getAttribute('data-src')) {
          thumbUrl = img.getAttribute('data-src')!
        } else if (img?.style.backgroundImage) {
          const bg = img.style.backgroundImage
          thumbUrl = bg.replace(/url\(['"]?(.*?)['"]?\)/, '$1')
        } else if (img?.src && !img.src.includes('clear.gif')) {
          thumbUrl = img.src
        } else {
          const innerDiv = anchor.querySelector('div')
          if (innerDiv?.style.backgroundImage) {
            thumbUrl = innerDiv.style.backgroundImage.replace(/url\(['"]?(.*?)['"]?\)/, '$1')
          }
        }

        if (anchor.href) {
          items.push({
            id: `eh-img-${i}-${Math.random().toString(36).substring(2, 7)}`,
            type: 'image',
            previewUrl: thumbUrl,
            fileUrl: anchor.href,
            tags: albumTags,
            rating: 'nsfw',
          })
        }
      })

      return items
    } catch (err) {
      console.error('❌ [E-Hentai Album] Erro:', err)
      return []
    }
  },
}
