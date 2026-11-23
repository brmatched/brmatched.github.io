import { useEffect } from 'react';

export function useScrollReveal() {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll('[data-reveal]'));
    if (!elements.length) return undefined;

    const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || typeof IntersectionObserver === 'undefined') {
      elements.forEach((el) => el.classList.add('is-revealed'));
      return undefined;
    }

    function revealVisibleOrPassed() {
      const limit = window.innerHeight + 120;
      elements.forEach((el) => {
        if (el.classList.contains('is-revealed')) return;
        const rect = el.getBoundingClientRect();
        if (rect.top <= limit) {
          el.classList.add('is-revealed');
        }
      });
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting || entry.boundingClientRect.top <= window.innerHeight + 120) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.01, rootMargin: '100px 0px 100px 0px' }
    );

    elements.forEach((el) => observer.observe(el));
    revealVisibleOrPassed();

    window.addEventListener('scroll', revealVisibleOrPassed, { passive: true });
    window.addEventListener('hashchange', revealVisibleOrPassed);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', revealVisibleOrPassed);
      window.removeEventListener('hashchange', revealVisibleOrPassed);
    };
  }, []);
}
