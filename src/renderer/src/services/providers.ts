export interface MediaItem {
  id: string
  previewUrl: string
  fileUrl: string
  tags: string[]
  type: 'image' | 'video' | 'gif' // Fundamental incluir 'gif'
  rating?: string
  source?: string
}

export interface SiteProvider {
  limit: number
  search: (tags: string, page: number) => Promise<MediaItem[]>
  getAlbumContent?: (url: string) => Promise<MediaItem[]>
}
