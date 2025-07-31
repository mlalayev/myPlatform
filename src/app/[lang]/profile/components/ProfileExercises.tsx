"use client";

import React, { useState, useEffect } from "react";
import {
  FiSearch,
  FiFilter,
  FiChevronDown,
  FiPlay,
  FiCode,
  FiClock,
  FiTrendingUp,
  FiCheck,
  FiX,
  FiTarget,
  FiEye,
  FiRotateCcw,
  FiLayers,
  FiZap,
  FiDatabase,
  FiGitBranch,
  FiCpu,
  FiRefreshCw,
} from "react-icons/fi";
import { useI18n } from "@/contexts/I18nContext";
import exercisesStyles from "../ProfileExercises.module.css";

// Helper function to format study time
function formatStudyTime(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const parts = [];
  if (hours > 0) {
    parts.push(`${hours}s`);
  }
  if (minutes > 0) {
    parts.push(`${minutes}dəq`);
  }
  if (seconds > 0 && hours === 0 && minutes === 0) {
    parts.push(`${seconds}san`);
  }

  return parts.length > 0 ? parts.join(' ') : '0dəq';
}

interface ProfileExercisesProps {
  userStats: any;
  loading: boolean;
}

export default function ProfileExercises({
  userStats,
  loading,
}: ProfileExercisesProps) {
  const [exerciseData, setExerciseData] = useState<any>(null);
  const [exerciseLoading, setExerciseLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Fetch exercise data from backend
  useEffect(() => {
    const fetchExerciseData = async () => {
      try {
        setExerciseLoading(true);
        const response = await fetch("/api/user/exercises");
        if (response.ok) {
          const data = await response.json();
          setExerciseData(data);
        } else {
          console.error("Failed to fetch exercise data:", response.status);
          // Set default data if API fails
          setExerciseData({
            exerciseCategories: [],
            exercises: [],
            performanceStats: {
              totalSolved: 0,
              totalExercises: 0,
              successRate: 0,
              easySolved: 0,
              easyTotal: 0,
              mediumSolved: 0,
              mediumTotal: 0,
              hardSolved: 0,
              hardTotal: 0
            },
            userActivity: [],
            recentExercises: []
          });
        }
      } catch (error) {
        console.error("Error fetching exercise data:", error);
        // Set default data on error
        setExerciseData({
          exerciseCategories: [],
          exercises: [],
          performanceStats: {
            totalSolved: 0,
            totalExercises: 0,
            successRate: 0,
            easySolved: 0,
            easyTotal: 0,
            mediumSolved: 0,
            mediumTotal: 0,
            hardSolved: 0,
            hardTotal: 0
          },
          userActivity: [],
          recentExercises: []
        });
      } finally {
        setExerciseLoading(false);
      }
    };

    fetchExerciseData();
  }, []);

  if (loading || exerciseLoading) {
    return (
      <div className={exercisesStyles.exercisesContainer}>
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
            <span style={{ color: '#718096' }}>Loading your exercises...</span>
          </div>
        </div>
      </div>
    );
  }

  // Filter exercises based on search and status
  const filteredExercises = exerciseData?.exercises?.filter((exercise: any) => {
    const matchesSearch = exercise.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exercise.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exercise.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || exercise.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  }) || [];

  const getDifficultyDots = (difficulty: string) => {
    const levels: { [key: string]: number } = { easy: 1, medium: 2, hard: 3 };
    const level = levels[difficulty] || 1;
    
    return Array.from({ length: 3 }, (_, i) => (
      <div
        key={i}
        className={`${exercisesStyles.difficultyDot} ${
          i < level ? `${exercisesStyles.filled} ${exercisesStyles[difficulty]}` : ''
        }`}
      ></div>
    ));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'solved':
        return <FiCheck />;
      case 'attempted':
        return <FiRotateCcw />;
      default:
        return <FiCode />;
    }
  };

  const getActionButton = (exercise: any) => {
    switch (exercise.status) {
      case 'solved':
        return (
          <button className={`${exercisesStyles.actionButton} ${exercisesStyles.reviewButton}`}>
            <FiEye />
            Review Solution
          </button>
        );
      case 'attempted':
        return (
          <button className={`${exercisesStyles.actionButton} ${exercisesStyles.retryButton}`}>
            <FiRotateCcw />
            Try Again
          </button>
        );
      default:
        return (
          <button className={`${exercisesStyles.actionButton} ${exercisesStyles.solveButton}`}>
            <FiCode />
            Start Solving
          </button>
        );
    }
  };

  const getSubmissionStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <FiCheck style={{ color: '#48bb78' }} />;
      case 'wrong':
        return <FiX style={{ color: '#e53e3e' }} />;
      case 'timeout':
        return <FiClock style={{ color: '#ed8936' }} />;
      default:
        return <FiCode />;
    }
  };

  const performanceStats = exerciseData?.performanceStats || {
    totalSolved: 0,
    totalExercises: 0,
    successRate: 0,
    easySolved: 0,
    easyTotal: 0,
    mediumSolved: 0,
    mediumTotal: 0,
    hardSolved: 0,
    hardTotal: 0
  };

  return (
    <div className={exercisesStyles.exercisesContainer}>
      {/* Hero Section */}
      <div className={exercisesStyles.exercisesHero}>
        <div className={exercisesStyles.heroContent}>
          <div className={exercisesStyles.heroLeft}>
            <h1 className={exercisesStyles.heroTitle}>Exercise History</h1>
            <p className={exercisesStyles.heroSubtitle}>
              Track your coding progress, review solutions, and master programming challenges
            </p>
            <div className={exercisesStyles.heroActions}>
              <button className={`${exercisesStyles.heroButton} ${exercisesStyles.primary}`}>
                <FiCode />
                Solve New Exercise
              </button>
              <button className={exercisesStyles.heroButton}>
                <FiTrendingUp />
                View Analytics
              </button>
              <button className={exercisesStyles.heroButton}>
                <FiTarget />
                Practice Plan
              </button>
            </div>
          </div>
          <div className={exercisesStyles.heroRight}>
            <div className={exercisesStyles.exerciseStats}>
              <div className={exercisesStyles.statItem}>
                <span className={exercisesStyles.statNumber}>
                  {performanceStats.totalSolved}
                </span>
                <span className={exercisesStyles.statLabel}>Solved</span>
              </div>
              <div className={exercisesStyles.statItem}>
                <span className={exercisesStyles.statNumber}>
                  {performanceStats.successRate}%
                </span>
                <span className={exercisesStyles.statLabel}>Success Rate</span>
              </div>
              <div className={exercisesStyles.statItem}>
                <span className={exercisesStyles.statNumber}>
                  {formatStudyTime((userStats?.studyTimeHours || 0) * 3600)}
                </span>
                <span className={exercisesStyles.statLabel}>Code Time</span>
              </div>
              <div className={exercisesStyles.statItem}>
                <span className={exercisesStyles.statNumber}>
                  {exerciseData?.recentExercises?.length || 0}
                </span>
                <span className={exercisesStyles.statLabel}>Recent</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Dashboard */}
      <div className={exercisesStyles.performanceDashboard}>
        <div className={exercisesStyles.dashboardHeader}>
          <h3 className={exercisesStyles.dashboardTitle}>Performance by Difficulty</h3>
        </div>
        <div className={exercisesStyles.performanceGrid}>
          <div className={`${exercisesStyles.performanceCard} ${exercisesStyles.easy}`}>
            <div className={`${exercisesStyles.performanceNumber} ${exercisesStyles.easy}`}>
              {performanceStats.easySolved}/{performanceStats.easyTotal}
            </div>
            <div className={exercisesStyles.performanceLabel}>Easy Problems</div>
            <div className={exercisesStyles.performanceProgress}>
              <div 
                className={`${exercisesStyles.performanceProgressFill} ${exercisesStyles.easy}`}
                style={{ width: `${performanceStats.easyTotal > 0 ? (performanceStats.easySolved / performanceStats.easyTotal) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
          
          <div className={`${exercisesStyles.performanceCard} ${exercisesStyles.medium}`}>
            <div className={`${exercisesStyles.performanceNumber} ${exercisesStyles.medium}`}>
              {performanceStats.mediumSolved}/{performanceStats.mediumTotal}
            </div>
            <div className={exercisesStyles.performanceLabel}>Medium Problems</div>
            <div className={exercisesStyles.performanceProgress}>
              <div 
                className={`${exercisesStyles.performanceProgressFill} ${exercisesStyles.medium}`}
                style={{ width: `${performanceStats.mediumTotal > 0 ? (performanceStats.mediumSolved / performanceStats.mediumTotal) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
          
          <div className={`${exercisesStyles.performanceCard} ${exercisesStyles.hard}`}>
            <div className={`${exercisesStyles.performanceNumber} ${exercisesStyles.hard}`}>
              {performanceStats.hardSolved}/{performanceStats.hardTotal}
            </div>
            <div className={exercisesStyles.performanceLabel}>Hard Problems</div>
            <div className={exercisesStyles.performanceProgress}>
              <div 
                className={`${exercisesStyles.performanceProgressFill} ${exercisesStyles.hard}`}
                style={{ width: `${performanceStats.hardTotal > 0 ? (performanceStats.hardSolved / performanceStats.hardTotal) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className={exercisesStyles.filtersSection}>
        <div className={exercisesStyles.searchBox}>
          <FiSearch className={exercisesStyles.searchIcon} />
          <input
            type="text"
            placeholder="Search exercises..."
            className={exercisesStyles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className={exercisesStyles.filterTabs}>
          <button 
            className={`${exercisesStyles.filterTab} ${filterStatus === 'all' ? exercisesStyles.active : ''}`}
            onClick={() => setFilterStatus('all')}
          >
            All
          </button>
          <button 
            className={`${exercisesStyles.filterTab} ${filterStatus === 'solved' ? exercisesStyles.active : ''}`}
            onClick={() => setFilterStatus('solved')}
          >
            Solved
          </button>
          <button 
            className={`${exercisesStyles.filterTab} ${filterStatus === 'attempted' ? exercisesStyles.active : ''}`}
            onClick={() => setFilterStatus('attempted')}
          >
            Attempted
          </button>
          <button 
            className={`${exercisesStyles.filterTab} ${filterStatus === 'new' ? exercisesStyles.active : ''}`}
            onClick={() => setFilterStatus('new')}
          >
            New
          </button>
        </div>

        <div className={exercisesStyles.sortDropdown}>
          <button className={exercisesStyles.sortButton}>
            <FiFilter />
            Sort by Difficulty
            <FiChevronDown />
          </button>
        </div>
      </div>

      {/* Categories Overview */}
      {exerciseData?.exerciseCategories && exerciseData.exerciseCategories.length > 0 && (
        <div className={exercisesStyles.categoriesSection}>
          <div className={exercisesStyles.categoriesHeader}>
            <h3 className={exercisesStyles.categoriesTitle}>Problem Categories</h3>
          </div>
          <div className={exercisesStyles.categoriesGrid}>
            {exerciseData.exerciseCategories.map((category: any) => (
              <div 
                key={category.id} 
                className={`${exercisesStyles.categoryCard} ${exercisesStyles[category.className]}`}
              >
                <div className={exercisesStyles.categoryIcon}>
                  {category.icon === 'FiLayers' && <FiLayers />}
                  {category.icon === 'FiCpu' && <FiCpu />}
                  {category.icon === 'FiCode' && <FiCode />}
                  {category.icon === 'FiGitBranch' && <FiGitBranch />}
                  {category.icon === 'FiZap' && <FiZap />}
                </div>
                <h4 className={exercisesStyles.categoryName}>{category.name}</h4>
                <p className={exercisesStyles.categoryProgress}>
                  {category.solved} of {category.total} problems solved
                </p>
                <div className={exercisesStyles.categoryProgressBar}>
                  <div 
                    className={`${exercisesStyles.categoryProgressFill} ${exercisesStyles[category.className]}`}
                    style={{ width: `${category.progress}%` }}
                  ></div>
                </div>
                <div className={exercisesStyles.categoryStats}>
                  <span>{category.progress}% Complete</span>
                  <span>{category.total - category.solved} remaining</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Exercises Grid - 2x Layout */}
      <div className={exercisesStyles.exercisesGrid}>
        {filteredExercises.length > 0 ? (
          filteredExercises.map((exercise: any) => (
            <div 
              key={exercise.id} 
              className={`${exercisesStyles.exerciseCard} ${exercisesStyles[exercise.status]}`}
            >
              {/* Card Header */}
              <div className={exercisesStyles.cardHeader}>
                <div className={exercisesStyles.cardHeaderLeft}>
                  <div className={`${exercisesStyles.categoryBadge} ${exercisesStyles[exercise.categoryClass]}`}>
                    {exercise.category}
                  </div>
                  <div className={`${exercisesStyles.difficultyBadge} ${exercisesStyles[exercise.difficulty]}`}>
                    {exercise.difficulty}
                  </div>
                </div>
                <div className={`${exercisesStyles.statusBadge} ${exercisesStyles[exercise.status]}`}>
                  {exercise.status === 'solved' ? '✅ Həll edildi' : 
                   exercise.status === 'attempted' ? '🔄 Cəhd edildi' : '🆕 Yeni'}
                </div>
              </div>

              {/* Card Content */}
              <div className={exercisesStyles.cardContent}>
                <h3 className={exercisesStyles.exerciseTitle}>
                  {exercise.title}
                </h3>
                <p className={exercisesStyles.exerciseDescription}>
                  {exercise.description}
                </p>

                {/* Exercise Stats */}
                <div className={exercisesStyles.exerciseStats}>
                  <div className={exercisesStyles.statItem}>
                    <FiClock className={exercisesStyles.statIcon} />
                    <span>{exercise.timeComplexity}</span>
                  </div>
                  <div className={exercisesStyles.statItem}>
                    <FiDatabase className={exercisesStyles.statIcon} />
                    <span>{exercise.spaceComplexity}</span>
                  </div>
                  <div className={exercisesStyles.statItem}>
                    <FiTarget className={exercisesStyles.statIcon} />
                    <span>{exercise.acceptanceRate}%</span>
                  </div>
                  <div className={exercisesStyles.statItem}>
                    <FiTrendingUp className={exercisesStyles.statIcon} />
                    <span>{exercise.averageTime}</span>
                  </div>
                </div>

                {/* Submission History */}
                {exercise.submissions && exercise.submissions.length > 0 && (
                  <div className={exercisesStyles.submissionSection}>
                    <div className={exercisesStyles.submissionTitle}>
                      Son cəhdlər
                    </div>
                    <div className={exercisesStyles.submissionList}>
                      {exercise.submissions.slice(0, 2).map((submission: any, index: number) => (
                        <div 
                          key={index} 
                          className={`${exercisesStyles.submissionItem} ${exercisesStyles[submission.status]}`}
                        >
                          <div className={exercisesStyles.submissionStatus}>
                            {submission.status === 'accepted' ? '✅' : '❌'}
                            <span>{submission.status === 'accepted' ? 'Uğurlu' : 'Uğursuz'}</span>
                          </div>
                          <div className={exercisesStyles.submissionTime}>
                            {submission.time}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <div className={exercisesStyles.actionSection}>
                  {exercise.status === 'new' ? (
                    <button className={`${exercisesStyles.actionButton} ${exercisesStyles.solveButton}`}>
                      <FiCode />
                      Həll Et
                    </button>
                  ) : exercise.status === 'attempted' ? (
                    <button className={`${exercisesStyles.actionButton} ${exercisesStyles.retryButton}`}>
                      <FiRefreshCw />
                      Yenidən Cəhd Et
                    </button>
                  ) : (
                    <button className={`${exercisesStyles.actionButton} ${exercisesStyles.reviewButton}`}>
                      <FiEye />
                      Yenidən Bax
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : exerciseData?.hasExercises ? (
          <div className={exercisesStyles.emptyState}>
            <FiCode size={48} style={{ opacity: 0.3, marginBottom: '16px' }} />
            <h3>Tapşırıq tapılmadı</h3>
            <p>Axtarış və ya filter kriteriyalarınızı dəyişdirin</p>
          </div>
        ) : (
          <div className={exercisesStyles.emptyState}>
            <div className={exercisesStyles.emptyStateIcon}>
              <FiCode size={64} />
            </div>
            <h3>Hələ heç bir tapşırıq həll etməmisiniz</h3>
            <p>İlk tapşırığınızı həll etməyə başlayın və burada görünəcək!</p>
            <div className={exercisesStyles.emptyStateActions}>
              <button className={`${exercisesStyles.actionButton} ${exercisesStyles.solveButton}`}>
                <FiCode />
                İlk Tapşırığı Həll Et
              </button>
              <button className={`${exercisesStyles.actionButton} ${exercisesStyles.viewSolutionButton}`}>
                <FiTarget />
                Tapşırıqları Gör
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 