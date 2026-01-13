import React, { useState } from 'react';
import { ChevronRight, Sparkles, Award, Leaf, RotateCcw, Play } from 'lucide-react';

const OnboardingView = ({ onComplete, onSkipToPick }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      type: 'welcome',
      title: 'BiomeQuest',
      subtitle: 'Plant-Powered Health Game',
      description: 'Transform healthy eating into an exciting adventure by logging your plants!',
    },
    {
      type: 'rules',
      title: 'Game Rules',
      subtitle: 'Simple & Fun',
    },
    {
      type: 'ready',
      icon: '🎮',
      title: 'Ready to Start?',
      subtitle: 'Begin Your Plant Quest',
    },
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
    <div className="h-screen w-screen flex flex-col bg-gradient-to-br from-[#f5f3ef] to-[#e8e6e1] relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#6fb584]/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-[#5a9f6e]/10 to-transparent rounded-full blur-3xl"></div>
      </div>

      {/* Skip Button */}
      {!isLastStep && (
        <div className="absolute top-8 right-5 z-50">
          <button
            onClick={handleSkip}
            className="text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors px-4 py-2 rounded-xl hover:bg-white/50"
          >
            Skip
          </button>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-10">
        {/* Welcome Screen */}
        {currentStepData.type === 'welcome' && (
          <div className="text-center w-full max-w-sm animate-fadeIn">
            {/* BiomeDude Image */}
            <div className="w-64 h-64 mx-auto mb-6 rounded-[36px] bg-gradient-to-br from-[#6fb584] to-[#5a9f6e] flex items-center justify-center shadow-2xl relative overflow-hidden flex-shrink-0">
              <div className="absolute inset-0 bg-white/20 rounded-[36px]"></div>
              <img 
                src="/BiomeDude.png" 
                alt="BiomeDude" 
                className="w-48 h-48 object-contain relative z-10"
              />
              <div className="absolute -inset-1 bg-gradient-to-br from-[#6fb584] to-[#5a9f6e] rounded-[32px] blur-xl opacity-50 -z-10"></div>
            </div>

            <h1 className="text-5xl font-bold text-gray-800 mb-3">
              {currentStepData.title}
            </h1>
            
            <div className="inline-block bg-[#5a9f6e] text-white px-5 py-2 rounded-full text-sm font-semibold mb-6">
              {currentStepData.subtitle}
            </div>

            <p className="text-gray-600 text-lg leading-relaxed">
              {currentStepData.description}
            </p>
          </div>
        )}

        {/* Rules Screen */}
        {currentStepData.type === 'rules' && (
          <div className="w-full max-w-sm animate-fadeIn">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                {currentStepData.title}
              </h1>
              <div className="inline-block bg-[#5a9f6e] text-white px-4 py-1.5 rounded-full text-sm font-semibold">
                {currentStepData.subtitle}
              </div>
            </div>

            {/* Rule Cards */}
            <div className="space-y-4">
              {/* Rule 1: Earn Points */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 shadow-lg border border-white/50 animate-slideUp" style={{ animationDelay: '0.1s' }}>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#6fb584] to-[#5a9f6e] flex items-center justify-center flex-shrink-0">
                    <Leaf className="text-white" size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 mb-2 text-lg">1. Log Your Plants</h3>
                    <p className="text-gray-600 text-sm mb-3">Log plants to earn points and grow your biome</p>
                    <div className="flex flex-wrap gap-2">
                      <div className="bg-[#f5f3ef] px-3 py-1.5 rounded-lg text-xs">
                        <span className="mr-1">🍎</span>
                        <span className="font-medium">Apple +5pts</span>
                      </div>
                      <div className="bg-[#f5f3ef] px-3 py-1.5 rounded-lg text-xs">
                        <span className="mr-1">🍌</span>
                        <span className="font-medium">Banana +5pts</span>
                      </div>
                      <div className="bg-[#f5f3ef] px-3 py-1.5 rounded-lg text-xs">
                        <span className="mr-1">🥭</span>
                        <span className="font-medium">Mango +5pts</span>
                      </div>
                    </div>
                    <p className="text-gray-500 text-xs mt-2">Repeats: +1pt each</p>
                  </div>
                </div>
              </div>

              {/* Rule 2: Unlock Badges */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 shadow-lg border border-white/50 animate-slideUp" style={{ animationDelay: '0.2s' }}>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center flex-shrink-0">
                    <Award className="text-white" size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 mb-2 text-lg">2. Unlock Achievement Badges</h3>
                    <p className="text-gray-600 text-sm mb-3">Reach point milestones to unlock special badges</p>
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 px-4 py-3 rounded-xl text-sm">
                      <div className="font-bold text-gray-800 mb-1">🌱 10pts → 🌿 25pts → 🌳 50pts</div>
                      <div className="text-xs text-gray-600">And more badges awaiting discovery!</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rule 3: Weekly Reset */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 shadow-lg border border-white/50 animate-slideUp" style={{ animationDelay: '0.3s' }}>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#6fb584] to-[#5a9f6e] flex items-center justify-center flex-shrink-0">
                    <RotateCcw className="text-white" size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 mb-2 text-lg">3. Weekly Challenges</h3>
                    <p className="text-gray-600 text-sm">Aim for 30 points each week to unlock the weekly badge! Your badges stay forever, but points reset weekly. 📅</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Ready Screen */}
        {currentStepData.type === 'ready' && (
          <div className="text-center w-full max-w-sm animate-fadeIn">
            {/* Animated Icon */}
            <div className="w-48 h-48 mx-auto mb-6 rounded-[32px] bg-gradient-to-br from-[#6fb584] to-[#5a9f6e] flex items-center justify-center shadow-2xl relative overflow-hidden flex-shrink-0">
              <div className="absolute inset-0 bg-white/20 rounded-[32px]"></div>
              <span className="text-7xl relative z-10 animate-bounce">{currentStepData.icon}</span>
              
              {/* Sparkles */}
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#6fb584] rounded-full animate-pulse"></div>
              <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-[#8b9d7e] rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            </div>

            <h1 className="text-4xl font-bold text-gray-800 mb-3">
              {currentStepData.title}
            </h1>
            
            <div className="inline-block bg-[#5a9f6e] text-white px-5 py-2 rounded-full text-sm font-semibold mb-6">
              {currentStepData.subtitle}
            </div>

            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              Your BiomeDude buddy is ready! Start logging your plants and watch your biome thrive. 🌿
            </p>

            {/* Quick Stats Preview */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-3xl mb-1">🌱</div>
                  <div className="text-2xl font-bold text-gray-800">0</div>
                  <div className="text-xs text-gray-500">Points</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-1">🏆</div>
                  <div className="text-2xl font-bold text-gray-800">0</div>
                  <div className="text-xs text-gray-500">Badges</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-1">🎯</div>
                  <div className="text-2xl font-bold text-gray-800">30</div>
                  <div className="text-xs text-gray-500">Weekly Goal</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Progress Dots */}
      <div className="flex items-center justify-center gap-1.5 mb-6 relative z-10">
        {steps.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentStep(index)}
            className={`h-1.5 rounded-full transition-all ${
              index === currentStep
                ? 'w-6 bg-[#5a9f6e]'
                : index < currentStep
                ? 'w-1.5 bg-[#6fb584]'
                : 'w-1.5 bg-gray-300'
            }`}
          />
        ))}
      </div>

      {/* Action Button */}
      <div className="px-6 pb-8 relative z-10">
        <button
          onClick={handleNext}
          className="w-full bg-gradient-to-r from-[#6fb584] to-[#5a9f6e] text-white py-4 rounded-2xl font-bold shadow-xl hover:shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-2 text-lg hover:from-[#7ec497] hover:to-[#6db081]"
        >
          {isLastStep ? (
            <>
              <Play size={20} fill="white" />
              <span>Start Playing</span>
            </>
          ) : (
            <>
              <span>Continue</span>
              <ChevronRight size={20} />
            </>
          )}
        </button>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-in-out;
        }

        .animate-slideUp {
          animation: slideUp 0.5s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
};

export default OnboardingView;
