"use client"

import React from "react";
import styles from "./TutorialsPage.module.css";
import {
  FiCode,
  FiCoffee,
  FiTerminal,
  FiFeather,
  FiDatabase,
  FiSettings,
  FiBarChart2,
  FiLayers,
  FiZap,
  FiGrid,
  FiPieChart,
  FiCpu,
  FiBookOpen,
  FiGitBranch,
  FiPlay,
  FiHash,
  FiChevronRight,
} from "react-icons/fi";
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
import Link from "next/link";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

// Type for language cards
interface LanguageAvailable {
  name: string;
  icon: React.ReactElement;
  available: true;
  href: string;
  description: string;
}
interface LanguageUnavailable {
  name: string;
  icon: React.ReactElement;
  available: false;
  description: string;
}
type Language = LanguageAvailable | LanguageUnavailable;

const languages: Language[] = [
  {
    name: "JavaScript",
    icon: <SiJavascript size={38} color="#f7df1e" />,
    available: true,
    href: "/tutorials/javascript",
    description: "Web üçün.",
  },
  {
    name: "Alqoritmlər",
    icon: <FiSettings size={38} color="#6c3fc5" />,
    available: true,
    href: "/tutorials/algorithms",
    description: "Əsas metodlar.",
  },
  {
    name: "Məlumat Strukturları",
    icon: <FiLayers size={38} color="#6c3fc5" />,
    available: true,
    href: "/tutorials/data-structures",
    description: "Massiv, ağac, qraf.",
  },
  {
    name: "Python",
    icon: <SiPython size={38} color="#3572A5" />,
    available: false,
    description: "Data science, backend.",
  },
  {
    name: "Java",
    icon: <SiOpenjdk size={38} color="#b07219" />,
    available: false,
    description: "Android, enterprise.",
  },
  {
    name: "C",
    icon: <SiC size={38} color="#00599C" />,
    available: false,
    description: "Sistem proqramları.",
  },
  {
    name: "C++",
    icon: <SiCplusplus size={38} color="#00599C" />,
    available: false,
    description: "Oyunlar, performans.",
  },
  {
    name: "C#",
    icon: <FiHash size={38} color="#178600" />,
    available: false,
    description: ".NET, Unity.",
  },
  {
    name: "Go (Golang)",
    icon: <SiGo size={38} color="#00ADD8" />,
    available: false,
    description: "Backend.",
  },
  {
    name: "Rust",
    icon: <SiRust size={38} color="#dea584" />,
    available: false,
    description: "Təhlükəsizlik, performans.",
  },
  {
    name: "TypeScript",
    icon: <SiTypescript size={38} color="#3178c6" />,
    available: false,
    description: "Tipli JS.",
  },
  {
    name: "PHP",
    icon: <SiPhp size={38} color="#777bb4" />,
    available: false,
    description: "Web backend.",
  },
  {
    name: "Swift",
    icon: <SiSwift size={38} color="#ffac45" />,
    available: false,
    description: "iOS/macOS.",
  },
  {
    name: "Kotlin",
    icon: <SiKotlin size={38} color="#7f52ff" />,
    available: false,
    description: "Android.",
  },
  {
    name: "Ruby",
    icon: <SiRuby size={38} color="#cc342d" />,
    available: false,
    description: "Web backend.",
  },
  {
    name: "R",
    icon: <SiR size={38} color="#276dc3" />,
    available: false,
    description: "Statistika, data.",
  },
  {
    name: "SQL",
    icon: <SiMysql size={38} color="#00758f" />,
    available: false,
    description: "Verilənlər bazası.",
  },
  {
    name: "Shell/Bash",
    icon: <SiGnubash size={38} color="#4eaa25" />,
    available: false,
    description: "Sistem əmrləri.",
  },
  {
    name: "MATLAB",
    icon: <FiBarChart2 size={38} color="#e16737" />,
    available: false,
    description: "Elmi hesablamalar.",
  },
  {
    name: "Scala",
    icon: <SiScala size={38} color="#c22d40" />,
    available: false,
    description: "Functional, OOP.",
  },
  {
    name: "Dart",
    icon: <SiDart size={38} color="#00b4ab" />,
    available: false,
    description: "Mobil app.",
  },
  {
    name: "Haskell",
    icon: <SiHaskell size={38} color="#5e5086" />,
    available: false,
    description: "Functional.",
  },
];

export default function TutorialsPage() {
  const pathname = usePathname();
  const currentLang = pathname.split("/")[1] || "en";

  return (
    <>
      <Header />
      <div className={styles.tutorialsWrapper}>
        <h1 className={styles.tutorialsTitle}>Proqramlaşdırma Dilləri</h1>
        <div className={styles.languagesGrid}>
          {languages.map((lang) =>
            lang.available ? (
              <Link
                href={`/${currentLang}/tutorials/${lang.href.replace(/^\/tutorials\//, '')}`}
                className={styles.languageCard}
                key={lang.name}
              >
                <div className={styles.languageIcon}>{lang.icon}</div>
                <div className={styles.languageName}>{lang.name}</div>
                <div className={styles.languageDesc}>{lang.description}</div>
                <span className={styles.languageArrow}>
                  <FiChevronRight size={22} />
                </span>
              </Link>
            ) : (
              <div className={styles.languageCardUnavailable} key={lang.name}>
                <div className={styles.languageIcon}>{lang.icon}</div>
                <div className={styles.languageName}>{lang.name}</div>
                <div className={styles.languageDesc}>{lang.description}</div>
                <div className={styles.comingSoon}>Tezliklə...</div>
              </div>
            )
          )}
        </div>
      </div>
      <Footer></Footer>
    </>
  );
}