import React from 'react';

export const BananaIcon = ({ size = 80 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    {/* Banana bunch */}
    <path
      d="M 45 20 Q 35 25 35 40 Q 35 60 40 75 Q 42 82 48 82 Q 54 82 56 75 Q 60 60 60 40 Q 60 25 50 20"
      fill="#FFE135"
      stroke="#F4D03F"
      strokeWidth="2"
    />
    <path
      d="M 50 20 Q 60 25 60 40 Q 60 60 55 75 Q 53 82 47 82"
      fill="#FFD700"
      stroke="#F4D03F"
      strokeWidth="2"
    />
    {/* Stem */}
    <ellipse cx="48" cy="18" rx="4" ry="3" fill="#8B6914" />
    {/* Details */}
    <path d="M 40 35 Q 42 50 40 65" stroke="#E6C200" strokeWidth="1.5" fill="none" opacity="0.3" />
    <path d="M 55 35 Q 53 50 55 65" stroke="#F4D03F" strokeWidth="1.5" fill="none" opacity="0.3" />
  </svg>
);

export const AppleIcon = ({ size = 80 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    {/* Apple body */}
    <circle cx="50" cy="55" r="28" fill="#DC143C" />
    <ellipse cx="50" cy="52" rx="30" ry="26" fill="#FF4444" />
    
    {/* Shine/highlight */}
    <ellipse cx="42" cy="45" rx="12" ry="15" fill="#FF6B6B" opacity="0.5" />
    <ellipse cx="38" cy="42" rx="6" ry="8" fill="white" opacity="0.4" />
    
    {/* Stem */}
    <rect x="48" y="20" width="4" height="12" fill="#654321" rx="2" />
    
    {/* Leaf */}
    <ellipse cx="56" cy="24" rx="8" ry="5" fill="#4CAF50" transform="rotate(20 56 24)" />
    <path d="M 56 24 Q 58 26 54 28" stroke="#2E7D32" strokeWidth="1" fill="none" />
  </svg>
);

export const VeggieIcons = ({ size = 60 }) => (
  <svg width={size * 3} height={size} viewBox="0 0 180 60" xmlns="http://www.w3.org/2000/svg">
    {/* Carrot */}
    <g transform="translate(15, 10)">
      <path d="M 20 10 L 15 35 Q 15 42 20 45 Q 25 42 25 35 L 20 10" fill="#FF6B35" />
      <ellipse cx="20" cy="8" rx="3" ry="2" fill="#4CAF50" />
      <ellipse cx="17" cy="6" rx="2" ry="4" fill="#4CAF50" transform="rotate(-20 17 6)" />
      <ellipse cx="23" cy="6" rx="2" ry="4" fill="#4CAF50" transform="rotate(20 23 6)" />
    </g>
    
    {/* Lettuce */}
    <g transform="translate(60, 10)">
      <ellipse cx="20" cy="25" rx="18" ry="20" fill="#81C784" />
      <ellipse cx="15" cy="20" rx="12" ry="15" fill="#A5D6A7" opacity="0.8" />
      <ellipse cx="25" cy="22" rx="10" ry="13" fill="#C8E6C9" opacity="0.7" />
    </g>
    
    {/* Apple (red) */}
    <g transform="translate(110, 15)">
      <circle cx="20" cy="22" r="16" fill="#DC143C" />
      <ellipse cx="20" cy="20" rx="17" ry="15" fill="#FF4444" />
      <ellipse cx="15" cy="17" rx="7" ry="9" fill="#FF6B6B" opacity="0.5" />
      <rect x="19" y="8" width="2" height="8" fill="#654321" rx="1" />
      <ellipse cx="24" cy="10" rx="5" ry="3" fill="#4CAF50" transform="rotate(20 24 10)" />
    </g>
  </svg>
);