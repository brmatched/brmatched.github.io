import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Download, Heart, LayoutDashboard, LogOut, Menu, Shield, User, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { IS_STATIC_SITE } from '../services/api';
import { assetUrl } from '../utils/assets';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeHash, setActiveHash] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setActiveHash(location.hash || '');
  }, [location.pathname, location.hash]);

  useEffect(() => {
    if (location.pathname !== '/') return undefined;
    const sectionIds = ['lutadores', 'arenas', 'regras', 'devlog', 'apoiar'];

    function onScroll() {
      const scrollY = window.scrollY;
      if (scrollY < 320) {
        setActiveHash('');
        return;
      }
      let current = '';
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.getBoundingClientRect().top;
          if (top <= 160) current = `#${id}`;
        }
      }
      setActiveHash(current);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [location.pathname]);

  function handleLogout() {
    logout();
    setMenuOpen(false);
    navigate('/');
  }

  function handleSectionClick(e, sectionId) {
    e.preventDefault();
    setMenuOpen(false);
    setActiveHash(`#${sectionId}`);
    if (location.pathname === '/') {
      const el = document.getElementById(sectionId);
      if (el) {
        el.querySelectorAll('[data-reveal]').forEach((node) => node.classList.add('is-revealed'));
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      window.history.replaceState(null, '', `${import.meta.env.BASE_URL}#${sectionId}`);
    } else {
      navigate(`/#${sectionId}`);
    }
  }

  const isHomeTop = location.pathname === '/' && !activeHash;

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link
          to="/"
          className="brand-logo"
          aria-label="BRMatched — A Batalha de Mitos"
          onClick={() => {
            setMenuOpen(false);
            setActiveHash('');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <img
            src={assetUrl('/images/brmatched-logo-sm.png')}
            alt="BRMatched — A Batalha de Mitos"
            className="nav-brand-img"
          />
        </Link>

        <nav className="nav-links" aria-label="Navegação principal">
          <Link
            to="/"
            className={`nav-link ${isHomeTop ? 'active' : ''}`}
            onClick={() => {
              setActiveHash('');
              if (location.pathname === '/') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
          >
            Início
          </Link>
          <a
            href="#lutadores"
            className={`nav-link ${location.pathname === '/' && activeHash === '#lutadores' ? 'active' : ''}`}
            onClick={(e) => handleSectionClick(e, 'lutadores')}
          >
            Lutadores
          </a>
          <a
            href="#arenas"
            className={`nav-link ${location.pathname === '/' && activeHash === '#arenas' ? 'active' : ''}`}
            onClick={(e) => handleSectionClick(e, 'arenas')}
          >
            Arenas
          </a>
          <a
            href="#regras"
            className={`nav-link ${location.pathname === '/' && activeHash === '#regras' ? 'active' : ''}`}
            onClick={(e) => handleSectionClick(e, 'regras')}
          >
            Como Jogar
          </a>
          <NavLink
            to="/downloads"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            Download PC
          </NavLink>
          <a
            href="#devlog"
            className={`nav-link ${location.pathname === '/' && activeHash === '#devlog' ? 'active' : ''}`}
            onClick={(e) => handleSectionClick(e, 'devlog')}
          >
            Devlog
          </a>
          <a
            href="#apoiar"
            className={`nav-link ${location.pathname === '/' && activeHash === '#apoiar' ? 'active' : ''}`}
            onClick={(e) => handleSectionClick(e, 'apoiar')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <Heart size={13} color="#ff5a60" fill="#ff5a60" />
            Apoiar
          </a>
        </nav>

        <div className="nav-actions">
          {!IS_STATIC_SITE && user ? (
            <>
              <Link to="/dashboard" className="comic-btn comic-btn-sm comic-btn-cyan">
                {user.role === 'admin' ? <Shield size={16} /> : <LayoutDashboard size={16} />}
                <span>{user.username}</span>
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="comic-btn comic-btn-sm comic-btn-white"
                title="Sair da conta"
                aria-label="Sair da conta"
              >
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <>
              {!IS_STATIC_SITE && (
                <Link to="/login" className="comic-btn comic-btn-sm comic-btn-white">
                  <User size={15} />
                  Entrar
                </Link>
              )}
              <Link to="/downloads" className="comic-btn comic-btn-sm comic-btn-emerald">
                <Download size={15} />
                Baixar PC
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="nav-mobile-toggle"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Abrir menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {menuOpen && (
        <div
          style={{
            background: 'rgba(10, 16, 28, 0.98)',
            borderTop: '1px solid rgba(244, 241, 234, 0.12)',
            padding: '1rem 1.25rem 1.4rem',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
            <Link to="/" className="nav-link" onClick={() => setMenuOpen(false)}>
              Início
            </Link>
            <a href="#lutadores" className="nav-link" onClick={(e) => handleSectionClick(e, 'lutadores')}>
              Lutadores &amp; Cartas
            </a>
            <a href="#arenas" className="nav-link" onClick={(e) => handleSectionClick(e, 'arenas')}>
              Arenas de Batalha
            </a>
            <a href="#regras" className="nav-link" onClick={(e) => handleSectionClick(e, 'regras')}>
              Como Jogar
            </a>
            <Link to="/downloads" className="nav-link" onClick={() => setMenuOpen(false)}>
              Download Windows PC
            </Link>
            <a href="#devlog" className="nav-link" onClick={(e) => handleSectionClick(e, 'devlog')}>
              Devlog
            </a>
            <a href="#apoiar" className="nav-link" onClick={(e) => handleSectionClick(e, 'apoiar')}>
              Apoiar (PIX)
            </a>
            <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', paddingTop: '0.75rem' }}>
              {!IS_STATIC_SITE && user ? (
                <>
                  <Link
                    to="/dashboard"
                    className="comic-btn comic-btn-sm comic-btn-cyan"
                    onClick={() => setMenuOpen(false)}
                  >
                    <LayoutDashboard size={15} />
                    Dashboard ({user.username})
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="comic-btn comic-btn-sm comic-btn-magenta"
                  >
                    <LogOut size={15} />
                    Sair
                  </button>
                </>
              ) : !IS_STATIC_SITE ? (
                <>
                  <Link
                    to="/login"
                    className="comic-btn comic-btn-sm comic-btn-white"
                    onClick={() => setMenuOpen(false)}
                  >
                    Entrar
                  </Link>
                  <Link
                    to="/cadastro"
                    className="comic-btn comic-btn-sm comic-btn-emerald"
                    onClick={() => setMenuOpen(false)}
                  >
                    Criar Conta
                  </Link>
                </>
              ) : (
                <Link
                  to="/downloads"
                  className="comic-btn comic-btn-sm comic-btn-emerald"
                  onClick={() => setMenuOpen(false)}
                >
                  <Download size={15} />
                  Baixar Beta 2.0 (PC)
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
