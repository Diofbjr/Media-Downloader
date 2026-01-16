export interface Version {
  version: string
  date: string
  changes: string[]
  type: 'major' | 'minor' | 'patch'
}

export const changelogData: Version[] = [
  {
    version: '1.0.5',
    date: '2026-01-16',
    type: 'patch',
    changes: [
      'Refatoração completa do MediaCard em sub-componentes (CardMedia, CardOverlays, CardPressEffect).',
      'Nova lógica de detecção de miniaturas com múltiplos fallbacks (previewUrl, thumbnailUrl, poster).',
      'Implementação de sistema de interação híbrida: Clique rápido para visualizar / Clique longo para selecionar.',
      'Sincronização de eventos de mouse via Timestamp para evitar conflitos de seleção acidental.',
      'Adicionado componente de progresso de download em tempo real no rodapé.',
      'Melhoria na tipagem global (ExtendedMediaItem) para suporte a metadados dinâmicos de APIs.',
      'Correção de bugs visuais no hover de vídeos e badges de álbuns.',
      'Otimização de performance na renderização da galeria e limpeza de timers de memória.',
    ],
  },
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
