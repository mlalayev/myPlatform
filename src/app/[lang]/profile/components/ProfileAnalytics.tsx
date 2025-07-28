"use client";

import React from "react";
import {
  FiTrendingUp,
  FiDownload,
  FiShare2,
  FiBarChart2,
  FiPieChart,
  FiActivity,
  FiClock,
  FiTarget,
  FiAward,
  FiCode,
  FiBookOpen,
  FiLayers,
  FiZap,
  FiCalendar,
  FiCheckCircle,
  FiArrowUp,
  FiArrowDown,
  FiMinus,
} from "react-icons/fi";
import { useI18n } from "../../../../contexts/I18nContext";
import analyticsStyles from "../ProfileAnalytics.module.css";

interface ProfileAnalyticsProps {
  userStats: any;
  loading: boolean;
}

export default function ProfileAnalytics({
  userStats,
  loading,
}: ProfileAnalyticsProps) {
  const { t } = useI18n();

  if (loading) {
    return (
      <div className={analyticsStyles.analyticsContainer}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              border: '4px solid #f3f3f3', 
              borderTop: '4px solid #667eea', 
              borderRadius: '50%', 
              animation: 'spin 1s linear infinite',
              margin: '0 auto 16px'
            }}></div>
            <span style={{ color: '#718096' }}>Loading analytics...</span>
          </div>
        </div>
      </div>
    );
  }

  // Sample analytics data
  const analyticsData = {
    totalStudyTime: "127 hours",
    averageSession: "45 min",
    completionRate: 78,
    streakDays: 12,
    lessonsCompleted: 45,
    exercisesSolved: 23,
    accuracy: 85,
    speed: 92,
    consistency: 88,
    points: 2840,
    rank: "Top 15%"
  };

  // Performance trends data
  const performanceTrends = [
    { week: "Week 1", accuracy: 75, speed: 80, consistency: 70 },
    { week: "Week 2", accuracy: 78, speed: 82, consistency: 75 },
    { week: "Week 3", accuracy: 82, speed: 85, consistency: 80 },
    { week: "Week 4", accuracy: 85, speed: 88, consistency: 85 },
    { week: "Week 5", accuracy: 88, speed: 90, consistency: 88 },
    { week: "Week 6", accuracy: 85, speed: 92, consistency: 88 }
  ];

  // Category breakdown data
  const categoryData = [
    {
      id: "programming",
      name: t("analytics.categories.programming"),
      icon: <FiCode />,
      progress: 85,
      completed: 12,
      total: 15,
      color: "#3b82f6"
    },
    {
      id: "algorithms",
      name: t("analytics.categories.algorithms"),
      icon: <FiTarget />,
      progress: 72,
      completed: 18,
      total: 25,
      color: "#e53e3e"
    },
    {
      id: "dataStructures",
      name: t("analytics.categories.dataStructures"),
      icon: <FiLayers />,
      progress: 68,
      completed: 8,
      total: 12,
      color: "#48bb78"
    },
    {
      id: "frameworks",
      name: t("analytics.categories.frameworks"),
      icon: <FiZap />,
      progress: 45,
      completed: 3,
      total: 8,
      color: "#8b5cf6"
    },
    {
      id: "languages",
      name: t("analytics.categories.languages"),
      icon: <FiBookOpen />,
      progress: 90,
      completed: 4,
      total: 5,
      color: "#f59e0b"
    }
  ];

  // Activity heatmap data (52 weeks)
  const generateHeatmapData = () => {
    const data = [];
    for (let i = 0; i < 365; i++) {
      const level = Math.floor(Math.random() * 5); // 0-4 levels
      data.push({ day: i, level });
    }
    return data;
  };

  const heatmapData = generateHeatmapData();

  const getMetricChange = (current: number, previous: number) => {
    const change = ((current - previous) / previous) * 100;
    if (change > 0) return { value: change, type: 'positive' };
    if (change < 0) return { value: Math.abs(change), type: 'negative' };
    return { value: 0, type: 'neutral' };
  };

  const getChangeIcon = (type: string) => {
    switch (type) {
      case 'positive':
        return <FiArrowUp size={12} />;
      case 'negative':
        return <FiArrowDown size={12} />;
      default:
        return <FiMinus size={12} />;
    }
  };

  const timeframes = [
    { key: "today", label: t("analytics.timeframes.today") },
    { key: "week", label: t("analytics.timeframes.week") },
    { key: "month", label: t("analytics.timeframes.month") },
    { key: "year", label: t("analytics.timeframes.year") },
    { key: "allTime", label: t("analytics.timeframes.allTime") }
  ];

  return (
    <div className={analyticsStyles.analyticsContainer}>
      {/* Hero Section */}
      <div className={analyticsStyles.analyticsHero}>
        <div className={analyticsStyles.heroContent}>
          <div className={analyticsStyles.heroLeft}>
            <h1 className={analyticsStyles.heroTitle}>
              {t("analytics.hero.title")}
            </h1>
            <p className={analyticsStyles.heroSubtitle}>
              {t("analytics.hero.subtitle")}
            </p>
            <div className={analyticsStyles.heroActions}>
              <button className={`${analyticsStyles.heroButton} ${analyticsStyles.primary}`}>
                <FiDownload />
                {t("analytics.actions.export")}
              </button>
              <button className={analyticsStyles.heroButton}>
                <FiShare2 />
                {t("analytics.actions.share")}
              </button>
              <button className={analyticsStyles.heroButton}>
                <FiBarChart2 />
                {t("analytics.actions.compare")}
              </button>
            </div>
          </div>
          <div className={analyticsStyles.heroRight}>
            <div className={analyticsStyles.analyticsStats}>
              <div className={analyticsStyles.statItem}>
                <span className={analyticsStyles.statNumber}>
                  {analyticsData.totalStudyTime}
                </span>
                <span className={analyticsStyles.statLabel}>
                  {t("analytics.hero.stats.totalStudyTime")}
                </span>
              </div>
              <div className={analyticsStyles.statItem}>
                <span className={analyticsStyles.statNumber}>
                  {analyticsData.averageSession}
                </span>
                <span className={analyticsStyles.statLabel}>
                  {t("analytics.hero.stats.averageSession")}
                </span>
              </div>
              <div className={analyticsStyles.statItem}>
                <span className={analyticsStyles.statNumber}>
                  {analyticsData.completionRate}%
                </span>
                <span className={analyticsStyles.statLabel}>
                  {t("analytics.hero.stats.completionRate")}
                </span>
              </div>
              <div className={analyticsStyles.statItem}>
                <span className={analyticsStyles.statNumber}>
                  {analyticsData.streakDays}
                </span>
                <span className={analyticsStyles.statLabel}>
                  {t("analytics.hero.stats.streakDays")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className={analyticsStyles.analyticsFilters}>
        <div className={analyticsStyles.timeframeTabs}>
          {timeframes.map((timeframe) => (
            <button
              key={timeframe.key}
              className={`${analyticsStyles.timeframeTab} ${timeframe.key === 'month' ? analyticsStyles.active : ''}`}
            >
              {timeframe.label}
            </button>
          ))}
        </div>
        
        <div className={analyticsStyles.exportActions}>
          <button className={analyticsStyles.exportButton}>
            <FiDownload />
            {t("analytics.actions.export")}
          </button>
          <button className={analyticsStyles.exportButton}>
            <FiShare2 />
            {t("analytics.actions.share")}
          </button>
        </div>
      </div>

      {/* Metrics Overview */}
      <div className={analyticsStyles.metricsOverview}>
        <div className={analyticsStyles.overviewHeader}>
          <div>
            <h3 className={analyticsStyles.overviewTitle}>
              {t("analytics.overview.title")}
            </h3>
            <p className={analyticsStyles.overviewSubtitle}>
              {t("analytics.overview.subtitle")}
            </p>
          </div>
        </div>
        <div className={analyticsStyles.metricsGrid}>
          <div className={`${analyticsStyles.metricCard} ${analyticsStyles.positive}`}>
            <div className={analyticsStyles.metricIcon}>
              <FiClock />
            </div>
            <div className={`${analyticsStyles.metricNumber} ${analyticsStyles.positive}`}>
              {analyticsData.lessonsCompleted}
            </div>
            <div className={analyticsStyles.metricLabel}>
              {t("analytics.metrics.lessonsCompleted")}
            </div>
            <div className={`${analyticsStyles.metricChange} ${analyticsStyles.positive}`}>
              {getChangeIcon('positive')}
              +12% from last month
            </div>
          </div>
          
          <div className={`${analyticsStyles.metricCard} ${analyticsStyles.positive}`}>
            <div className={analyticsStyles.metricIcon}>
              <FiCode />
            </div>
            <div className={`${analyticsStyles.metricNumber} ${analyticsStyles.positive}`}>
              {analyticsData.exercisesSolved}
            </div>
            <div className={analyticsStyles.metricLabel}>
              {t("analytics.metrics.exercisesSolved")}
            </div>
            <div className={`${analyticsStyles.metricChange} ${analyticsStyles.positive}`}>
              {getChangeIcon('positive')}
              +8% from last month
            </div>
          </div>
          
          <div className={`${analyticsStyles.metricCard} ${analyticsStyles.warning}`}>
            <div className={analyticsStyles.metricIcon}>
              <FiTarget />
            </div>
            <div className={`${analyticsStyles.metricNumber} ${analyticsStyles.warning}`}>
              {analyticsData.accuracy}%
            </div>
            <div className={analyticsStyles.metricLabel}>
              {t("analytics.metrics.accuracy")}
            </div>
            <div className={`${analyticsStyles.metricChange} ${analyticsStyles.negative}`}>
              {getChangeIcon('negative')}
              -3% from last month
            </div>
          </div>
          
          <div className={`${analyticsStyles.metricCard} ${analyticsStyles.positive}`}>
            <div className={analyticsStyles.metricIcon}>
              <FiAward />
            </div>
            <div className={`${analyticsStyles.metricNumber} ${analyticsStyles.positive}`}>
              {analyticsData.points}
            </div>
            <div className={analyticsStyles.metricLabel}>
              {t("analytics.metrics.points")}
            </div>
            <div className={`${analyticsStyles.metricChange} ${analyticsStyles.positive}`}>
              {getChangeIcon('positive')}
              +15% from last month
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className={analyticsStyles.chartsSection}>
        {/* Study Time Distribution */}
        <div className={analyticsStyles.chartCard}>
          <div className={analyticsStyles.chartHeader}>
            <div>
              <h4 className={analyticsStyles.chartTitle}>
                {t("analytics.charts.studyTime.title")}
              </h4>
              <p className={analyticsStyles.chartSubtitle}>
                {t("analytics.charts.studyTime.subtitle")}
              </p>
            </div>
          </div>
          <div className={analyticsStyles.chartContent}>
            <div className={analyticsStyles.chartPlaceholder}>
              <div className={analyticsStyles.chartPlaceholderIcon}>
                <FiBarChart2 />
              </div>
              <div className={analyticsStyles.chartPlaceholderText}>
                Study Time Chart
              </div>
            </div>
          </div>
        </div>

        {/* Learning Progress */}
        <div className={analyticsStyles.chartCard}>
          <div className={analyticsStyles.chartHeader}>
            <div>
              <h4 className={analyticsStyles.chartTitle}>
                {t("analytics.charts.progress.title")}
              </h4>
              <p className={analyticsStyles.chartSubtitle}>
                {t("analytics.charts.progress.subtitle")}
              </p>
            </div>
          </div>
          <div className={analyticsStyles.chartContent}>
            <div className={analyticsStyles.chartPlaceholder}>
              <div className={analyticsStyles.chartPlaceholderIcon}>
                <FiPieChart />
              </div>
              <div className={analyticsStyles.chartPlaceholderText}>
                Progress Chart
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Heatmap */}
      <div className={analyticsStyles.activityHeatmap}>
        <div className={analyticsStyles.heatmapHeader}>
          <div>
            <h3 className={analyticsStyles.heatmapTitle}>
              {t("analytics.charts.activity.title")}
            </h3>
            <p className={analyticsStyles.heatmapSubtitle}>
              {t("analytics.charts.activity.subtitle")}
            </p>
          </div>
        </div>
        <div className={analyticsStyles.heatmapGrid}>
          {heatmapData.map((day, index) => (
            <div
              key={index}
              className={`${analyticsStyles.heatmapDay} ${analyticsStyles[`level${day.level}`]}`}
              title={`Day ${day.day + 1}: Level ${day.level}`}
            ></div>
          ))}
        </div>
        <div className={analyticsStyles.heatmapLegend}>
          <span>Less</span>
          <div className={analyticsStyles.heatmapLegendItem}>
            <div className={`${analyticsStyles.heatmapLegendColor} ${analyticsStyles.level0}`}></div>
          </div>
          <div className={analyticsStyles.heatmapLegendItem}>
            <div className={`${analyticsStyles.heatmapLegendColor} ${analyticsStyles.level1}`}></div>
          </div>
          <div className={analyticsStyles.heatmapLegendItem}>
            <div className={`${analyticsStyles.heatmapLegendColor} ${analyticsStyles.level2}`}></div>
          </div>
          <div className={analyticsStyles.heatmapLegendItem}>
            <div className={`${analyticsStyles.heatmapLegendColor} ${analyticsStyles.level3}`}></div>
          </div>
          <div className={analyticsStyles.heatmapLegendItem}>
            <div className={`${analyticsStyles.heatmapLegendColor} ${analyticsStyles.level4}`}></div>
          </div>
          <span>More</span>
        </div>
      </div>

      {/* Performance Trends */}
      <div className={analyticsStyles.performanceTrends}>
        <div className={analyticsStyles.trendsHeader}>
          <div>
            <h3 className={analyticsStyles.trendsTitle}>
              {t("analytics.charts.performance.title")}
            </h3>
            <p className={analyticsStyles.trendsSubtitle}>
              {t("analytics.charts.performance.subtitle")}
            </p>
          </div>
        </div>
        <div className={analyticsStyles.trendsChart}>
          Performance Trends Chart
        </div>
      </div>

      {/* Category Breakdown */}
      <div className={analyticsStyles.categoryBreakdown}>
        <div className={analyticsStyles.breakdownHeader}>
          <div>
            <h3 className={analyticsStyles.breakdownTitle}>
              Category Breakdown
            </h3>
            <p className={analyticsStyles.breakdownSubtitle}>
              Progress across different learning categories
            </p>
          </div>
        </div>
        <div className={analyticsStyles.categoryList}>
          {categoryData.map((category) => (
            <div key={category.id} className={analyticsStyles.categoryItem}>
              <div className={analyticsStyles.categoryInfo}>
                <div className={analyticsStyles.categoryIcon}>
                  {category.icon}
                </div>
                <div className={analyticsStyles.categoryDetails}>
                  <div className={analyticsStyles.categoryName}>
                    {category.name}
                  </div>
                  <div className={analyticsStyles.categoryProgress}>
                    {category.completed} of {category.total} completed
                  </div>
                </div>
              </div>
              <div className={analyticsStyles.categoryStats}>
                <div className={analyticsStyles.categoryPercentage}>
                  {category.progress}%
                </div>
                <div className={analyticsStyles.categoryBar}>
                  <div 
                    className={analyticsStyles.categoryBarFill}
                    style={{ width: `${category.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 