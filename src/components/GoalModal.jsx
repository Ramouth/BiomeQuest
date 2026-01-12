import React, { useState } from 'react';
import { Minus, Plus } from 'lucide-react';

const GoalModal = ({ currentGoal, onSave, onClose }) => {
  const [goal, setGoal] = useState(currentGoal || 30);

  const increment = () => setGoal(prev => Math.min(prev + 5, 200));
  const decrement = () => setGoal(prev => Math.max(prev - 5, 5));

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50 pb-20">
      <div className="bg-white rounded-t-3xl w-full max-w-[390px] p-6 animate-slide-up">
        <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-6" />
        
        <h2 className="text-xl font-medium mb-2">Set Weekly Goal</h2>
        <p className="text-sm text-gray-500 mb-6">
          Choose your target points for this week
        </p>

        <div className="bg-gray-100 rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={decrement}
              className="w-12 h-12 rounded-full bg-white hover:bg-gray-100 flex items-center justify-center transition-colors"
            >
              <Minus className="w-5 h-5 text-gray-600" />
            </button>

            <div className="text-center min-w-[100px]">
              <div className="text-4xl font-medium text-green-500">{goal}</div>
              <div className="text-sm text-gray-500 mt-1">points</div>
            </div>

            <button
              onClick={increment}
              className="w-12 h-12 rounded-full bg-white hover:bg-gray-100 flex items-center justify-center transition-colors"
            >
              <Plus className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(goal)}
            className="flex-1 py-3 bg-green-500 hover:bg-green-600 text-white rounded-full transition-colors font-medium"
          >
            Save goal
          </button>
        </div>
      </div>
    </div>
  );
};

export default GoalModal;
