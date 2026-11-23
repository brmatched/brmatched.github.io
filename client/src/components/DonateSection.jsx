import { useState } from 'react';
import { Check, Coffee, Copy, Heart, Palette, Server, Sparkles } from 'lucide-react';

export const PIX_KEY = '31992713847';
const MIN_DONATE = 10;

const SUPPORT_TIERS = [
  {
    value: 10,
    amount: 'R$ 10',
    label: 'Forja de Cartas',
    note: 'Ajuda na criação e revisão das novas cartas em estilo graphic novel PT-BR.',
  },
  {
    value: 25,
    amount: 'R$ 25',
    label: 'Apoio Lendário',
    note: 'Impulsiona a chegada dos próximos heróis (Drácula, Sherlock, Beowulf e mais!).',
  },
  {
    value: 50,
    amount: 'R$ 50',
    label: 'Mecenas da Arena',
    note: 'Ajuda a cobrir servidor, novas arenas ilustradas e trilha sonora original!',
  },
  {
    value: 100,
    amount: 'R$ 100',
    label: 'Patrono Mítico',
    note: 'Acelera expansões inteiras e garante o BRMatched sempre gratuito para todos!',
  },
];

function getTierDescription(numericValue) {
  if (Number.isNaN(numericValue) || numericValue < MIN_DONATE) {
    return null;
  }
  if (numericValue >= 100) return SUPPORT_TIERS[3];
  if (numericValue >= 50) return SUPPORT_TIERS[2];
  if (numericValue >= 25) return SUPPORT_TIERS[1];
  return SUPPORT_TIERS[0];
}

export function DonateBannerCompact() {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard?.writeText(PIX_KEY).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    });
  }

  return (
    <div
      className="comic-panel halftone-dark"
      style={{
        marginTop: '2.4rem',
        padding: '1.35rem 1.65rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.1rem',
        borderColor: 'rgba(245, 197, 66, 0.3)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', flexWrap: 'wrap' }}>
        <span
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'rgba(230, 36, 41, 0.16)',
            border: '1px solid rgba(230, 36, 41, 0.45)',
            color: '#ff5a60',
            display: 'grid',
            placeItems: 'center',
            flexShrink: 0,
          }}
        >
          <Heart size={21} fill="currentColor" />
        </span>
        <div>
          <div className="comic-title" style={{ fontSize: '1.55rem', color: '#f5c542', margin: 0 }}>
            CURTIU O BRMATCHED? APOIE O DESENVOLVIMENTO VIA PIX!
          </div>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-soft)', marginTop: '0.2rem' }}>
            O jogo é 100% gratuito. Doe qualquer valor a partir de <strong style={{ color: '#f5c542' }}>R$ 10</strong> para ajudar em novos heróis, cartas e servidores.
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
        <span className="stat-pill" style={{ borderColor: 'rgba(245, 197, 66, 0.45)', color: '#f5c542' }}>
          PIX: {PIX_KEY}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className={`comic-btn comic-btn-sm ${copied ? 'comic-btn-emerald' : 'comic-btn-yellow'}`}
        >
          {copied ? <Check size={15} /> : <Copy size={15} />}
          {copied ? 'PIX COPIADO!' : 'COPIAR PIX'}
        </button>
      </div>
    </div>
  );
}

export default function DonateSection() {
  const [customAmount, setCustomAmount] = useState('10');
  const [copied, setCopied] = useState(false);

  const parsedValue = Number(String(customAmount).replace(',', '.'));
  const isBelowMin = customAmount !== '' && (Number.isNaN(parsedValue) || parsedValue < MIN_DONATE);
  const activeTier = getTierDescription(parsedValue);

  function handleCopyPix() {
    navigator.clipboard?.writeText(PIX_KEY).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    });
  }

  return (
    <section id="apoiar" className="section" style={{ paddingTop: '1.5rem' }}>
      <div className="container">
        <div
          className="comic-panel halftone-dark"
          data-reveal=""
          style={{
            padding: 'clamp(1.7rem, 3.8vw, 2.8rem)',
            borderColor: 'rgba(245, 197, 66, 0.3)',
            overflow: 'hidden',
          }}
        >
          <div
            className="grid-2-col"
            style={{
              display: 'grid',
              gridTemplateColumns: '1.08fr 0.92fr',
              gap: '2.2rem',
              alignItems: 'center',
            }}
          >
            {/* Left Pitch */}
            <div>
              <span className="eyebrow" style={{ color: '#ff5a60' }}>
                <Heart size={13} fill="currentColor" /> Apoie o Desenvolvimento Indie
              </span>
              <h2 className="comic-title section-heading" style={{ marginBottom: '0.85rem' }}>
                AJUDE A EXPANDIR O{' '}
                <span className="hero-title-accent">BRMATCHED!</span>
              </h2>
              <p
                style={{
                  fontSize: '1.02rem',
                  lineHeight: 1.65,
                  color: 'var(--text-soft)',
                  margin: '0 0 1.45rem',
                  maxWidth: '52ch',
                }}
              >
                O <strong style={{ color: 'var(--text-main)' }}>BRMatched</strong> é um projeto
                independente brasileiro feito com paixão e distribuído gratuitamente para Windows PC.
                Você pode apoiar com <strong style={{ color: '#f5c542' }}>qualquer valor a partir de R$ 10</strong>{' '}
                via <strong style={{ color: '#10d876' }}>PIX</strong> — tudo vai direto para o desenvolvimento!
              </p>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                  gap: '0.75rem',
                }}
              >
                <div
                  style={{
                    padding: '0.85rem 0.9rem',
                    borderRadius: '12px',
                    background: 'rgba(6, 10, 18, 0.72)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <Palette size={18} color="#f5c542" style={{ marginBottom: '0.4rem' }} />
                  <div style={{ fontWeight: 700, fontSize: '0.84rem', color: 'var(--text-main)' }}>
                    Novos Heróis
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                    Baralhos de 30 cartas PT-BR
                  </div>
                </div>

                <div
                  style={{
                    padding: '0.85rem 0.9rem',
                    borderRadius: '12px',
                    background: 'rgba(6, 10, 18, 0.72)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <Sparkles size={18} color="#24d1ff" style={{ marginBottom: '0.4rem' }} />
                  <div style={{ fontWeight: 700, fontSize: '0.84rem', color: 'var(--text-main)' }}>
                    Novas Arenas
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                    Mapas, áudio e efeitos
                  </div>
                </div>

                <div
                  style={{
                    padding: '0.85rem 0.9rem',
                    borderRadius: '12px',
                    background: 'rgba(6, 10, 18, 0.72)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <Server size={18} color="#10d876" style={{ marginBottom: '0.4rem' }} />
                  <div style={{ fontWeight: 700, fontSize: '0.84rem', color: 'var(--text-main)' }}>
                    100% Grátis
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                    Builds e servidores online
                  </div>
                </div>
              </div>
            </div>

            {/* Right Interactive PIX Card */}
            <div
              style={{
                padding: '1.55rem',
                borderRadius: '16px',
                background:
                  'radial-gradient(circle at 90% 10%, rgba(16, 216, 118, 0.14), transparent 50%), rgba(6, 10, 18, 0.88)',
                border: '1px solid rgba(16, 216, 118, 0.32)',
                boxShadow: '0 20px 44px -18px rgba(0, 0, 0, 0.85)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '0.5rem',
                  flexWrap: 'wrap',
                  marginBottom: '1rem',
                }}
              >
                <span className="comic-tag" style={{ background: '#10d876', color: '#04190e' }}>
                  <Coffee size={13} /> APOIO DIRETO VIA PIX
                </span>
                <span className="mono" style={{ fontSize: '0.72rem', color: '#f5c542', fontWeight: 700 }}>
                  VALOR LIVRE • MÍNIMO R$ 10
                </span>
              </div>

              {/* Quick suggestion pills */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
                  gap: '0.45rem',
                  marginBottom: '0.75rem',
                }}
              >
                {SUPPORT_TIERS.map((tier) => {
                  const active = parsedValue === tier.value;
                  return (
                    <button
                      key={tier.value}
                      type="button"
                      onClick={() => setCustomAmount(String(tier.value))}
                      style={{
                        padding: '0.52rem 0.35rem',
                        borderRadius: '10px',
                        border: active
                          ? '1.5px solid #f5c542'
                          : '1px solid rgba(244, 241, 234, 0.14)',
                        background: active
                          ? 'rgba(245, 197, 66, 0.16)'
                          : 'rgba(255, 255, 255, 0.03)',
                        color: active ? '#f5c542' : 'var(--text-soft)',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 700,
                        fontSize: '0.84rem',
                        cursor: 'pointer',
                        transition: 'all 0.18s ease',
                      }}
                    >
                      {tier.amount}
                    </button>
                  );
                })}
              </div>

              {/* Custom free-amount input (min R$ 10) */}
              <div style={{ marginBottom: '0.85rem' }}>
                <label
                  htmlFor="donate-custom-amount"
                  className="mono"
                  style={{
                    display: 'block',
                    fontSize: '0.7rem',
                    color: 'var(--text-muted)',
                    marginBottom: '0.35rem',
                    letterSpacing: '0.07em',
                  }}
                >
                  ESCOLHA OU DIGITE QUALQUER VALOR (A PARTIR DE R$ 10)
                </label>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.15rem 0.85rem',
                    borderRadius: '10px',
                    background: '#070b13',
                    border: isBelowMin
                      ? '1.5px solid #e62429'
                      : '1.5px solid rgba(244, 241, 234, 0.16)',
                  }}
                >
                  <span className="mono" style={{ color: '#f5c542', fontWeight: 700, fontSize: '0.95rem' }}>
                    R$
                  </span>
                  <input
                    id="donate-custom-amount"
                    type="number"
                    min={MIN_DONATE}
                    step="1"
                    inputMode="decimal"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    placeholder="10"
                    style={{
                      width: '100%',
                      padding: '0.58rem 0',
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      color: '#f4f1ea',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 700,
                      fontSize: '1.05rem',
                    }}
                  />
                </div>
                {isBelowMin && (
                  <div style={{ color: '#ff7a80', fontSize: '0.78rem', fontWeight: 600, marginTop: '0.35rem' }}>
                    O valor mínimo para doação é R$ 10,00.
                  </div>
                )}
              </div>

              {activeTier && (
                <div
                  style={{
                    padding: '0.72rem 0.92rem',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-subtle)',
                    marginBottom: '1rem',
                    fontSize: '0.84rem',
                    color: 'var(--text-soft)',
                    lineHeight: 1.5,
                  }}
                >
                  <strong style={{ color: '#f5c542' }}>
                    {activeTier.label} (R$ {parsedValue.toFixed(2).replace('.', ',')}):
                  </strong>{' '}
                  {activeTier.note}
                </div>
              )}

              {/* PIX Key Box */}
              <div className="mono" style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.35rem', letterSpacing: '0.08em' }}>
                CHAVE PIX OFICIAL DO CRIADOR
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.75rem',
                  padding: '0.82rem 1rem',
                  borderRadius: '12px',
                  background: '#05080f',
                  border: copied
                    ? '1.5px solid #10d876'
                    : '1.5px solid rgba(245, 197, 66, 0.38)',
                  marginBottom: '0.9rem',
                  transition: 'border-color 0.2s ease',
                }}
              >
                <span
                  className="mono"
                  style={{
                    fontSize: 'clamp(1.05rem, 2.2vw, 1.32rem)',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    color: '#f4f1ea',
                    userSelect: 'all',
                  }}
                >
                  {PIX_KEY}
                </span>
                <span
                  className="mono"
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    color: '#10d876',
                    background: 'rgba(16, 216, 118, 0.12)',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '6px',
                  }}
                >
                  PIX
                </span>
              </div>

              <button
                type="button"
                disabled={isBelowMin}
                onClick={handleCopyPix}
                className={`comic-btn ${copied ? 'comic-btn-emerald' : 'comic-btn-yellow'}`}
                style={{ width: '100%' }}
              >
                {copied ? <Check size={19} strokeWidth={2.75} /> : <Copy size={18} />}
                {copied ? 'CHAVE PIX COPIADA! OBRIGADO PELO APOIO!' : `COPIAR CHAVE PIX (${PIX_KEY})`}
              </button>

              <p
                style={{
                  margin: '0.78rem 0 0',
                  fontSize: '0.78rem',
                  color: 'var(--text-muted)',
                  textAlign: 'center',
                  lineHeight: 1.5,
                }}
              >
                Abra o app do seu banco → <strong>Área Pix</strong> → <strong>Transferir</strong>,
                cole a chave e envie qualquer valor a partir de <strong>R$ 10</strong>. Muito obrigado!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
