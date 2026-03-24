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
  
  // OPTIMIZED: Check for new achievements only when user completes an action
  // Removed automatic polling to improve performance
  useEffect(() => {
    // Listen for custom achievement events instead of polling
    const handleAchievementEvent = (event: any) => {
      if (event.detail && event.detail.achievement) {
        showAchievementPopup(event.detail.achievement);
      }
    };

    window.addEventListener('newAchievement', handleAchievementEvent);
    return () => window.removeEventListener('newAchievement', handleAchievementEvent);
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