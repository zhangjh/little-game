import React, { useEffect, useState } from 'react';
import { generateColors } from '../utils/colorUtils';
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
  const [freeHintUsed, setFreeHintUsed] = useState(false);
  const [extraHints, setExtraHints] = useState(0);

  useEffect(() => {
    const { colors: newColors, differentIndex: newIndex } = generateColors(
      gridSize * gridSize,
      difficultyFactor
    );
    setColors(newColors);
    setDifferentIndex(newIndex);
    setFreeHintUsed(false);
    setShowHint(false);
  }, [gridSize, difficultyFactor]);

  const handleClick = (index: number) => {
    setShowHint(false);
    if (index === differentIndex) {
      onCorrectClick();
    } else {
      onWrongClick();
    }
  };

  const handleFreeHint = () => {
    if (!freeHintUsed) {
      setShowHint(true);
      setFreeHintUsed(true);
    }
  };

  const handleExtraHint = () => {
    if (extraHints > 0) {
      setShowHint(true);
      setExtraHints(prev => prev - 1);
    }
  };

  const simulateWatchAd = () => {
    // 模拟广告观看
    return new Promise<void>(resolve => {
      setTimeout(() => {
        setExtraHints(prev => prev + 1);
        resolve();
      }, 1500);
    });
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <HintSystem
        onFreeHint={handleFreeHint}
        onExtraHint={handleExtraHint}
        onWatchAd={simulateWatchAd}
        freeHintUsed={freeHintUsed}
        extraHints={extraHints}
      />

      <div
        className="grid gap-2 p-4 relative"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
          maxWidth: `${gridSize * 80}px`,
        }}
      >
        {colors.map((color, index) => (
          <button
            key={index}
            className={`aspect-square w-16 h-16 rounded-lg transition-transform hover:scale-95 relative ${
              showHint && index === differentIndex ? 'ring-4 ring-yellow-400 animate-pulse' : ''
            }`}
            style={{ backgroundColor: color }}
            onClick={() => handleClick(index)}
          />
        ))}
      </div>
    </div>
  );
}

export default Game;