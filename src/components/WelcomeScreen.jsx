import React from 'react';

const WelcomeScreen = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 p-6 text-center">
      <h1 className="text-5xl font-extrabold text-green-800 mb-6 drop-shadow-sm">
        BiomeQuest 🌿
      </h1>
      <p className="text-xl text-green-700 mb-8 max-w-lg leading-relaxed">
        Your gut microbes are hungry! Feed them a diverse diet to win.
      </p>
      
      <button 
        onClick={onStart}
        className="px-8 py-4 bg-green-600 text-white text-xl font-bold rounded-full shadow-xl hover:bg-green-500 hover:scale-105 transition-all active:scale-95"
      >
        Start Feeding 🍎
      </button>
    </div>
  );
};

export default WelcomeScreen;