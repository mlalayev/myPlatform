import React from "react";
import styles from "./MainPageContent.module.css";
import JsTryEditor from "../tryeditor/JsTryEditor";
import HeroSection from "./HeroSection";
import { FiLayers, FiRefreshCw, FiGitBranch, FiShare2 } from "react-icons/fi";

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
