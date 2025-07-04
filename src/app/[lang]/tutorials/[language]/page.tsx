"use client";
import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import CodeLoader from "../../components/loading/CodeLoader";
import Link from "next/link";
import * as FiIcons from "react-icons/fi";
import { SiReact, SiVuedotjs, SiAngular, SiSvelte, SiNextdotjs, SiNodedotjs } from "react-icons/si";
import { SiJavascript, SiPython, SiC, SiCplusplus, SiGo, SiRust, SiTypescript, SiPhp, SiSwift, SiKotlin, SiRuby, SiR, SiMysql, SiGnubash, SiScala, SiDart, SiHaskell, SiOpenjdk } from "react-icons/si";
import styles from "../TutorialsPage.module.css";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";

const frameworks = [
  { name: "React", icon: <SiReact size={32} color="#61dafb" />, available: true, description: "UI Kitabxanası.", progress: 75 },
  { name: "Vue.js", icon: <SiVuedotjs size={32} color="#42b883" />, available: true, description: "Progressive framework.", progress: 60 },
  { name: "Angular", icon: <SiAngular size={32} color="#dd0031" />, available: true, description: "Platform for web apps.", progress: 45 },
  { name: "Svelte", icon: <SiSvelte size={32} color="#ff3e00" />, available: true, description: "Cybernetically enhanced UI.", progress: 30 },
  { name: "Next.js", icon: <SiNextdotjs size={32} color="#000" />, available: false, description: "React framework.", progress: 0 },
  { name: "Node.js", icon: <SiNodedotjs size={32} color="#43853d" />, available: false, description: "Server-side JS.", progress: 0 },
];

const languages = [
  { name: "JavaScript", icon: <SiJavascript size={32} color="#f7df1e" />, available: true, description: "Web üçün.", progress: 85 },
  { name: "Python", icon: <SiPython size={32} color="#3572A5" />, available: false, description: "Data science, backend.", progress: 0 },
  { name: "Java", icon: <SiOpenjdk size={32} color="#b07219" />, available: false, description: "Android, enterprise.", progress: 0 },
  { name: "C", icon: <SiC size={32} color="#00599C" />, available: false, description: "Sistem proqramları.", progress: 0 },
  { name: "C++", icon: <SiCplusplus size={32} color="#00599C" />, available: false, description: "Oyunlar, performans.", progress: 0 },
  { name: "C#", icon: <FiIcons.FiHash size={32} color="#178600" />, available: false, description: ".NET, Unity.", progress: 0 },
  { name: "Go (Golang)", icon: <SiGo size={32} color="#00ADD8" />, available: false, description: "Backend.", progress: 0 },
  { name: "Rust", icon: <SiRust size={32} color="#dea584" />, available: false, description: "Təhlükəsizlik, performans.", progress: 0 },
  { name: "TypeScript", icon: <SiTypescript size={32} color="#3178c6" />, available: false, description: "Tipli JS.", progress: 0 },
  { name: "PHP", icon: <SiPhp size={32} color="#777bb4" />, available: false, description: "Web backend.", progress: 0 },
  { name: "Swift", icon: <SiSwift size={32} color="#ffac45" />, available: false, description: "iOS/macOS.", progress: 0 },
  { name: "Kotlin", icon: <SiKotlin size={32} color="#7f52ff" />, available: false, description: "Android.", progress: 0 },
  { name: "Ruby", icon: <SiRuby size={32} color="#cc342d" />, available: false, description: "Web backend.", progress: 0 },
  { name: "R", icon: <SiR size={32} color="#276dc3" />, available: false, description: "Statistika, data.", progress: 0 },
  { name: "SQL", icon: <SiMysql size={32} color="#00758f" />, available: false, description: "Verilənlər bazası.", progress: 0 },
  { name: "Shell/Bash", icon: <SiGnubash size={32} color="#4eaa25" />, available: false, description: "Sistem əmrləri.", progress: 0 },
  { name: "Scala", icon: <SiScala size={32} color="#c22d40" />, available: false, description: "Functional, OOP.", progress: 0 },
  { name: "Dart", icon: <SiDart size={32} color="#00b4ab" />, available: false, description: "Mobil app.", progress: 0 },
  { name: "Haskell", icon: <SiHaskell size={32} color="#5e5086" />, available: false, description: "Functional.", progress: 0 },
];

export default function TutorialLanguagePage() {
  const { language, lang } = useParams();
  const router = useRouter();
  const langKey = Array.isArray(lang) ? lang[0] : lang;

  // Back button handler
  const handleBack = () => {
    router.push(`/${langKey}/tutorials`);
  };

  // Card component for tutorials
  const TutorialCard = ({ item, isLink = false, href = "" }: { item: any, isLink?: boolean, href?: string }) => {
    const cardContent = (
      <div className={item.available ? styles.tutorialCard : styles.tutorialCard + ' ' + styles.tutorialCardUnavailable}>
        {!item.available && <div className={styles.comingSoonBadge}>Tezliklə</div>}
        <div className={styles.tutorialCardHeader}>
          <div className={styles.tutorialCardIcon}>
            {item.icon}
          </div>
          <div className={styles.tutorialCardInfo}>
            <div className={styles.tutorialCardTitle}>{item.name}</div>
            <div className={styles.tutorialCardDesc}>{item.description}</div>
          </div>
        </div>
        
        <div className={styles.progressSection}>
          <div className={styles.progressLabel}>
            <span className={styles.progressText}>Tərəqqi</span>
            <span className={styles.progressPercentage}>{item.progress}%</span>
          </div>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill} 
              style={{ width: `${item.progress}%` }}
            ></div>
          </div>
        </div>
      </div>
    );

    if (isLink && item.available) {
      return <Link href={href} style={{ textDecoration: 'none' }}>{cardContent}</Link>;
    }
    
    return cardContent;
  };

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
    const [languageTopics, setLanguageTopics] = React.useState<{[key: string]: any[]}>({});
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
      if (!langKey) return;
      
      // Fetch topics for available languages
      const availableLanguages = languages.filter(lang => lang.available);
      const fetchPromises = availableLanguages.map(lang => 
        fetch(`/api/tutorials/${lang.name.toLowerCase()}/topics`)
          .then(res => res.json())
          .then(data => ({ lang: lang.name.toLowerCase(), topics: data[langKey] || [] }))
          .catch(() => ({ lang: lang.name.toLowerCase(), topics: [] }))
      );

      Promise.all(fetchPromises)
        .then(results => {
          const topicsMap: {[key: string]: any[]} = {};
          results.forEach(({ lang, topics }) => {
            topicsMap[lang] = topics;
          });
          setLanguageTopics(topicsMap);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }, [langKey]);

    const getFirstTopicHref = (langName: string) => {
      const topics = languageTopics[langName.toLowerCase()];
      if (topics && topics.length > 0) {
        return `/${langKey}/tutorials/languages/${langName.toLowerCase()}/${topics[0].id}`;
      }
      return `/${langKey}/tutorials/languages/${langName.toLowerCase()}`;
    };

    return (
      <>
        <Header />
        <div className={styles.categoryListWrapper}>
          <h2 className={styles.tutorialsTitle}>Proqramlaşdırma Dilləri</h2>
          <div className={styles.tutorialsGrid}>
            {loading ? (
              <CodeLoader />
            ) : (
              languages.map((lang) => (
                <TutorialCard 
                  key={lang.name} 
                  item={lang} 
                  isLink={lang.available}
                  href={lang.available ? getFirstTopicHref(lang.name) : ""}
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
  const [topics, setTopics] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    if (!language || !langKey) return;
    fetch(`/api/tutorials/${language}/topics`)
      .then((res) => res.json())
      .then((data) => {
        const arr = data[langKey] || [];
        // Add mock progress data for topics
        const topicsWithProgress = arr.map((topic: any) => ({
          ...topic,
          progress: Math.floor(Math.random() * 100), // Mock progress - will be replaced with real data later
          available: true,
          description: topic.description || "Təlimat və nümunələr"
        }));
        setTopics(topicsWithProgress);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [language, langKey]);

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
            <div style={{ color: "#aaa", textAlign: "center", marginTop: 40, gridColumn: "1 / -1" }}>Mövzu yoxdur.</div>
          ) : (
            topics.map((topic) => {
              const Icon = (FiIcons as any)[topic.icon] || FiIcons.FiBookOpen;
              const topicItem = {
                name: topic.title,
                icon: <Icon size={32} color="#007bff" />,
                available: topic.available,
                description: topic.description,
                progress: topic.progress
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
