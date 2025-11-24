import React from 'react';

const MicrobeMascot = ({ size = 80, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Main body - pink circle */}
      <circle cx="50" cy="50" r="35" fill="#F8BBD0" />
      
      {/* Tentacles/arms */}
      <ellipse cx="28" cy="25" rx="6" ry="15" fill="#F8BBD0" transform="rotate(-30 28 25)" />
      <ellipse cx="72" cy="25" rx="6" ry="15" fill="#F8BBD0" transform="rotate(30 72 25)" />
      <ellipse cx="15" cy="45" rx="6" ry="15" fill="#F8BBD0" transform="rotate(-10 15 45)" />
      <ellipse cx="85" cy="45" rx="6" ry="15" fill="#F8BBD0" transform="rotate(10 85 45)" />
      <ellipse cx="28" cy="75" rx="6" ry="15" fill="#F8BBD0" transform="rotate(30 28 75)" />
      <ellipse cx="72" cy="75" rx="6" ry="15" fill="#F8BBD0" transform="rotate(-30 72 75)" />
      
      {/* Eyes */}
      <circle cx="40" cy="45" r="4" fill="#333" />
      <circle cx="60" cy="45" r="4" fill="#333" />
      
      {/* Eye shine */}
      <circle cx="41" cy="44" r="1.5" fill="white" />
      <circle cx="61" cy="44" r="1.5" fill="white" />
      
      {/* Smile */}
      <path
        d="M 40 55 Q 50 62 60 55"
        stroke="#333"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      
      {/* Blush */}
      <ellipse cx="32" cy="52" rx="5" ry="3" fill="#FFB6C1" opacity="0.6" />
      <ellipse cx="68" cy="52" rx="5" ry="3" fill="#FFB6C1" opacity="0.6" />
    </svg>
  );
};

export default MicrobeMascot;