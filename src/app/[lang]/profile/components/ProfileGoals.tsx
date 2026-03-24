"use client";

import React, { useState, useEffect } from "react";
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
  FiX,
  FiSave,
} from "react-icons/fi";
import goalsStyles from "../ProfileGoals.module.css";

interface ProfileGoalsProps {
  userStats: any;
  loading: boolean;
}

interface Milestone {
  id?: number;
  text: string;
  completed: boolean;
  order: number;
}

interface Goal {
  id: number;
  title: string;
  description: string;
  category: string;
  status: 'ACTIVE' | 'COMPLETED' | 'OVERDUE' | 'PAUSED';
  progress: number;
  deadline?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  timeSpent: number;
  estimatedTime: number;
  createdAt: string;
  updatedAt: string;
  milestones: Milestone[];
}

interface GoalData {
  goals: Goal[];
  statistics: {
    total: number;
    active: number;
    completed: number;
    overdue: number;
    progress: number;
  };
  categoryStats: {
    [key: string]: {
      completed: number;
      total: number;
      progress: number;
    };
  };
}

export default function ProfileGoals({
  userStats,
  loading,
}: ProfileGoalsProps) {
  const [goalData, setGoalData] = useState<GoalData | null>(null);
  const [goalsLoading, setGoalsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Programming',
    deadline: '',
    priority: 'MEDIUM' as 'LOW' | 'MEDIUM' | 'HIGH',
    difficulty: 'MEDIUM' as 'EASY' | 'MEDIUM' | 'HARD',
    estimatedTime: 0,
    milestones: [] as Milestone[]
  });

  // Fetch goals from API
  const fetchGoals = async () => {
    try {
      setGoalsLoading(true);
      const response = await fetch('/api/user/goals');
      if (response.ok) {
        const data = await response.json();
        setGoalData(data);
      } else {
        console.error('Failed to fetch goals');
      }
    } catch (error) {
      console.error('Error fetching goals:', error);
    } finally {
      setGoalsLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingGoal ? '/api/user/goals' : '/api/user/goals';
      const method = editingGoal ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...(editingGoal && { id: editingGoal.id }),
          ...formData,
          estimatedTime: parseInt(formData.estimatedTime.toString()) * 60 // Convert hours to minutes
        }),
      });

      if (response.ok) {
        setShowAddForm(false);
        setEditingGoal(null);
        resetForm();
        fetchGoals();
      } else {
        console.error('Failed to save goal');
      }
    } catch (error) {
      console.error('Error saving goal:', error);
    }
  };

  // Handle goal deletion
  const handleDelete = async (goalId: number) => {
    if (!confirm('Are you sure you want to delete this goal?')) return;
    
    try {
      const response = await fetch(`/api/user/goals?id=${goalId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchGoals();
      } else {
        console.error('Failed to delete goal');
      }
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  };

  // Handle milestone toggle
  const handleMilestoneToggle = async (milestoneId: number, completed: boolean) => {
    try {
      const response = await fetch('/api/user/goals/milestones', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          milestoneId,
          completed: !completed
        }),
      });

      if (response.ok) {
        fetchGoals();
      } else {
        console.error('Failed to update milestone');
      }
    } catch (error) {
      console.error('Error updating milestone:', error);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'Programming',
      deadline: '',
      priority: 'MEDIUM',
      difficulty: 'MEDIUM',
      estimatedTime: 0,
      milestones: []
    });
  };

  // Edit goal
  const handleEdit = (goal: Goal) => {
    setEditingGoal(goal);
    setFormData({
      title: goal.title,
      description: goal.description,
      category: goal.category,
      deadline: goal.deadline ? goal.deadline.split('T')[0] : '',
      priority: goal.priority,
      difficulty: goal.difficulty,
      estimatedTime: Math.round(goal.estimatedTime / 60), // Convert minutes to hours
      milestones: goal.milestones.map(m => ({
        id: m.id,
        text: m.text,
        completed: m.completed,
        order: m.order
      }))
    });
    setShowAddForm(true);
  };

  // Add milestone to form
  const addMilestone = () => {
    setFormData(prev => ({
      ...prev,
      milestones: [...prev.milestones, {
        text: '',
        completed: false,
        order: prev.milestones.length + 1
      }]
    }));
  };

  // Update milestone in form
  const updateMilestone = (index: number, field: keyof Milestone, value: any) => {
    setFormData(prev => ({
      ...prev,
      milestones: prev.milestones.map((milestone, i) => 
        i === index ? { ...milestone, [field]: value } : milestone
      )
    }));
  };

  // Remove milestone from form
  const removeMilestone = (index: number) => {
    setFormData(prev => ({
      ...prev,
      milestones: prev.milestones.filter((_, i) => i !== index)
    }));
  };

  if (loading || goalsLoading) {
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

  const goals = goalData?.goals || [];
  const statistics = goalData?.statistics || { total: 0, active: 0, completed: 0, overdue: 0, progress: 0 };
  const categoryStats = goalData?.categoryStats || {};

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <FiTarget />;
      case 'COMPLETED':
        return <FiCheckCircle />;
      case 'OVERDUE':
        return <FiFlag />;
      default:
        return <FiCircle />;
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return <FiStar style={{ color: '#e53e3e' }} />;
      case 'MEDIUM':
        return <FiStar style={{ color: '#ed8936' }} />;
      case 'LOW':
        return <FiStar style={{ color: '#48bb78' }} />;
      default:
        return <FiStar />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY':
        return '#48bb78';
      case 'MEDIUM':
        return '#ed8936';
      case 'HARD':
        return '#e53e3e';
      default:
        return '#718096';
    }
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const calculateDaysLeft = (deadline?: string) => {
    if (!deadline) return null;
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

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
              <button 
                className={`${goalsStyles.heroButton} ${goalsStyles.primary}`}
                onClick={() => {
                  setShowAddForm(true);
                  setEditingGoal(null);
                  resetForm();
                }}
              >
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
                  {statistics.active}
                </span>
                <span className={goalsStyles.statLabel}>Active</span>
              </div>
              <div className={goalsStyles.statItem}>
                <span className={goalsStyles.statNumber}>
                  {statistics.completed}
                </span>
                <span className={goalsStyles.statLabel}>Completed</span>
              </div>
              <div className={goalsStyles.statItem}>
                <span className={goalsStyles.statNumber}>
                  {statistics.progress}%
                </span>
                <span className={goalsStyles.statLabel}>Progress</span>
              </div>
              <div className={goalsStyles.statItem}>
                <span className={goalsStyles.statNumber}>
                  {statistics.overdue}
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
              {statistics.active}
            </div>
            <div className={goalsStyles.progressLabel}>Active Goals</div>
            <div className={goalsStyles.progressBar}>
              <div 
                className={`${goalsStyles.progressBarFill} ${goalsStyles.active}`}
                style={{ width: `${statistics.total > 0 ? (statistics.active / statistics.total) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
          
          <div className={`${goalsStyles.progressCard} ${goalsStyles.completed}`}>
            <div className={`${goalsStyles.progressNumber} ${goalsStyles.completed}`}>
              {statistics.completed}
            </div>
            <div className={goalsStyles.progressLabel}>Completed Goals</div>
            <div className={goalsStyles.progressBar}>
              <div 
                className={`${goalsStyles.progressBarFill} ${goalsStyles.completed}`}
                style={{ width: `${statistics.total > 0 ? (statistics.completed / statistics.total) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
          
          <div className={`${goalsStyles.progressCard} ${goalsStyles.overdue}`}>
            <div className={`${goalsStyles.progressNumber} ${goalsStyles.overdue}`}>
              {statistics.overdue}
            </div>
            <div className={goalsStyles.progressLabel}>Overdue Goals</div>
            <div className={goalsStyles.progressBar}>
              <div 
                className={`${goalsStyles.progressBarFill} ${goalsStyles.overdue}`}
                style={{ width: `${statistics.total > 0 ? (statistics.overdue / statistics.total) * 100 : 0}%` }}
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
          {Object.entries(categoryStats).map(([category, stats]) => (
            <div 
              key={category} 
              className={`${goalsStyles.categoryCard} ${goalsStyles[category]}`}
            >
              <div className={goalsStyles.categoryIcon}>
                {category === 'programming' && <FiCode />}
                {category === 'language' && <FiBookOpen />}
                {category === 'framework' && <FiLayers />}
                {category === 'project' && <FiZap />}
                {category === 'certification' && <FiAward />}
              </div>
              <h4 className={goalsStyles.categoryName}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </h4>
              <p className={goalsStyles.categoryProgress}>
                {stats.completed} of {stats.total} goals completed
              </p>
              <div className={goalsStyles.categoryProgressBar}>
                <div 
                  className={`${goalsStyles.categoryProgressFill} ${goalsStyles[category]}`}
                  style={{ width: `${stats.progress}%` }}
                ></div>
              </div>
              <div className={goalsStyles.categoryStats}>
                <span>{stats.progress}% Complete</span>
                <span>{stats.total - stats.completed} remaining</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add/Edit Goal Form */}
      {showAddForm && (
        <div className={goalsStyles.addGoalForm}>
          <div className={goalsStyles.formHeader}>
            <h3>{editingGoal ? 'Edit Goal' : 'Add New Goal'}</h3>
            <button 
              className={goalsStyles.closeButton}
              onClick={() => {
                setShowAddForm(false);
                setEditingGoal(null);
                resetForm();
              }}
            >
              <FiX />
            </button>
          </div>
          <form onSubmit={handleSubmit} className={goalsStyles.form}>
            <div className={goalsStyles.formRow}>
              <div className={goalsStyles.formGroup}>
                <label>Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>
              <div className={goalsStyles.formGroup}>
                <label>Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                >
                  <option value="Programming">Programming</option>
                  <option value="Language">Language Learning</option>
                  <option value="Framework">Frameworks & Tools</option>
                  <option value="Project">Personal Projects</option>
                  <option value="Certification">Certifications</option>
                </select>
              </div>
            </div>
            
            <div className={goalsStyles.formGroup}>
              <label>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                required
                rows={3}
              />
            </div>

            <div className={goalsStyles.formRow}>
              <div className={goalsStyles.formGroup}>
                <label>Deadline</label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                />
              </div>
              <div className={goalsStyles.formGroup}>
                <label>Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as any }))}
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>
              <div className={goalsStyles.formGroup}>
                <label>Difficulty</label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value as any }))}
                >
                  <option value="EASY">Easy</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HARD">Hard</option>
                </select>
              </div>
              <div className={goalsStyles.formGroup}>
                <label>Estimated Time (hours)</label>
                <input
                  type="number"
                  value={formData.estimatedTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, estimatedTime: parseInt(e.target.value) || 0 }))}
                  min="0"
                />
              </div>
            </div>

            <div className={goalsStyles.formGroup}>
              <label>Milestones</label>
              <div className={goalsStyles.milestonesForm}>
                {formData.milestones.map((milestone, index) => (
                  <div key={index} className={goalsStyles.milestoneFormItem}>
                    <input
                      type="text"
                      value={milestone.text}
                      onChange={(e) => updateMilestone(index, 'text', e.target.value)}
                      placeholder="Milestone description"
                    />
                    <button
                      type="button"
                      onClick={() => removeMilestone(index)}
                      className={goalsStyles.removeMilestoneButton}
                    >
                      <FiX />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addMilestone}
                  className={goalsStyles.addMilestoneButton}
                >
                  <FiPlus /> Add Milestone
                </button>
              </div>
            </div>

            <div className={goalsStyles.formActions}>
              <button type="submit" className={goalsStyles.saveButton}>
                <FiSave />
                {editingGoal ? 'Update Goal' : 'Create Goal'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingGoal(null);
                  resetForm();
                }}
                className={goalsStyles.cancelButton}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Goals Grid */}
      <div className={goalsStyles.goalsGrid}>
        {goals.length > 0 ? (
          goals.map((goal) => (
          <div 
            key={goal.id} 
              className={`${goalsStyles.goalCard} ${goalsStyles[goal.status.toLowerCase()]}`}
          >
              <div className={`${goalsStyles.goalHeader} ${goalsStyles[goal.status.toLowerCase()]}`}>
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
                  <div className={`${goalsStyles.goalStatus} ${goalsStyles[goal.status.toLowerCase()]}`}>
                  {getStatusIcon(goal.status)}
                    {goal.status === 'ACTIVE' ? 'Active' : 
                     goal.status === 'COMPLETED' ? 'Completed' : 
                     goal.status === 'OVERDUE' ? 'Overdue' : 'Paused'}
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
                      className={`${goalsStyles.goalProgressBarFill} ${goalsStyles[goal.status.toLowerCase()]}`}
                    style={{ width: `${goal.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className={goalsStyles.goalMetrics}>
                <div className={goalsStyles.metricItem}>
                  <FiCalendar className={goalsStyles.metricIcon} />
                  <span className={goalsStyles.metricValue}>
                      {goal.deadline ? (
                        (() => {
                          const daysLeft = calculateDaysLeft(goal.deadline);
                          if (daysLeft === null) return 'No deadline';
                          if (daysLeft > 0) return `${daysLeft} days left`;
                          if (daysLeft < 0) return `${Math.abs(daysLeft)} days overdue`;
                          return 'Due today';
                        })()
                      ) : 'No deadline'}
                  </span>
                </div>
                <div className={goalsStyles.metricItem}>
                  <FiClock className={goalsStyles.metricIcon} />
                  <span className={goalsStyles.metricValue}>
                      {formatTime(goal.timeSpent)} / {formatTime(goal.estimatedTime)}
                  </span>
                </div>
                <div className={goalsStyles.metricItem}>
                  {getPriorityIcon(goal.priority)}
                  <span className={goalsStyles.metricValue}>
                      {goal.priority.toLowerCase()} priority
                  </span>
                </div>
                <div className={goalsStyles.metricItem}>
                  <FiTarget className={goalsStyles.metricIcon} />
                  <span className={goalsStyles.metricValue}>
                    <span style={{ color: getDifficultyColor(goal.difficulty) }}>
                        {goal.difficulty.toLowerCase()}
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
                        onClick={() => milestone.id && handleMilestoneToggle(milestone.id, milestone.completed)}
                        style={{ cursor: 'pointer' }}
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
                  <button 
                    className={`${goalsStyles.actionButton} ${goalsStyles.editButton}`}
                    onClick={() => handleEdit(goal)}
                  >
                  <FiEdit />
                  Edit
                </button>
                  <button 
                    className={`${goalsStyles.actionButton} ${goalsStyles.deleteButton}`}
                    onClick={() => handleDelete(goal.id)}
                  >
                  <FiTrash2 />
                  Delete
                </button>
              </div>
            </div>
          </div>
          ))
        ) : (
          <div className={goalsStyles.emptyState}>
            <div className={goalsStyles.emptyStateIcon}>
              <FiTarget size={64} />
            </div>
            <h3>No learning goals yet</h3>
            <p>Start by creating your first learning goal to track your progress!</p>
            <button 
              className={`${goalsStyles.heroButton} ${goalsStyles.primary}`}
              onClick={() => {
                setShowAddForm(true);
                setEditingGoal(null);
                resetForm();
              }}
            >
              <FiPlus />
              Create Your First Goal
            </button>
          </div>
        )}

        {/* Add New Goal Card */}
        {goals.length > 0 && (
          <div 
            className={goalsStyles.addGoalSection}
            onClick={() => {
              setShowAddForm(true);
              setEditingGoal(null);
              resetForm();
            }}
          >
          <div className={goalsStyles.addGoalIcon}>
            <FiPlus />
          </div>
          <h3 className={goalsStyles.addGoalTitle}>Add New Goal</h3>
          <p className={goalsStyles.addGoalDescription}>
            Create a new learning objective and start tracking your progress
          </p>
        </div>
        )}
      </div>
    </div>
  );
} 