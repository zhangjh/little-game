import React, { useState, useEffect } from 'react';
import Game from './components/Game';
import Achievements from './components/Achievements';
import { generateColors } from './utils/colorUtils';
import { getCurrentAchievements, achievements } from './utils/achievementUtils';

function App() {
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [unlockedAchievements, setUnlockedAchievements] = useState(getCurrentAchievements(0, 1));
  const [lastAchievement, setLastAchievement] = useState<string | null>(null);

  const getGridSize = (level: number) => {
    if (level <= 3) return 2;
    if (level <= 6) return 3;
    if (level <= 9) return 4;
    return 5;
  };

  const getDifficultyFactor = (level: number) => {
    return Math.max(50 - level * 3, 10);
  };

  useEffect(() => {
    const newAchievements = getCurrentAchievements(score, level);
    if (newAchievements.length > unlockedAchievements.length) {
      const latestAchievement = newAchievements[newAchievements.length - 1];
      setLastAchievement(latestAchievement.title);
      setTimeout(() => setLastAchievement(null), 3000);
    }
    setUnlockedAchievements(newAchievements);
  }, [score, level]);

  const handleCorrectClick = () => {
    setScore(score + level * 100);
    setLevel(level + 1);
  };

  const handleWrongClick = () => {
    setGameOver(true);
  };

  const restartGame = () => {
    setLevel(1);
    setScore(0);
    setGameOver(false);
  };

  const currentTitle = unlockedAchievements.length > 0
    ? unlockedAchievements[unlockedAchievements.length - 1].title
    : '新手';

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-8">火眼金睛</h1>
      
      <div className="mb-4 text-center">
        <p className="text-xl mb-2">Level: {level}</p>
        <p className="text-xl mb-2">Score: {score}</p>
        <p className="text-lg text-yellow-400">当前称号: {currentTitle}</p>
        <button
          onClick={() => setShowAchievements(true)}
          className="mt-2 px-4 py-1 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm"
        >
          查看成就
        </button>
      </div>

      {lastAchievement && (
        <div className="fixed top-4 right-4 bg-yellow-500 text-black px-4 py-2 rounded-lg animate-bounce">
          🏆 解锁成就：{lastAchievement}
        </div>
      )}

      {gameOver ? (
        <div className="text-center">
          <h2 className="text-2xl mb-4">Game Over!</h2>
          <p className="mb-4">Final Score: {score}</p>
          <button
            onClick={restartGame}
            className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded-lg"
          >
            Play Again
          </button>
        </div>
      ) : (
        <Game
          gridSize={getGridSize(level)}
          difficultyFactor={getDifficultyFactor(level)}
          onCorrectClick={handleCorrectClick}
          onWrongClick={handleWrongClick}
        />
      )}

      <Achievements
        unlockedAchievements={unlockedAchievements}
        isOpen={showAchievements}
        onClose={() => setShowAchievements(false)}
      />
    </div>
  );
}

export default App;