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
                  className={
                    styles.row + " " + (i % 2 === 0 ? styles.rowEven : styles.rowOdd)
                  }
                >
                  <div
                    className={styles.cell}
                    style={{ width: 40, color: "#424242", fontWeight: 600 }}
                  >
                    {i + 1}. &nbsp;
                    <span className={styles.cellTitle}>{ex.title}</span>
                    <div className={styles.cellDesc}>{ex.description}</div>
                  </div>
                  <div
                    className={
                      styles.cellDiff + " " + difficultyColor(ex.difficulty)
                    }
                  >
                    {ex.difficulty}
                  </div>
                  <div className={styles.cellAcc}>{ex.acceptance}%</div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
