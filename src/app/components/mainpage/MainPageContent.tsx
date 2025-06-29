import React from "react";
import styles from "./MainPageContent.module.css";
import JsTryEditor from "../tryeditor/JsTryEditor";
import { FiLayers, FiRefreshCw, FiGitBranch, FiShare2 } from "react-icons/fi";
import HeroSection from "./HeroSection";
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
import Marquee from "react-fast-marquee";

const features = [
  {
    icon: <FiLayers />,
    label: "Massivlər",
    description: "Ən çox istifadə olunan verilənlər strukturlarını öyrən.",
  },
  {
    icon: <FiRefreshCw />,
    label: "Rekursiya",
    description:
      "Rekursiv düşüncə tərzini inkişaf etdir və problemləri həll et.",
  },
  {
    icon: <FiGitBranch />,
    label: "Ağaclar",
    description: "Məlumatların iyerarxik saxlanmasını və idarəsini öyrən.",
  },
  {
    icon: <FiShare2 />,
    label: "Qraf",
    description: "Qraf strukturları və onların tətbiqlərini kəşf et.",
  },
];

const languageIcons = [
  { icon: <SiJavascript size={32} color="#f7df1e" />, name: "JavaScript" },
  { icon: <SiHtml5 size={32} color="#e34c26" />, name: "HTML" },
  { icon: <SiCss3 size={32} color="#1572b6" />, name: "CSS" },
  { icon: <SiNodedotjs size={32} color="#339933" />, name: "Node.js" },
  { icon: <SiOpenjdk size={32} color="#b07219" />, name: "Java" },
  { icon: <SiSharp size={32} color="#178600" />, name: "C#" },
  { icon: <SiDart size={32} color="#0175c2" />, name: "Dart" },
  { icon: <SiKotlin size={32} color="#7f52ff" />, name: "Kotlin" },
  { icon: <SiSwift size={32} color="#ffac45" />, name: "Swift" },
  { icon: <SiCplusplus size={32} color="#00599C" />, name: "C++" },
];

export default function MainPageContent() {
  return (
    <main className={styles.main}>
      <HeroSection />
      <section className={styles.featuresSection}>
        <h2 className={styles.featuresTitle}>Əsas Xüsusiyyətlər</h2>
        <p className={styles.featuresSubtitle}>
          Platformamızın əsas imkanları ilə tanış olun və proqramlaşdırma
          bacarıqlarınızı inkişaf etdirin.
        </p>
        <div className={styles.features}>
          {features.map((f) => (
            <div className={styles.featureCard} key={f.label}>
              <span className={styles.featureIcon}>{f.icon}</span>
              <span className={styles.featureLabel}>{f.label}</span>
              <span className={styles.featureDescription}>{f.description}</span>
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
