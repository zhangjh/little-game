'use client';

import { useEffect, useState, useRef } from 'react';
import { generateColors } from '@/utils/colorUtils';
import HintSystem from './HintSystem';

interface GameProps {
  gridSize: number;
  difficultyFactor: number;
  onCorrectClick: () => void;
  onWrongClick: () => void;
}

const Game: React.FC<GameProps> = ({
  gridSize,
  difficultyFactor,
  onCorrectClick,
  onWrongClick,
}) => {
  const [colors, setColors] = useState<string[]>([]);
  const [differentIndex, setDifferentIndex] = useState<number>(0);
  const [showHint, setShowHint] = useState(false);
  const [remainingFreeHints, setRemainingFreeHints] = useState(3);
  const [clickedIndex, setClickedIndex] = useState<number | null>(null);
  const lastBaseColorRef = useRef<string | null>(null);

  // 计算基础大小，随网格大小增加
  const getBaseSize = () => {
    const baseSize = 300; // 2x2时的基础大小
    const increment = 80; // 每增加一级增加的像素
    return baseSize + (gridSize - 2) * increment;
  };

  useEffect(() => {
    const { colors: newColors, differentIndex: newIndex, baseColor } = generateColors(
      gridSize * gridSize,
      difficultyFactor,
      lastBaseColorRef.current
    );
    setColors(newColors);
    setDifferentIndex(newIndex);
    setShowHint(false);
    setClickedIndex(null); // 重置点击状态
    lastBaseColorRef.current = baseColor;
  }, [gridSize, difficultyFactor]);

  const handleClick = (index: number) => {
    setClickedIndex(index);
    setShowHint(false);
    
    // 延迟执行回调，让动画效果有时间显示
    setTimeout(() => {
      if (index === differentIndex) {
        onCorrectClick();
      } else {
        onWrongClick();
      }
    }, 200);
  };

  const handleFreeHint = () => {
    if (remainingFreeHints > 0) {
      setShowHint(true);
      setRemainingFreeHints(prev => prev - 1);
      setTimeout(() => {
        setShowHint(false);
      }, 1000);
    }
  };

  const simulateWatchAd = () => {
    return new Promise<void>(resolve => {
      setTimeout(() => {
        setShowHint(true);
        resolve();
      }, 1500);
    });
  };

  const baseSize = getBaseSize();

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <div className="flex justify-center gap-4 mb-4">
        <button
          onClick={handleFreeHint}
          disabled={remainingFreeHints === 0 || showHint}
          className={`px-4 py-2 rounded-lg transition transform hover:scale-105 shadow-lg ${
            remainingFreeHints === 0
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600'
          } text-white`}
        >
          免费提示 ({remainingFreeHints}次)
        </button>
        <button
          onClick={simulateWatchAd}
          disabled={showHint}
          className="px-4 py-2 bg-gradient-to-r from-purple-400 to-purple-500 hover:from-purple-500 hover:to-purple-600 text-white rounded-lg transition transform hover:scale-105 shadow-lg"
        >
          {showHint ? '加载中...' : '看广告获取提示'}
        </button>
      </div>

      <div 
        className="w-full max-w-[90vw] mx-auto"
        style={{ 
          width: `${baseSize}px`,
          maxWidth: '90vw'
        }}
      >
        <div
          className="grid gap-[2px] p-4 bg-gray-700 mx-auto"
          style={{
            gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
            aspectRatio: '1 / 1',
          }}
        >
          {colors.map((color, index) => (
            <button
              key={`${index}-${color}`}
              className={`
                w-full h-full rounded-sm md:rounded-lg 
                transition-all duration-200 
                ${showHint && index === differentIndex ? 'ring-4 ring-yellow-400 animate-pulse' : ''}
                ${clickedIndex === null ? 'hover:scale-95 active:scale-90' : ''}
                ${clickedIndex === index ? 'scale-90' : 'scale-100'}
              `}
              style={{ backgroundColor: color }}
              onClick={() => !clickedIndex && handleClick(index)}
              disabled={clickedIndex !== null}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Game;
