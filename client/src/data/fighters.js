import { assetUrl } from '../utils/assets';

const RAW_FIGHTERS = [
  {
    id: 'medusa',
    name: 'MEDUSA',
    subtitle: 'A Górgona Implacável',
    collection: 'Beta 2.0 • Lendas Vol. 1',
    image: '/images/fighter-medusa.jpg',
    color: '#10D876',
    accentSoft: 'rgba(16, 216, 118, 0.18)',
    accentGlow: 'rgba(16, 216, 118, 0.36)',
    textColor: '#05150e',
    hp: 16,
    move: 3,
    range: 'À Distância',
    sidekick: '3 Harpias (1 Vida cada)',
    abilityTitle: 'OLHAR PETRIFICANTE',
    abilityText:
      'No início do seu turno, você pode causar 1 de dano a um lutador adversário que esteja na mesma zona que a Medusa.',
    quote: '"Olhe nos meus olhos e transforme sua estratégia em pedra!"',
    cards: [
      { name: 'OLHAR DE PEDRA', image: '/images/cards/medusa-olhar-de-pedra.jpg' },
      { name: 'SEGUNDO GOLPE', image: '/images/cards/medusa-segundo-tiro.jpg' },
      { name: 'SIBILAR E ESCORREGAR', image: '/images/cards/medusa-sibilo.jpg' },
    ],
  },
  {
    id: 'arthur',
    name: 'REI ARTHUR',
    subtitle: 'O Soberano de Camelot',
    collection: 'Beta 2.0 • Lendas Vol. 1',
    image: '/images/fighter-arthur.jpg',
    color: '#E63946',
    accentSoft: 'rgba(230, 57, 70, 0.2)',
    accentGlow: 'rgba(245, 197, 66, 0.36)',
    textColor: '#ffffff',
    hp: 18,
    move: 2,
    range: 'Corpo a Corpo',
    sidekick: 'Merlin (7 de Vida • À Distância)',
    abilityTitle: 'REFORÇO REAL (BOOST)',
    abilityText:
      'Quando o Rei Arthur atacar, você pode jogar uma carta extra virada para baixo para somar o valor de Reforço (Boost) ao ataque!',
    quote: '"Por Camelot! Com Excalibur e Merlin ao meu lado, nenhum inimigo resiste."',
    cards: [
      { name: 'EXCALIBUR', image: '/images/cards/arthur-excalibur.jpg' },
      { name: 'GOLPE VELOZ', image: '/images/cards/arthur-golpe-veloz.jpg' },
      { name: 'A DAMA DO LAGO', image: '/images/cards/arthur-dama-do-lago.jpg' },
    ],
  },
  {
    id: 'alice',
    name: 'ALICE',
    subtitle: 'Guerreira do País das Maravilhas',
    collection: 'Beta 2.0 • Lendas Vol. 1',
    image: '/images/fighter-alice.jpg',
    color: '#2196F3',
    accentSoft: 'rgba(33, 150, 243, 0.2)',
    accentGlow: 'rgba(33, 150, 243, 0.4)',
    textColor: '#ffffff',
    hp: 13,
    move: 2,
    range: 'Corpo a Corpo',
    sidekick: 'Jabberwock (8 de Vida • Corpo a Corpo)',
    abilityTitle: 'GRANDE & PEQUENA',
    abilityText:
      'Comece o jogo Grande (+2 em todos os seus ataques) ou alterne para Pequena (+1 em todas as suas defesas) através das cartas!',
    quote: '"Através do espelho, o tamanho da sua defesa nunca será suficiente!"',
    cards: [
      { name: 'ATRAVÉS DO ESPELHO', image: '/images/cards/alice-espelho.jpg' },
      { name: 'TRUQUE ASTUTO', image: '/images/cards/alice-vorpal.jpg' },
      { name: 'COMA-ME', image: '/images/cards/alice-coma-me.jpg' },
    ],
  },
  {
    id: 'sinbad',
    name: 'SINBAD',
    subtitle: 'O Navegador das Sete Viagens',
    collection: 'Beta 2.0 • Lendas Vol. 1',
    image: '/images/fighter-sinbad.jpg',
    color: '#FF7A18',
    accentSoft: 'rgba(255, 122, 24, 0.2)',
    accentGlow: 'rgba(255, 122, 24, 0.4)',
    textColor: '#1a0c02',
    hp: 15,
    move: 2,
    range: 'Corpo a Corpo',
    sidekick: 'Carregador (6 de Vida • Corpo a Corpo)',
    abilityTitle: 'VIAJANTE LENDÁRIO',
    abilityText:
      'Ao Manobrar, ganhe +1 de movimento para cada carta de VIAGEM na sua pilha de descarte. Quanto mais longa a batalha, mais imparável Sinbad fica!',
    quote: '"Cada viagem traz uma cicatriz — e ainda mais poder para o próximo golpe!"',
    cards: [
      { name: 'SALTO DISTANTE', image: '/images/cards/sinbad-salto-distante.jpg' },
      { name: 'VIAGEM PARA CASA', image: '/images/cards/sinbad-viagem-casa.jpg' },
      { name: 'VIAGEM À ILHA QUE ERA UMA BALEIA', image: '/images/cards/sinbad-ilha-baleia.jpg' },
    ],
  },
  {
    id: 'pegrande',
    name: 'PÉ-GRANDE',
    subtitle: 'O Colosso Indomável da Floresta',
    collection: 'Beta 2.0 • Robin Hood vs Pé-Grande',
    image: '/images/fighter-pegrande.jpg',
    color: '#F5C542',
    accentSoft: 'rgba(245, 197, 66, 0.18)',
    accentGlow: 'rgba(245, 197, 66, 0.36)',
    textColor: '#171102',
    hp: 16,
    move: 3,
    range: 'Corpo a Corpo',
    sidekick: 'Jackalope / Lebrílope (6 de Vida)',
    abilityTitle: 'REI DA FLORESTA',
    abilityText:
      'No final do seu turno, se não houver nenhum lutador adversário na mesma zona que o Pé-Grande, você pode comprar 1 carta!',
    quote: '"Ninguém vê o Pé-Grande chegar — só sente o impacto da floresta inteira!"',
    cards: [
      { name: 'MAIOR QUE A VIDA', image: '/images/cards/pegrande-maior-que-a-vida.jpg' },
      { name: 'CHIFRES DE JACKALOPE', image: '/images/cards/pegrande-jackalope.jpg' },
      { name: 'ATRAVESSAR AS ÁRVORES', image: '/images/cards/pegrande-arvores.jpg' },
    ],
  },
  {
    id: 'robinhood',
    name: 'ROBIN HOOD',
    subtitle: 'O Arqueiro Fora-da-Lei de Sherwood',
    collection: 'Beta 2.0 • Robin Hood vs Pé-Grande',
    image: '/images/fighter-robinhood.jpg',
    color: '#43B54B',
    accentSoft: 'rgba(67, 181, 75, 0.2)',
    accentGlow: 'rgba(67, 181, 75, 0.38)',
    textColor: '#051507',
    hp: 13,
    move: 2,
    range: 'À Distância',
    sidekick: '4 Foras-da-Lei (1 Vida cada)',
    abilityTitle: 'EMBOSCAR E RECUAR',
    abilityText:
      'Após atacar, você pode mover o lutador atacante até 2 espaços! Acerte de longe e desapareça entre as árvores antes do contra-ataque.',
    quote: '"Uma flecha certeira, dois passos para trás e seu ouro já mudou de dono!"',
    cards: [
      { name: 'TIRO DESARMANTE', image: '/images/cards/robin-tiro-desarmante.jpg' },
      { name: 'EMBOSCADA', image: '/images/cards/robin-emboscada.jpg' },
      { name: 'ROUBAR DOS RICOS', image: '/images/cards/robin-roubar-ricos.jpg' },
    ],
  },
];

export const FIGHTERS = RAW_FIGHTERS.map((f) => ({
  ...f,
  image: assetUrl(f.image),
  cards: f.cards.map((c) => ({ ...c, image: assetUrl(c.image) })),
}));

export function findFighterByName(name) {
  if (!name) return FIGHTERS[1];
  const lower = name.toLowerCase();
  return (
    FIGHTERS.find(
      (f) => f.name.toLowerCase() === lower || f.id === lower || lower.includes(f.id)
    ) || FIGHTERS[1]
  );
}
