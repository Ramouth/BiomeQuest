/**
 * ProgressPage View
 * Pure presentational component using ViewModels
 */

import React, { useState } from 'react';
import { Calendar, ChevronRight } from 'lucide-react';
import GoalModal from './shared/GoalModal';
import { useProgress } from '../viewmodels/useProgress';
import { useGrowth } from '../viewmodels/useGrowth';

const ProgressPage = ({ score }) => {
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showAllPlants, setShowAllPlants] = useState(false);

  // Use ViewModels for business logic
  const {
    weeklyGoal,
    uniquePlantsGoal,
    dailyLogs,
    loading,
    displayDayIndex,
    currentDayIndex,
    weeklyProgress,
    uniquePlants,
    pointsProgress,
    plantsProgress,
    progressPercent,
    goalAchieved,
    dailyPoints,
    totalScore,
    handleDaySelect,
    saveWeeklyGoal
  } = useProgress();

  // Use growth ViewModel for plant visualization
  const {
    plantEmoji,
    stageName,
    plantStyle,
    growthPercent,
    pointsToMaxGrowth,
    isMaxGrowth
  } = useGrowth(totalScore || score);

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const handleSaveGoal = (goal) => {
    saveWeeklyGoal(goal);
    setShowGoalModal(false);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-900">
        <p className="text-gray-500 dark:text-gray-400">Loading progress...</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex flex-col bg-white dark:bg-gray-900 overflow-hidden">
      {/* Scrollable content area */}
      <div className="flex-1 overflow-y-auto px-6 pt-6 pb-24" style={{ WebkitOverflowScrolling: 'touch' }}>
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">My Progress</h1>
        </div>

        {/* Days of Week Selector */}
        <div className="flex items-center justify-between mb-5 bg-white/50 dark:bg-gray-800/50 rounded-2xl p-1">
          {daysOfWeek.map((day, index) => (
            <button
              key={day}
              onClick={() => handleDaySelect(index)}
              disabled={index > currentDayIndex}
              className={`flex-1 py-2 px-1 rounded-xl text-sm font-medium transition-colors ${
                index > currentDayIndex
                  ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed opacity-50'
                  : displayDayIndex === index
                  ? 'bg-green-500 text-white'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
              title={index > currentDayIndex ? 'Future days are locked' : ''}
            >
              {day}
            </button>
          ))}
        </div>

        {/* Today's Points Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <span>🌱</span>
              {displayDayIndex === currentDayIndex ? "Today's Points" : `${daysOfWeek[displayDayIndex]}'s Points`}
            </h2>
            <span className="text-green-600 dark:text-green-400 font-bold">{dailyPoints} pts</span>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
            {dailyLogs.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-gray-500 dark:text-gray-400">No plants registered on this day.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Plant list - show 4 or all based on state */}
                <div className="space-y-3">
                  {(showAllPlants ? dailyLogs : dailyLogs.slice(0, 4)).map((log, index) => (
                    <div key={log.id || index} className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0 text-3xl">
                          {log.emoji || '🌱'}
                        </div>
                        <span className="font-medium text-gray-800 dark:text-white text-base">{log.plant_name}</span>
                      </div>
                      <span className="text-green-600 dark:text-green-400 font-bold text-lg">
                        {log.points_earned} pt.
                      </span>
                    </div>
                  ))}
                </div>

                {/* View all button */}
                {dailyLogs.length > 4 && (
                  <button
                    onClick={() => setShowAllPlants(!showAllPlants)}
                    className="w-full py-3 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl border border-green-200 dark:border-green-700 text-green-700 dark:text-green-400 font-semibold text-sm hover:from-green-100 hover:to-green-200 dark:hover:from-green-900/30 dark:hover:to-green-800/30 transition-all flex items-center justify-center gap-2"
                  >
                    <span>{showAllPlants ? 'Show less' : `View all ${dailyLogs.length} plants`}</span>
                    <ChevronRight size={16} className={`transition-transform ${showAllPlants ? 'rotate-90' : ''}`} />
                  </button>
                )}

                {/* Total Plants for Selected Day */}
                <div className="pt-3 mt-2">
                  <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                    <span>Total plants {displayDayIndex === currentDayIndex ? 'today' : `on ${daysOfWeek[displayDayIndex]}`}: </span>
                    <span className="font-bold text-gray-800 dark:text-white">{dailyLogs.length}</span>
                    <span className="ml-1">🌿</span>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* This Week Section */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2 mb-4">
            <Calendar className="w-6 h-6 text-green-600 dark:text-green-400" />
            This Week
          </h2>

          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm space-y-4">
            {/* Points Progress */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-gray-700 dark:text-gray-200">Points</span>
                <span className="text-gray-600 dark:text-gray-400">{weeklyProgress} / {weeklyGoal}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    weeklyProgress >= weeklyGoal
                      ? 'bg-gradient-to-r from-green-500 to-green-600'
                      : 'bg-gradient-to-r from-blue-400 to-blue-500'
                  }`}
                  style={{ width: `${pointsProgress}%` }}
                />
              </div>
            </div>

            {/* Unique Plants Progress */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-gray-700 dark:text-gray-200">Unique Plants</span>
                <span className="text-gray-600 dark:text-gray-400">{uniquePlants} / {uniquePlantsGoal}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    uniquePlants >= uniquePlantsGoal
                      ? 'bg-gradient-to-r from-green-500 to-green-600'
                      : 'bg-gradient-to-r from-purple-400 to-purple-500'
                  }`}
                  style={{ width: `${plantsProgress}%` }}
                />
              </div>
            </div>

            {/* Weekly Goal Info */}
            <div className="py-3 px-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
              <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
                Weekly goal: <span className="font-semibold">{weeklyGoal} points</span> or <span className="font-semibold">{uniquePlantsGoal} different plants</span>
              </p>
            </div>

            {/* Goal Achieved Message */}
            {goalAchieved && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-3 flex items-center gap-2">
                <span className="text-xl">🎉</span>
                <div>
                  <p className="font-semibold text-green-600 dark:text-green-400">Goal achieved!</p>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    {weeklyProgress >= weeklyGoal && uniquePlants >= uniquePlantsGoal
                      ? `Amazing! You hit both goals: ${weeklyProgress} points AND ${uniquePlants} plants!`
                      : weeklyProgress >= weeklyGoal
                        ? `You've earned ${weeklyProgress} points this week!`
                        : `You've logged ${uniquePlants} different plants this week!`
                    }
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Growing Plant Visualization - Using ViewModel */}
        <div className="text-center space-y-3">
          <div
            className="transition-all duration-700 ease-out inline-block"
            style={plantStyle}
          >
            {plantEmoji}
          </div>
          <p className="text-gray-600 dark:text-gray-300 font-medium text-lg">Your biome is growing!</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{stageName} • {totalScore || score} pts</p>
          {/* Growth progress bar */}
          <div className="max-w-[200px] mx-auto mt-2">
            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-green-500 to-green-600 h-full transition-all duration-700"
                style={{ width: `${growthPercent * 100}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              {isMaxGrowth ? 'Max growth reached!' : `${pointsToMaxGrowth} pts to full growth`}
            </p>
          </div>
        </div>
      </div>

      {/* Goal Modal */}
      {showGoalModal && (
        <GoalModal
          currentGoal={weeklyGoal}
          onSave={handleSaveGoal}
          onClose={() => setShowGoalModal(false)}
        />
      )}
    </div>
  );
};

export default ProgressPage;
