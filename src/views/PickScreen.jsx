import React, { useState, useMemo } from 'react';
import { Search, Plus, X, Sparkles, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react';

const PickScreen = ({ score, onFoodSelect, foods, eatenFoods }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [recentlyAdded, setRecentlyAdded] = useState(null);
  const [showRepeatFoods, setShowRepeatFoods] = useState(false);

  const filteredFoods = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase().trim();
    return foods.filter(food => food.name.toLowerCase().includes(query));
  }, [searchQuery, foods]);

  const handleFoodSelect = (food) => {
    onFoodSelect(food);
    setRecentlyAdded(food.id);
    setTimeout(() => setRecentlyAdded(null), 1500);
    setSearchQuery('');
  };

  const showSearchResults = searchQuery.trim().length > 0;

  // Separate new and repeat foods for better visibility
  const newFoods = foods.filter(f => !eatenFoods.has(f.id));
  const repeatFoods = foods.filter(f => eatenFoods.has(f.id));

  return (
    <div className="h-screen w-screen bg-gradient-to-b from-green-50 to-white flex flex-col fixed inset-0">
      {/* Header with improved visual hierarchy */}
      <div className="bg-white shadow-sm px-5 pt-6 pb-5">
        <div className="flex items-center gap-4 mb-5">
          <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-500 rounded-3xl flex items-center justify-center shadow-lg">
            <img src="/BiomeDude.png" alt="" className="w-12 h-12" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">BiomeQuest</h1>
        </div>

        {/* Search with immediate feedback */}
        <div className="relative">
          <div className={`absolute inset-0 rounded-2xl transition-all ${
            searchQuery ? 'bg-green-100 scale-105' : 'bg-gray-100'
          }`} style={{ zIndex: 0 }} />
          
          <div className="relative z-10 flex items-center">
            <Search className={`absolute left-4 w-5 h-5 transition-colors ${
              searchQuery ? 'text-green-600' : 'text-gray-400'
            }`} />
            <input
              type="text"
              placeholder="Search for any plant..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-transparent border-0 focus:outline-none text-gray-900 placeholder-gray-500 font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 p-1 hover:bg-white rounded-full transition-all active:scale-90"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content with smooth transitions */}
      <div className="flex-1 overflow-y-auto px-5 py-5 pb-32">
        {!showSearchResults ? (
          <div className="space-y-6">
            {/* New Plants Section - Gamification principle */}
            {newFoods.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-yellow-500" />
                    <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                      Discover New ({newFoods.length})
                    </h2>
                  </div>
                  
                  {/* Score badge aligned with section */}
                  <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl px-3 py-1.5 shadow-lg">
                    <div className="flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span className="font-bold text-sm">{score}</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  {newFoods.slice(0, 6).map((food) => (
                    <FoodCard
                      key={food.id}
                      food={food}
                      isNew={true}
                      points={food.points}
                      onSelect={handleFoodSelect}
                      isRecentlyAdded={recentlyAdded === food.id}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Repeat Plants Section - Collapsible */}
            {repeatFoods.length > 0 && (
              <div>
                <button
                  onClick={() => setShowRepeatFoods(!showRepeatFoods)}
                  className="w-full flex items-center justify-between mb-4 p-3 rounded-xl bg-white border border-gray-200 hover:border-gray-300 transition-all active:scale-98"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center">
                      <Plus className="w-3 h-3 text-gray-600" />
                    </div>
                    <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                      Add Again ({repeatFoods.length})
                    </h2>
                  </div>
                  
                  {showRepeatFoods ? (
                    <ChevronUp className="w-5 h-5 text-gray-600" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-600" />
                  )}
                </button>
                
                {showRepeatFoods && (
                  <div className="grid grid-cols-2 gap-3 animate-fadeIn">
                    {repeatFoods.slice(0, 6).map((food) => (
                      <FoodCard
                        key={food.id}
                        food={food}
                        isNew={false}
                        points={food.repeatPoints}
                        onSelect={handleFoodSelect}
                        isRecentlyAdded={recentlyAdded === food.id}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          // Search Results with instant feedback
          <div className="space-y-2">
            <p className="text-xs text-gray-500 mb-3">
              {filteredFoods.length} {filteredFoods.length === 1 ? 'result' : 'results'} for "{searchQuery}"
            </p>
            
            {filteredFoods.length > 0 ? (
              filteredFoods.map((food) => {
                const isNew = !eatenFoods.has(food.id);
                const points = isNew ? food.points : food.repeatPoints;
                
                return (
                  <button
                    key={food.id}
                    onClick={() => handleFoodSelect(food)}
                    className="w-full bg-white rounded-2xl p-4 flex items-center gap-4 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all border-2 border-transparent hover:border-green-200"
                  >
                    <div className="w-14 h-14 bg-gradient-to-br from-green-50 to-green-100 rounded-xl flex items-center justify-center text-4xl flex-shrink-0">
                      {food.emoji || '🌱'}
                    </div>
                    
                    <div className="flex-1 text-left min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="font-semibold text-gray-900 truncate">
                          {food.name}
                        </p>
                        {isNew && (
                          <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-0.5 rounded-full">
                            NEW
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-green-600 font-semibold">
                        +{points} {points === 1 ? 'point' : 'points'}
                      </p>
                    </div>
                    
                    <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                      <Plus className="w-5 h-5 text-white" strokeWidth={3} />
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-gray-600 font-medium mb-1">
                  No plants found
                </p>
                <p className="text-sm text-gray-500">
                  Try a different search term
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Success toast - Immediate feedback principle */}
      {recentlyAdded && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-2xl shadow-2xl z-50 animate-bounce">
          <p className="font-bold text-sm">Plant added! 🎉</p>
        </div>
      )}
    </div>
  );
};

// Reusable Food Card Component - DRY principle
const FoodCard = ({ food, isNew, points, onSelect, isRecentlyAdded }) => {
  return (
    <button
      onClick={() => onSelect(food)}
      className={`
        relative bg-white rounded-2xl p-3 
        transition-all duration-200
        ${isRecentlyAdded 
          ? 'scale-110 shadow-2xl ring-4 ring-green-400' 
          : 'hover:shadow-lg hover:scale-105 active:scale-95'
        }
        ${isNew 
          ? 'border-2 border-green-200 shadow-md' 
          : 'border border-gray-200'
        }
      `}
    >
      {/* Visual indicator for new items */}
      {isNew && (
        <div className="absolute -top-1.5 -right-1.5 bg-gradient-to-br from-yellow-400 to-orange-400 text-white text-xs font-bold px-1.5 py-0.5 rounded-full shadow-lg flex items-center gap-1">
          <Sparkles className="w-2.5 h-2.5" />
          NEW
        </div>
      )}
      
      {/* Large emoji for recognition */}
      <div className="text-4xl mb-2 flex justify-center h-12 items-center">
        {food.emoji || '🌱'}
      </div>
      
      {/* Clear text hierarchy */}
      <div className="text-center mb-2">
        <h3 className="font-bold text-gray-900 text-xs mb-0.5 leading-tight">
          {food.name}
        </h3>
        <p className={`text-xs font-semibold ${
          isNew ? 'text-green-600' : 'text-gray-500'
        }`}>
          +{points} {points === 1 ? 'pt' : 'pts'}
          {isNew && ' 🌟'}
        </p>
      </div>
      
      {/* Action button - clear affordance */}
      <div className={`
        w-full py-2 rounded-xl flex items-center justify-center
        transition-all
        ${isNew 
          ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700' 
          : 'bg-gray-100 hover:bg-gray-200'
        }
      `}>
        <Plus className={`w-4 h-4 ${isNew ? 'text-white' : 'text-gray-600'}`} strokeWidth={3} />
      </div>
    </button>
  );
};

export default PickScreen;