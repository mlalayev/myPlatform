"use client";

import React from "react";
import {
  FiTarget,
  FiPlus,
  FiEdit,
  FiCheck,
  FiTrash2,
  FiEye,
  FiCalendar,
  FiClock,
  FiTrendingUp,
  FiAward,
  FiCode,
  FiBookOpen,
  FiLayers,
  FiZap,
  FiStar,
  FiFlag,
  FiCheckCircle,
  FiCircle,
} from "react-icons/fi";
import goalsStyles from "../ProfileGoals.module.css";

interface ProfileGoalsProps {
  userStats: any;
  loading: boolean;
}

export default function ProfileGoals({
  userStats,
  loading,
}: ProfileGoalsProps) {
  if (loading) {
    return (
      <div className={goalsStyles.goalsContainer}>
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
            <span style={{ color: '#718096' }}>Loading your goals...</span>
          </div>
        </div>
      </div>
    );
  }

  // Goal categories with progress tracking
  const goalCategories = [
    {
      id: "programming",
      name: "Programming Languages",
      icon: <FiCode />,
      completed: 3,
      total: 8,
      progress: 38,
      className: "programming"
    },
    {
      id: "language",
      name: "Language Learning",
      icon: <FiBookOpen />,
      completed: 1,
      total: 3,
      progress: 33,
      className: "language"
    },
    {
      id: "framework",
      name: "Frameworks & Tools",
      icon: <FiLayers />,
      completed: 2,
      total: 5,
      progress: 40,
      className: "framework"
    },
    {
      id: "project",
      name: "Personal Projects",
      icon: <FiZap />,
      completed: 1,
      total: 4,
      progress: 25,
      className: "project"
    },
    {
      id: "certification",
      name: "Certifications",
      icon: <FiAward />,
      completed: 0,
      total: 2,
      progress: 0,
      className: "certification"
    }
  ];

  // Sample learning goals with detailed information
  const sampleGoals = [
    {
      id: 1,
      title: "Master React.js Framework",
      description: "Complete React.js course and build 3 real-world projects to become proficient in modern web development.",
      category: "Frameworks & Tools",
      categoryClass: "framework",
      status: "active",
      progress: 65,
      deadline: "2024-03-15",
      daysLeft: 45,
      priority: "high",
      milestones: [
        { id: 1, text: "Complete React fundamentals course", completed: true },
        { id: 2, text: "Build a todo app with React hooks", completed: true },
        { id: 3, text: "Create an e-commerce dashboard", completed: false },
        { id: 4, text: "Deploy portfolio website", completed: false },
        { id: 5, text: "Contribute to open source project", completed: false }
      ],
      timeSpent: "28 hours",
      estimatedTime: "60 hours",
      difficulty: "medium"
    },
    {
      id: 2,
      title: "Learn Python for Data Science",
      description: "Master Python programming language and essential data science libraries for machine learning projects.",
      category: "Programming Languages",
      categoryClass: "programming",
      status: "completed",
      progress: 100,
      deadline: "2024-01-20",
      daysLeft: -5,
      priority: "high",
      milestones: [
        { id: 1, text: "Complete Python basics", completed: true },
        { id: 2, text: "Learn NumPy and Pandas", completed: true },
        { id: 3, text: "Master Matplotlib and Seaborn", completed: true },
        { id: 4, text: "Build data visualization project", completed: true },
        { id: 5, text: "Complete final assessment", completed: true }
      ],
      timeSpent: "85 hours",
      estimatedTime: "80 hours",
      difficulty: "medium"
    },
    {
      id: 3,
      title: "Improve English Speaking Skills",
      description: "Enhance English speaking fluency through daily practice and conversation with native speakers.",
      category: "Language Learning",
      categoryClass: "language",
      status: "active",
      progress: 40,
      deadline: "2024-04-30",
      daysLeft: 90,
      priority: "medium",
      milestones: [
        { id: 1, text: "Join English conversation club", completed: true },
        { id: 2, text: "Practice daily for 30 minutes", completed: true },
        { id: 3, text: "Complete pronunciation course", completed: false },
        { id: 4, text: "Give presentation in English", completed: false },
        { id: 5, text: "Pass IELTS speaking test", completed: false }
      ],
      timeSpent: "45 hours",
      estimatedTime: "120 hours",
      difficulty: "hard"
    },
    {
      id: 4,
      title: "Build Full-Stack Web Application",
      description: "Create a complete web application using modern technologies and deploy it to production.",
      category: "Personal Projects",
      categoryClass: "project",
      status: "overdue",
      progress: 30,
      deadline: "2024-02-01",
      daysLeft: -20,
      priority: "high",
      milestones: [
        { id: 1, text: "Design database schema", completed: true },
        { id: 2, text: "Create backend API", completed: true },
        { id: 3, text: "Build frontend interface", completed: false },
        { id: 4, text: "Implement authentication", completed: false },
        { id: 5, text: "Deploy to cloud platform", completed: false }
      ],
      timeSpent: "35 hours",
      estimatedTime: "100 hours",
      difficulty: "hard"
    },
    {
      id: 5,
      title: "Learn TypeScript Fundamentals",
      description: "Master TypeScript basics and advanced features for better JavaScript development.",
      category: "Programming Languages",
      categoryClass: "programming",
      status: "active",
      progress: 75,
      deadline: "2024-03-01",
      daysLeft: 30,
      priority: "medium",
      milestones: [
        { id: 1, text: "Complete TypeScript basics", completed: true },
        { id: 2, text: "Learn interfaces and types", completed: true },
        { id: 3, text: "Master generics", completed: true },
        { id: 4, text: "Build TypeScript project", completed: false },
        { id: 5, text: "Migrate existing JS project", completed: false }
      ],
      timeSpent: "22 hours",
      estimatedTime: "40 hours",
      difficulty: "easy"
    },
    {
      id: 6,
      title: "AWS Cloud Practitioner Certification",
      description: "Prepare for and pass the AWS Cloud Practitioner certification exam.",
      category: "Certifications",
      categoryClass: "certification",
      status: "active",
      progress: 15,
      deadline: "2024-05-15",
      daysLeft: 105,
      priority: "low",
      milestones: [
        { id: 1, text: "Study AWS fundamentals", completed: true },
        { id: 2, text: "Complete practice exams", completed: false },
        { id: 3, text: "Review exam objectives", completed: false },
        { id: 4, text: "Schedule exam date", completed: false },
        { id: 5, text: "Pass certification exam", completed: false }
      ],
      timeSpent: "8 hours",
      estimatedTime: "60 hours",
      difficulty: "medium"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <FiTarget />;
      case 'completed':
        return <FiCheckCircle />;
      case 'overdue':
        return <FiFlag />;
      default:
        return <FiCircle />;
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <FiStar style={{ color: '#e53e3e' }} />;
      case 'medium':
        return <FiStar style={{ color: '#ed8936' }} />;
      case 'low':
        return <FiStar style={{ color: '#48bb78' }} />;
      default:
        return <FiStar />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return '#48bb78';
      case 'medium':
        return '#ed8936';
      case 'hard':
        return '#e53e3e';
      default:
        return '#718096';
    }
  };

  const getActionButton = (goal: any) => {
    switch (goal.status) {
      case 'completed':
        return (
          <button className={`${goalsStyles.actionButton} ${goalsStyles.viewButton}`}>
            <FiEye />
            View Details
          </button>
        );
      case 'overdue':
        return (
          <button className={`${goalsStyles.actionButton} ${goalsStyles.editButton}`}>
            <FiEdit />
            Update Goal
          </button>
        );
      default:
        return (
          <button className={`${goalsStyles.actionButton} ${goalsStyles.completeButton}`}>
            <FiCheck />
            Mark Complete
          </button>
        );
    }
  };

  // Calculate goal statistics
  const totalGoals = sampleGoals.length;
  const activeGoals = sampleGoals.filter(goal => goal.status === 'active').length;
  const completedGoals = sampleGoals.filter(goal => goal.status === 'completed').length;
  const overdueGoals = sampleGoals.filter(goal => goal.status === 'overdue').length;
  const totalProgress = Math.round(sampleGoals.reduce((acc, goal) => acc + goal.progress, 0) / totalGoals);

  return (
    <div className={goalsStyles.goalsContainer}>
      {/* Hero Section */}
      <div className={goalsStyles.goalsHero}>
        <div className={goalsStyles.heroContent}>
          <div className={goalsStyles.heroLeft}>
            <h1 className={goalsStyles.heroTitle}>Learning Goals</h1>
            <p className={goalsStyles.heroSubtitle}>
              Set, track, and achieve your learning objectives with detailed progress monitoring and milestone management
            </p>
            <div className={goalsStyles.heroActions}>
              <button className={`${goalsStyles.heroButton} ${goalsStyles.primary}`}>
                <FiPlus />
                Add New Goal
              </button>
              <button className={goalsStyles.heroButton}>
                <FiTrendingUp />
                View Analytics
              </button>
              <button className={goalsStyles.heroButton}>
                <FiAward />
                Achievements
              </button>
            </div>
          </div>
          <div className={goalsStyles.heroRight}>
            <div className={goalsStyles.goalsStats}>
              <div className={goalsStyles.statItem}>
                <span className={goalsStyles.statNumber}>
                  {activeGoals}
                </span>
                <span className={goalsStyles.statLabel}>Active</span>
              </div>
              <div className={goalsStyles.statItem}>
                <span className={goalsStyles.statNumber}>
                  {completedGoals}
                </span>
                <span className={goalsStyles.statLabel}>Completed</span>
              </div>
              <div className={goalsStyles.statItem}>
                <span className={goalsStyles.statNumber}>
                  {totalProgress}%
                </span>
                <span className={goalsStyles.statLabel}>Progress</span>
              </div>
              <div className={goalsStyles.statItem}>
                <span className={goalsStyles.statNumber}>
                  {overdueGoals}
                </span>
                <span className={goalsStyles.statLabel}>Overdue</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Goals Overview */}
      <div className={goalsStyles.goalsOverview}>
        <div className={goalsStyles.overviewHeader}>
          <h3 className={goalsStyles.overviewTitle}>Goals Progress Overview</h3>
        </div>
        <div className={goalsStyles.goalsProgress}>
          <div className={`${goalsStyles.progressCard} ${goalsStyles.active}`}>
            <div className={`${goalsStyles.progressNumber} ${goalsStyles.active}`}>
              {activeGoals}
            </div>
            <div className={goalsStyles.progressLabel}>Active Goals</div>
            <div className={goalsStyles.progressBar}>
              <div 
                className={`${goalsStyles.progressBarFill} ${goalsStyles.active}`}
                style={{ width: `${(activeGoals / totalGoals) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <div className={`${goalsStyles.progressCard} ${goalsStyles.completed}`}>
            <div className={`${goalsStyles.progressNumber} ${goalsStyles.completed}`}>
              {completedGoals}
            </div>
            <div className={goalsStyles.progressLabel}>Completed Goals</div>
            <div className={goalsStyles.progressBar}>
              <div 
                className={`${goalsStyles.progressBarFill} ${goalsStyles.completed}`}
                style={{ width: `${(completedGoals / totalGoals) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <div className={`${goalsStyles.progressCard} ${goalsStyles.overdue}`}>
            <div className={`${goalsStyles.progressNumber} ${goalsStyles.overdue}`}>
              {overdueGoals}
            </div>
            <div className={goalsStyles.progressLabel}>Overdue Goals</div>
            <div className={goalsStyles.progressBar}>
              <div 
                className={`${goalsStyles.progressBarFill} ${goalsStyles.overdue}`}
                style={{ width: `${(overdueGoals / totalGoals) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Goal Categories */}
      <div className={goalsStyles.goalCategories}>
        <div className={goalsStyles.categoriesHeader}>
          <h3 className={goalsStyles.categoriesTitle}>Goal Categories</h3>
        </div>
        <div className={goalsStyles.categoriesGrid}>
          {goalCategories.map((category) => (
            <div 
              key={category.id} 
              className={`${goalsStyles.categoryCard} ${goalsStyles[category.className]}`}
            >
              <div className={goalsStyles.categoryIcon}>
                {category.icon}
              </div>
              <h4 className={goalsStyles.categoryName}>{category.name}</h4>
              <p className={goalsStyles.categoryProgress}>
                {category.completed} of {category.total} goals completed
              </p>
              <div className={goalsStyles.categoryProgressBar}>
                <div 
                  className={`${goalsStyles.categoryProgressFill} ${goalsStyles[category.className]}`}
                  style={{ width: `${category.progress}%` }}
                ></div>
              </div>
              <div className={goalsStyles.categoryStats}>
                <span>{category.progress}% Complete</span>
                <span>{category.total - category.completed} remaining</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Goals Grid */}
      <div className={goalsStyles.goalsGrid}>
        {sampleGoals.map((goal) => (
          <div 
            key={goal.id} 
            className={`${goalsStyles.goalCard} ${goalsStyles[goal.status]}`}
          >
            <div className={`${goalsStyles.goalHeader} ${goalsStyles[goal.status]}`}>
              <div className={goalsStyles.goalMeta}>
                <div className={goalsStyles.goalInfo}>
                  <div className={goalsStyles.goalCategory}>
                    {goal.category}
                  </div>
                  <h3 className={goalsStyles.goalTitle}>
                    {goal.title}
                  </h3>
                  <p className={goalsStyles.goalDescription}>
                    {goal.description}
                  </p>
                </div>
                <div className={`${goalsStyles.goalStatus} ${goalsStyles[goal.status]}`}>
                  {getStatusIcon(goal.status)}
                  {goal.status === 'active' ? 'Active' : 
                   goal.status === 'completed' ? 'Completed' : 'Overdue'}
                </div>
              </div>
            </div>

            <div className={goalsStyles.goalContent}>
              <div className={goalsStyles.goalProgress}>
                <div className={goalsStyles.progressInfo}>
                  <span className={goalsStyles.progressText}>Progress</span>
                  <span className={goalsStyles.progressPercentage}>
                    {goal.progress}%
                  </span>
                </div>
                <div className={goalsStyles.goalProgressBar}>
                  <div 
                    className={`${goalsStyles.goalProgressBarFill} ${goalsStyles[goal.status]}`}
                    style={{ width: `${goal.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className={goalsStyles.goalMetrics}>
                <div className={goalsStyles.metricItem}>
                  <FiCalendar className={goalsStyles.metricIcon} />
                  <span className={goalsStyles.metricValue}>
                    {goal.daysLeft > 0 ? `${goal.daysLeft} days left` : 
                     goal.daysLeft < 0 ? `${Math.abs(goal.daysLeft)} days overdue` : 'Due today'}
                  </span>
                </div>
                <div className={goalsStyles.metricItem}>
                  <FiClock className={goalsStyles.metricIcon} />
                  <span className={goalsStyles.metricValue}>
                    {goal.timeSpent} / {goal.estimatedTime}
                  </span>
                </div>
                <div className={goalsStyles.metricItem}>
                  {getPriorityIcon(goal.priority)}
                  <span className={goalsStyles.metricValue}>
                    {goal.priority} priority
                  </span>
                </div>
                <div className={goalsStyles.metricItem}>
                  <FiTarget className={goalsStyles.metricIcon} />
                  <span className={goalsStyles.metricValue}>
                    <span style={{ color: getDifficultyColor(goal.difficulty) }}>
                      {goal.difficulty}
                    </span>
                  </span>
                </div>
              </div>

              <div className={goalsStyles.goalMilestones}>
                <div className={goalsStyles.milestonesLabel}>
                  Milestones ({goal.milestones.filter(m => m.completed).length}/{goal.milestones.length})
                </div>
                <div className={goalsStyles.milestonesList}>
                  {goal.milestones.slice(0, 3).map((milestone) => (
                    <div 
                      key={milestone.id} 
                      className={`${goalsStyles.milestoneItem} ${milestone.completed ? goalsStyles.completed : goalsStyles.pending}`}
                    >
                      <div className={`${goalsStyles.milestoneCheckbox} ${milestone.completed ? goalsStyles.completed : ''}`}>
                        {milestone.completed && <FiCheck size={10} />}
                      </div>
                      <span className={`${goalsStyles.milestoneText} ${milestone.completed ? goalsStyles.completed : ''}`}>
                        {milestone.text}
                      </span>
                    </div>
                  ))}
                  {goal.milestones.length > 3 && (
                    <div className={goalsStyles.milestoneItem}>
                      <span className={goalsStyles.milestoneText} style={{ color: '#718096', fontStyle: 'italic' }}>
                        +{goal.milestones.length - 3} more milestones
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className={goalsStyles.goalActions}>
                {getActionButton(goal)}
                <button className={`${goalsStyles.actionButton} ${goalsStyles.editButton}`}>
                  <FiEdit />
                  Edit
                </button>
                <button className={`${goalsStyles.actionButton} ${goalsStyles.deleteButton}`}>
                  <FiTrash2 />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Add New Goal Card */}
        <div className={goalsStyles.addGoalSection}>
          <div className={goalsStyles.addGoalIcon}>
            <FiPlus />
          </div>
          <h3 className={goalsStyles.addGoalTitle}>Add New Goal</h3>
          <p className={goalsStyles.addGoalDescription}>
            Create a new learning objective and start tracking your progress
          </p>
        </div>
      </div>
    </div>
  );
} 