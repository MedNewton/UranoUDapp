import { useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import stellato from '../../assets/img/bgdark.png';

const StarryBackground = () => {
  const { isDark } = useTheme();
  const containerRef = useRef(null);

  return (
    <>
      {/* Layer stellato con bassa opacità */}
      {isDark && (
        <div 
          className="fixed inset-0 pointer-events-none z-0"
          style={{
            backgroundImage: `url(${stellato})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            opacity: 0.4,
            mixBlendMode: 'lighten',
          }}
          aria-hidden="true"
        />
      )}

      {/* Manteniamo il container originale per compatibilità */}
      <div 
        ref={containerRef} 
        className={`starry-background ${isDark ? 'opacity-0' : 'opacity-0'}`}
        aria-hidden="true"
      />
    </>
  );
};

export default StarryBackground; 