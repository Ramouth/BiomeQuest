import React, { useState, useMemo } from 'react';
import { Search, Plus, X, Sparkles, TrendingUp, ChevronLeft, ChevronRight, Send } from 'lucide-react';
import { requestsAPI } from '../models/api/requestsApi';

const ITEMS_PER_PAGE = 6;

const PickScreen = ({ score, onFoodSelect, foods, eatenFoods }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [recentlyAdded, setRecentlyAdded] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Plant request state
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestEmoji, setRequestEmoji] = useState('');
  const [requestDescription, setRequestDescription] = useState('');
  const [requestLoading, setRequestLoading] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);
  const [requestError, setRequestError] = useState(null);

  const filteredFoods = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase().trim();
    const queryWords = query.split(/\s+/);

    // Score each food based on match quality
    const scored = foods.map(food => {
      const name = food.name.toLowerCase();
      const nameWords = name.split(/\s+/);
      let score = 0;

      // Exact match - highest priority
      if (name === query) {
        score += 100;
      }
      // Name starts with query
      else if (name.startsWith(query)) {
        score += 80;
      }
      // Any word starts with query
      else if (nameWords.some(word => word.startsWith(query))) {
        score += 60;
      }
      // All query words match (for multi-word searches like "bell pepper")
      else if (queryWords.every(qWord => name.includes(qWord))) {
        score += 50;
      }
      // Query is contained anywhere in name
      else if (name.includes(query)) {
        score += 30;
      }
      // Partial word matching - each query word that starts a name word
      else {
        queryWords.forEach(qWord => {
          if (nameWords.some(nWord => nWord.startsWith(qWord))) {
            score += 20;
          }
        });
      }

      // Bonus for shorter names (more specific matches)
      if (score > 0) {
        score += Math.max(0, 10 - name.length / 3);
      }

      return { food, score };
    });

    // Filter to matches and sort by score (highest first)
    return scored
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(item => item.food);
  }, [searchQuery, foods]);

  // Pagination logic
  const totalPages = Math.ceil(foods.length / ITEMS_PER_PAGE);
  const paginatedFoods = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return foods.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [foods, currentPage]);

  const handleFoodSelect = (food) => {
    onFoodSelect(food);
    setRecentlyAdded(food.id);
    setTimeout(() => setRecentlyAdded(null), 1500);
    setSearchQuery('');
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleRequestPlant = async () => {
    if (!searchQuery.trim()) return;

    setRequestLoading(true);
    setRequestError(null);

    try {
      await requestsAPI.submit(searchQuery.trim(), requestEmoji || null, requestDescription || null);
      setRequestSuccess(true);
      setShowRequestModal(false);
      setRequestEmoji('');
      setRequestDescription('');

      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setRequestSuccess(false);
        setSearchQuery('');
      }, 3000);
    } catch (err) {
      setRequestError(err.userMessage || 'Failed to submit request');
    } finally {
      setRequestLoading(false);
    }
  };

  const openRequestModal = () => {
    setShowRequestModal(true);
    setRequestError(null);
  };

  const closeRequestModal = () => {
    setShowRequestModal(false);
    setRequestEmoji('');
    setRequestDescription('');
    setRequestError(null);
  };

  const showSearchResults = searchQuery.trim().length > 0;

  return (
    <div className="h-screen w-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800 flex flex-col fixed inset-0">
      {/* Header with improved visual hierarchy */}
      <div className="bg-white dark:bg-gray-800 shadow-sm px-5 pt-6 pb-5">
        <div className="flex items-center gap-4 mb-5">
          <div className="relative w-16 h-16 rounded-3xl flex items-center justify-center shadow-lg overflow-hidden animate-breathe">
            {/* Living gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-400 via-emerald-400 to-teal-500" />

            {/* Organic flowing blobs */}
            <div className="absolute w-12 h-12 bg-white/25 rounded-full blur-sm animate-blob-1" style={{ top: '-10%', left: '-10%' }} />
            <div className="absolute w-10 h-10 bg-teal-300/30 rounded-full blur-sm animate-blob-2" style={{ bottom: '-5%', right: '-5%' }} />
            <div className="absolute w-8 h-8 bg-emerald-200/25 rounded-full blur-sm animate-blob-3" style={{ top: '50%', left: '60%' }} />

            {/* Soft inner glow that breathes */}
            <div className="absolute inset-1 bg-gradient-to-br from-white/30 via-transparent to-emerald-300/20 rounded-2xl animate-glow-breathe" />

            {/* Organic floating spores */}
            <div className="absolute w-1.5 h-1.5 bg-white/80 rounded-full animate-spore-1" style={{ top: '20%', right: '15%' }} />
            <div className="absolute w-1 h-1 bg-white/60 rounded-full animate-spore-2" style={{ bottom: '25%', left: '18%' }} />
            <div className="absolute w-1 h-1 bg-yellow-100/70 rounded-full animate-spore-3" style={{ top: '60%', right: '25%' }} />
            <div className="absolute w-0.5 h-0.5 bg-white/50 rounded-full animate-spore-4" style={{ top: '35%', left: '25%' }} />

            {/* BiomeDude with subtle float */}
            <img src="/BiomeDude.png" alt="" className="w-12 h-12 relative z-10 drop-shadow-lg animate-gentle-float" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">BiomeQuest</h1>
        </div>

        {/* Search with immediate feedback */}
        <div className="relative">
          <div className={`absolute inset-0 rounded-2xl transition-all ${
            searchQuery ? 'bg-green-100 dark:bg-green-900/30 scale-105' : 'bg-gray-100 dark:bg-gray-700'
          }`} style={{ zIndex: 0 }} />

          <div className="relative z-10 flex items-center">
            <Search className={`absolute left-4 w-5 h-5 transition-colors ${
              searchQuery ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-500'
            }`} />
            <input
              type="text"
              placeholder="Search for any plant..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-transparent border-0 focus:outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 p-1 hover:bg-white dark:hover:bg-gray-600 rounded-full transition-all active:scale-90"
              >
                <X className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content with smooth transitions */}
      <div className="flex-1 overflow-y-auto px-5 py-5 pb-32">
        {!showSearchResults ? (
          <div className="space-y-6">
            {/* All Plants Section */}
            {foods.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-yellow-500" />
                    <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wide">
                      Plants ({foods.length})
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
                  {paginatedFoods.map((food) => {
                    const isNew = !eatenFoods.has(food.id);
                    return (
                      <FoodCard
                        key={food.id}
                        food={food}
                        isNew={isNew}
                        points={isNew ? food.points : food.repeatPoints}
                        onSelect={handleFoodSelect}
                        isRecentlyAdded={recentlyAdded === food.id}
                      />
                    );
                  })}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-6">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`p-2 rounded-xl transition-all ${
                        currentPage === 1
                          ? 'bg-gray-100 dark:bg-gray-700 text-gray-300 dark:text-gray-600 cursor-not-allowed'
                          : 'bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-gray-300 active:scale-95'
                      }`}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`w-10 h-10 rounded-xl font-semibold text-sm transition-all ${
                            currentPage === page
                              ? 'bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg'
                              : 'bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-gray-300 active:scale-95'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`p-2 rounded-xl transition-all ${
                        currentPage === totalPages
                          ? 'bg-gray-100 dark:bg-gray-700 text-gray-300 dark:text-gray-600 cursor-not-allowed'
                          : 'bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-gray-300 active:scale-95'
                      }`}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          // Search Results with instant feedback
          <div className="space-y-2">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
              {filteredFoods.length} {filteredFoods.length === 1 ? 'result' : 'results'} for "{searchQuery}"
            </p>
            
            {filteredFoods.length > 0 ? (
              filteredFoods.map((food) => {
                const isNew = !eatenFoods.has(food.id);
                const points = isNew ? food.points : food.repeatPoints;
                const isSuperfood = food.is_superfood;

                return (
                  <button
                    key={food.id}
                    onClick={() => handleFoodSelect(food)}
                    className={`w-full rounded-2xl p-4 flex items-center gap-4 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all border-2 ${
                      isSuperfood
                        ? 'bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-300 dark:border-purple-600 hover:border-purple-400'
                        : 'bg-white dark:bg-gray-800 border-transparent hover:border-green-200 dark:hover:border-green-700'
                    }`}
                  >
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-4xl flex-shrink-0 ${
                      isSuperfood
                        ? 'bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 animate-pulse'
                        : 'bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30'
                    }`}>
                      {food.emoji || '🌱'}
                    </div>

                    <div className="flex-1 text-left min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className={`font-semibold truncate ${
                          isSuperfood ? 'text-purple-700 dark:text-purple-300' : 'text-gray-900 dark:text-white'
                        }`}>
                          {food.name}
                        </p>
                        {isSuperfood && (
                          <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <span>⚡</span> SUPER
                          </span>
                        )}
                        {isNew && !isSuperfood && (
                          <span className="bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-400 text-xs font-bold px-2 py-0.5 rounded-full">
                            NEW
                          </span>
                        )}
                      </div>
                      <p className={`text-sm font-semibold ${
                        isSuperfood ? 'text-purple-600 dark:text-purple-400' : 'text-green-600 dark:text-green-400'
                      }`}>
                        +{points} {points === 1 ? 'point' : 'points'}
                      </p>
                    </div>

                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md ${
                      isSuperfood
                        ? 'bg-gradient-to-br from-purple-500 to-pink-500'
                        : 'bg-green-500'
                    }`}>
                      <Plus className="w-5 h-5 text-white" strokeWidth={3} />
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-gray-600 dark:text-gray-300 font-medium mb-1">
                  No plants found for "{searchQuery}"
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                  Can't find what you're looking for?
                </p>
                <button
                  onClick={openRequestModal}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-6 rounded-2xl shadow-lg transition-all hover:scale-105 active:scale-95"
                >
                  <Send size={18} />
                  Request "{searchQuery}"
                </button>
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

      {/* Request success toast */}
      {requestSuccess && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-2xl shadow-2xl z-50 animate-bounce">
          <p className="font-bold text-sm">Request sent to admin! 🌱</p>
        </div>
      )}

      {/* Plant Request Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">Request Plant</h3>
              <button
                onClick={closeRequestModal}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Plant name (from search query) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Plant Name
                </label>
                <div className="bg-gray-100 dark:bg-gray-700 rounded-xl px-4 py-3 text-gray-800 dark:text-white font-medium">
                  {searchQuery}
                </div>
              </div>

              {/* Suggested emoji */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Suggested Emoji (optional)
                </label>
                <input
                  type="text"
                  value={requestEmoji}
                  onChange={(e) => setRequestEmoji(e.target.value)}
                  placeholder="🥬"
                  maxLength={4}
                  className="w-full bg-gray-100 dark:bg-gray-700 rounded-xl px-4 py-3 text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description (optional)
                </label>
                <textarea
                  value={requestDescription}
                  onChange={(e) => setRequestDescription(e.target.value)}
                  placeholder="Why should we add this plant?"
                  rows={3}
                  className="w-full bg-gray-100 dark:bg-gray-700 rounded-xl px-4 py-3 text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                />
              </div>

              {/* Error message */}
              {requestError && (
                <div className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm px-4 py-3 rounded-xl">
                  {requestError}
                </div>
              )}

              {/* Submit button */}
              <button
                onClick={handleRequestPlant}
                disabled={requestLoading}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-green-300 disabled:to-green-400 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                {requestLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Send Request
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Organic living animations for logo */}
      <style>{`
        /* Container breathing - like a living cell */
        @keyframes breathe {
          0%, 100% { transform: scale(1); }
          30% { transform: scale(1.02); }
          60% { transform: scale(0.99); }
        }

        /* Organic blob movements - amoeba-like */
        @keyframes blob-1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(8px, 4px) scale(1.1); }
          50% { transform: translate(4px, 10px) scale(0.95); }
          75% { transform: translate(-2px, 6px) scale(1.05); }
        }

        @keyframes blob-2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-6px, -8px) scale(1.15); }
          66% { transform: translate(-10px, 2px) scale(0.9); }
        }

        @keyframes blob-3 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.25; }
          20% { transform: translate(-8px, -4px) scale(1.2); opacity: 0.35; }
          50% { transform: translate(-4px, 8px) scale(0.85); opacity: 0.2; }
          80% { transform: translate(6px, 2px) scale(1.1); opacity: 0.3; }
        }

        /* Inner glow breathing */
        @keyframes glow-breathe {
          0%, 100% { opacity: 0.8; }
          40% { opacity: 0.5; }
          70% { opacity: 0.9; }
        }

        /* Spore-like floating particles - wandering paths */
        @keyframes spore-1 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.8; }
          20% { transform: translate(-3px, -5px) scale(1.1); opacity: 0.6; }
          40% { transform: translate(2px, -8px) scale(0.9); opacity: 0.9; }
          60% { transform: translate(5px, -4px) scale(1.2); opacity: 0.5; }
          80% { transform: translate(1px, -1px) scale(1); opacity: 0.7; }
        }

        @keyframes spore-2 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.6; }
          15% { transform: translate(4px, 3px) scale(1.3); opacity: 0.8; }
          35% { transform: translate(7px, -2px) scale(0.8); opacity: 0.5; }
          55% { transform: translate(3px, -6px) scale(1.1); opacity: 0.9; }
          75% { transform: translate(-2px, -3px) scale(1); opacity: 0.6; }
        }

        @keyframes spore-3 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.7; }
          25% { transform: translate(-4px, 4px) scale(0.9); opacity: 0.5; }
          50% { transform: translate(-6px, -2px) scale(1.2); opacity: 0.8; }
          75% { transform: translate(-2px, 6px) scale(1); opacity: 0.6; }
        }

        @keyframes spore-4 {
          0%, 100% { transform: translate(0, 0); opacity: 0.5; }
          30% { transform: translate(5px, -4px); opacity: 0.8; }
          60% { transform: translate(2px, 5px); opacity: 0.4; }
        }

        /* Gentle BiomeDude float */
        @keyframes gentle-float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          30% { transform: translateY(-2px) rotate(0.5deg); }
          70% { transform: translateY(1px) rotate(-0.5deg); }
        }

        .animate-breathe {
          animation: breathe 4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }

        .animate-blob-1 {
          animation: blob-1 7s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }

        .animate-blob-2 {
          animation: blob-2 9s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }

        .animate-blob-3 {
          animation: blob-3 11s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }

        .animate-glow-breathe {
          animation: glow-breathe 5s ease-in-out infinite;
        }

        .animate-spore-1 {
          animation: spore-1 6s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }

        .animate-spore-2 {
          animation: spore-2 8s cubic-bezier(0.4, 0, 0.2, 1) infinite 0.5s;
        }

        .animate-spore-3 {
          animation: spore-3 7s cubic-bezier(0.4, 0, 0.2, 1) infinite 1s;
        }

        .animate-spore-4 {
          animation: spore-4 5s cubic-bezier(0.4, 0, 0.2, 1) infinite 1.5s;
        }

        .animate-gentle-float {
          animation: gentle-float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

// Reusable Food Card Component - DRY principle
const FoodCard = ({ food, isNew, points, onSelect, isRecentlyAdded }) => {
  const isSuperfood = food.is_superfood;

  return (
    <button
      onClick={() => onSelect(food)}
      className={`
        relative rounded-2xl p-3
        transition-all duration-200
        ${isSuperfood
          ? 'bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30'
          : 'bg-white dark:bg-gray-800'
        }
        ${isRecentlyAdded
          ? isSuperfood
            ? 'scale-110 shadow-2xl ring-4 ring-purple-400 animate-pulse'
            : 'scale-110 shadow-2xl ring-4 ring-green-400'
          : 'hover:shadow-lg hover:scale-105 active:scale-95'
        }
        ${isSuperfood
          ? 'border-2 border-purple-300 dark:border-purple-600 shadow-lg shadow-purple-200/50 dark:shadow-purple-900/50'
          : isNew
            ? 'border-2 border-green-200 dark:border-green-700 shadow-md'
            : 'border border-gray-200 dark:border-gray-700'
        }
      `}
    >
      {/* Superfood badge */}
      {isSuperfood && (
        <div className="absolute -top-2 -left-2 bg-gradient-to-br from-purple-500 to-pink-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-lg flex items-center gap-1 animate-pulse">
          <span>⚡</span>
          SUPER
        </div>
      )}

      {/* Visual indicator for new items */}
      {isNew && !isSuperfood && (
        <div className="absolute -top-1.5 -right-1.5 bg-gradient-to-br from-yellow-400 to-orange-400 text-white text-xs font-bold px-1.5 py-0.5 rounded-full shadow-lg flex items-center gap-1">
          <Sparkles className="w-2.5 h-2.5" />
          NEW
        </div>
      )}

      {/* Large emoji for recognition */}
      <div className={`text-4xl mb-2 flex justify-center h-12 items-center ${isSuperfood ? 'animate-bounce' : ''}`}>
        {food.emoji || '🌱'}
      </div>

      {/* Clear text hierarchy */}
      <div className="text-center mb-2">
        <h3 className={`font-bold text-xs mb-0.5 leading-tight ${
          isSuperfood ? 'text-purple-700 dark:text-purple-300' : 'text-gray-900 dark:text-white'
        }`}>
          {food.name}
        </h3>
        <p className={`text-xs font-semibold ${
          isSuperfood
            ? 'text-purple-600 dark:text-purple-400'
            : isNew
              ? 'text-green-600 dark:text-green-400'
              : 'text-gray-500 dark:text-gray-400'
        }`}>
          +{points} {points === 1 ? 'pt' : 'pts'}
          {isNew && ' 🌟'}
        </p>
      </div>

      {/* Action button - clear affordance */}
      <div className={`
        w-full py-2 rounded-xl flex items-center justify-center gap-1
        transition-all
        ${isSuperfood
          ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
          : isNew
            ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
            : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
        }
      `}>
        <Plus className={`w-4 h-4 ${isSuperfood || isNew ? 'text-white' : 'text-gray-600 dark:text-gray-300'}`} strokeWidth={3} />
        {!isNew && !isSuperfood && <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">Add Again</span>}
        {isSuperfood && <span className="text-xs font-semibold text-white">+{points} pts</span>}
      </div>
    </button>
  );
};

export default PickScreen;