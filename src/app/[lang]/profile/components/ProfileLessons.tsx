"use client";

import React from "react";
import {
  FiSearch,
  FiFilter,
  FiChevronDown,
  FiPlay,
  FiBookmark,
  FiTrendingUp,
  FiCode,
  FiDatabase,
  FiCpu,
  FiHash,
  FiClock,
  FiBookOpen,
  FiCheckCircle,
  FiArrowRight,
  FiEye,
} from "react-icons/fi";
import lessonsStyles from "../ProfileLessons.module.css";

interface ProfileLessonsProps {
  userStats: any;
  loading: boolean;
}

export default function ProfileLessons({
  userStats,
  loading,
}: ProfileLessonsProps) {
  if (loading) {
    return (
      <div className={lessonsStyles.lessonsContainer}>
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
            <span style={{ color: '#718096' }}>Loading your lessons...</span>
          </div>
        </div>
      </div>
    );
  }

  const lessonCategories = [
    {
      id: "javascript",
      name: "JavaScript",
      icon: <FiCode />,
      progress: 75,
      completed: 15,
      total: 20,
      className: "javascript"
    },
    {
      id: "python",
      name: "Python",
      icon: <FiDatabase />,
      progress: 40,
      completed: 8,
      total: 20,
      className: "python"
    },
    {
      id: "cpp",
      name: "C++",
      icon: <FiCpu />,
      progress: 60,
      completed: 12,
      total: 20,
      className: "cpp"
    },
    {
      id: "algorithms",
      name: "Algorithms",
      icon: <FiHash />,
      progress: 30,
      completed: 6,
      total: 20,
      className: "algorithms"
    }
  ];

  const sampleLessons = [
    {
      id: 1,
      title: "JavaScript Fundamentals",
      description: "Learn the basics of JavaScript including variables, functions, and control structures.",
      category: "JavaScript",
      categoryClass: "javascript",
      status: "completed",
      progress: 100,
      duration: "45 min",
      difficulty: "easy",
      lessons: 12,
      exercises: 8,
      bookmarked: true
    },
    {
      id: 2,
      title: "Async Programming with Promises",
      description: "Master asynchronous JavaScript with Promises, async/await, and error handling.",
      category: "JavaScript",
      categoryClass: "javascript",
      status: "inProgress",
      progress: 65,
      duration: "60 min",
      difficulty: "medium",
      lessons: 10,
      exercises: 6,
      bookmarked: false
    },
    {
      id: 3,
      title: "Python Data Structures",
      description: "Explore lists, tuples, dictionaries, and sets in Python programming.",
      category: "Python",
      categoryClass: "python",
      status: "notStarted",
      progress: 0,
      duration: "50 min",
      difficulty: "easy",
      lessons: 8,
      exercises: 5,
      bookmarked: true
    },
    {
      id: 4,
      title: "C++ Memory Management",
      description: "Deep dive into pointers, references, and dynamic memory allocation in C++.",
      category: "C++",
      categoryClass: "cpp",
      status: "inProgress",
      progress: 35,
      duration: "75 min",
      difficulty: "hard",
      lessons: 15,
      exercises: 12,
      bookmarked: false
    },
    {
      id: 5,
      title: "Graph Algorithms",
      description: "Learn BFS, DFS, Dijkstra's algorithm, and other essential graph algorithms.",
      category: "Algorithms",
      categoryClass: "algorithms",
      status: "completed",
      progress: 100,
      duration: "90 min",
      difficulty: "hard",
      lessons: 18,
      exercises: 15,
      bookmarked: true
    },
    {
      id: 6,
      title: "Dynamic Programming Basics",
      description: "Introduction to dynamic programming with classic problems and solutions.",
      category: "Algorithms",
      categoryClass: "algorithms",
      status: "notStarted",
      progress: 0,
      duration: "80 min",
      difficulty: "medium",
      lessons: 14,
      exercises: 10,
      bookmarked: false
    }
  ];

  const getDifficultyDots = (difficulty: string) => {
    const levels: { [key: string]: number } = { easy: 1, medium: 2, hard: 3 };
    const level = levels[difficulty] || 1;
    
    return Array.from({ length: 3 }, (_, i) => (
      <div
        key={i}
        className={`${lessonsStyles.difficultyDot} ${
          i < level ? `${lessonsStyles.filled} ${lessonsStyles[difficulty]}` : ''
        }`}
      ></div>
    ));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <FiCheckCircle />;
      case 'inProgress':
        return <FiPlay />;
      default:
        return <FiBookOpen />;
    }
  };

  const getActionButton = (lesson: any) => {
    switch (lesson.status) {
      case 'completed':
        return (
          <button className={`${lessonsStyles.actionButton} ${lessonsStyles.reviewButton}`}>
            <FiEye />
            Review
          </button>
        );
      case 'inProgress':
        return (
          <button className={`${lessonsStyles.actionButton} ${lessonsStyles.continueButton}`}>
            <FiPlay />
            Continue
          </button>
        );
      default:
        return (
          <button className={`${lessonsStyles.actionButton} ${lessonsStyles.startButton}`}>
            <FiArrowRight />
            Start
          </button>
        );
    }
  };

  return (
    <div className={lessonsStyles.lessonsContainer}>
      {/* Hero Section */}
      <div className={lessonsStyles.lessonsHero}>
        <div className={lessonsStyles.heroContent}>
          <div className={lessonsStyles.heroLeft}>
            <h1 className={lessonsStyles.heroTitle}>My Lessons</h1>
            <p className={lessonsStyles.heroSubtitle}>
              Continue your learning journey with personalized lessons and track your progress
            </p>
            <div className={lessonsStyles.heroActions}>
              <button className={`${lessonsStyles.heroButton} ${lessonsStyles.primary}`}>
                <FiPlay />
                Continue Learning
              </button>
              <button className={lessonsStyles.heroButton}>
                <FiBookmark />
                Bookmarked
              </button>
              <button className={lessonsStyles.heroButton}>
                <FiTrendingUp />
                Progress
              </button>
            </div>
          </div>
          <div className={lessonsStyles.heroRight}>
            <div className={lessonsStyles.lessonStats}>
              <div className={lessonsStyles.statItem}>
                <span className={lessonsStyles.statLabel}>Completed</span>
                <span className={lessonsStyles.statValue}>
                  {userStats?.completedLessons || 0}
                </span>
              </div>
              <div className={lessonsStyles.statItem}>
                <span className={lessonsStyles.statLabel}>In Progress</span>
                <span className={lessonsStyles.statValue}>3</span>
              </div>
              <div className={lessonsStyles.statItem}>
                <span className={lessonsStyles.statLabel}>Total Time</span>
                <span className={lessonsStyles.statValue}>
                  {userStats?.studyTimeHours || 0}h
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className={lessonsStyles.filtersSection}>
        <div className={lessonsStyles.searchBox}>
          <FiSearch className={lessonsStyles.searchIcon} />
          <input
            type="text"
            placeholder="Search lessons..."
            className={lessonsStyles.searchInput}
          />
        </div>
        
        <div className={lessonsStyles.filterTabs}>
          <button className={`${lessonsStyles.filterTab} ${lessonsStyles.active}`}>
            All
          </button>
          <button className={lessonsStyles.filterTab}>Completed</button>
          <button className={lessonsStyles.filterTab}>In Progress</button>
          <button className={lessonsStyles.filterTab}>Bookmarked</button>
        </div>

        <div className={lessonsStyles.sortDropdown}>
          <button className={lessonsStyles.sortButton}>
            <FiFilter />
            Sort by Progress
            <FiChevronDown />
          </button>
        </div>
      </div>

      {/* Categories Overview */}
      <div className={lessonsStyles.categoriesSection}>
        <div className={lessonsStyles.categoriesHeader}>
          <h3 className={lessonsStyles.categoriesTitle}>Learning Categories</h3>
        </div>
        <div className={lessonsStyles.categoriesGrid}>
          {lessonCategories.map((category) => (
            <div 
              key={category.id} 
              className={`${lessonsStyles.categoryCard} ${lessonsStyles[category.className]}`}
            >
              <div className={lessonsStyles.categoryIcon}>
                {category.icon}
              </div>
              <h4 className={lessonsStyles.categoryName}>{category.name}</h4>
              <p className={lessonsStyles.categoryProgress}>
                {category.completed} of {category.total} lessons completed
              </p>
              <div className={lessonsStyles.categoryProgressBar}>
                <div 
                  className={`${lessonsStyles.categoryProgressFill} ${lessonsStyles[category.className]}`}
                  style={{ width: `${category.progress}%` }}
                ></div>
              </div>
              <div className={lessonsStyles.categoryStats}>
                <span>{category.progress}% Complete</span>
                <span>{category.total - category.completed} remaining</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lessons Grid */}
      <div className={lessonsStyles.lessonsGrid}>
        {sampleLessons.map((lesson) => (
          <div 
            key={lesson.id} 
            className={`${lessonsStyles.lessonCard} ${lessonsStyles[lesson.status]}`}
          >
            <div className={`${lessonsStyles.lessonHeader} ${lessonsStyles[lesson.categoryClass]}`}>
              <div className={lessonsStyles.lessonMeta}>
                <div className={lessonsStyles.lessonInfo}>
                  <div className={lessonsStyles.lessonCategory}>
                    {lesson.category}
                  </div>
                  <h3 className={lessonsStyles.lessonTitle}>
                    {lesson.title}
                  </h3>
                  <p className={lessonsStyles.lessonDescription}>
                    {lesson.description}
                  </p>
                </div>
                <div className={`${lessonsStyles.lessonStatus} ${lessonsStyles[lesson.status]}`}>
                  {getStatusIcon(lesson.status)}
                  {lesson.status === 'completed' ? 'Completed' : 
                   lesson.status === 'inProgress' ? 'In Progress' : 'Start'}
                </div>
              </div>
            </div>

            <div className={lessonsStyles.lessonContent}>
              <div className={lessonsStyles.lessonProgress}>
                <div className={lessonsStyles.progressLabel}>
                  <span className={lessonsStyles.progressText}>Progress</span>
                  <span className={lessonsStyles.progressPercent}>
                    {lesson.progress}%
                  </span>
                </div>
                <div className={lessonsStyles.progressBar}>
                  <div 
                    className={`${lessonsStyles.progressFill} ${lessonsStyles[lesson.status]}`}
                    style={{ width: `${lesson.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className={lessonsStyles.lessonDetails}>
                <div className={lessonsStyles.lessonStats}>
                  <div className={lessonsStyles.lessonStat}>
                    <FiClock className={lessonsStyles.statIcon} />
                    {lesson.duration}
                  </div>
                  <div className={lessonsStyles.lessonStat}>
                    <FiBookOpen className={lessonsStyles.statIcon} />
                    {lesson.lessons} lessons
                  </div>
                  <div className={lessonsStyles.lessonStat}>
                    <FiCode className={lessonsStyles.statIcon} />
                    {lesson.exercises} exercises
                  </div>
                </div>
                
                <div className={lessonsStyles.lessonDifficulty}>
                  <span>Difficulty</span>
                  <div className={lessonsStyles.difficultyDots}>
                    {getDifficultyDots(lesson.difficulty)}
                  </div>
                </div>
              </div>

              <div className={lessonsStyles.lessonActions}>
                {getActionButton(lesson)}
                <button 
                  className={`${lessonsStyles.bookmarkButton} ${
                    lesson.bookmarked ? lessonsStyles.bookmarked : ''
                  }`}
                >
                  <FiBookmark />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 