"use client";

import React, { useEffect } from "react";
import { useAchievement } from "@/contexts/AchievementContext";
import AchievementPopup from "./components/AchievementPopup";
import { useI18n } from "@/contexts/I18nContext";

export default function GlobalAchievementPopupWrapper() {
  const { currentAchievement, isPopupVisible, hideAchievementPopup, showAchievementPopup } = useAchievement();
  const { t } = useI18n();
  
  // Add showAchievementPopup to window for testing
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.showAchievementPopup = showAchievementPopup;
    }
  }, [showAchievementPopup]);
  
  // Check for new achievements when component mounts
  useEffect(() => {
    const checkNewAchievements = async () => {
      try {
        // Sync achievements to check for new ones
        const syncResponse = await fetch('/api/user/sync-achievements', {
          method: 'POST'
        });
        
        if (syncResponse.ok) {
          const syncData = await syncResponse.json();
          
          // If there are new achievements, show the first one
          if (syncData.newAchievementsForPopup && syncData.newAchievementsForPopup.length > 0) {
            console.log('🎉 New achievement found:', syncData.newAchievementsForPopup[0]);
            showAchievementPopup(syncData.newAchievementsForPopup[0]);
          }
        }
      } catch (error) {
        console.error('Error checking for new achievements:', error);
      }
    };

    // Check immediately when component mounts
    checkNewAchievements();

    // Also check every 30 seconds for new achievements
    const interval = setInterval(checkNewAchievements, 30000);

    return () => clearInterval(interval);
  }, [showAchievementPopup]);
  
  const handleNavigateToProfile = () => {
    hideAchievementPopup();
    // Navigate to profile page
    if (typeof window !== 'undefined') {
      const currentLang = window.location.pathname.split('/')[1] || 'en';
      window.location.href = `/${currentLang}/profile`;
    }
  };

  const unlockedText = t("profile.achievements.unlocked") || "Achievement Unlocked!";
  const viewProfileText = t("profile.achievements.viewProfile") || "View in Profile";
  const coinsText = t("profile.achievements.rewards.coins") || "coins";

  if (!currentAchievement || !isPopupVisible) {
    return null;
  }

  return (
    <AchievementPopup
      achievement={currentAchievement}
      isVisible={isPopupVisible}
      onClose={hideAchievementPopup}
      onNavigateToProfile={handleNavigateToProfile}
      unlockedText={unlockedText}
      viewProfileText={viewProfileText}
      coinsText={coinsText}
    />
  );
} 