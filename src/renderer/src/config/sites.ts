/* eslint-disable prettier/prettier */
export interface SiteConfig {
  id: string
  name: string
  url: string
  description: string
  icon: string // Pode ser uma URL ou uma cor
  color: string
}

export const AVAILABLE_SITES: SiteConfig[] = [
  {
    id: 'rule34',
    name: 'Rule34.xxx',
    url: 'https://rule34.xxx',
    description: 'Acesso à API oficial para download de mídias.',
    icon: 'R34',
    color: 'border-green-500 hover:bg-green-500/10'
  },
  {
    id: 'placeholder',
    name: 'Em breve...',
    url: '',
    description: 'Novas fontes de mídia serão adicionadas aqui.',
    icon: '?',
    color: 'border-gray-600 opacity-50 cursor-not-allowed'
  }
]