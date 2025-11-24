import React, { useState } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import PickScreen from './components/PickScreen';
import CelebrationScreen from './components/CelebrationScreen';

const App = () => {
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [score, setScore] = useState(0);
  const [selectedFood, setSelectedFood] = useState(null);

  // Food database
  const foods = [
    { 
      id: 'banana', 
      name: 'Banana', 
      points: 5,
      celebration: 'Yay banana!!'
    },
    { 
      id: 'apple', 
      name: 'Apple', 
      points: 5,
      celebration: 'Yay apple!!'
    }
  ];

  const handleStart = () => {
    setCurrentScreen('pick');
  };

  const handleFoodSelect = (food) => {
    setSelectedFood(food);
    setScore(prevScore => prevScore + food.points);
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
      
      {currentScreen === 'pick' && (
        <PickScreen 
          score={score} 
          onFoodSelect={handleFoodSelect}
          foods={foods}
        />
      )}
      
      {currentScreen === 'celebration' && selectedFood && (
        <CelebrationScreen message={selectedFood.celebration} />
      )}
    </div>
  );
};

export default App;