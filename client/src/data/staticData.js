export const STATIC_POSTS = [
  {
    id: 3,
    issue_number: 3,
    title: 'BETA 2.0 NO AR: PÉ-GRANDE E ROBIN HOOD ENTRAM NA ARENA!',
    tag: 'BETA 2.0',
    summary:
      'O elenco chegou a 6 heróis jogáveis! Confira Medusa, Rei Arthur, Alice, Sinbad, Pé-Grande e Robin Hood em estilo HQ.',
    content:
      'A atualização Beta 2.0 do BRMatched está oficialmente disponível para Windows PC! Além dos 4 clássicos da Batalha das Lendas Vol. 1 (Medusa, Rei Arthur, Alice e Sinbad), agora você pode duelar com o Pé-Grande (e seu Jackalope) e Robin Hood (com os 4 Foras-da-Lei), todos com baralhos completos de 30 cartas em português e artes inéditas em estilo Comics!',
    author: 'DevBRMatched',
    created_at: '2026-11-22 12:00:00',
  },
  {
    id: 2,
    issue_number: 2,
    title: 'ARTES INÉDITAS EM QUADRINHOS PARA TODOS OS 6 BARALHOS!',
    tag: 'ARTE',
    summary:
      'Cada carta de Ataque, Defesa, Versátil e Estratagema ganhou identidade própria em estilo Comics vibrante.',
    content:
      'O BRMatched traz duelos táticos assimétricos intensos com identidade visual 100% original em quadrinhos e cartas totalmente em português brasileiro. Todas as 180 cartas do Beta 2.0 receberam molduras de alto contraste e efeitos visuais de impacto!',
    author: 'DevBRMatched',
    created_at: '2026-11-18 15:00:00',
  },
  {
    id: 1,
    issue_number: 1,
    title: 'BEM-VINDO AO HUB OFICIAL DO BRMATCHED PARA WINDOWS!',
    tag: 'ANÚNCIO',
    summary:
      'Baixe todas as versões do jogo, acompanhe a tradução das cartas e ajude a testar novas arenas.',
    content:
      'Este portal foi criado para centralizar os downloads do BRMatched para PC Windows, reunir as fichas dos lutadores em PT-BR e abrir um canal direto com a comunidade de duelistas. Baixe a build mais recente e envie sugestões de balanceamento e novos heróis!',
    author: 'DevBRMatched',
    created_at: '2026-11-10 10:00:00',
  },
];

export const FALLBACK_RELEASES = [
  {
    id: 'beta-2.0',
    version: 'v2.0-beta',
    title: 'Beta 2.0 — 6 Heróis Lendários (PT-BR Comics)',
    channel: 'beta',
    platform: 'Windows 10/11 (x64)',
    file_name: 'BRMATCHED-Beta-2.0-Setup-Windows-x64.exe',
    file_size: 494510585,
    sha256: '',
    changelog: [
      'NOVO: Pé-Grande (com Jackalope) e Robin Hood (com 4 Foras-da-Lei) agora jogáveis no Beta 2.0!',
      'COMPLETO: Elenco com 6 heróis lendários — Medusa, Rei Arthur, Alice, Sinbad, Pé-Grande e Robin Hood — todos com baralhos de 30 cartas em PT-BR e arte Comics.',
      'NOVO: Arenas Floresta de Sherwood e Yukon adicionadas ao lado de Marmoreal e Sarpedon.',
      'MELHORIA: Motor de combate fiel à ordem Imediatamente → Durante o Combate → Após o Combate, incluindo cancelamento por Finta.',
    ].join('\n'),
    download_count: 0,
    is_latest: 1,
    external_url: '',
    created_at: '2026-11-22 12:00:00',
  },
];
