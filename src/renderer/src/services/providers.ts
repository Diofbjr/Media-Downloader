export interface MediaItem {
  id: string
  previewUrl: string
  fileUrl: string
  tags: string[]
  type: 'image' | 'video'
}

export interface SiteProvider {
  search: (tags: string, page: number) => Promise<MediaItem[]>
}
