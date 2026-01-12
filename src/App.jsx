import React, { useState, useEffect } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import LoginScreen from './components/LoginScreen';
import RegisterScreen from './components/RegisterScreen';
import PickScreen from './components/PickScreen';
import CelebrationScreen from './components/CelebrationScreen';
import ProgressPage from './components/ProgressPage';
import Navbar from './components/Navbar';
import { authService } from './services/api';

const App = () => {
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [activeTab, setActiveTab] = useState('home');
  const [score, setScore] = useState(0);
  const [selectedFood, setSelectedFood] = useState(null);
  const [eatenFoods, setEatenFoods] = useState(new Set());
  const [foodRegistrations, setFoodRegistrations] = useState([]);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Food database
  const foods = [
    { 
      id: 'banana', 
      name: 'Banana', 
      points: 5,
      repeatPoints: 1,
      firstTimeMessage: 'Congrats! You just helped your biome with a new plant! 🎉',
      repeatMessage: 'Plants are good, but diversity is KING! 👑'
    },
    { 
      id: 'apple', 
      name: 'Apple', 
      points: 5,
      repeatPoints: 1,
      firstTimeMessage: 'Congrats! You just helped your biome with a new plant! 🎉',
      repeatMessage: 'Plants are good, but diversity is KING! 👑'
    },
     { 
      id: 'mango', 
      name: 'Mango', 
      points: 5,
      repeatPoints: 1,
      firstTimeMessage: 'Congrats! You just helped your biome with a new plant! 🎉',
      repeatMessage: 'Plants are good, but diversity is KING! 👑'
    }
  ];

  // Check if user is already logged in on mount
  useEffect(() => {
    if (authService.isAuthenticated()) {
      setIsAuthenticated(true);
      setCurrentScreen('pick');
    }
  }, []);

  const handleStart = () => {
    setCurrentScreen('login');
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    setCurrentScreen('pick');
    setActiveTab('home');
  };

  const handleRegisterSuccess = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    setCurrentScreen('pick');
    setActiveTab('home');
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    setCurrentScreen('welcome');
    setScore(0);
    setEatenFoods(new Set());
    setFoodRegistrations([]);
  };

  const handleSwitchToRegister = () => {
    setCurrentScreen('register');
  };

  const handleSwitchToLogin = () => {
    setCurrentScreen('login');
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

  return (
    <div className="font-sans antialiased">
      {currentScreen === 'welcome' && (
        <WelcomeScreen onStart={handleStart} />
      )}

      {currentScreen === 'login' && (
        <LoginScreen 
          onLoginSuccess={handleLoginSuccess}
          onSwitchToRegister={handleSwitchToRegister}
        />
      )}

      {currentScreen === 'register' && (
        <RegisterScreen 
          onRegisterSuccess={handleRegisterSuccess}
          onSwitchToLogin={handleSwitchToLogin}
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
            <ProgressPage 
              score={score}
              eatenFoods={eatenFoods}
              foodRegistrations={foodRegistrations}
              foods={foods}
              user={user}
              onLogout={handleLogout}
            />
          )}
          
          <Navbar activeTab={activeTab} onTabChange={handleTabChange} score={score} user={user} onLogout={handleLogout} />
        </>
      )}
      
      {currentScreen === 'celebration' && selectedFood && (
        <CelebrationScreen message={selectedFood.displayMessage} />
      )}
    </div>
  );
};

export default App;