/**
 * ProfilePage View
 * Pure presentational component using ViewModels
 */

import React, { useState, useEffect } from 'react';
import { Award, Trophy, TrendingUp, Settings, LogOut, Sparkles } from 'lucide-react';
import { useProfile } from '../viewmodels/useProfile';
import { useBadges } from '../viewmodels/useBadges';
import { useAuth } from '../context/AuthContext';
import { getAvatarUrl } from '../constants/avatars';

const ProfilePage = ({ onBack, userName, userId, avatarId, score, animationsEnabled, onToggleAnimations }) => {
  // Use ViewModels for business logic
  const {
    topPlants,
    loading,
    totalPoints,
    weeklyPoints,
    weeklyGoal,
    uniquePlantsThisWeek
  } = useProfile();

  // Use badges ViewModel
  const {
    BADGE_THRESHOLDS,
    showBadgePopup,
    unlockedBadges,
    nextBadge,
    motivationMessage,
    progressToNext,
    pointsToNextBadge,
    showBadge,
    hideBadgePopup,
    checkBadgeUnlocked
  } = useBadges(totalPoints || score, weeklyPoints, weeklyGoal);

  // Settings menu state
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const { logout } = useAuth();

  const handleSignOut = () => {
    setShowSettingsMenu(false);
    logout();
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-blue-50">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex flex-col" style={{ background: 'linear-gradient(to bottom, #f0fdf4, #eff6ff)' }}>
      {/* Badge Unlock Popup - only show when animations enabled */}
      {animationsEnabled && showBadgePopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 max-w-sm mx-4 animate-bounce shadow-2xl transform scale-100">
            <div className="text-center">
              <div className="text-8xl mb-4 animate-pulse">{showBadgePopup.emoji}</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Badge Unlocked!</h3>
              <p className="text-lg text-green-600 font-semibold mb-2">{showBadgePopup.name}</p>
              <p className="text-gray-600 mb-6">You've reached {showBadgePopup.points} points!</p>
              <button
                onClick={hideBadgePopup}
                className="bg-green-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-600 transition-colors"
              >
                Celebrate! 🎉
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header with back button */}
      <div className="flex-shrink-0 bg-white/80 backdrop-blur-md border-b border-gray-200 p-4 flex items-center justify-between relative z-[120]">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <span className="text-xl">←</span>
        </button>
        <h1 className="text-lg font-bold text-gray-800">Profile</h1>
        <div className="relative">
          <button
            onClick={() => setShowSettingsMenu(!showSettingsMenu)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Settings size={20} className="text-gray-600" />
          </button>

          {showSettingsMenu && (
            <>
              <div
                className="fixed inset-0 z-[100]"
                onClick={() => setShowSettingsMenu(false)}
              />
              <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-[130]">
                {/* Animation Toggle */}
                <div className="px-4 py-4 bg-gradient-to-r from-gray-50 to-white">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        animationsEnabled 
                          ? 'bg-gradient-to-br from-amber-400 to-orange-500' 
                          : 'bg-gray-200'
                      }`}>
                        <Sparkles size={16} className={animationsEnabled ? 'text-white' : 'text-gray-500'} />
                      </div>
                      <div>
                        <span className="font-semibold text-gray-800 text-sm block">Animations</span>
                        <span className="text-xs text-gray-500">
                          {animationsEnabled ? 'Celebrations & effects on' : 'Minimal mode'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={onToggleAnimations}
                    className={`relative w-full h-10 rounded-xl transition-all duration-300 ${
                      animationsEnabled 
                        ? 'bg-gradient-to-r from-green-500 to-green-600 shadow-lg shadow-green-500/30' 
                        : 'bg-gray-200'
                    }`}
                  >
                    <div className="absolute inset-0 flex items-center justify-between px-3">
                      <span className={`text-xs font-semibold transition-opacity ${
                        animationsEnabled ? 'text-white/70' : 'text-transparent'
                      }`}>ON</span>
                      <span className={`text-xs font-semibold transition-opacity ${
                        !animationsEnabled ? 'text-gray-500' : 'text-transparent'
                      }`}>OFF</span>
                    </div>
                    <div
                      className={`absolute top-1.5 w-12 h-7 bg-white rounded-lg shadow-md transition-all duration-300 flex items-center justify-center ${
                        animationsEnabled ? 'left-[calc(100%-52px)]' : 'left-1.5'
                      }`}
                    >
                      <span className={`text-xs font-bold ${
                        animationsEnabled ? 'text-green-600' : 'text-gray-500'
                      }`}>
                        {animationsEnabled ? 'ON' : 'OFF'}
                      </span>
                    </div>
                  </button>
                </div>

                <div className="border-t border-gray-100">
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={18} />
                    <span className="font-medium">Sign Out</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pt-2 pb-32 relative z-0">
        {/* Header with Avatar */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 rounded-full overflow-hidden shadow-xl border-4 border-white mb-4 ring-4 ring-green-500/20 bg-gradient-to-br from-green-100 to-green-200">
            <img
              src={getAvatarUrl(avatarId)}
              alt="Profile Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">{userName}</h1>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm text-gray-500 font-mono bg-white px-3 py-1 rounded-full">
              ID: {userId}
            </span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-4 shadow-lg text-white">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp size={20} />
              <span className="text-2xl">🌟</span>
            </div>
            <div className="text-2xl font-bold mb-1">{totalPoints || score}</div>
            <div className="text-xs opacity-90">Total Points</div>
          </div>

          <div className="bg-gradient-to-br from-amber-400 to-amber-500 rounded-2xl p-4 shadow-lg text-white">
            <div className="flex items-center justify-between mb-2">
              <Trophy size={20} />
              <span className="text-2xl">🏆</span>
            </div>
            <div className="text-2xl font-bold mb-1">{unlockedBadges.length}/{BADGE_THRESHOLDS.length}</div>
            <div className="text-xs opacity-90">Badges Unlocked</div>
          </div>
        </div>

        {/* Motivation Message */}
        {motivationMessage.message && (
          <div className={`${motivationMessage.bgColor} border border-green-200 rounded-2xl p-4 mb-6`}>
            <p className={`${motivationMessage.color} font-semibold text-center text-sm`}>
              {motivationMessage.emoji} {motivationMessage.message}
            </p>
          </div>
        )}

        {/* Achievement Badges Section */}
        <div className="bg-white/70 backdrop-blur-md rounded-3xl p-5 mb-6 shadow-lg border border-white/50">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
              <Award size={18} className="text-white" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">Achievement Badges</h2>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {BADGE_THRESHOLDS.map((badge) => {
              const isUnlocked = checkBadgeUnlocked(badge.level);
              return (
                <div
                  key={badge.level}
                  className={`rounded-2xl p-4 border-2 shadow-md transition-all transform hover:scale-105 cursor-pointer ${
                    isUnlocked
                      ? 'bg-gradient-to-br from-yellow-100 to-amber-100 border-amber-300 hover:shadow-lg'
                      : 'bg-white/60 border-dashed border-gray-300'
                  }`}
                  onClick={() => isUnlocked && showBadge(badge)}
                >
                  <div className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2 shadow-md ${
                      isUnlocked
                        ? 'bg-gradient-to-br from-yellow-400 to-amber-500'
                        : 'bg-gray-200'
                    }`}>
                      <span className="text-2xl">{isUnlocked ? badge.emoji : '🔒'}</span>
                    </div>
                    <div className="text-xs font-semibold text-gray-700 text-center">
                      {isUnlocked ? badge.name : 'Locked'}
                    </div>
                    <div className="text-xs text-gray-500 text-center mt-1">
                      {badge.points} pts
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Next Badge Progress */}
          {nextBadge && (
            <div className="mt-4 p-4 bg-green-50 rounded-2xl border border-green-200">
              <p className="text-sm text-gray-700 mb-2">
                <span className="font-semibold">Next Badge:</span> {nextBadge.name} ({nextBadge.points} pts)
              </p>
              <div className="w-full bg-gray-300 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-green-500 to-green-600 h-full transition-all duration-500"
                  style={{ width: `${progressToNext}%` }}
                />
              </div>
              <p className="text-xs text-gray-600 mt-2">
                {pointsToNextBadge} points to go!
              </p>
            </div>
          )}
        </div>

        {/* Weekly Summary Section */}
        <div className="bg-white/70 backdrop-blur-md rounded-3xl p-5 mb-6 shadow-lg border border-white/50">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-2xl">📅</span>
            This Week's Progress
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200">
              <span className="text-sm font-medium text-gray-700">Weekly Points</span>
              <span className="text-lg font-bold text-green-600">{weeklyPoints}/{weeklyGoal}</span>
            </div>
            <div>
              <div className="w-full bg-gray-300 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-green-500 to-green-600 h-full transition-all duration-500"
                  style={{ width: `${Math.min((weeklyPoints / weeklyGoal) * 100, 100)}%` }}
                />
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200">
              <span className="text-sm font-medium text-gray-700">Unique Plants This Week</span>
              <span className="text-lg font-bold text-green-600">{uniquePlantsThisWeek}</span>
            </div>
          </div>
        </div>

        {/* Most Eaten Plants */}
        <div className="bg-white/70 backdrop-blur-md rounded-3xl p-5 shadow-lg border border-white/50">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">🌱</span>
            <h2 className="text-lg font-semibold text-gray-800">Most Eaten Plants</h2>
          </div>

          {topPlants.length > 0 ? (
            <div className="space-y-3">
              {topPlants.map((plant, index) => (
                <div key={plant.id} className="flex items-center gap-4 p-4 bg-gradient-to-r from-white/80 to-white/40 rounded-2xl border border-white/60 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-green-600 text-white font-bold text-sm flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="text-4xl flex-shrink-0">
                    {plant.emoji || '🌱'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 text-base mb-1">{plant.name}</h3>
                    <div className="flex items-center gap-3 text-xs text-gray-600">
                      <span className="font-medium">Eaten {plant.times_eaten}x</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-6xl mb-3 opacity-30">🌱</div>
              <p className="text-gray-500 font-medium mb-2">No plants logged yet</p>
              <p className="text-xs text-gray-400">Start logging your plant-based foods!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
