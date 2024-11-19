'use client';

import Game from '@/components/Game';
import Achievements from '@/components/Achievements';
import { generateColors } from '@/utils/colorUtils';
import { getCurrentAchievements, achievements } from '@/utils/achievementUtils';
import { useState, useEffect } from 'react';

export default function Home() {
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
    <main className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto p-4">
        {/* 顶部状态栏 */}
        <div className="flex justify-between items-center bg-gray-800 rounded-lg p-3 mb-4 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="text-sm">
              <span className="text-gray-400">等级 </span>
              <span className="text-xl font-bold text-yellow-400">{level}</span>
            </div>
            <div className="text-sm">
              <span className="text-gray-400">分数 </span>
              <span className="text-xl font-bold text-green-400">{score}</span>
            </div>
            <div className="text-sm">
              <span className="text-gray-400">称号 </span>
              <span className="text-xl font-bold text-purple-400">{currentTitle}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowAchievements(!showAchievements)}
              className="px-3 py-1 text-sm bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
            >
              {showAchievements ? '返回游戏' : '查看成就'}
            </button>
            <button
              onClick={restartGame}
              className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
            >
              重新开始
            </button>
          </div>
        </div>

        {/* 成就提示 */}
        {lastAchievement && (
          <div className="fixed top-4 right-4 bg-yellow-500 text-black px-4 py-2 rounded-lg animate-bounce shadow-lg">
            🏆 解锁成就：{lastAchievement}
          </div>
        )}

        {/* 游戏区域 */}
        <div className="flex justify-center">
          {gameOver ? (
            <div className="text-center bg-gray-800 rounded-lg p-6 shadow-lg">
              <h2 className="text-2xl mb-4">游戏结束!</h2>
              <p className="mb-4">最终得分: {score}</p>
              <button
                onClick={restartGame}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                再来一次
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
        </div>

        {/* 成就面板 */}
        <Achievements
          unlockedAchievements={unlockedAchievements}
          isOpen={showAchievements}
          onClose={() => setShowAchievements(false)}
        />
      </div>
    </main>
  );
}
