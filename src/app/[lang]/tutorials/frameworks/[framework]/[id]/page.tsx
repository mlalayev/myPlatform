"use client";
import React, { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "../../../TutorialsTopicPage.module.css";
import * as FiIcons from "react-icons/fi";
import Header from "../../../../components/header/Header";
import Footer from "../../../../components/footer/Footer";
import JsTryEditor from "../../../../components/tryeditor/JsTryEditor";
import CodeLoader from "../../../../components/loading/CodeLoader";
import { useSession } from "next-auth/react";
import { useMemo } from "react";
import { useAppContext } from "../../../../../../contexts/AppContext";
import mainPageTryEditorStyles from "../../../../components/mainpageTryEditor/MainPageTryEditor.module.css";
import FavoriteButton from "../../../../../../components/FavoriteButton";

interface ContentBlock {
  type: "heading" | "paragraph" | "code" | "editor" | "list";
  text?: string;
  language?: string;
  code?: string;
  initialCode?: string;
  items?: { term: string; description: string }[];
}

interface Topic {
  id: string;
  title: string;
  icon: string;
  description: string;
  content: ContentBlock[];
}

const frameworkShortMap: Record<string, string> = {
  react: "RE",
  vue: "VU",
  angular: "AN",
  svelte: "SV",
  nextjs: "NX",
  nodejs: "ND",
};

function frameworkAlias(framework: string) {
  if (!framework) return "";
  return framework.toLowerCase();
}

function renderBoldText(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i} style={{ fontWeight: 700 }}>
        {part.slice(2, -2)}
      </strong>
    ) : (
      <React.Fragment key={i}>{part}</React.Fragment>
    )
  );
}

function renderContentBlock(
  block: ContentBlock,
  i: number,
  editorStates: Record<string, string>,
  setEditorStates: React.Dispatch<React.SetStateAction<Record<string, string>>>,
  safeFramework: string,
  runCode?: (code: string, language: string) => void
) {
  switch (block.type) {
    case "heading":
      return (
        <h2 key={i} className={styles.contentHeading}>
          {block.text}
        </h2>
      );
    case "paragraph":
      return (
        <p key={i} className={styles.contentParagraph}>
          {block.text?.split("\n").map((line, idx, arr) => {
            const parts = line.split(/(\*\*[^*]+\*\*)/g);
            return (
              <React.Fragment key={idx}>
                {parts.map((part, j) =>
                  part.startsWith("**") && part.endsWith("**") ? (
                    <strong key={j} style={{ fontWeight: 700 }}>
                      {part.slice(2, -2)}
                    </strong>
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
    case "code":
      return (
        <pre key={i} className={styles.codeBlock}>
          <code>{block.code}</code>
        </pre>
      );
    case "editor": {
      const editorKey = `editor-${i}`;
      const codeValue =
        editorStates[editorKey] !== undefined
          ? editorStates[editorKey]
          : block.initialCode || "";
      const handleEditorChange = (val: string) => {
        setEditorStates((prev) => ({ ...prev, [editorKey]: val }));
      };
      const editorLanguage = block.language
        ? block.language
        : "javascript"; // Default for frameworks
      const handleRun = () => {
        if (runCode) runCode(codeValue, editorLanguage);
      };

      return (
        <div key={i} className={styles.editorContainer}>
          <JsTryEditor
            language={editorLanguage}
            value={codeValue}
            onChange={handleEditorChange}
            showRunButton={true}
            onRun={handleRun}
          />
        </div>
      );
    }
    case "list":
      return (
        <ul key={i} style={{ marginBottom: 16, paddingLeft: 24 }}>
          {block.items?.map((item, idx) => (
            <li key={idx} style={{ marginBottom: 8 }}>
              <strong>{item.term}:</strong> {renderBoldText(item.description)}
            </li>
          ))}
        </ul>
      );
    default:
      return null;
  }
}

// Add a helper for display name
function displayFrameworkName(framework: string) {
  const f = frameworkAlias(framework);
  if (f === "nextjs") return "Next.js";
  if (f === "nodejs") return "Node.js";
  return framework.charAt(0).toUpperCase() + framework.slice(1);
}

export default function TutorialFrameworkTopicPage() {
  const params = useParams();
  const framework = Array.isArray(params.framework)
    ? params.framework[0]
    : params.framework;
  const topicId = Array.isArray(params.id) ? params.id[0] : params.id;
  const lang = Array.isArray(params.lang) ? params.lang[0] : params.lang;
  const safeFramework = typeof framework === "string" ? framework : "";
  const safeTopicId = typeof topicId === "string" ? topicId : "";
  const router = useRouter();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [topicContent, setTopicContent] = useState<any>(null);
  const [editorStates, setEditorStates] = useState<Record<string, string>>({});
  const { data: session } = useSession();
  const { logActivity } = useAppContext();
  const [visitedLessons, setVisitedLessons] = useState<string[]>([]);

  // Fetch visited lessons on load
  useEffect(() => {
    const fetchVisited = async () => {
      const visitedLessonsByFramework = JSON.parse(
        localStorage.getItem("visitedLessons") || "{}"
      );
      const visited = safeFramework
        ? visitedLessonsByFramework[safeFramework] || []
        : [];
      if (visited.length > 0) {
        setVisitedLessons(visited);
      } else if (session?.user) {
        try {
          const res = await fetch("/api/user/lessons");
          const data = await res.json();
          const serverVisited = data[safeFramework] || [];
          setVisitedLessons(serverVisited);
          visitedLessonsByFramework[safeFramework] = serverVisited;
          localStorage.setItem(
            "visitedLessons",
            JSON.stringify(visitedLessonsByFramework)
          );
        } catch (e) {
          setVisitedLessons([]);
        }
      } else {
        setVisitedLessons(visited);
      }
    };
    fetchVisited();
  }, [session, safeFramework]);

  // Mark as visited on mount
  useEffect(() => {
    if (!safeTopicId || !safeFramework) {
      return;
    }

    const markVisited = async () => {
      const visitedLessonsByFramework = JSON.parse(
        localStorage.getItem("visitedLessons") || "{}"
      );
      const visited = safeFramework
        ? visitedLessonsByFramework[safeFramework] || []
        : [];
      
      if (!visited.includes(safeTopicId)) {
        const newVisited = [...visited, safeTopicId];
        setVisitedLessons(newVisited);
        
        // Update localStorage
        if (safeFramework) visitedLessonsByFramework[safeFramework] = newVisited;
        localStorage.setItem(
          "visitedLessons",
          JSON.stringify(visitedLessonsByFramework)
        );
        
        // Dispatch custom event to notify other components (with small delay)
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('visitedLessonsUpdated', {
            detail: { framework: safeFramework, lessonId: safeTopicId }
          }));
        }, 100);
        
        console.log('Marking framework lesson as visited:', safeTopicId, 'framework:', safeFramework);
        
        // Sync to server only if user is logged in
        if (session?.user) {
          try {
            const response = await fetch("/api/user/lessons", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                language: safeFramework,
                lessonId: safeTopicId,
              }),
            });
            
            const result = await response.json();

            if (result.added) {
              console.log('Logging framework lesson view activity for:', safeTopicId, 'framework:', safeFramework);
              logActivity(
                'LESSON_VIEW',
                `Viewed framework lesson: ${safeTopicId}`,
                {
                  language: safeFramework,
                  lessonId: safeTopicId,
                }
              );
            } else {
              console.log('Framework lesson already visited on server:', safeTopicId);
            }
          } catch (e) {
            console.error('Failed to sync framework lesson to server:', e);
          }
        }
      } else {
        console.log('Framework lesson already visited locally:', safeTopicId);
        setVisitedLessons(visited);
      }
    };
    
    markVisited();
  }, [safeTopicId, safeFramework, session?.user]);

  useEffect(() => {
    if (!framework || !topicId || !lang) return;
    
    // Fetch topics for sidebar from API
    fetch(`/api/tutorials/frameworks/${framework}/topics`)
      .then((res) => res.json())
      .then((data) => {
        const langKey = typeof lang === "string" ? lang : Array.isArray(lang) ? lang[0] : "az";
        const topicsArr = data[langKey] || [];
        setTopics(topicsArr);
        
        const topic = topicsArr.find((t: Topic) => t.id === topicId);
        if (!topic) {
          if (topicsArr.length > 0) {
            router.replace(
              `/${langKey}/tutorials/frameworks/${framework}/${topicsArr[0].id}`
            );
          }
          return;
        }
        setSelectedTopic(topic);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading framework topic:", error);
        setLoading(false);
      });

    // Fetch topic content from API
    fetch(`/api/tutorials/frameworks/${framework}/${topicId}`)
      .then((res) => res.json())
      .then((data) => {
        const langKey = typeof lang === "string" ? lang : Array.isArray(lang) ? lang[0] : "az";
        setTopicContent(data[langKey]);
      })
      .catch((error) => {
        console.error("Error loading framework topic content:", error);
      });
  }, [framework, topicId, lang, router]);

  useEffect(() => {
    setEditorStates({}); // Reset editor states when topic changes
  }, [framework, topicId, lang, router]);

  const handleSelect = (id: string) => {
    if (id !== topicId) {
      router.push(`/${lang}/tutorials/frameworks/${framework}/${id}`);
    }
  };

  const toggleSidebar = () => setCollapsed((c) => !c);

  const handleBack = () => {
    router.push(`/${lang}/tutorials/frameworks`);
  };

  const runCode = (code: string, language: string) => {
    fetch("/api/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, language }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Run result:", data);
      });
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className={styles.tutorialLayoutNew}>
          <div className={styles.topicContentNew}>
            <div className={styles.loadingContainer}>
              <CodeLoader />
              <div className={styles.loadingText}>Yüklənir...</div>
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
      <div className={styles.tutorialLayoutNew}>
        <aside
          className={collapsed ? styles.sidebarNewCollapsed : styles.sidebarNew}
        >
          <div className={styles.sidebarHeaderNew}>
            <span className={styles.sidebarTitleNew}>
              {collapsed
                ? frameworkShortMap[frameworkAlias(decodeURIComponent(safeFramework))] ||
                  (safeFramework
                    ? decodeURIComponent(safeFramework).slice(0, 2).toUpperCase()
                    : "F")
                : `${displayFrameworkName(
                    decodeURIComponent(safeFramework)
                  )} Mövzular`}
            </span>
            <button
              className={styles.collapseBtnNew}
              onClick={toggleSidebar}
              aria-label={collapsed ? "Expand" : "Collapse"}
            >
              {collapsed ? (
                <FiIcons.FiChevronRight />
              ) : (
                <FiIcons.FiChevronLeft />
              )}
            </button>
          </div>
          <nav className={styles.topicListNew}>
            {topics.map((topic) => {
              const Icon = (FiIcons as any)[topic.icon] || FiIcons.FiBookOpen;
              const visitedArr = Array.isArray(visitedLessons)
                ? visitedLessons
                : [];
              const isVisited = visitedArr.includes(topic.id);
              if (isVisited) {
                console.log(`[Framework Sidebar] Topic ${topic.id} is visited`);
              }
              return (
                <button
                  key={topic.id}
                  className={
                    topicId === topic.id
                      ? styles.topicBtnNewSelected
                      : styles.topicBtnNew
                  }
                  onClick={() => handleSelect(topic.id)}
                  title={topic.title}
                >
                  <Icon className={styles.topicIconNew} />
                  {!collapsed && <span>{topic.title}</span>}
                  {isVisited && (
                    <FiIcons.FiCheck
                      style={{
                        color: "white",
                        fontSize: 16,
                        marginLeft: "auto",
                        verticalAlign: "middle",
                      }}
                    />
                  )}
                </button>
              );
            })}
          </nav>
        </aside>
        <main className={styles.topicContentNew}>
          <div className={styles.contentHeader}>
            <h1 className={styles.topicTitleNew} style={{ margin: 0 }}>
              {topicContent?.title || selectedTopic?.title || "Mövzu"}
            </h1>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginLeft: "auto",
              }}
            >
              <FavoriteButton
                type="LESSON"
                itemId={safeTopicId}
                title={topicContent?.title || selectedTopic?.title || "Mövzu"}
                description={topicContent?.description || selectedTopic?.description}
                language={decodeURIComponent(safeFramework)}
              />
              <button className={styles.backButtonNew} onClick={handleBack}>
                <FiIcons.FiChevronLeft /> Geri
              </button>
            </div>
          </div>
          <div className={styles.contentBody}>
            {topics.length === 0 ? (
              <div className={styles.topicEmptyNew}>
                Bu framework üçün mövzu yoxdur.
              </div>
            ) : topicContent ? (
              <>
                <p className={styles.topicDescNew}>
                  {topicContent.description}
                </p>
                <div className={styles.contentBlocks}>
                  {topicContent.content &&
                    topicContent.content.map((block: ContentBlock, i: number) =>
                      renderContentBlock(
                        block,
                        i,
                        editorStates,
                        setEditorStates,
                        safeFramework,
                        runCode
                      )
                    )}
                </div>
              </>
            ) : (
              <div className={styles.topicEmptyNew}>Mövzu tapılmadı</div>
            )}
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
} 