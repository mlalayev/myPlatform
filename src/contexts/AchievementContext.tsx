"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Achievement {
  name: string;
  description: string;
  rarity: 'bronze' | 'silver' | 'gold' | 'platinum' | 'legendary';
  coins: number;
}

interface AchievementContextType {
  showAchievementPopup: (achievement: Achievement) => void;
  hideAchievementPopup: () => void;
  currentAchievement: Achievement | null;
  isPopupVisible: boolean;
}

const AchievementContext = createContext<AchievementContextType | undefined>(undefined);

export const useAchievement = () => {
  const context = useContext(AchievementContext);
  if (context === undefined) {
    throw new Error('useAchievement must be used within an AchievementProvider');
  }
  return context;
};

interface AchievementProviderProps {
  children: ReactNode;
}

export const AchievementProvider: React.FC<AchievementProviderProps> = ({ children }) => {
  const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  
  const showAchievementPopup = (achievement: Achievement) => {
    console.log('🎉 Achievement unlocked:', achievement.name);
    setCurrentAchievement(achievement);
    setIsPopupVisible(true);
  };

  const hideAchievementPopup = () => {
    setIsPopupVisible(false);
    setCurrentAchievement(null);
  };

  return (
    <AchievementContext.Provider
      value={{
        showAchievementPopup,
        hideAchievementPopup,
        currentAchievement,
        isPopupVisible,
      }}
    >
      {children}
    </AchievementContext.Provider>
  );
}; 