import React, { useState, useEffect } from 'react';
import { Award, Trophy, TrendingUp, Calendar } from 'lucide-react';
import { logsAPI, badgesAPI } from '../api';

const ProfilePage = ({ onBack, userName, userId, score }) => {
  const [showBadgePopup, setShowBadgePopup] = useState(null);
  const [topPlants, setTopPlants] = useState([]);
  const [weeklyData, setWeeklyData] = useState(null);
  const [userBadges, setUserBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  // Badge thresholds
  const BADGE_THRESHOLDS = [
    { level: 1, points: 10, name: 'Plant Starter', emoji: '🌱' },
    { level: 2, points: 25, name: 'Green Guardian', emoji: '🌿' },
    { level: 3, points: 50, name: 'Nature Hero', emoji: '🌳' },
    { level: 4, points: 100, name: 'Biome Master', emoji: '🌲' },
    { level: 5, points: 150, name: 'Plant Legend', emoji: '🌴' }
  ];

  // Weekly goal
  const WEEKLY_GOAL = weeklyData?.summary?.weeklyGoal || 30;

  // Fetch data on mount
  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const [topPlantsData, weeklyDataRes, badgesData] = await Promise.all([
        logsAPI.getTopPlants(5),
        logsAPI.getWeekly(),
        badgesAPI.getUserBadges().catch(() => ({ badges: [] }))
      ]);

      setTopPlants(topPlantsData || []);
      setWeeklyData(weeklyDataRes);
      setUserBadges(badgesData.badges || []);
    } catch (err) {
      console.error('Failed to fetch profile data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Get total points (from weekly data or prop)
  const totalPoints = weeklyData?.summary?.allTimePoints || score || 0;

  // Weekly stats
  const weeklyPoints = weeklyData?.summary?.weeklyPoints || 0;
  const uniquePlantsThisWeek = weeklyData?.summary?.uniquePlants || 0;

  // Get unlocked badges based on total points
  const unlockedBadgesList = BADGE_THRESHOLDS.filter(badge => totalPoints >= badge.points);

  // Get next badge
  const nextBadge = BADGE_THRESHOLDS.find(badge => totalPoints < badge.points);

  // Get motivation message based on weekly progress
  const getMotivationMessage = () => {
    const remaining = WEEKLY_GOAL - weeklyPoints;
    if (weeklyPoints >= WEEKLY_GOAL) {
      return { message: '🎉 Weekly goal achieved! Great work!', color: 'text-green-600', bgColor: 'bg-green-50' };
    } else if (remaining > 0) {
      return {
        message: `💪 ${remaining} more points to unlock this week's badge! You got this!`,
        color: 'text-[#5a9f6e]',
        bgColor: 'bg-green-50'
      };
    }
    return { message: '', color: '', bgColor: '' };
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
      {/* Badge Unlock Popup */}
      {showBadgePopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 max-w-sm mx-4 animate-bounce shadow-2xl transform scale-100">
            <div className="text-center">
              <div className="text-8xl mb-4 animate-pulse">{showBadgePopup.emoji}</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Badge Unlocked!</h3>
              <p className="text-lg text-green-600 font-semibold mb-2">{showBadgePopup.name}</p>
              <p className="text-gray-600 mb-6">You've reached {showBadgePopup.points} points!</p>
              <button
                onClick={() => setShowBadgePopup(null)}
                className="bg-green-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-600 transition-colors"
              >
                Celebrate! 🎉
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header with back button */}
      <div className="flex-shrink-0 bg-white/80 backdrop-blur-md border-b border-gray-200 p-4 flex items-center justify-between">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <span className="text-xl">←</span>
        </button>
        <h1 className="text-lg font-bold text-gray-800">Profile</h1>
        <div className="w-10" />
      </div>

      <div className="flex-1 overflow-y-auto px-5 pt-2 pb-32">
        {/* Header with Avatar */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 rounded-full overflow-hidden shadow-xl border-4 border-white mb-4 ring-4 ring-[#5a9f6e]/20">
            <img
              src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${userId}`}
              alt="Profile Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">{userName}</h1>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm text-gray-500 font-mono bg-white/70 backdrop-blur-sm px-3 py-1 rounded-full">
              ID: {userId}
            </span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-gradient-to-br from-[#6fb584] to-[#5a9f6e] rounded-2xl p-4 shadow-lg text-white">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp size={20} />
              <span className="text-2xl">🌟</span>
            </div>
            <div className="text-2xl font-bold mb-1">{totalPoints}</div>
            <div className="text-xs opacity-90">Total Points</div>
          </div>

          <div className="bg-gradient-to-br from-amber-400 to-amber-500 rounded-2xl p-4 shadow-lg text-white">
            <div className="flex items-center justify-between mb-2">
              <Trophy size={20} />
              <span className="text-2xl">🏆</span>
            </div>
            <div className="text-2xl font-bold mb-1">{unlockedBadgesList.length}/{BADGE_THRESHOLDS.length}</div>
            <div className="text-xs opacity-90">Badges Unlocked</div>
          </div>
        </div>

        {/* Motivation Message */}
        {getMotivationMessage().message && (
          <div className={`${getMotivationMessage().bgColor} border border-green-200 rounded-2xl p-4 mb-6`}>
            <p className={`${getMotivationMessage().color} font-semibold text-center text-sm`}>
              {getMotivationMessage().message}
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
              const isUnlocked = totalPoints >= badge.points;
              return (
                <div
                  key={badge.level}
                  className={`rounded-2xl p-4 border-2 shadow-md transition-all transform hover:scale-105 cursor-pointer ${
                    isUnlocked
                      ? 'bg-gradient-to-br from-yellow-100 to-amber-100 border-amber-300 hover:shadow-lg'
                      : 'bg-white/60 border-dashed border-gray-300'
                  }`}
                  onClick={() => isUnlocked && setShowBadgePopup(badge)}
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
                  className="bg-gradient-to-r from-[#6fb584] to-[#5a9f6e] h-full transition-all duration-500"
                  style={{ width: `${Math.min((totalPoints / nextBadge.points) * 100, 100)}%` }}
                />
              </div>
              <p className="text-xs text-gray-600 mt-2">
                {nextBadge.points - totalPoints} points to go!
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
              <span className="text-lg font-bold text-green-600">{weeklyPoints}/{WEEKLY_GOAL}</span>
            </div>
            <div>
              <div className="w-full bg-gray-300 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-green-400 to-green-600 h-full transition-all duration-500"
                  style={{ width: `${Math.min((weeklyPoints / WEEKLY_GOAL) * 100, 100)}%` }}
                />
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200">
              <span className="text-sm font-medium text-gray-700">Unique Plants This Week</span>
              <span className="text-lg font-bold text-[#5a9f6e]">{uniquePlantsThisWeek}</span>
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
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-[#6fb584] to-[#5a9f6e] text-white font-bold text-sm flex-shrink-0">
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
