export const STATIC_POSTS = [
  {
    id: 5,
    issue_number: 5,
    title: 'EM BREVE: BRMATCHED BETA 4.0 JÁ ESTÁ EM PRODUÇÃO!',
    tag: 'EM BREVE • 4.0',
    summary:
      'Em breve vamos ter o Beta 4.0! Prepare-se para Beowulf, Chapeuzinho Vermelho, a nova arena Heorot e mecânicas inéditas de combate.',
    content:
      'Temos uma grande novidade para a comunidade de duelistas: em breve vamos ter o BRMatched Beta 4.0!\n\nLogo após o lançamento do Beta 3.0 (Becos e Brumas), já iniciamos a produção da próxima grande atualização gratuita do jogo. O Beta 4.0 vai expandir ainda mais a arena com a chegada de Beowulf (acompanhado por Wiglaf e sua mecânica de pontos de Fúria) e Chapeuzinho Vermelho (ao lado do Caçador e os combos táticos da Cesta de cartas).\n\nAlém dos novos lutadores e seus baralhos completos em português, o Beta 4.0 também trará a nova arena ilustrada Heorot (com portas táticas!), trilha sonora dedicada, aprimoramentos na IA e efeitos visuais inéditos.\n\nConfira as prévias oficiais de Beowulf, Chapeuzinho Vermelho, cartas e do mapa Heorot logo acima e fique ligado para a data de lançamento!',
    author: 'DevBRMatched',
    created_at: '2026-11-27 11:45:00',
  },
  {
    id: 4,
    issue_number: 4,
    title: 'BETA 3.0 NO AR: BECOS E BRUMAS TRAZ 10 HERÓIS E 6 ARENAS!',
    tag: 'BETA 3.0',
    summary:
      'Drácula, Sherlock Holmes, Homem Invisível e Jekyll & Hyde chegaram junto com Soho, Mansão Baskerville (com Passagens Secretas) e novos efeitos!',
    content:
      'O BRMatched Beta 3.0 — Becos e Brumas chegou trazendo a maior atualização do jogo até agora!\n\nO elenco agora conta com 10 heróis lendários jogáveis (300 cartas oficiais em PT-BR), incluindo Drácula (com suas 3 Irmãs), Sherlock Holmes (com Dr. Watson), Homem Invisível (com 3 fichas de névoa controláveis diretamente no mapa) e Dr. Jekyll & Sr. Hyde (com transformação 3D entre formas).\n\nDuas novas arenas londrinas entraram em jogo: Soho e Mansão Baskerville — que estreia as Passagens Secretas conectando salas distantes do tabuleiro! O Beta 3.0 também inclui descarte direto clicando nas cartas da mão, trilha sonora e sons de ataque exclusivos para os novos personagens, e um pacote completo de novos efeitos visuais.',
    author: 'DevBRMatched',
    created_at: '2026-11-27 09:00:00',
  },
  {
    id: 3,
    issue_number: 3,
    title: 'BETA 2.0 NO AR: PÉ-GRANDE E ROBIN HOOD ENTRAM NA ARENA!',
    tag: 'BETA 2.0',
    summary:
      'O elenco chegou a 6 heróis jogáveis! Confira Medusa, Rei Arthur, Alice, Sinbad, Pé-Grande e Robin Hood em estilo HQ.',
    content:
      'A atualização Beta 2.0 do BRMatched foi oficialmente disponibilizada para Windows PC! Além dos 4 clássicos da Batalha das Lendas Vol. 1 (Medusa, Rei Arthur, Alice e Sinbad), entraram em cena o Pé-Grande (e seu Jackalope) e Robin Hood (com os 4 Foras-da-Lei), todos com baralhos completos de 30 cartas em português e artes inéditas em estilo Comics!',
    author: 'DevBRMatched',
    created_at: '2026-11-22 12:00:00',
  },
  {
    id: 2,
    issue_number: 2,
    title: 'ARTES INÉDITAS EM QUADRINHOS PARA TODOS OS BARALHOS!',
    tag: 'ARTE',
    summary:
      'Cada carta de Ataque, Defesa, Versátil e Estratagema ganhou identidade própria em estilo Comics vibrante.',
    content:
      'O BRMatched traz duelos táticos assimétricos intensos com identidade visual 100% original em quadrinhos e cartas totalmente em português brasileiro. Todas as cartas receberam molduras de alto contraste e efeitos visuais de impacto!',
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
    id: 'beta-3.0',
    version: 'v3.0-beta',
    title: 'Beta 3.0 — Becos e Brumas (10 Heróis & 6 Arenas)',
    channel: 'beta',
    platform: 'Windows 10/11 (x64)',
    file_name: 'BRMATCHED-Beta-3.0-Setup-Windows-x64.exe',
    file_size: 540000000,
    sha256: '',
    changelog: [
      'NOVO: 4 novos heróis jogáveis — Sherlock Holmes (Dr. Watson), Drácula (3 Irmãs), Homem Invisível (3 Névoas) e Dr. Jekyll & Sr. Hyde!',
      'NOVO: Arenas Soho e Mansão Baskerville (com 4 Passagens Secretas!) + trilhas sonoras e atmosferas dedicadas.',
      'NOVO: 120 novas cartas ilustradas em PT-BR (total de 300 cartas nos 10 heróis) com efeitos visuais exclusivos.',
      'MELHORIA: Posicionamento e movimentação direta no mapa (incluindo arrastar névoas/lutadores) e descarte direto clicando nas cartas da mão com confirmação Sim/Não.',
    ].join('\n'),
    download_count: 0,
    is_latest: 1,
    external_url: '',
    created_at: '2026-11-27 09:00:00',
  },
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
    is_latest: 0,
    external_url: '',
    created_at: '2026-11-22 12:00:00',
  },
];
