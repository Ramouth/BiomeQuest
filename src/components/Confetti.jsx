/**
 * Confetti Component
 * Full-screen confetti animation overlay
 */

import React, { useEffect, useState } from 'react';

const CONFETTI_COLORS = [
  '#f94144', '#f3722c', '#f8961e', '#f9c74f', '#90be6d',
  '#43aa8b', '#577590', '#9b5de5', '#f15bb5', '#00bbf9'
];

const CONFETTI_SHAPES = ['square', 'circle', 'triangle'];

const createConfettiPiece = (id) => ({
  id,
  x: Math.random() * 100,
  delay: Math.random() * 3,
  duration: 3 + Math.random() * 2,
  color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
  shape: CONFETTI_SHAPES[Math.floor(Math.random() * CONFETTI_SHAPES.length)],
  size: 8 + Math.random() * 8,
  rotation: Math.random() * 360,
  rotationSpeed: (Math.random() - 0.5) * 720
});

const ConfettiPiece = ({ piece }) => {
  const shapeStyle = {
    position: 'absolute',
    left: `${piece.x}%`,
    top: '-20px',
    width: `${piece.size}px`,
    height: `${piece.size}px`,
    backgroundColor: piece.shape !== 'triangle' ? piece.color : 'transparent',
    borderRadius: piece.shape === 'circle' ? '50%' : '0',
    borderLeft: piece.shape === 'triangle' ? `${piece.size / 2}px solid transparent` : 'none',
    borderRight: piece.shape === 'triangle' ? `${piece.size / 2}px solid transparent` : 'none',
    borderBottom: piece.shape === 'triangle' ? `${piece.size}px solid ${piece.color}` : 'none',
    animation: `confetti-fall ${piece.duration}s ease-in ${piece.delay}s forwards`,
    transform: `rotate(${piece.rotation}deg)`,
    opacity: 0
  };

  return <div style={shapeStyle} />;
};

const Confetti = ({ isActive, onComplete, pieceCount = 100 }) => {
  const [pieces, setPieces] = useState([]);

  useEffect(() => {
    if (isActive) {
      // Create confetti pieces
      const newPieces = Array.from({ length: pieceCount }, (_, i) => createConfettiPiece(i));
      setPieces(newPieces);

      // Auto-complete after animation
      const maxDuration = Math.max(...newPieces.map(p => (p.delay + p.duration) * 1000));
      const timer = setTimeout(() => {
        if (onComplete) onComplete();
      }, maxDuration + 500);

      return () => clearTimeout(timer);
    } else {
      setPieces([]);
    }
  }, [isActive, pieceCount, onComplete]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {pieces.map(piece => (
        <ConfettiPiece key={piece.id} piece={piece} />
      ))}
      <style>{`
        @keyframes confetti-fall {
          0% {
            opacity: 1;
            transform: translateY(0) rotate(0deg);
          }
          100% {
            opacity: 0;
            transform: translateY(100vh) rotate(720deg);
          }
        }
      `}</style>
    </div>
  );
};

export default Confetti;
