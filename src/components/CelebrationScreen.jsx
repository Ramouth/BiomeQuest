import React from 'react';
import MicrobeMascot from './MicrobeMascot';

const CelebrationScreen = ({ message }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-green-50 flex items-center justify-center p-6">
      <div className="text-center">
        {/* Animated mascot */}
        <div className="relative mb-8">
          <div className="w-64 h-64 bg-green-200 rounded-full flex items-center justify-center mx-auto shadow-2xl animate-bounce">
            <div className="w-32 h-32 bg-pink-300 rounded-full flex items-center justify-center shadow-lg">
              <MicrobeMascot size={100} />
            </div>
          </div>
          
          {/* Celebration particles */}
          <div className="absolute top-0 left-1/4 w-4 h-4 bg-yellow-400 rounded-full animate-ping"></div>
          <div className="absolute top-10 right-1/4 w-3 h-3 bg-pink-400 rounded-full animate-ping" style={{ animationDelay: '0.2s' }}></div>
          <div className="absolute bottom-20 left-1/3 w-4 h-4 bg-green-400 rounded-full animate-ping" style={{ animationDelay: '0.4s' }}></div>
          <div className="absolute bottom-10 right-1/3 w-3 h-3 bg-orange-400 rounded-full animate-ping" style={{ animationDelay: '0.1s' }}></div>
        </div>
        
        <h2 className="text-4xl font-bold text-gray-800 animate-pulse">
          {message}
        </h2>
      </div>
    </div>
  );
};

export default CelebrationScreen;                                                                                                                                                                                                                                                                                                                           
