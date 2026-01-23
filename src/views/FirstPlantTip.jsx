import React from 'react';

const FirstPlantTip = ({ onContinue, animationsEnabled = true }) => {
  return (
    <div className="h-screen w-screen flex items-center justify-center p-6 relative overflow-hidden fixed inset-0 bg-gradient-to-b from-green-100 to-green-50 dark:from-gray-900 dark:to-gray-800">
      {/* Animated background particles */}
      {animationsEnabled && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-3 h-3 bg-yellow-400/70 rounded-full blur-[1px] animate-float-1"></div>
          <div className="absolute top-32 right-16 w-4 h-4 bg-pink-400/60 rounded-full blur-[1px] animate-float-2"></div>
          <div className="absolute bottom-32 left-16 w-4 h-4 bg-green-400/70 rounded-full blur-[1px] animate-float-3"></div>
          <div className="absolute bottom-20 right-10 w-3 h-3 bg-orange-400/60 rounded-full blur-[1px] animate-float-4"></div>
        </div>
      )}

      <div className="text-center relative z-10 max-w-sm">
        {/* Speech bubble */}
        <div className="relative mb-6">
          <div className="bg-white dark:bg-gray-700 rounded-3xl px-6 py-5 shadow-xl border-2 border-green-200 dark:border-green-700 relative">
            <p className="text-gray-800 dark:text-white text-lg font-semibold leading-relaxed">
              You get <span className="text-green-600 dark:text-green-400 font-bold">5 points</span> from new plants, <span className="text-green-600 dark:text-green-400 font-bold">1 point</span> from the same.
            </p>
            <p className="text-green-600 dark:text-green-400 font-bold text-xl mt-2">
              Plant diversity = Gut diversity!
            </p>

            {/* Speech bubble tail */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent border-t-[16px] border-t-white dark:border-t-gray-700"></div>
            <div className="absolute -bottom-[18px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[14px] border-t-green-200 dark:border-t-green-700 -z-10"></div>
          </div>
        </div>

        {/* BiomeDude */}
        <div className="relative mb-8">
          <div className={`w-40 h-40 mx-auto rounded-full bg-gradient-to-br from-green-200 via-emerald-200 to-teal-200 dark:from-green-800 dark:via-emerald-800 dark:to-teal-800 flex items-center justify-center shadow-2xl ${animationsEnabled ? 'animate-bounce-slow' : ''}`}>
            <img
              src="/BiomeDude.png"
              alt="BiomeDude"
              className="w-28 h-28 object-contain"
            />
          </div>
        </div>

        {/* Continue button */}
        <button
          onClick={onContinue}
          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 px-8 rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95 text-lg"
        >
          Got it!
        </button>
      </div>

      <style>{`
        @keyframes float-1 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(10px, -15px); }
        }
        @keyframes float-2 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-15px, 10px); }
        }
        @keyframes float-3 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(12px, 8px); }
        }
        @keyframes float-4 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-8px, -12px); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-float-1 { animation: float-1 4s ease-in-out infinite; }
        .animate-float-2 { animation: float-2 5s ease-in-out infinite 0.5s; }
        .animate-float-3 { animation: float-3 4.5s ease-in-out infinite 1s; }
        .animate-float-4 { animation: float-4 5.5s ease-in-out infinite 0.3s; }
        .animate-bounce-slow { animation: bounce-slow 2s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default FirstPlantTip;
