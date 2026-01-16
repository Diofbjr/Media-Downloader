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
  albumId?: string // Útil para Erome/E-Hentai
}

export interface SiteProvider {
  search: (
    tags: string,
    page: number,
    options?: { cats?: string; nextId?: string },
  ) => Promise<MediaItem[]>
  getAlbumContent?: (albumUrl: string) => Promise<MediaItem[]>
  limit: number // Adicionamos o limite fixo aqui para o Hook saber calcular o canNext
}
