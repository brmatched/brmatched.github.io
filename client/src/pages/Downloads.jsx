import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Check,
  Copy,
  Download,
  FileArchive,
  Monitor,
  ShieldCheck,
  Sparkles,
  Upload,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { DonateBannerCompact } from '../components/DonateSection';
import { api, formatBytes, formatDateBR } from '../services/api';

const CHANNEL_STYLE = {
  stable: { label: 'ESTÁVEL', bg: '#10d876', color: '#04190e' },
  beta: { label: 'BETA', bg: '#f5c542', color: '#08101a' },
  alpha: { label: 'ALPHA', bg: '#e62429', color: '#ffffff' },
};

export default function Downloads() {
  const { user } = useAuth();
  const [releases, setReleases] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);

  function loadReleases() {
    api
      .getReleases()
      .then((res) => setReleases(res.releases || []))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadReleases();
  }, []);

  const latest = releases.find((r) => r.is_latest) || releases[0];
  const filtered =
    filter === 'all' ? releases : releases.filter((r) => r.channel === filter);

  function handleDownload(release) {
    window.location.href = api.getDownloadUrl(release);
    setTimeout(loadReleases, 800);
  }

  function handleCopySha(release) {
    navigator.clipboard?.writeText(release.sha256 || '').then(() => {
      setCopiedId(release.id);
      setTimeout(() => setCopiedId(null), 1800);
    });
  }

  return (
    <div className="section" style={{ paddingTop: '3rem' }}>
      <div className="container">
        {/* Header */}
        <div className="section-header" style={{ marginBottom: '2.2rem' }}>
          <div>
            <span className="eyebrow" style={{ color: '#10d876' }}>
              <Monitor size={13} /> Central Oficial Windows PC (x64)
            </span>
            <h1 className="comic-title section-heading">BAIXAR BRMATCHED</h1>
          </div>

          {user?.role === 'admin' && (
            <Link to="/dashboard?tab=admin" className="comic-btn comic-btn-magenta">
              <Upload size={17} />
              Subir Nova Versão (.exe / .zip)
            </Link>
          )}
        </div>

        {/* Featured Latest Release */}
        {loading ? (
          <div className="comic-panel" style={{ padding: '2.4rem', textAlign: 'center', color: 'var(--text-soft)', fontWeight: 600 }}>
            Carregando versões disponíveis para Windows...
          </div>
        ) : latest ? (
          <div
            className="comic-panel halftone-yellow"
            style={{
              padding: 'clamp(1.5rem, 3vw, 2.4rem)',
              marginBottom: '2.8rem',
              borderColor: 'rgba(245, 197, 66, 0.35)',
            }}
          >
            <div
              className="grid-2-col"
              style={{ display: 'grid', gridTemplateColumns: '1.22fr 0.78fr', gap: '2.2rem', alignItems: 'start' }}
            >
              <div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.55rem', marginBottom: '0.95rem' }}>
                  <span className="comic-tag" style={{ background: '#10d876', color: '#04190e' }}>
                    <Sparkles size={13} /> RECOMENDADA
                  </span>
                  <span
                    className="comic-tag"
                    style={{
                      background: (CHANNEL_STYLE[latest.channel] || CHANNEL_STYLE.beta).bg,
                      color: (CHANNEL_STYLE[latest.channel] || CHANNEL_STYLE.beta).color,
                    }}
                  >
                    {(CHANNEL_STYLE[latest.channel] || CHANNEL_STYLE.beta).label}
                  </span>
                  <span className="stat-pill">{latest.version}</span>
                </div>

                <h2 className="comic-title" style={{ fontSize: 'clamp(2.1rem, 3.8vw, 2.9rem)', margin: '0 0 0.55rem', color: '#f5c542' }}>
                  {latest.title}
                </h2>

                <p className="mono" style={{ fontSize: '0.82rem', margin: '0 0 1.35rem', color: 'var(--text-soft)' }}>
                  {latest.platform} • {latest.file_name} • {formatBytes(latest.file_size)} •{' '}
                  {latest.download_count} downloads
                </p>

                <div
                  style={{
                    padding: '1.15rem 1.3rem',
                    borderRadius: '14px',
                    background: 'rgba(6, 10, 18, 0.78)',
                    border: '1px solid var(--border-subtle)',
                    marginBottom: '1.5rem',
                  }}
                >
                  <div className="mono" style={{ fontWeight: 700, fontSize: '0.76rem', marginBottom: '0.6rem', letterSpacing: '0.08em', color: '#24d1ff' }}>
                    NOVIDADES DESTA VERSÃO
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '1.2rem', lineHeight: 1.7, color: 'var(--text-soft)', fontSize: '0.95rem' }}>
                    {latest.changelog.split('\n').filter(Boolean).map((line, i) => (
                      <li key={i}>{line}</li>
                    ))}
                  </ul>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem', alignItems: 'center' }}>
                  <button
                    type="button"
                    onClick={() => handleDownload(latest)}
                    className="comic-btn comic-btn-lg comic-btn-emerald"
                  >
                    <Download size={22} strokeWidth={2.75} />
                    BAIXAR AGORA ({formatBytes(latest.file_size)})
                  </button>

                  {latest.sha256 && (
                    <button
                      type="button"
                      onClick={() => handleCopySha(latest)}
                      className="comic-btn comic-btn-sm comic-btn-white mono"
                      title="Copiar checksum SHA-256"
                    >
                      {copiedId === latest.id ? <Check size={15} color="#10d876" /> : <Copy size={15} />}
                      {copiedId === latest.id ? 'SHA-256 COPIADO!' : `SHA256: ${latest.sha256.slice(0, 12)}…`}
                    </button>
                  )}
                </div>
              </div>

              {/* Installation guide */}
              <div
                style={{
                  padding: '1.5rem',
                  borderRadius: '14px',
                  background: 'rgba(6, 10, 18, 0.78)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <h3 className="comic-title" style={{ fontSize: '1.65rem', margin: '0 0 1rem', color: '#f5c542' }}>
                  COMO INSTALAR NO WINDOWS
                </h3>
                <ol
                  style={{
                    margin: 0,
                    paddingLeft: '1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.85rem',
                    color: 'var(--text-soft)',
                    fontSize: '0.93rem',
                    lineHeight: 1.55,
                  }}
                >
                  <li>
                    Clique em <strong style={{ color: 'var(--text-main)' }}>Baixar Agora</strong> para salvar o pacote (<code>.zip</code> ou <code>.exe</code>).
                  </li>
                  <li>
                    Se for arquivo <code>.zip</code>, clique com o botão direito e escolha{' '}
                    <strong style={{ color: 'var(--text-main)' }}>Extrair Tudo</strong> em uma pasta.
                  </li>
                  <li>
                    Execute o instalador ou <code>BRMatched.exe</code>. Caso o Windows SmartScreen apareça por ser jogo indie, clique em <em>Mais informações → Executar assim mesmo</em>.
                  </li>
                </ol>
                <div
                  style={{
                    marginTop: '1.3rem',
                    padding: '0.85rem 1rem',
                    borderRadius: '10px',
                    background: 'rgba(16, 216, 118, 0.1)',
                    border: '1px solid rgba(16, 216, 118, 0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    fontSize: '0.84rem',
                    fontWeight: 600,
                    color: '#b7ffda',
                  }}
                >
                  <ShieldCheck size={20} color="#10d876" style={{ flexShrink: 0 }} />
                  Integridade garantida por hash SHA-256 gerado automaticamente no upload.
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="comic-panel" style={{ padding: '2.2rem', textAlign: 'center', color: 'var(--text-soft)' }}>
            Nenhuma versão publicada ainda. Faça login como Admin para enviar sua primeira build!
          </div>
        )}

        {/* Archive / History */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '1.35rem',
          }}
        >
          <h2 className="comic-title" style={{ fontSize: '2.2rem', margin: 0 }}>
            HISTÓRICO DE VERSÕES ({filtered.length})
          </h2>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {[
              { key: 'all', label: 'Todas' },
              { key: 'stable', label: 'Estável' },
              { key: 'beta', label: 'Beta' },
              { key: 'alpha', label: 'Alpha' },
            ].map((item) => (
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

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          {filtered.map((rel) => {
            const st = CHANNEL_STYLE[rel.channel] || CHANNEL_STYLE.beta;
            return (
              <div
                key={rel.id}
                className="comic-panel comic-panel-hover"
                style={{
                  padding: '1.45rem 1.6rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1.25rem',
                }}
              >
                <div style={{ flex: 1, minWidth: '260px' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center', marginBottom: '0.55rem' }}>
                    <span className="stat-pill" style={{ color: '#f5c542' }}>
                      {rel.version}
                    </span>
                    <span className="comic-tag" style={{ background: st.bg, color: st.color }}>
                      {st.label}
                    </span>
                    {rel.is_latest === 1 && (
                      <span className="comic-tag" style={{ background: '#24d1ff', color: '#041320' }}>
                        PRINCIPAL
                      </span>
                    )}
                    <span className="mono" style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {formatDateBR(rel.created_at)}
                    </span>
                  </div>

                  <h3 className="comic-title" style={{ fontSize: '1.75rem', margin: '0 0 0.45rem' }}>
                    {rel.title}
                  </h3>

                  <p
                    className="mono"
                    style={{
                      fontSize: '0.78rem',
                      color: 'var(--text-muted)',
                      margin: '0 0 0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      flexWrap: 'wrap',
                    }}
                  >
                    <FileArchive size={15} color="#f5c542" />
                    {rel.file_name} • {formatBytes(rel.file_size)} • {rel.download_count} downloads
                  </p>

                  <div style={{ fontSize: '0.93rem', lineHeight: 1.6, whiteSpace: 'pre-line', color: 'var(--text-soft)' }}>
                    {rel.changelog}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleDownload(rel)}
                  className="comic-btn comic-btn-emerald"
                >
                  <Download size={18} />
                  Baixar
                </button>
              </div>
            );
          })}
        </div>

        <DonateBannerCompact />
      </div>
    </div>
  );
}
