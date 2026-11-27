import { useState } from 'react';
import {
  ArrowRight,
  Calendar,
  Flame,
  MapPin,
  Newspaper,
  Rocket,
  Sparkles,
  Swords,
  X,
  ZoomIn,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDateBR, getGitHubIssuesUrl, IS_STATIC_SITE } from '../services/api';
import { assetUrl } from '../utils/assets';

const ROADMAP_UPDATES = [
  {
    version: 'BETA 3.0 • NO AR',
    status: 'LANÇADO',
    statusColor: '#10d876',
    statusText: '#05150e',
    title: 'Becos e Brumas (10 Heróis)',
    icon: Swords,
    items: [
      '4 novos heróis jogáveis: Drácula, Sherlock Holmes, Homem Invisível e Jekyll & Hyde.',
      '120 novas cartas ilustradas em PT-BR (total de 300 cartas) com seleção e descarte direto.',
      'Arenas Soho e Mansão Baskerville (com Passagens Secretas) + novos efeitos visuais e sonoros.',
    ],
  },
  {
    version: 'BETA 4.0 • EM BREVE',
    status: 'EM PRODUÇÃO',
    statusColor: '#f5c542',
    statusText: '#08101a',
    title: 'Chegada do Beta 4.0!',
    icon: Flame,
    items: [
      'Novos lutadores lendários em preparo: Beowulf (com Wiglaf) e Chapeuzinho Vermelho (com Caçador)!',
      'Mecânicas inéditas de Fúria e Cesta de Cartas, além de novas arenas exclusivas.',
      'Mais efeitos cinematográficos, polimento visual e novas trilhas temáticas.',
    ],
  },
  {
    version: 'NO RADAR',
    status: 'PLANEJADO',
    statusColor: '#8b42ff',
    statusText: '#ffffff',
    title: 'Evolução Contínua',
    icon: Rocket,
    items: [
      'Expansões gratuitas com novos heróis mitológicos e literários em PT-BR.',
      'Aprimoramentos contínuos na IA tática, animações de cartas e efeitos de impacto.',
      'Ajustes de balanceamento guiados diretamente pelo feedback da comunidade.',
    ],
  },
];

const NEWS_FILTERS = [
  { key: 'ALL', label: 'Todas' },
  { key: 'FUTURO UPDATE', label: 'Beta 4.0 & Updates' },
  { key: 'BETA 3.0', label: 'Lançamentos' },
  { key: 'ARTE', label: 'Arte & Bastidores' },
];

function matchesFilter(post, filterKey) {
  if (filterKey === 'ALL') return true;
  const tag = String(post.tag || '').toUpperCase();
  if (filterKey === 'FUTURO UPDATE') {
    return tag.includes('4.0') || tag.includes('UPDATE') || tag.includes('FUTURO') || tag.includes('ROADMAP') || tag.includes('NOTÍCIA');
  }
  if (filterKey === 'BETA 3.0') {
    return tag.includes('BETA') || tag.includes('PATCH') || tag.includes('ANÚNCIO') || tag.includes('LANÇAMENTO');
  }
  return tag.includes(filterKey);
}

export default function NewsSection({ posts = [], onOpenPost }) {
  const [filter, setFilter] = useState('ALL');
  const [previewMap, setPreviewMap] = useState(null);
  const issuesUrl = getGitHubIssuesUrl();

  const filteredPosts = posts.filter((p) => matchesFilter(p, filter));

  return (
    <section id="noticias" className="section" style={{ paddingTop: '2rem' }}>
      <div className="container">
        {/* Section Header */}
        <div className="section-header" data-reveal="">
          <div>
            <span className="eyebrow" style={{ color: '#f5c542' }}>
              <Newspaper size={13} /> Central de Notícias &amp; Roadmap
            </span>
            <h2 className="comic-title section-heading">NOTÍCIAS &amp; FUTUROS UPDATES</h2>
          </div>

          {!IS_STATIC_SITE ? (
            <Link to="/dashboard?tab=community" className="comic-btn comic-btn-sm comic-btn-white">
              Mural de Bugs &amp; Ideias <ArrowRight size={15} />
            </Link>
          ) : issuesUrl ? (
            <a
              href={issuesUrl}
              target="_blank"
              rel="noreferrer"
              className="comic-btn comic-btn-sm comic-btn-white"
            >
              Sugerir Próximo Herói / Ideia <ArrowRight size={15} />
            </a>
          ) : null}
        </div>

        {/* FEATURED UPCOMING EXPANSION PREVIEW */}
        <div
          className="comic-panel halftone-dark"
          data-reveal="delay-1"
          style={{
            padding: 'clamp(1.5rem, 3.2vw, 2.3rem)',
            marginBottom: '2rem',
            borderColor: 'rgba(245, 197, 66, 0.32)',
          }}
        >
          <div
            className="grid-2-col"
            style={{
              display: 'grid',
              gridTemplateColumns: '1.05fr 0.95fr',
              gap: '2rem',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.85rem' }}>
                <span className="comic-tag" style={{ background: '#e62429', color: '#ffffff' }}>
                  <Flame size={13} /> EM BREVE • BETA 4.0
                </span>
                <span className="stat-pill" style={{ color: '#f5c542', borderColor: 'rgba(245, 197, 66, 0.4)' }}>
                  EM PRODUÇÃO ATIVA
                </span>
              </div>

              <h3 className="comic-title" style={{ fontSize: 'clamp(2rem, 3.6vw, 2.9rem)', margin: '0 0 0.7rem' }}>
                BETA 4.0 EM BREVE: <span style={{ color: '#f5c542' }}>NOVAS LENDAS A CAMINHO!</span>
              </h3>

              <p style={{ margin: '0 0 1.2rem', color: 'var(--text-soft)', lineHeight: 1.65, fontSize: '0.98rem' }}>
                Com a chegada do <strong style={{ color: '#10d876' }}>Beta 3.0 (Becos e Brumas)</strong> —
                trazendo 10 heróis jogáveis, Soho e Mansão Baskerville com passagens secretas — já confirmamos
                que <strong style={{ color: '#f5c542' }}>em breve teremos o Beta 4.0</strong>! A próxima grande
                atualização gratuita vai trazer <strong style={{ color: '#f5c542' }}>Beowulf</strong>,{' '}
                <strong style={{ color: '#ef4444' }}>Chapeuzinho Vermelho</strong>, mecânicas inéditas de
                Fúria e Cesta, novas arenas e ainda mais efeitos visuais!
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.55rem' }}>
                {['Beta 4.0 Em Breve', 'Beowulf & Wiglaf', 'Chapeuzinho Vermelho', 'Arena Heorot', 'Mecânica de Fúria', 'Mecânica da Cesta'].map(
                  (tag) => (
                    <span
                      key={tag}
                      className="pill-ghost"
                      style={{ color: '#f4f1ea', borderColor: 'rgba(245, 197, 66, 0.28)' }}
                    >
                      <Sparkles size={12} color="#f5c542" /> {tag}
                    </span>
                  )
                )}
              </div>
            </div>

            {/* Upcoming Beta 4.0 Hero + Arena Heorot Sneak Peeks */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                {[
                  {
                    name: 'BEOWULF (4.0)',
                    subtitle: 'Fúria & Wiglaf • Em Breve',
                    image: assetUrl('/images/news/beowulf-40-preview.png'),
                    color: '#f5c542',
                  },
                  {
                    name: 'CHAPEUZINHO (4.0)',
                    subtitle: 'Cesta & Caçador • Em Breve',
                    image: assetUrl('/images/news/chapeuzinho-40-preview.png'),
                    color: '#ef4444',
                  },
                ].map((item) => (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => setPreviewMap(item)}
                    style={{
                      position: 'relative',
                      padding: 0,
                      borderRadius: '14px',
                      overflow: 'hidden',
                      border: `1.5px solid ${item.color}88`,
                      background: '#05080f',
                      cursor: 'zoom-in',
                      textAlign: 'left',
                      boxShadow: '0 16px 32px -12px rgba(0,0,0,0.85)',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <div style={{ position: 'relative', aspectRatio: '3 / 4', overflow: 'hidden', width: '100%' }}>
                      <img
                        src={item.image}
                        alt={`Prévia do Beta 4.0: ${item.name}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block' }}
                      />
                      <span
                        style={{
                          position: 'absolute',
                          top: '8px',
                          right: '8px',
                          background: 'rgba(4, 7, 13, 0.85)',
                          color: item.color,
                          border: `1px solid ${item.color}`,
                          borderRadius: '8px',
                          padding: '0.2rem 0.45rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          fontSize: '0.68rem',
                          fontWeight: 700,
                        }}
                      >
                        <ZoomIn size={12} /> PRÉVIA
                      </span>
                    </div>
                    <div style={{ padding: '0.7rem 0.8rem', background: 'rgba(10, 16, 28, 0.96)' }}>
                      <div className="comic-title" style={{ fontSize: '1.15rem', color: item.color }}>
                        {item.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.12rem' }}>
                        {item.subtitle}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Arena Heorot Preview Banner */}
              <button
                type="button"
                onClick={() =>
                  setPreviewMap({
                    name: 'ARENA HEOROT (BETA 4.0)',
                    subtitle: 'O Salão de Hidromel com Portas Táticas!',
                    image: assetUrl('/images/news/heorot-40-preview.png'),
                    color: '#24d1ff',
                  })
                }
                style={{
                  position: 'relative',
                  padding: 0,
                  borderRadius: '14px',
                  overflow: 'hidden',
                  border: '1.5px solid rgba(36, 209, 255, 0.55)',
                  background: '#05080f',
                  cursor: 'zoom-in',
                  textAlign: 'left',
                  boxShadow: '0 16px 32px -12px rgba(0,0,0,0.85)',
                  display: 'flex',
                  flexDirection: 'column',
                  width: '100%',
                }}
              >
                <div style={{ position: 'relative', aspectRatio: '16 / 7', overflow: 'hidden', width: '100%' }}>
                  <img
                    src={assetUrl('/images/news/heorot-40-preview.png')}
                    alt="Prévia da Arena Heorot do Beta 4.0"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      background: 'rgba(4, 7, 13, 0.88)',
                      color: '#24d1ff',
                      border: '1px solid #24d1ff',
                      borderRadius: '8px',
                      padding: '0.2rem 0.5rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      fontSize: '0.68rem',
                      fontWeight: 700,
                    }}
                  >
                    <ZoomIn size={12} /> NOVA ARENA 4.0
                  </span>
                </div>
                <div style={{ padding: '0.6rem 0.85rem', background: 'rgba(10, 16, 28, 0.96)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <div className="comic-title" style={{ fontSize: '1.15rem', color: '#24d1ff' }}>
                    ARENA HEOROT (EM BREVE)
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Salão de Hidromel • Estreia no Beta 4.0
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* 6 Official Beta 4.0 Card Sneak Peeks (3 Beowulf + 3 Chapeuzinho) */}
          <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.85rem' }}>
              <span className="mono" style={{ fontSize: '0.76rem', fontWeight: 700, color: '#f5c542', letterSpacing: '0.08em' }}>
                PRÉVIA DE CARTAS OFICIAIS DO BETA 4.0 — CLIQUE PARA AMPLIAR
              </span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Beowulf &amp; Chapeuzinho Vermelho
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '0.75rem' }}>
              {[
                { name: 'BEOWULF — RELÍQUIA ANCESTRAL', image: assetUrl('/images/news/beowulf-card-1.png'), color: '#f5c542' },
                { name: 'BEOWULF — O IGUAL DE GRENDEL', image: assetUrl('/images/news/beowulf-card-2.png'), color: '#f5c542' },
                { name: 'BEOWULF — O REI GUERREIRO', image: assetUrl('/images/news/beowulf-card-3.png'), color: '#f5c542' },
                { name: 'CHAPEUZINHO — ERA UMA VEZ', image: assetUrl('/images/news/chapeuzinho-card-1.png'), color: '#ef4444' },
                { name: 'CHAPEUZINHO — QUE BOCA GRANDE', image: assetUrl('/images/news/chapeuzinho-card-2.png'), color: '#ef4444' },
                { name: 'CHAPEUZINHO — A PELE DO LOBO', image: assetUrl('/images/news/chapeuzinho-card-3.png'), color: '#ef4444' },
              ].map((card) => (
                <button
                  key={card.name}
                  type="button"
                  onClick={() => setPreviewMap(card)}
                  style={{
                    padding: 0,
                    borderRadius: '10px',
                    overflow: 'hidden',
                    border: `1.5px solid ${card.color}77`,
                    background: '#05080f',
                    cursor: 'zoom-in',
                    aspectRatio: '5 / 7',
                    boxShadow: '0 10px 22px -10px rgba(0,0,0,0.85)',
                  }}
                  title={`Ampliar carta: ${card.name}`}
                >
                  <img
                    src={card.image}
                    alt={card.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ROADMAP OF UPCOMING UPDATES */}
        <div
          className="grid-3-col"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.3rem', marginBottom: '2.6rem' }}
          data-reveal="delay-2"
        >
          {ROADMAP_UPDATES.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.title}
                className="action-step-card"
                style={{ '--step-color': step.statusColor }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '0.85rem',
                    flexWrap: 'wrap',
                  }}
                >
                  <span className="comic-tag" style={{ background: step.statusColor, color: step.statusText }}>
                    <Icon size={13} /> {step.status}
                  </span>
                  <span className="mono" style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                    {step.version}
                  </span>
                </div>

                <h3 className="comic-title" style={{ fontSize: '1.75rem', margin: '0 0 0.7rem' }}>
                  {step.title}
                </h3>

                <ul
                  style={{
                    margin: 0,
                    paddingLeft: '1.1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.45rem',
                    color: 'var(--text-soft)',
                    fontSize: '0.9rem',
                    lineHeight: 1.5,
                  }}
                >
                  {step.items.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* FILTERABLE NEWS & DEVLOG FEED */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '1.4rem',
          }}
        >
          <div>
            <h3 className="comic-title" style={{ fontSize: '2rem', margin: 0 }}>
              ÚLTIMAS NOTÍCIAS &amp; NOTAS DO CRIADOR
            </h3>
          </div>

          <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
            {NEWS_FILTERS.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setFilter(item.key)}
                className={`comic-btn comic-btn-sm ${
                  filter === item.key ? 'comic-btn-yellow' : 'comic-btn-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div
          className="grid-3-col"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.4rem' }}
        >
          {filteredPosts.map((post) => {
            const isUpcoming = String(post.tag || '').toUpperCase().includes('UPDATE') || String(post.tag || '').toUpperCase().includes('4.0');
            return (
              <article
                key={post.id}
                className="comic-panel comic-panel-hover"
                style={{
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.85rem',
                  borderColor: isUpcoming ? 'rgba(245, 197, 66, 0.3)' : undefined,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
                  <span
                    className="comic-tag"
                    style={{
                      background: isUpcoming ? '#f5c542' : '#24d1ff',
                      color: '#060a11',
                    }}
                  >
                    {post.tag}
                  </span>
                  <span className="mono" style={{ fontWeight: 700, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    EDIÇÃO #{String(post.issue_number).padStart(2, '0')}
                  </span>
                </div>

                <h4 className="comic-title" style={{ fontSize: '1.65rem', margin: 0, lineHeight: 1.06 }}>
                  {post.title}
                </h4>

                <p style={{ margin: 0, lineHeight: 1.6, color: 'var(--text-soft)', flex: 1, fontSize: '0.93rem' }}>
                  {post.summary}
                </p>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '0.85rem',
                    borderTop: '1px solid var(--border-subtle)',
                  }}
                >
                  <span
                    className="mono"
                    style={{
                      fontSize: '0.76rem',
                      color: 'var(--text-muted)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                    }}
                  >
                    <Calendar size={13} /> {formatDateBR(post.created_at)}
                  </span>
                  <button
                    type="button"
                    onClick={() => onOpenPost?.(post)}
                    className="comic-btn comic-btn-sm comic-btn-yellow"
                  >
                    Ler Notícia
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Preview Map Lightbox */}
      {previewMap && (
        <div
          role="dialog"
          aria-modal="true"
          className="modal-backdrop"
          onClick={() => setPreviewMap(null)}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '980px',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.85rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              <span className="comic-title" style={{ fontSize: '1.8rem', color: previewMap.color }}>
                PRÉVIA DE FUTURO UPDATE: {previewMap.name}
              </span>
              <button
                type="button"
                onClick={() => setPreviewMap(null)}
                className="comic-btn comic-btn-sm comic-btn-yellow"
              >
                <X size={15} /> Fechar
              </button>
            </div>
            <img
              src={previewMap.image}
              alt={previewMap.name}
              style={{
                width: '100%',
                maxHeight: '80vh',
                objectFit: 'contain',
                borderRadius: '16px',
                border: `2px solid ${previewMap.color}`,
                boxShadow: '0 28px 64px rgba(0, 0, 0, 0.92)',
              }}
            />
          </div>
        </div>
      )}
    </section>
  );
}
