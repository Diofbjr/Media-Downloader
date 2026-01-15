export interface MediaItem {
  id: string
  previewUrl: string
  fileUrl: string
  width?: number
  height?: number
  tags: string[]
  type: 'image' | 'video' | 'gif'
  rating: string
  source?: string
}

export interface SiteConfig {
  id: string
  name: string
  url: string
  description: string
  icon: string
  color: string
}

export interface SiteProvider {
  search: (tags: string, page: number) => Promise<MediaItem[]>
  getAlbumContent?: (albumUrl: string) => Promise<MediaItem[]>
}
