declare global {
  interface Window {
    showAchievementPopup: (achievement: {
      name: string;
      description: string;
      rarity: 'bronze' | 'silver' | 'gold' | 'platinum';
      coins: number;
    }) => void;
  }
}

export {}; 