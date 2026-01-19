import React from 'react';

const CelebrationScreen = ({ message, animationsEnabled = true }) => {
  return (
    <div className="h-screen w-screen bg-gradient-to-b from-green-100 to-green-50 flex items-center justify-center p-6 relative overflow-hidden fixed inset-0">
      {/* Animated background particles */}
      {animationsEnabled && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
          <div className="absolute top-32 right-16 w-4 h-4 bg-pink-400 rounded-full animate-ping" style={{ animationDelay: '0.2s' }}></div>
          <div className="absolute bottom-32 left-16 w-4 h-4 bg-green-400 rounded-full animate-ping" style={{ animationDelay: '0.4s' }}></div>
          <div className="absolute bottom-20 right-10 w-3 h-3 bg-orange-400 rounded-full animate-ping" style={{ animationDelay: '0.1s' }}></div>
          <div className="absolute top-1/2 left-20 w-2 h-2 bg-blue-400 rounded-full animate-ping" style={{ animationDelay: '0.3s' }}></div>
          <div className="absolute top-1/3 right-24 w-3 h-3 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
        </div>
      )}

      <div className="text-center relative z-10">
        {/* Main celebration circle with BiomeDude */}
        <div className="relative mb-8">
          <div className={`w-72 h-72 bg-green-200 rounded-full flex items-center justify-center mx-auto shadow-2xl relative ${animationsEnabled ? 'animate-bounce' : ''}`}>
            {/* Inner glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-green-300 rounded-full opacity-50"></div>
            
            {/* BiomeDude container */}
            <div className="relative w-36 h-36 bg-white rounded-full flex items-center justify-center shadow-xl border-4 border-pink-200">
              <img 
                src="/BiomeDude.png" 
                alt="BiomeDude celebrating" 
                className="w-28 h-28 object-contain"
              />
            </div>
          </div>
        </div>
        
        {/* Celebration message */}
        <h2 className={`text-4xl font-black text-gray-800 px-4 ${animationsEnabled ? 'animate-pulse' : ''}`}>
          {message}
        </h2>
      </div>
    </div>
  );
};

export default CelebrationScreen;