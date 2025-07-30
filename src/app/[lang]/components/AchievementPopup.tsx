"use client";

import React, { useState, useEffect } from 'react';
import { FiAward, FiTrendingUp } from 'react-icons/fi';
import styles from './AchievementPopup.module.css';

interface AchievementPopupProps {
  achievement: {
    name: string;
    description: string;
    rarity: 'bronze' | 'silver' | 'gold' | 'platinum' | 'legendary';
    coins: number;
  };
  isVisible: boolean;
  onClose: () => void;
  onNavigateToProfile: () => void;
  unlockedText?: string;
  viewProfileText?: string;
  coinsText?: string;
}

const AchievementPopup: React.FC<AchievementPopupProps> = ({
  achievement,
  isVisible,
  onClose,
  onNavigateToProfile,
  unlockedText = "Achievement Unlocked!",
  viewProfileText = "View in Profile",
  coinsText = "coins"
}) => {
  const [progress, setProgress] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      setProgress(0);
      
      // Start progress animation - 5 seconds total
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + 2; // 2% every 100ms = 5 seconds total
        });
      }, 100);

      // Auto close after progress completes
      const closeTimeout = setTimeout(() => {
        onClose();
      }, 5000); // 5 seconds total

      return () => {
        clearInterval(progressInterval);
        clearTimeout(closeTimeout);
      };
    } else {
      setIsAnimating(false);
      setProgress(0);
    }
  }, [isVisible, onClose]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className={styles.achievementPopupOverlay}>
      <div 
        className={`${styles.achievementPopup} ${styles[achievement.rarity]} ${isAnimating ? styles.animateIn : ''}`}
      >
        {/* Achievement icon */}
        <div className={styles.achievementPopupIcon}>
          <FiAward size={20} />
        </div>

        {/* Achievement content */}
        <div className={styles.achievementPopupContent}>
          <h3 className={styles.achievementPopupTitle}>
            {unlockedText}
          </h3>
          <div className={styles.achievementPopupNameContainer}>
            <h4 className={styles.achievementPopupName}>
              {achievement.name}
            </h4>
            
            {/* Coins reward */}
            <div className={styles.achievementPopupReward}>
              <span className={styles.achievementPopupCoins}>
                +{achievement.coins} {coinsText}
              </span>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className={styles.achievementPopupProgress}>
          <div className={styles.achievementPopupProgressBar}>
            <div 
              className={styles.achievementPopupProgressFill}
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className={styles.achievementPopupProgressText}>
            {Math.round(progress)}%
          </span>
        </div>

        {/* Click to view profile */}
        <button 
          className={styles.achievementPopupProfileBtn}
          onClick={onNavigateToProfile}
        >
          <FiTrendingUp size={10} />
          {viewProfileText}
        </button>
      </div>
    </div>
  );
};

export default AchievementPopup; 