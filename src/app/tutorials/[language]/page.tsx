"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import styles from "./TutorialPage.module.css";
import * as FiIcons from "react-icons/fi";
import Header from "@/app/components/header/Header";
import Footer from "@/app/components/footer/Footer";

interface ContentBlock {
  type: 'heading' | 'paragraph' | 'code' | 'editor';
  text?: string;
  language?: string;
  code?: string;
  initialCode?: string;
}

interface Topic {
  id: string;
  title: string;
  icon: string;
  description: string;
  content: ContentBlock[];
}

const languageShortMap: Record<string, string> = {
  javascript: "JS",
  python: "PY",
  java: "JAVA",
  c: "C",
  cpp: "C++",
  typescript: "TS",
  go: "GO",
  rust: "RS",
  php: "PHP",
  swift: "SW",
  kotlin: "KT",
  ruby: "RB",
  r: "R",
  sql: "SQL",
  dart: "DT",
  haskell: "HS",
  scala: "SC",
  bash: "SH",
  matlab: "ML",
};

function renderContentBlock(block: ContentBlock, i: number) {
  switch (block.type) {
    case 'heading':
      return <h2 key={i}>{block.text}</h2>;
    case 'paragraph':
      return <p key={i}>{block.text}</p>;
    case 'code':
      return (
        <pre key={i} style={{ background: '#f7f7f7', padding: '10px', borderRadius: '8px', overflowX: 'auto' }}>
          <code>{block.code}</code>
        </pre>
      );
    case 'editor':
      // Replace with your TryEditor component if you have one
      return (
        <div key={i} style={{ margin: '18px 0' }}>
          <strong>Try it:</strong>
          <pre style={{ background: '#f0f0f0', padding: '10px', borderRadius: '8px', overflowX: 'auto' }}>{block.initialCode}</pre>
        </div>
      );
    default:
      return null;
  }
}

export default function TutorialLanguagePage() {
  const { language } = useParams<{ language: string }>();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selected, setSelected] = useState<string>("");
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (!language) return;
    fetch(`/api/tutorials/${language}/topics`)
      .then((res) => res.json())
      .then((data) => {
        setTopics(data);
        if (data.length > 0) setSelected(data[0].id);
      });
  }, [language]);

  const handleSelect = (id: string) => setSelected(id);
  const toggleSidebar = () => setCollapsed((c) => !c);

  const selectedTopic = topics.find((t) => t.id === selected);

  return (
    <>
      <Header />
      <div className={styles.tutorialLayout}>
        <aside className={collapsed ? styles.sidebarCollapsed : styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <span className={styles.sidebarTitle}>
              {collapsed
                ? languageShortMap[language] || (language ? language.slice(0, 2).toUpperCase() : "L")
                : `${language ? language.charAt(0).toUpperCase() + language.slice(1) : "Language"} Mövzular`}
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
          {topics.length === 0 ? (
            <div className={styles.topicEmpty}>Bu dil üçün mövzu yoxdur.</div>
          ) : selectedTopic ? (
            <>
              <h2 className={styles.topicTitle}>{selectedTopic.title}</h2>
              <p className={styles.topicDesc}>{selectedTopic.description}</p>
              {selectedTopic.content && selectedTopic.content.map(renderContentBlock)}
            </>
          ) : (
            <div className={styles.topicEmpty}>Mövzu seçin</div>
          )}
        </main>
      </div>
      <Footer />
    </>
  );
}
