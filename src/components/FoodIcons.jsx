import React from 'react';

export const BananaIcon = ({ size = 80 }) => (
  <div style={{ fontSize: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    🍌
  </div>
);

export const AppleIcon = ({ size = 80 }) => (
  <div style={{ fontSize: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    🍎
  </div>
);

export const MangoIcon = ({ size = 80 }) => (
  <div style={{ fontSize: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    🥭
  </div>
);

export const VeggieIcons = ({ size = 60, veggies = ['🥕', '🥬', '🌽'] }) => (
  <div style={{ display: 'flex', gap: '10px', fontSize: size, alignItems: 'center', justifyContent: 'center' }}>
    {veggies.map((veggie, index) => (
      <span key={index}>{veggie}</span>
    ))}
  </div>
);