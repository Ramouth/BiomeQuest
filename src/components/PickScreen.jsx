import React from 'react';
import { Search, Plus } from 'lucide-react';
import MicrobeMascot from './MicrobeMascot';
import { BananaIcon, AppleIcon, VeggieIcons } from './FoodIcons';

const PickScreen = ({ score, onFoodSelect, foods }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-b from-green-200 to-green-100 rounded-b-[3rem] pb-8 pt-6 px-6 shadow-md">
        <div className="flex items-center justify-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">BiomeQuest</h1>
          <div className="ml-3 w-12 h-12 bg-pink-300 rounded-full flex items-center justify-center shadow-md">
            <MicrobeMascot size={36} />
          </div>
        </div>

        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search Store"
            className="w-full pl-12 pr-4 py-3 rounded-full bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-300 text-gray-700"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-6 overflow-y-auto">
        {/* Register plant banner */}
        <div className="bg-gradient-to-r from-yellow-100 via-orange-50 to-orange-100 rounded-2xl p-6 mb-6 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center">
              <div className="mr-4">
                <VeggieIcons size={50} />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-lg">Register plant</h3>
                <p className="text-gray-600 text-sm">Help your biome</p>
              </div>
            </div>
          </div>
          
          {/* Decorative microbes */}
          <div className="absolute top-2 right-2 opacity-30">
            <MicrobeMascot size={30} />
          </div>
          <div className="absolute bottom-2 right-8 opacity-20">
            <MicrobeMascot size={24} />
          </div>
        </div>

        {/* Most common section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Most common</h2>
            <button className="text-green-600 font-semibold text-sm hover:text-green-700">
              See all
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {foods.map((food) => (
              <div key={food.id} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-center mb-3">
                  {food.id === 'banana' && <BananaIcon size={80} />}
                  {food.id === 'apple' && <AppleIcon size={80} />}
                </div>
                <h3 className="font-bold text-gray-800 text-center mb-1">
                  {food.name}
                </h3>
                <p className="text-gray-500 text-sm text-center mb-4">
                  {food.points} pts.
                </p>
                <button
                  onClick={() => onFoodSelect(food)}
                  className="w-full bg-green-500 hover:bg-green-600 text-white rounded-full p-3 flex items-center justify-center transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md"
                >
                  <Plus className="w-6 h-6" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Score footer */}
      <div className="bg-green-500 px-6 py-4 flex items-center justify-between rounded-t-3xl shadow-lg">
        <span className="text-white font-bold text-lg">Your Score: {score}</span>
        <div className="w-10 h-10 bg-pink-300 rounded-full flex items-center justify-center shadow-md">
          <MicrobeMascot size={30} />
        </div>
      </div>
    </div>
  );
};

export default PickScreen;
