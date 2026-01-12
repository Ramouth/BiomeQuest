import React from 'react';
import { Search, Plus, Sparkles } from 'lucide-react';
import { BananaIcon, AppleIcon, MangoIcon } from './FoodIcons';

const PickScreen = ({ score, onFoodSelect, foods, eatenFoods }) => {
  return (
    <div className="h-screen w-screen bg-white flex flex-col fixed inset-0 overflow-hidden">
      {/* Header with gradient background */}
      <div className="bg-gradient-to-b from-green-100 via-green-50 to-transparent rounded-b-[2.5rem] pb-6 pt-4 px-5 shadow-sm">
        <div className="flex items-center justify-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">BiomeQuest</h1>
          <div className="ml-3 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md border-2 border-pink-200">
            <img 
              src="/BiomeDude.png" 
              alt="BiomeDude" 
              className="w-10 h-10 object-contain"
            />
          </div>
        </div>

        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search Store"
            className="w-full pl-12 pr-4 py-3.5 rounded-full bg-white shadow-sm border border-gray-100 focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-transparent text-gray-700 placeholder-gray-400"
          />
        </div>
      </div>

      {/* Content - scrollable area */}
      <div className="flex-1 px-5 py-6 overflow-y-auto pb-24 smooth-scroll" style={{ WebkitOverflowScrolling: 'touch' }}>
        {/* Register plant banner */}
        <div className="bg-gradient-to-br from-orange-50 via-yellow-50 to-peach-50 rounded-3xl p-5 mb-6 shadow-sm relative overflow-hidden border border-orange-100/50">
          <div className="flex items-center justify-between relative z-10">
            <div className="flex-1">
              <div className="flex items-center mb-1">
                {/* Mini veggie icons */}
                <div className="flex -space-x-2 mr-3">
                  <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center shadow-sm">
                    <span className="text-xl">🍌</span>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-orange-400 flex items-center justify-center shadow-sm">
                    <span className="text-xl">🥕</span>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-red-400 flex items-center justify-center shadow-sm">
                    <span className="text-xl">🍅</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-lg leading-tight">Register plant</h3>
                  <p className="text-gray-600 text-sm">Help your biome</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Decorative BiomeDude */}
          <div className="absolute -top-2 -right-2 opacity-20 rotate-12">
            <img 
              src="/BiomeDude.png" 
              alt="" 
              className="w-12 h-12 object-contain"
            />
          </div>
          <div className="absolute -bottom-3 right-8 opacity-15 -rotate-12">
            <img 
              src="/BiomeDude.png" 
              alt="" 
              className="w-10 h-10 object-contain"
            />
          </div>
        </div>

        {/* Most common section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Most common</h2>
            <button className="text-green-600 font-semibold text-sm hover:text-green-700 transition-colors">
              See all
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {foods.map((food) => {
              const isNew = !eatenFoods.has(food.id);
              
              return (
                <div 
                  key={food.id} 
                  className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-green-200 transition-all duration-200 relative"
                >
                  {/* NEW badge for first-time foods */}
                  {isNew && (
                    <div className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-md">
                      <Sparkles className="w-3 h-3" />
                      NEW
                    </div>
                  )}
                  
                  <div className="flex justify-center mb-3 h-20 items-center">
                    {food.id === 'banana' && <BananaIcon size={70} />}
                    {food.id === 'apple' && <AppleIcon size={70} />}
                    {food.id === 'mango' && <MangoIcon size={70} />}
                  </div>
                  
                  <h3 className="font-bold text-gray-800 text-center mb-0.5 text-lg">
                    {food.name}
                  </h3>
                  
                  {/* Show different points for first time vs repeat */}
                  <p className="text-gray-500 text-sm text-center mb-4">
                    {isNew ? (
                      <span className="text-green-600 font-bold">
                        {food.points} pts! 🌟
                      </span>
                    ) : (
                      <span>
                        {food.repeatPoints} pt.
                      </span>
                    )}
                  </p>
                  
                  <button
                    onClick={() => onFoodSelect(food)}
                    className={`w-full ${
                      isNew 
                        ? 'bg-green-500 hover:bg-green-600' 
                        : 'bg-gray-400 hover:bg-gray-500'
                    } text-white rounded-full p-3 flex items-center justify-center transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg`}
                  >
                    <Plus className="w-5 h-5" strokeWidth={3} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Score footer - fixed at bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-green-500 px-5 py-4 flex items-center justify-between rounded-t-3xl shadow-2xl">
        <span className="text-white font-bold text-lg">Your Score: {score}</span>
        <div className="w-11 h-11 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-pink-200">
          <img 
            src="/BiomeDude.png" 
            alt="BiomeDude" 
            className="w-9 h-9 object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default PickScreen;