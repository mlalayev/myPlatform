"use client";
import React, { useState, useEffect } from "react";
import styles from "./ExercisesList.module.css";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import HeroSection from "../components/heroSection/HeroSection";
import Link from "next/link";
import { FiSearch, FiFilter, FiTrendingUp, FiCalendar, FiCode, FiUsers, FiClock, FiMinusCircle, FiDatabase, FiTarget, FiZap, FiAward, FiCheckCircle, FiXCircle } from "react-icons/fi";
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
  diff === "Asan"
    ? styles.diffEasy
    : diff === "Orta"
    ? styles.diffMed
    : styles.diffHard;

const difficultyIcon = (diff: string) => {
  switch (diff) {
    case "Asan":
      return "🟢";
    case "Orta":
      return "🟡";
    case "Çətin":
      return "🔴";
    default:
      return "⚪";
  }
};

export default function ExercisesPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("ALL");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [statuses, setStatuses] = useState<{ [id: number]: "not_submitted" | "wrong" | "correct" }>({});
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  });
  const [filters, setFilters] = useState({
    difficulties: [] as Array<{ difficulty: string; count: number }>,
    categories: [] as Array<{ category: string; count: number }>
  });
  
  const pathname = usePathname();
  const currentLang = pathname.split("/")[1] || "en";

  // Fetch exercises from API
  useEffect(() => {
    async function fetchExercises() {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          page: pagination.page.toString(),
          limit: '10',
          difficulty: selectedDifficulty,
          category: selectedCategory,
          search: search
        });

        const response = await fetch(`/api/exercises?${params}`);
        const data: ExercisesResponse = await response.json();

        setExercises(data.exercises);
        setPagination(data.pagination);
        setFilters(data.filters);
      } catch (error) {
        console.error('Error fetching exercises:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchExercises();
  }, [pagination.page, selectedDifficulty, selectedCategory, search]);

  // Fetch latest submission status for each exercise
  useEffect(() => {
    async function fetchStatuses() {
      const statusObj: { [id: number]: "not_submitted" | "wrong" | "correct" } = {};
      await Promise.all(
        exercises.map(async (ex: Exercise) => {
          const exId = Number(ex.id);
          try {
            const res = await fetch(`/api/quiz/${exId}/latest`);
            const data = await res.json();
            if (!data.latest) statusObj[exId] = "not_submitted";
            else if (data.hasPassed) statusObj[exId] = "correct";
            else if (data.hasWrong) statusObj[exId] = "wrong";
            else statusObj[exId] = "not_submitted";
          } catch {
            statusObj[exId] = "not_submitted";
          }
        })
      );
      setStatuses(statusObj);
    }
    
    if (exercises.length > 0) {
    fetchStatuses();
    }
  }, [exercises]);

  const stats = {
    total: pagination.total,
    easy: filters.difficulties.find(d => d.difficulty === 'EASY')?.count || 0,
    medium: filters.difficulties.find(d => d.difficulty === 'MEDIUM')?.count || 0,
    hard: filters.difficulties.find(d => d.difficulty === 'HARD')?.count || 0,
  };

  // Exercise-specific hero boxes
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

  return (
    <>
      <Header />
      
      <HeroSection 
        titleKey="exercises.hero.title"
        subtitleKey="exercises.hero.subtitle"
        boxes={exerciseHeroBoxes}
      />

      <div>
        <div className={styles.challengeSlideContainer}>
          <div className={styles.challengeCard} style={{background: 'linear-gradient(120deg, #f7971e 0%, #ffd200 100%)'}}>
            <SiJavascript className={styles.challengeIcon} />
            <div className={styles.challengeTitle}>JavaScript 30 Days Challenge</div>
            <button className={styles.challengeButton}>Start</button>
          </div>
          <div className={styles.challengeCard} style={{background: 'linear-gradient(120deg, #43e97b 0%, #38f9d7 100%)'}}>
            <SiPython className={styles.challengeIcon} />
            <div className={styles.challengeTitle}>Python 30 Days Challenge</div>
            <button className={styles.challengeButton}>Start</button>
          </div>
          <div className={styles.challengeCard} style={{background: 'linear-gradient(120deg, #7f53ac 0%, #657ced 100%)'}}>
            <SiCplusplus className={styles.challengeIcon} />
            <div className={styles.challengeTitle}>C++ 30 Days Challenge</div>
            <button className={styles.challengeButton}>Start</button>
          </div>
          <div className={styles.challengeCard} style={{background: 'linear-gradient(120deg, #f953c6 0%, #b91d73 100%)'}}>
            <SiGo className={styles.challengeIcon} />
            <div className={styles.challengeTitle}>Go 30 Days Challenge</div>
            <button className={styles.challengeButton}>Start</button>
          </div>
          <div className={styles.challengeCard} style={{background: 'linear-gradient(120deg, #43cea2 0%, #185a9d 100%)'}}>
            <SiOpenjdk className={styles.challengeIcon} />
            <div className={styles.challengeTitle}>Java 30 Days Challenge</div>
            <button className={styles.challengeButton}>Start</button>
          </div>
        </div>
      </div>

      <div className={styles.layout}>
        <div className={styles.contentOpen}>
          <div className={styles.page}>
            {/* Search and Filter Section */}
            <div className={styles.headerBar}>
              <div className={styles.filterSection}>
                <div className={styles.filterTitle}>
                  <FiFilter className={styles.filterIcon} />
                  Çətinlik Səviyyəsi
                </div>
                <div className={styles.filterButtons}>
                  <button 
                    className={`${styles.filterBtn} ${selectedDifficulty === "Bütün" ? styles.selected : ""}`}
                    onClick={() => setSelectedDifficulty("Bütün")}
                  >
                    Bütün
                  </button>
                  <button 
                    className={`${styles.filterBtn} ${selectedDifficulty === "Asan" ? styles.selected : ""}`}
                    onClick={() => setSelectedDifficulty("Asan")}
                  >
                    Asan
                  </button>
                  <button 
                    className={`${styles.filterBtn} ${selectedDifficulty === "Orta" ? styles.selected : ""}`}
                    onClick={() => setSelectedDifficulty("Orta")}
                  >
                    Orta
                  </button>
                  <button 
                    className={`${styles.filterBtn} ${selectedDifficulty === "Çətin" ? styles.selected : ""}`}
                    onClick={() => setSelectedDifficulty("Çətin")}
                  >
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

            {/* Results Count */}
            <div className={styles.resultsInfo}>
              <span className={styles.resultsCount}>
                {exercises.length} tapşırıq tapıldı
              </span>
              {search && (
                <span className={styles.searchTerm}>
                  &quot;{search}&quot; üçün nəticələr
                </span>
              )}
            </div>

            {/* Exercises List */}
            <div className={styles.list}>
              {exercises.map((ex) => (
                <Link
                  href={`/${currentLang}/exercises/${ex.id}`}
                  key={ex.id}
                  className={styles.row}
                >
                  <div className={styles.cardHeader}>
                    <div className={styles.cardLeft}>
                      <span className={styles.cardIndex}>#{ex.id}</span>
                      <span className={styles.cellTitle}>{ex.title}</span>
                    </div>
                    <div className={styles.cardRight}>
                      <span className={`${styles.cellDiff} ${difficultyColor(ex.difficulty)}`}>
                        {difficultyIcon(ex.difficulty)} {ex.difficulty}
                      </span>
                      {statuses[Number(ex.id)] === "correct" && <FiCheckCircle color="green" title="Doğru" style={{marginLeft:8, fontSize:22}} />}
                      {statuses[Number(ex.id)] === "wrong" && <FiXCircle color="red" title="Yanlış" style={{marginLeft:8, fontSize:22}} />}
                      {statuses[Number(ex.id)] === "not_submitted" && <FiMinusCircle color="gray" title="Göndərilməyib" style={{marginLeft:8, fontSize:22}} />}
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
                        {ex.content?.timeComplexity || 'O(1)'}
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

            {/* Empty State */}
            {exercises.length === 0 && (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>🔍</div>
                <h3 className={styles.emptyTitle}>Heç bir tapşırıq tapılmadı</h3>
                <p className={styles.emptyText}>
                  Axtarış şərtlərinizi dəyişdirin və ya başqa açar sözlər sınayın
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarSection}>
            <h3 className={styles.sidebarTitle}>
              <FiTrendingUp className={styles.sidebarIcon} />
              Trend Şirkətlər
            </h3>
            <div className={styles.trendingCompanies}>
              <span className={styles.companyTag}>Meta</span>
              <span className={styles.companyTag}>Google</span>
              <span className={styles.companyTag}>Amazon</span>
              <span className={styles.companyTag}>Microsoft</span>
              <span className={styles.companyTag}>Uber</span>
              <span className={styles.companyTag}>Apple</span>
            </div>
          </div>
          
          <div className={styles.sidebarSection}>
            <h3 className={styles.sidebarTitle}>
              <FiCalendar className={styles.sidebarIcon} />
              Günlük Məqsəd
            </h3>
            <div className={styles.dailyGoal}>
              <div className={styles.goalProgress}>
                <div className={styles.progressBar}>
                  <div className={styles.progressFill} style={{width: '65%'}}></div>
                </div>
                <span className={styles.progressText}>65% tamamlandı</span>
              </div>
              <p className={styles.goalText}>Günlük 3 tapşırıq həll edin</p>
            </div>
          </div>

          <div className={styles.sidebarSection}>
            <h3 className={styles.sidebarTitle}>
              <FiCode className={styles.sidebarIcon} />
              Populyar Tag-lər
            </h3>
            <div className={styles.popularTags}>
              <span className={styles.tagItem}>Array</span>
              <span className={styles.tagItem}>String</span>
              <span className={styles.tagItem}>Dynamic Programming</span>
              <span className={styles.tagItem}>Tree</span>
              <span className={styles.tagItem}>Graph</span>
              <span className={styles.tagItem}>Binary Search</span>
            </div>
          </div>
        </aside>
      </div>
      
      <Footer />
    </>
  );
}