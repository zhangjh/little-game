'use client';

import { useState } from 'react';
import Game from '@/components/Game';
import TwoPlayerGame from '@/components/TwoPlayerGame';
import RoomSelection from '@/components/RoomSelection';
import WaitingRoom from '@/components/WaitingRoom';
import Achievements from '@/components/Achievements';
import { getCurrentAchievements } from '@/utils/achievementUtils';

export default function Home() {
  // 游戏模式状态
  const [gameMode, setGameMode] = useState<'menu' | 'single' | 'multiplayer'>('menu');
  const [multiplayerState, setMultiplayerState] = useState<'selection' | 'waiting' | 'playing'>('selection');
  
  // 单人模式状态
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showGameComplete, setShowGameComplete] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [unlockedAchievements, setUnlockedAchievements] = useState(getCurrentAchievements(0, 1));
  const [lastAchievement, setLastAchievement] = useState<string | null>(null);

  // 多人模式状态
  const [roomId, setRoomId] = useState<string>('');
  const [isHost, setIsHost] = useState(false);
  const [winner, setWinner] = useState<number>(0);
  const [finalPlayer1Score, setFinalPlayer1Score] = useState(0);
  const [finalPlayer2Score, setFinalPlayer2Score] = useState(0);

  const getGridSize = (level: number) => {
    if (level <= 5) return 2;
    if (level <= 10) return 3;
    if (level <= 20) return 4;
    return 5;
  };

  const getDifficultyFactor = (level: number) => {
    const baseDifficulty = 50;
    const decreasePerLevel = 1.5;
    return Math.max(5, baseDifficulty - level * decreasePerLevel);
  };

  const handleCorrectClick = () => {
    const difficultyBonus = Math.round((50 - getDifficultyFactor(level)) * 10);
    const newScore = score + (level * 100 + difficultyBonus);
    setScore(newScore);

    if (level === 30) {
      setScore(newScore + 3000);
      setShowGameComplete(true);
      return;
    }

    setLevel(level + 1);

    const newAchievements = getCurrentAchievements(newScore, level + 1);
    if (newAchievements.length > unlockedAchievements.length) {
      const latestAchievement = newAchievements[newAchievements.length - 1];
      setLastAchievement(latestAchievement.title);
      setTimeout(() => setLastAchievement(null), 3000);
    }
    setUnlockedAchievements(newAchievements);
  };

  const handleGameOver = () => {
    setGameOver(true);
  };

  const handleCreateRoom = () => {
    const newRoomId = Math.floor(100000 + Math.random() * 900000).toString();
    setRoomId(newRoomId);
    setIsHost(true);
    setMultiplayerState('waiting');
  };

  const handleJoinRoom = (id: string) => {
    setRoomId(id);
    setIsHost(false);
    setMultiplayerState('waiting');
  };

  const handlePlayerJoined = () => {
    if (isHost) {
      setMultiplayerState('playing');
    }
  };

  const handleLeaveRoom = () => {
    setRoomId('');
    setIsHost(false);
    setMultiplayerState('selection');
    setGameMode('menu');
  };

  const handleMultiplayerGameEnd = (winner: number, player1Score: number, player2Score: number) => {
    setWinner(winner);
    setFinalPlayer1Score(player1Score);
    setFinalPlayer2Score(player2Score);
    setMultiplayerState('selection');
    setGameMode('menu');
  };

  const restartGame = () => {
    setLevel(1);
    setScore(0);
    setGameOver(false);
    setShowGameComplete(false);
    setUnlockedAchievements(getCurrentAchievements(0, 1));
    setWinner(0);
    setFinalPlayer1Score(0);
    setFinalPlayer2Score(0);
    setGameMode('menu');
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-indigo-900 via-purple-900 to-pink-900">
      {/* 顶部状态栏 */}
      <div className="w-full max-w-3xl mb-8">
        <div className="flex flex-col items-center mb-4 bg-white/10 backdrop-blur-md rounded-xl p-4 shadow-lg">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 mb-2">
            色彩大作战
          </h1>
          {gameMode === 'single' && (
            <div className="flex gap-8 mt-2">
              <div className="text-lg text-white">
                第 <span className="font-bold text-yellow-400 text-2xl">{level}</span> 关
              </div>
              <div className="text-lg text-white">
                分数: <span className="font-bold text-green-400 text-2xl">{score}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 游戏模式选择 */}
      {gameMode === 'menu' && (
        <div className="flex flex-col items-center gap-6 mb-8">
          <div className="text-4xl font-bold text-white mb-12">
            选择游戏模式
          </div>
          <div className="flex gap-8">
            <button
              onClick={() => setGameMode('single')}
              className="px-12 py-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition transform hover:scale-105 shadow-lg text-xl font-semibold"
            >
              单人模式
            </button>
            <button
              onClick={() => setGameMode('multiplayer')}
              className="px-12 py-6 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition transform hover:scale-105 shadow-lg text-xl font-semibold"
            >
              多人对战
            </button>
          </div>
        </div>
      )}

      {/* 游戏区域 */}
      {gameMode !== 'menu' && (
        <>
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg">
            {gameMode === 'single' && (
              <Game
                gridSize={getGridSize(level)}
                difficultyFactor={getDifficultyFactor(level)}
                onCorrectClick={handleCorrectClick}
                onWrongClick={handleGameOver}
              />
            )}

            {gameMode === 'multiplayer' && (
              <>
                {multiplayerState === 'selection' && (
                  <RoomSelection
                    onCreateRoom={handleCreateRoom}
                    onJoinRoom={handleJoinRoom}
                  />
                )}
                {multiplayerState === 'waiting' && (
                  <WaitingRoom
                    roomId={roomId}
                    isHost={isHost}
                    onLeave={handleLeaveRoom}
                    onPlayerJoined={handlePlayerJoined}
                  />
                )}
                {multiplayerState === 'playing' && (
                  <TwoPlayerGame
                    gridSize={3}
                    difficultyFactor={10}
                    onGameEnd={handleMultiplayerGameEnd}
                    roomId={roomId}
                    isHost={isHost}
                    onLeaveGame={handleLeaveRoom}
                    currentPlayer={isHost ? 1 : 2}
                  />
                )}
              </>
            )}
          </div>

          {/* 单人模式下的底部按钮 */}
          {gameMode === 'single' && (
            <div className="w-full max-w-3xl mt-8 flex justify-center gap-4">
              <button
                onClick={() => setShowAchievements(true)}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition transform hover:scale-105 shadow-lg"
              >
                查看成就
              </button>
              <button
                onClick={restartGame}
                className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition transform hover:scale-105 shadow-lg"
              >
                重新开始
              </button>
            </div>
          )}
        </>
      )}

      {/* 游戏结束提示 */}
      {gameOver && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-xl text-center text-white">
            <h2 className="text-2xl font-bold mb-4">游戏结束</h2>
            <p className="mb-6 text-lg">
              你达到了第 <span className="text-yellow-400">{level}</span> 关<br/>
              获得了 <span className="text-green-400">{score}</span> 分！
            </p>
            <button
              onClick={restartGame}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition transform hover:scale-105 shadow-lg"
            >
              再试一次
            </button>
          </div>
        </div>
      )}

      {/* 游戏通关提示 */}
      {showGameComplete && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-xl text-center text-white">
            <h2 className="text-2xl font-bold mb-4">🎉 恭喜通关！</h2>
            <p className="mb-6 text-lg">
              你成功完成了所有30关<br/>
              获得了 <span className="text-green-400">{score}</span> 分！<br/>
              <span className="text-yellow-400 text-xl mt-2 block">你是色彩大师！</span>
            </p>
            <button
              onClick={restartGame}
              className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-pink-500 text-white rounded-lg hover:from-yellow-500 hover:to-pink-600 transition transform hover:scale-105 shadow-lg"
            >
              重新挑战
            </button>
          </div>
        </div>
      )}

      {/* 成就列表 */}
      <Achievements
        isOpen={showAchievements}
        onClose={() => setShowAchievements(false)}
        unlockedAchievements={unlockedAchievements}
      />

      {/* 成就提示 */}
      {lastAchievement && (
        <div className="fixed top-4 right-4 bg-gradient-to-r from-green-400 to-blue-500 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in-out">
          🏆 解锁成就：{lastAchievement}
        </div>
      )}
    </main>
  );
}
