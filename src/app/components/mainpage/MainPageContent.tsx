import React from "react";
import styles from "./MainPageContent.module.css";
import JsTryEditor from "../tryeditor/JsTryEditor";
import HeroSection from "./HeroSection";
import Image from "next/image";
import {
  SiJavascript,
  SiHtml5,
  SiCss3,
  SiNodedotjs,
  SiOpenjdk,
  SiSharp,
  SiDart,
  SiKotlin,
  SiSwift,
  SiCplusplus,
} from "react-icons/si";

const features = [
  {
    title: "Master Algorithms",
    description: "Learn and visualize classic algorithms step by step.",
    className: "box1",
  },
  {
    title: "Code Playground",
    description: "Instantly run, test, and share your code in-browser.",
    className: "box2",
  },
  {
    title: "Track Progress",
    description: "Monitor your learning journey and achievements.",
    className: "box3",
  },
  {
    title: "Community Q&A",
    description: "Ask questions and get answers from fellow coders.",
    className: "box4",
  },
  {
    title: "Personalized Roadmaps",
    description: "Get a tailored learning path based on your goals.",
    className: "box5",
  },
  {
    title: "Interview Prep",
    description: "Practice real coding interview questions.",
    className: "box6",
  },
];

const languages = [
  {
    name: "JavaScript",
    icon: <SiJavascript color="#f7df1e" size={32} />,
    description: "Most popular scripting language for web development.",
  },
  {
    name: "HTML",
    icon: <SiHtml5 color="#e34c26" size={32} />,
    description: "The standard markup language for web pages.",
  },
  {
    name: "CSS",
    icon: <SiCss3 color="#1572b6" size={32} />,
    description: "Style your web pages with modern CSS.",
  },
  {
    name: "Node.js",
    icon: <SiNodedotjs color="#339933" size={32} />,
    description: "JavaScript runtime for server-side development.",
  },
  {
    name: "Java",
    icon: <SiOpenjdk color="#b07219" size={32} />,
    description: "Widely-used object-oriented programming language.",
  },
  {
    name: "C#",
    icon: <SiSharp color="#178600" size={32} />,
    description: "Modern language for building Windows and web apps.",
  },
  {
    name: "Kotlin",
    icon: <SiKotlin color="#7f52ff" size={32} />,
    description: "Modern language for Android and server-side apps.",
  },
  {
    name: "Swift",
    icon: <SiSwift color="#ffac45" size={32} />,
    description: "Powerful language for iOS and macOS development.",
  },
];

export default function MainPageContent() {
  return (
    <main className={styles.main}>
      <HeroSection />
      <section className={styles.featuresSection}>
        <div className={styles.features}>
          {features.map((feature) => (
            <div
              key={feature.title}
              className={`${styles.featureCard} ${styles[feature.className]}`}
            >
              <div className={styles.cardContent}>
                <h3 className={styles.featureCardTitle}>{feature.title}</h3>
                <p className={styles.featureDescription}>
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className={styles.languagesSection}>
        <h2 className={styles.languagesTitle}>Languages in Our Courses</h2>
        <div className={styles.languagesGrid}>
          {languages.map((lang) => (
            <div className={styles.languageCard} key={lang.name}>
              <div className={styles.languageIcon}>{lang.icon}</div>
              <div className={styles.languageName}>{lang.name}</div>
              <div className={styles.languageDescription}>
                {lang.description}
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className={styles.introSection}>
        <h2 className={styles.introTitle}>Giriş</h2>
        <JsTryEditor showCopyButton={true} showRunButton={true} />
      </section>
    </main>
  );
}
