import React from 'react';

const CelebrationScreen = ({ message, animationsEnabled = true }) => {
  return (
    <div className="h-screen w-screen bg-gradient-to-b from-green-100 to-green-50 flex items-center justify-center p-6 relative overflow-hidden fixed inset-0">
      {/* Animated background particles - now organic */}
      {animationsEnabled && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-3 h-3 bg-yellow-400/70 rounded-full blur-[1px] animate-bg-spore-1"></div>
          <div className="absolute top-32 right-16 w-4 h-4 bg-pink-400/60 rounded-full blur-[1px] animate-bg-spore-2"></div>
          <div className="absolute bottom-32 left-16 w-4 h-4 bg-green-400/70 rounded-full blur-[1px] animate-bg-spore-3"></div>
          <div className="absolute bottom-20 right-10 w-3 h-3 bg-orange-400/60 rounded-full blur-[1px] animate-bg-spore-4"></div>
          <div className="absolute top-1/2 left-20 w-2 h-2 bg-blue-400/50 rounded-full blur-[1px] animate-bg-spore-5"></div>
          <div className="absolute top-1/3 right-24 w-3 h-3 bg-purple-400/60 rounded-full blur-[1px] animate-bg-spore-6"></div>
        </div>
      )}

      <div className="text-center relative z-10">
        {/* Main celebration circle with BiomeDude */}
        <div className="relative mb-8">
          <div className={`w-72 h-72 bg-gradient-to-br from-green-200 via-emerald-200 to-teal-200 rounded-full flex items-center justify-center mx-auto shadow-2xl relative overflow-hidden ${animationsEnabled ? 'animate-celebrate-breathe' : ''}`}>
            {/* Organic flowing blobs */}
            {animationsEnabled && (
              <>
                <div className="absolute w-28 h-28 bg-white/35 rounded-full blur-lg animate-celebrate-blob-1" style={{ top: '-8%', left: '-8%' }} />
                <div className="absolute w-24 h-24 bg-teal-300/30 rounded-full blur-lg animate-celebrate-blob-2" style={{ bottom: '-5%', right: '-5%' }} />
                <div className="absolute w-20 h-20 bg-emerald-200/25 rounded-full blur-lg animate-celebrate-blob-3" style={{ top: '50%', left: '55%' }} />
              </>
            )}

            {/* Breathing inner glow */}
            <div className={`absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-green-300/20 rounded-full ${animationsEnabled ? 'animate-celebrate-glow' : 'opacity-50'}`}></div>

            {/* Floating spores inside */}
            {animationsEnabled && (
              <>
                <div className="absolute w-3 h-3 bg-white/70 rounded-full animate-celebrate-spore-1" style={{ top: '15%', right: '20%' }} />
                <div className="absolute w-2 h-2 bg-white/50 rounded-full animate-celebrate-spore-2" style={{ bottom: '20%', left: '18%' }} />
                <div className="absolute w-2 h-2 bg-green-100/60 rounded-full animate-celebrate-spore-3" style={{ top: '60%', right: '15%' }} />
                <div className="absolute w-1.5 h-1.5 bg-white/40 rounded-full animate-celebrate-spore-4" style={{ top: '25%', left: '22%' }} />
              </>
            )}

            {/* BiomeDude container */}
            <div className={`relative w-36 h-36 bg-white/90 rounded-full flex items-center justify-center shadow-xl border-4 border-pink-200/70 ${animationsEnabled ? 'animate-celebrate-float' : ''}`}>
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

      {/* Organic animations */}
      <style>{`
        @keyframes celebrate-breathe {
          0%, 100% { transform: scale(1); }
          25% { transform: scale(1.03); }
          50% { transform: scale(0.98); }
          75% { transform: scale(1.02); }
        }

        @keyframes celebrate-blob-1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, 12px) scale(1.2); }
          50% { transform: translate(12px, 25px) scale(0.9); }
          75% { transform: translate(-5px, 15px) scale(1.1); }
        }

        @keyframes celebrate-blob-2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-18px, -20px) scale(1.25); }
          66% { transform: translate(-25px, 8px) scale(0.85); }
        }

        @keyframes celebrate-blob-3 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.25; }
          20% { transform: translate(-20px, -12px) scale(1.3); opacity: 0.4; }
          50% { transform: translate(-10px, 20px) scale(0.8); opacity: 0.2; }
          80% { transform: translate(15px, 6px) scale(1.15); opacity: 0.35; }
        }

        @keyframes celebrate-glow {
          0%, 100% { opacity: 0.8; }
          35% { opacity: 0.45; }
          65% { opacity: 0.95; }
        }

        @keyframes celebrate-spore-1 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.7; }
          20% { transform: translate(-8px, -12px) scale(1.2); opacity: 0.5; }
          40% { transform: translate(5px, -20px) scale(0.85); opacity: 0.9; }
          60% { transform: translate(12px, -10px) scale(1.25); opacity: 0.4; }
          80% { transform: translate(3px, -3px) scale(1); opacity: 0.8; }
        }

        @keyframes celebrate-spore-2 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.5; }
          15% { transform: translate(10px, 8px) scale(1.35); opacity: 0.8; }
          35% { transform: translate(18px, -6px) scale(0.75); opacity: 0.4; }
          55% { transform: translate(8px, -15px) scale(1.2); opacity: 0.9; }
          75% { transform: translate(-5px, -8px) scale(1); opacity: 0.6; }
        }

        @keyframes celebrate-spore-3 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.6; }
          25% { transform: translate(-10px, 10px) scale(0.85); opacity: 0.4; }
          50% { transform: translate(-15px, -6px) scale(1.3); opacity: 0.8; }
          75% { transform: translate(-5px, 14px) scale(1); opacity: 0.5; }
        }

        @keyframes celebrate-spore-4 {
          0%, 100% { transform: translate(0, 0); opacity: 0.4; }
          30% { transform: translate(12px, -9px); opacity: 0.7; }
          60% { transform: translate(5px, 12px); opacity: 0.3; }
        }

        @keyframes celebrate-float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          30% { transform: translateY(-6px) rotate(1deg); }
          70% { transform: translateY(3px) rotate(-1deg); }
        }

        @keyframes bg-spore-1 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.7; }
          25% { transform: translate(15px, -20px) scale(1.3); opacity: 0.4; }
          50% { transform: translate(-10px, -35px) scale(0.9); opacity: 0.8; }
          75% { transform: translate(20px, -15px) scale(1.1); opacity: 0.5; }
        }

        @keyframes bg-spore-2 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.6; }
          33% { transform: translate(-20px, 25px) scale(1.4); opacity: 0.8; }
          66% { transform: translate(15px, 10px) scale(0.8); opacity: 0.4; }
        }

        @keyframes bg-spore-3 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.7; }
          20% { transform: translate(25px, -15px) scale(1.2); opacity: 0.5; }
          50% { transform: translate(10px, 20px) scale(0.85); opacity: 0.9; }
          80% { transform: translate(-15px, 5px) scale(1.15); opacity: 0.6; }
        }

        @keyframes bg-spore-4 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.6; }
          30% { transform: translate(-18px, -22px) scale(1.35); opacity: 0.8; }
          60% { transform: translate(12px, -8px) scale(0.9); opacity: 0.4; }
        }

        @keyframes bg-spore-5 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.5; }
          25% { transform: translate(20px, 15px) scale(1.25); opacity: 0.7; }
          50% { transform: translate(-8px, 30px) scale(0.8); opacity: 0.4; }
          75% { transform: translate(-15px, 10px) scale(1.1); opacity: 0.6; }
        }

        @keyframes bg-spore-6 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.6; }
          35% { transform: translate(-25px, -18px) scale(1.3); opacity: 0.4; }
          65% { transform: translate(10px, -30px) scale(0.85); opacity: 0.8; }
        }

        .animate-celebrate-breathe { animation: celebrate-breathe 5s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
        .animate-celebrate-blob-1 { animation: celebrate-blob-1 8s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
        .animate-celebrate-blob-2 { animation: celebrate-blob-2 10s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
        .animate-celebrate-blob-3 { animation: celebrate-blob-3 12s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
        .animate-celebrate-glow { animation: celebrate-glow 6s ease-in-out infinite; }
        .animate-celebrate-spore-1 { animation: celebrate-spore-1 7s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
        .animate-celebrate-spore-2 { animation: celebrate-spore-2 9s cubic-bezier(0.4, 0, 0.2, 1) infinite 0.5s; }
        .animate-celebrate-spore-3 { animation: celebrate-spore-3 8s cubic-bezier(0.4, 0, 0.2, 1) infinite 1s; }
        .animate-celebrate-spore-4 { animation: celebrate-spore-4 6s cubic-bezier(0.4, 0, 0.2, 1) infinite 1.5s; }
        .animate-celebrate-float { animation: celebrate-float 4s ease-in-out infinite; }
        .animate-bg-spore-1 { animation: bg-spore-1 9s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
        .animate-bg-spore-2 { animation: bg-spore-2 11s cubic-bezier(0.4, 0, 0.2, 1) infinite 0.3s; }
        .animate-bg-spore-3 { animation: bg-spore-3 10s cubic-bezier(0.4, 0, 0.2, 1) infinite 0.7s; }
        .animate-bg-spore-4 { animation: bg-spore-4 8s cubic-bezier(0.4, 0, 0.2, 1) infinite 1.2s; }
        .animate-bg-spore-5 { animation: bg-spore-5 12s cubic-bezier(0.4, 0, 0.2, 1) infinite 0.5s; }
        .animate-bg-spore-6 { animation: bg-spore-6 9s cubic-bezier(0.4, 0, 0.2, 1) infinite 0.9s; }
      `}</style>
    </div>
  );
};

export default CelebrationScreen;