'use client';

import { useState, useEffect } from 'react';
import { generateColors } from '@/utils/colorUtils';
import GameWebSocket from '@/utils/websocket';

interface TwoPlayerGameProps {
  gridSize: number;
  difficultyFactor: number;
  onGameEnd: (winner: number, player1Score: number, player2Score: number) => void;
  roomId: string;
  isHost: boolean;
  onLeaveGame: () => void;
  currentPlayer: 1 | 2;
}

const TwoPlayerGame: React.FC<TwoPlayerGameProps> = ({
  gridSize,
  difficultyFactor,
  onGameEnd,
  roomId,
  isHost,
  onLeaveGame,
  currentPlayer,
}) => {
  const [colors, setColors] = useState<string[]>([]);
  const [differentIndex, setDifferentIndex] = useState<number>(0);
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  const [roundsPlayed, setRoundsPlayed] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [lastWinner, setLastWinner] = useState<number>(0);
  const [waitingForNextRound, setWaitingForNextRound] = useState(false);

  const ws = GameWebSocket.getInstance();

  useEffect(() => {
    // 加入房间
    ws.joinRoom(roomId, currentPlayer);

    const handleMessage = (message: any) => {
      if (message.roomId !== roomId) return;

      switch (message.type) {
        case 'join':
          if (isHost) {
            // 房主创建新一轮游戏数据
            const { colors, differentIndex } = generateNewRound();
            ws.startGame(roomId, currentPlayer, { colors, differentIndex });
          }
          break;

        case 'start':
          // 开始新一轮
          setColors(message.data.colors);
          setDifferentIndex(message.data.differentIndex);
          setGameStarted(true);
          setWaitingForNextRound(false);
          break;

        case 'click':
          handlePlayerClick(message.playerId, message.data.index);
          break;

        case 'leave':
          onLeaveGame();
          break;
      }
    };

    ws.addMessageHandler(handleMessage);

    return () => {
      ws.removeMessageHandler(handleMessage);
      ws.leaveRoom(roomId, currentPlayer);
    };
  }, [roomId, currentPlayer, isHost]);

  const generateNewRound = () => {
    const { colors, differentIndex } = generateColors(gridSize, difficultyFactor);
    return { colors, differentIndex };
  };

  const handlePlayerClick = (playerId: number, clickedIndex: number) => {
    if (waitingForNextRound) return;

    if (clickedIndex === differentIndex) {
      // 正确点击
      if (playerId === 1) {
        setPlayer1Score(prev => prev + 100);
      } else {
        setPlayer2Score(prev => prev + 100);
      }
      setLastWinner(playerId);
      setWaitingForNextRound(true);

      // 检查游戏是否结束
      if (roundsPlayed + 1 >= 10) {
        const finalPlayer1Score = playerId === 1 ? player1Score + 100 : player1Score;
        const finalPlayer2Score = playerId === 2 ? player2Score + 100 : player2Score;
        onGameEnd(
          finalPlayer1Score > finalPlayer2Score ? 1 : finalPlayer2Score > finalPlayer1Score ? 2 : 0,
          finalPlayer1Score,
          finalPlayer2Score
        );
        return;
      }

      // 延迟开始下一轮
      setTimeout(() => {
        setRoundsPlayed(prev => prev + 1);
        if (isHost) {
          const newRound = generateNewRound();
          ws.startGame(roomId, currentPlayer, newRound);
        }
      }, 1500);
    }
  };

  const handleSquareClick = (index: number) => {
    if (!gameStarted || waitingForNextRound) return;
    ws.sendClick(roomId, currentPlayer, index);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex justify-between w-full max-w-md mb-4">
        <div className="text-white">
          玩家1: <span className="text-yellow-400">{player1Score}</span>
        </div>
        <div className="text-white">
          回合: <span className="text-blue-400">{roundsPlayed + 1}/10</span>
        </div>
        <div className="text-white">
          玩家2: <span className="text-yellow-400">{player2Score}</span>
        </div>
      </div>

      {lastWinner > 0 && waitingForNextRound && (
        <div className="text-green-400 text-lg animate-pulse">
          玩家{lastWinner}找到了不同的方块！
        </div>
      )}

      <div
        className="grid gap-2"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
        }}
      >
        {colors.map((color, index) => (
          <button
            key={index}
            onClick={() => handleSquareClick(index)}
            className="w-16 h-16 rounded-lg transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/50"
            style={{ backgroundColor: color }}
            disabled={!gameStarted || waitingForNextRound}
          />
        ))}
      </div>

      <button
        onClick={() => {
          ws.leaveRoom(roomId, currentPlayer);
          onLeaveGame();
        }}
        className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition transform hover:scale-105 shadow-lg mt-4"
      >
        退出游戏
      </button>
    </div>
  );
};

export default TwoPlayerGame;
