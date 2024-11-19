interface Achievement {
  title: string;
  description: string;
  requirement: number;
  type: 'score' | 'level';
}

export const achievements: Achievement[] = [
  { title: '初出茅庐', description: '达到3级', requirement: 3, type: 'level' },
  { title: '火眼初成', description: '达到5级', requirement: 5, type: 'level' },
  { title: '火眼金睛', description: '达到10级', requirement: 10, type: 'level' },
  { title: '火眼大师', description: '达到15级', requirement: 15, type: 'level' },
  { title: '火眼尊者', description: '达到20级', requirement: 20, type: 'level' },
  { title: '初试锋芒', description: '获得2000分', requirement: 2000, type: 'score' },
  { title: '成绩斐然', description: '获得5000分', requirement: 5000, type: 'score' },
  { title: '登峰造极', description: '获得10000分', requirement: 10000, type: 'score' },
  { title: '超凡入圣', description: '获得15000分', requirement: 15000, type: 'score' },
  { title: '色彩之神', description: '获得18000分', requirement: 18000, type: 'score' },
];

export function getCurrentAchievements(score: number, level: number): Achievement[] {
  return achievements.filter(achievement => {
    if (achievement.type === 'score') {
      return score >= achievement.requirement;
    } else {
      return level >= achievement.requirement;
    }
  });
}
