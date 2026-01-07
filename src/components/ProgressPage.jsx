import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import { BananaIcon, AppleIcon, MangoIcon } from './FoodIcons';

const ProgressPage = ({ score, eatenFoods, foodRegistrations, foods }) => {
  const [weeklyGoal, setWeeklyGoal] = useState(30);
  const [showGoalInput, setShowGoalInput] = useState(false);
  const [goalInput, setGoalInput] = useState(weeklyGoal);

  const today = new Date();
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const currentDayIndex = today.getDay() === 0 ? 6 : today.getDay() - 1;
  
  // Calculate daily points from registrations
  const dailyPoints = foodRegistrations.reduce((sum, reg) => sum + reg.points, 0);
  
  // Weekly progress (using daily points * days)
  const weeklyProgress = dailyPoints;
  const progressPercent = Math.min((weeklyProgress / weeklyGoal) * 100, 100);

  const handleSetGoal = () => {
    setWeeklyGoal(parseInt(goalInput));
    setShowGoalInput(false);
  };

  return (
    <div className="h-screen w-screen flex flex-col fixed inset-0 bg-white">
      {/* Scrollable content area */}
      <div className="flex-1 overflow-y-auto smooth-scroll px-6 pt-6" style={{ WebkitOverflowScrolling: 'touch' }}>
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">My Progress</h1>
        </div>

        {/* Days of Week Selector */}
        <div className="flex gap-2 mb-8 justify-between">
        {daysOfWeek.map((day, index) => (
          <button
            key={day}
            className={`flex-1 px-2 py-2 rounded-lg font-semibold text-sm transition-all ${
              index === currentDayIndex
                ? 'bg-green-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Today's Points Section */}
      <div className="mb-8 pr-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <span>🌱</span>
            Today's Points
          </h2>
          <button className="text-gray-400 hover:text-gray-600 text-xl">⋯</button>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
          {foodRegistrations.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-gray-500">No plants registered today yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {foodRegistrations.map((registration, index) => {
                const food = foods.find(f => f.id === registration.foodId);
                return (
                  <div key={index} className="flex items-center justify-between py-3 border-b last:border-b-0">
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                        {registration.foodId === 'banana' && <BananaIcon size={32} />}
                        {registration.foodId === 'apple' && <AppleIcon size={32} />}
                        {registration.foodId === 'mango' && <MangoIcon size={32} />}
                        {!['banana', 'apple', 'mango'].includes(registration.foodId) && <span className="text-2xl">{food?.emoji}</span>}
                      </div>
                      <span className="font-medium text-gray-800 text-base">{registration.foodName}</span>
                    </div>
                    <span className="text-green-500 font-bold text-lg">
                      {registration.points} pt.
                    </span>
                  </div>
                );
              })}
              
              {/* Total Plants Today */}
              <div className="pt-3 mt-2">
                <p className="text-center text-sm text-gray-600">
                  <span>Total plants today: </span>
                  <span className="font-bold text-gray-800">{eatenFoods.size}</span>
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
          {!showGoalInput ? (
            <div className="flex items-center gap-2 py-2">
              <span className="text-green-500">✓</span>
              <span className="font-medium text-gray-800">Weekly goal: {weeklyGoal} points</span>
            </div>
          ) : (
            <div className="flex gap-2 py-2">
              <input
                type="number"
                value={goalInput}
                onChange={(e) => setGoalInput(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                onClick={handleSetGoal}
                className="px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600"
              >
                Set
              </button>
            </div>
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

      {/* BiomeDude Mascot */}
      <div className="text-center space-y-3 pb-24 pr-6">
        <div className="text-8xl">🌱</div>
        <p className="text-gray-600 font-medium text-lg">Your biome is growing!</p>
      </div>
      </div>
    </div>
  );
};

export default ProgressPage;
