import React, { useState } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import PickScreen from './components/PickScreen';
import CelebrationScreen from './components/CelebrationScreen';

const App = () => {
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [score, setScore] = useState(0);
  const [selectedFood, setSelectedFood] = useState(null);
  const [eatenFoods, setEatenFoods] = useState(new Set()); // Track which foods have been eaten

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
    }
  ];

  const handleStart = () => {
    setCurrentScreen('pick');
  };

  const handleFoodSelect = (food) => {
    // Check if this food has been eaten before
    const isFirstTime = !eatenFoods.has(food.id);
    
    // Award points based on whether it's first time or repeat
    const pointsToAdd = isFirstTime ? food.points : food.repeatPoints;
    setScore(prevScore => prevScore + pointsToAdd);
    
    // Add food to eaten foods set
    setEatenFoods(prevEaten => new Set([...prevEaten, food.id]));
    
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
      
      {currentScreen === 'pick' && (
        <PickScreen 
          score={score} 
          onFoodSelect={handleFoodSelect}
          foods={foods}
          eatenFoods={eatenFoods} // Pass this to show which foods are "new"
        />
      )}
      
      {currentScreen === 'celebration' && selectedFood && (
        <CelebrationScreen message={selectedFood.displayMessage} />
      )}
    </div>
  );
};

export default App;