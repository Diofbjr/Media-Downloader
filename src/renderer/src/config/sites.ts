/* eslint-disable prettier/prettier */
export interface SiteConfig {
  id: string
  name: string
  url: string
  description: string
  icon: string
  color: string // Usaremos Hex para cálculos de transparência
  disabled?: boolean
}

export const SITES: SiteConfig[] = [
  {
    id: 'erome',
    name: 'Erome',
    url: 'https://www.erome.com',
    description: 'Navegue por álbuns de fotos e vídeos em alta qualidade.',
    icon: '📸',
    color: '#3b82f6' // Blue 500
  },
  {
    id: 'ehentai',
    name: 'E-Hentai',
    url: 'https://e-hentai.org',
    description: 'Acesso a galerias e metadados detalhados com suporte a categorias.',
    icon: '⛩️',
    color: '#f97316' // Orange 500
  },
  {
    id: 'placeholder',
    name: 'Em breve...',
    url: '',
    description: 'Novas fontes de mídia serão adicionadas em futuras atualizações.',
    icon: '⏳',
    color: '#4b5563', // Gray 600
    disabled: true
  }
]