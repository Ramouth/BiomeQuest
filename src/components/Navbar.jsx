import React from 'react';
import { Home, PlusCircle, BarChart3 } from 'lucide-react';

const Navbar = ({ activeTab, onTabChange, score, userId }) => {
  return (
    <>
      {/* Score Display - Above Navbar (Only on home tab) */}
      {activeTab === 'home' && (
        <div className="fixed bottom-32 left-1/2 transform -translate-x-1/2 bg-green-500 text-white rounded-full px-5 py-2 text-sm font-bold shadow-lg z-40">
          Score: {score}
        </div>
      )}

      {/* Navbar */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-white border-t border-gray-200 flex items-center justify-around px-8">
        {/* Home Button */}
        <button
          onClick={() => onTabChange('home')}
          className="flex flex-col items-center gap-1 group relative active:scale-95 transition-transform"
        >
          <Home
            className={`w-6 h-6 transition-colors ${
              activeTab === 'home' ? 'text-green-500' : 'text-gray-400'
            }`}
          />
          <span
            className={`text-xs transition-colors ${
              activeTab === 'home' ? 'text-green-500' : 'text-gray-400'
            }`}
          >
            Home
          </span>
          {activeTab === 'home' && (
            <div className="absolute -bottom-1 w-12 h-1 bg-green-500 rounded-full" />
          )}
        </button>

        {/* Profile Button */}
        <button
          onClick={() => onTabChange('profile')}
          className="flex flex-col items-center gap-1 group relative active:scale-95 transition-transform"
        >
          <div
            className={`w-14 h-14 rounded-full flex items-center justify-center -mt-6 transition-all overflow-hidden border-2 ${
              activeTab === 'profile' ? 'bg-green-600 scale-105 border-green-700' : 'bg-white border-green-500'
            }`}
          >
            <img
              src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${userId}`}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <span
            className={`text-xs transition-colors ${
              activeTab === 'profile' ? 'text-green-500' : 'text-gray-400'
            }`}
          >
            Profile
          </span>
          {activeTab === 'profile' && (
            <div className="absolute -bottom-1 w-12 h-1 bg-green-500 rounded-full" />
          )}
        </button>

        {/* Progress Button */}
        <button
          onClick={() => onTabChange('progress')}
          className="flex flex-col items-center gap-1 group relative active:scale-95 transition-transform"
        >
          <BarChart3
            className={`w-6 h-6 transition-colors ${
              activeTab === 'progress' ? 'text-green-500' : 'text-gray-400'
            }`}
          />
          <span
            className={`text-xs transition-colors ${
              activeTab === 'progress' ? 'text-green-500' : 'text-gray-400'
            }`}
          >
            Progress
          </span>
          {activeTab === 'progress' && (
            <div className="absolute -bottom-1 w-12 h-1 bg-green-500 rounded-full" />
          )}
        </button>
      </div>
    </>
  );
};

export default Navbar;
