"use client";

import React, { useState } from "react";
import {
  FiHeart,
  FiSearch,
  FiFilter,
  FiBookOpen,
  FiCode,
  FiAward,
  FiPlay,
  FiFileText,
  FiEye,
  FiTrash2,
  FiShare2,
  FiDownload,
  FiStar,
  FiClock,
  FiUsers,
  FiTrendingUp,
  FiPlus,
  FiGrid,
  FiList,
  FiRefreshCw,
  FiBookmark,
  FiVideo,
  FiImage,
  FiMusic,
} from "react-icons/fi";
import { useI18n } from "../../../../contexts/I18nContext";
import favouritesStyles from "../ProfileFavourites.module.css";

interface ProfileFavouritesProps {
  userStats: any;
  loading: boolean;
}

export default function ProfileFavourites({
  userStats,
  loading,
}: ProfileFavouritesProps) {
  const { t } = useI18n();
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");

  if (loading) {
    return (
      <div className={favouritesStyles.favouritesContainer}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              border: '4px solid #f3f3f3', 
              borderTop: '4px solid #ff6b6b', 
              borderRadius: '50%', 
              animation: 'spin 1s linear infinite',
              margin: '0 auto 16px'
            }}></div>
            <span style={{ color: '#718096' }}>{t("favourites.loading")}</span>
          </div>
        </div>
      </div>
    );
  }

  // Favourites statistics
  const favouritesStats = {
    total: 18,
    lessons: 8,
    exercises: 6,
    tutorials: 4
  };

  // Sample favourites data
  const favourites = [
    {
      id: 1,
      type: "lesson",
      title: t("favourites.items.advancedAlgorithms.title"),
      description: t("favourites.items.advancedAlgorithms.description"),
      category: "algorithms",
      icon: <FiBookOpen />,
      stats: { views: 1250, likes: 89, duration: "45 min" },
      date: "2 gün əvvəl",
      difficulty: "Advanced"
    },
    {
      id: 2,
      type: "exercise",
      title: t("favourites.items.dynamicProgramming.title"),
      description: t("favourites.items.dynamicProgramming.description"),
      category: "algorithms",
      icon: <FiCode />,
      stats: { views: 890, likes: 67, duration: "30 min" },
      date: "1 həftə əvvəl",
      difficulty: "Hard"
    },
    {
      id: 3,
      type: "tutorial",
      title: t("favourites.items.reactHooks.title"),
      description: t("favourites.items.reactHooks.description"),
      category: "frontend",
      icon: <FiPlay />,
      stats: { views: 2100, likes: 156, duration: "1h 15min" },
      date: "3 gün əvvəl",
      difficulty: "Intermediate"
    },
    {
      id: 4,
      type: "achievement",
      title: t("favourites.items.codeMaster.title"),
      description: t("favourites.items.codeMaster.description"),
      category: "achievements",
      icon: <FiAward />,
      stats: { views: 450, likes: 23, duration: "Earned" },
      date: "1 ay əvvəl",
      difficulty: "Legendary"
    },
    {
      id: 5,
      type: "article",
      title: t("favourites.items.cleanCode.title"),
      description: t("favourites.items.cleanCode.description"),
      category: "best-practices",
      icon: <FiFileText />,
      stats: { views: 780, likes: 45, duration: "10 min" },
      date: "5 gün əvvəl",
      difficulty: "Beginner"
    },
    {
      id: 6,
      type: "video",
      title: t("favourites.items.systemDesign.title"),
      description: t("favourites.items.systemDesign.description"),
      category: "architecture",
      icon: <FiVideo />,
      stats: { views: 3200, likes: 234, duration: "2h 30min" },
      date: "2 həftə əvvəl",
      difficulty: "Expert"
    }
  ];

  const filteredFavourites = favourites.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === "all" || item.type === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "#48bb78";
      case "Intermediate":
        return "#ed8936";
      case "Advanced":
        return "#e53e3e";
      case "Hard":
        return "#9f7aea";
      case "Expert":
        return "#2d3748";
      case "Legendary":
        return "#ffd700";
      default:
        return "#718096";
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "⭐";
      case "Intermediate":
        return "⭐⭐";
      case "Advanced":
        return "⭐⭐⭐";
      case "Hard":
        return "⭐⭐⭐⭐";
      case "Expert":
        return "⭐⭐⭐⭐⭐";
      case "Legendary":
        return "👑";
      default:
        return "⭐";
    }
  };

  if (favourites.length === 0) {
    return (
      <div className={favouritesStyles.favouritesContainer}>
        <div className={favouritesStyles.favouritesHero}>
          <div className={favouritesStyles.heroContent}>
            <div className={favouritesStyles.heroLeft}>
              <h1 className={favouritesStyles.heroTitle}>{t("favourites.hero.title")}</h1>
              <p className={favouritesStyles.heroSubtitle}>
                {t("favourites.hero.subtitle")}
              </p>
            </div>
          </div>
        </div>

        <div className={favouritesStyles.emptyState}>
          <div className={favouritesStyles.emptyIcon}>
            <FiHeart />
          </div>
          <h3 className={favouritesStyles.emptyTitle}>{t("favourites.empty.title")}</h3>
          <p className={favouritesStyles.emptyDescription}>
            {t("favourites.empty.description")}
          </p>
          <button className={favouritesStyles.emptyAction}>
            <FiPlus />
            {t("favourites.empty.action")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={favouritesStyles.favouritesContainer}>
      {/* Hero Section */}
      <div className={favouritesStyles.favouritesHero}>
        <div className={favouritesStyles.heroContent}>
          <div className={favouritesStyles.heroLeft}>
            <h1 className={favouritesStyles.heroTitle}>{t("favourites.hero.title")}</h1>
            <p className={favouritesStyles.heroSubtitle}>
              {t("favourites.hero.subtitle")}
            </p>
            <div className={favouritesStyles.heroActions}>
              <button className={`${favouritesStyles.heroButton} ${favouritesStyles.primary}`}>
                <FiPlus />
                {t("favourites.hero.actions.addNew")}
              </button>
              <button className={favouritesStyles.heroButton}>
                <FiDownload />
                {t("favourites.hero.actions.export")}
              </button>
              <button className={favouritesStyles.heroButton}>
                <FiRefreshCw />
                {t("favourites.hero.actions.refresh")}
              </button>
            </div>
          </div>
          <div className={favouritesStyles.heroRight}>
            <div className={favouritesStyles.favouritesStats}>
              <div className={favouritesStyles.statItem}>
                <span className={favouritesStyles.statNumber}>
                  {favouritesStats.total}
                </span>
                <span className={favouritesStyles.statLabel}>
                  {t("favourites.stats.total")}
                </span>
              </div>
              <div className={favouritesStyles.statItem}>
                <span className={favouritesStyles.statNumber}>
                  {favouritesStats.lessons}
                </span>
                <span className={favouritesStyles.statLabel}>
                  {t("favourites.stats.lessons")}
                </span>
              </div>
              <div className={favouritesStyles.statItem}>
                <span className={favouritesStyles.statNumber}>
                  {favouritesStats.exercises}
                </span>
                <span className={favouritesStyles.statLabel}>
                  {t("favourites.stats.exercises")}
                </span>
              </div>
              <div className={favouritesStyles.statItem}>
                <span className={favouritesStyles.statNumber}>
                  {favouritesStats.tutorials}
                </span>
                <span className={favouritesStyles.statLabel}>
                  {t("favourites.stats.tutorials")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Favourites Overview */}
      <div className={favouritesStyles.favouritesOverview}>
        <div className={favouritesStyles.overviewHeader}>
          <h3 className={favouritesStyles.overviewTitle}>{t("favourites.overview.title")}</h3>
          <div className={favouritesStyles.searchContainer}>
            <FiSearch className={favouritesStyles.searchIcon} />
            <input
              type="text"
              placeholder={t("favourites.search.placeholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={favouritesStyles.searchInput}
            />
          </div>
        </div>

        {/* Filters */}
        <div className={favouritesStyles.favouritesFilters}>
          <button 
            className={`${favouritesStyles.filterButton} ${activeFilter === "all" ? favouritesStyles.active : ""}`}
            onClick={() => setActiveFilter("all")}
          >
            {t("favourites.filters.all")}
          </button>
          <button 
            className={`${favouritesStyles.filterButton} ${activeFilter === "lesson" ? favouritesStyles.active : ""}`}
            onClick={() => setActiveFilter("lesson")}
          >
            {t("favourites.filters.lessons")}
          </button>
          <button 
            className={`${favouritesStyles.filterButton} ${activeFilter === "exercise" ? favouritesStyles.active : ""}`}
            onClick={() => setActiveFilter("exercise")}
          >
            {t("favourites.filters.exercises")}
          </button>
          <button 
            className={`${favouritesStyles.filterButton} ${activeFilter === "tutorial" ? favouritesStyles.active : ""}`}
            onClick={() => setActiveFilter("tutorial")}
          >
            {t("favourites.filters.tutorials")}
          </button>
          <button 
            className={`${favouritesStyles.filterButton} ${activeFilter === "achievement" ? favouritesStyles.active : ""}`}
            onClick={() => setActiveFilter("achievement")}
          >
            {t("favourites.filters.achievements")}
          </button>
        </div>

        {/* Favourites Grid */}
        <div className={favouritesStyles.favouritesGrid}>
          {filteredFavourites.map((item) => (
            <div key={item.id} className={favouritesStyles.favouriteItem}>
              <div className={favouritesStyles.itemHeader}>
                <div className={`${favouritesStyles.itemIcon} ${favouritesStyles[item.type]}`}>
                  {item.icon}
                </div>
                <div className={favouritesStyles.itemInfo}>
                  <h4 className={favouritesStyles.itemTitle}>
                    {item.title}
                  </h4>
                  <div className={favouritesStyles.itemCategory}>
                    {item.category.toUpperCase()}
                  </div>
                  <p className={favouritesStyles.itemDescription}>
                    {item.description}
                  </p>
                </div>
              </div>

              <div className={favouritesStyles.itemMeta}>
                <div className={favouritesStyles.itemStats}>
                  <div className={favouritesStyles.itemStat}>
                    <FiEye className={favouritesStyles.itemStatIcon} />
                    {item.stats.views}
                  </div>
                  <div className={favouritesStyles.itemStat}>
                    <FiHeart className={favouritesStyles.itemStatIcon} />
                    {item.stats.likes}
                  </div>
                  <div className={favouritesStyles.itemStat}>
                    <FiClock className={favouritesStyles.itemStatIcon} />
                    {item.stats.duration}
                  </div>
                </div>
                <div className={favouritesStyles.itemDate}>
                  {item.date}
                </div>
              </div>

              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '16px'
              }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  fontSize: '0.8rem',
                  color: getDifficultyColor(item.difficulty),
                  fontWeight: '600'
                }}>
                  <span>{getDifficultyIcon(item.difficulty)}</span>
                  {item.difficulty}
                </div>
              </div>

              <div className={favouritesStyles.itemActions}>
                <button className={`${favouritesStyles.itemAction} ${favouritesStyles.primary}`}>
                  <FiEye />
                  {t("favourites.actions.view")}
                </button>
                <button className={`${favouritesStyles.itemAction} ${favouritesStyles.secondary}`}>
                  <FiShare2 />
                  {t("favourites.actions.share")}
                </button>
                <button className={`${favouritesStyles.itemAction} ${favouritesStyles.danger}`}>
                  <FiTrash2 />
                  {t("favourites.actions.remove")}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 