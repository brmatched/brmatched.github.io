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
    version: 'PRÓXIMO UPDATE',
    status: 'EM PRODUÇÃO',
    statusColor: '#f5c542',
    statusText: '#08101a',
    title: 'Expansão Névoa & Sombras',
    icon: Swords,
    items: [
      '4 novos heróis lendários: Drácula, Sherlock Holmes, Homem Invisível e Jekyll & Hyde.',
      '120+ novas cartas exclusivas ilustradas em estilo graphic novel 100% PT-BR.',
      'Mecânicas inéditas de névoa, dedução de mão e transformação em combate.',
    ],
  },
  {
    version: 'ARENAS DE LONDRES',
    status: 'EM DESENVOLVIMENTO',
    statusColor: '#24d1ff',
    statusText: '#041320',
    title: 'Soho & Mansão Baskerville',
    icon: MapPin,
    items: [
      'Arena Soho: vielas noturnas iluminadas a gás com zonas de emboscada.',
      'Arena Mansão Baskerville: estreia das passagens secretas conectando salas distantes!',
      'Trilhas sonoras e efeitos ambientais dedicados para cada tabuleiro.',
    ],
  },
  {
    version: 'NO RADAR',
    status: 'PLANEJADO',
    statusColor: '#8b42ff',
    statusText: '#ffffff',
    title: 'Contos, Feras & Evolução',
    icon: Rocket,
    items: [
      'Novos lutadores já na fila: Beowulf e Chapeuzinho Vermelho.',
      'Aprimoramentos na IA tática, animações de cartas e efeitos visuais de impacto.',
      'Ajustes contínuos de balanceamento guiados pelo feedback da comunidade.',
    ],
  },
];

const NEWS_FILTERS = [
  { key: 'ALL', label: 'Todas' },
  { key: 'FUTURO UPDATE', label: 'Futuros Updates' },
  { key: 'BETA 2.0', label: 'Lançamentos' },
  { key: 'ARTE', label: 'Arte & Bastidores' },
];

function matchesFilter(post, filterKey) {
  if (filterKey === 'ALL') return true;
  const tag = String(post.tag || '').toUpperCase();
  if (filterKey === 'FUTURO UPDATE') {
    return tag.includes('UPDATE') || tag.includes('FUTURO') || tag.includes('ROADMAP') || tag.includes('NOTÍCIA');
  }
  if (filterKey === 'BETA 2.0') {
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
                  <Flame size={13} /> PRÓXIMA EXPANSÃO
                </span>
                <span className="stat-pill" style={{ color: '#f5c542', borderColor: 'rgba(245, 197, 66, 0.4)' }}>
                  EM PRODUÇÃO ATIVA
                </span>
              </div>

              <h3 className="comic-title" style={{ fontSize: 'clamp(2rem, 3.6vw, 2.9rem)', margin: '0 0 0.7rem' }}>
                NÉVOA &amp; SOMBRAS: <span style={{ color: '#f5c542' }}>LONDRES ESTÁ CHEGANDO!</span>
              </h3>

              <p style={{ margin: '0 0 1.2rem', color: 'var(--text-soft)', lineHeight: 1.65, fontSize: '0.98rem' }}>
                Depois do sucesso do <strong style={{ color: 'var(--text-main)' }}>Beta 2.0</strong>,
                já estamos trabalhando a todo vapor nos próximos updates gratuitos do BRMatched: novos
                heróis icônicos (<strong style={{ color: '#f5c542' }}>Drácula, Sherlock Holmes, Homem Invisível, Jekyll &amp; Hyde</strong>),
                além das arenas noturnas de <strong style={{ color: '#24d1ff' }}>Soho</strong> e{' '}
                <strong style={{ color: '#24d1ff' }}>Mansão Baskerville</strong> com passagens secretas!
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.55rem' }}>
                {['Drácula', 'Sherlock Holmes', 'Homem Invisível', 'Jekyll & Hyde', 'Beowulf', 'Chapeuzinho'].map(
                  (hero) => (
                    <span
                      key={hero}
                      className="pill-ghost"
                      style={{ color: '#f4f1ea', borderColor: 'rgba(245, 197, 66, 0.28)' }}
                    >
                      <Sparkles size={12} color="#f5c542" /> {hero}
                    </span>
                  )
                )}
              </div>
            </div>

            {/* 2 Upcoming Official Arena Sneak Peeks */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
              {[
                {
                  name: 'SOHO (EM BREVE)',
                  subtitle: 'Ruas Noturnas de Londres',
                  image: assetUrl('/images/news/soho-preview.jpg'),
                  color: '#f5c542',
                },
                {
                  name: 'MANSÃO BASKERVILLE',
                  subtitle: 'Com Passagens Secretas!',
                  image: assetUrl('/images/news/baskerville-preview.jpg'),
                  color: '#24d1ff',
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
                  <div style={{ position: 'relative', aspectRatio: '16 / 11', overflow: 'hidden', width: '100%' }}>
                    <img
                      src={item.image}
                      alt={`Prévia da arena futura ${item.name}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
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
            const isUpcoming = String(post.tag || '').toUpperCase().includes('UPDATE');
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
