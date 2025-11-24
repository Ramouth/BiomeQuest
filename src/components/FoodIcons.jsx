import React from 'react';

export const BananaIcon = ({ size = 80 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    {/* Main banana body */}
    <path
      d="M 45 25 Q 40 30 40 45 Q 40 65 45 78 Q 47 83 50 83 Q 53 83 55 78 Q 60 65 60 45 Q 60 30 55 25 Q 52 23 50 23 Q 48 23 45 25"
      fill="#FFE135"
      stroke="#E6C200"
      strokeWidth="1.5"
    />
    
    {/* Highlight */}
    <path
      d="M 48 30 Q 46 40 46 55 Q 46 70 48 75"
      stroke="#FFF4A3"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      opacity="0.6"
    />
    
    {/* Shadow/depth */}
    <path
      d="M 53 30 Q 55 40 55 55 Q 55 70 53 75"
      stroke="#D4AF37"
      strokeWidth="1.5"
      fill="none"
      strokeLinecap="round"
      opacity="0.3"
    />
    
    {/* Stem */}
    <rect x="48" y="21" width="4" height="3" fill="#8B7355" rx="1" />
    <ellipse cx="50" cy="21" rx="3" ry="2" fill="#6B5544" />
    
    {/* Bottom tip */}
    <ellipse cx="50" cy="82" rx="2" ry="1.5" fill="#6B5544" opacity="0.5" />
  </svg>
);

export const AppleIcon = ({ size = 80 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    {/* Main apple body - red */}
    <ellipse cx="50" cy="55" rx="28" ry="26" fill="#DC143C" />
    <ellipse cx="50" cy="52" rx="30" ry="28" fill="#FF4444" />
    
    {/* Shine/highlight */}
    <ellipse cx="40" cy="45" rx="14" ry="16" fill="#FF6B6B" opacity="0.4" />
    <ellipse cx="37" cy="42" rx="8" ry="10" fill="white" opacity="0.5" />
    
    {/* Stem */}
    <path
      d="M 50 25 Q 48 20 50 18 Q 52 20 50 25"
      fill="#654321"
      stroke="#4A3219"
      strokeWidth="0.5"
    />
    
    {/* Leaf */}
    <ellipse 
      cx="58" cy="26" 
      rx="9" ry="5" 
      fill="#4CAF50" 
      transform="rotate(15 58 26)" 
    />
    <ellipse 
      cx="58" cy="26" 
      rx="6" ry="3" 
      fill="#66BB6A" 
      opacity="0.7"
      transform="rotate(15 58 26)" 
    />
    
    {/* Leaf vein */}
    <path 
      d="M 56 26 L 60 27" 
      stroke="#2E7D32" 
      strokeWidth="1" 
      opacity="0.5"
    />
    
    {/* Bottom indent */}
    <ellipse cx="50" cy="75" rx="8" ry="4" fill="#C41E3A" opacity="0.3" />
  </svg>
);

export const VeggieIcons = ({ size = 60 }) => (
  <svg width={size * 3} height={size} viewBox="0 0 180 60" xmlns="http://www.w3.org/2000/svg">
    {/* Carrot */}
    <g transform="translate(15, 10)">
      <path 
        d="M 20 12 L 16 38 Q 16 44 20 46 Q 24 44 24 38 L 20 12" 
        fill="#FF7F50"
        stroke="#FF6347"
        strokeWidth="1"
      />
      <path 
        d="M 20 12 L 18 38 Q 18 43 20 46" 
        fill="#FFA07A"
        opacity="0.4"
      />
      {/* Carrot greens */}
      <ellipse cx="20" cy="10" rx="3" ry="2" fill="#4CAF50" />
      <ellipse cx="17" cy="8" rx="2" ry="5" fill="#66BB6A" transform="rotate(-25 17 8)" />
      <ellipse cx="20" cy="7" rx="2" ry="5" fill="#66BB6A" />
      <ellipse cx="23" cy="8" rx="2" ry="5" fill="#66BB6A" transform="rotate(25 23 8)" />
    </g>
    
    {/* Broccoli */}
    <g transform="translate(60, 10)">
      <ellipse cx="20" cy="28" rx="16" ry="18" fill="#4CAF50" />
      <circle cx="14" cy="22" r="8" fill="#66BB6A" />
      <circle cx="26" cy="22" r="8" fill="#66BB6A" />
      <circle cx="20" cy="16" r="7" fill="#81C784" />
      <circle cx="15" cy="30" r="6" fill="#81C784" opacity="0.8" />
      <circle cx="25" cy="30" r="6" fill="#81C784" opacity="0.8" />
      {/* Stem */}
      <rect x="17" y="38" width="6" height="8" fill="#8D6E63" rx="1" />
    </g>
    
    {/* Tomato */}
    <g transform="translate(115, 15)">
      <ellipse cx="18" cy="24" rx="15" ry="14" fill="#FF6347" />
      <ellipse cx="18" cy="22" rx="16" ry="15" fill="#FF7F50" />
      <ellipse cx="13" cy="20" rx="8" ry="10" fill="#FFA07A" opacity="0.4" />
      <ellipse cx="11" cy="18" rx="4" ry="6" fill="white" opacity="0.5" />
      {/* Tomato top */}
      <path d="M 18 10 L 18 15" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" />
      <ellipse cx="18" cy="11" rx="6" ry="3" fill="#66BB6A" />
      <ellipse cx="15" cy="10" rx="3" ry="2" fill="#81C784" transform="rotate(-20 15 10)" />
      <ellipse cx="21" cy="10" rx="3" ry="2" fill="#81C784" transform="rotate(20 21 10)" />
    </g>
  </svg>
);