import { useState, useCallback } from 'react'
import { MediaItem } from '../types'
import { Rule34Provider } from '../services/rule34'
import { EromeProvider } from '../services/erome'
import { GelbooruProvider } from '../services/gelbooru'
import { E621Provider } from '../services/e621'
import { DanbooruProvider } from '../services/danbooru'
import { EHentaiProvider } from '../services/ehentai'
import { SiteConfig } from '@renderer/config/sites'

export function useMediaSearch() {
  const [media, setMedia] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(0)
  const [currentTags, setCurrentTags] = useState('')
  const [canNext, setCanNext] = useState(true)

  const clear = useCallback(() => {
    setMedia([])
    setPage(0)
    setCurrentTags('')
    setCanNext(true)
  }, [])

  const search = useCallback(
    async (
      site: SiteConfig,
      tags: string = '',
      pageNum: number = 0,
      options?: { cats?: string },
    ) => {
      setLoading(true)
      try {
        let results: MediaItem[] = []
        let providerLimit = 20

        switch (site.id) {
          case 'rule34':
            results = await Rule34Provider.search(tags, pageNum)
            providerLimit = 42
            break
          case 'gelbooru':
            results = await GelbooruProvider.search(tags, pageNum)
            providerLimit = 20
            break
          case 'e621':
            results = await E621Provider.search(tags, pageNum)
            providerLimit = 50
            break
          case 'danbooru':
            results = await DanbooruProvider.search(tags, pageNum)
            providerLimit = 40
            break
          case 'ehentai':
            results = await EHentaiProvider.search(tags, pageNum, options)
            providerLimit = 25
            break
          case 'erome':
            results = await EromeProvider.search(tags, pageNum)
            providerLimit = 12
            break
        }

        setMedia(results)
        setPage(pageNum)
        setCurrentTags(tags)
        setCanNext(results.length >= providerLimit)
      } catch (error) {
        console.error('Erro na busca:', error)
      } finally {
        setLoading(false)
      }
    },
    [],
  )

  return {
    media,
    loading,
    page,
    currentTags,
    search,
    canNext,
    setPage,
    setMedia,
    setLoading,
    clear,
  }
}
