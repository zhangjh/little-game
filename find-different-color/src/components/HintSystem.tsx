'use client';

import { useState } from 'react';

interface HintSystemProps {
  onFreeHint: () => void;
  onWatchAd: () => Promise<void>;
  freeHintUsed: boolean;
}

const HintSystem: React.FC<HintSystemProps> = ({
  onFreeHint,
  onWatchAd,
  freeHintUsed
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
