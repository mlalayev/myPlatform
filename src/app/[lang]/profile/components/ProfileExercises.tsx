"use client";

import React from "react";
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
} from "react-icons/fi";
import exercisesStyles from "../ProfileExercises.module.css";

interface ProfileExercisesProps {
  userStats: any;
  loading: boolean;
}

export default function ProfileExercises({
  userStats,
  loading,
}: ProfileExercisesProps) {
  if (loading) {
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

  // Exercise categories with problem counts
  const exerciseCategories = [
    {
      id: "arrays",
      name: "Arrays & Lists",
      icon: <FiLayers />,
      solved: 12,
      total: 25,
      progress: 48,
      className: "arrays"
    },
    {
      id: "algorithms",
      name: "Algorithms",
      icon: <FiCpu />,
      solved: 8,
      total: 30,
      progress: 27,
      className: "algorithms"
    },
    {
      id: "strings",
      name: "String Manipulation",
      icon: <FiCode />,
      solved: 15,
      total: 20,
      progress: 75,
      className: "strings"
    },
    {
      id: "graphs",
      name: "Graph Theory",
      icon: <FiGitBranch />,
      solved: 5,
      total: 18,
      progress: 28,
      className: "graphs"
    },
    {
      id: "dynamic",
      name: "Dynamic Programming",
      icon: <FiZap />,
      solved: 3,
      total: 15,
      progress: 20,
      className: "dynamic"
    }
  ];

  // Sample exercises with detailed information
  const sampleExercises = [
    {
      id: 1,
      title: "Two Sum Problem",
      description: "Find two numbers in an array that add up to a specific target.",
      category: "Arrays & Lists",
      categoryClass: "arrays",
      difficulty: "easy",
      status: "solved",
      timeComplexity: "O(n)",
      spaceComplexity: "O(n)",
      acceptanceRate: 87,
      submissions: [
        { status: "accepted", time: "2 hours ago", runtime: "68ms" },
        { status: "wrong", time: "2 hours ago", runtime: "-" },
      ],
      lastAttempt: "2 hours ago",
      averageTime: "15 min"
    },
    {
      id: 2,
      title: "Binary Search Implementation",
      description: "Implement binary search algorithm to find element in sorted array.",
      category: "Algorithms",
      categoryClass: "algorithms",
      difficulty: "medium",
      status: "attempted",
      timeComplexity: "O(log n)",
      spaceComplexity: "O(1)",
      acceptanceRate: 72,
      submissions: [
        { status: "timeout", time: "1 day ago", runtime: "-" },
        { status: "wrong", time: "1 day ago", runtime: "-" },
      ],
      lastAttempt: "1 day ago",
      averageTime: "25 min"
    },
    {
      id: 3,
      title: "Longest Palindromic Substring",
      description: "Find the longest palindromic substring in a given string.",
      category: "String Manipulation",
      categoryClass: "strings",
      difficulty: "medium",
      status: "solved",
      timeComplexity: "O(n²)",
      spaceComplexity: "O(1)",
      acceptanceRate: 65,
      submissions: [
        { status: "accepted", time: "3 days ago", runtime: "124ms" },
        { status: "accepted", time: "3 days ago", runtime: "156ms" },
        { status: "wrong", time: "3 days ago", runtime: "-" },
      ],
      lastAttempt: "3 days ago",
      averageTime: "45 min"
    },
    {
      id: 4,
      title: "Graph Traversal DFS",
      description: "Implement depth-first search traversal for graph data structure.",
      category: "Graph Theory",
      categoryClass: "graphs",
      difficulty: "hard",
      status: "new",
      timeComplexity: "O(V + E)",
      spaceComplexity: "O(V)",
      acceptanceRate: 58,
      submissions: [],
      lastAttempt: null,
      averageTime: "60 min"
    },
    {
      id: 5,
      title: "Fibonacci Dynamic Programming",
      description: "Solve Fibonacci sequence using dynamic programming approach.",
      category: "Dynamic Programming",
      categoryClass: "dynamic",
      difficulty: "easy",
      status: "solved",
      timeComplexity: "O(n)",
      spaceComplexity: "O(n)",
      acceptanceRate: 89,
      submissions: [
        { status: "accepted", time: "1 week ago", runtime: "42ms" },
      ],
      lastAttempt: "1 week ago",
      averageTime: "20 min"
    },
    {
      id: 6,
      title: "Merge K Sorted Lists",
      description: "Merge k sorted linked lists and return it as one sorted list.",
      category: "Arrays & Lists",
      categoryClass: "arrays",
      difficulty: "hard",
      status: "attempted",
      timeComplexity: "O(n log k)",
      spaceComplexity: "O(1)",
      acceptanceRate: 43,
      submissions: [
        { status: "wrong", time: "2 weeks ago", runtime: "-" },
        { status: "timeout", time: "2 weeks ago", runtime: "-" },
      ],
      lastAttempt: "2 weeks ago",
      averageTime: "75 min"
    }
  ];

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

  // Calculate performance stats
  const totalSolved = exerciseCategories.reduce((acc, cat) => acc + cat.solved, 0);
  const totalExercises = exerciseCategories.reduce((acc, cat) => acc + cat.total, 0);
  const easySolved = sampleExercises.filter(ex => ex.difficulty === 'easy' && ex.status === 'solved').length;
  const mediumSolved = sampleExercises.filter(ex => ex.difficulty === 'medium' && ex.status === 'solved').length;
  const hardSolved = sampleExercises.filter(ex => ex.difficulty === 'hard' && ex.status === 'solved').length;
  const easyTotal = sampleExercises.filter(ex => ex.difficulty === 'easy').length;
  const mediumTotal = sampleExercises.filter(ex => ex.difficulty === 'medium').length;
  const hardTotal = sampleExercises.filter(ex => ex.difficulty === 'hard').length;

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
                  {totalSolved}
                </span>
                <span className={exercisesStyles.statLabel}>Solved</span>
              </div>
              <div className={exercisesStyles.statItem}>
                <span className={exercisesStyles.statNumber}>
                  {Math.round((totalSolved / totalExercises) * 100)}%
                </span>
                <span className={exercisesStyles.statLabel}>Success Rate</span>
              </div>
              <div className={exercisesStyles.statItem}>
                <span className={exercisesStyles.statNumber}>
                  {userStats?.studyTimeHours || 0}h
                </span>
                <span className={exercisesStyles.statLabel}>Code Time</span>
              </div>
              <div className={exercisesStyles.statItem}>
                <span className={exercisesStyles.statNumber}>
                  {sampleExercises.filter(ex => ex.lastAttempt && ex.lastAttempt.includes('hour')).length}
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
              {easySolved}/{easyTotal}
            </div>
            <div className={exercisesStyles.performanceLabel}>Easy Problems</div>
            <div className={exercisesStyles.performanceProgress}>
              <div 
                className={`${exercisesStyles.performanceProgressFill} ${exercisesStyles.easy}`}
                style={{ width: `${(easySolved / easyTotal) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <div className={`${exercisesStyles.performanceCard} ${exercisesStyles.medium}`}>
            <div className={`${exercisesStyles.performanceNumber} ${exercisesStyles.medium}`}>
              {mediumSolved}/{mediumTotal}
            </div>
            <div className={exercisesStyles.performanceLabel}>Medium Problems</div>
            <div className={exercisesStyles.performanceProgress}>
              <div 
                className={`${exercisesStyles.performanceProgressFill} ${exercisesStyles.medium}`}
                style={{ width: `${(mediumSolved / mediumTotal) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <div className={`${exercisesStyles.performanceCard} ${exercisesStyles.hard}`}>
            <div className={`${exercisesStyles.performanceNumber} ${exercisesStyles.hard}`}>
              {hardSolved}/{hardTotal}
            </div>
            <div className={exercisesStyles.performanceLabel}>Hard Problems</div>
            <div className={exercisesStyles.performanceProgress}>
              <div 
                className={`${exercisesStyles.performanceProgressFill} ${exercisesStyles.hard}`}
                style={{ width: `${(hardSolved / hardTotal) * 100}%` }}
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
          />
        </div>
        
        <div className={exercisesStyles.filterTabs}>
          <button className={`${exercisesStyles.filterTab} ${exercisesStyles.active}`}>
            All
          </button>
          <button className={exercisesStyles.filterTab}>Solved</button>
          <button className={exercisesStyles.filterTab}>Attempted</button>
          <button className={exercisesStyles.filterTab}>New</button>
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
      <div className={exercisesStyles.categoriesSection}>
        <div className={exercisesStyles.categoriesHeader}>
          <h3 className={exercisesStyles.categoriesTitle}>Problem Categories</h3>
        </div>
        <div className={exercisesStyles.categoriesGrid}>
          {exerciseCategories.map((category) => (
            <div 
              key={category.id} 
              className={`${exercisesStyles.categoryCard} ${exercisesStyles[category.className]}`}
            >
              <div className={exercisesStyles.categoryIcon}>
                {category.icon}
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

      {/* Exercises Grid */}
      <div className={exercisesStyles.exercisesGrid}>
        {sampleExercises.map((exercise) => (
          <div 
            key={exercise.id} 
            className={`${exercisesStyles.exerciseCard} ${exercisesStyles[exercise.status]}`}
          >
            <div className={`${exercisesStyles.exerciseHeader} ${exercisesStyles[exercise.difficulty]}`}>
              <div className={exercisesStyles.exerciseMeta}>
                <div className={exercisesStyles.exerciseInfo}>
                  <div className={exercisesStyles.exerciseCategory}>
                    {exercise.category}
                  </div>
                  <h3 className={exercisesStyles.exerciseTitle}>
                    {exercise.title}
                  </h3>
                  <p className={exercisesStyles.exerciseDescription}>
                    {exercise.description}
                  </p>
                </div>
                <div className={`${exercisesStyles.exerciseStatus} ${exercisesStyles[exercise.status]}`}>
                  {getStatusIcon(exercise.status)}
                  {exercise.status === 'solved' ? 'Solved' : 
                   exercise.status === 'attempted' ? 'Attempted' : 'New'}
                </div>
              </div>
            </div>

            <div className={exercisesStyles.exerciseContent}>
              <div className={exercisesStyles.exerciseMetrics}>
                <div className={exercisesStyles.metricsGrid}>
                  <div className={exercisesStyles.metricItem}>
                    <FiClock className={exercisesStyles.metricIcon} />
                    <span className={exercisesStyles.metricValue}>
                      Time: {exercise.timeComplexity}
                    </span>
                  </div>
                  <div className={exercisesStyles.metricItem}>
                    <FiDatabase className={exercisesStyles.metricIcon} />
                    <span className={exercisesStyles.metricValue}>
                      Space: {exercise.spaceComplexity}
                    </span>
                  </div>
                  <div className={exercisesStyles.metricItem}>
                    <FiTarget className={exercisesStyles.metricIcon} />
                    <span className={exercisesStyles.metricValue}>
                      Acceptance: {exercise.acceptanceRate}%
                    </span>
                  </div>
                  <div className={exercisesStyles.metricItem}>
                    <FiTrendingUp className={exercisesStyles.metricIcon} />
                    <span className={exercisesStyles.metricValue}>
                      Avg: {exercise.averageTime}
                    </span>
                  </div>
                </div>
                
                <div className={exercisesStyles.difficultyLevel}>
                  <span>Difficulty:</span>
                  <div className={exercisesStyles.difficultyDots}>
                    {getDifficultyDots(exercise.difficulty)}
                  </div>
                  <span style={{ 
                    color: exercise.difficulty === 'easy' ? '#48bb78' : 
                           exercise.difficulty === 'medium' ? '#ed8936' : '#e53e3e',
                    fontWeight: 600,
                    textTransform: 'capitalize'
                  }}>
                    {exercise.difficulty}
                  </span>
                </div>
              </div>

              {exercise.submissions.length > 0 && (
                <div className={exercisesStyles.submissionHistory}>
                  <div className={exercisesStyles.submissionLabel}>
                    Recent Submissions
                  </div>
                  <div className={exercisesStyles.submissionsList}>
                    {exercise.submissions.slice(0, 3).map((submission, index) => (
                      <div 
                        key={index} 
                        className={`${exercisesStyles.submissionItem} ${exercisesStyles[submission.status]}`}
                      >
                        <div className={exercisesStyles.submissionInfo}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {getSubmissionStatusIcon(submission.status)}
                            <span className={`${exercisesStyles.submissionStatus} ${exercisesStyles[submission.status]}`}>
                              {submission.status === 'accepted' ? 'Accepted' :
                               submission.status === 'wrong' ? 'Wrong Answer' : 'Time Limit'}
                            </span>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                            <span className={exercisesStyles.submissionTime}>
                              {submission.time}
                            </span>
                            {submission.runtime && submission.runtime !== '-' && (
                              <span style={{ fontSize: '0.7rem', color: '#a0aec0' }}>
                                {submission.runtime}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className={exercisesStyles.exerciseActions}>
                {getActionButton(exercise)}
                {exercise.status === 'solved' && (
                  <button className={`${exercisesStyles.actionButton} ${exercisesStyles.viewSolutionButton}`}>
                    <FiEye />
                    Solution
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 