"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "../TutorialPage.module.css";
import * as FiIcons from "react-icons/fi";
import Header from "@/app/components/header/Header";
import Footer from "@/app/components/footer/Footer";
import JsTryEditor from "@/app/components/tryeditor/JsTryEditor";
import CodeLoader from "@/app/components/loading/CodeLoader";

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
      return <h2 key={i} className={styles.contentHeading}>{block.text}</h2>;
    case 'paragraph':
      return (
        <p key={i}>
          {block.text?.split('\n').map((line, idx, arr) => {
            const parts = line.split(/(\*\*[^*]+\*\*)/g);
            return (
              <React.Fragment key={idx}>
                {parts.map((part, j) =>
                  part.startsWith('**') && part.endsWith('**') ? (
                    <strong key={j} style={{ fontWeight: 700 }}>{part.slice(2, -2)}</strong>
                  ) : (
                    <React.Fragment key={j}>{part}</React.Fragment>
                  )
                )}
                {idx < arr.length - 1 && <br />}
              </React.Fragment>
            );
          })}
        </p>
      );
    case 'code':
      return (
        <pre key={i} style={{ background: '#f7f7f7', padding: '10px', borderRadius: '8px', overflowX: 'auto' }}>
          <code>{block.code}</code>
        </pre>
      );
    case 'editor':
      return (
        <div key={i} style={{ margin: '18px 0' }}>
          <JsTryEditor value={block.initialCode || ''} showRunButton={true} />
        </div>
      );
    default:
      return null;
  }
}

export default function TutorialTopicPage() {
  const { language, topicId } = useParams<{ language: string; topicId: string }>();
  const router = useRouter();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!language || !topicId) return;
    
    // First, load all topics to populate the sidebar
    fetch(`/api/tutorials/${language}/topics`)
      .then((res) => res.json())
      .then((data) => {
        setTopics(data);
        
        // Check if the current topicId exists in the topics list
        const topicExists = data.find((t: Topic) => t.id === topicId);
        if (!topicExists) {
          // If topic doesn't exist, redirect to first topic
          if (data.length > 0) {
            router.replace(`/tutorials/${language}/${data[0].id}`);
          }
          return;
        }
        
        // Load the specific topic content
        return fetch(`/api/tutorials/${language}/topics/${topicId}`);
      })
      .then((res) => res?.json())
      .then((topicData) => {
        if (topicData) {
          setSelectedTopic(topicData);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error loading topic:', error);
        setLoading(false);
      });
  }, [language, topicId, router]);

  const handleSelect = (id: string) => {
    if (id !== topicId) {
      router.push(`/tutorials/${language}/${id}`);
    }
  };

  const toggleSidebar = () => setCollapsed((c) => !c);

  if (loading) {
    return (
      <>
        <Header />
        <div className={styles.tutorialLayout}>
          <div className={styles.topicContent}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '50vh',
              flexDirection: 'column',
              gap: '20px'
            }}>
              <CodeLoader />
              <div style={{ 
                fontSize: '18px', 
                color: '#666',
                fontFamily: 'Consolas, Menlo, Monaco, monospace'
              }}>
                Yüklənir...
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

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
                    topicId === topic.id
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
            <div className={styles.topicEmpty}>Mövzu tapılmadı</div>
          )}
        </main>
      </div>
      <Footer />
    </>
  );
} 