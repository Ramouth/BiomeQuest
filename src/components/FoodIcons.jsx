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

export const OrangeIcon = ({ size = 80 }) => (
  <div style={{ fontSize: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    🍊
  </div>
);

export const StrawberryIcon = ({ size = 80 }) => (
  <div style={{ fontSize: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    🍓
  </div>
);

export const BlueberryIcon = ({ size = 80 }) => (
  <div style={{ fontSize: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    🫐
  </div>
);

export const WatermelonIcon = ({ size = 80 }) => (
  <div style={{ fontSize: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    🍉
  </div>
);

export const GrapeIcon = ({ size = 80 }) => (
  <div style={{ fontSize: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    🍇
  </div>
);

export const PineappleIcon = ({ size = 80 }) => (
  <div style={{ fontSize: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    🍍
  </div>
);

export const PapayaIcon = ({ size = 80 }) => (
  <div style={{ fontSize: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    🧡
  </div>
);

export const VeggieIcons = ({ size = 60, veggies = ['🥕', '🥬', '🌽'] }) => (
  <div style={{ display: 'flex', gap: '10px', fontSize: size, alignItems: 'center', justifyContent: 'center' }}>
    {veggies.map((veggie, index) => (
      <span key={index}>{veggie}</span>
    ))}
  </div>
);