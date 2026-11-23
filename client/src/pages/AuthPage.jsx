import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, LogIn, UserPlus, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const FIGHTER_OPTIONS = [
  'Medusa',
  'Rei Arthur',
  'Alice',
  'Sinbad',
  'Pé-Grande',
  'Robin Hood',
];

export default function AuthPage({ mode = 'login' }) {
  const isRegister = mode === 'register';
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [favoriteDeck, setFavoriteDeck] = useState(FIGHTER_OPTIONS[0]);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      if (isRegister) {
        await register({
          username,
          email,
          password,
          favorite_deck: favoriteDeck,
        });
      } else {
        await login(email, password);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Erro na autenticação.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="section" style={{ paddingTop: '3rem' }}>
      <div className="container" style={{ maxWidth: '520px' }}>
        <div className="comic-panel" style={{ overflow: 'hidden' }}>
          {/* Top Atmospheric Banner */}
          <div
            className={isRegister ? 'halftone-emerald' : 'halftone-dark'}
            style={{
              padding: '1.75rem 1.9rem',
              borderBottom: '1px solid var(--border-subtle)',
              position: 'relative',
            }}
          >
            <span className="eyebrow" style={{ color: isRegister ? '#10d876' : '#f5c542' }}>
              <Zap size={13} /> Clube BRMatched
            </span>
            <h1 className="comic-title" style={{ fontSize: '2.6rem', margin: '0.4rem 0 0' }}>
              {isRegister ? 'CRIE SUA CONTA DE DUELISTA' : 'ENTRAR NA ÁREA DE MEMBROS'}
            </h1>
            <p style={{ margin: '0.45rem 0 0', fontSize: '0.94rem', lineHeight: 1.55, color: 'var(--text-soft)' }}>
              {isRegister
                ? 'Personalize seu Cartão de Duelista, acompanhe builds antecipadas e participe do mural da comunidade.'
                : 'Acesse seus downloads, mural da comunidade e (se for dev) o painel de releases!'}
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            style={{ padding: '1.9rem', display: 'flex', flexDirection: 'column', gap: '1.15rem' }}
          >
            {error && (
              <div className="comic-alert comic-alert-error">
                <AlertCircle size={20} style={{ flexShrink: 0 }} />
                <span>{error}</span>
              </div>
            )}

            {isRegister && (
              <div className="comic-field">
                <label htmlFor="username">Apelido de Jogador</label>
                <input
                  id="username"
                  className="comic-input"
                  type="text"
                  required
                  minLength={3}
                  maxLength={24}
                  placeholder="Ex: MestreComboBR"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            )}

            <div className="comic-field">
              <label htmlFor="email">{isRegister ? 'E-mail' : 'E-mail ou Apelido'}</label>
              <input
                id="email"
                className="comic-input"
                type={isRegister ? 'email' : 'text'}
                required
                placeholder={isRegister ? 'voce@exemplo.com' : 'admin@brmatched.com'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="comic-field">
              <label htmlFor="password">Senha</label>
              <input
                id="password"
                className="comic-input"
                type="password"
                required
                minLength={6}
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {isRegister && (
              <div className="comic-field">
                <label htmlFor="deck">Lutador Favorito</label>
                <select
                  id="deck"
                  className="comic-select"
                  value={favoriteDeck}
                  onChange={(e) => setFavoriteDeck(e.target.value)}
                >
                  {FIGHTER_OPTIONS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className={`comic-btn comic-btn-lg ${isRegister ? 'comic-btn-emerald' : 'comic-btn-yellow'}`}
              style={{ width: '100%', marginTop: '0.25rem' }}
            >
              {isRegister ? <UserPlus size={20} /> : <LogIn size={20} />}
              {submitting
                ? 'CARREGANDO...'
                : isRegister
                  ? 'CRIAR MINHA CONTA'
                  : 'ENTRAR AGORA'}
            </button>

            <div style={{ textAlign: 'center', fontWeight: 600, fontSize: '0.94rem', paddingTop: '0.35rem', color: 'var(--text-soft)' }}>
              {isRegister ? (
                <>
                  Já faz parte do clube?{' '}
                  <Link to="/login" style={{ color: '#f5c542', fontWeight: 700 }}>
                    Entrar aqui
                  </Link>
                </>
              ) : (
                <>
                  Ainda não tem conta?{' '}
                  <Link to="/cadastro" style={{ color: '#10d876', fontWeight: 700 }}>
                    Criar conta grátis
                  </Link>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
