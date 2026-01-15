export interface Version {
  version: string
  date: string
  changes: string[]
  type: 'major' | 'minor' | 'patch'
}

export const changelogData: Version[] = [
  {
    version: '1.0.0',
    date: '2026-01-15',
    type: 'major',
    changes: [
      'Lançamento Oficial da Plataforma Media Pro.',
      'Integração total com Rule34, Gelbooru e Danbooru.',
      'Suporte a conteúdos adultos via E621 e E-Hentai.',
      'Visualizador de álbuns de alta performance para Erome.',
      'Sistema de download inteligente com bypass de Referer.',
      'Interface moderna com suporte a temas dinâmicos e transparências.',
      'Gerenciador de favoritos integrado (Local Storage).',
      'Sistema de auto-update via GitHub configurado.',
    ],
  },
]
