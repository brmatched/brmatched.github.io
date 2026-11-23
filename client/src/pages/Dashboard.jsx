import { useEffect, useState } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import {
  AlertCircle,
  Bug,
  CheckCircle2,
  Download,
  Flame,
  Lightbulb,
  MessageSquarePlus,
  Newspaper,
  Scale,
  Shield,
  Sparkles,
  Star,
  ThumbsUp,
  Trash2,
  Upload,
  User,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { findFighterByName } from '../data/fighters';
import { api, formatBytes, formatDateBR } from '../services/api';

const AVATAR_COLORS = ['#F5C542', '#10D876', '#24D1FF', '#E62429', '#FF7A18', '#8B42FF'];
const FIGHTERS = [
  'Medusa',
  'Rei Arthur',
  'Alice',
  'Sinbad',
  'Pé-Grande',
  'Robin Hood',
];

const STATUS_BADGES = {
  novo: { label: 'NOVO', bg: '#f5c542', color: '#08101a' },
  em_analise: { label: 'EM ANÁLISE', bg: '#24d1ff', color: '#041320' },
  em_dev: { label: 'EM PRODUÇÃO', bg: '#8b42ff', color: '#ffffff' },
  resolvido: { label: 'RESOLVIDO', bg: '#10d876', color: '#04190e' },
};

const CAT_INFO = {
  idea: { label: 'IDEIA', icon: Lightbulb, bg: '#f5c542', color: '#08101a' },
  balance: { label: 'BALANCEAMENTO', icon: Scale, bg: '#24d1ff', color: '#041320' },
  bug: { label: 'BUG', icon: Bug, bg: '#e62429', color: '#ffffff' },
};

export default function Dashboard() {
  const { user, loading: authLoading, updateProfile } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'downloads';

  const [activeTab, setActiveTab] = useState(initialTab);
  const [releases, setReleases] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [posts, setPosts] = useState([]);
  const [stats, setStats] = useState(null);

  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [avatarColor, setAvatarColor] = useState('#F5C542');
  const [favoriteDeck, setFavoriteDeck] = useState('Rei Arthur');

  const [fbCategory, setFbCategory] = useState('idea');
  const [fbTitle, setFbTitle] = useState('');
  const [fbMessage, setFbMessage] = useState('');

  const [relVersion, setRelVersion] = useState('');
  const [relTitle, setRelTitle] = useState('');
  const [relChannel, setRelChannel] = useState('beta');
  const [relChangelog, setRelChangelog] = useState('');
  const [relIsLatest, setRelIsLatest] = useState(true);
  const [relSourceMode, setRelSourceMode] = useState('external'); // 'external' | 'upload'
  const [relExternalUrl, setRelExternalUrl] = useState('');
  const [relFileName, setRelFileName] = useState('');
  const [relSizeMb, setRelSizeMb] = useState('');
  const [relFile, setRelFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [postTitle, setPostTitle] = useState('');
  const [postTag, setPostTag] = useState('DEVLOG');
  const [postSummary, setPostSummary] = useState('');
  const [postContent, setPostContent] = useState('');

  const [notice, setNotice] = useState(null);

  function showNotice(type, text) {
    setNotice({ type, text });
    setTimeout(() => setNotice(null), 4500);
  }

  function refreshAll() {
    api.getReleases().then((r) => setReleases(r.releases || [])).catch(() => {});
    api.getFeedback().then((r) => setFeedback(r.feedback || [])).catch(() => {});
    api.getPosts().then((r) => setPosts(r.posts || [])).catch(() => {});
    api.getStats().then(setStats).catch(() => {});
  }

  useEffect(() => {
    if (user) {
      setAvatarColor(user.avatar_color || '#F5C542');
      setFavoriteDeck(user.favorite_deck || 'Rei Arthur');
      refreshAll();
    }
  }, [user]);

  function switchTab(tab) {
    setActiveTab(tab);
    setSearchParams({ tab });
  }

  if (authLoading) {
    return (
      <div className="section">
        <div className="container">
          <div className="comic-panel" style={{ padding: '2.2rem', textAlign: 'center', color: 'var(--text-soft)', fontWeight: 600 }}>
            Carregando seu Dashboard do BRMatched...
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const favFighter = findFighterByName(user.favorite_deck);

  async function handleSaveProfile(e) {
    e.preventDefault();
    try {
      await updateProfile({ avatar_color: avatarColor, favorite_deck: favoriteDeck });
      setEditProfileOpen(false);
      showNotice('success', 'Cartão de duelista atualizado!');
    } catch (err) {
      showNotice('error', err.message);
    }
  }

  async function handleCreateFeedback(e) {
    e.preventDefault();
    try {
      const res = await api.createFeedback({
        category: fbCategory,
        title: fbTitle,
        message: fbMessage,
      });
      setFeedback((prev) => [res.feedback, ...prev]);
      setFbTitle('');
      setFbMessage('');
      showNotice('success', 'Sua mensagem entrou no Mural da Comunidade!');
    } catch (err) {
      showNotice('error', err.message);
    }
  }

  async function handleVote(id) {
    try {
      const res = await api.voteFeedback(id);
      setFeedback((prev) => prev.map((f) => (f.id === id ? res.feedback : f)));
    } catch (err) {
      showNotice('error', err.message);
    }
  }

  async function handleUpdateFeedbackStatus(id, status) {
    try {
      const res = await api.updateFeedbackStatus(id, status);
      setFeedback((prev) =>
        prev.map((f) => (f.id === id ? { ...f, status: res.feedback.status } : f))
      );
      showNotice('success', 'Status do feedback atualizado!');
    } catch (err) {
      showNotice('error', err.message);
    }
  }

  async function handleUploadRelease(e) {
    e.preventDefault();
    if (relSourceMode === 'upload' && !relFile) {
      showNotice('error', 'Selecione um arquivo .exe ou .zip do jogo antes de enviar.');
      return;
    }
    if (relSourceMode === 'external' && !relExternalUrl.trim()) {
      showNotice('error', 'Informe o link direto de download (GitHub Releases, itch.io ou Cloudflare R2).');
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      if (relSourceMode === 'upload' && relFile) {
        formData.append('file', relFile);
      } else {
        formData.append('external_url', relExternalUrl.trim());
        if (relFileName.trim()) formData.append('file_name', relFileName.trim());
        if (relSizeMb.trim()) formData.append('file_size_mb', relSizeMb.trim());
      }
      formData.append('version', relVersion);
      formData.append('title', relTitle);
      formData.append('channel', relChannel);
      formData.append('platform', 'Windows 10/11 (x64)');
      formData.append('changelog', relChangelog);
      formData.append('is_latest', String(relIsLatest));

      await api.uploadRelease(formData);
      setRelVersion('');
      setRelTitle('');
      setRelChangelog('');
      setRelExternalUrl('');
      setRelFileName('');
      setRelSizeMb('');
      setRelFile(null);
      refreshAll();
      showNotice('success', 'Nova build Windows publicada e disponível para download!');
    } catch (err) {
      showNotice('error', err.message);
    } finally {
      setUploading(false);
    }
  }

  async function handlePromoteLatest(id) {
    try {
      await api.setLatestRelease(id);
      refreshAll();
      showNotice('success', 'Versão definida como download principal do site!');
    } catch (err) {
      showNotice('error', err.message);
    }
  }

  async function handleDeleteRelease(id) {
    if (!window.confirm('Tem certeza que deseja excluir esta versão e o arquivo dela?')) return;
    try {
      await api.deleteRelease(id);
      refreshAll();
      showNotice('success', 'Versão removida com sucesso.');
    } catch (err) {
      showNotice('error', err.message);
    }
  }

  async function handleCreatePost(e) {
    e.preventDefault();
    try {
      await api.createPost({
        title: postTitle,
        tag: postTag,
        summary: postSummary,
        content: postContent,
      });
      setPostTitle('');
      setPostSummary('');
      setPostContent('');
      refreshAll();
      showNotice('success', 'Nova edição do Devlog publicada na página inicial!');
    } catch (err) {
      showNotice('error', err.message);
    }
  }

  async function handleDeletePost(id) {
    if (!window.confirm('Apagar esta publicação do Devlog?')) return;
    try {
      await api.deletePost(id);
      refreshAll();
      showNotice('success', 'Publicação removida.');
    } catch (err) {
      showNotice('error', err.message);
    }
  }

  return (
    <div className="section" style={{ paddingTop: '2.5rem' }}>
      <div className="container">
        {notice && (
          <div
            className={`comic-alert ${
              notice.type === 'error' ? 'comic-alert-error' : 'comic-alert-success'
            }`}
            style={{ marginBottom: '1.25rem' }}
          >
            {notice.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
            <span>{notice.text}</span>
          </div>
        )}

        {/* ---------- DUELIST ID CARD (WITH FAVORITE FIGHTER AURA) ---------- */}
        <div
          className="fighter-dossier"
          style={{
            '--fighter-color': favFighter.color,
            '--fighter-soft': favFighter.accentSoft,
            '--fighter-glow': favFighter.accentGlow,
            padding: '1.75rem 1.9rem',
            marginBottom: '2rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1.25rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.15rem', flexWrap: 'wrap' }}>
              <div
                style={{
                  position: 'relative',
                  width: '78px',
                  height: '78px',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  border: `2.5px solid ${user.avatar_color || favFighter.color}`,
                  boxShadow: `0 12px 26px -6px ${favFighter.accentGlow}`,
                  flexShrink: 0,
                }}
              >
                <img
                  src={favFighter.image}
                  alt={favFighter.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
                />
                <span
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    background: user.avatar_color || '#f5c542',
                    color: '#060a11',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 900,
                    fontSize: '0.88rem',
                    padding: '0.05rem 0.35rem',
                    borderTopLeftRadius: '7px',
                  }}
                >
                  {user.username.slice(0, 2).toUpperCase()}
                </span>
              </div>

              <div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.4rem' }}>
                  <span
                    className="comic-tag"
                    style={{
                      background: user.role === 'admin' ? '#e62429' : '#10d876',
                      color: user.role === 'admin' ? '#fff' : '#04190e',
                    }}
                  >
                    {user.role === 'admin' ? <Shield size={13} /> : <Sparkles size={13} />}
                    {user.badge}
                  </span>
                  <span className="stat-pill">
                    MEMBRO #{String(user.id).padStart(4, '0')}
                  </span>
                </div>
                <h1 className="comic-title" style={{ fontSize: '2.5rem', margin: 0 }}>
                  OLÁ, {user.username}!
                </h1>
                <p style={{ margin: '0.25rem 0 0', color: 'var(--text-soft)', fontSize: '0.92rem' }}>
                  Lutador Favorito:{' '}
                  <strong style={{ color: favFighter.color }}>{user.favorite_deck}</strong> • {user.email}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setEditProfileOpen((o) => !o)}
              className="comic-btn comic-btn-sm comic-btn-white"
            >
              <User size={15} />
              Personalizar Cartão
            </button>
          </div>

          {editProfileOpen && (
            <form
              onSubmit={handleSaveProfile}
              style={{
                marginTop: '1.4rem',
                paddingTop: '1.3rem',
                borderTop: '1px solid var(--border-subtle)',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1.25rem',
                alignItems: 'flex-end',
              }}
            >
              <div>
                <div className="mono" style={{ fontSize: '0.72rem', fontWeight: 700, marginBottom: '0.5rem', color: '#f5c542' }}>
                  COR DA MOLDURA
                </div>
                <div style={{ display: 'flex', gap: '0.45rem' }}>
                  {AVATAR_COLORS.map((col) => (
                    <button
                      key={col}
                      type="button"
                      onClick={() => setAvatarColor(col)}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        background: col,
                        border: avatarColor === col ? '3px solid #ffffff' : '2px solid rgba(0,0,0,0.45)',
                        cursor: 'pointer',
                      }}
                      aria-label={`Cor ${col}`}
                    />
                  ))}
                </div>
              </div>

              <div style={{ minWidth: '220px' }}>
                <div className="mono" style={{ fontSize: '0.72rem', fontWeight: 700, marginBottom: '0.45rem', color: '#f5c542' }}>
                  LUTADOR FAVORITO
                </div>
                <select
                  className="comic-select"
                  value={favoriteDeck}
                  onChange={(e) => setFavoriteDeck(e.target.value)}
                  style={{ padding: '0.55rem 0.8rem' }}
                >
                  {FIGHTERS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <button type="submit" className="comic-btn comic-btn-sm comic-btn-emerald">
                Salvar Cartão
              </button>
            </form>
          )}
        </div>

        {/* ---------- DASHBOARD TABS ---------- */}
        <div style={{ display: 'flex', gap: '0.7rem', flexWrap: 'wrap', marginBottom: '1.8rem' }}>
          <button
            type="button"
            onClick={() => switchTab('downloads')}
            className={`comic-btn ${activeTab === 'downloads' ? 'comic-btn-emerald' : 'comic-btn-white'}`}
          >
            <Download size={18} />
            Builds Windows ({releases.length})
          </button>

          <button
            type="button"
            onClick={() => switchTab('community')}
            className={`comic-btn ${activeTab === 'community' ? 'comic-btn-cyan' : 'comic-btn-white'}`}
          >
            <MessageSquarePlus size={18} />
            Mural Bugs &amp; Ideias ({feedback.length})
          </button>

          {user.role === 'admin' && (
            <button
              type="button"
              onClick={() => switchTab('admin')}
              className={`comic-btn ${activeTab === 'admin' ? 'comic-btn-magenta' : 'comic-btn-white'}`}
            >
              <Shield size={18} />
              Painel Dev / Upload
            </button>
          )}
        </div>

        {/* ---------- TAB 1: DOWNLOADS ---------- */}
        {activeTab === 'downloads' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            <div
              className="comic-panel halftone-yellow"
              style={{ padding: '1.15rem 1.45rem', color: 'var(--text-soft)', fontSize: '0.95rem' }}
            >
              <strong style={{ color: '#f5c542' }}>Acesso de Membro Liberado:</strong> baixe todas as
              builds de Windows (Estável, Beta e Alpha) assim que publicadas.
            </div>

            {releases.map((rel) => (
              <div
                key={rel.id}
                className="comic-panel comic-panel-hover"
                style={{
                  padding: '1.45rem 1.6rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1.2rem',
                }}
              >
                <div style={{ flex: 1, minWidth: '250px' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                    <span className="stat-pill" style={{ color: '#f5c542' }}>
                      {rel.version}
                    </span>
                    <span className="comic-tag" style={{ background: '#24d1ff', color: '#041320' }}>
                      {rel.channel.toUpperCase()}
                    </span>
                    {rel.is_latest === 1 && (
                      <span className="comic-tag" style={{ background: '#10d876', color: '#04190e' }}>
                        MAIS RECENTE
                      </span>
                    )}
                  </div>
                  <h3 className="comic-title" style={{ fontSize: '1.75rem', margin: '0 0 0.35rem' }}>
                    {rel.title}
                  </h3>
                  <p className="mono" style={{ fontSize: '0.78rem', margin: '0 0 0.65rem', color: 'var(--text-muted)' }}>
                    {rel.file_name} • {formatBytes(rel.file_size)} • {rel.download_count} downloads •{' '}
                    {formatDateBR(rel.created_at)}
                  </p>
                  <p style={{ margin: 0, whiteSpace: 'pre-line', fontSize: '0.92rem', lineHeight: 1.6, color: 'var(--text-soft)' }}>
                    {rel.changelog}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    window.location.href = api.getDownloadUrl(rel.id);
                    setTimeout(refreshAll, 800);
                  }}
                  className="comic-btn comic-btn-emerald"
                >
                  <Download size={17} />
                  Baixar PC
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ---------- TAB 2: COMMUNITY FEEDBACK BOARD ---------- */}
        {activeTab === 'community' && (
          <div
            className="grid-2-col"
            style={{ display: 'grid', gridTemplateColumns: '0.9fr 1.1fr', gap: '1.6rem', alignItems: 'start' }}
          >
            <form
              onSubmit={handleCreateFeedback}
              className="comic-panel"
              style={{ padding: '1.6rem', display: 'flex', flexDirection: 'column', gap: '1.05rem' }}
            >
              <h2 className="comic-title" style={{ fontSize: '1.95rem', margin: 0 }}>
                ENVIE UMA IDEIA OU BUG
              </h2>
              <div className="comic-field">
                <label htmlFor="fb-cat">Categoria</label>
                <select
                  id="fb-cat"
                  className="comic-select"
                  value={fbCategory}
                  onChange={(e) => setFbCategory(e.target.value)}
                >
                  <option value="idea">Sugestão de Nova Mecânica / Carta</option>
                  <option value="balance">Balanceamento de Cartas / Tabuleiro</option>
                  <option value="bug">Reportar Bug no Windows</option>
                </select>
              </div>
              <div className="comic-field">
                <label htmlFor="fb-title">Título Curto</label>
                <input
                  id="fb-title"
                  className="comic-input"
                  required
                  placeholder="Ex: Nova carta que embaralha o tabuleiro"
                  value={fbTitle}
                  onChange={(e) => setFbTitle(e.target.value)}
                />
              </div>
              <div className="comic-field">
                <label htmlFor="fb-msg">Detalhes</label>
                <textarea
                  id="fb-msg"
                  className="comic-textarea"
                  required
                  placeholder="Explique sua ideia ou como reproduzir o problema..."
                  value={fbMessage}
                  onChange={(e) => setFbMessage(e.target.value)}
                />
              </div>
              <button type="submit" className="comic-btn comic-btn-cyan">
                <MessageSquarePlus size={18} />
                Publicar no Mural
              </button>
            </form>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {feedback.map((item) => {
                const cat = CAT_INFO[item.category] || CAT_INFO.idea;
                const st = STATUS_BADGES[item.status] || STATUS_BADGES.novo;
                const CatIcon = cat.icon;
                return (
                  <div key={item.id} className="comic-panel" style={{ padding: '1.35rem' }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        gap: '0.8rem',
                        marginBottom: '0.65rem',
                      }}
                    >
                      <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
                        <span className="comic-tag" style={{ background: cat.bg, color: cat.color }}>
                          <CatIcon size={13} /> {cat.label}
                        </span>
                        <span className="comic-tag" style={{ background: st.bg, color: st.color }}>
                          {st.label}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleVote(item.id)}
                        className={`comic-btn comic-btn-sm ${
                          item.votedByMe ? 'comic-btn-yellow' : 'comic-btn-white'
                        }`}
                      >
                        <ThumbsUp size={14} />
                        {item.votes}
                      </button>
                    </div>

                    <h3 className="comic-title" style={{ fontSize: '1.55rem', margin: '0 0 0.4rem' }}>
                      {item.title}
                    </h3>
                    <p style={{ margin: '0 0 0.8rem', lineHeight: 1.6, color: 'var(--text-soft)', fontSize: '0.94rem' }}>
                      {item.message}
                    </p>

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '0.6rem',
                        fontSize: '0.78rem',
                        color: 'var(--text-muted)',
                      }}
                    >
                      <span className="mono">
                        Por {item.username} ({item.user_badge}) • {formatDateBR(item.created_at)}
                      </span>

                      {user.role === 'admin' && (
                        <select
                          aria-label="Alterar status"
                          value={item.status}
                          onChange={(e) => handleUpdateFeedbackStatus(item.id, e.target.value)}
                          className="comic-select"
                          style={{ width: 'auto', padding: '0.3rem 0.65rem', fontSize: '0.8rem' }}
                        >
                          <option value="novo">Novo</option>
                          <option value="em_analise">Em Análise</option>
                          <option value="em_dev">Em Produção</option>
                          <option value="resolvido">Resolvido</option>
                        </select>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ---------- TAB 3: ADMIN / DEV PANEL ---------- */}
        {activeTab === 'admin' && user.role === 'admin' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div
              className="grid-3-col"
              style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.1rem' }}
            >
              <div className="hero-stat-card" style={{ '--stat-color': '#10d876', padding: '1.35rem' }}>
                <div className="hero-stat-value" style={{ fontSize: '2.5rem' }}>
                  {stats?.totalDownloads ?? 0}
                </div>
                <div className="hero-stat-label">Total de Downloads Windows</div>
              </div>
              <div className="hero-stat-card" style={{ '--stat-color': '#f5c542', padding: '1.35rem' }}>
                <div className="hero-stat-value" style={{ fontSize: '2.5rem' }}>
                  {stats?.totalMembers ?? 0}
                </div>
                <div className="hero-stat-label">Membros Cadastrados</div>
              </div>
              <div className="hero-stat-card" style={{ '--stat-color': '#24d1ff', padding: '1.35rem' }}>
                <div className="hero-stat-value" style={{ fontSize: '2.5rem' }}>
                  {stats?.openFeedback ?? 0}
                </div>
                <div className="hero-stat-label">Feedbacks em Aberto</div>
              </div>
            </div>

            <div
              className="grid-2-col"
              style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.6rem', alignItems: 'start' }}
            >
              <form
                onSubmit={handleUploadRelease}
                className="comic-panel"
                style={{ padding: '1.65rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                  <Upload size={21} color="#e62429" />
                  <h2 className="comic-title" style={{ fontSize: '1.9rem', margin: 0 }}>
                    PUBLICAR NOVA BUILD WINDOWS
                  </h2>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                  <div className="comic-field">
                    <label htmlFor="rel-ver">Versão</label>
                    <input
                      id="rel-ver"
                      className="comic-input"
                      required
                      placeholder="Ex: v0.5.0-beta"
                      value={relVersion}
                      onChange={(e) => setRelVersion(e.target.value)}
                    />
                  </div>
                  <div className="comic-field">
                    <label htmlFor="rel-ch">Canal</label>
                    <select
                      id="rel-ch"
                      className="comic-select"
                      value={relChannel}
                      onChange={(e) => setRelChannel(e.target.value)}
                    >
                      <option value="stable">Estável (Stable)</option>
                      <option value="beta">Beta</option>
                      <option value="alpha">Alpha</option>
                    </select>
                  </div>
                </div>

                <div className="comic-field">
                  <label htmlFor="rel-title">Título da Edição</label>
                  <input
                    id="rel-title"
                    className="comic-input"
                    required
                    placeholder="Ex: Atualização Cartas Lendárias!"
                    value={relTitle}
                    onChange={(e) => setRelTitle(e.target.value)}
                  />
                </div>

                <div className="comic-field">
                  <label>Origem do Instalador</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.55rem' }}>
                    <button
                      type="button"
                      onClick={() => setRelSourceMode('external')}
                      className={`comic-btn comic-btn-sm ${
                        relSourceMode === 'external' ? 'comic-btn-cyan' : 'comic-btn-white'
                      }`}
                    >
                      Link Externo (GitHub / R2)
                    </button>
                    <button
                      type="button"
                      onClick={() => setRelSourceMode('upload')}
                      className={`comic-btn comic-btn-sm ${
                        relSourceMode === 'upload' ? 'comic-btn-cyan' : 'comic-btn-white'
                      }`}
                    >
                      Upload Direto (.exe / .zip)
                    </button>
                  </div>
                </div>

                {relSourceMode === 'external' ? (
                  <>
                    <div className="comic-field">
                      <label htmlFor="rel-ext-url">Link Direto de Download (HTTPS)</label>
                      <input
                        id="rel-ext-url"
                        type="url"
                        className="comic-input"
                        required
                        placeholder="https://github.com/.../releases/download/v2.0/BRMatched-Setup.exe"
                        value={relExternalUrl}
                        onChange={(e) => setRelExternalUrl(e.target.value)}
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 0.7fr', gap: '0.85rem' }}>
                      <div className="comic-field">
                        <label htmlFor="rel-fname">Nome do Arquivo (opcional)</label>
                        <input
                          id="rel-fname"
                          className="comic-input"
                          placeholder="BRMATCHED-Beta-2.0-Setup-Windows-x64.exe"
                          value={relFileName}
                          onChange={(e) => setRelFileName(e.target.value)}
                        />
                      </div>
                      <div className="comic-field">
                        <label htmlFor="rel-mb">Tamanho (MB)</label>
                        <input
                          id="rel-mb"
                          type="number"
                          min="0"
                          step="0.1"
                          className="comic-input"
                          placeholder="495"
                          value={relSizeMb}
                          onChange={(e) => setRelSizeMb(e.target.value)}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="comic-field">
                    <label htmlFor="rel-file">Arquivo do Jogo (.exe, .zip, .msi, .7z)</label>
                    <input
                      id="rel-file"
                      type="file"
                      accept=".exe,.zip,.msi,.7z,.rar"
                      className="comic-input"
                      onChange={(e) => setRelFile(e.target.files?.[0] || null)}
                    />
                  </div>
                )}

                <div className="comic-field">
                  <label htmlFor="rel-log">Notas da Versão (1 item por linha)</label>
                  <textarea
                    id="rel-log"
                    className="comic-textarea"
                    required
                    placeholder={'NOVO: 10 cartas inéditas\nCORREÇÃO: Ajuste no áudio'}
                    value={relChangelog}
                    onChange={(e) => setRelChangelog(e.target.value)}
                  />
                </div>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', color: 'var(--text-soft)' }}>
                  <input
                    type="checkbox"
                    checked={relIsLatest}
                    onChange={(e) => setRelIsLatest(e.target.checked)}
                    style={{ width: '17px', height: '17px' }}
                  />
                  Definir como versão principal de download no site
                </label>

                <button type="submit" disabled={uploading} className="comic-btn comic-btn-emerald">
                  <Upload size={17} />
                  {uploading ? 'ENVIANDO ARQUIVO...' : 'PUBLICAR VERSÃO PARA WINDOWS'}
                </button>
              </form>

              <form
                onSubmit={handleCreatePost}
                className="comic-panel"
                style={{ padding: '1.65rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                  <Newspaper size={21} color="#10d876" />
                  <h2 className="comic-title" style={{ fontSize: '1.9rem', margin: 0 }}>
                    PUBLICAR NOVO DEVLOG
                  </h2>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px', gap: '0.85rem' }}>
                  <div className="comic-field">
                    <label htmlFor="post-title">Manchete</label>
                    <input
                      id="post-title"
                      className="comic-input"
                      required
                      placeholder="Ex: NOVO CHEFE DA ARENA REVELADO!"
                      value={postTitle}
                      onChange={(e) => setPostTitle(e.target.value)}
                    />
                  </div>
                  <div className="comic-field">
                    <label htmlFor="post-tag">Tag</label>
                    <select
                      id="post-tag"
                      className="comic-select"
                      value={postTag}
                      onChange={(e) => setPostTag(e.target.value)}
                    >
                      <option value="DEVLOG">DEVLOG</option>
                      <option value="CARTAS">CARTAS</option>
                      <option value="PATCH">PATCH</option>
                      <option value="ANÚNCIO">ANÚNCIO</option>
                    </select>
                  </div>
                </div>

                <div className="comic-field">
                  <label htmlFor="post-summary">Resumo Curto (aparece no card)</label>
                  <input
                    id="post-summary"
                    className="comic-input"
                    required
                    placeholder="Uma frase chamativa sobre a novidade..."
                    value={postSummary}
                    onChange={(e) => setPostSummary(e.target.value)}
                  />
                </div>

                <div className="comic-field">
                  <label htmlFor="post-content">Texto Completo</label>
                  <textarea
                    id="post-content"
                    className="comic-textarea"
                    required
                    placeholder="Conte os bastidores do desenvolvimento do BRMatched..."
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                  />
                </div>

                <button type="submit" className="comic-btn comic-btn-yellow">
                  <Flame size={17} />
                  Publicar Edição no Site
                </button>
              </form>
            </div>

            <div className="comic-panel" style={{ padding: '1.65rem' }}>
              <h3 className="comic-title" style={{ fontSize: '1.8rem', margin: '0 0 1rem', color: '#f5c542' }}>
                GERENCIAR VERSÕES PUBLICADAS
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {releases.map((rel) => (
                  <div
                    key={rel.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '0.75rem',
                      padding: '0.9rem 1.1rem',
                      borderRadius: '12px',
                      border: rel.is_latest ? '1.5px solid rgba(16, 216, 118, 0.5)' : '1px solid var(--border-subtle)',
                      background: rel.is_latest ? 'rgba(16, 216, 118, 0.08)' : 'rgba(6, 10, 18, 0.65)',
                    }}
                  >
                    <div>
                      <strong className="mono" style={{ color: '#f5c542' }}>{rel.version}</strong> — {rel.title}{' '}
                      <span className="mono" style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        ({formatBytes(rel.file_size)} • {rel.download_count} dl)
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {rel.is_latest === 0 && (
                        <button
                          type="button"
                          onClick={() => handlePromoteLatest(rel.id)}
                          className="comic-btn comic-btn-sm comic-btn-yellow"
                        >
                          <Star size={14} /> Tornar Principal
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDeleteRelease(rel.id)}
                        className="comic-btn comic-btn-sm comic-btn-magenta"
                        title="Excluir versão"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <h3 className="comic-title" style={{ fontSize: '1.8rem', margin: '1.85rem 0 1rem', color: '#24d1ff' }}>
                GERENCIAR DEVLOGS ({posts.length})
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {posts.map((p) => (
                  <div
                    key={p.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.8rem 1.1rem',
                      borderRadius: '12px',
                      border: '1px solid var(--border-subtle)',
                      background: 'rgba(6, 10, 18, 0.65)',
                    }}
                  >
                    <div>
                      <span className="mono" style={{ fontWeight: 700, marginRight: '0.55rem', color: '#f5c542' }}>
                        #{p.issue_number}
                      </span>
                      <strong>{p.title}</strong>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeletePost(p.id)}
                      className="comic-btn comic-btn-sm comic-btn-white"
                      title="Excluir Devlog"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
