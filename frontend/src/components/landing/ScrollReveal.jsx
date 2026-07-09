import React from 'react';
import useScrollReveal from '../../hooks/useScrollReveal';

const ScrollReveal = ({ children, className = '' }) => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <div
      ref={ref}
      className={`section-reveal ${isVisible ? 'section-reveal-visible' : ''} ${className}`}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;
