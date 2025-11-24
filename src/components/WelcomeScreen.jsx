import React from 'react';

const WelcomeScreen = ({ onStart }) => {
  return (
    <div className="h-screen w-screen bg-white flex flex-col fixed inset-0 overflow-hidden">
      {/* Scrollable content container */}
      <div className="flex-1 overflow-y-auto overscroll-none" style={{ WebkitOverflowScrolling: 'touch' }}>
        <div className="min-h-full flex flex-col items-center justify-center p-6 py-12">
          
          {/* Content wrapper */}
          <div className="flex flex-col items-center w-full max-w-md space-y-8">
            
            {/* Image with gradient overlay */}
            <div className="relative w-full max-w-[280px]">
              {/* Decorative glow */}
              <div className="absolute inset-0 bg-green-200 rounded-3xl blur-3xl opacity-20 scale-110"></div>
              
              {/* Image container */}
              <div className="relative w-full aspect-square rounded-3xl overflow-hidden shadow-xl">
                <img 
                  src="/fruitsandplants.jpg" 
                  alt="Colorful fruits and plants"
                  className="w-full h-full object-cover"
                />
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-400/30 via-transparent to-green-600/20"></div>
                
                {/* Vignette */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10"></div>
              </div>
            </div>

            {/* Text content */}
            <div className="text-center space-y-3 px-4">
              <p className="text-gray-700 text-lg font-semibold tracking-wide">
                Plant diversity = Gut diversity
              </p>
              
              <h1 className="text-5xl font-black text-gray-900 tracking-tight leading-tight">
                Start your
                <br />
                quest
              </h1>
            </div>

            {/* Spacer */}
            <div className="h-2"></div>

            {/* START button - highly visible */}
            <button
              onClick={onStart}
              className="w-full max-w-sm bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-black text-2xl py-6 px-10 rounded-full shadow-2xl hover:shadow-green-600/60 transform hover:scale-[1.03] active:scale-95 transition-all duration-200 uppercase tracking-widest border-4 border-green-700 ring-4 ring-green-200 ring-offset-2"
            >
              START
            </button>

            {/* Bottom padding to ensure button is always visible */}
            <div className="h-12"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;