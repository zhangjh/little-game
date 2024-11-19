import React, { useState } from 'react';

interface HintSystemProps {
  onFreeHint: () => void;
  onExtraHint: () => void;
  onWatchAd: () => Promise<void>;
  freeHintUsed: boolean;
  extraHints: number;
}

const HintSystem: React.FC<HintSystemProps> = ({
  onFreeHint,
  onExtraHint,
  onWatchAd,
  freeHintUsed,
  extraHints
}) => {
  const [isWatchingAd, setIsWatchingAd] = useState(false);

  const handleWatchAd = async () => {
    setIsWatchingAd(true);
    await onWatchAd();
    setIsWatchingAd(false);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex gap-2">
        <button
          onClick={onFreeHint}
          disabled={freeHintUsed}
          className={`px-4 py-2 rounded-lg text-sm ${
            freeHintUsed
              ? 'bg-gray-600 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          免费提示
          {freeHintUsed && ' (已使用)'}
        </button>

        <button
          onClick={onExtraHint}
          disabled={extraHints === 0}
          className={`px-4 py-2 rounded-lg text-sm ${
            extraHints === 0
              ? 'bg-gray-600 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          使用额外提示 ({extraHints})
        </button>
      </div>

      <button
        onClick={handleWatchAd}
        disabled={isWatchingAd}
        className={`px-4 py-2 rounded-lg text-sm ${
          isWatchingAd
            ? 'bg-gray-600 cursor-not-allowed'
            : 'bg-yellow-600 hover:bg-yellow-700'
        }`}
      >
        {isWatchingAd ? '正在观看广告...' : '观看广告获取提示'}
      </button>
    </div>
  );
};

export default HintSystem;