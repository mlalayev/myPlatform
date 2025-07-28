"use client";
import React, { useState, useEffect } from "react";
import styles from "./ExercisesList.module.css";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import HeroSection from "../components/heroSection/HeroSection";
import Link from "next/link";
import {
  FiSearch,
  FiFilter,
  FiTrendingUp,
  FiCalendar,
  FiCode,
  FiUsers,
  FiClock,
  FiMinusCircle,
  FiDatabase,
  FiTarget,
  FiZap,
  FiAward,
  FiCheckCircle,
  FiXCircle,
  FiStar,
  FiPlay,
  FiBookOpen,
  FiBarChart,
  FiGift,
  FiFrown,
  FiHeart,
  FiEye,
  FiMessageCircle,
} from "react-icons/fi";
import { usePathname } from "next/navigation";
import {
  SiJavascript,
  SiPython,
  SiCplusplus,
  SiGo,
  SiOpenjdk,
} from "react-icons/si";

interface Exercise {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  category: string;
  content: {
    acceptance: number;
    constraints: string[];
    examples: { input: string; output: string; explanation?: string }[];
    tags: string[];
    solution: string;
    timeComplexity: string;
    spaceComplexity: string;
    hints?: string[];
    testCases: { input: string; expectedOutput: string; hidden?: boolean }[];
  };
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ExercisesResponse {
  exercises: Exercise[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  filters: {
    difficulties: Array<{ difficulty: string; count: number }>;
    categories: Array<{ category: string; count: number }>;
  };
}

const difficultyColor = (diff: string) =>
  diff === "EASY" || diff === "Asan"
    ? styles.diffEasy
    : diff === "MEDIUM" || diff === "Orta"
    ? styles.diffMed
    : diff === "HARD" || diff === "Çətin"
    ? styles.diffHard
    : styles.diffHard;

const difficultyIcon = (diff: string) => {
  switch (diff) {
    case "EASY":
    case "Asan":
      return ""; // Emoji CSS-də əlavə edilir
    case "MEDIUM":
    case "Orta":
      return ""; // Emoji CSS-də əlavə edilir
    case "HARD":
    case "Çətin":
      return ""; // Emoji CSS-də əlavə edilir
    default:
      return "⚪";
  }
};

const getDifficultyText = (diff: string) => {
  switch (diff) {
    case "EASY":
      return "Asan";
    case "MEDIUM":
      return "Orta";
    case "HARD":
      return "Çətin";
    default:
      return diff;
  }
};

export default function ExercisesPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("Bütün");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [statuses, setStatuses] = useState<{
    [id: number]: "not_submitted" | "wrong" | "correct";
  }>({});
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });
  const [filters, setFilters] = useState({
    difficulties: [] as Array<{ difficulty: string; count: number }>,
    categories: [] as Array<{ category: string; count: number }>,
  });
  const [showChallenges, setShowChallenges] = useState(true);
  const [activeChallenge, setActiveChallenge] = useState<number | null>(null);
  const [userStats, setUserStats] = useState({
    totalSolved: 0,
    streak: 0,
    rank: 0,
    points: 0,
  });

  const pathname = usePathname();
  const currentLang = pathname.split("/")[1] || "az";

  // Fetch exercises data
  useEffect(() => {
    async function fetchExercises() {
      try {
        setLoading(true);
        const getDifficultyForAPI = (diff: string) => {
          switch (diff) {
            case "Asan":
              return "EASY";
            case "Orta":
              return "MEDIUM";
            case "Çətin":
              return "HARD";
            default:
              return "";
          }
        };

        const params = new URLSearchParams({
          page: pagination.page.toString(),
          limit: pagination.limit.toString(),
          search: search,
        });

        if (selectedDifficulty !== "Bütün") {
          params.append("difficulty", getDifficultyForAPI(selectedDifficulty));
        }

        if (selectedCategory !== "ALL") {
          params.append("category", selectedCategory);
        }

        const response = await fetch(`/api/exercises?${params}`);
        if (!response.ok) {
          throw new Error("Failed to fetch exercises");
        }

        const data: ExercisesResponse = await response.json();
        setExercises(data.exercises);
        setPagination(data.pagination);
        setFilters(data.filters);
      } catch (error) {
        console.error("Error fetching exercises:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchExercises();
  }, [
    search,
    selectedDifficulty,
    selectedCategory,
    pagination.page,
    pagination.limit,
  ]);

  // Listen for storage changes to update statuses in real-time
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key && e.key.startsWith('quiz_ever_passed_')) {
        // Refresh statuses when localStorage changes
        const exerciseId = e.key.replace('quiz_ever_passed_', '');
        setStatuses(prev => ({
          ...prev,
          [Number(exerciseId)]: e.newValue === 'true' ? 'correct' : 'wrong'
        }));
      } else if (e.key && e.key.startsWith('quiz_status_')) {
        // Also listen for quiz_status changes
        const exerciseId = e.key.replace('quiz_status_', '');
        setStatuses(prev => ({
          ...prev,
          [Number(exerciseId)]: e.newValue === 'correct' ? 'correct' : 'wrong'
        }));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Fetch user statuses
  useEffect(() => {
    async function fetchStatuses() {
      try {
        // Fetch real statuses from backend for all exercises
        const statusPromises = exercises.map(async (exercise) => {
          try {
            const response = await fetch(`/api/quiz/${exercise.id}/latest?maxTestCases=${exercise.content.testCases.length}`);
            if (response.ok) {
              const data = await response.json();
              return {
                id: exercise.id,
                status: data.hasPassed ? "correct" : data.hasWrong ? "wrong" : "not_submitted"
              };
            }
          } catch (error) {
            console.warn(`Failed to fetch status for exercise ${exercise.id}:`, error);
          }
          return { id: exercise.id, status: "not_submitted" };
        });

        const statusResults = await Promise.all(statusPromises);
        const newStatuses: { [id: number]: "not_submitted" | "wrong" | "correct" } = {};
        
        statusResults.forEach(({ id, status }) => {
          newStatuses[id] = status;
        });

        setStatuses(newStatuses);
        console.log("Real statuses loaded:", newStatuses);
      } catch (error) {
        console.error("Error fetching statuses:", error);
      }
    }

    if (exercises.length > 0) {
      fetchStatuses();
    }
  }, [exercises]);

  // Fetch user stats
  useEffect(() => {
    async function fetchUserStats() {
      try {
        const response = await fetch("/api/user/profile");
        if (response.ok) {
          const data = await response.json();
          setUserStats({
            totalSolved: data.totalSolved || 0,
            streak: data.learningStreak || 0,
            rank: data.rank || 0,
            points: data.coins || 0,
          });
        }
      } catch (error) {
        console.error("Error fetching user stats:", error);
      }
    }

    fetchUserStats();
  }, []);

  // Refresh statuses when localStorage changes (for real-time updates)
  useEffect(() => {
    const refreshStatuses = () => {
      setStatuses(prev => {
        const newStatuses = { ...prev };
        exercises.forEach(ex => {
          const hasEverPassed = localStorage.getItem(`quiz_ever_passed_${ex.id}`) === 'true';
          const currentStatus = localStorage.getItem(`quiz_status_${ex.id}`);
          
          if (hasEverPassed || currentStatus === "correct") {
            newStatuses[ex.id] = "correct";
          } else if (currentStatus === "incorrect") {
            newStatuses[ex.id] = "wrong";
          }
        });
        return newStatuses;
      });
    };

    // Initial refresh
    refreshStatuses();

    // Listen for storage changes
    const handleStorageChange = () => {
      refreshStatuses();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [exercises]);

  const stats = {
    total: exercises.length,
    easy: filters.difficulties.find((d) => d.difficulty === "EASY")?.count || 0,
    medium:
      filters.difficulties.find((d) => d.difficulty === "MEDIUM")?.count || 0,
    hard: filters.difficulties.find((d) => d.difficulty === "HARD")?.count || 0,
  };

  const exerciseHeroBoxes = [
    {
      key: "total",
      icon: FiDatabase,
      number: stats.total,
      titleKey: "exercises.hero.stats.total",
    },
    {
      key: "easy",
      icon: FiTarget,
      number: stats.easy,
      titleKey: "exercises.hero.stats.easy",
    },
    {
      key: "medium",
      icon: FiZap,
      number: stats.medium,
      titleKey: "exercises.hero.stats.medium",
    },
    {
      key: "hard",
      icon: FiAward,
      number: stats.hard,
      titleKey: "exercises.hero.stats.hard",
    },
  ];

  const challenges = [
    {
      id: 1,
      title: "JavaScript 30 Days Challenge",
      description: "30 gün ərzində JavaScript-də məşhur alqoritmləri öyrənin",
      icon: SiJavascript,
      gradient: "linear-gradient(120deg, #f7971e 0%, #ffd200 100%)",
      participants: 1247,
      progress: 65,
      daysLeft: 15,
    },
    {
      id: 2,
      title: "Python 30 Days Challenge",
      description: "Python ilə data structures və alqoritmləri məşq edin",
      icon: SiPython,
      gradient: "linear-gradient(120deg, #43e97b 0%, #38f9d7 100%)",
      participants: 892,
      progress: 45,
      daysLeft: 22,
    },
    {
      id: 3,
      title: "C++ 30 Days Challenge",
      description: "C++ ilə competitive programming hazırlayın",
      icon: SiCplusplus,
      gradient: "linear-gradient(120deg, #7f53ac 0%, #657ced 100%)",
      participants: 567,
      progress: 78,
      daysLeft: 8,
    },
    {
      id: 4,
      title: "Go 30 Days Challenge",
      description: "Go dilində sistem proqramlaşdırması öyrənin",
      icon: SiGo,
      gradient: "linear-gradient(120deg, #f953c6 0%, #b91d73 100%)",
      participants: 234,
      progress: 32,
      daysLeft: 28,
    },
    {
      id: 5,
      title: "Java 30 Days Challenge",
      description: "Java ilə enterprise development öyrənin",
      icon: SiOpenjdk,
      gradient: "linear-gradient(120deg, #43cea2 0%, #185a9d 100%)",
      participants: 445,
      progress: 55,
      daysLeft: 18,
    },
  ];

  const trendingTopics = [
    { name: "Dynamic Programming", count: 156, trend: "up" },
    { name: "Binary Search", count: 134, trend: "up" },
    { name: "Graph Algorithms", count: 98, trend: "up" },
    { name: "Tree Traversal", count: 87, trend: "down" },
    { name: "String Matching", count: 76, trend: "up" },
    { name: "Sorting", count: 65, trend: "down" },
  ];

  const recentActivities = [
    {
      user: "Ahmad",
      action: "solved",
      exercise: "Two Sum",
      time: "2 dəqiqə əvvəl",
    },
    {
      user: "Leyla",
      action: "started",
      exercise: "Binary Search",
      time: "5 dəqiqə əvvəl",
    },
    {
      user: "Elvin",
      action: "completed",
      exercise: "Dynamic Programming",
      time: "12 dəqiqə əvvəl",
    },
    {
      user: "Nigar",
      action: "achieved",
      exercise: "100 problems",
      time: "1 saat əvvəl",
    },
  ];

  return (
    <>
      <Header />

      <HeroSection
        titleKey="exercises.hero.title"
        subtitleKey="exercises.hero.subtitle"
        boxes={exerciseHeroBoxes}
      />

      {/* Enhanced Challenge Section */}
      <div className={styles.challengeSection}>
        <div className={styles.challengeHeader}>
          <h2 className={styles.challengeSectionTitle}>
            <FiGift className={styles.challengeSectionIcon} />
            Aktiv Çağırışlar
          </h2>
          <button
            className={styles.toggleChallenges}
            onClick={() => setShowChallenges(!showChallenges)}
          >
            {showChallenges ? "Gizlət" : "Göstər"}
          </button>
        </div>

        {showChallenges && (
          <div className={styles.challengeSlideContainer}>
            {challenges.map((challenge) => (
              <div
                key={challenge.id}
                className={`${styles.challengeCard} ${
                  activeChallenge === challenge.id ? styles.active : ""
                }`}
                style={{ background: challenge.gradient }}
                onMouseEnter={() => setActiveChallenge(challenge.id)}
                onMouseLeave={() => setActiveChallenge(null)}
              >
                <div className={styles.challengeHeader}>
                  <challenge.icon className={styles.challengeIcon} />
                  <div className={styles.challengeBadge}>
                    <FiFrown className={styles.crownIcon} />
                    {challenge.participants} iştirakçı
                  </div>
                </div>

                <div className={styles.challengeContent}>
                  <h3 className={styles.challengeTitle}>{challenge.title}</h3>
                  <p className={styles.challengeDesc}>
                    {challenge.description}
                  </p>

                  <div className={styles.challengeProgress}>
                    <div className={styles.progressInfo}>
                      <span className={styles.progressPercent}>
                        {challenge.progress}%
                      </span>
                      <span className={styles.daysLeft}>
                        {challenge.daysLeft} gün qaldı
                      </span>
                    </div>
                    <div className={styles.progressBar}>
                      <div
                        className={styles.progressFill}
                        style={{ width: `${challenge.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <button className={styles.challengeButton}>
                  <FiPlay className={styles.playIcon} />
                  Başla
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={styles.layout}>
        <div className={styles.contentOpen}>
          <div className={styles.page}>
            {/* Enhanced Search and Filter Section */}
            <div className={styles.headerBar}>
              <div className={styles.filterSection}>
                <div className={styles.filterTitle}>
                  <FiFilter className={styles.filterIcon} />
                  Çətinlik Səviyyəsi
                </div>
                <div className={styles.filterButtons}>
                  <button
                    className={`${styles.filterBtn} ${
                      selectedDifficulty === "Bütün" ? styles.selected : ""
                    }`}
                    onClick={() => setSelectedDifficulty("Bütün")}
                  >
                    <FiDatabase className={styles.filterBtnIcon} />
                    Bütün
                  </button>
                  <button
                    className={`${styles.filterBtn} ${
                      selectedDifficulty === "Asan" ? styles.selected : ""
                    }`}
                    onClick={() => setSelectedDifficulty("Asan")}
                  >
                    <FiTarget className={styles.filterBtnIcon} />
                    Asan
                  </button>
                  <button
                    className={`${styles.filterBtn} ${
                      selectedDifficulty === "Orta" ? styles.selected : ""
                    }`}
                    onClick={() => setSelectedDifficulty("Orta")}
                  >
                    <FiZap className={styles.filterBtnIcon} />
                    Orta
                  </button>
                  <button
                    className={`${styles.filterBtn} ${
                      selectedDifficulty === "Çətin" ? styles.selected : ""
                    }`}
                    onClick={() => setSelectedDifficulty("Çətin")}
                  >
                    <FiAward className={styles.filterBtnIcon} />
                    Çətin
                  </button>
                </div>
              </div>

              <div className={styles.searchBox}>
                <FiSearch className={styles.searchIcon} />
                <input
                  className={styles.searchInput}
                  placeholder="Tapşırıq, təsvir və ya tag axtarın..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Enhanced Results Info */}
            <div className={styles.resultsInfo}>
              <div className={styles.resultsLeft}>
                <span className={styles.resultsCount}>
                  {exercises.length} tapşırıq tapıldı
                </span>
                {search && (
                  <span className={styles.searchTerm}>
                    &quot;{search}&quot; üçün nəticələr
                  </span>
                )}
              </div>
              <div className={styles.resultsRight}>
                <div className={styles.userStats}>
                  <span className={styles.userStat}>
                    <FiCheckCircle className={styles.userStatIcon} />
                    {userStats.totalSolved} həll edildi
                  </span>
                  <span className={styles.userStat}>
                    <FiZap className={styles.userStatIcon} />
                    {userStats.streak} günlük seriya
                  </span>
                </div>
              </div>
            </div>

            {/* Enhanced Exercises List */}
            <div className={styles.list}>
              {loading
                ? // Enhanced loading shimmer cards
                  Array.from({ length: 6 }).map((_, index) => (
                    <div
                      key={index}
                      className={`${styles.row} ${styles.loading}`}
                    >
                      <div className={styles.cardHeader}>
                        <div className={styles.cardLeft}>
                          <div className={styles.loadingIndex}></div>
                          <div className={styles.loadingTitle}></div>
                        </div>
                        <div className={styles.cardRight}>
                          <div className={styles.loadingDifficulty}></div>
                          <div className={styles.loadingStatus}></div>
                        </div>
                      </div>
                      <div className={styles.loadingDesc}></div>
                      <div className={styles.cardFooter}>
                        <div className={styles.cardStats}>
                          <div className={styles.loadingStat}></div>
                          <div className={styles.loadingStat}></div>
                        </div>
                        <div className={styles.cardTags}>
                          <div className={styles.loadingTag}></div>
                          <div className={styles.loadingTag}></div>
                        </div>
                      </div>
                    </div>
                  ))
                : exercises.map((ex) => (
                    <Link
                      href={`/${currentLang}/exercises/${ex.id}`}
                      key={ex.id}
                      className={styles.row}
                      data-difficulty={
                        ex.difficulty === "EASY"
                          ? "Asan"
                          : ex.difficulty === "MEDIUM"
                          ? "Orta"
                          : ex.difficulty === "HARD"
                          ? "Çətin"
                          : ex.difficulty
                      }
                    >
                      <div className={styles.cardHeader}>
                        <div className={styles.cardLeft}>
                          <span className={styles.cardIndex}>#{ex.id}</span>
                          <span className={styles.cellTitle}>{ex.title}</span>
                          {ex.content?.acceptance &&
                            ex.content.acceptance > 80 && (
                              <span className={styles.popularBadge}>
                                <FiStar className={styles.starIcon} />
                                Populyar
                              </span>
                            )}
                        </div>
                        <div className={styles.cardRight}>
                          <span
                            className={`${styles.cellDiff} ${difficultyColor(
                              ex.difficulty
                            )}`}
                          >
                            {difficultyIcon(ex.difficulty)}{" "}
                            {getDifficultyText(ex.difficulty)}
                          </span>
                          <div className={styles.statusIcons}>
                            {(() => {
                              const status = statuses[Number(ex.id)];
                              const hasEverPassed = localStorage.getItem(`quiz_ever_passed_${ex.id}`) === 'true';
                              const currentStatus = localStorage.getItem(`quiz_status_${ex.id}`);
                              console.log(`Exercise ${ex.id} status:`, status, 'hasEverPassed:', hasEverPassed, 'currentStatus:', currentStatus);
                              
                              // If user has ever passed this exercise, always show green tick
                              if (hasEverPassed || status === "correct" || currentStatus === "correct") {
                                return (
                                  <FiCheckCircle
                                    className={styles.statusIcon}
                                    title="Doğru"
                                    style={{ color: "#48bb78", fontSize: "1.4rem" }}
                                  />
                                );
                              } else if (status === "wrong" || currentStatus === "incorrect") {
                                return (
                                  <FiXCircle
                                    className={styles.statusIcon}
                                    title="Yanlış"
                                    style={{ color: "#f56565", fontSize: "1.4rem" }}
                                  />
                                );
                              } else {
                                return (
                                  <FiMinusCircle
                                    className={styles.statusIcon}
                                    title="Göndərilməyib"
                                    style={{ color: "#a0aec0", fontSize: "1.4rem" }}
                                  />
                                );
                              }
                            })()}
                          </div>
                        </div>
                      </div>

                      <div className={styles.cellDesc}>{ex.description}</div>

                      <div className={styles.cardFooter}>
                        <div className={styles.cardStats}>
                          <span className={styles.cellAcc}>
                            <FiUsers className={styles.statIconSmall} />
                            {ex.content?.acceptance || 0}% Qəbul
                          </span>
                          <span className={styles.timeComplexity}>
                            <FiClock className={styles.statIconSmall} />
                            {ex.content?.timeComplexity || "O(1)"}
                          </span>
                          <span className={styles.spaceComplexity}>
                            <FiDatabase className={styles.statIconSmall} />
                            {ex.content?.spaceComplexity || "O(1)"}
                          </span>
                        </div>
                        <div className={styles.cardTags}>
                          {ex.content?.tags?.map((tag: string) => (
                            <span className={styles.cardTag} key={tag}>
                              <FiCode className={styles.tagIcon} />
                              {tag}
                            </span>
                          )) || []}
                        </div>
                      </div>
                    </Link>
                  ))}
            </div>

            {/* Enhanced Empty State */}
            {exercises.length === 0 && !loading && (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>🔍</div>
                <h3 className={styles.emptyTitle}>
                  Heç bir tapşırıq tapılmadı
                </h3>
                <p className={styles.emptyText}>
                  Axtarış şərtlərinizi dəyişdirin və ya başqa açar sözlər
                  sınayın
                </p>
                <button
                  className={styles.emptyAction}
                  onClick={() => {
                    setSearch("");
                    setSelectedDifficulty("Bütün");
                    setSelectedCategory("ALL");
                  }}
                >
                  Bütün tapşırıqları göstər
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Sidebar */}
        <aside className={styles.sidebar}>
          {/* User Stats Section */}
          <div className={styles.sidebarSection}>
            <h3 className={styles.sidebarTitle}>
              <FiBarChart className={styles.sidebarIcon} />
              Sizin Statistikalarınız
            </h3>
            <div className={styles.userStatsGrid}>
              <div className={styles.userStatCard}>
                <FiCheckCircle className={styles.userStatCardIcon} />
                <div className={styles.userStatCardContent}>
                  <span className={styles.userStatCardNumber}>
                    {userStats.totalSolved}
                  </span>
                  <span className={styles.userStatCardLabel}>Həll edildi</span>
                </div>
              </div>
              <div className={styles.userStatCard}>
                <FiZap className={styles.userStatCardIcon} />
                <div className={styles.userStatCardContent}>
                  <span className={styles.userStatCardNumber}>
                    {userStats.streak}
                  </span>
                  <span className={styles.userStatCardLabel}>
                    Günlük seriya
                  </span>
                </div>
              </div>
              <div className={styles.userStatCard}>
                <FiAward className={styles.userStatCardIcon} />
                <div className={styles.userStatCardContent}>
                  <span className={styles.userStatCardNumber}>
                    {userStats.rank}
                  </span>
                  <span className={styles.userStatCardLabel}>Reytinq</span>
                </div>
              </div>
              <div className={styles.userStatCard}>
                <FiGift className={styles.userStatCardIcon} />
                <div className={styles.userStatCardContent}>
                  <span className={styles.userStatCardNumber}>
                    {userStats.points}
                  </span>
                  <span className={styles.userStatCardLabel}>Xal</span>
                </div>
              </div>
            </div>
          </div>

          {/* Trending Topics Section */}
          <div className={styles.sidebarSection}>
            <h3 className={styles.sidebarTitle}>
              <FiTrendingUp className={styles.sidebarIcon} />
              Trend Mövzular
            </h3>
            <div className={styles.trendingTopics}>
              {trendingTopics.map((topic, index) => (
                <div key={index} className={styles.trendingTopic}>
                  <div className={styles.topicInfo}>
                    <span className={styles.topicName}>{topic.name}</span>
                    <span className={styles.topicCount}>
                      {topic.count} tapşırıq
                    </span>
                  </div>
                  <div
                    className={`${styles.topicTrend} ${styles[topic.trend]}`}
                  >
                    {topic.trend === "up" ? "↗" : "↘"}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activities Section */}
          <div className={styles.sidebarSection}>
            <h3 className={styles.sidebarTitle}>
              <FiEye className={styles.sidebarIcon} />
              Son Fəaliyyətlər
            </h3>
            <div className={styles.recentActivities}>
              {recentActivities.map((activity, index) => (
                <div key={index} className={styles.activityItem}>
                  <div className={styles.activityAvatar}>
                    {activity.user.charAt(0)}
                  </div>
                  <div className={styles.activityContent}>
                    <span className={styles.activityUser}>{activity.user}</span>
                    <span className={styles.activityAction}>
                      {activity.action === "solved" && "həll etdi"}
                      {activity.action === "started" && "başladı"}
                      {activity.action === "completed" && "tamamladı"}
                      {activity.action === "achieved" && "nailiyyət əldə etdi"}
                    </span>
                    <span className={styles.activityExercise}>
                      {activity.exercise}
                    </span>
                  </div>
                  <span className={styles.activityTime}>{activity.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Daily Goal Section */}
          <div className={styles.sidebarSection}>
            <h3 className={styles.sidebarTitle}>
              <FiCalendar className={styles.sidebarIcon} />
              Günlük Məqsəd
            </h3>
            <div className={styles.dailyGoal}>
              <div className={styles.goalProgress}>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{ width: "65%" }}
                  ></div>
                </div>
                <span className={styles.progressText}>65% tamamlandı</span>
              </div>
              <p className={styles.goalText}>Günlük 3 tapşırıq həll edin</p>
              <button className={styles.goalButton}>
                <FiPlay className={styles.goalButtonIcon} />
                Tapşırıq tap
              </button>
            </div>
          </div>

          {/* Popular Tags Section */}
          <div className={styles.sidebarSection}>
            <h3 className={styles.sidebarTitle}>
              <FiCode className={styles.sidebarIcon} />
              Populyar Tag-lər
            </h3>
            <div className={styles.popularTags}>
              {["Array", "String", "Dynamic Programming", "Tree", "Graph", "Binary Search", "Two Pointers", "Greedy", "Backtracking", "Sorting"].map((tag, index) => (
                <span key={index} className={styles.popularTagItem}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </aside>
      </div>

      <Footer />
    </>
  );
}
