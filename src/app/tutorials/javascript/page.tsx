"use client"

import React, { useEffect, useState } from "react";
import styles from "./JavascriptTutorialPage.module.css";
import * as FiIcons from "react-icons/fi";

interface Topic {
  id: string;
  title: string;
  icon: string;
  description: string;
}

export default function JavascriptTutorialPage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selected, setSelected] = useState<string>("");
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    fetch("/api/tutorials/javascript/topics")
      .then((res) => res.json())
      .then((data) => {
        setTopics(data);
        if (data.length > 0) setSelected(data[0].id);
      });
  }, []);

  const handleSelect = (id: string) => setSelected(id);
  const toggleSidebar = () => setCollapsed((c) => !c);

  const selectedTopic = topics.find((t) => t.id === selected);

  return (
    <div className={styles.tutorialLayout}>
      <aside
        className={
          collapsed ? styles.sidebarCollapsed : styles.sidebar
        }
      >
        <div className={styles.sidebarHeader}>
          <span className={styles.sidebarTitle}>
            {collapsed ? "JS" : "JavaScript Mövzular"}
          </span>
          <button
            className={styles.collapseBtn}
            onClick={toggleSidebar}
            aria-label={collapsed ? "Expand" : "Collapse"}
          >
            {collapsed ? <FiIcons.FiChevronRight /> : <FiIcons.FiChevronLeft />}
          </button>
        </div>
        <nav className={styles.topicList}>
          {topics.map((topic) => {
            const Icon = (FiIcons as any)[topic.icon] || FiIcons.FiBookOpen;
            return (
              <button
                key={topic.id}
                className={
                  selected === topic.id
                    ? styles.topicBtnSelected
                    : styles.topicBtn
                }
                onClick={() => handleSelect(topic.id)}
                title={topic.title}
              >
                <Icon className={styles.topicIcon} />
                {!collapsed && <span>{topic.title}</span>}
              </button>
            );
          })}
        </nav>
      </aside>
      <main className={styles.topicContent}>
        {selectedTopic ? (
          <>
            <h2 className={styles.topicTitle}>{selectedTopic.title}</h2>
            <p className={styles.topicDesc}>{selectedTopic.description}</p>
            {/* Topic content goes here. You can expand this later. */}
          </>
        ) : (
          <div className={styles.topicEmpty}>Mövzu seçin</div>
        )}
      </main>
    </div>
  );
} 