import React, { useRef } from 'react';

export default function Card({ children, className = '', onClick }) {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty('--mouse-x', `${x}px`);
    cardRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onClick={onClick}
      className={`bg-govMatte-card border border-govMatte-border rounded-2xl p-5 shadow-md hover:shadow-indigo-950/20 interactive-card matte-transition ${
        onClick ? 'cursor-pointer hover:border-govGreen/40 hover:scale-[1.01]' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}
