import { useState } from 'react';
import { Compass, MapPin, Shield, Swords, Users, ZoomIn, X } from 'lucide-react';
import { assetUrl } from '../utils/assets';

const ARENAS = [
  {
    id: 'sherwood',
    name: 'FLORESTA DE SHERWOOD',
    collection: 'Beta 2.0 • Robin Hood vs Pé-Grande',
    image: assetUrl('/images/arenas/sherwood.jpg'),
    color: '#43B54B',
    zones: '5 Zonas',
    players: '2 Jogadores',
    style: 'Emboscadas & Flanqueamento',
    description:
      'Trilhas fechadas sob a copa densa de Sherwood. Espaços multi-zona no centro criam pontos perfeitos para ataques à distância, recuos táticos e cercos com ajudantes.',
  },
  {
    id: 'marmoreal',
    name: 'MARMOREAL',
    collection: 'Beta 2.0 • Batalha das Lendas Vol. 1',
    image: assetUrl('/images/arenas/marmoreal.jpg'),
    color: '#e879a9',
    zones: '7 Zonas',
    players: '2 a 4 Jogadores',
    style: 'Jardins & Passagens Elevadas',
    description:
      'Pátio clássico cercado por cerejeiras e escadarias. Suas 7 zonas coloridas oferecem múltiplas rotas de fuga e grandes duelos táticos tanto em 1v1 quanto em batalhas para 4 jogadores.',
  },
  {
    id: 'sarpedon',
    name: 'SARPEDON',
    collection: 'Beta 2.0 • Batalha das Lendas Vol. 1',
    image: assetUrl('/images/arenas/sarpedon.jpg'),
    color: '#24d1ff',
    zones: '6 Zonas',
    players: '2 a 4 Jogadores',
    style: 'Ilha Grega & Convés do Navio',
    description:
      'Uma arena dividida entre ruínas mitológicas à beira-mar e o convés de um navio corsário. Controlar as pontes de areia e água decide quem domina o ritmo da partida!',
  },
  {
    id: 'yukon',
    name: 'YUKON',
    collection: 'Beta 2.0 • Robin Hood vs Pé-Grande',
    image: assetUrl('/images/arenas/yukon.jpg'),
    color: '#FF7A18',
    zones: '6 Zonas',
    players: '2 Jogadores',
    style: 'Desfiladeiro de Outono',
    description:
      'Terreno acidentado cercado por rochas e folhagem outonal. Ideal para combates intensos corpo a corpo e controle de zonas isoladas para comprar cartas extras.',
  },
];

export default function ArenasSection() {
  const [activeArena, setActiveArena] = useState(ARENAS[0]);
  const [zoomed, setZoomed] = useState(false);

  return (
    <section id="arenas" className="section">
      <div className="container">
        <div className="section-header" data-reveal="">
          <div>
            <span className="eyebrow" style={{ color: '#24d1ff' }}>
              <Compass size={13} /> Tabuleiros Oficiais • Beta 2.0
            </span>
            <h2 className="comic-title section-heading">ARENAS DE BATALHA ILUSTRADAS</h2>
          </div>
          <p className="section-subtitle">
            O lado <strong style={{ color: 'var(--text-main)' }}>Tabuleiro</strong> do Sistema DBT:
            cada espaço colorido define linhas de visão, alcance de ataques à distância e zonas de
            habilidades especiais.
          </p>
        </div>

        <div
          className="fighter-dossier"
          key={activeArena.id}
          style={{
            '--fighter-color': activeArena.color,
            '--fighter-soft': `${activeArena.color}28`,
            '--fighter-glow': `${activeArena.color}55`,
          }}
          data-reveal="delay-1"
        >
          {/* Top Arena Switcher Bar */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.55rem',
              padding: '1.15rem 1.5rem',
              borderBottom: '1px solid var(--border-subtle)',
              background: 'rgba(6, 10, 17, 0.55)',
            }}
          >
            {ARENAS.map((arena) => {
              const isSelected = arena.id === activeArena.id;
              return (
                <button
                  key={arena.id}
                  type="button"
                  onClick={() => setActiveArena(arena)}
                  className={`comic-btn comic-btn-sm ${isSelected ? 'comic-btn-yellow' : 'comic-btn-white'}`}
                  style={
                    isSelected
                      ? { background: arena.color, color: '#060a11', borderColor: '#f4f1ea' }
                      : undefined
                  }
                >
                  <MapPin size={14} />
                  {arena.name}
                </button>
              );
            })}
          </div>

          <div
            className="grid-2-col"
            style={{
              display: 'grid',
              gridTemplateColumns: '1.25fr 0.75fr',
              gap: '1.8rem',
              padding: '1.6rem',
              alignItems: 'center',
            }}
          >
            {/* Interactive Full Map Preview */}
            <button
              type="button"
              onClick={() => setZoomed(true)}
              title={`Ampliar mapa ${activeArena.name}`}
              style={{
                position: 'relative',
                padding: 0,
                border: `2px solid ${activeArena.color}`,
                borderRadius: '14px',
                overflow: 'hidden',
                background: '#05080f',
                cursor: 'zoom-in',
                boxShadow: `0 24px 48px -18px rgba(0,0,0,0.9), 0 0 32px -12px ${activeArena.color}66`,
                display: 'block',
                width: '100%',
              }}
            >
              <img
                src={activeArena.image}
                alt={`Mapa oficial da arena ${activeArena.name} no BRMatched`}
                style={{ display: 'block', width: '100%', height: 'auto' }}
              />
              <span
                className="stat-pill"
                style={{
                  position: 'absolute',
                  bottom: '12px',
                  right: '12px',
                  background: 'rgba(4, 7, 13, 0.88)',
                  borderColor: activeArena.color,
                }}
              >
                <ZoomIn size={14} color={activeArena.color} /> Ampliar Mapa
              </span>
            </button>

            {/* Arena Tactical Info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <span
                  className="mono"
                  style={{ fontSize: '0.73rem', fontWeight: 700, color: activeArena.color, letterSpacing: '0.09em' }}
                >
                  {activeArena.collection.toUpperCase()}
                </span>
                <h3 className="comic-title" style={{ fontSize: 'clamp(2rem, 3.4vw, 2.7rem)', margin: '0.25rem 0 0' }}>
                  {activeArena.name}
                </h3>
              </div>

              <p style={{ margin: 0, color: 'var(--text-soft)', lineHeight: 1.65, fontSize: '0.96rem' }}>
                {activeArena.description}
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.55rem' }}>
                <span className="stat-pill">
                  <Compass size={14} color={activeArena.color} /> {activeArena.zones}
                </span>
                <span className="stat-pill">
                  <Users size={14} color="#f5c542" /> {activeArena.players}
                </span>
              </div>

              <div
                style={{
                  padding: '0.95rem 1.15rem',
                  borderRadius: '12px',
                  background: 'rgba(6, 10, 18, 0.72)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div className="mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                  DESTAQUE TÁTICO
                </div>
                <div style={{ fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <Swords size={15} color={activeArena.color} />
                  {activeArena.style}
                </div>
              </div>

              {/* Mini thumbnail selector */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                {ARENAS.map((a) => {
                  const sel = a.id === activeArena.id;
                  return (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => setActiveArena(a)}
                      title={a.name}
                      style={{
                        padding: 0,
                        borderRadius: '8px',
                        overflow: 'hidden',
                        border: sel ? `2px solid ${a.color}` : '1px solid rgba(255,255,255,0.14)',
                        opacity: sel ? 1 : 0.58,
                        cursor: 'pointer',
                        background: '#05080f',
                        aspectRatio: '16 / 10',
                      }}
                    >
                      <img
                        src={a.image}
                        alt={a.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                    </button>
                  );
                })}
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.82rem',
                  color: 'var(--text-muted)',
                }}
              >
                <Shield size={15} color="#10d876" style={{ flexShrink: 0 }} />
                Todas as 4 arenas já vêm desbloqueadas gratuitamente no Beta 2.0!
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Map Lightbox */}
      {zoomed && (
        <div
          role="dialog"
          aria-modal="true"
          className="modal-backdrop"
          onClick={() => setZoomed(false)}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '1040px',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.9rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              <span className="comic-title" style={{ fontSize: '1.8rem', color: activeArena.color }}>
                {activeArena.name} — {activeArena.zones}
              </span>
              <button
                type="button"
                onClick={() => setZoomed(false)}
                className="comic-btn comic-btn-sm comic-btn-yellow"
              >
                <X size={15} /> Fechar
              </button>
            </div>
            <img
              src={activeArena.image}
              alt={`Mapa ampliado: ${activeArena.name}`}
              style={{
                width: '100%',
                maxHeight: '80vh',
                objectFit: 'contain',
                borderRadius: '16px',
                border: `2px solid ${activeArena.color}`,
                boxShadow: '0 28px 64px rgba(0, 0, 0, 0.92)',
              }}
            />
          </div>
        </div>
      )}
    </section>
  );
}
