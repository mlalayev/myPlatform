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
  // Framework mappings
  react: "RE",
  vue: "VU",
  angular: "AN",
  svelte: "SV",
  nextjs: "NX",
  nodejs: "ND",
};

function languageAlias(lang: string) {
  if (!lang) return "";
  const l = lang.toLowerCase();
  if (l === "c++" || l === "c%2b%2b") return "cpp";
  return l;
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
  safeLanguage: string,
  runCode?: (code: string, language: string) => void // yeni prop
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
      // Prefer block.language (from JSON), fallback to safeLanguage (from URL)
      const editorLanguage = block.language
        ? languageAlias(block.language)
        : languageAlias(safeLanguage);
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
function displayLanguageName(lang: string) {
  const l = languageAlias(lang);
  if (l === "cpp") return "C++";
  return lang.charAt(0).toUpperCase() + lang.slice(1);
}

const ALGO_LANGUAGES = [
  { value: "cpp", label: "C++" },
  { value: "csharp", label: "C#" },
  { value: "c", label: "C" },
  { value: "php", label: "PHP" },
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "java", label: "Java" },
  { value: "python", label: "Python" },
];
const ALGO_LANG_KEY = "algorithms-try-lang";
const ALGO_DEFAULT_LANG = "javascript";

export default function TutorialTopicPage() {
  const params = useParams();
  const language = Array.isArray(params.language)
    ? params.language[0]
    : params.language;
  const topicId = Array.isArray(params.id) ? params.id[0] : params.id;
  const lang = Array.isArray(params.lang) ? params.lang[0] : params.lang;
  const safeLanguage = typeof language === "string" ? language : "";
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
  const [algoLang, setAlgoLang] = useState(ALGO_DEFAULT_LANG);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const editorLanguages = ALGO_LANGUAGES;
  const leftLanguages = editorLanguages.slice(
    0,
    Math.ceil(editorLanguages.length / 2)
  );
  const rightLanguages = editorLanguages.slice(
    Math.ceil(editorLanguages.length / 2)
  );
  const [algoCode, setAlgoCode] = useState("");

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  // Fetch visited lessons on load
  useEffect(() => {
    const fetchVisited = async () => {
      const visitedLessonsByLang = JSON.parse(
        localStorage.getItem("visitedLessons") || "{}"
      );
      const visited = safeLanguage
        ? visitedLessonsByLang[safeLanguage] || []
        : [];
      if (visited.length > 0) {
        setVisitedLessons(visited);
      } else if (session?.user) {
        // fallback to server if localStorage is empty
        try {
          const res = await fetch("/api/user/lessons");
          const data = await res.json();
          const serverVisited = data[safeLanguage] || [];
          setVisitedLessons(serverVisited);
          // save to localStorage for next time
          visitedLessonsByLang[safeLanguage] = serverVisited;
          localStorage.setItem(
            "visitedLessons",
            JSON.stringify(visitedLessonsByLang)
          );
        } catch (e) {
          console.log('🔥 fetchVisited - error, setting empty array');
          setVisitedLessons([]);
        }
      } else {
        console.log('🔥 fetchVisited - setting state from localStorage:', visited);
        setVisitedLessons(visited);
      }
    };
    fetchVisited();
  }, [session, safeLanguage]);

  // Mark as visited on mount (only if not already visited)
  useEffect(() => {
    // Skip if any required data is missing
    if (!safeTopicId || !safeLanguage) {
      return;
    }

    const markVisited = async () => {
      const visitedLessonsByLang = JSON.parse(
        localStorage.getItem("visitedLessons") || "{}"
      );
      const visited = safeLanguage
        ? visitedLessonsByLang[safeLanguage] || []
        : [];
      
      // Always update the state first to show the tick immediately
      if (!visited.includes(safeTopicId)) {
        const newVisited = [...visited, safeTopicId];
        console.log('🔥 Setting visitedLessons state to:', newVisited);
        setVisitedLessons(newVisited);
        
        // Update localStorage
        if (safeLanguage) visitedLessonsByLang[safeLanguage] = newVisited;
        localStorage.setItem(
          "visitedLessons",
          JSON.stringify(visitedLessonsByLang)
        );
        
        // Dispatch custom event to notify other components (with small delay)
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('visitedLessonsUpdated', {
            detail: { language: safeLanguage, lessonId: safeTopicId }
          }));
        }, 100);
        
        console.log('🔥 Marking lesson as visited:', safeTopicId, 'language:', safeLanguage);
        console.log('🔥 Updated localStorage visitedLessons:', JSON.parse(localStorage.getItem("visitedLessons") || "{}"));
        
        // Sync to server only if user is logged in
        if (session?.user) {
          try {
            const response = await fetch("/api/user/lessons", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                language: safeLanguage,
                lessonId: safeTopicId,
              }),
            });
            
            const result = await response.json();

            if (result.added) {
              console.log('Logging lesson view activity for:', safeTopicId, 'language:', safeLanguage);
              logActivity(
                'LESSON_VIEW',
                `Viewed lesson: ${safeTopicId}`,
                {
                  language: safeLanguage,
                  lessonId: safeTopicId,
                }
              );
            } else {
              console.log('Lesson already visited on server:', safeTopicId);
            }
          } catch (e) {
            console.error('Failed to sync lesson to server:', e);
          }
        }
      } else {
        console.log('Lesson already visited locally:', safeTopicId);
        // Even if already visited, make sure state includes this lesson
        if (!visited.includes(safeTopicId)) {
          const newVisited = [...visited, safeTopicId];
          setVisitedLessons(newVisited);
        } else {
          setVisitedLessons(visited);
        }
      }
    };
    
    markVisited();
  }, [safeTopicId, safeLanguage, session?.user]);

  // Algoritm mövzusu üçün localStorage-dan oxu
  useEffect(() => {
    if (language === "algorithms") {
      const saved = localStorage.getItem(ALGO_LANG_KEY);
      if (saved && ALGO_LANGUAGES.some((l) => l.value === saved)) {
        setAlgoLang(saved);
      }
    }
  }, [language]);

  // Algoritm mövzusu üçün dil dəyişəndə localStorage-a yaz
  const handleAlgoLangChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAlgoLang(e.target.value);
    localStorage.setItem(ALGO_LANG_KEY, e.target.value);
  };

  useEffect(() => {
    if (!language || !topicId || !lang) return;
    // Fetch topics for sidebar from API
    fetch(`/api/tutorials/languages/${language}/topics`)
      .then((res) => res.json())
      .then((data) => {
        const langKey =
          typeof lang === "string"
            ? lang
            : Array.isArray(lang)
            ? lang[0]
            : "az";
        const topicsArr = data[langKey] || [];
        setTopics(topicsArr);
        // Check if the current topicId exists in the topics list
        const topic = topicsArr.find((t: Topic) => t.id === topicId);
        if (!topic) {
          // If topic doesn't exist, redirect to first topic
          if (topicsArr.length > 0) {
            router.replace(
              `/${langKey}/tutorials/languages/${language}/${topicsArr[0].id}`
            );
          }
          return;
        }
        setSelectedTopic(topic);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading topic:", error);
        setLoading(false);
      });

    // Fetch topic content from API
    fetch(`/api/tutorials/languages/${language}/${topicId}`)
      .then((res) => res.json())
      .then((data) => {
        const langKey =
          typeof lang === "string"
            ? lang
            : Array.isArray(lang)
            ? lang[0]
            : "az";
        setTopicContent(data[langKey]);
      })
      .catch((error) => {
        console.error("Error loading topic content:", error);
      });
  }, [language, topicId, lang, router]);

  useEffect(() => {
    setEditorStates({}); // Reset editor states when topic changes
  }, [language, topicId, lang, router]);

  useEffect(() => {
    if (
      (language === "algorithms" || language === "data-structures") &&
      topicContent?.codes
    ) {
      setAlgoCode(topicContent.codes[algoLang] || "");
    }
  }, [topicContent, algoLang, language]);

  const handleSelect = (id: string) => {
    if (id !== topicId) {
      router.push(`/${lang}/tutorials/languages/${language}/${id}`);
    }
  };

  const toggleSidebar = () => setCollapsed((c) => !c);

  const handleBack = () => {
    router.push(`/${lang}/tutorials`);
  };

  const runCode = (code: string, language: string) => {
    // Burada kodu backendə göndərmək üçün fetch və ya API call yaz
    // Məsələn:
    fetch("/api/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, language }),
    })
      .then((res) => res.json())
      .then((data) => {
        // nəticəni state-də saxla və ya göstər
        console.log("Run result:", data);
      });
  };

  const handleAlgoRun = () => {
    runCode(algoCode, algoLang);
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
                ? languageShortMap[
                    languageAlias(decodeURIComponent(safeLanguage))
                  ] ||
                  (safeLanguage
                    ? decodeURIComponent(safeLanguage).slice(0, 2).toUpperCase()
                    : "L")
                : `${displayLanguageName(
                    decodeURIComponent(safeLanguage)
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
              if (topic.id === safeTopicId) {
                console.log(`🔥 [Sidebar] Current topic ${topic.id} - visitedArr:`, visitedArr, 'isVisited:', isVisited);
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
                  {!collapsed && <span>{topic.title} {} </span>}
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
                language={decodeURIComponent(safeLanguage)}
              />
              <button className={styles.backButtonNew} onClick={handleBack}>
                <FiIcons.FiChevronLeft /> Geri
              </button>
            </div>
          </div>
          <div className={styles.contentBody}>
            {topics.length === 0 ? (
              <div className={styles.topicEmptyNew}>
                Bu dil üçün mövzu yoxdur.
              </div>
            ) : topicContent ? (
              <>
                <p className={styles.topicDescNew}>
                  {topicContent.description}
                </p>
                {/* Standart content render */}
                <div className={styles.contentBlocks}>
                  {topicContent.content &&
                    topicContent.content.map((block: ContentBlock, i: number) =>
                      renderContentBlock(
                        block,
                        i,
                        editorStates,
                        setEditorStates,
                        safeLanguage,
                        runCode // yeni prop
                      )
                    )}
                </div>
                {/* ALGORITHMS: Language Picker və Try Editor ən aşağıda */}
                {(language === "algorithms" ||
                  language === "data-structures") &&
                  topicContent.codes && (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        gap: 16,
                        margin: "32px 0 0 0",
                      }}
                    >
                      <div
                        className={
                          mainPageTryEditorStyles.languageDropdownWrapper
                        }
                        ref={dropdownRef}
                      >
                        <button
                          className={
                            mainPageTryEditorStyles.languageDropdownButton
                          }
                          type="button"
                          onClick={() => setDropdownOpen((open) => !open)}
                          aria-haspopup="listbox"
                          aria-expanded={dropdownOpen}
                        >
                          <span>
                            {editorLanguages.find((l) => l.value === algoLang)
                              ?.label || "Select Language"}
                          </span>
                          <FiIcons.FiChevronDown
                            style={{
                              marginLeft: 8,
                              fontSize: 16,
                              transition: "transform 0.2s ease",
                              transform: dropdownOpen
                                ? "rotate(180deg)"
                                : "rotate(0deg)",
                            }}
                          />
                        </button>
                        {dropdownOpen && (
                          <div
                            className={
                              mainPageTryEditorStyles.languageDropdownMenu
                            }
                            role="listbox"
                          >
                            <div
                              className={
                                mainPageTryEditorStyles.languageDropdownColumn
                              }
                            >
                              {leftLanguages.map((lang) => (
                                <button
                                  key={lang.value}
                                  className={
                                    mainPageTryEditorStyles.languageDropdownItem +
                                    (algoLang === lang.value
                                      ? " " + mainPageTryEditorStyles.selected
                                      : "")
                                  }
                                  onClick={() => {
                                    handleAlgoLangChange({
                                      target: { value: lang.value },
                                    } as any);
                                    setDropdownOpen(false);
                                  }}
                                  type="button"
                                  role="option"
                                  aria-selected={algoLang === lang.value}
                                >
                                  {lang.label}
                                </button>
                              ))}
                            </div>
                            <div
                              className={
                                mainPageTryEditorStyles.languageDropdownColumn
                              }
                            >
                              {rightLanguages.map((lang) => (
                                <button
                                  key={lang.value}
                                  className={
                                    mainPageTryEditorStyles.languageDropdownItem +
                                    (algoLang === lang.value
                                      ? " " + mainPageTryEditorStyles.selected
                                      : "")
                                  }
                                  onClick={() => {
                                    handleAlgoLangChange({
                                      target: { value: lang.value },
                                    } as any);
                                    setDropdownOpen(false);
                                  }}
                                  type="button"
                                  role="option"
                                  aria-selected={algoLang === lang.value}
                                >
                                  {lang.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div style={{ width: "100%" }}>
                        <JsTryEditor
                          language={algoLang}
                          value={algoCode}
                          onChange={setAlgoCode}
                          showRunButton={true}
                        />
                      </div>
                    </div>
                  )}
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
