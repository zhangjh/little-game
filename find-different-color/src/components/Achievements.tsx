'use client';

import { achievements as achievementsList } from '@/utils/achievementUtils';

interface AchievementsProps {
  unlockedAchievements: typeof achievementsList;
  isOpen: boolean;
  onClose: () => void;
}

const Achievements: React.FC<AchievementsProps> = ({
  unlockedAchievements,
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">成就</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>
        
        <div className="space-y-3">
          {achievementsList.map((achievement) => {
            const isUnlocked = unlockedAchievements.some(
              (a) => a.title === achievement.title
            );
            
            return (
              <div
                key={achievement.title}
                className={`p-3 rounded-lg ${
                  isUnlocked ? 'bg-blue-900' : 'bg-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold">
                    {achievement.title}
                    {isUnlocked && ' ✓'}
                  </span>
                  <span className="text-sm text-gray-300">
                    {achievement.requirement}
                    {achievement.type === 'score' ? '分' : '级'}
                  </span>
                </div>
                <p className="text-sm text-gray-400 mt-1">
                  {achievement.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Achievements;
