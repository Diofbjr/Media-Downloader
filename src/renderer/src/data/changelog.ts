export interface Version {
  version: string
  date: string
  changes: string[]
  type: 'major' | 'minor' | 'patch'
}

export const changelogData: Version[] = [
  {
    version: '1.0.8',
    date: '2026-01-17',
    type: 'patch',
    changes: [
      'Correção Crítica de Paginação: Implementado sistema de backup de navegação que preserva a página atual e os resultados ao retornar de um álbum.',
      'Refatoração de Arquitetura: Divisão do componente principal (App.tsx) em hooks especializados (useDownloadManager, useAppNavigation) para melhor manutenção.',
      'Correção de Loop de Busca: Implementada trava de segurança (Ref) para impedir que o auto-fetch resetasse a galeria para a página 1 ao fechar álbuns.',
      'Otimização de Memória: Limpeza de estados de backup após a restauração da navegação para evitar vazamentos de memória.',
      'Melhoria na Lightbox: Implementada navegação sequencial (Próximo/Anterior) integrada à lista de exibição atual, incluindo suporte a favoritos.',
    ],
  },
  {
    version: '1.0.6',
    date: '2026-01-17',
    type: 'patch',
    changes: [
      'Implementação de download recursivo de álbuns: Agora o app identifica álbuns do Erome e E-Hentai e baixa todas as mídias internas automaticamente.',
      'Novo Modal de Atualização com barra de progresso em tempo real e notas de lançamento.',
      'Persistência do diretório de download: O caminho selecionado agora é salvo permanentemente no armazenamento local.',
      'Ajuste nos cabeçalhos de requisição (Referer/Origin) para contornar bloqueios de download em servidores de mídia.',
      'Padronização da comunicação IPC entre Processo Principal e Renderizador para maior estabilidade.',
      'Melhoria na fila de download: Os itens agora são processados sequencialmente para evitar sobrecarga de rede.',
    ],
  },
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
