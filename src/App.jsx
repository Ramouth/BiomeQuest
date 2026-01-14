/**
 * App.jsx
 * Main application component using MVVM architecture
 *
 * Architecture:
 * - Models: src/models/api/* (data layer)
 * - ViewModels: src/viewmodels/* (business logic)
 * - Views: src/views/* (UI components)
 */

import React, { useState, Component } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';

// Views
import PickScreen from './views/PickScreen';
import CelebrationScreen from './views/CelebrationScreen';
import ProgressPage from './views/ProgressPage';
import ProfilePage from './views/ProfilePage';
import Navbar from './views/Navbar';
import OnboardingView from './views/OnboardingView';
import AuthScreen from './views/AuthScreen';

// ViewModels
import { usePlantData } from './viewmodels/usePlantData';
import { useFood } from './viewmodels/useFood';

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
  const { isAuthenticated, user, loading } = useAuth();

  // Check if user has completed onboarding before
  const hasCompletedOnboarding = localStorage.getItem('onboardingComplete') === 'true';

  // View state (navigation)
  const [currentScreen, setCurrentScreen] = useState(hasCompletedOnboarding ? 'pick' : 'onboarding');
  const [activeTab, setActiveTab] = useState('home');

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
    clearSelectedFood
  } = useFood({
    eatenFoods,
    markFoodEaten,
    addPoints,
    setScore
  });

  // User profile data from auth
  const userId = user?.id || 'GUEST';
  const userName = user?.username || 'Plant Lover';

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
    await selectFood(food);
    setCurrentScreen('celebration');

    // Auto return to pick screen after 2 seconds
    setTimeout(() => {
      setCurrentScreen('pick');
      clearSelectedFood();
    }, 2000);
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

      {/* Main App Screens */}
      {currentScreen === 'pick' && (
        <>
          {activeTab === 'home' && (
            <PickScreen
              score={score}
              onFoodSelect={handleFoodSelect}
              foods={foods}
              eatenFoods={eatenFoods}
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
              score={score}
            />
          )}

          <Navbar activeTab={activeTab} onTabChange={handleTabChange} score={score} userId={userId} />
        </>
      )}

      {/* Celebration Screen */}
      {currentScreen === 'celebration' && selectedFood && (
        <CelebrationScreen message={selectedFood.displayMessage} />
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
        <AppContent />
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
