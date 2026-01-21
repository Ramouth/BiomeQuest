import React from 'react';

const CelebrationScreen = ({ message, animationsEnabled = true, isSuperfood = false }) => {
  return (
    <div className={`h-screen w-screen flex items-center justify-center p-6 relative overflow-hidden fixed inset-0 ${
      isSuperfood
        ? 'bg-gradient-to-b from-purple-200 via-pink-100 to-purple-50 dark:from-purple-900 dark:via-pink-900/50 dark:to-gray-900'
        : 'bg-gradient-to-b from-green-100 to-green-50 dark:from-gray-900 dark:to-gray-800'
    }`}>
      {/* Animated background particles - now organic */}
      {animationsEnabled && !isSuperfood && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-3 h-3 bg-yellow-400/70 rounded-full blur-[1px] animate-bg-spore-1"></div>
          <div className="absolute top-32 right-16 w-4 h-4 bg-pink-400/60 rounded-full blur-[1px] animate-bg-spore-2"></div>
          <div className="absolute bottom-32 left-16 w-4 h-4 bg-green-400/70 rounded-full blur-[1px] animate-bg-spore-3"></div>
          <div className="absolute bottom-20 right-10 w-3 h-3 bg-orange-400/60 rounded-full blur-[1px] animate-bg-spore-4"></div>
          <div className="absolute top-1/2 left-20 w-2 h-2 bg-blue-400/50 rounded-full blur-[1px] animate-bg-spore-5"></div>
          <div className="absolute top-1/3 right-24 w-3 h-3 bg-purple-400/60 rounded-full blur-[1px] animate-bg-spore-6"></div>
        </div>
      )}

      {/* SUPERFOOD intense background particles */}
      {animationsEnabled && isSuperfood && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Lightning bolts */}
          <div className="absolute top-10 left-1/4 text-4xl animate-super-lightning-1">⚡</div>
          <div className="absolute top-20 right-1/4 text-3xl animate-super-lightning-2">⚡</div>
          <div className="absolute bottom-40 left-1/3 text-5xl animate-super-lightning-3">⚡</div>
          <div className="absolute bottom-20 right-1/3 text-4xl animate-super-lightning-4">⚡</div>

          {/* Sparkles */}
          <div className="absolute top-16 left-8 text-2xl animate-super-sparkle-1">✨</div>
          <div className="absolute top-28 right-12 text-3xl animate-super-sparkle-2">✨</div>
          <div className="absolute bottom-36 left-12 text-2xl animate-super-sparkle-3">✨</div>
          <div className="absolute bottom-24 right-8 text-3xl animate-super-sparkle-4">✨</div>
          <div className="absolute top-1/2 left-6 text-xl animate-super-sparkle-5">✨</div>
          <div className="absolute top-1/3 right-6 text-2xl animate-super-sparkle-6">✨</div>

          {/* Purple/pink energy orbs */}
          <div className="absolute top-24 left-16 w-5 h-5 bg-purple-500/80 rounded-full blur-sm animate-super-orb-1"></div>
          <div className="absolute top-40 right-20 w-6 h-6 bg-pink-500/70 rounded-full blur-sm animate-super-orb-2"></div>
          <div className="absolute bottom-40 left-20 w-6 h-6 bg-fuchsia-500/80 rounded-full blur-sm animate-super-orb-3"></div>
          <div className="absolute bottom-28 right-16 w-5 h-5 bg-violet-500/70 rounded-full blur-sm animate-super-orb-4"></div>
          <div className="absolute top-1/2 left-24 w-4 h-4 bg-purple-400/60 rounded-full blur-sm animate-super-orb-5"></div>
          <div className="absolute top-1/3 right-28 w-5 h-5 bg-pink-400/70 rounded-full blur-sm animate-super-orb-6"></div>

          {/* Extra energy rings */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border-4 border-purple-400/30 rounded-full animate-super-ring-1"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 border-4 border-pink-400/20 rounded-full animate-super-ring-2"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[28rem] h-[28rem] border-2 border-fuchsia-400/20 rounded-full animate-super-ring-3"></div>
        </div>
      )}

      <div className="text-center relative z-10">
        {/* Main celebration circle with BiomeDude */}
        <div className="relative mb-8">
          <div className={`w-72 h-72 rounded-full flex items-center justify-center mx-auto shadow-2xl relative overflow-hidden ${
            isSuperfood
              ? 'bg-gradient-to-br from-purple-300 via-pink-300 to-fuchsia-300 animate-super-breathe'
              : animationsEnabled
                ? 'bg-gradient-to-br from-green-200 via-emerald-200 to-teal-200 animate-celebrate-breathe'
                : 'bg-gradient-to-br from-green-200 via-emerald-200 to-teal-200'
          }`}>
            {/* Organic flowing blobs */}
            {animationsEnabled && !isSuperfood && (
              <>
                <div className="absolute w-28 h-28 bg-white/35 rounded-full blur-lg animate-celebrate-blob-1" style={{ top: '-8%', left: '-8%' }} />
                <div className="absolute w-24 h-24 bg-teal-300/30 rounded-full blur-lg animate-celebrate-blob-2" style={{ bottom: '-5%', right: '-5%' }} />
                <div className="absolute w-20 h-20 bg-emerald-200/25 rounded-full blur-lg animate-celebrate-blob-3" style={{ top: '50%', left: '55%' }} />
              </>
            )}

            {/* SUPERFOOD flowing blobs - more intense */}
            {animationsEnabled && isSuperfood && (
              <>
                <div className="absolute w-32 h-32 bg-white/50 rounded-full blur-lg animate-super-blob-1" style={{ top: '-10%', left: '-10%' }} />
                <div className="absolute w-28 h-28 bg-pink-300/50 rounded-full blur-lg animate-super-blob-2" style={{ bottom: '-8%', right: '-8%' }} />
                <div className="absolute w-24 h-24 bg-purple-200/40 rounded-full blur-lg animate-super-blob-3" style={{ top: '45%', left: '50%' }} />
                <div className="absolute w-20 h-20 bg-fuchsia-300/35 rounded-full blur-lg animate-super-blob-4" style={{ top: '20%', right: '10%' }} />
              </>
            )}

            {/* Breathing inner glow */}
            <div className={`absolute inset-0 rounded-full ${
              isSuperfood
                ? 'bg-gradient-to-br from-white/50 via-transparent to-purple-300/30 animate-super-glow'
                : animationsEnabled
                  ? 'bg-gradient-to-br from-white/40 via-transparent to-green-300/20 animate-celebrate-glow'
                  : 'bg-gradient-to-br from-white/40 via-transparent to-green-300/20 opacity-50'
            }`}></div>

            {/* Floating spores inside */}
            {animationsEnabled && !isSuperfood && (
              <>
                <div className="absolute w-3 h-3 bg-white/70 rounded-full animate-celebrate-spore-1" style={{ top: '15%', right: '20%' }} />
                <div className="absolute w-2 h-2 bg-white/50 rounded-full animate-celebrate-spore-2" style={{ bottom: '20%', left: '18%' }} />
                <div className="absolute w-2 h-2 bg-green-100/60 rounded-full animate-celebrate-spore-3" style={{ top: '60%', right: '15%' }} />
                <div className="absolute w-1.5 h-1.5 bg-white/40 rounded-full animate-celebrate-spore-4" style={{ top: '25%', left: '22%' }} />
              </>
            )}

            {/* SUPERFOOD spores - more and faster */}
            {animationsEnabled && isSuperfood && (
              <>
                <div className="absolute w-4 h-4 bg-white/80 rounded-full animate-super-spore-1" style={{ top: '12%', right: '18%' }} />
                <div className="absolute w-3 h-3 bg-pink-200/70 rounded-full animate-super-spore-2" style={{ bottom: '18%', left: '15%' }} />
                <div className="absolute w-3 h-3 bg-purple-100/80 rounded-full animate-super-spore-3" style={{ top: '55%', right: '12%' }} />
                <div className="absolute w-2 h-2 bg-white/60 rounded-full animate-super-spore-4" style={{ top: '22%', left: '20%' }} />
                <div className="absolute w-2 h-2 bg-fuchsia-200/70 rounded-full animate-super-spore-5" style={{ bottom: '30%', right: '25%' }} />
                <div className="absolute w-3 h-3 bg-white/50 rounded-full animate-super-spore-6" style={{ top: '40%', left: '12%' }} />
              </>
            )}

            {/* BiomeDude container */}
            <div className={`relative w-36 h-36 bg-white/90 rounded-full flex items-center justify-center shadow-xl ${
              isSuperfood
                ? 'border-4 border-purple-300/70 animate-super-float'
                : animationsEnabled
                  ? 'border-4 border-pink-200/70 animate-celebrate-float'
                  : 'border-4 border-pink-200/70'
            }`}>
              <img
                src="/BiomeDude.png"
                alt="BiomeDude celebrating"
                className={`w-28 h-28 object-contain ${isSuperfood ? 'animate-super-shake' : ''}`}
              />
            </div>
          </div>

          {/* SUPERFOOD crown/badge above the circle */}
          {isSuperfood && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-lg font-black px-6 py-2 rounded-full shadow-lg animate-bounce flex items-center gap-2">
              <span>⚡</span> SUPERFOOD <span>⚡</span>
            </div>
          )}
        </div>

        {/* Celebration message */}
        <h2 className={`text-4xl font-black px-4 ${
          isSuperfood
            ? 'text-purple-700 dark:text-purple-300 animate-super-pulse'
            : animationsEnabled
              ? 'text-gray-800 dark:text-white animate-pulse'
              : 'text-gray-800 dark:text-white'
        }`}>
          {message}
        </h2>

        {/* SUPERFOOD bonus points indicator */}
        {isSuperfood && (
          <div className="mt-4 text-xl font-bold text-pink-600 dark:text-pink-400 animate-bounce">
            GUT HEALTH BOOST! 🦠💪
          </div>
        )}
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

        /* SUPERFOOD INTENSE ANIMATIONS */
        @keyframes super-breathe {
          0%, 100% { transform: scale(1); }
          15% { transform: scale(1.06); }
          30% { transform: scale(0.97); }
          45% { transform: scale(1.04); }
          60% { transform: scale(0.98); }
          75% { transform: scale(1.05); }
          90% { transform: scale(0.99); }
        }

        @keyframes super-blob-1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          20% { transform: translate(25px, 15px) scale(1.4); }
          40% { transform: translate(15px, 30px) scale(0.85); }
          60% { transform: translate(-10px, 20px) scale(1.2); }
          80% { transform: translate(5px, 5px) scale(1.1); }
        }

        @keyframes super-blob-2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(-25px, -25px) scale(1.4); }
          50% { transform: translate(-30px, 10px) scale(0.8); }
          75% { transform: translate(-10px, -15px) scale(1.2); }
        }

        @keyframes super-blob-3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          15% { transform: translate(-25px, -15px) scale(1.5); }
          40% { transform: translate(-15px, 25px) scale(0.75); }
          65% { transform: translate(20px, 10px) scale(1.3); }
          85% { transform: translate(5px, -5px) scale(1.1); }
        }

        @keyframes super-blob-4 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          30% { transform: translate(15px, -20px) scale(1.35); }
          60% { transform: translate(-20px, -10px) scale(0.9); }
        }

        @keyframes super-glow {
          0%, 100% { opacity: 0.9; }
          25% { opacity: 0.5; }
          50% { opacity: 1; }
          75% { opacity: 0.6; }
        }

        @keyframes super-spore-1 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.8; }
          15% { transform: translate(-12px, -18px) scale(1.4); opacity: 0.5; }
          30% { transform: translate(8px, -30px) scale(0.8); opacity: 1; }
          50% { transform: translate(18px, -15px) scale(1.5); opacity: 0.4; }
          70% { transform: translate(5px, -5px) scale(1.2); opacity: 0.9; }
        }

        @keyframes super-spore-2 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.7; }
          12% { transform: translate(15px, 12px) scale(1.5); opacity: 0.9; }
          28% { transform: translate(25px, -10px) scale(0.7); opacity: 0.4; }
          45% { transform: translate(12px, -22px) scale(1.4); opacity: 1; }
          65% { transform: translate(-8px, -12px) scale(1.1); opacity: 0.6; }
        }

        @keyframes super-spore-3 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.8; }
          20% { transform: translate(-15px, 15px) scale(0.8); opacity: 0.5; }
          40% { transform: translate(-22px, -10px) scale(1.5); opacity: 0.9; }
          60% { transform: translate(-8px, 20px) scale(1.1); opacity: 0.6; }
        }

        @keyframes super-spore-4 {
          0%, 100% { transform: translate(0, 0); opacity: 0.6; }
          25% { transform: translate(18px, -14px); opacity: 0.9; }
          50% { transform: translate(8px, 18px); opacity: 0.4; }
          75% { transform: translate(-10px, 5px); opacity: 0.8; }
        }

        @keyframes super-spore-5 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.7; }
          18% { transform: translate(-10px, -20px) scale(1.3); opacity: 0.5; }
          38% { transform: translate(15px, -10px) scale(0.9); opacity: 0.9; }
          58% { transform: translate(5px, 15px) scale(1.2); opacity: 0.6; }
        }

        @keyframes super-spore-6 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.5; }
          22% { transform: translate(12px, 8px) scale(1.4); opacity: 0.8; }
          48% { transform: translate(-8px, 20px) scale(0.85); opacity: 0.4; }
          72% { transform: translate(-15px, 5px) scale(1.15); opacity: 0.7; }
        }

        @keyframes super-float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          20% { transform: translateY(-10px) rotate(2deg); }
          40% { transform: translateY(5px) rotate(-1deg); }
          60% { transform: translateY(-8px) rotate(1.5deg); }
          80% { transform: translateY(3px) rotate(-0.5deg); }
        }

        @keyframes super-shake {
          0%, 100% { transform: rotate(0deg); }
          10% { transform: rotate(-3deg); }
          20% { transform: rotate(3deg); }
          30% { transform: rotate(-2deg); }
          40% { transform: rotate(2deg); }
          50% { transform: rotate(0deg); }
        }

        @keyframes super-pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.9; }
        }

        @keyframes super-lightning-1 {
          0%, 100% { opacity: 0.3; transform: scale(1) rotate(0deg); }
          25% { opacity: 1; transform: scale(1.2) rotate(5deg); }
          50% { opacity: 0.4; transform: scale(0.9) rotate(-3deg); }
          75% { opacity: 0.9; transform: scale(1.1) rotate(2deg); }
        }

        @keyframes super-lightning-2 {
          0%, 100% { opacity: 0.4; transform: scale(1) rotate(0deg); }
          30% { opacity: 1; transform: scale(1.3) rotate(-5deg); }
          60% { opacity: 0.3; transform: scale(0.85) rotate(3deg); }
        }

        @keyframes super-lightning-3 {
          0%, 100% { opacity: 0.2; transform: scale(1) rotate(0deg); }
          20% { opacity: 0.9; transform: scale(1.25) rotate(8deg); }
          45% { opacity: 0.5; transform: scale(0.9) rotate(-4deg); }
          70% { opacity: 1; transform: scale(1.15) rotate(3deg); }
        }

        @keyframes super-lightning-4 {
          0%, 100% { opacity: 0.35; transform: scale(1); }
          35% { opacity: 1; transform: scale(1.2); }
          65% { opacity: 0.25; transform: scale(0.95); }
        }

        @keyframes super-sparkle-1 {
          0%, 100% { opacity: 0.5; transform: scale(1) rotate(0deg); }
          50% { opacity: 1; transform: scale(1.3) rotate(180deg); }
        }

        @keyframes super-sparkle-2 {
          0%, 100% { opacity: 0.6; transform: scale(1) rotate(0deg); }
          50% { opacity: 1; transform: scale(1.4) rotate(-180deg); }
        }

        @keyframes super-sparkle-3 {
          0%, 100% { opacity: 0.4; transform: scale(1) rotate(0deg); }
          50% { opacity: 1; transform: scale(1.35) rotate(180deg); }
        }

        @keyframes super-sparkle-4 {
          0%, 100% { opacity: 0.55; transform: scale(1) rotate(0deg); }
          50% { opacity: 1; transform: scale(1.25) rotate(-180deg); }
        }

        @keyframes super-sparkle-5 {
          0%, 100% { opacity: 0.45; transform: scale(1) rotate(0deg); }
          50% { opacity: 1; transform: scale(1.3) rotate(180deg); }
        }

        @keyframes super-sparkle-6 {
          0%, 100% { opacity: 0.5; transform: scale(1) rotate(0deg); }
          50% { opacity: 1; transform: scale(1.35) rotate(-180deg); }
        }

        @keyframes super-orb-1 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.8; }
          25% { transform: translate(20px, -30px) scale(1.5); opacity: 0.5; }
          50% { transform: translate(-15px, -50px) scale(0.9); opacity: 0.9; }
          75% { transform: translate(30px, -20px) scale(1.2); opacity: 0.6; }
        }

        @keyframes super-orb-2 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.7; }
          33% { transform: translate(-25px, 35px) scale(1.6); opacity: 0.9; }
          66% { transform: translate(20px, 15px) scale(0.85); opacity: 0.5; }
        }

        @keyframes super-orb-3 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.8; }
          20% { transform: translate(35px, -20px) scale(1.4); opacity: 0.6; }
          50% { transform: translate(15px, 30px) scale(0.9); opacity: 1; }
          80% { transform: translate(-20px, 8px) scale(1.3); opacity: 0.7; }
        }

        @keyframes super-orb-4 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.7; }
          30% { transform: translate(-25px, -30px) scale(1.5); opacity: 0.9; }
          60% { transform: translate(18px, -12px) scale(0.95); opacity: 0.5; }
        }

        @keyframes super-orb-5 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.6; }
          25% { transform: translate(28px, 20px) scale(1.4); opacity: 0.8; }
          50% { transform: translate(-12px, 40px) scale(0.85); opacity: 0.5; }
          75% { transform: translate(-20px, 15px) scale(1.2); opacity: 0.7; }
        }

        @keyframes super-orb-6 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.7; }
          35% { transform: translate(-30px, -25px) scale(1.45); opacity: 0.5; }
          65% { transform: translate(15px, -40px) scale(0.9); opacity: 0.9; }
        }

        @keyframes super-ring-1 {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
          50% { transform: translate(-50%, -50%) scale(1.15); opacity: 0.15; }
        }

        @keyframes super-ring-2 {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.2; }
          50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.1; }
        }

        @keyframes super-ring-3 {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.2; }
          50% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.08; }
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

        /* SUPERFOOD animation classes */
        .animate-super-breathe { animation: super-breathe 3s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
        .animate-super-blob-1 { animation: super-blob-1 5s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
        .animate-super-blob-2 { animation: super-blob-2 6s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
        .animate-super-blob-3 { animation: super-blob-3 7s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
        .animate-super-blob-4 { animation: super-blob-4 5.5s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
        .animate-super-glow { animation: super-glow 3s ease-in-out infinite; }
        .animate-super-spore-1 { animation: super-spore-1 4s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
        .animate-super-spore-2 { animation: super-spore-2 5s cubic-bezier(0.4, 0, 0.2, 1) infinite 0.3s; }
        .animate-super-spore-3 { animation: super-spore-3 4.5s cubic-bezier(0.4, 0, 0.2, 1) infinite 0.6s; }
        .animate-super-spore-4 { animation: super-spore-4 3.5s cubic-bezier(0.4, 0, 0.2, 1) infinite 0.9s; }
        .animate-super-spore-5 { animation: super-spore-5 4s cubic-bezier(0.4, 0, 0.2, 1) infinite 1.2s; }
        .animate-super-spore-6 { animation: super-spore-6 5s cubic-bezier(0.4, 0, 0.2, 1) infinite 0.4s; }
        .animate-super-float { animation: super-float 2.5s ease-in-out infinite; }
        .animate-super-shake { animation: super-shake 0.8s ease-in-out infinite; }
        .animate-super-pulse { animation: super-pulse 1.5s ease-in-out infinite; }
        .animate-super-lightning-1 { animation: super-lightning-1 2s ease-in-out infinite; }
        .animate-super-lightning-2 { animation: super-lightning-2 2.5s ease-in-out infinite 0.3s; }
        .animate-super-lightning-3 { animation: super-lightning-3 3s ease-in-out infinite 0.6s; }
        .animate-super-lightning-4 { animation: super-lightning-4 2.2s ease-in-out infinite 0.9s; }
        .animate-super-sparkle-1 { animation: super-sparkle-1 1.5s ease-in-out infinite; }
        .animate-super-sparkle-2 { animation: super-sparkle-2 1.8s ease-in-out infinite 0.2s; }
        .animate-super-sparkle-3 { animation: super-sparkle-3 1.6s ease-in-out infinite 0.4s; }
        .animate-super-sparkle-4 { animation: super-sparkle-4 1.7s ease-in-out infinite 0.6s; }
        .animate-super-sparkle-5 { animation: super-sparkle-5 1.4s ease-in-out infinite 0.8s; }
        .animate-super-sparkle-6 { animation: super-sparkle-6 1.9s ease-in-out infinite 0.3s; }
        .animate-super-orb-1 { animation: super-orb-1 5s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
        .animate-super-orb-2 { animation: super-orb-2 6s cubic-bezier(0.4, 0, 0.2, 1) infinite 0.3s; }
        .animate-super-orb-3 { animation: super-orb-3 5.5s cubic-bezier(0.4, 0, 0.2, 1) infinite 0.6s; }
        .animate-super-orb-4 { animation: super-orb-4 4.5s cubic-bezier(0.4, 0, 0.2, 1) infinite 0.9s; }
        .animate-super-orb-5 { animation: super-orb-5 6.5s cubic-bezier(0.4, 0, 0.2, 1) infinite 0.4s; }
        .animate-super-orb-6 { animation: super-orb-6 5s cubic-bezier(0.4, 0, 0.2, 1) infinite 0.7s; }
        .animate-super-ring-1 { animation: super-ring-1 3s ease-in-out infinite; }
        .animate-super-ring-2 { animation: super-ring-2 4s ease-in-out infinite 0.5s; }
        .animate-super-ring-3 { animation: super-ring-3 5s ease-in-out infinite 1s; }
      `}</style>
    </div>
  );
};

export default CelebrationScreen;
