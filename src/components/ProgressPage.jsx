import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import GoalModal from './GoalModal';

const ProgressPage = ({ score, eatenFoods, foodRegistrations, foods }) => {
  const [weeklyGoal, setWeeklyGoal] = useState(30);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [selectedDayIndex, setSelectedDayIndex] = useState(null);

  const today = new Date();
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const currentDayIndex = today.getDay() === 0 ? 6 : today.getDay() - 1;
  
  // Set initial selected day to today
  const displayDayIndex = selectedDayIndex !== null ? selectedDayIndex : currentDayIndex;
  
  // Get data for selected day
  const getSelectedDayData = () => {
    const selectedDate = new Date(today);
    const daysDiff = displayDayIndex - currentDayIndex;
    selectedDate.setDate(selectedDate.getDate() + daysDiff);
    
    return foodRegistrations.filter(reg => {
      const regDate = new Date(reg.timestamp);
      return regDate.toDateString() === selectedDate.toDateString();
    });
  };
  
  const selectedDayRegistrations = getSelectedDayData();
  const selectedDayPoints = selectedDayRegistrations.reduce((sum, reg) => sum + reg.points, 0);
  
  // Calculate daily points from registrations (for today)
  const dailyPoints = foodRegistrations.reduce((sum, reg) => sum + reg.points, 0);
  
  // Weekly progress (using daily points * days)
  const weeklyProgress = dailyPoints;
  const progressPercent = Math.min((weeklyProgress / weeklyGoal) * 100, 100);

  const handleSetGoal = () => {
    setShowGoalModal(false);
  };

  const handleSaveGoal = (goal) => {
    setWeeklyGoal(goal);
    setShowGoalModal(false);
  };
  
  const handleDaySelect = (index) => {
    // Allow selecting past days and today, but not future days
    if (index <= currentDayIndex) {
      setSelectedDayIndex(index === selectedDayIndex ? null : index);
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-white overflow-hidden">
      {/* Scrollable content area */}
      <div className="flex-1 overflow-y-auto px-6 pt-6 pb-24" style={{ WebkitOverflowScrolling: 'touch' }}>
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">My Progress</h1>
        </div>

        {/* Days of Week Selector */}
        <div className="flex items-center justify-between mb-5 bg-white/50 rounded-2xl p-1">
          {daysOfWeek.map((day, index) => (
            <button
              key={day}
              onClick={() => handleDaySelect(index)}
              disabled={index > currentDayIndex}
              className={`flex-1 py-2 px-1 rounded-xl text-sm font-medium transition-colors ${
                index > currentDayIndex
                  ? 'text-gray-300 cursor-not-allowed opacity-50'
                  : displayDayIndex === index
                  ? 'bg-[#6fb584] text-white'
                  : 'text-gray-500 hover:text-gray-700'
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
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <span>🌱</span>
            {displayDayIndex === currentDayIndex ? "Today's Points" : `${daysOfWeek[displayDayIndex]}'s Points`}
          </h2>
          <button className="text-gray-400 hover:text-gray-600">⋯</button>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
          {selectedDayRegistrations.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-gray-500">No plants registered on this day.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {selectedDayRegistrations.map((registration, index) => {
                const food = foods.find(f => f.id === registration.foodId);
                return (
                  <div key={index} className="flex items-center justify-between py-3 border-b last:border-b-0">
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0 text-3xl">
                        {food?.emoji || '🌱'}
                      </div>
                      <span className="font-medium text-gray-800 text-base">{registration.foodName}</span>
                    </div>
                    <span className="text-green-500 font-bold text-lg">
                      {registration.points} pt.
                    </span>
                  </div>
                );
              })}
              
              {/* Total Plants for Selected Day */}
              <div className="pt-3 mt-2">
                <p className="text-center text-sm text-gray-600">
                  <span>Total plants {displayDayIndex === currentDayIndex ? 'today' : `on ${daysOfWeek[displayDayIndex]}`}: </span>
                  <span className="font-bold text-gray-800">{selectedDayRegistrations.length}</span>
                  <span className="ml-1">🌿</span>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* This Week Section */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4">
          <Calendar className="w-6 h-6 text-green-500" />
          This Week
          <span className="ml-auto text-sm font-semibold text-gray-600">
            {weeklyProgress} / {weeklyGoal} points
          </span>
        </h2>

        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
          {/* Progress Bar */}
          <div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className="bg-green-500 h-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Weekly Goal Info */}
          {weeklyGoal ? (
            <div className="flex items-center justify-between py-3 px-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span className="text-sm font-medium text-gray-700">Weekly goal: {weeklyGoal} points</span>
              </div>
              <button
                onClick={() => setShowGoalModal(true)}
                className="text-green-500 hover:text-green-600 font-medium text-sm"
              >
                Edit
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowGoalModal(true)}
              className="w-full px-4 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
            >
              Set weekly goal
            </button>
          )}

          {/* Goal Updated Message */}
          {weeklyProgress >= weeklyGoal && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
              <span className="text-xl">✓</span>
              <div>
                <p className="font-semibold text-green-700">Goal updated</p>
                <p className="text-sm text-green-600">Weekly goal set to {weeklyGoal} points!</p>
              </div>
              <span className="text-lg ml-auto">→</span>
            </div>
          )}
        </div>
      </div>

      {/* Growing Plant Visualization */}
      <div className="text-center space-y-3">
        {(() => {
          // Growth stages based on total score (capped at 150 points for max size)
          const maxPoints = 150;
          const growthPercent = Math.min(score / maxPoints, 1);

          // Scale from 3rem (48px) to 8rem (128px)
          const minSize = 48;
          const maxSize = 128;
          const plantSize = minSize + (maxSize - minSize) * growthPercent;

          // Plant stages: seedling -> sprout -> plant -> tree
          let plantEmoji = '🌱';
          let stageName = 'Seedling';
          if (score >= 100) {
            plantEmoji = '🌳';
            stageName = 'Mighty Tree';
          } else if (score >= 50) {
            plantEmoji = '🌿';
            stageName = 'Thriving Plant';
          } else if (score >= 25) {
            plantEmoji = '🌱';
            stageName = 'Growing Sprout';
          } else if (score >= 10) {
            plantEmoji = '🌱';
            stageName = 'Young Seedling';
          }

          return (
            <>
              <div
                className="transition-all duration-700 ease-out inline-block"
                style={{
                  fontSize: `${plantSize}px`,
                  transform: `scale(${0.8 + growthPercent * 0.2})`,
                  filter: `drop-shadow(0 ${4 + growthPercent * 8}px ${8 + growthPercent * 12}px rgba(34, 197, 94, ${0.2 + growthPercent * 0.2}))`
                }}
              >
                {plantEmoji}
              </div>
              <p className="text-gray-600 font-medium text-lg">Your biome is growing!</p>
              <p className="text-sm text-gray-500">{stageName} • {score} pts</p>
              {/* Growth progress bar */}
              <div className="max-w-[200px] mx-auto mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-green-400 to-green-600 h-full transition-all duration-700"
                    style={{ width: `${growthPercent * 100}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {score >= maxPoints ? 'Max growth reached!' : `${maxPoints - score} pts to full growth`}
                </p>
              </div>
            </>
          );
        })()}
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
