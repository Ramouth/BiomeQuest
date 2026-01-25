/**
 * ProfilePage View
 * Pure presentational component using ViewModels
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Award, Trophy, TrendingUp, Settings, LogOut, Sparkles, Calendar, Check, ChevronRight, Moon, Shield, Bug } from 'lucide-react';
import { useProfile } from '../viewmodels/useProfile';
import { useBadges } from '../viewmodels/useBadges';
import { useAuth } from '../context/AuthContext';
import { useConfetti } from '../context/ConfettiContext';
import { getAvatarUrl } from '../constants/avatars';

const ProfilePage = ({ onBack, userName, userId, avatarId, score, animationsEnabled, onToggleAnimations, isDarkMode, onToggleDarkMode, isAdmin, onOpenAdmin }) => {
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
  const { triggerConfetti } = useConfetti();

  const handleBugReport = () => {
    const email = 's235437@student.dtu.dk';
    const subject = encodeURIComponent('Bug Report: BiomeQuest');
    const body = encodeURIComponent(`Hi,

I found a bug in BiomeQuest:

**What happened:**


**Steps to reproduce:**
1.
2.
3.

**Expected behavior:**


---
User: ${userName} (ID: ${userId})
`);
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    setShowSettingsMenu(false);
  };

  const handleSignOut = () => {
    setShowSettingsMenu(false);
    logout();
  };

  const handleCelebrate = () => {
    hideBadgePopup();
    triggerConfetti();
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <p className="text-gray-500 dark:text-gray-400">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex flex-col bg-gradient-to-b from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Badge Unlock Popup - only show when animations enabled */}
      {animationsEnabled && showBadgePopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-sm mx-4 animate-bounce shadow-2xl transform scale-100">
            <div className="text-center">
              <div className="text-8xl mb-4 animate-pulse">{showBadgePopup.emoji}</div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Badge Unlocked!</h3>
              <p className="text-lg text-green-600 dark:text-green-400 font-semibold mb-2">{showBadgePopup.name}</p>
              <p className="text-gray-600 dark:text-gray-300 mb-6">You've reached {showBadgePopup.points} points!</p>
              <button
                onClick={handleCelebrate}
                className="bg-green-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-600 transition-colors"
              >
                Celebrate! 🎉
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header with back button */}
      <div className="flex-shrink-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between relative z-[120]">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <span className="text-xl dark:text-white">←</span>
        </button>
        <h1 className="text-lg font-bold text-gray-800 dark:text-white">Profile</h1>
        <div className="relative">
          <button
            onClick={() => setShowSettingsMenu(!showSettingsMenu)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Settings size={20} className="text-gray-600 dark:text-gray-300" />
          </button>

          {showSettingsMenu && (
            <>
              <div
                className="fixed inset-0 z-[100]"
                onClick={() => setShowSettingsMenu(false)}
              />
              <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden z-[130]">
                {/* Animation Toggle */}
                <div className="px-4 py-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-700 dark:to-gray-800">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        animationsEnabled
                          ? 'bg-gradient-to-br from-amber-400 to-orange-500'
                          : 'bg-gray-200 dark:bg-gray-600'
                      }`}>
                        <Sparkles size={16} className={animationsEnabled ? 'text-white' : 'text-gray-500 dark:text-gray-400'} />
                      </div>
                      <div>
                        <span className="font-semibold text-gray-800 dark:text-gray-100 text-sm block">Animations</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
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
                        : 'bg-gray-200 dark:bg-gray-600'
                    }`}
                  >
                    <div className="absolute inset-0 flex items-center justify-between px-3">
                      <span className={`text-xs font-semibold transition-opacity ${
                        animationsEnabled ? 'text-white/70' : 'text-transparent'
                      }`}>ON</span>
                      <span className={`text-xs font-semibold transition-opacity ${
                        !animationsEnabled ? 'text-gray-500 dark:text-gray-400' : 'text-transparent'
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

                {/* Dark Mode Toggle */}
                <div className="px-4 py-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 border-t border-gray-100 dark:border-gray-600">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        isDarkMode
                          ? 'bg-gradient-to-br from-indigo-500 to-purple-600'
                          : 'bg-gray-200 dark:bg-gray-600'
                      }`}>
                        <Moon size={16} className={isDarkMode ? 'text-white' : 'text-gray-500 dark:text-gray-400'} />
                      </div>
                      <div>
                        <span className="font-semibold text-gray-800 dark:text-gray-100 text-sm block">Dark Mode</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {isDarkMode ? 'Dark theme active' : 'Light theme active'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={onToggleDarkMode}
                    className={`relative w-full h-10 rounded-xl transition-all duration-300 ${
                      isDarkMode
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30'
                        : 'bg-gray-200 dark:bg-gray-600'
                    }`}
                  >
                    <div className="absolute inset-0 flex items-center justify-between px-3">
                      <span className={`text-xs font-semibold transition-opacity ${
                        isDarkMode ? 'text-white/70' : 'text-transparent'
                      }`}>ON</span>
                      <span className={`text-xs font-semibold transition-opacity ${
                        !isDarkMode ? 'text-gray-500 dark:text-gray-400' : 'text-transparent'
                      }`}>OFF</span>
                    </div>
                    <div
                      className={`absolute top-1.5 w-12 h-7 bg-white rounded-lg shadow-md transition-all duration-300 flex items-center justify-center ${
                        isDarkMode ? 'left-[calc(100%-52px)]' : 'left-1.5'
                      }`}
                    >
                      <span className={`text-xs font-bold ${
                        isDarkMode ? 'text-indigo-600' : 'text-gray-500'
                      }`}>
                        {isDarkMode ? 'ON' : 'OFF'}
                      </span>
                    </div>
                  </button>
                </div>

                {/* Bug Report Button */}
                <div className="border-t border-gray-100 dark:border-gray-600">
                  <button
                    onClick={handleBugReport}
                    className="w-full flex items-center gap-3 px-4 py-3 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors"
                  >
                    <Bug size={18} />
                    <span className="font-medium">Report Bug</span>
                  </button>
                </div>

                {isAdmin && (
                  <div className="border-t border-gray-100 dark:border-gray-600">
                    <button
                      onClick={() => {
                        setShowSettingsMenu(false);
                        onOpenAdmin();
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
                    >
                      <Shield size={18} />
                      <span className="font-medium">Admin Panel</span>
                    </button>
                  </div>
                )}

                <div className="border-t border-gray-100 dark:border-gray-600">
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
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
          <div className="w-24 h-24 rounded-full overflow-hidden shadow-xl border-4 border-white dark:border-gray-700 mb-4 ring-4 ring-green-500/20 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/50 dark:to-green-800/50">
            <img
              src={getAvatarUrl(avatarId)}
              alt="Profile Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">{userName}</h1>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm text-gray-500 dark:text-gray-400 font-mono bg-white dark:bg-gray-700 px-3 py-1 rounded-full">
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
          <div className={`${motivationMessage.bgColor} border border-green-200 dark:border-green-700 rounded-2xl p-4 mb-6`}>
            <p className={`${motivationMessage.color} font-semibold text-center text-sm`}>
              {motivationMessage.emoji} {motivationMessage.message}
            </p>
          </div>
        )}

        {/* Achievement Badges Section */}
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-3xl p-5 mb-6 shadow-lg border border-white/50 dark:border-gray-700/50">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
              <Award size={18} className="text-white" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Achievement Badges</h2>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {BADGE_THRESHOLDS.map((badge) => {
              const isUnlocked = checkBadgeUnlocked(badge.level);
              return (
                <div
                  key={badge.level}
                  className={`rounded-2xl p-4 border-2 shadow-md transition-all transform hover:scale-105 cursor-pointer ${
                    isUnlocked
                      ? 'bg-gradient-to-br from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30 border-amber-300 dark:border-amber-600 hover:shadow-lg'
                      : 'bg-white/60 dark:bg-gray-700/60 border-dashed border-gray-300 dark:border-gray-600'
                  }`}
                  onClick={() => isUnlocked && showBadge(badge)}
                >
                  <div className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2 shadow-md ${
                      isUnlocked
                        ? 'bg-gradient-to-br from-yellow-400 to-amber-500'
                        : 'bg-gray-200 dark:bg-gray-600'
                    }`}>
                      <span className="text-2xl">{isUnlocked ? badge.emoji : '🔒'}</span>
                    </div>
                    <div className="text-xs font-semibold text-gray-700 dark:text-gray-200 text-center">
                      {isUnlocked ? badge.name : 'Locked'}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 text-center mt-1">
                      {badge.points} pts
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Next Badge Progress */}
          {nextBadge && (
            <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-2xl border border-green-200 dark:border-green-700">
              <p className="text-sm text-gray-700 dark:text-gray-200 mb-2">
                <span className="font-semibold">Next Badge:</span> {nextBadge.name} ({nextBadge.points} pts)
              </p>
              <div className="w-full bg-gray-300 dark:bg-gray-600 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-green-500 to-green-600 h-full transition-all duration-500"
                  style={{ width: `${progressToNext}%` }}
                />
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                {pointsToNextBadge} points to go!
              </p>
            </div>
          )}
        </div>

        {/* Weekly Progress Section - Polished Design */}
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-3xl p-5 mb-6 shadow-lg border border-white/50 dark:border-gray-700/50">
          {/* Header */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center shadow-md">
              <Calendar size={20} className="text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Weekly Progress</h2>
          </div>

          {/* Weekly Goal Progress Bar */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-4 mb-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Weekly Goal</span>
              <span className="text-sm font-bold text-green-600 dark:text-green-400">{daysActive}/7 days</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3 overflow-hidden">
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
                        : 'bg-gray-200 dark:bg-gray-600'
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
                  day.isToday ? 'text-green-600 dark:text-green-400 font-bold' : 'text-gray-500 dark:text-gray-400'
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
                  <div className="w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-600" />
                ) : null}
              </div>
            ))}
          </div>

          {/* Stats Row */}
          <div className="flex items-center justify-around pt-4 border-t border-gray-100 dark:border-gray-600">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800 dark:text-white">{daysActive}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">Days Active</div>
            </div>
            <div className="w-px h-10 bg-gray-200 dark:bg-gray-600" />
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800 dark:text-white">{weeklyPoints}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">Total Points</div>
            </div>
            <div className="w-px h-10 bg-gray-200 dark:bg-gray-600" />
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-500">{avgScore}%</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">Avg. Score</div>
            </div>
          </div>
        </div>

        {/* Most Eaten Plants - List Style with Scrolling */}
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-3xl p-5 shadow-lg border border-white/50 dark:border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center">
                <span className="text-lg">🌱</span>
              </div>
              <h2 className="text-lg font-bold text-gray-800 dark:text-white">Eaten Plants</h2>
            </div>
            {topPlants.length > 4 && (
              <button
                onClick={() => setShowAllPlantsModal(!showAllPlantsModal)}
                className="flex items-center gap-1 text-sm font-semibold text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors"
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
                  className="flex items-center gap-4 bg-white dark:bg-gray-700 rounded-2xl p-4 border border-gray-100 dark:border-gray-600 shadow-sm hover:shadow-md transition-all"
                >
                  {/* Emoji in rounded box */}
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-3xl">{plant.emoji || '🌱'}</span>
                  </div>

                  {/* Plant info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-800 dark:text-white text-base truncate">{plant.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Eaten {plant.times_eaten}x</p>
                    {/* Progress bar */}
                    <div className="mt-2 w-full bg-gray-100 dark:bg-gray-600 rounded-full h-2 overflow-hidden">
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
                  className="w-full py-3 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl border border-green-200 dark:border-green-700 text-green-700 dark:text-green-400 font-semibold text-sm hover:from-green-100 hover:to-green-200 dark:hover:from-green-900/30 dark:hover:to-green-800/30 transition-all flex items-center justify-center gap-2"
                >
                  <span>{showAllPlantsModal ? 'Show less' : `View all ${topPlants.length} plants`}</span>
                  <ChevronRight size={16} className={`transition-transform ${showAllPlantsModal ? 'rotate-90' : ''}`} />
                </button>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-6xl mb-3 opacity-30">🌱</div>
              <p className="text-gray-500 dark:text-gray-400 font-medium mb-2">No plants logged yet</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">Start logging your plant-based foods!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
