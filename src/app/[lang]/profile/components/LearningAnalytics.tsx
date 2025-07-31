'use client';

import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface LearningAnalyticsProps {
  userStats: any;
  activeTab: 'weekly' | 'monthly' | 'allTime';
}

export default function LearningAnalytics({ userStats, activeTab }: LearningAnalyticsProps) {

  // Generate mock data for different time periods
  const generateWeeklyData = () => ({
    labels: ['Bazar ertəsi', 'Çərşənbə axşamı', 'Çərşənbə', 'Cümə axşamı', 'Cümə', 'Şənbə', 'Bazar'],
    datasets: [
      {
        label: 'Dərslər',
        data: [
          userStats?.weeklyProgress?.lessonsThisWeek || 0,
          Math.floor((userStats?.weeklyProgress?.lessonsThisWeek || 0) * 0.8),
          Math.floor((userStats?.weeklyProgress?.lessonsThisWeek || 0) * 1.2),
          Math.floor((userStats?.weeklyProgress?.lessonsThisWeek || 0) * 0.9),
          Math.floor((userStats?.weeklyProgress?.lessonsThisWeek || 0) * 1.1),
          Math.floor((userStats?.weeklyProgress?.lessonsThisWeek || 0) * 0.7),
          Math.floor((userStats?.weeklyProgress?.lessonsThisWeek || 0) * 0.6),
        ],
        backgroundColor: 'rgba(102, 126, 234, 0.8)',
        borderColor: 'rgba(102, 126, 234, 1)',
        borderWidth: 2,
      },
      {
        label: 'Məşqlər',
        data: [
          userStats?.weeklyProgress?.exercisesThisWeek || 0,
          Math.floor((userStats?.weeklyProgress?.exercisesThisWeek || 0) * 0.6),
          Math.floor((userStats?.weeklyProgress?.exercisesThisWeek || 0) * 1.4),
          Math.floor((userStats?.weeklyProgress?.exercisesThisWeek || 0) * 0.8),
          Math.floor((userStats?.weeklyProgress?.exercisesThisWeek || 0) * 1.3),
          Math.floor((userStats?.weeklyProgress?.exercisesThisWeek || 0) * 0.5),
          Math.floor((userStats?.weeklyProgress?.exercisesThisWeek || 0) * 0.4),
        ],
        backgroundColor: 'rgba(72, 187, 120, 0.8)',
        borderColor: 'rgba(72, 187, 120, 1)',
        borderWidth: 2,
      },
    ],
  });

  const generateMonthlyData = () => ({
    labels: ['Həftə 1', 'Həftə 2', 'Həftə 3', 'Həftə 4'],
    datasets: [
      {
        label: 'Dərslər',
        data: [
          (userStats?.weeklyProgress?.lessonsThisWeek || 0) * 4,
          (userStats?.weeklyProgress?.lessonsThisWeek || 0) * 3.5,
          (userStats?.weeklyProgress?.lessonsThisWeek || 0) * 4.2,
          (userStats?.weeklyProgress?.lessonsThisWeek || 0) * 3.8,
        ],
        backgroundColor: 'rgba(102, 126, 234, 0.8)',
        borderColor: 'rgba(102, 126, 234, 1)',
        borderWidth: 2,
      },
      {
        label: 'Məşqlər',
        data: [
          (userStats?.weeklyProgress?.exercisesThisWeek || 0) * 4,
          (userStats?.weeklyProgress?.exercisesThisWeek || 0) * 3.2,
          (userStats?.weeklyProgress?.exercisesThisWeek || 0) * 4.5,
          (userStats?.weeklyProgress?.exercisesThisWeek || 0) * 3.6,
        ],
        backgroundColor: 'rgba(72, 187, 120, 0.8)',
        borderColor: 'rgba(72, 187, 120, 1)',
        borderWidth: 2,
      },
    ],
  });

  const generateAllTimeData = () => ({
    labels: ['Dərslər', 'Məşqlər', 'Testlər', 'Xallar'],
    datasets: [
      {
        data: [
          userStats?.completedLessons || 0,
          userStats?.solvedExercises || 0,
          Math.floor((userStats?.solvedExercises || 0) * 0.3),
          userStats?.dailyLoginPoints || 0,
        ],
        backgroundColor: [
          'rgba(102, 126, 234, 0.8)',
          'rgba(72, 187, 120, 0.8)',
          'rgba(255, 107, 53, 0.8)',
          'rgba(255, 215, 0, 0.8)',
        ],
        borderColor: [
          'rgba(102, 126, 234, 1)',
          'rgba(72, 187, 120, 1)',
          'rgba(255, 107, 53, 1)',
          'rgba(255, 215, 0, 1)',
        ],
        borderWidth: 2,
      },
    ],
  });

  const getChartData = () => {
    switch (activeTab) {
      case 'weekly':
        return generateWeeklyData();
      case 'monthly':
        return generateMonthlyData();
      case 'allTime':
        return generateAllTimeData();
      default:
        return generateWeeklyData();
    }
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#2d3748',
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#667eea',
        borderWidth: 1,
      },
    },
    scales: activeTab !== 'allTime' ? {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: '#718096',
        },
      },
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: '#718096',
        },
      },
    } : undefined,
  };

  const renderChart = () => {
    const data = getChartData();
    
    if (activeTab === 'allTime') {
      return <Doughnut data={data} options={chartOptions} />;
    } else {
      return <Bar data={data} options={chartOptions} />;
    }
  };

  return (
    <div style={{ height: '300px', width: '100%' }}>
      {renderChart()}
    </div>
  );
} 