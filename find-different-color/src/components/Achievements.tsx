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
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">成就列表</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="overflow-y-auto flex-1">
          <ul className="space-y-2">
            {achievementsList.map((achievement, index) => {
              const isUnlocked = unlockedAchievements.some(
                (a) => a.title === achievement.title
              );
              return (
                <li key={index} className={`p-3 rounded-lg ${isUnlocked ? 'bg-green-100' : 'bg-gray-100'}`}>
                  <div className="font-medium">{achievement.title}</div>
                  <div className="text-sm text-gray-600">{achievement.description}</div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Achievements;
