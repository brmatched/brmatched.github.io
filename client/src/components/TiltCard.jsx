import { useRef } from 'react';

export default function TiltCard({
  children,
  onClick,
  disabled = false,
  className = '',
  title,
  ariaLabel,
  accentColor = '#f5c542',
}) {
  const cardRef = useRef(null);

  function handleMove(e) {
    if (disabled || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rotateY = (x - 0.5) * 16;
    const rotateX = (0.5 - y) * 14;
    cardRef.current.style.setProperty('--rx', `${rotateX.toFixed(2)}deg`);
    cardRef.current.style.setProperty('--ry', `${rotateY.toFixed(2)}deg`);
    cardRef.current.style.setProperty('--gx', `${(x * 100).toFixed(1)}%`);
    cardRef.current.style.setProperty('--gy', `${(y * 100).toFixed(1)}%`);
  }

  function handleLeave() {
    if (!cardRef.current) return;
    cardRef.current.style.setProperty('--rx', '0deg');
    cardRef.current.style.setProperty('--ry', '0deg');
    cardRef.current.style.setProperty('--gx', '50%');
    cardRef.current.style.setProperty('--gy', '50%');
  }

  return (
    <button
      ref={cardRef}
      type="button"
      disabled={disabled}
      onClick={onClick}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      title={title}
      aria-label={ariaLabel}
      className={`tilt-card ${className}`}
      style={{ '--card-accent': accentColor }}
    >
      <div className="tilt-card-inner">
        {children}
        <span className="tilt-card-glare" aria-hidden="true" />
      </div>
    </button>
  );
}
