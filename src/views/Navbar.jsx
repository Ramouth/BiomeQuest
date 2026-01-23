import React from 'react';
import { Home, PlusCircle, BarChart3 } from 'lucide-react';
import { getAvatarUrl } from '../constants/avatars';

const Navbar = ({ activeTab, onTabChange, score, userId, avatarId }) => {
  return (
    <>
      
      {/* Navbar */}
      <div
        className="fixed bottom-0 left-0 right-0 h-20 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex items-center justify-around px-8 z-50"
        style={{ touchAction: 'none', userSelect: 'none', WebkitUserSelect: 'none' }}
      >
        {/* Home Button */}
        <button
          onClick={() => onTabChange('home')}
          className="flex flex-col items-center gap-1 group relative active:scale-95 transition-transform"
        >
          <Home
            className={`w-6 h-6 transition-colors ${
              activeTab === 'home' ? 'text-green-500' : 'text-gray-400 dark:text-gray-500'
            }`}
          />
          <span
            className={`text-xs transition-colors ${
              activeTab === 'home' ? 'text-green-500' : 'text-gray-400 dark:text-gray-500'
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
            } bg-gradient-to-br from-green-100 to-green-200`}
          >
            <img
              src={getAvatarUrl(avatarId)}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <span
            className={`text-xs transition-colors ${
              activeTab === 'profile' ? 'text-green-500' : 'text-gray-400 dark:text-gray-500'
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
              activeTab === 'progress' ? 'text-green-500' : 'text-gray-400 dark:text-gray-500'
            }`}
          />
          <span
            className={`text-xs transition-colors ${
              activeTab === 'progress' ? 'text-green-500' : 'text-gray-400 dark:text-gray-500'
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
