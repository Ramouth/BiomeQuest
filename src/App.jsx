import React, { useState } from 'react';
import { AuthProvider, useAuth } from './AuthContext';
import WelcomeScreen from './components/WelcomeScreen';
import PickScreen from './components/PickScreen';
import CelebrationScreen from './components/CelebrationScreen';
import ProgressPage from './components/ProgressPage';
import ProfilePage from './components/ProfilePage';
import Navbar from './components/Navbar';
import OnboardingView from './components/OnboardingView';
import AuthScreen from './components/AuthScreen';

const AppContent = () => {
  const { isAuthenticated, user, loading } = useAuth();

  const [currentScreen, setCurrentScreen] = useState('onboarding');
  const [activeTab, setActiveTab] = useState('home');
  const [score, setScore] = useState(0);
  const [selectedFood, setSelectedFood] = useState(null);
  const [eatenFoods, setEatenFoods] = useState(new Set()); // Track which foods have been eaten
  const [foodRegistrations, setFoodRegistrations] = useState([]); // Track each registration with points

  // User profile data from auth
  const userId = user?.id || 'GUEST';
  const userName = user?.username || 'Plant Lover';

  // Food database
  const foods = [
    { 
      id: 'banana', 
      name: 'Banana', 
      points: 5, // First time points
      repeatPoints: 1, // Repeat points
      firstTimeMessage: 'Congrats! You just helped your biome with a new plant! 🎉',
      repeatMessage: 'Plants are good, but diversity is KING! 👑'
    },
    { 
      id: 'apple', 
      name: 'Apple', 
      points: 5, // First time points
      repeatPoints: 1, // Repeat points
      firstTimeMessage: 'Congrats! You just helped your biome with a new plant! 🎉',
      repeatMessage: 'Plants are good, but diversity is KING! 👑'
    },
    { 
      id: 'mango', 
      name: 'Mango', 
      points: 5, // First time points
      repeatPoints: 1, // Repeat points
      firstTimeMessage: 'Congrats! You just helped your biome with a new plant! 🎉',
      repeatMessage: 'Plants are good, but diversity is KING! 👑'
    },
    { 
      id: 'orange', 
      name: 'Orange', 
      points: 5, 
      repeatPoints: 1, 
      firstTimeMessage: 'Congrats! You just helped your biome with a new plant! 🎉',
      repeatMessage: 'Plants are good, but diversity is KING! 👑'
    },
    { 
      id: 'strawberry', 
      name: 'Strawberry', 
      points: 5, 
      repeatPoints: 1, 
      firstTimeMessage: 'Congrats! You just helped your biome with a new plant! 🎉',
      repeatMessage: 'Plants are good, but diversity is KING! 👑'
    },
    { 
      id: 'blueberry', 
      name: 'Blueberry', 
      points: 5, 
      repeatPoints: 1, 
      firstTimeMessage: 'Congrats! You just helped your biome with a new plant! 🎉',
      repeatMessage: 'Plants are good, but diversity is KING! 👑'
    },
    { 
      id: 'watermelon', 
      name: 'Watermelon', 
      points: 5, 
      repeatPoints: 1, 
      firstTimeMessage: 'Congrats! You just helped your biome with a new plant! 🎉',
      repeatMessage: 'Plants are good, but diversity is KING! 👑'
    },
    { 
      id: 'grape', 
      name: 'Grape', 
      points: 5, 
      repeatPoints: 1, 
      firstTimeMessage: 'Congrats! You just helped your biome with a new plant! 🎉',
      repeatMessage: 'Plants are good, but diversity is KING! 👑'
    },
    { 
      id: 'pineapple', 
      name: 'Pineapple', 
      points: 5, 
      repeatPoints: 1, 
      firstTimeMessage: 'Congrats! You just helped your biome with a new plant! 🎉',
      repeatMessage: 'Plants are good, but diversity is KING! 👑'
    },
    { 
      id: 'papaya', 
      name: 'Papaya', 
      points: 5, 
      repeatPoints: 1, 
      firstTimeMessage: 'Congrats! You just helped your biome with a new plant! 🎉',
      repeatMessage: 'Plants are good, but diversity is KING! 👑'
    }
  ];

  const handleStart = () => {
    setCurrentScreen('pick');
    setActiveTab('home');
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleFoodSelect = (food) => {
    // Check if this food has been eaten before
    const isFirstTime = !eatenFoods.has(food.id);
    
    // Award points based on whether it's first time or repeat
    const pointsToAdd = isFirstTime ? food.points : food.repeatPoints;
    setScore(prevScore => prevScore + pointsToAdd);
    
    // Add food to eaten foods set
    setEatenFoods(prevEaten => new Set([...prevEaten, food.id]));
    
    // Track registration with timestamp and points
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
          onComplete={() => setCurrentScreen('welcome')}
          onSkipToPick={() => {
            setCurrentScreen('welcome');
          }}
        />
      )}

      {currentScreen === 'welcome' && (
        <WelcomeScreen onStart={handleStart} />
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
            <ProgressPage
              score={score}
              eatenFoods={eatenFoods}
              foodRegistrations={foodRegistrations}
              foods={foods}
            />
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