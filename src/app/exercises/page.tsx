"use client";
import React, { useState } from "react";
import { exercises } from "./exercisesData";
import styles from "./ExercisesList.module.css";
import Header from "../components/header/Header";
import Link from "next/link";

const difficultyColor = (diff: string) =>
  diff === "Asan"
    ? styles.diffEasy
    : diff === "Orta"
    ? styles.diffMed
    : styles.diffHard;

export default function ExercisesPage() {
  const [search, setSearch] = useState("");
  const filtered = exercises.filter(
    (ex) =>
      ex.title.toLowerCase().includes(search.toLowerCase()) ||
      ex.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Header />
      <div className={styles.layout}>
        <div className={styles.contentOpen}>
          <div className={styles.page}>
            <div className={styles.headerBar}>
              <button className={styles.filterBtn + " " + styles.selected}>
                Bütün Tapşırıqlar
              </button>
              <button className={styles.filterBtn}>Asan</button>
              <button className={styles.filterBtn}>Orta</button>
              <button className={styles.filterBtn}>Çətin</button>
              <div className={styles.searchBox}>
                <input
                  className={styles.searchInput}
                  placeholder="Axtar..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className={styles.list}>
              {filtered.map((ex, i) => (
                <Link
                  href={`/exercises/${ex.id}`}
                  key={ex.id}
                  className={styles.row}
                >
                  <div className={styles.cardHeader}>
                    <span className={styles.cardIndex}>{i + 1}.</span>
                    <span className={styles.cellTitle}>{ex.title}</span>
                    <span className={styles.cellDiff + " " + difficultyColor(ex.difficulty)}>
                      {ex.difficulty}
                    </span>
                  </div>
                  <div className={styles.cellDesc}>{ex.description}</div>
                  <div className={styles.cardFooter}>
                    <span className={styles.cellAcc}>{ex.acceptance}% Acceptance</span>
                    <div className={styles.cardTags}>
                      {ex.tags.map((tag) => (
                        <span className={styles.cardTag} key={tag}>{tag}</span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
        <aside className={styles.sidebar}>
          <div className={styles.sidebarSection}>
            <h3 className={styles.sidebarTitle}>Trending Companies</h3>
            <div className={styles.trendingCompaniesPlaceholder}>
              <span>Meta</span>
              <span>Google</span>
              <span>Amazon</span>
              <span>Microsoft</span>
              <span>Uber</span>
            </div>
          </div>
          <div className={styles.sidebarSection}>
            <h3 className={styles.sidebarTitle}>Calendar</h3>
            <div className={styles.calendarPlaceholder}>
              <span>[Calendar Here]</span>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
