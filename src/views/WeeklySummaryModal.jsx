import React, { useState } from 'react';
import { Trophy, TrendingUp, Leaf, Target, X, Star, Sparkles } from 'lucide-react';

const WeeklySummaryModal = ({
  lastWeek,
  personalBests,
  isNewPointsRecord,
  isNewPlantsRecord,
  currentGoal,
  onSetGoal,
  onClose
}) => {
  const [newGoal, setNewGoal] = useState(currentGoal);
  const [isSettingGoal, setIsSettingGoal] = useState(false);

  const handleSetGoal = async () => {
    if (newGoal && newGoal > 0) {
      setIsSettingGoal(true);
      try {
        await onSetGoal(newGoal);
        onClose();
      } catch (err) {
        console.error('Failed to set goal:', err);
        setIsSettingGoal(false);
      }
    } else {
      onClose();
    }
  };

  const hasActivity = lastWeek.points > 0 || lastWeek.uniquePlants > 0;
  const hasNewRecord = isNewPointsRecord || isNewPlantsRecord;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl relative overflow-hidden">
        {/* Celebration background for new records */}
        {hasNewRecord && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-4 left-4 text-2xl animate-bounce">🎉</div>
            <div className="absolute top-8 right-6 text-xl animate-pulse">✨</div>
            <div className="absolute bottom-20 left-6 text-xl animate-bounce delay-100">🌟</div>
            <div className="absolute bottom-24 right-4 text-2xl animate-pulse delay-200">🎊</div>
          </div>
        )}

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors z-10"
        >
          <X size={20} className="text-gray-500 dark:text-gray-400" />
        </button>

        {/* Header */}
        <div className="text-center mb-6 relative">
          <div className={`w-16 h-16 mx-auto mb-3 rounded-2xl flex items-center justify-center ${
            hasNewRecord
              ? 'bg-gradient-to-br from-yellow-400 to-orange-500 animate-pulse'
              : 'bg-gradient-to-br from-green-400 to-green-600'
          }`}>
            {hasNewRecord ? (
              <Trophy className="w-8 h-8 text-white" />
            ) : (
              <TrendingUp className="w-8 h-8 text-white" />
            )}
          </div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            {hasNewRecord ? 'New Personal Best!' : 'Weekly Summary'}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {lastWeek.startDate} - {lastWeek.endDate}
          </p>
        </div>

        {/* Last Week Stats */}
        {hasActivity ? (
          <div className="space-y-3 mb-6">
            {/* Points */}
            <div className={`rounded-2xl p-4 ${
              isNewPointsRecord
                ? 'bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-2 border-yellow-400'
                : 'bg-gray-50 dark:bg-gray-700/50'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    isNewPointsRecord
                      ? 'bg-yellow-400 text-white'
                      : 'bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400'
                  }`}>
                    <Star className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Points Earned</p>
                    <p className="text-2xl font-bold text-gray-800 dark:text-white">
                      {lastWeek.points}
                    </p>
                  </div>
                </div>
                {isNewPointsRecord ? (
                  <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> NEW!
                  </span>
                ) : (
                  <div className="text-right">
                    <p className="text-xs text-gray-400">Best: {personalBests.points}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Unique Plants */}
            <div className={`rounded-2xl p-4 ${
              isNewPlantsRecord
                ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-400'
                : 'bg-gray-50 dark:bg-gray-700/50'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    isNewPlantsRecord
                      ? 'bg-green-500 text-white'
                      : 'bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400'
                  }`}>
                    <Leaf className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Unique Plants</p>
                    <p className="text-2xl font-bold text-gray-800 dark:text-white">
                      {lastWeek.uniquePlants}
                    </p>
                  </div>
                </div>
                {isNewPlantsRecord ? (
                  <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> NEW!
                  </span>
                ) : (
                  <div className="text-right">
                    <p className="text-xs text-gray-400">Best: {personalBests.uniquePlants}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 mb-6">
            <div className="text-4xl mb-3">🌱</div>
            <p className="text-gray-600 dark:text-gray-300 font-medium">No plants logged last week</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Let's make this week count!</p>
          </div>
        )}

        {/* Goal Setting */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-5 h-5 text-blue-500" />
            <p className="font-semibold text-gray-800 dark:text-white">This Week's Goal</p>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <input
              type="number"
              value={newGoal}
              onChange={(e) => setNewGoal(parseInt(e.target.value) || 0)}
              min="1"
              max="1000"
              className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-xl px-4 py-3 text-gray-800 dark:text-white font-bold text-lg text-center focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <span className="text-gray-500 dark:text-gray-400 font-medium">points</span>
          </div>

          <button
            onClick={handleSetGoal}
            disabled={isSettingGoal}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-green-300 disabled:to-green-400 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
          >
            {isSettingGoal ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Setting...
              </>
            ) : (
              <>
                Let's Go! 🚀
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WeeklySummaryModal;
