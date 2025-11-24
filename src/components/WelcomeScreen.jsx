import React from 'react';

const WelcomeScreen = ({ onStart }) => {
  return (
    <div className="h-screen w-screen bg-gradient-to-b from-green-50 via-green-50 to-white flex flex-col items-center justify-between p-6 overflow-hidden fixed inset-0">
      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md">
        {/* Image placeholder with decorative background */}
        <div className="relative mb-8 w-full max-w-xs">
          <div className="absolute inset-0 bg-green-200 rounded-full blur-3xl opacity-20 scale-110"></div>
          <div 
            className="relative w-full aspect-square rounded-3xl flex items-center justify-center overflow-hidden"
            style={{ 
              background: 'linear-gradient(135deg, rgba(232, 245, 233, 0.8) 0%, rgba(200, 230, 201, 0.6) 50%, rgba(165, 214, 167, 0.4) 100%)'
            }}
          >
            {/* Decorative veggie elements */}
            <svg width="100%" height="100%" viewBox="0 0 300 300" className="opacity-30">
              <circle cx="80" cy="100" r="60" fill="#A5D6A7" />
              <circle cx="220" cy="120" r="50" fill="#C8E6C9" />
              <circle cx="150" cy="220" r="70" fill="#81C784" />
              <ellipse cx="100" cy="200" rx="40" ry="50" fill="#4CAF50" opacity="0.3" />
              <ellipse cx="200" cy="80" rx="35" ry="45" fill="#66BB6A" opacity="0.3" />
            </svg>
          </div>
        </div>

        {/* Text content */}
        <div className="text-center mb-8">
          <p className="text-gray-600 text-lg mb-3 font-medium">
            Plant diversity = Gut diversity
          </p>
          
          <h1 className="text-5xl font-black text-gray-900 mb-2 tracking-tight leading-tight">
            Start your
          </h1>
          <h1 className="text-5xl font-black text-gray-900 tracking-tight leading-tight">
            quest
          </h1>
        </div>

        {/* Start button */}
        <button
          onClick={onStart}
          className="w-full max-w-xs bg-green-600 hover:bg-green-700 text-white font-bold text-lg py-4 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-95 transition-all duration-200 uppercase tracking-wide"
        >
          START
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;