/**
 * ProfilePage View
 * Pure presentational component using ViewModels
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Award, Trophy, TrendingUp, Settings, LogOut, Sparkles, Calendar, Check, X, ChevronRight } from 'lucide-react';
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
    uniquePlantsThisWeek,
    weeklyData
  } = useProfile();

  // Calculate weekly progress data for the bar chart
  const weeklyProgressData = useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const today = new Date();
    const currentDayIndex = (today.getDay() + 6) % 7; // Convert to Mon=0 format
    
    // Create a map of dates to points from the API data
    const dailyPointsMap = {};
    if (weeklyData?.dailyBreakdown) {
      weeklyData.dailyBreakdown.forEach(day => {
        dailyPointsMap[day.date] = day.points_earned || 0;
      });
    }
    
    // Generate data for each day of the current week
    const result = days.map((dayName, index) => {
      // Calculate the date for this day of the week (Monday = index 0)
      const dayDiff = index - currentDayIndex;
      const date = new Date(today);
      date.setDate(today.getDate() + dayDiff);
      const dateStr = date.toISOString().split('T')[0];
      
      const points = dailyPointsMap[dateStr] || 0;
      const isActive = points > 0;
      const isPast = index <= currentDayIndex;
      const isToday = index === currentDayIndex;
      
      return {
        day: dayName,
        points,
        isActive,
        isPast,
        isToday
      };
    });
    
    return result;
  }, [weeklyData]);

  // Calculate stats
  const daysActive = weeklyProgressData.filter(d => d.isActive).length;
  const maxPoints = Math.max(...weeklyProgressData.map(d => d.points), 10); // Minimum of 10 for scaling
  // Avg score = percentage of weekly goal achieved (capped at 100%)
  const avgScore = Math.min(100, Math.round((weeklyPoints / weeklyGoal) * 100));

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
  const [showAllPlantsModal, setShowAllPlantsModal] = useState(false);
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

        {/* Weekly Progress Section - Polished Design */}
        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-5 mb-6 shadow-lg border border-white/50">
          {/* Header */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center shadow-md">
              <Calendar size={20} className="text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Weekly Progress</h2>
          </div>

          {/* Weekly Goal Progress Bar */}
          <div className="bg-gray-50 rounded-2xl p-4 mb-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-gray-700">Weekly Goal</span>
              <span className="text-sm font-bold text-green-600">{daysActive}/7 days</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-green-400 to-green-500 h-full transition-all duration-500 rounded-full"
                style={{ width: `${Math.min((daysActive / 7) * 100, 100)}%` }}
              />
            </div>
          </div>

          {/* Bar Chart */}
          <div className="flex items-end justify-between gap-2 mb-2 px-2" style={{ height: '140px' }}>
            {weeklyProgressData.map((day, index) => {
              const heightPercent = day.points > 0 ? Math.max((day.points / maxPoints) * 100, 20) : 20;
              return (
                <div key={day.day} className="flex-1 flex flex-col items-center h-full justify-end">
                  <div 
                    className={`w-full rounded-xl transition-all duration-300 ${
                      day.isActive 
                        ? 'bg-gradient-to-t from-green-400 to-green-300 shadow-md' 
                        : 'bg-gray-200'
                    }`}
                    style={{ height: `${heightPercent}%`, minHeight: '20px' }}
                  />
                </div>
              );
            })}
          </div>

          {/* Day Labels */}
          <div className="flex justify-between gap-2 px-2 mb-3">
            {weeklyProgressData.map((day) => (
              <div key={day.day} className="flex-1 flex flex-col items-center">
                <span className={`text-xs font-medium ${
                  day.isToday ? 'text-green-600 font-bold' : 'text-gray-500'
                }`}>
                  {day.day}
                </span>
              </div>
            ))}
          </div>

          {/* Checkmarks */}
          <div className="flex justify-between gap-2 px-2 mb-5">
            {weeklyProgressData.map((day) => (
              <div key={`check-${day.day}`} className="flex-1 flex justify-center">
                {day.isActive ? (
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center shadow-sm">
                    <Check size={12} className="text-white" strokeWidth={3} />
                  </div>
                ) : day.isPast ? (
                  <div className="w-5 h-5 rounded-full bg-gray-200" />
                ) : null}
              </div>
            ))}
          </div>

          {/* Stats Row */}
          <div className="flex items-center justify-around pt-4 border-t border-gray-100">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">{daysActive}</div>
              <div className="text-xs text-gray-500 font-medium">Days Active</div>
            </div>
            <div className="w-px h-10 bg-gray-200" />
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">{weeklyPoints}</div>
              <div className="text-xs text-gray-500 font-medium">Total Points</div>
            </div>
            <div className="w-px h-10 bg-gray-200" />
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-500">{avgScore}%</div>
              <div className="text-xs text-gray-500 font-medium">Avg. Score</div>
            </div>
          </div>
        </div>

        {/* Most Eaten Plants - List Style with Scrolling */}
        <div className="bg-white/70 backdrop-blur-md rounded-3xl p-5 shadow-lg border border-white/50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center">
                <span className="text-lg">🌱</span>
              </div>
              <h2 className="text-lg font-bold text-gray-800">Eaten Plants</h2>
            </div>
            {topPlants.length > 4 && (
              <button
                onClick={() => setShowAllPlantsModal(!showAllPlantsModal)}
                className="flex items-center gap-1 text-sm font-semibold text-green-600 hover:text-green-700 transition-colors"
              >
                View All
                <ChevronRight size={16} />
              </button>
            )}
          </div>

          {topPlants.length > 0 ? (
            <div 
              className={`flex flex-col gap-3 ${showAllPlantsModal ? 'max-h-96 overflow-y-auto pr-1' : ''}`}
              style={showAllPlantsModal ? { scrollbarWidth: 'thin' } : {}}
            >
              {(showAllPlantsModal ? topPlants : topPlants.slice(0, 4)).map((plant, index) => (
                <div
                  key={plant.id}
                  className="flex items-center gap-4 bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all"
                >
                  {/* Emoji in rounded box */}
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-3xl">{plant.emoji || '🌱'}</span>
                  </div>
                  
                  {/* Plant info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-800 text-base truncate">{plant.name}</h3>
                    <p className="text-sm text-gray-500">Eaten {plant.times_eaten}x</p>
                    {/* Progress bar */}
                    <div className="mt-2 w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-green-400 to-green-500 h-full rounded-full transition-all"
                        style={{ width: `${Math.min((plant.times_eaten / 5) * 100, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Rank badge or checkmark */}
                  <div className="flex-shrink-0">
                    {plant.times_eaten >= 5 ? (
                      <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center shadow-sm">
                        <Check size={16} className="text-white" strokeWidth={3} />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                        {index + 1}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {/* View all button at bottom */}
              {topPlants.length > 4 && (
                <button
                  onClick={() => setShowAllPlantsModal(!showAllPlantsModal)}
                  className="w-full py-3 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200 text-green-700 font-semibold text-sm hover:from-green-100 hover:to-green-200 transition-all flex items-center justify-center gap-2"
                >
                  <span>{showAllPlantsModal ? 'Show less' : `View all ${topPlants.length} plants`}</span>
                  <ChevronRight size={16} className={`transition-transform ${showAllPlantsModal ? 'rotate-90' : ''}`} />
                </button>
              )}
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
