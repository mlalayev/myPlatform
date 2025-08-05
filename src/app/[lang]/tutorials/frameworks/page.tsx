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
import styles from "../TutorialsLanguagePage.module.css";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import HeroSection from "../../components/heroSection/HeroSection";

// Framework name mapping for API calls and file paths
const FRAMEWORK_MAPPING: { [key: string]: string } = {
  "React": "react",
  "Vue.js": "vue",
  "Angular": "angular",
  "Svelte": "svelte",
  "Next.js": "nextjs",
  "Node.js": "nodejs",
};

// Helper function to get API name from display name
const getApiFrameworkName = (displayName: string): string => {
  return FRAMEWORK_MAPPING[displayName] || displayName.toLowerCase();
};

type FrameworkProgress = {
  [key: string]: { percent: number; visited: number; total: number };
};
type VisitedLessonsByFramework = { [key: string]: string[] };
type Topic = {
  id: string;
  title: string;
  icon?: string;
  available?: boolean;
  description?: string;
  progress?: number;
};
type FrameworkTopics = { [key: string]: Topic[] };

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
    available: true,
    description: "React framework.",
    progress: 25,
  },
  {
    name: "Node.js",
    icon: <SiNodedotjs size={32} color="#43853d" />,
    available: false,
    description: "Server-side JS.",
    progress: 0,
  },
];

export default function TutorialsFrameworksPage() {
  const { lang } = useParams();
  const router = useRouter();
  const langKey = Array.isArray(lang) ? lang[0] : lang || "az";

  const [frameworkProgress, setFrameworkProgress] = useState<FrameworkProgress>({});
  const [frameworkTopics, setFrameworkTopics] = React.useState<FrameworkTopics>({});
  const [loadingFrameworks, setLoadingFrameworks] = React.useState(true);

  // Back button handler
  const handleBack = () => {
    router.push(`/${langKey}/tutorials`);
  };

  // Fetch all framework progress
  useEffect(() => {
    const fetchAllProgress = async () => {
      const progressData: FrameworkProgress = {};
      let visitedLessonsByFramework: VisitedLessonsByFramework = {};
      
      try {
        const res = await fetch("/api/user/lessons");
        if (res.ok) {
          const data = await res.json();
          visitedLessonsByFramework =
            typeof data === "object" && !Array.isArray(data) && data !== null
              ? data
              : {};
        } else {
          visitedLessonsByFramework = JSON.parse(
            localStorage.getItem("visitedLessons") || "{}"
          );
        }
      } catch (e) {
        visitedLessonsByFramework = JSON.parse(
          localStorage.getItem("visitedLessons") || "{}"
        );
      }

      for (const framework of frameworks) {
        const apiFrameworkName = getApiFrameworkName(framework.name);
        console.log(`Framework: ${framework.name}, API Name: ${apiFrameworkName}`);
        
        if (!framework.available) {
          progressData[apiFrameworkName] = { percent: 0, visited: 0, total: 0 };
          continue;
        }

        let topics: Topic[] = [];
        try {
          const res = await fetch(`/api/tutorials/${apiFrameworkName}/topics`);
          if (res.ok) {
            const data = await res.json();
            topics = data[langKey] || [];
            console.log(`${apiFrameworkName} topics from API:`, topics.length);
          }
        } catch (e) {
          try {
            const res = await fetch(`/tutorials/${apiFrameworkName}/topics.json`);
            if (res.ok) {
              const data = await res.json();
              topics = data[langKey] || [];
              console.log(`${apiFrameworkName} topics from JSON:`, topics.length);
            }
          } catch (e2) {
            topics = [];
            console.log(`${apiFrameworkName} no topics found`);
          }
        }

        const total = topics.length;
        const topicIds = new Set(topics.map((t: Topic) => t.id));
        const arr: string[] = Array.isArray(visitedLessonsByFramework[apiFrameworkName])
          ? visitedLessonsByFramework[apiFrameworkName]
          : [];
        const visitedCount = arr.filter((id: string) =>
          topicIds.has(id)
        ).length;
        const percent =
          total > 0 ? Math.round((visitedCount / total) * 100) : 0;
        console.log(`${apiFrameworkName} progress: ${visitedCount}/${total} = ${percent}%`);
        progressData[apiFrameworkName] = { percent, visited: visitedCount, total };
      }
      setFrameworkProgress(progressData);
    };
    fetchAllProgress();
  }, [langKey]);

  // Fetch framework topics
  React.useEffect(() => {
    if (!langKey) return;
    const availableFrameworks = frameworks.filter((fw) => fw.available);
    const fetchPromises = availableFrameworks.map((framework) => {
      const apiFrameworkName = getApiFrameworkName(framework.name);
      return fetch(`/api/tutorials/${apiFrameworkName}/topics`)
        .then((res) => res.json())
        .then((data) => ({
          framework: apiFrameworkName,
          displayName: framework.name,
          topics: (data[langKey] || []) as Topic[],
        }))
        .catch(() => ({
          framework: apiFrameworkName,
          displayName: framework.name,
          topics: [] as Topic[],
        }));
    });
    Promise.all(fetchPromises)
      .then((results) => {
        const topicsMap: FrameworkTopics = {};
        results.forEach(
          ({ framework, topics }: { framework: string; topics: Topic[] }) => {
            topicsMap[framework] = topics;
          }
        );
        setFrameworkTopics(topicsMap);
        setLoadingFrameworks(false);
      })
      .catch(() => setLoadingFrameworks(false));
  }, [langKey]);

  // Card component for frameworks
  interface FrameworkCardProps {
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
  
  const FrameworkCard = ({
    item,
    isLink = false,
    href = "",
  }: FrameworkCardProps) => {
    const apiFrameworkName = getApiFrameworkName(item.name);
    const progress = frameworkProgress[apiFrameworkName] || {
      percent: 0,
      visited: 0,
      total: 0,
    };
    const unavailable = !item.available;
    const isCompleted = progress.percent === 100 && progress.total > 0;

    const cardContent = (
      <div
        className={
          unavailable
            ? `${styles.languageItem} ${styles.languageItemUnavailable}`
            : isCompleted
            ? `${styles.languageItem} ${styles.completed}`
            : styles.languageItem
        }
      >
        <div className={styles.itemContent}>
          <div className={styles.itemLeft}>
            <div className={styles.itemIcon}>
              {item.icon}
            </div>
            <div className={styles.itemInfo}>
              <h3 className={styles.itemTitle}>{item.name}</h3>
              <p className={styles.itemDescription}>{item.description}</p>
            </div>
          </div>
          <div className={styles.itemRight}>
            {unavailable ? (
              <span className={styles.comingSoonBadge}>Tezliklə</span>
            ) : (
              <span className={styles.progressBadge}>
                {progress.visited}/{progress.total}
              </span>
            )}
          </div>
        </div>
        
        {!unavailable && (
          <div className={styles.progressSection}>
            <div className={styles.progressBar}>
              <div
                className={`${styles.progressFill} ${isCompleted ? styles.completedProgress : ''}`}
                style={{ width: `${progress.percent}%` }}
              />
            </div>
            <span className={`${styles.progressText} ${isCompleted ? styles.completedText : ''}`}>
              {progress.percent}% tamamlandı
            </span>
          </div>
        )}
        
        {isCompleted && (
          <div className={styles.completedBadge}>
            <FiIcons.FiCheck size={16} />
            Tamamlandı
          </div>
        )}
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

  return (
    <>
      <Header />
      <HeroSection 
        titleKey="tutorials.frameworks.title"
        subtitleKey="tutorials.frameworks.subtitle"
      />
      <div className={styles.languagesWrapper}>
        <div className={styles.languagesList}>
          {loadingFrameworks ? (
            <div className={styles.loadingContainer}>
              <CodeLoader />
              <div className={styles.loadingText}>Frameworklər yüklənir...</div>
            </div>
          ) : (
            frameworks
              .slice()
              .sort((a, b) =>
                a.available === b.available ? 0 : a.available ? -1 : 1
              )
              .map((framework) => {
                const getFirstTopicHref = (frameworkName: string): string => {
                  const apiFrameworkName = getApiFrameworkName(frameworkName);
                  const topics = frameworkTopics[apiFrameworkName];
                  if (topics && topics.length > 0) {
                    return `/${langKey}/tutorials/frameworks/${apiFrameworkName}/${topics[0].id}`;
                  }
                  return `/${langKey}/tutorials/frameworks/${apiFrameworkName}`;
                };

                return (
                  <FrameworkCard
                    key={framework.name}
                    item={framework}
                    isLink={framework.available}
                    href={getFirstTopicHref(framework.name)}
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