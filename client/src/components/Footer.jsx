import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronRight, Download, Gamepad2 } from 'lucide-react';
import { getGitHubIssuesUrl, IS_STATIC_SITE } from '../services/api';
import { assetUrl } from '../utils/assets';

export default function Footer() {
  const location = useLocation();
  const navigate = useNavigate();
  const issuesUrl = getGitHubIssuesUrl();

  function goToSection(e, id) {
    e.preventDefault();
    if (location.pathname === '/') {
      const el = document.getElementById(id);
      if (el) {
        el.querySelectorAll('[data-reveal]').forEach((node) => node.classList.add('is-revealed'));
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      navigate(`/#${id}`);
    }
  }

  return (
    <footer className="site-footer">
      <div className="container">
        <div
          className="grid-3-col"
          style={{
            display: 'grid',
            gridTemplateColumns: '1.45fr 1fr 1fr',
            gap: '2.2rem',
            paddingBottom: '2.4rem',
            borderBottom: '1px solid rgba(244, 241, 234, 0.1)',
          }}
        >
          <div>
            <div style={{ marginBottom: '0.9rem' }}>
              <img
                src={assetUrl('/images/brmatched-logo-sm.png')}
                alt="BRMatched — A Batalha de Mitos"
                className="footer-brand-img"
              />
            </div>
            <p style={{ color: 'var(--text-soft)', lineHeight: 1.65, maxWidth: '42ch', margin: 0, fontSize: '0.95rem' }}>
              <strong style={{ color: 'var(--text-main)' }}>Em batalha, não há iguais!</strong> Jogo de{' '}
              <strong style={{ color: 'var(--text-main)' }}>Deck-Building com Tabuleiro (Sistema DBT)</strong>{' '}
              totalmente em português com artes originais em estilo quadrinhos para Windows PC.
            </p>
          </div>

          <div>
            <h4 className="comic-title" style={{ fontSize: '1.45rem', color: 'var(--gold)', margin: '0 0 1rem' }}>
              Explorar
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <Link to="/" className="footer-link">
                <ChevronRight size={15} /> Página Inicial
              </Link>
              <a href="#lutadores" onClick={(e) => goToSection(e, 'lutadores')} className="footer-link">
                <ChevronRight size={15} /> Lutadores &amp; Baralhos
              </a>
              <a href="#arenas" onClick={(e) => goToSection(e, 'arenas')} className="footer-link">
                <ChevronRight size={15} /> Arenas de Batalha
              </a>
              <a href="#regras" onClick={(e) => goToSection(e, 'regras')} className="footer-link">
                <ChevronRight size={15} /> Como Jogar (Sistema DBT)
              </a>
              <Link to="/downloads" className="footer-link">
                <ChevronRight size={15} /> Downloads para Windows
              </Link>
              <a href="#noticias" onClick={(e) => goToSection(e, 'noticias')} className="footer-link">
                <ChevronRight size={15} /> Notícias &amp; Futuros Updates
              </a>
              <a href="#apoiar" onClick={(e) => goToSection(e, 'apoiar')} className="footer-link">
                <ChevronRight size={15} /> Apoiar o Jogo (PIX)
              </a>
              {!IS_STATIC_SITE ? (
                <Link to="/dashboard" className="footer-link">
                  <ChevronRight size={15} /> Área de Membros
                </Link>
              ) : issuesUrl ? (
                <a href={issuesUrl} target="_blank" rel="noreferrer" className="footer-link">
                  <ChevronRight size={15} /> Reportar Bug / Ideia
                </a>
              ) : null}
            </div>
          </div>

          <div>
            <h4 className="comic-title" style={{ fontSize: '1.45rem', color: 'var(--emerald)', margin: '0 0 1rem' }}>
              Entre na Arena
            </h4>
            <p style={{ color: 'var(--text-soft)', fontSize: '0.93rem', lineHeight: 1.6, margin: '0 0 1.2rem' }}>
              Baixe a versão Beta 3.0 do BRMatched para Windows 10/11 e duele com todos os 10 heróis lendários!
            </p>
            <Link to="/downloads" className="comic-btn comic-btn-sm comic-btn-emerald">
              <Download size={16} />
              Ir para Downloads
            </Link>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            paddingTop: '1.5rem',
            color: 'var(--text-muted)',
            fontSize: '0.84rem',
          }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <Gamepad2 size={16} color="#f5c542" />
            BRMatched © {new Date().getFullYear()} — Sistema DBT (Deck-Building com Tabuleiro)
          </span>
          <span className="mono" style={{ fontSize: '0.76rem', letterSpacing: '0.06em' }}>
            WINDOWS PC (x64) • BETA 3.0 • EM BREVE 4.0
          </span>
        </div>
      </div>
    </footer>
  );
}
