"use client";
import React from "react";
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
import styles from "../TutorialsFrameworkPage.module.css";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import HeroSection from "../../components/heroSection/HeroSection";

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

export default function TutorialsFrameworksPage() {
  const { lang } = useParams();
  const router = useRouter();
  const langKey = Array.isArray(lang) ? lang[0] : lang || "az";

  // Back button handler
  const handleBack = () => {
    router.push(`/${langKey}/tutorials`);
  };

  // Card component for frameworks
  interface FrameworkCardProps {
    item: {
      name: string;
      icon: React.ReactNode;
      available: boolean;
      description: string;
      progress: number;
    };
  }
  
  const FrameworkCard = ({ item }: FrameworkCardProps) => {
    const unavailable = !item.available;
    const isCompleted = item.progress === 100;

    const cardContent = (
      <div
        className={
          unavailable
            ? `${styles.frameworkItem} ${styles.frameworkItemUnavailable}`
            : isCompleted
            ? `${styles.frameworkItem} ${styles.completed}`
            : styles.frameworkItem
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
                {Math.round(item.progress)}%
              </span>
            )}
            <div className={styles.itemArrow}>
              <FiIcons.FiChevronRight size={20} />
            </div>
          </div>
        </div>
        
        {!unavailable && (
          <div className={styles.progressSection}>
            <div className={styles.progressBar}>
              <div
                className={`${styles.progressFill} ${isCompleted ? styles.completed : ''}`}
                style={{ width: `${item.progress}%` }}
              />
            </div>
            <span className={`${styles.progressText} ${isCompleted ? styles.completed : ''}`}>
              {item.progress}% tamamlandı
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

    return cardContent;
  };

  return (
    <>
      <Header />
      <HeroSection 
        titleKey="tutorials.frameworks.title"
        subtitleKey="tutorials.frameworks.subtitle"
      />
      <div className={styles.frameworksWrapper}>
        <div className={styles.frameworksList}>
          {frameworks.map((fw) => (
            <FrameworkCard key={fw.name} item={fw} />
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