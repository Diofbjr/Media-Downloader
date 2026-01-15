import { useState, useCallback } from 'react'
import { MediaItem, SiteConfig } from '../types'
import { Rule34Provider } from '../services/rule34'
import { EromeProvider } from '../services/erome'
import { GelbooruProvider } from '../services/gelbooru'
import { E621Provider } from '@renderer/services/e621'
import { DanbooruProvider } from '@renderer/services/danbooru'
import { EHentaiProvider } from '@renderer/services/ehentai'

export function useMediaSearch() {
  const [media, setMedia] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(0)
  const [currentTags, setCurrentTags] = useState('')

  const clear = useCallback(() => {
    setMedia([])
    setPage(0)
    setCurrentTags('')
    setLoading(false)
  }, [])

  const search = useCallback(async (site: SiteConfig, tags: string = '', pageNum: number = 0) => {
    setLoading(true)
    try {
      let results: MediaItem[] = []

      switch (site.id) {
        case 'rule34':
          results = await Rule34Provider.search(tags, pageNum)
          break
        case 'gelbooru':
          results = await GelbooruProvider.search(tags, pageNum)
          break
        case 'e621':
          results = await E621Provider.search(tags, pageNum)
          break
        case 'danbooru':
          results = await DanbooruProvider.search(tags, pageNum)
          break
        case 'ehentai':
          results = await EHentaiProvider.search(tags, pageNum)
          break
        case 'erome':
          results = await EromeProvider.search(tags, pageNum)
          break
        default:
          results = []
      }

      setMedia(results)
      setPage(pageNum)
      setCurrentTags(tags)
    } catch (error) {
      console.error('Erro na busca:', error)
      setMedia([])
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    media,
    setMedia,
    loading,
    setLoading,
    page,
    search,
    currentTags,
    clear,
  }
}
