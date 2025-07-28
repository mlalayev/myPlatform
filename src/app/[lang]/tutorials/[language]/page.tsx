"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import CodeLoader from "../../components/loading/CodeLoader";
import Link from "next/link";
import * as FiIcons from "react-icons/fi";
import {
  SiReact,
  SiVuedotjs,
  SiAngular,
  SiSvelte,
  SiNextdotjs,
  SiNodedotjs,
} from "react-icons/si";
import {
  SiJavascript,
  SiPython,
  SiC,
  SiCplusplus,
  SiGo,
  SiRust,
  SiTypescript,
  SiPhp,
  SiSwift,
  SiKotlin,
  SiRuby,
  SiR,
  SiMysql,
  SiGnubash,
  SiScala,
  SiDart,
  SiHaskell,
  SiOpenjdk,
} from "react-icons/si";
import styles from "../TutorialsPage.module.css";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";

// Language name mapping for API calls and file paths
const LANGUAGE_MAPPING: { [key: string]: string } = {
  "C#": "csharp",
  JavaScript: "javascript",
  Python: "python",
  Java: "java",
  C: "c",
  "C++": "c%2B%2B",
  "Go (Golang)": "go",
  Rust: "rust",
  TypeScript: "typescript",
  PHP: "php",
  Swift: "swift",
  Kotlin: "kotlin",
  Ruby: "ruby",
  R: "r",
  SQL: "sql",
  "Shell/Bash": "bash",
  Scala: "scala",
  Dart: "dart",
  Haskell: "haskell",
};

// Helper function to get API name from display name
const getApiLanguageName = (displayName: string): string => {
  return LANGUAGE_MAPPING[displayName] || displayName.toLowerCase();
};

type LanguageProgress = {
  [key: string]: { percent: number; visited: number; total: number };
};
type VisitedLessonsByLang = { [key: string]: string[] };
type Topic = {
  id: string;
  title: string;
  icon?: string;
  available?: boolean;
  description?: string;
  progress?: number;
};
type LanguageTopics = { [key: string]: Topic[] };

const frameworks = [
  {
    name: "React",
    icon: <SiReact size={32} color="#61dafb" />,
    available: true,
    description: "UI Kitabxanası.",
    progress: 75,
  },
  {
    name: "Vue.js",
    icon: <SiVuedotjs size={32} color="#42b883" />,
    available: true,
    description: "Progressive framework.",
    progress: 60,
  },
  {
    name: "Angular",
    icon: <SiAngular size={32} color="#dd0031" />,
    available: true,
    description: "Platform for web apps.",
    progress: 45,
  },
  {
    name: "Svelte",
    icon: <SiSvelte size={32} color="#ff3e00" />,
    available: true,
    description: "Cybernetically enhanced UI.",
    progress: 30,
  },
  {
    name: "Next.js",
    icon: <SiNextdotjs size={32} color="#000" />,
    available: false,
    description: "React framework.",
    progress: 0,
  },
  {
    name: "Node.js",
    icon: <SiNodedotjs size={32} color="#43853d" />,
    available: false,
    description: "Server-side JS.",
    progress: 0,
  },
];

const languages = [
  {
    name: "JavaScript",
    icon: <SiJavascript size={32} color="#f7df1e" />,
    available: true,
    description: "Web üçün.",
    progress: 85,
  },
  {
    name: "Python",
    icon: <SiPython size={32} color="#3572A5" />,
    available: true,
    description: "Data science, backend.",
    progress: 0,
  },
  {
    name: "Java",
    icon: <SiOpenjdk size={32} color="#b07219" />,
    available: true,
    description: "Android, enterprise.",
    progress: 0,
  },
  {
    name: "C",
    icon: <SiC size={32} color="#00599C" />,
    available: true,
    description: "Sistem proqramları.",
    progress: 0,
  },
  {
    name: "C++",
    icon: <SiCplusplus size={32} color="#00599C" />,
    available: true,
    description: "Oyunlar, performans.",
    progress: 0,
  },
  {
    name: "C#",
    icon: <FiIcons.FiHash size={32} color="#178600" />,
    available: true,
    description: ".NET, Unity.",
    progress: 0,
  },
  {
    name: "Go (Golang)",
    icon: <SiGo size={32} color="#00ADD8" />,
    available: false,
    description: "Backend.",
    progress: 0,
  },
  {
    name: "Rust",
    icon: <SiRust size={32} color="#dea584" />,
    available: false,
    description: "Təhlükəsizlik, performans.",
    progress: 0,
  },
  {
    name: "TypeScript",
    icon: <SiTypescript size={32} color="#3178c6" />,
    available: true,
    description: "Tipli JS.",
    progress: 0,
  },
  {
    name: "PHP",
    icon: <SiPhp size={32} color="#777bb4" />,
    available: true,
    description: "Web backend.",
    progress: 0,
  },
  {
    name: "Swift",
    icon: <SiSwift size={32} color="#ffac45" />,
    available: false,
    description: "iOS/macOS.",
    progress: 0,
  },
  {
    name: "Kotlin",
    icon: <SiKotlin size={32} color="#7f52ff" />,
    available: false,
    description: "Android.",
    progress: 0,
  },
  {
    name: "Ruby",
    icon: <SiRuby size={32} color="#cc342d" />,
    available: false,
    description: "Web backend.",
    progress: 0,
  },
  {
    name: "R",
    icon: <SiR size={32} color="#276dc3" />,
    available: false,
    description: "Statistika, data.",
    progress: 0,
  },
  {
    name: "SQL",
    icon: <SiMysql size={32} color="#00758f" />,
    available: false,
    description: "Verilənlər bazası.",
    progress: 0,
  },
  {
    name: "Shell/Bash",
    icon: <SiGnubash size={32} color="#4eaa25" />,
    available: false,
    description: "Sistem əmrləri.",
    progress: 0,
  },
  {
    name: "Scala",
    icon: <SiScala size={32} color="#c22d40" />,
    available: false,
    description: "Functional, OOP.",
    progress: 0,
  },
  {
    name: "Dart",
    icon: <SiDart size={32} color="#00b4ab" />,
    available: false,
    description: "Mobil app.",
    progress: 0,
  },
  {
    name: "Haskell",
    icon: <SiHaskell size={32} color="#5e5086" />,
    available: false,
    description: "Functional.",
    progress: 0,
  },
];

export default function TutorialLanguagePage() {
  const { language, lang } = useParams();
  const router = useRouter();
  const langKey = Array.isArray(lang) ? lang[0] : lang || "az";

  const [languageProgress, setLanguageProgress] = useState<LanguageProgress>({});
  const [redirecting, setRedirecting] = useState(false);

  // Move all hooks to the top level
  // For frameworks/languages/algorithms/data-structures views
  const [languageTopics, setLanguageTopics] = React.useState<LanguageTopics>(
    {}
  );
  const [loadingLangs, setLoadingLangs] = React.useState(true);
  const [topics, setTopics] = React.useState<Topic[]>([]);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    if (language === "algorithms" || language === "data-structures" || language === "topics") {
      fetch(`/tutorials/${language}/topics.json`)
        .then(res => res.json())
        .then(data => {
          const topics = data[langKey] || [];
          if (topics.length > 0) {
            const firstTopicId = topics[0].id;
            setRedirecting(true);
            router.replace(`/${langKey}/tutorials/languages/${language}/${firstTopicId}`);
          }
        });
    }
  }, [language, langKey, router]);

  useEffect(() => {
    // Fetch progress for available languages only
    const fetchAllProgress = async () => {
      const progressData: LanguageProgress = {};
      let visitedLessonsByLang: VisitedLessonsByLang = {};
      try {
        const res = await fetch("/api/user/lessons");
        if (res.ok) {
          const data = await res.json();
          visitedLessonsByLang =
            typeof data === "object" && !Array.isArray(data) && data !== null
              ? data
              : {};
        } else {
          visitedLessonsByLang = JSON.parse(
            localStorage.getItem("visitedLessons") || "{}"
          );
        }
      } catch (e) {
        visitedLessonsByLang = JSON.parse(
          localStorage.getItem("visitedLessons") || "{}"
        );
      }
      for (const lang of languages) {
        const apiLangName = getApiLanguageName(lang.name);
        console.log(`Language: ${lang.name}, API Name: ${apiLangName}`);
        if (!lang.available) {
          progressData[apiLangName] = { percent: 0, visited: 0, total: 0 };
          continue;
        }
        let topics: Topic[] = [];
        try {
          const res = await fetch(`/api/tutorials/${apiLangName}/topics`);
          if (res.ok) {
            const data = await res.json();
            topics = data[langKey] || [];
            console.log(`${apiLangName} topics from API:`, topics.length);
          }
        } catch (e) {
          try {
            const res = await fetch(`/tutorials/${apiLangName}/topics.json`);
            if (res.ok) {
              const data = await res.json();
              topics = data[langKey] || [];
              console.log(`${apiLangName} topics from JSON:`, topics.length);
            }
          } catch (e2) {
            topics = [];
            console.log(`${apiLangName} no topics found`);
          }
        }
        const total = topics.length;
        const topicIds = new Set(topics.map((t: Topic) => t.id));
        const arr: string[] = Array.isArray(visitedLessonsByLang[apiLangName])
          ? visitedLessonsByLang[apiLangName]
          : [];
        const visitedCount = arr.filter((id: string) =>
          topicIds.has(id)
        ).length;
        const percent =
          total > 0 ? Math.round((visitedCount / total) * 100) : 0;
        console.log(`${apiLangName} progress: ${visitedCount}/${total} = ${percent}%`);
        progressData[apiLangName] = { percent, visited: visitedCount, total };
      }
      setLanguageProgress(progressData);
    };
    fetchAllProgress();
  }, [langKey]);

  React.useEffect(() => {
    if (language !== "languages") return;
    if (!langKey) return;
    const availableLanguages = languages.filter((lang) => lang.available);
    const fetchPromises = availableLanguages.map((lang) => {
      const apiLangName = getApiLanguageName(lang.name);
      return fetch(`/api/tutorials/${apiLangName}/topics`)
        .then((res) => res.json())
        .then((data) => ({
          lang: apiLangName,
          displayName: lang.name,
          topics: (data[langKey] || []) as Topic[],
        }))
        .catch(() => ({
          lang: apiLangName,
          displayName: lang.name,
          topics: [] as Topic[],
        }));
    });
    Promise.all(fetchPromises)
      .then((results) => {
        const topicsMap: LanguageTopics = {};
        results.forEach(
          ({ lang, topics }: { lang: string; topics: Topic[] }) => {
            topicsMap[lang] = topics;
          }
        );
        setLanguageTopics(topicsMap);
        setLoadingLangs(false);
      })
      .catch(() => setLoadingLangs(false));
  }, [langKey, language]);

  React.useEffect(() => {
    if (language === "languages") return;
    if (!language || !langKey) return;
    fetch(`/api/tutorials/${language}/topics`)
      .then((res) => res.json())
      .then((data) => {
        const arr = data[langKey] || [];
        const topicsWithProgress = arr.map((topic: Topic) => ({
          ...topic,
          progress: Math.floor(Math.random() * 100),
          available: true,
          description: topic.description || "Təlimat və nümunələr",
        }));
        setTopics(topicsWithProgress);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [language, langKey]);

  // Back button handler
  const handleBack = () => {
    router.push(`/${langKey}/tutorials`);
  };

  // Card component for tutorials
  interface TutorialCardProps {
    item: {
      name: string;
      icon: React.ReactNode;
      available: boolean;
      description: string;
      progress: number;
    };
    isLink?: boolean;
    href?: string;
  }
  const TutorialCard = ({
    item,
    isLink = false,
    href = "",
  }: TutorialCardProps) => {
    const apiLangName = getApiLanguageName(item.name);
    const progress = languageProgress[apiLangName] || {
      percent: 0,
      visited: 0,
      total: 0,
    };
    const unavailable = !item.available;

    const cardContent = (
      <div
        className={
          unavailable
            ? `${styles.tutorialCard} ${styles.tutorialCardUnavailable}`
            : styles.tutorialCard
        }
      >
        <div className={styles.availableBadge}>
          {unavailable ? "Tezliklə" : `${progress.visited}/${progress.total}`}
        </div>
        <div className={styles.cardTopRow}>
          <div className={styles.tutorialCardIcon}>{item.icon}</div>
          <div className={styles.tutorialCardInfo}>
            <div className={styles.tutorialCardTitle}>{item.name}</div>
            <div className={styles.tutorialCardDesc}>{item.description}</div>
          </div>
        </div>
        <div className={styles.progressBarSection}>
          <div className={styles.progressBarContainer}>
            <div
              className={
                unavailable
                  ? `${styles.progressBarFill} ${styles.unavailable}`
                  : styles.progressBarFill
              }
              style={{ width: `${progress.percent}%` }}
            />
          </div>
          <span className={styles.progressPercent}>{progress.percent}%</span>
        </div>
      </div>
    );
    if (isLink) {
      return (
        <Link href={href} style={{ textDecoration: "none" }}>
          {cardContent}
        </Link>
      );
    }
    return cardContent;
  };

  if (redirecting) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', fontSize: 22 }}>
        <CodeLoader />
        <div style={{ marginTop: 24 }}>Yönləndirilir...</div>
      </div>
    );
  }

  // List view for frameworks
  if (language === "frameworks") {
    return (
      <>
        <Header />
        <div className={styles.categoryListWrapper}>
          <h2 className={styles.tutorialsTitle}>Frameworklər</h2>
          <div className={styles.tutorialsGrid}>
            {frameworks.map((fw) => (
              <TutorialCard key={fw.name} item={fw} />
            ))}
          </div>
          <button className={styles.backButton} onClick={handleBack}>
            <FiIcons.FiChevronLeft /> Geri
          </button>
        </div>
        <Footer />
      </>
    );
  }

  // List view for programming languages
  if (language === "languages") {
    const getFirstTopicHref = (langName: string): string => {
      const apiLangName = getApiLanguageName(langName);
      const topics = languageTopics[apiLangName];
      if (topics && topics.length > 0) {
        return `/${langKey}/tutorials/languages/${apiLangName}/${topics[0].id}`;
      }
      return `/${langKey}/tutorials/languages/${apiLangName}`;
    };

    return (
      <>
        <Header />
        <div className={styles.categoryListWrapper}>
          <h2 className={styles.tutorialsTitle}>Proqramlaşdırma Dilləri</h2>
          <div
            className={styles.tutorialsGrid}
            style={
              loadingLangs
                ? {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: 300,
                  }
                : {}
            }
          >
            {loadingLangs ? (
              <CodeLoader />
            ) : (
              languages
                .slice()
                .sort((a, b) =>
                  a.available === b.available ? 0 : a.available ? -1 : 1
                )
                .map((lang) => (
                  <TutorialCard
                    key={lang.name}
                    item={lang}
                    isLink={lang.available}
                    href={getFirstTopicHref(lang.name)}
                  />
                ))
            )}
          </div>
          <button className={styles.backButton} onClick={handleBack}>
            <FiIcons.FiChevronLeft /> Geri
          </button>
        </div>
        <Footer />
      </>
    );
  }

  // List view for algorithms/data-structures (fetch topics)
  const getFirstTopicHref = (langName: string): string => {
    const apiLangName = getApiLanguageName(langName);
    const topics = languageTopics[apiLangName];
    if (topics && topics.length > 0) {
      return `/${langKey}/tutorials/languages/${apiLangName}/${topics[0].id}`;
    }
    return `/${langKey}/tutorials/languages/${apiLangName}`;
  };

  return (
    <>
      <Header />
      <div className={styles.categoryListWrapper}>
        <h2 className={styles.tutorialsTitle}>
          {language === "algorithms" ? "Alqoritmlər" : "Məlumat Strukturları"}
        </h2>
        <div className={styles.tutorialsGrid}>
          {loading ? (
            <CodeLoader />
          ) : topics.length === 0 ? (
            <div
              style={{
                color: "#aaa",
                textAlign: "center",
                marginTop: 40,
                gridColumn: "1 / -1",
              }}
            >
              Mövzu yoxdur.
            </div>
          ) : (
            topics.map((topic: Topic) => {
              const Icon =
                (
                  FiIcons as Record<
                    string,
                    React.ComponentType<{ size: number; color: string }>
                  >
                )[topic.icon || "FiBookOpen"] || FiIcons.FiBookOpen;
              const topicItem = {
                name: topic.title,
                icon: <Icon size={32} color="#007bff" />,
                available: topic.available ?? true,
                description: topic.description ?? "Təlimat və nümunələr",
                progress: topic.progress ?? 0,
              };

              return (
                <TutorialCard
                  key={topic.id}
                  item={topicItem}
                  isLink={true}
                  href={`/${langKey}/tutorials/languages/${language}/${topic.id}`}
                />
              );
            })
          )}
        </div>
        <button className={styles.backButton} onClick={handleBack}>
          <FiIcons.FiChevronLeft /> Geri
        </button>
      </div>
      <Footer />
    </>
  );
}
