import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Compass,
  Cpu,
  Download,
  Footprints,
  HardDrive,
  Heart,
  Layers,
  Monitor,
  Shield,
  Sparkles,
  Swords,
  Target,
  Users,
  X,
  Zap,
  ZoomIn,
} from 'lucide-react';
import ArenasSection from '../components/ArenasSection';
import DonateSection from '../components/DonateSection';
import TiltCard from '../components/TiltCard';
import { useAuth } from '../context/AuthContext';
import { FIGHTERS } from '../data/fighters';
import { HERO_DECKS } from '../data/heroDecks';
import { useScrollReveal } from '../hooks/useReveal';
import { api, formatBytes, formatDateBR, getGitHubIssuesUrl, IS_STATIC_SITE } from '../services/api';
import { assetUrl } from '../utils/assets';

const CARD_TYPES = [
  {
    name: 'ATAQUE',
    color: '#e62429',
    icon: Swords,
    desc: 'Cartas vermelhas com estrela usadas para atacar um alvo dentro do seu alcance tático.',
  },
  {
    name: 'DEFESA',
    color: '#1f8bff',
    icon: Shield,
    desc: 'Cartas azuis com escudo reveladas secretamente para absorver dano e virar o combate.',
  },
  {
    name: 'VERSÁTIL',
    color: '#8b42ff',
    icon: Sparkles,
    desc: 'Cartas roxas flexíveis: podem ser jogadas tanto no Ataque quanto na Defesa (ex: Finta!).',
  },
  {
    name: 'ESTRATAGEMA',
    color: '#f5c542',
    icon: Zap,
    desc: 'Cartas amarelas de ação imediata: cura, reposicionamento, dano direto e combos.',
  },
];

const ACTION_STEPS = [
  {
    num: '01',
    tag: '+1 CARTA & MOVIMENTO',
    title: 'MANOBRAR NA ARENA',
    color: '#24d1ff',
    icon: Compass,
    text: (
      <>
        Compre 1 carta do seu baralho e mova seu Herói e Ajudantes pelos espaços conectados.
        Precisa de alcance extra? Descarte uma carta para ativar o valor de{' '}
        <strong style={{ color: '#f5c542' }}>Reforço (Boost)</strong>!
      </>
    ),
  },
  {
    num: '02',
    tag: 'EFEITO IMEDIATO',
    title: 'JOGAR ESTRATAGEMA',
    color: '#f5c542',
    icon: Zap,
    text: (
      <>
        Ative uma carta amarela de efeito imediato para curar vida, buscar cartas lendárias como{' '}
        <strong style={{ color: '#f5c542' }}>Excalibur</strong>, reposicionar ajudantes ou armar
        emboscadas no tabuleiro.
      </>
    ),
  },
  {
    num: '03',
    tag: 'DUELO SECRETO',
    title: 'ATACAR O OPONENTE',
    color: '#e62429',
    icon: Swords,
    text: (
      <>
        Escolha sua carta de Ataque virada para baixo. O rival responde com uma Defesa secreta.
        Revelem juntos e resolvam{' '}
        <strong style={{ color: '#f5c542' }}>Imediatamente → Durante → Após o Combate</strong>!
      </>
    ),
  },
];

export default function Home() {
  const { user } = useAuth();
  const location = useLocation();
  const [stats, setStats] = useState(null);
  const [posts, setPosts] = useState([]);
  const [heroActiveIdx, setHeroActiveIdx] = useState(1); // Rei Arthur spotlight by default
  const [selectedFighter, setSelectedFighter] = useState(FIGHTERS[0]);
  const [showFullDeck, setShowFullDeck] = useState(false);
  const [activePost, setActivePost] = useState(null);
  const [lightboxState, setLightboxState] = useState(null);

  useScrollReveal();

  const fullDeck = HERO_DECKS[selectedFighter.id] || [];
  const heroSpotlight = FIGHTERS[heroActiveIdx] || FIGHTERS[1];

  useEffect(() => {
    api.getStats().then(setStats).catch(() => {});
    api.getPosts().then((res) => setPosts(res.posts || [])).catch(() => {});
  }, []);

  useEffect(() => {
    if (!location.hash) return undefined;
    const targetId = location.hash.replace('#', '');
    const timer = setTimeout(() => {
      const el = document.getElementById(targetId);
      if (el) {
        el.querySelectorAll('[data-reveal]').forEach((node) => node.classList.add('is-revealed'));
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 120);
    return () => clearTimeout(timer);
  }, [location.hash]);

  useEffect(() => {
    if (!activePost && !lightboxState) return undefined;
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        setActivePost(null);
        setLightboxState(null);
      } else if (lightboxState && e.key === 'ArrowRight') {
        setLightboxState((prev) =>
          prev ? { ...prev, index: (prev.index + 1) % prev.cards.length } : null
        );
      } else if (lightboxState && e.key === 'ArrowLeft') {
        setLightboxState((prev) =>
          prev
            ? { ...prev, index: (prev.index - 1 + prev.cards.length) % prev.cards.length }
            : null
        );
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePost, lightboxState]);

  const latest = stats?.latestRelease;
  const issuesUrl = getGitHubIssuesUrl();

  function handleQuickDownload() {
    if (!latest) return;
    window.location.href = api.getDownloadUrl(latest);
    setTimeout(() => {
      api.getStats().then(setStats).catch(() => {});
    }, 800);
  }

  function handleSelectHero(fighter, openAll = false, scrollToDossier = false) {
    setSelectedFighter(fighter);
    if (openAll) setShowFullDeck(true);
    if (scrollToDossier) {
      setTimeout(() => {
        const el = document.getElementById('ficha-lutador');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 45);
    }
  }

  function openCardLightbox(cardsList, idx) {
    setLightboxState({ cards: cardsList, index: idx });
  }

  return (
    <div>
      {/* ---------- CINEMATIC HERO SECTION ---------- */}
      <section
        className="hero-section"
        style={{ '--hero-glow': heroSpotlight.accentGlow }}
      >
        <div
          className="hero-backdrop"
          aria-hidden="true"
          style={{ backgroundImage: `url(${assetUrl('/images/hero-arena.jpg')})` }}
        />
        <div className="hero-aura" aria-hidden="true" />

        <div className="container">
          <div className="hero-grid">
            <div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.55rem', alignItems: 'center' }}>
                <span className="pill-ghost" style={{ color: '#10d876', borderColor: 'rgba(16, 216, 118, 0.35)' }}>
                  <Monitor size={13} /> Windows PC (x64)
                </span>
                <span className="pill-ghost">Sistema DBT • PT-BR</span>
                {latest && (
                  <span className="comic-tag mono" style={{ background: '#f5c542', color: '#08101a' }}>
                    {latest.version}
                  </span>
                )}
              </div>

              <div className="hero-logo-wrap">
                <h1 style={{ margin: 0 }}>
                  <img
                    src={assetUrl('/images/brmatched-logo.png')}
                    alt="BRMatched — A Batalha de Mitos"
                    className="hero-logo-img"
                  />
                </h1>
              </div>

              <div className="display-title comic-outline hero-slogan">
                EM BATALHA, NÃO HÁ <span className="hero-title-accent">IGUAIS!</span>
              </div>

              <p className="hero-lead">
                <strong>BRMatched</strong> é um jogo brasileiro de{' '}
                <strong>Deck-Building com Tabuleiro (Sistema DBT)</strong> com artes oficiais em
                estilo <em>graphic novel</em> e baralhos assimétricos 100% em português. Comande 6
                heróis lendários no <strong>Beta 2.0</strong> e baixe grátis para Windows PC.
              </p>

              <div className="hero-cta-row">
                {latest ? (
                  <button
                    type="button"
                    onClick={handleQuickDownload}
                    className="comic-btn comic-btn-lg comic-btn-emerald"
                  >
                    <Download size={22} strokeWidth={2.75} />
                    BAIXAR PARA WINDOWS
                  </button>
                ) : (
                  <Link to="/downloads" className="comic-btn comic-btn-lg comic-btn-emerald">
                    <Download size={22} strokeWidth={2.75} />
                    BAIXAR PARA WINDOWS
                  </Link>
                )}

                <a href="#lutadores" className="comic-btn comic-btn-lg comic-btn-white">
                  <Swords size={20} />
                  VER HERÓIS &amp; CARTAS
                </a>
              </div>

              {/* LIVE STATS RIBBON */}
              <div className="hero-stats-ribbon">
                <div className="hero-stat-card" style={{ '--stat-color': '#f5c542' }}>
                  <div className="hero-stat-value">{stats ? stats.totalDownloads : '—'}</div>
                  <div className="hero-stat-label">Downloads PC</div>
                </div>
                <div className="hero-stat-card" style={{ '--stat-color': '#24d1ff' }}>
                  <div className="hero-stat-value">6 HERÓIS</div>
                  <div className="hero-stat-label">No Beta 2.0</div>
                </div>
                <div className="hero-stat-card" style={{ '--stat-color': '#10d876' }}>
                  <div className="hero-stat-value">180+</div>
                  <div className="hero-stat-label">Cartas PT-BR</div>
                </div>
              </div>
            </div>

            {/* INTERACTIVE 6-HERO COMIC SLASH SHOWCASE */}
            <div className="hero-showcase-wrap">
              <div className="sfx-badge hero-float-badge">
                <Sparkles size={14} /> ARTES OFICIAIS DO JOGO!
              </div>

              <div className="hero-slash-frame">
                <div className="hero-slash-deck" role="list" aria-label="Galeria interativa de heróis">
                  {FIGHTERS.map((f, idx) => {
                    const isActive = idx === heroActiveIdx;
                    return (
                      <button
                        key={f.id}
                        type="button"
                        role="listitem"
                        aria-pressed={isActive}
                        className={`hero-slash-slice ${isActive ? 'is-active' : ''}`}
                        style={{ '--slice-color': f.color }}
                        onMouseEnter={() => setHeroActiveIdx(idx)}
                        onClick={() => {
                          if (isActive) {
                            handleSelectHero(f, true, true);
                          } else {
                            setHeroActiveIdx(idx);
                          }
                        }}
                        title={`Explorar ${f.name}`}
                      >
                        <img src={f.image} alt={`Arte oficial de ${f.name} no BRMatched`} />
                        <div className="hero-slash-overlay">
                          <span className="hero-slash-vertical-name">{f.name}</span>
                          <div className="hero-slash-details">
                            <span
                              className="hero-slash-stat-chip"
                              style={{ borderColor: f.color }}
                            >
                              <span style={{ color: f.color, marginRight: '0.35rem' }}>●</span>
                              HP {f.hp} • MOV {f.move} • {f.range.toUpperCase()}
                            </span>
                            <div
                              className="comic-title"
                              style={{
                                fontSize: '2.1rem',
                                color: '#f4f1ea',
                                margin: '0.1rem 0 0.25rem',
                                textShadow: '0 3px 12px rgba(0, 0, 0, 0.9)',
                              }}
                            >
                              {f.name}
                            </div>
                            <div
                              style={{
                                fontSize: '0.8rem',
                                color: '#e2e8f0',
                                fontWeight: 700,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.3rem',
                              }}
                            >
                              Clique novamente para ver baralho <ArrowRight size={13} color={f.color} />
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="hero-slash-footer">
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
                    <Swords size={15} color={heroSpotlight.color} />
                    Em destaque: <strong style={{ color: '#f4f1ea' }}>{heroSpotlight.name}</strong> —{' '}
                    {heroSpotlight.subtitle}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleSelectHero(heroSpotlight, true, true)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: heroSpotlight.color,
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      padding: 0,
                      fontSize: '0.82rem',
                    }}
                  >
                    Ver Cartas <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- EDITORIAL MARQUEE RIBBON ---------- */}
      <div className="marquee-wrap" aria-hidden="true">
        <div className="marquee-track">
          <span>EM BATALHA, NÃO HÁ IGUAIS</span>
          <span className="marquee-sep" />
          <span style={{ color: '#f5c542' }}>SISTEMA DBT — DECK-BUILDING COM TABULEIRO</span>
          <span className="marquee-sep" />
          <span>MEDUSA × REI ARTHUR × ALICE × SINBAD × PÉ-GRANDE × ROBIN HOOD</span>
          <span className="marquee-sep" />
          <span style={{ color: '#10d876' }}>BARALHOS ASSIMÉTRICOS DE 30 CARTAS</span>
          <span className="marquee-sep" />
          <span>ARTES OFICIAIS ESTILO GRAPHIC NOVEL</span>
          <span className="marquee-sep" />
          <span>EM BATALHA, NÃO HÁ IGUAIS</span>
          <span className="marquee-sep" />
          <span style={{ color: '#f5c542' }}>SISTEMA DBT — DECK-BUILDING COM TABULEIRO</span>
          <span className="marquee-sep" />
          <span>MEDUSA × REI ARTHUR × ALICE × SINBAD × PÉ-GRANDE × ROBIN HOOD</span>
        </div>
      </div>

      {/* ---------- FIGHTER ROSTER & DYNAMIC DOSSIER ---------- */}
      <section id="lutadores" className="section">
        <div className="container">
          <div className="section-header" data-reveal="">
            <div>
              <span className="eyebrow" style={{ color: '#e63946' }}>
                Elenco Completo • Beta 2.0 (6 Heróis Jogáveis)
              </span>
              <h2 className="comic-title section-heading">ESCOLHA SEU LUTADOR LENDÁRIO</h2>
            </div>
            <p className="section-subtitle">
              Cada personagem possui estilo de combate único, ajudantes na arena e um baralho completo
              com <strong style={{ color: 'var(--text-main)' }}>cartas oficiais em PT-BR</strong>.
              Passe o mouse sobre as cartas para ver o efeito 3D!
            </p>
          </div>

          {/* 6-Hero Character Select Strip */}
          <div className="fighters-grid" style={{ marginBottom: '2.2rem' }} data-reveal="delay-1">
            {FIGHTERS.map((fighter) => {
              const active = selectedFighter.id === fighter.id;
              return (
                <button
                  key={fighter.id}
                  type="button"
                  onClick={() => handleSelectHero(fighter, false, false)}
                  className={`fighter-select-card ${active ? 'selected' : ''}`}
                  style={{ '--f-color': fighter.color, '--f-glow': fighter.accentGlow }}
                >
                  <div className="fighter-select-art">
                    <img src={fighter.image} alt={`Retrato oficial de ${fighter.name}`} />
                    <span className="fighter-select-hp" title="Vida Inicial">
                      {fighter.hp}
                    </span>
                  </div>
                  <div className="fighter-select-meta">
                    <div className="fighter-select-name">{fighter.name}</div>
                    <div className="fighter-select-sub">
                      {fighter.range} • MOV {fighter.move}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Dynamic-Aura Fighter Dossier */}
          <div
            id="ficha-lutador"
            key={selectedFighter.id}
            className="fighter-dossier"
            style={{
              '--fighter-color': selectedFighter.color,
              '--fighter-soft': selectedFighter.accentSoft,
              '--fighter-glow': selectedFighter.accentGlow,
            }}
          >
            <div className="dossier-header">
              <div>
                <span
                  className="mono"
                  style={{ fontSize: '0.74rem', fontWeight: 700, color: selectedFighter.color, letterSpacing: '0.1em' }}
                >
                  FICHA TÁTICA • {selectedFighter.collection.toUpperCase()}
                </span>
                <h3 className="comic-title" style={{ fontSize: 'clamp(2rem, 3.8vw, 2.9rem)', margin: '0.2rem 0 0' }}>
                  {selectedFighter.name}{' '}
                  <span style={{ color: 'var(--text-muted)', fontWeight: 700 }}>— {selectedFighter.subtitle}</span>
                </h3>
              </div>

              <div style={{ display: 'flex', gap: '0.55rem', flexWrap: 'wrap' }}>
                <span className="stat-pill" style={{ borderColor: 'rgba(230, 57, 70, 0.45)' }}>
                  <Heart size={14} color="#e63946" /> VIDA {selectedFighter.hp}
                </span>
                <span className="stat-pill" style={{ borderColor: 'rgba(36, 209, 255, 0.4)' }}>
                  <Footprints size={14} color="#24d1ff" /> MOV {selectedFighter.move}
                </span>
                <span className="stat-pill" style={{ borderColor: selectedFighter.color }}>
                  <Target size={14} color={selectedFighter.color} /> {selectedFighter.range}
                </span>
              </div>
            </div>

            <div className="dossier-body">
              {/* Left Column: Portrait + Special Ability + Sidekick + Quote */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                <div className="dossier-portrait-card">
                  <img src={selectedFighter.image} alt={`Ilustração oficial de ${selectedFighter.name}`} />
                </div>

                <div
                  style={{
                    padding: '1.2rem 1.3rem',
                    borderRadius: '14px',
                    background: 'rgba(6, 10, 18, 0.78)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <div
                    className="mono"
                    style={{
                      color: selectedFighter.color,
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      letterSpacing: '0.1em',
                      marginBottom: '0.35rem',
                    }}
                  >
                    HABILIDADE ESPECIAL
                  </div>
                  <div className="comic-title" style={{ fontSize: '1.7rem', marginBottom: '0.45rem' }}>
                    {selectedFighter.abilityTitle}
                  </div>
                  <p style={{ margin: 0, lineHeight: 1.6, color: 'var(--text-soft)', fontSize: '0.94rem' }}>
                    {selectedFighter.abilityText}
                  </p>
                </div>

                <div
                  style={{
                    padding: '0.95rem 1.2rem',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <div className="mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                    AJUDANTE(S) NA ARENA
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>
                    {selectedFighter.sidekick}
                  </div>
                </div>

                <div className="quote-box">{selectedFighter.quote}</div>
              </div>

              {/* Right Column: 3 Highlight 3D Tilt Cards + Full Deck Toggle */}
              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                    marginBottom: '1rem',
                  }}
                >
                  <span className="mono" style={{ fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.06em' }}>
                    DESTAQUES DO BARALHO DE {selectedFighter.name}
                  </span>
                  <span
                    className="mono"
                    style={{
                      fontSize: '0.74rem',
                      color: 'var(--text-muted)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                    }}
                  >
                    <ZoomIn size={14} color={selectedFighter.color} /> Clique para inspecionar em tela cheia
                  </span>
                </div>

                <div
                  className="grid-3-col"
                  style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.1rem' }}
                >
                  {selectedFighter.cards.map((c, idx) => (
                    <TiltCard
                      key={c.name}
                      onClick={() => openCardLightbox(selectedFighter.cards, idx)}
                      title={`Ampliar carta ${c.name}`}
                      accentColor={selectedFighter.color}
                    >
                      <img src={c.image} alt={`Carta oficial BRMatched: ${c.name}`} />
                    </TiltCard>
                  ))}
                </div>

                <div style={{ marginTop: '1.3rem' }}>
                  <button
                    type="button"
                    onClick={() => setShowFullDeck((v) => !v)}
                    className={`comic-btn ${showFullDeck ? 'comic-btn-dark' : 'comic-btn-yellow'}`}
                    style={{ width: '100%' }}
                  >
                    <Layers size={19} />
                    {showFullDeck
                      ? `OCULTAR BARALHO COMPLETO DE ${selectedFighter.name}`
                      : `EXPLORAR TODAS AS ${fullDeck.length} CARTAS DE ${selectedFighter.name}`}
                  </button>
                </div>
              </div>
            </div>

            {/* EXPANDED COMPLETE DECK GALLERY */}
            {showFullDeck && fullDeck.length > 0 && (
              <div
                style={{
                  borderTop: '1px solid var(--border-subtle)',
                  background: 'rgba(5, 8, 15, 0.72)',
                  padding: '1.8rem',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '0.8rem',
                    marginBottom: '1.4rem',
                  }}
                >
                  <div>
                    <span className="eyebrow" style={{ color: selectedFighter.color }}>
                      Baralho Completo • {fullDeck.length} Cartas Únicas
                    </span>
                    <h4 className="comic-title" style={{ fontSize: '2.1rem', margin: '0.25rem 0 0' }}>
                      TODAS AS CARTAS DE {selectedFighter.name} (PT-BR)
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowFullDeck(false)}
                    className="comic-btn comic-btn-sm comic-btn-white"
                  >
                    <X size={15} /> Recolher Galeria
                  </button>
                </div>

                <div className="deck-gallery-grid">
                  {fullDeck.map((card, idx) => (
                    <TiltCard
                      key={card.id}
                      onClick={() =>
                        openCardLightbox(
                          fullDeck.map((fc) => ({ name: fc.label, image: fc.image })),
                          idx
                        )
                      }
                      title={`Ampliar carta ${card.label}`}
                      accentColor={selectedFighter.color}
                    >
                      <img
                        src={card.image}
                        alt={`Carta oficial de ${selectedFighter.name}: ${card.label}`}
                        loading="lazy"
                      />
                    </TiltCard>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Upcoming Expansion Teaser */}
          <div
            className="comic-panel halftone-dark"
            data-reveal=""
            style={{
              marginTop: '1.6rem',
              padding: '1.25rem 1.6rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
              <span className="comic-tag" style={{ background: '#f5c542', color: '#08101a' }}>
                PRÓXIMA EXPANSÃO
              </span>
              <span style={{ color: 'var(--text-soft)', fontSize: '0.95rem' }}>
                <strong style={{ color: 'var(--text-main)' }}>Em desenvolvimento pós-Beta 2.0:</strong>{' '}
                Drácula, Sherlock Holmes, Homem Invisível, Jekyll &amp; Hyde, Beowulf e Chapeuzinho Vermelho.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- OFFICIAL ARENAS SHOWCASE ---------- */}
      <ArenasSection />

      {/* ---------- RULES (3 ACTIONS) + CARD ANATOMY ---------- */}
      <section id="regras" className="section halftone-yellow rules-band">
        <div className="container">
          <div style={{ marginBottom: '2.6rem', textAlign: 'center' }} data-reveal="">
            <span className="eyebrow" style={{ justifyContent: 'center' }}>
              Sistema DBT — Deck-Building com Tabuleiro
            </span>
            <h2 className="comic-title section-heading">2 AÇÕES POR TURNO. INFINITAS ESTRATÉGIAS.</h2>
            <p
              style={{
                maxWidth: '62ch',
                margin: '0.85rem auto 0',
                fontSize: '1.02rem',
                lineHeight: 1.62,
                color: 'var(--text-soft)',
              }}
            >
              No <strong style={{ color: '#f5c542' }}>Sistema DBT</strong> do BRMatched, cada rodada
              combina gestão de mão, leitura de blefes e posicionamento tático em arenas de zonas
              coloridas.
            </p>
          </div>

          {/* 3 Actions */}
          <div
            className="grid-3-col"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.35rem', marginBottom: '2rem' }}
            data-reveal="delay-1"
          >
            {ACTION_STEPS.map((step) => {
              const Icon = step.icon;
              return (
                <article
                  key={step.num}
                  className="action-step-card"
                  style={{ '--step-color': step.color }}
                >
                  <span className="action-step-num" aria-hidden="true">
                    {step.num}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', marginBottom: '0.85rem' }}>
                    <span
                      style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '9px',
                        background: `${step.color}20`,
                        border: `1px solid ${step.color}66`,
                        color: step.color,
                        display: 'grid',
                        placeItems: 'center',
                      }}
                    >
                      <Icon size={18} />
                    </span>
                    <span className="mono" style={{ fontSize: '0.72rem', fontWeight: 700, color: step.color }}>
                      {step.tag}
                    </span>
                  </div>
                  <h3 className="comic-title" style={{ fontSize: '1.85rem', margin: '0 0 0.55rem' }}>
                    {step.title}
                  </h3>
                  <p style={{ margin: 0, lineHeight: 1.6, color: 'var(--text-soft)', fontSize: '0.94rem' }}>
                    {step.text}
                  </p>
                </article>
              );
            })}
          </div>

          {/* 4 Card Types Legend */}
          <div className="cards-grid" style={{ marginBottom: '2rem' }} data-reveal="delay-2">
            {CARD_TYPES.map((ct) => {
              const Icon = ct.icon;
              return (
                <div
                  key={ct.name}
                  className="card-type-pill"
                  style={{ '--type-color': ct.color }}
                >
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      padding: '0.32rem 0.78rem',
                      borderRadius: '8px',
                      background: `${ct.color}22`,
                      color: ct.color,
                      border: `1px solid ${ct.color}66`,
                      fontFamily: 'var(--font-display)',
                      fontWeight: 800,
                      fontStyle: 'italic',
                      fontSize: '1.2rem',
                      letterSpacing: '0.04em',
                      marginBottom: '0.65rem',
                    }}
                  >
                    <Icon size={16} /> {ct.name}
                  </div>
                  <p style={{ margin: 0, fontSize: '0.88rem', lineHeight: 1.55, color: 'var(--text-soft)' }}>
                    {ct.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Conversion CTA driving visitors to download the PC game */}
          <div
            data-reveal=""
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1.2rem',
              padding: '1.35rem 1.7rem',
              borderRadius: '16px',
              background: 'rgba(8, 14, 24, 0.85)',
              border: '1px solid rgba(16, 216, 118, 0.3)',
            }}
          >
            <div>
              <div className="comic-title" style={{ fontSize: '1.7rem', color: '#f4f1ea', margin: '0 0 0.25rem' }}>
                PRONTO PARA TESTAR ESSAS ESTRATÉGIAS NA ARENA?
              </div>
              <p style={{ margin: 0, color: 'var(--text-soft)', fontSize: '0.94rem' }}>
                Baixe o <strong style={{ color: '#f5c542' }}>BRMatched Beta 2.0</strong> grátis para
                Windows PC e jogue partidas completas com os 6 heróis, mapas oficiais e trilha sonora!
              </p>
            </div>
            {latest ? (
              <button
                type="button"
                onClick={handleQuickDownload}
                className="comic-btn comic-btn-emerald"
              >
                <Download size={19} strokeWidth={2.75} />
                BAIXAR E TESTAR NO PC
              </button>
            ) : (
              <Link to="/downloads" className="comic-btn comic-btn-emerald">
                <Download size={19} strokeWidth={2.75} />
                BAIXAR E TESTAR NO PC
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* ---------- DOWNLOAD SPOTLIGHT + WINDOWS REQUIREMENTS ---------- */}
      <section className="section">
        <div className="container">
          <div
            className="comic-panel halftone-cyan"
            data-reveal=""
            style={{ padding: 'clamp(1.6rem, 3.5vw, 2.8rem)' }}
          >
            <div
              className="grid-2-col"
              style={{ display: 'grid', gridTemplateColumns: '1.15fr 0.85fr', gap: '2.2rem', alignItems: 'center' }}
            >
              <div>
                <span className="eyebrow" style={{ color: '#10d876' }}>
                  <Monitor size={13} /> Download Oficial Windows PC
                </span>
                <h2 className="comic-title section-heading" style={{ marginBottom: '0.85rem' }}>
                  BAIXE O BRMATCHED AGORA!
                </h2>
                <p style={{ fontSize: '1.03rem', lineHeight: 1.65, color: 'var(--text-soft)', margin: '0 0 1.6rem' }}>
                  {latest
                    ? `Versão atual: ${latest.version} — "${latest.title}". Todos os 6 heróis jogáveis (Medusa, Rei Arthur, Alice, Sinbad, Pé-Grande e Robin Hood) com cartas oficiais em PT-BR prontos para Windows 10 e 11.`
                    : 'Baixe a build mais recente do BRMatched para Windows PC com atualizações diretas pelo portal.'}
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem', alignItems: 'center' }}>
                  {latest ? (
                    <button
                      type="button"
                      onClick={handleQuickDownload}
                      className="comic-btn comic-btn-lg comic-btn-emerald"
                    >
                      <Download size={21} strokeWidth={2.75} />
                      BAIXAR {latest.version} ({formatBytes(latest.file_size)})
                    </button>
                  ) : null}
                  <Link to="/downloads" className="comic-btn comic-btn-white">
                    TODAS AS VERSÕES &amp; PATCH NOTES
                  </Link>
                </div>
              </div>

              <div
                style={{
                  padding: '1.5rem',
                  borderRadius: '14px',
                  background: 'rgba(6, 10, 18, 0.78)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <h3 className="comic-title" style={{ fontSize: '1.65rem', margin: '0 0 1.1rem', color: '#f5c542' }}>
                  REQUISITOS DO PC (WINDOWS)
                </h3>
                <ul
                  style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.85rem',
                    color: 'var(--text-soft)',
                    fontSize: '0.94rem',
                  }}
                >
                  <li style={{ display: 'flex', gap: '0.7rem', alignItems: 'center', fontWeight: 600 }}>
                    <Monitor size={18} color="#24d1ff" style={{ flexShrink: 0 }} />
                    <span>SO: Windows 10 ou Windows 11 (64-bit)</span>
                  </li>
                  <li style={{ display: 'flex', gap: '0.7rem', alignItems: 'center', fontWeight: 600 }}>
                    <Cpu size={18} color="#24d1ff" style={{ flexShrink: 0 }} />
                    <span>CPU: Intel Core i3 / AMD Ryzen 3 ou superior</span>
                  </li>
                  <li style={{ display: 'flex', gap: '0.7rem', alignItems: 'center', fontWeight: 600 }}>
                    <HardDrive size={18} color="#24d1ff" style={{ flexShrink: 0 }} />
                    <span>Memória: 4 GB RAM • 500 MB livres em disco</span>
                  </li>
                  <li style={{ display: 'flex', gap: '0.7rem', alignItems: 'center', fontWeight: 600 }}>
                    <CheckCircle2 size={18} color="#10d876" style={{ flexShrink: 0 }} />
                    <span>Integridade verificada com hash SHA-256 oficial</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- DEVLOG COMIC ISSUES ---------- */}
      <section id="devlog" className="section" style={{ paddingTop: '1rem' }}>
        <div className="container">
          <div className="section-header" data-reveal="">
            <div>
              <span className="eyebrow">Diário do Desenvolvedor</span>
              <h2 className="comic-title section-heading">ÚLTIMAS EDIÇÕES DO DEVLOG</h2>
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
                Reportar Bug ou Ideia <ArrowRight size={15} />
              </a>
            ) : null}
          </div>

          <div
            className="grid-3-col"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.4rem' }}
            data-reveal="delay-1"
          >
            {posts.map((post) => (
              <article
                key={post.id}
                className="comic-panel comic-panel-hover"
                style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.9rem' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="comic-tag" style={{ background: '#24d1ff', color: '#041320' }}>
                    {post.tag}
                  </span>
                  <span className="mono" style={{ fontWeight: 700, fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                    EDIÇÃO #{String(post.issue_number).padStart(2, '0')}
                  </span>
                </div>

                <h3 className="comic-title" style={{ fontSize: '1.7rem', margin: 0, lineHeight: 1.05 }}>
                  {post.title}
                </h3>

                <p style={{ margin: 0, lineHeight: 1.6, color: 'var(--text-soft)', flex: 1, fontSize: '0.94rem' }}>
                  {post.summary}
                </p>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '0.9rem',
                    borderTop: '1px solid var(--border-subtle)',
                  }}
                >
                  <span className="mono" style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {formatDateBR(post.created_at)}
                  </span>
                  <button
                    type="button"
                    onClick={() => setActivePost(post)}
                    className="comic-btn comic-btn-sm comic-btn-yellow"
                  >
                    Ler Edição
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- DONATE / APOIE VIA PIX ---------- */}
      <DonateSection />

      {/* ---------- MEMBERS CLUB CTA ---------- */}
      <section className="section" style={{ paddingTop: '1.5rem' }}>
        <div className="container">
          <div
            className="comic-panel halftone-dark"
            data-reveal=""
            style={{ padding: 'clamp(2rem, 4.5vw, 3.4rem)', textAlign: 'center' }}
          >
            <span className="eyebrow" style={{ color: '#e63946', justifyContent: 'center' }}>
              Clube de Duelistas BRMatched
            </span>
            <h2
              className="comic-title comic-outline"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 4.2rem)', margin: '0.5rem 0 0.9rem' }}
            >
              FAÇA PARTE DO <span style={{ color: '#f5c542' }}>CLUBE BRMATCHED</span>
            </h2>
            <p
              style={{
                maxWidth: '58ch',
                margin: '0 auto 1.8rem',
                color: 'var(--text-soft)',
                lineHeight: 1.65,
                fontSize: '1.02rem',
              }}
            >
              Crie sua conta gratuita para baixar builds antecipadas, personalizar seu Cartão de
              Duelista, acompanhar os bastidores do Beta 2.0 e enviar ideias direto ao criador.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.95rem', flexWrap: 'wrap' }}>
              {IS_STATIC_SITE ? (
                <>
                  <Link to="/downloads" className="comic-btn comic-btn-lg comic-btn-emerald">
                    <Download size={21} />
                    BAIXAR BETA 2.0 GRÁTIS
                  </Link>
                  {issuesUrl && (
                    <a
                      href={issuesUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="comic-btn comic-btn-lg comic-btn-white"
                    >
                      ENVIAR FEEDBACK &amp; IDEIAS
                    </a>
                  )}
                </>
              ) : user ? (
                <Link to="/dashboard" className="comic-btn comic-btn-lg comic-btn-emerald">
                  <Users size={21} />
                  ACESSAR MEU DASHBOARD
                </Link>
              ) : (
                <>
                  <Link to="/cadastro" className="comic-btn comic-btn-lg comic-btn-emerald">
                    CRIAR CONTA GRÁTIS
                  </Link>
                  <Link to="/login" className="comic-btn comic-btn-lg comic-btn-white">
                    JÁ TENHO CONTA
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- FULL-SIZE CARD LIGHTBOX ---------- */}
      {lightboxState && lightboxState.cards[lightboxState.index] && (
        <div
          role="dialog"
          aria-modal="true"
          className="modal-backdrop"
          onClick={() => setLightboxState(null)}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '440px',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem',
            }}
          >
            <div className="mono" style={{ fontSize: '0.82rem', color: '#f5c542', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              {lightboxState.cards[lightboxState.index].name}
            </div>

            <img
              src={lightboxState.cards[lightboxState.index].image}
              alt={`Carta ampliada: ${lightboxState.cards[lightboxState.index].name}`}
              style={{
                width: '100%',
                maxHeight: '74vh',
                objectFit: 'contain',
                borderRadius: '18px',
                border: '2px solid rgba(244, 241, 234, 0.4)',
                boxShadow: '0 28px 64px rgba(0, 0, 0, 0.9)',
              }}
            />

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              {lightboxState.cards.length > 1 && (
                <button
                  type="button"
                  aria-label="Carta anterior"
                  className="comic-btn comic-btn-sm comic-btn-white"
                  onClick={() =>
                    setLightboxState((prev) =>
                      prev
                        ? { ...prev, index: (prev.index - 1 + prev.cards.length) % prev.cards.length }
                        : null
                    )
                  }
                >
                  <ChevronLeft size={17} /> Anterior
                </button>
              )}

              <span className="stat-pill">
                {lightboxState.index + 1} / {lightboxState.cards.length}
              </span>

              {lightboxState.cards.length > 1 && (
                <button
                  type="button"
                  aria-label="Próxima carta"
                  className="comic-btn comic-btn-sm comic-btn-white"
                  onClick={() =>
                    setLightboxState((prev) =>
                      prev ? { ...prev, index: (prev.index + 1) % prev.cards.length } : null
                    )
                  }
                >
                  Próxima <ChevronRight size={17} />
                </button>
              )}

              <button
                type="button"
                aria-label="Fechar"
                className="comic-btn comic-btn-sm comic-btn-yellow"
                onClick={() => setLightboxState(null)}
              >
                <X size={15} /> Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------- DEVLOG READER MODAL ---------- */}
      {activePost && (
        <div
          role="dialog"
          aria-modal="true"
          className="modal-backdrop"
          onClick={() => setActivePost(null)}
        >
          <div
            className="comic-panel modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '680px',
              width: '100%',
              padding: '2rem',
              maxHeight: '85vh',
              overflowY: 'auto',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span className="comic-tag" style={{ background: '#f5c542', color: '#08101a' }}>
                {activePost.tag} • EDIÇÃO #{String(activePost.issue_number).padStart(2, '0')}
              </span>
              <button
                type="button"
                aria-label="Fechar"
                className="comic-btn comic-btn-sm comic-btn-magenta"
                onClick={() => setActivePost(null)}
              >
                <X size={15} /> Fechar
              </button>
            </div>
            <h3 className="comic-title" style={{ fontSize: '2.3rem', margin: '0 0 0.7rem', color: '#f5c542' }}>
              {activePost.title}
            </h3>
            <p className="mono" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Por {activePost.author} • {formatDateBR(activePost.created_at)}
            </p>
            <p style={{ fontSize: '1.03rem', lineHeight: 1.78, whiteSpace: 'pre-line', margin: 0, color: 'var(--text-soft)' }}>
              {activePost.content}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
