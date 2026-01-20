import React, { useState } from 'react';
import { ChevronRight, Play, Heart, Sparkles, Zap } from 'lucide-react';

const OnboardingView = ({ onComplete, onSkipToPick }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { type: 'welcome' },
    { type: 'why' },
    { type: 'how' },
    { type: 'ready' },
  ];

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleSkip = () => {
    if (onSkipToPick) {
      onSkipToPick();
    } else {
      onComplete();
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col relative overflow-hidden">
      {/* Dynamic Background based on step */}
      {currentStepData.type === 'welcome' && (
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-100" />
      )}
      {currentStepData.type === 'why' && (
        <div className="absolute inset-0 bg-gradient-to-br from-violet-100 via-purple-50 to-fuchsia-100" />
      )}
      {currentStepData.type === 'how' && (
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100" />
      )}
      {currentStepData.type === 'ready' && (
        <div className="absolute inset-0 bg-gradient-to-br from-amber-100 via-orange-100 to-rose-200" />
      )}

      {/* Floating organic shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-20 w-64 h-64 bg-white/30 rounded-full blur-3xl animate-float1" />
        <div className="absolute bottom-40 -right-20 w-80 h-80 bg-white/40 rounded-full blur-3xl animate-float2" />
        <div className="absolute top-1/2 left-1/3 w-40 h-40 bg-white/20 rounded-full blur-2xl animate-float3" />
      </div>

      {/* Skip Button */}
      {!isLastStep && (
        <div className="absolute top-8 right-5 z-50">
          <button
            onClick={handleSkip}
            className="text-sm text-gray-500/80 hover:text-gray-700 font-medium transition-all px-4 py-2 rounded-full hover:bg-white/50 backdrop-blur-sm"
          >
            Skip intro
          </button>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-10">

        {/* WELCOME SCREEN */}
        {currentStepData.type === 'welcome' && (
          <div className="text-center w-full max-w-sm animate-fadeIn">
            {/* Animated BiomeDude */}
            <div className="relative mb-8">
              <div className="w-56 h-56 mx-auto rounded-[3rem] bg-gradient-to-br from-orange-400 via-amber-400 to-yellow-400 flex items-center justify-center shadow-2xl relative overflow-hidden animate-organic-breathe">
                {/* Organic flowing blobs */}
                <div className="absolute w-24 h-24 bg-white/30 rounded-full blur-md animate-organic-blob-1" style={{ top: '-5%', left: '-5%' }} />
                <div className="absolute w-20 h-20 bg-yellow-200/35 rounded-full blur-md animate-organic-blob-2" style={{ bottom: '0%', right: '-5%' }} />
                <div className="absolute w-16 h-16 bg-orange-200/25 rounded-full blur-md animate-organic-blob-3" style={{ top: '40%', left: '60%' }} />

                {/* Inner glow that breathes */}
                <div className="absolute inset-2 bg-gradient-to-br from-white/40 to-transparent rounded-[2.5rem] animate-glow-pulse" />

                {/* Floating spores */}
                <div className="absolute w-3 h-3 bg-white/70 rounded-full animate-spore-drift-1" style={{ top: '15%', right: '20%' }} />
                <div className="absolute w-2 h-2 bg-white/50 rounded-full animate-spore-drift-2" style={{ bottom: '20%', left: '15%' }} />
                <div className="absolute w-2 h-2 bg-yellow-100/60 rounded-full animate-spore-drift-3" style={{ top: '50%', right: '12%' }} />
                <div className="absolute w-1.5 h-1.5 bg-white/40 rounded-full animate-spore-drift-4" style={{ top: '30%', left: '20%' }} />

                {/* Dancing BiomeDude */}
                <img
                  src="/BiomeDude.png"
                  alt="BiomeDude"
                  className="w-40 h-40 object-contain relative z-10 animate-dance"
                />

                {/* Floating elements */}
                <span className="absolute top-3 right-4 text-2xl animate-floatEmoji1">🦠</span>
                <span className="absolute bottom-4 left-4 text-xl animate-floatEmoji2">✨</span>
                <span className="absolute top-1/2 right-2 text-lg animate-floatEmoji3">💫</span>
              </div>

              {/* Organic pulsing ring */}
              <div className="absolute inset-0 w-56 h-56 mx-auto rounded-[3rem] border-4 border-orange-300/30 animate-organic-ring" />
            </div>

            <h1 className="text-4xl font-black text-gray-800 mb-3 tracking-tight">
              Meet Your
              <span className="block text-5xl bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 bg-clip-text text-transparent">
                Gut Buddy
              </span>
            </h1>

            <p className="text-gray-600 text-lg leading-relaxed mt-4 font-medium">
              Your tiny helpers inside are hungry for
              <span className="text-orange-500 font-bold"> plant power</span>!
              Let's feed them together.
            </p>

            {/* Friendly bacteria illustrations */}
            <div className="flex justify-center gap-3 mt-6">
              <span className="text-3xl animate-bounce" style={{ animationDelay: '0s' }}>🦠</span>
              <span className="text-3xl animate-bounce" style={{ animationDelay: '0.1s' }}>🧫</span>
              <span className="text-3xl animate-bounce" style={{ animationDelay: '0.2s' }}>🌿</span>
              <span className="text-3xl animate-bounce" style={{ animationDelay: '0.3s' }}>💚</span>
            </div>
          </div>
        )}

        {/* WHY SCREEN - The Science/Benefits */}
        {currentStepData.type === 'why' && (
          <div className="w-full max-w-sm animate-fadeIn">
            <div className="text-center mb-8">
              <span className="text-5xl mb-4 block animate-pulse">🔬</span>
              <h1 className="text-3xl font-black text-gray-800 mb-2">
                Why <span className="text-purple-500">30 Plants</span>?
              </h1>
              <p className="text-gray-500 text-sm font-medium">The science is delicious</p>
            </div>

            <div className="space-y-4">
              {/* Benefit 1 */}
              <div className="bg-white/70 backdrop-blur-md rounded-3xl p-5 shadow-lg border border-white/50 animate-slideIn" style={{ animationDelay: '0.1s' }}>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-400 to-violet-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Heart className="text-white" size={26} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg">Happier Gut</h3>
                    <p className="text-gray-500 text-sm">More plant variety = more happy bacteria</p>
                  </div>
                </div>
              </div>

              {/* Benefit 2 */}
              <div className="bg-white/70 backdrop-blur-md rounded-3xl p-5 shadow-lg border border-white/50 animate-slideIn" style={{ animationDelay: '0.2s' }}>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-fuchsia-400 to-pink-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Zap className="text-white" size={26} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg">More Energy</h3>
                    <p className="text-gray-500 text-sm">A diverse microbiome boosts vitality</p>
                  </div>
                </div>
              </div>

              {/* Benefit 3 */}
              <div className="bg-white/70 backdrop-blur-md rounded-3xl p-5 shadow-lg border border-white/50 animate-slideIn" style={{ animationDelay: '0.3s' }}>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Sparkles className="text-white" size={26} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg">Better Mood</h3>
                    <p className="text-gray-500 text-sm">90% of serotonin is made in your gut!</p>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-center text-gray-400 text-xs mt-6 font-medium">
              Studies show 30+ plants/week = optimal gut diversity
            </p>
          </div>
        )}

        {/* HOW IT WORKS SCREEN */}
        {currentStepData.type === 'how' && (
          <div className="w-full max-w-sm animate-fadeIn">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-black text-gray-800 mb-2">
                Simple as <span className="text-teal-500">1, 2, 3</span>
              </h1>
              <p className="text-gray-500 text-sm font-medium">No counting calories, just plants!</p>
            </div>

            {/* Step cards with connecting line */}
            <div className="relative">
              {/* Connecting line */}
              <div className="absolute left-7 top-10 bottom-10 w-1 bg-gradient-to-b from-teal-300 via-emerald-300 to-green-300 rounded-full" />

              <div className="space-y-5">
                {/* Step 1 */}
                <div className="flex items-center gap-4 animate-slideIn" style={{ animationDelay: '0.1s' }}>
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center flex-shrink-0 shadow-lg z-10 border-4 border-white">
                    <span className="text-white font-black text-xl">1</span>
                  </div>
                  <div className="bg-white/70 backdrop-blur-md rounded-2xl p-4 flex-1 shadow-lg border border-white/50">
                    <h3 className="font-bold text-gray-800">Eat a plant</h3>
                    <p className="text-gray-500 text-sm">Any fruit, veggie, nut, seed, or grain</p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex items-center gap-4 animate-slideIn" style={{ animationDelay: '0.2s' }}>
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center flex-shrink-0 shadow-lg z-10 border-4 border-white">
                    <span className="text-white font-black text-xl">2</span>
                  </div>
                  <div className="bg-white/70 backdrop-blur-md rounded-2xl p-4 flex-1 shadow-lg border border-white/50">
                    <h3 className="font-bold text-gray-800">Log it here</h3>
                    <p className="text-gray-500 text-sm">Search & tap - takes 2 seconds!</p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex items-center gap-4 animate-slideIn" style={{ animationDelay: '0.3s' }}>
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-400 to-lime-500 flex items-center justify-center flex-shrink-0 shadow-lg z-10 border-4 border-white">
                    <span className="text-white font-black text-xl">3</span>
                  </div>
                  <div className="bg-white/70 backdrop-blur-md rounded-2xl p-4 flex-1 shadow-lg border border-white/50">
                    <h3 className="font-bold text-gray-800">Watch it grow</h3>
                    <p className="text-gray-500 text-sm">Your biome thrives, you earn badges!</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Points explanation */}
            <div className="mt-8 bg-white/50 backdrop-blur-md rounded-2xl p-4 border border-white/50">
              <div className="flex justify-around text-center">
                <div>
                  <div className="text-2xl font-black text-teal-500">+5</div>
                  <div className="text-xs text-gray-500">New plant</div>
                </div>
                <div className="w-px bg-gray-200" />
                <div>
                  <div className="text-2xl font-black text-emerald-500">+1</div>
                  <div className="text-xs text-gray-500">Repeat</div>
                </div>
                <div className="w-px bg-gray-200" />
                <div>
                  <div className="text-2xl font-black text-green-500">30</div>
                  <div className="text-xs text-gray-500">Weekly goal</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* READY SCREEN */}
        {currentStepData.type === 'ready' && (
          <div className="text-center w-full max-w-sm animate-fadeIn">
            {/* Celebration visual */}
            <div className="relative mb-6">
              <div className="w-48 h-48 mx-auto rounded-full bg-gradient-to-br from-orange-400 via-rose-400 to-pink-500 flex items-center justify-center shadow-2xl overflow-hidden animate-organic-breathe">
                {/* Organic flowing blobs */}
                <div className="absolute w-20 h-20 bg-white/30 rounded-full blur-md animate-organic-blob-1" style={{ top: '-10%', left: '-10%' }} />
                <div className="absolute w-16 h-16 bg-pink-200/35 rounded-full blur-md animate-organic-blob-2" style={{ bottom: '-5%', right: '-5%' }} />
                <div className="absolute w-14 h-14 bg-rose-200/25 rounded-full blur-md animate-organic-blob-3" style={{ top: '45%', left: '55%' }} />

                {/* Breathing inner glow */}
                <div className="absolute inset-2 bg-gradient-to-br from-white/30 to-transparent rounded-full animate-glow-pulse" />

                {/* Floating spores */}
                <div className="absolute w-2.5 h-2.5 bg-white/70 rounded-full animate-spore-drift-1" style={{ top: '18%', right: '18%' }} />
                <div className="absolute w-1.5 h-1.5 bg-white/50 rounded-full animate-spore-drift-2" style={{ bottom: '22%', left: '18%' }} />
                <div className="absolute w-1.5 h-1.5 bg-pink-100/60 rounded-full animate-spore-drift-3" style={{ top: '55%', right: '15%' }} />

                <img
                  src="/BiomeDude.png"
                  alt="BiomeDude"
                  className="w-32 h-32 object-contain relative z-10 animate-wiggle"
                />
              </div>

              {/* Celebration particles */}
              <span className="absolute top-0 left-1/4 text-3xl animate-celebrateFloat1">🎉</span>
              <span className="absolute top-4 right-1/4 text-2xl animate-celebrateFloat2">🌟</span>
              <span className="absolute bottom-0 left-1/3 text-2xl animate-celebrateFloat3">🌱</span>
              <span className="absolute bottom-4 right-1/4 text-3xl animate-celebrateFloat4">✨</span>
            </div>

            <h1 className="text-4xl font-black text-gray-800 mb-2">
              You're <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-rose-500">Ready!</span>
            </h1>

            <p className="text-gray-600 text-lg leading-relaxed font-medium mb-8">
              Your gut buddies are excited to meet all the plants you'll eat!
            </p>

            {/* Starting stats */}
            <div className="bg-white/60 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-white/50">
              <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Your starting stats</p>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center">
                    <span className="text-2xl">🌱</span>
                  </div>
                  <div className="text-2xl font-black text-gray-800">0</div>
                  <div className="text-xs text-gray-400 font-medium">Plants</div>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center">
                    <span className="text-2xl">⭐</span>
                  </div>
                  <div className="text-2xl font-black text-gray-800">0</div>
                  <div className="text-xs text-gray-400 font-medium">Points</div>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-gradient-to-br from-amber-100 to-yellow-100 flex items-center justify-center">
                    <span className="text-2xl">🏆</span>
                  </div>
                  <div className="text-2xl font-black text-gray-800">0</div>
                  <div className="text-xs text-gray-400 font-medium">Badges</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Progress Dots (non-interactive) */}
      <div className="flex items-center justify-center gap-2 mb-6 relative z-10">
        {steps.map((_, index) => (
          <div
            key={index}
            className={`rounded-full transition-all duration-300 ${
              index === currentStep
                ? 'w-8 h-2 bg-gray-800'
                : index < currentStep
                ? 'w-2 h-2 bg-gray-400'
                : 'w-2 h-2 bg-gray-300'
            }`}
          />
        ))}
      </div>

      {/* Action Button */}
      <div className="px-6 pb-8 relative z-10">
        <button
          onClick={handleNext}
          className={`w-full py-4 rounded-2xl font-bold shadow-xl hover:shadow-2xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-lg ${
            isLastStep
              ? 'bg-gradient-to-r from-orange-500 via-rose-500 to-pink-500 text-white hover:from-orange-600 hover:via-rose-600 hover:to-pink-600'
              : 'bg-gray-800 text-white hover:bg-gray-900'
          }`}
        >
          {isLastStep ? (
            <>
              <Play size={22} fill="white" />
              <span>Let's Grow!</span>
            </>
          ) : (
            <>
              <span>Continue</span>
              <ChevronRight size={22} />
            </>
          )}
        </button>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes dance {
          0%, 100% { transform: translateY(0) rotate(0deg) scale(1); }
          15% { transform: translateY(-6px) rotate(-8deg) scale(1.03); }
          30% { transform: translateY(0) rotate(0deg) scale(1); }
          45% { transform: translateY(-6px) rotate(8deg) scale(1.03); }
          60% { transform: translateY(0) rotate(0deg) scale(1); }
          75% { transform: translateY(-10px) rotate(-4deg) scale(1.05); }
        }

        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-5deg); }
          75% { transform: rotate(5deg); }
        }

        @keyframes containerFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        @keyframes float1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(20px, -20px) scale(1.1); }
        }

        @keyframes float2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-30px, 20px) scale(1.05); }
        }

        @keyframes float3 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(15px, -15px); }
        }

        @keyframes floatEmoji1 {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 1; }
          50% { transform: translateY(-12px) rotate(20deg); opacity: 0.8; }
        }

        @keyframes floatEmoji2 {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.9; }
          50% { transform: translateY(-8px) scale(1.1); opacity: 1; }
        }

        @keyframes floatEmoji3 {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.8; }
          50% { transform: translateY(-10px) rotate(-15deg); opacity: 1; }
        }

        @keyframes celebrateFloat1 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(-10px, -20px) rotate(-20deg); }
        }

        @keyframes celebrateFloat2 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(15px, -15px) rotate(15deg); }
        }

        @keyframes celebrateFloat3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-8px, -12px) scale(1.2); }
        }

        @keyframes celebrateFloat4 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(10px, -18px) rotate(25deg); }
        }

        @keyframes ping-slow {
          0% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.05); opacity: 0.2; }
          100% { transform: scale(1); opacity: 0.5; }
        }

        .animate-fadeIn { animation: fadeIn 0.6s ease-out forwards; }
        .animate-slideIn { animation: slideIn 0.5s ease-out forwards; opacity: 0; }
        .animate-dance { animation: dance 2s ease-in-out infinite; }
        .animate-wiggle { animation: wiggle 1s ease-in-out infinite; }
        .animate-containerFloat { animation: containerFloat 3s ease-in-out infinite; }
        .animate-float1 { animation: float1 8s ease-in-out infinite; }
        .animate-float2 { animation: float2 10s ease-in-out infinite; }
        .animate-float3 { animation: float3 6s ease-in-out infinite; }
        .animate-floatEmoji1 { animation: floatEmoji1 2s ease-in-out infinite; }
        .animate-floatEmoji2 { animation: floatEmoji2 2.5s ease-in-out infinite 0.3s; }
        .animate-floatEmoji3 { animation: floatEmoji3 1.8s ease-in-out infinite 0.6s; }
        .animate-celebrateFloat1 { animation: celebrateFloat1 2s ease-in-out infinite; }
        .animate-celebrateFloat2 { animation: celebrateFloat2 2.3s ease-in-out infinite 0.2s; }
        .animate-celebrateFloat3 { animation: celebrateFloat3 1.9s ease-in-out infinite 0.4s; }
        .animate-celebrateFloat4 { animation: celebrateFloat4 2.1s ease-in-out infinite 0.6s; }
        .animate-ping-slow { animation: ping-slow 2s ease-in-out infinite; }

        /* Organic living animations */
        @keyframes organic-breathe {
          0%, 100% { transform: scale(1); }
          30% { transform: scale(1.02); }
          60% { transform: scale(0.99); }
        }

        @keyframes organic-blob-1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(15px, 8px) scale(1.15); }
          50% { transform: translate(8px, 18px) scale(0.95); }
          75% { transform: translate(-4px, 10px) scale(1.08); }
        }

        @keyframes organic-blob-2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-12px, -15px) scale(1.2); }
          66% { transform: translate(-18px, 5px) scale(0.9); }
        }

        @keyframes organic-blob-3 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.25; }
          20% { transform: translate(-15px, -8px) scale(1.25); opacity: 0.4; }
          50% { transform: translate(-8px, 15px) scale(0.85); opacity: 0.2; }
          80% { transform: translate(12px, 4px) scale(1.1); opacity: 0.35; }
        }

        @keyframes glow-pulse {
          0%, 100% { opacity: 0.9; }
          40% { opacity: 0.5; }
          70% { opacity: 1; }
        }

        @keyframes spore-drift-1 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.7; }
          20% { transform: translate(-5px, -8px) scale(1.15); opacity: 0.5; }
          40% { transform: translate(3px, -14px) scale(0.9); opacity: 0.9; }
          60% { transform: translate(8px, -7px) scale(1.2); opacity: 0.4; }
          80% { transform: translate(2px, -2px) scale(1); opacity: 0.8; }
        }

        @keyframes spore-drift-2 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.5; }
          15% { transform: translate(7px, 5px) scale(1.3); opacity: 0.8; }
          35% { transform: translate(12px, -4px) scale(0.8); opacity: 0.4; }
          55% { transform: translate(5px, -10px) scale(1.15); opacity: 0.9; }
          75% { transform: translate(-3px, -5px) scale(1); opacity: 0.6; }
        }

        @keyframes spore-drift-3 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.6; }
          25% { transform: translate(-7px, 7px) scale(0.9); opacity: 0.4; }
          50% { transform: translate(-10px, -4px) scale(1.25); opacity: 0.8; }
          75% { transform: translate(-3px, 10px) scale(1); opacity: 0.5; }
        }

        @keyframes spore-drift-4 {
          0%, 100% { transform: translate(0, 0); opacity: 0.4; }
          30% { transform: translate(8px, -6px); opacity: 0.7; }
          60% { transform: translate(3px, 8px); opacity: 0.3; }
        }

        @keyframes organic-ring {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          30% { transform: scale(1.03); opacity: 0.15; }
          60% { transform: scale(0.98); opacity: 0.4; }
        }

        .animate-organic-breathe { animation: organic-breathe 4s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
        .animate-organic-blob-1 { animation: organic-blob-1 7s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
        .animate-organic-blob-2 { animation: organic-blob-2 9s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
        .animate-organic-blob-3 { animation: organic-blob-3 11s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
        .animate-glow-pulse { animation: glow-pulse 5s ease-in-out infinite; }
        .animate-spore-drift-1 { animation: spore-drift-1 6s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
        .animate-spore-drift-2 { animation: spore-drift-2 8s cubic-bezier(0.4, 0, 0.2, 1) infinite 0.5s; }
        .animate-spore-drift-3 { animation: spore-drift-3 7s cubic-bezier(0.4, 0, 0.2, 1) infinite 1s; }
        .animate-spore-drift-4 { animation: spore-drift-4 5s cubic-bezier(0.4, 0, 0.2, 1) infinite 1.5s; }
        .animate-organic-ring { animation: organic-ring 4s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
      `}</style>
    </div>
  );
};

export default OnboardingView;
