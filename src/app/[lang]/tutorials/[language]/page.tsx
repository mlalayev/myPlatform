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
  { name: "React", icon: <SiReact size={32} color="#61dafb" />, available: true, description: "UI Kitabxanası." },
  { name: "Vue.js", icon: <SiVuedotjs size={32} color="#42b883" />, available: true, description: "Progressive framework." },
  { name: "Angular", icon: <SiAngular size={32} color="#dd0031" />, available: true, description: "Platform for web apps." },
  { name: "Svelte", icon: <SiSvelte size={32} color="#ff3e00" />, available: true, description: "Cybernetically enhanced UI." },
  { name: "Next.js", icon: <SiNextdotjs size={32} color="#000" />, available: false, description: "React framework." },
  { name: "Node.js", icon: <SiNodedotjs size={32} color="#43853d" />, available: false, description: "Server-side JS." },
];

const languages = [
  { name: "JavaScript", icon: <SiJavascript size={32} color="#f7df1e" />, available: true, description: "Web üçün." },
  { name: "Python", icon: <SiPython size={32} color="#3572A5" />, available: false, description: "Data science, backend." },
  { name: "Java", icon: <SiOpenjdk size={32} color="#b07219" />, available: false, description: "Android, enterprise." },
  { name: "C", icon: <SiC size={32} color="#00599C" />, available: false, description: "Sistem proqramları." },
  { name: "C++", icon: <SiCplusplus size={32} color="#00599C" />, available: false, description: "Oyunlar, performans." },
  { name: "C#", icon: <FiIcons.FiHash size={32} color="#178600" />, available: false, description: ".NET, Unity." },
  { name: "Go (Golang)", icon: <SiGo size={32} color="#00ADD8" />, available: false, description: "Backend." },
  { name: "Rust", icon: <SiRust size={32} color="#dea584" />, available: false, description: "Təhlükəsizlik, performans." },
  { name: "TypeScript", icon: <SiTypescript size={32} color="#3178c6" />, available: false, description: "Tipli JS." },
  { name: "PHP", icon: <SiPhp size={32} color="#777bb4" />, available: false, description: "Web backend." },
  { name: "Swift", icon: <SiSwift size={32} color="#ffac45" />, available: false, description: "iOS/macOS." },
  { name: "Kotlin", icon: <SiKotlin size={32} color="#7f52ff" />, available: false, description: "Android." },
  { name: "Ruby", icon: <SiRuby size={32} color="#cc342d" />, available: false, description: "Web backend." },
  { name: "R", icon: <SiR size={32} color="#276dc3" />, available: false, description: "Statistika, data." },
  { name: "SQL", icon: <SiMysql size={32} color="#00758f" />, available: false, description: "Verilənlər bazası." },
  { name: "Shell/Bash", icon: <SiGnubash size={32} color="#4eaa25" />, available: false, description: "Sistem əmrləri." },
  { name: "Scala", icon: <SiScala size={32} color="#c22d40" />, available: false, description: "Functional, OOP." },
  { name: "Dart", icon: <SiDart size={32} color="#00b4ab" />, available: false, description: "Mobil app." },
  { name: "Haskell", icon: <SiHaskell size={32} color="#5e5086" />, available: false, description: "Functional." },
];

export default function TutorialLanguagePage() {
  const { language, lang } = useParams();
  const router = useRouter();
  const langKey = Array.isArray(lang) ? lang[0] : lang;

  // Back button handler
  const handleBack = () => {
    router.push(`/${langKey}/tutorials`);
  };

  // List view for frameworks
  if (language === "frameworks") {
    return (
      <>
        <Header />
        <div className={styles.categoryListWrapper}>
          <h2 className={styles.tutorialsTitle}>Frameworklər</h2>
          <div className={styles.list}>
            {frameworks.map((fw) => (
              <div
                key={fw.name}
                className={fw.available ? styles.row : styles.row + ' ' + styles.categoryListItemUnavailable}
              >
                <div className={styles.cardHeader}>
                  <div className={styles.cardLeft}>
                    <span className={styles.categoryListIcon}>{fw.icon}</span>
                    <span className={styles.cellTitle}>{fw.name}</span>
                  </div>
                </div>
              </div>
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
    return (
      <>
        <Header />
        <div className={styles.categoryListWrapper}>
          <h2 className={styles.tutorialsTitle}>Proqramlaşdırma Dilləri</h2>
          <div className={styles.list}>
            {languages.map((lang) => (
              <div
                key={lang.name}
                className={lang.available ? styles.row : styles.row + ' ' + styles.categoryListItemUnavailable}
              >
                <div className={styles.cardHeader}>
                  <div className={styles.cardLeft}>
                    <span className={styles.categoryListIcon}>{lang.icon}</span>
                    <span className={styles.cellTitle}>{lang.name}</span>
                  </div>
                </div>
              </div>
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

  // List view for algorithms/data-structures (fetch topics)
  const [topics, setTopics] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    if (!language || !langKey) return;
    fetch(`/api/tutorials/${language}/topics`)
      .then((res) => res.json())
      .then((data) => {
        const arr = data[langKey] || [];
        setTopics(arr);
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
        <div className={styles.list}>
          {loading ? (
            <CodeLoader />
          ) : topics.length === 0 ? (
            <div style={{ color: "#aaa", textAlign: "center", marginTop: 40 }}>Mövzu yoxdur.</div>
          ) : (
            topics.map((topic) => {
              const Icon = (FiIcons as any)[topic.icon] || FiIcons.FiBookOpen;
              return (
                <Link
                  href={`/${langKey}/tutorials/${language}/${topic.id}`}
                  className={styles.row}
                  key={topic.id}
                >
                  <div className={styles.cardHeader}>
                    <div className={styles.cardLeft}>
                      <span className={styles.categoryListIcon}><Icon /></span>
                      <span className={styles.cellTitle}>{topic.title}</span>
                    </div>
                  </div>
                </Link>
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
