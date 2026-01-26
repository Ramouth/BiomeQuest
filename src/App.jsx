/**
 * App.jsx
 * Main application component using MVVM architecture
 *
 * Architecture:
 * - Models: src/models/api/* (data layer)
 * - ViewModels: src/viewmodels/* (business logic)
 * - Views: src/views/* (UI components)
 */

import React, { useState, useEffect, Component } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { ConfettiProvider } from './context/ConfettiContext';

// Views
import PickScreen from './views/PickScreen';
import CelebrationScreen from './views/CelebrationScreen';
import FirstPlantTip from './views/FirstPlantTip';
import ProgressPage from './views/ProgressPage';
import ProfilePage from './views/ProfilePage';
import AdminPage from './views/AdminPage';
import Navbar from './views/Navbar';
import OnboardingView from './views/OnboardingView';
import AuthScreen from './views/AuthScreen';
import WeeklySummaryModal from './views/WeeklySummaryModal';

// ViewModels
import { usePlantData } from './viewmodels/usePlantData';
import { useFood } from './viewmodels/useFood';

// API
import { logsAPI } from './models/api/logsApi';
import { authAPI } from './models/api/authApi';

/**
 * Error Boundary to catch rendering errors
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('React Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-red-100 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-md shadow-lg">
            <h1 className="text-xl font-bold text-red-600 mb-2">Something went wrong</h1>
            <p className="text-gray-600 mb-4">{this.state.error?.message || 'Unknown error'}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

/**
 * AppContent - Main application content with MVVM pattern
 */
const AppContent = () => {
  const { isAuthenticated, user, loading, isAdmin } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();

  // Check if user has completed onboarding before
  const hasCompletedOnboarding = localStorage.getItem('onboardingComplete') === 'true';

  // Animation state - persisted to localStorage
  const [animationsEnabled, setAnimationsEnabled] = useState(() => {
    const saved = localStorage.getItem('animationsEnabled');
    return saved !== null ? saved === 'true' : true; // Default to true
  });

  // Handle animation toggle
  const handleToggleAnimations = () => {
    const newValue = !animationsEnabled;
    setAnimationsEnabled(newValue);
    localStorage.setItem('animationsEnabled', String(newValue));
  };

  // View state (navigation)
  const [currentScreen, setCurrentScreen] = useState(hasCompletedOnboarding ? 'pick' : 'onboarding');
  const [activeTab, setActiveTab] = useState('home');

  // Track if we need to show first plant tip after celebration
  const [showFirstPlantTip, setShowFirstPlantTip] = useState(false);

  // Weekly summary modal state
  const [showWeeklySummary, setShowWeeklySummary] = useState(false);
  const [weeklySummaryData, setWeeklySummaryData] = useState(null);

  // ViewModel: Plant data management
  const {
    foods,
    eatenFoods,
    score,
    loading: plantsLoading,
    markFoodEaten,
    addPoints,
    setScore
  } = usePlantData(isAuthenticated);

  // ViewModel: Food selection and logging
  const {
    selectedFood,
    selectFood,
    clearSelectedFood,
    error: foodError,
    clearError: clearFoodError
  } = useFood({
    eatenFoods,
    markFoodEaten,
    addPoints,
    setScore
  });

  // Auto-dismiss food error after 4 seconds
  useEffect(() => {
    if (foodError) {
      const timer = setTimeout(() => {
        clearFoodError();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [foodError, clearFoodError]);

  // Check if we should show weekly summary popup (on first app open of a new week)
  useEffect(() => {
    if (!isAuthenticated || !hasCompletedOnboarding) return;

    const checkWeeklySummary = async () => {
      // Get current week number (ISO week)
      const now = new Date();
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      const days = Math.floor((now - startOfYear) / (24 * 60 * 60 * 1000));
      const currentWeek = `${now.getFullYear()}-W${Math.ceil((days + startOfYear.getDay() + 1) / 7)}`;

      const lastShownWeek = localStorage.getItem('lastWeeklySummaryShown');

      // Only show if we haven't shown for this week yet (show on Monday or first open of week)
      if (lastShownWeek !== currentWeek) {
        // Check if it's Monday or if we're past day 1 of the week and haven't seen summary
        const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday
        const isMondayOrLater = dayOfWeek >= 1 || dayOfWeek === 0; // Monday through Sunday

        if (isMondayOrLater) {
          try {
            const data = await logsAPI.getWeeklySummary();
            // Only show if there was activity last week OR if user has been using the app
            if (data.lastWeek.points > 0 || data.personalBests.points > 0) {
              setWeeklySummaryData(data);
              setShowWeeklySummary(true);
              localStorage.setItem('lastWeeklySummaryShown', currentWeek);
            }
          } catch (err) {
            console.error('Failed to fetch weekly summary:', err);
          }
        }
      }
    };

    // Small delay to let the app fully load
    const timer = setTimeout(checkWeeklySummary, 500);
    return () => clearTimeout(timer);
  }, [isAuthenticated, hasCompletedOnboarding]);

  /**
   * Handle setting weekly goal from the summary modal
   */
  const handleSetWeeklyGoal = async (goal) => {
    await authAPI.updateGoals(goal, null);
  };

  // User profile data from auth
  const userId = user?.id || 'GUEST';
  const userName = user?.username || 'Plant Lover';
  const avatarId = user?.avatarSeed || 'apple-man';

  /**
   * Handle onboarding completion
   */
  const handleOnboardingComplete = () => {
    localStorage.setItem('onboardingComplete', 'true');
    setCurrentScreen('pick');
    setActiveTab('home');
  };

  /**
   * Handle tab navigation
   */
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  /**
   * Handle food selection with celebration flow
   */
  const handleFoodSelect = async (food) => {
    // Check if this is the user's very first plant (before updating eatenFoods)
    const isVeryFirstPlant = eatenFoods.size === 0;
    const hasSeenTip = localStorage.getItem('hasSeenFirstPlantTip') === 'true';
    const shouldShowTip = isVeryFirstPlant && !hasSeenTip;

    const result = await selectFood(food);

    // If there was an error, don't show celebration - stay on pick screen
    // The error toast will be shown via foodError state
    if (result?.error) {
      return;
    }

    // Only show celebration screen if animations are enabled
    if (animationsEnabled) {
      setCurrentScreen('celebration');

      // Auto transition after 2 seconds
      setTimeout(() => {
        if (shouldShowTip) {
          setShowFirstPlantTip(true);
          setCurrentScreen('firstPlantTip');
        } else {
          setCurrentScreen('pick');
          clearSelectedFood();
        }
      }, 2000);
    } else {
      // Skip celebration when animations are off, but still show tip if first plant
      if (shouldShowTip) {
        setShowFirstPlantTip(true);
        setCurrentScreen('firstPlantTip');
      } else {
        clearSelectedFood();
      }
    }
  };

  /**
   * Handle first plant tip dismissal
   */
  const handleFirstPlantTipContinue = () => {
    localStorage.setItem('hasSeenFirstPlantTip', 'true');
    setShowFirstPlantTip(false);
    setCurrentScreen('pick');
    clearSelectedFood();
  };

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-400 to-green-600 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  // Show auth screen if not logged in
  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  return (
    <div className="font-sans antialiased h-screen overflow-hidden">
      {/* Onboarding Screen */}
      {currentScreen === 'onboarding' && (
        <OnboardingView
          onComplete={handleOnboardingComplete}
          onSkipToPick={handleOnboardingComplete}
        />
      )}

      {/* Error Toast - shown when plant logging fails */}
      {foodError && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-bounce">
          <div className="bg-red-500 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3">
            <span className="text-xl">⚠️</span>
            <div>
              <p className="font-bold text-sm">{foodError}</p>
            </div>
            <button
              onClick={clearFoodError}
              className="ml-2 hover:bg-red-600 rounded-full p-1 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Main App Screens */}
      {currentScreen === 'pick' && (
        <>
          {activeTab === 'home' && (
            <PickScreen
              score={score}
              onFoodSelect={handleFoodSelect}
              foods={foods}
              eatenFoods={eatenFoods}
              isLoading={plantsLoading}
            />
          )}

          {activeTab === 'progress' && (
            <ProgressPage score={score} />
          )}

          {activeTab === 'profile' && (
            <ProfilePage
              onBack={() => setActiveTab('home')}
              userName={userName}
              userId={userId}
              avatarId={avatarId}
              score={score}
              animationsEnabled={animationsEnabled}
              onToggleAnimations={handleToggleAnimations}
              isDarkMode={isDarkMode}
              onToggleDarkMode={toggleDarkMode}
              isAdmin={isAdmin}
              onOpenAdmin={() => setActiveTab('admin')}
            />
          )}

          {activeTab === 'admin' && isAdmin && (
            <AdminPage onBack={() => setActiveTab('profile')} />
          )}

          <Navbar activeTab={activeTab} onTabChange={handleTabChange} score={score} userId={userId} avatarId={avatarId} />
        </>
      )}

      {/* Celebration Screen */}
      {currentScreen === 'celebration' && selectedFood && (
        <CelebrationScreen message={selectedFood.displayMessage} animationsEnabled={animationsEnabled} isSuperfood={selectedFood.is_superfood} />
      )}

      {/* First Plant Tip Screen */}
      {currentScreen === 'firstPlantTip' && (
        <FirstPlantTip onContinue={handleFirstPlantTipContinue} animationsEnabled={animationsEnabled} />
      )}

      {/* Weekly Summary Modal */}
      {showWeeklySummary && weeklySummaryData && (
        <WeeklySummaryModal
          lastWeek={weeklySummaryData.lastWeek}
          personalBests={weeklySummaryData.personalBests}
          isNewPointsRecord={weeklySummaryData.isNewPointsRecord}
          isNewPlantsRecord={weeklySummaryData.isNewPlantsRecord}
          currentGoal={weeklySummaryData.currentGoal}
          onSetGoal={handleSetWeeklyGoal}
          onClose={() => setShowWeeklySummary(false)}
        />
      )}
    </div>
  );
};

/**
 * App - Root component with AuthProvider
 */
const App = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ThemeProvider>
          <ConfettiProvider>
            <AppContent />
          </ConfettiProvider>
        </ThemeProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
