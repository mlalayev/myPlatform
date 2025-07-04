"use client";
import React from "react";
import { useRouter, useParams } from "next/navigation";
import styles from "./TutorialsPage.module.css";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import { FiCpu, FiLayers, FiGrid, FiCode } from "react-icons/fi";

const categories = [
  {
    key: "algorithms",
    title: "Alqoritmlər",
    desc: "Ən vacib alqoritmlər və nümunələr.",
    icon: <FiCpu size={36} color="#667eea" />,
  },
  {
    key: "data-structures",
    title: "Məlumat Strukturları",
    desc: "Əsas məlumat strukturları və istifadəsi.",
    icon: <FiLayers size={36} color="#764ba2" />,
  },
  {
    key: "frameworks",
    title: "Frameworklər",
    desc: "Populyar frontend və backend frameworklər.",
    icon: <FiGrid size={36} color="#43e97b" />,
  },
  {
    key: "languages",
    title: "Proqramlaşdırma Dilləri",
    desc: "Ən məşhur proqramlaşdırma dilləri.",
    icon: <FiCode size={36} color="#f7b731" />,
  },
];

export default function TutorialsMainPage() {
  const router = useRouter();
  const { lang } = useParams();
  const langKey = Array.isArray(lang) ? lang[0] : lang;

  const handleCardClick = (key: string) => {
    router.push(`/${langKey}/tutorials/${key}`);
  };

  return (
    <>
      <Header />
      <div className={styles.tutorialsWrapper}>
        <h1 className={styles.tutorialsTitle}>Tədris Bölmələri</h1>
        <div className={styles.mainCategoriesGrid}>
          {categories.map((cat) => (
            <div
              key={cat.key}
              className={styles.mainCategoryCard}
              onClick={() => handleCardClick(cat.key)}
              style={{ cursor: "pointer" }}
            >
              <div className={styles.mainCategoryIcon}>{cat.icon}</div>
              <div className={styles.mainCategoryName}>{cat.title}</div>
              <div className={styles.mainCategoryDesc}>{cat.desc}</div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}