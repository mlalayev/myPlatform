"use client";
import React, { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "../../TutorialsPage.module.css";
import * as FiIcons from "react-icons/fi";
import Header from "../../../components/header/Header";
import Footer from "../../../components/footer/Footer";
import JsTryEditor from "../../../components/tryeditor/JsTryEditor";
import CodeLoader from "../../../components/loading/CodeLoader";

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

function renderContentBlock(block: ContentBlock, i: number, editorStates: any, setEditorStates: any) {
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
    case 'editor': {
      const editorKey = `editor-${i}`;
      const codeValue = editorStates[editorKey] !== undefined ? editorStates[editorKey] : (block.initialCode || '');
      const handleEditorChange = (val: string) => {
        setEditorStates((prev: any) => ({ ...prev, [editorKey]: val }));
      };
      return (
        <div key={i} style={{ margin: '18px 0' }}>
          <JsTryEditor value={codeValue} onChange={handleEditorChange} showRunButton={true} />
        </div>
      );
    }
    default:
      return null;
  }
}

export default function TutorialTopicPage() {
  const params = useParams();
  const language = Array.isArray(params.language) ? params.language[0] : params.language;
  const topicId = Array.isArray(params.id) ? params.id[0] : params.id;
  const lang = Array.isArray(params.lang) ? params.lang[0] : params.lang;
  const safeLanguage = typeof language === "string" ? language : "";
  const router = useRouter();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [topicContent, setTopicContent] = useState<any>(null);
  const [editorStates, setEditorStates] = useState<any>({});

  useEffect(() => {
    if (!language || !topicId || !lang) return;
    // Fetch topics for sidebar from API
    fetch(`/api/tutorials/${language}/topics`)
      .then((res) => res.json())
      .then((data) => {
        const langKey = typeof lang === 'string' ? lang : (Array.isArray(lang) ? lang[0] : 'az');
        const topicsArr = data[langKey] || [];
        setTopics(topicsArr);
        // Check if the current topicId exists in the topics list
        const topic = topicsArr.find((t: Topic) => t.id === topicId);
        if (!topic) {
          // If topic doesn't exist, redirect to first topic
          if (topicsArr.length > 0) {
            router.replace(`/${langKey}/tutorials/${language}/${topicsArr[0].id}`);
          }
          return;
        }
        setSelectedTopic(topic);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error loading topic:', error);
        setLoading(false);
      });

    // Fetch topic content from API
    fetch(`/api/tutorials/${language}/${topicId}`)
      .then((res) => res.json())
      .then((data) => {
        const langKey = typeof lang === 'string' ? lang : (Array.isArray(lang) ? lang[0] : 'az');
        setTopicContent(data[langKey]);
      })
      .catch((error) => {
        console.error('Error loading topic content:', error);
      });
  }, [language, topicId, lang, router]);

  useEffect(() => {
    setEditorStates({}); // Reset editor states when topic changes
  }, [language, topicId, lang, router]);

  const handleSelect = (id: string) => {
    if (id !== topicId) {
      router.push(`/${lang}/tutorials/${language}/${id}`);
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
                ? languageShortMap[safeLanguage] || (safeLanguage ? safeLanguage.slice(0, 2).toUpperCase() : "L")
                : `${safeLanguage ? safeLanguage.charAt(0).toUpperCase() + safeLanguage.slice(1) : "Language"} Mövzular`}
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
          ) : topicContent ? (
            <>
              <h2 className={styles.topicTitle}>{topicContent.title}</h2>
              <p className={styles.topicDesc}>{topicContent.description}</p>
              {topicContent.content && topicContent.content.map((block: any, i: number) =>
                renderContentBlock(block, i, editorStates, setEditorStates)
              )}
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