import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './AuthContext';
import PickScreen from './components/PickScreen';
import CelebrationScreen from './components/CelebrationScreen';
import ProgressPage from './components/ProgressPage';
import ProfilePage from './components/ProfilePage';
import Navbar from './components/Navbar';
import OnboardingView from './components/OnboardingView';
import AuthScreen from './components/AuthScreen';
import { logsAPI, plantsAPI } from './api';

const AppContent = () => {
  const { isAuthenticated, user, loading } = useAuth();

  // Check if user has completed onboarding before
  const hasCompletedOnboarding = localStorage.getItem('onboardingComplete') === 'true';
  const [currentScreen, setCurrentScreen] = useState(hasCompletedOnboarding ? 'pick' : 'onboarding');
  const [activeTab, setActiveTab] = useState('home');
  const [score, setScore] = useState(0);
  const [selectedFood, setSelectedFood] = useState(null);
  const [eatenFoods, setEatenFoods] = useState(new Set()); // Track which foods have been eaten
  const [foodRegistrations, setFoodRegistrations] = useState([]); // Track each registration with points
  const [foods, setFoods] = useState([]); // Plants from database

  // User profile data from auth
  const userId = user?.id || 'GUEST';
  const userName = user?.username || 'Plant Lover';

  // Fetch plants from database on mount
  useEffect(() => {
    if (isAuthenticated) {
      plantsAPI.getWithStatus()
        .then(data => {
          const plantsWithMessages = data.plants.map(plant => ({
            id: plant.id,
            name: plant.name,
            emoji: plant.emoji,
            points: plant.points || 5,
            repeatPoints: plant.repeat_points || 1,
            firstTimeMessage: plant.first_time_message || 'Congrats! You just helped your biome with a new plant! 🎉',
            repeatMessage: plant.repeat_message || 'Plants are good, but diversity is KING! 👑',
            hasEaten: plant.has_eaten,
            timesEaten: plant.times_eaten || 0
          }));
          setFoods(plantsWithMessages);

          // Set eaten foods from database
          const eaten = new Set(plantsWithMessages.filter(p => p.hasEaten).map(p => p.id));
          setEatenFoods(eaten);

          // Set score from database
          if (data.totalPoints) {
            setScore(data.totalPoints);
          }
        })
        .catch(err => console.error('Failed to fetch plants:', err));
    }
  }, [isAuthenticated]);

  const handleOnboardingComplete = () => {
    localStorage.setItem('onboardingComplete', 'true');
    setCurrentScreen('pick');
    setActiveTab('home');
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleFoodSelect = async (food) => {
    // Check if this food has been eaten before (local state for immediate UI feedback)
    const isFirstTime = !eatenFoods.has(food.id);

    // Optimistically update local state for immediate UI feedback
    const pointsToAdd = isFirstTime ? food.points : food.repeatPoints;
    setScore(prevScore => prevScore + pointsToAdd);
    setEatenFoods(prevEaten => new Set([...prevEaten, food.id]));
    setFoodRegistrations(prev => [...prev, {
      foodId: food.id,
      foodName: food.name,
      points: pointsToAdd,
      isFirstTime: isFirstTime,
      timestamp: new Date()
    }]);

    // Set the food with appropriate message
    setSelectedFood({
      ...food,
      displayMessage: isFirstTime ? food.firstTimeMessage : food.repeatMessage,
      isFirstTime: isFirstTime
    });

    // Show celebration screen
    setCurrentScreen('celebration');

    // Persist to database
    try {
      const response = await logsAPI.logPlant(food.id);
      // Update score with actual total from database
      if (response.totalPoints !== undefined) {
        setScore(response.totalPoints);
      }
    } catch (err) {
      console.error('Failed to log plant:', err);
    }

    // Auto return to pick screen after 2 seconds
    setTimeout(() => {
      setCurrentScreen('pick');
      setSelectedFood(null);
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
    <div className="font-sans antialiased">
      {currentScreen === 'onboarding' && (
        <OnboardingView
          onComplete={handleOnboardingComplete}
          onSkipToPick={handleOnboardingComplete}
        />
      )}

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
              foodRegistrations={foodRegistrations}
              foods={foods}
              score={score}
            />
          )}

          <Navbar activeTab={activeTab} onTabChange={handleTabChange} score={score} userId={userId} />
        </>
      )}

      {currentScreen === 'celebration' && selectedFood && (
        <CelebrationScreen message={selectedFood.displayMessage} />
      )}
    </div>
  );
};

// Wrap with AuthProvider
const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;