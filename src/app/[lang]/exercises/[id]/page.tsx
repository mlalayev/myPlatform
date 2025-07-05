"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { use } from "react";
import { exercises } from "../exercisesData";
import JsTryEditor from "../../components/tryeditor/JsTryEditor";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import styles from "../ExercisesList.module.css";
import detailStyles from "./ExerciseDetail.module.css";
import workerCode from "./sandboxWorkerString";
import SavadliButton from "../../components/Buttons/savadliButton/SavadliButton";
import CodeEvalResult from "./CodeEvalResult";
import ComplexityModal from "./ComplexityModal";
import {
  FiCode,
  FiPlay,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiUsers,
  FiTarget,
  FiBookOpen,
  FiEdit3,
  FiEye,
  FiAlertTriangle,
  FiInfo,
  FiMinusCircle,
} from "react-icons/fi";
import { useI18n } from "@/contexts/I18nContext";

const LEFT_TABS = ["Təsvir", "Redaktə", "Həllər", "Təqdimatlar"];

interface ExerciseDetailPageProps {
  params: Promise<{ id: string }>;
}

function createSandboxWorker() {
  const blob = new Blob([workerCode], { type: "application/javascript" });
  return new Worker(URL.createObjectURL(blob));
}

interface FailedCase {
  input: string;
  output: string;
  expected: string;
}

// Add languageSamples for default code templates
const languageSamples = {
  javascript: `function solution() {\n  \n}`,
  python: `def solution():\n    pass`,
};

const languageOptions = [
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  // Add more languages here as needed
];

export default function ExerciseDetailPage({
  params,
}: ExerciseDetailPageProps) {
  const { id } = use(params);
  const [leftTab, setLeftTab] = useState(0);
  const [customInput, setCustomInput] = useState("");
  const [output, setOutput] = useState("");
  const [testResults, setTestResults] = useState<any[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [feedbackType, setFeedbackType] = useState<
    "success" | "error" | "wrong" | null
  >(null);
  const [activeCase, setActiveCase] = useState(0);
  const [userCode, setUserCode] = useState("function solution() {\n\n}");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [detectedComplexity, setDetectedComplexity] = useState<string | null>(
    null
  );
  const [activeLeftTab, setActiveLeftTab] = useState(0);
  const [failedCases, setFailedCases] = useState<FailedCase[]>([]);
  const resultTabAvailable = submitted;
  const isCorrect = submitted && failedCases.length === 0;
  const [showComplexity, setShowComplexity] = useState(false);
  const [isComplexityModalOpen, setIsComplexityModalOpen] = useState(false);
  const [latestSubmission, setLatestSubmission] = useState<any>(null);
  const [statusIcon, setStatusIcon] = useState<React.ReactNode>(
    <FiMinusCircle color="gray" title="Not submitted" />
  );
  const codeInitialized = useRef(false);
  const { t, lang } = useI18n();
  const getInitialLanguage = () => {
    if (typeof window !== "undefined") {
      const globalLang = localStorage.getItem("quiz_global_lang");
      if (globalLang) return globalLang;
    }
    return "javascript";
  };
  const [language, setLanguage] = useState(getInitialLanguage);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const exercise = exercises.find((ex) => ex.id === id);
  if (!exercise) return <div>Tapşırıq tapılmadı.</div>;

  // When quiz id changes, reset codeInitialized
  useEffect(() => {
    codeInitialized.current = false;
  }, [id]);

  // Only set code from backend on initial load per quiz
  useEffect(() => {
    if (
      latestSubmission &&
      latestSubmission.answers &&
      typeof latestSubmission.answers.code === "string" &&
      !codeInitialized.current
    ) {
      setUserCode(latestSubmission.answers.code);
      codeInitialized.current = true;
    }
  }, [latestSubmission]);

  // Add a function to fetch and update latest submission and status icon
  const refreshLatestSubmission = useCallback(async () => {
    if (!exercise) return;
    const res = await fetch(
      `/api/quiz/${id}/latest?maxTestCases=${exercise.testCases.length}`
    );
    const data = await res.json();
    console.log(
      "Latest submission from backend:",
      data.latest,
      "hasPassed:",
      data.hasPassed,
      "hasWrong:",
      data.hasWrong
    );
    setLatestSubmission(data.latest);
    // Improved status icon logic
    if (data.hasPassed) {
      setStatusIcon(<FiCheckCircle color="green" title="Correct" />);
    } else if (data.hasWrong) {
      setStatusIcon(<FiXCircle color="red" title="Incorrect" />);
    } else {
      setStatusIcon(<FiMinusCircle color="gray" title="Not submitted" />);
    }
  }, [exercise, id]);

  // On mount, fetch latest submission
  useEffect(() => {
    refreshLatestSubmission();
  }, [refreshLatestSubmission]);

  // Autosave code to localStorage on every change
  useEffect(() => {
    if (id) {
      localStorage.setItem(`quiz_code_${id}`, userCode);
    }
  }, [userCode, id]);

  // On mount, if no latest submission, restore code from localStorage
  useEffect(() => {
    if (!latestSubmission && id) {
      const saved = localStorage.getItem(`quiz_code_${id}`);
      if (saved) setUserCode(saved);
    }
  }, [latestSubmission, id]);

  // On mount, set language from localStorage
  useEffect(() => {
    if (id) {
      const savedLang = localStorage.getItem(`quiz_lang_${id}`);
      if (savedLang) {
        setLanguage(savedLang);
      } else {
        const globalLang = localStorage.getItem("quiz_global_lang");
        setLanguage(globalLang || "javascript");
      }
    }
  }, [id]);

  // When user changes language, update only the global value
  useEffect(() => {
    if (language) {
      localStorage.setItem("quiz_global_lang", language);
    }
  }, [language]);

  // On mount, if no latest submission, restore code from localStorage for this question and language
  useEffect(() => {
    if (!latestSubmission && id && language) {
      const saved = localStorage.getItem(`quiz_code_${id}_${language}`);
      if (saved) setUserCode(saved);
    }
  }, [latestSubmission, id, language]);

  // Mock run/submit logic
  const runCode = () => {
    setOutput(customInput ? `Çıxış: ${customInput}` : "Çıxış yoxdur");
  };

  const analyzeTimeComplexity = (code: string) => {
    const forMatches = code.match(/for\s*\(/g) || [];
    if (forMatches.length === 0) return "O(1)";
    if (forMatches.length === 1) return "O(n)";
    if (forMatches.length === 2) return "O(n^2)";
    if (forMatches.length === 3) return "O(n^3)";
    return `O(n^${forMatches.length})`;
  };

  function isSafeCode(code: string): boolean {
    const blacklist = [
      /window\b/i,
      /document\b/i,
      /fetch\b/i,
      /require\b/i,
      /import\b/i,
      /\bFunction\s*\(/,
      /setInterval\b/i,
      /setTimeout\b/i,
      /XMLHttpRequest\b/i,
      /localStorage\b/i,
      /sessionStorage\b/i,
      /globalThis\b/i,
      /process\b/i,
      /eval\b/i,
    ];
    return !blacklist.some((re) => re.test(code));
  }

  function isEqual(result: any, expected: any): boolean {
    let parsedExpected = expected;

    if (typeof expected === "string") {
      try {
        parsedExpected = JSON.parse(expected);
      } catch {
        // not a JSON string, leave as is
      }
    }

    // If result is undefined or null, only pass if expected is also undefined or null
    if (result === undefined || result === null) {
      return parsedExpected === undefined || parsedExpected === null;
    }

    // Strict array check
    if (Array.isArray(result) && Array.isArray(parsedExpected)) {
      if (result.length !== parsedExpected.length) return false;
      for (let i = 0; i < result.length; i++) {
        if (result[i] === undefined || result[i] !== parsedExpected[i])
          return false;
      }
      return true;
    }

    if (
      typeof result === "object" &&
      result !== null &&
      typeof parsedExpected === "object" &&
      parsedExpected !== null
    ) {
      return JSON.stringify(result) === JSON.stringify(parsedExpected);
    }

    if (
      (typeof result === "number" ||
        typeof result === "string" ||
        typeof result === "boolean") &&
      (typeof parsedExpected === "number" ||
        typeof parsedExpected === "string" ||
        typeof parsedExpected === "boolean")
    ) {
      return result == parsedExpected;
    }

    return String(result).trim() === String(parsedExpected).trim();
  }

  const submitCode = async () => {
    setIsSubmitting(true);
    setDetectedComplexity(null);
    let passedCount = 0;
    let failedCase = null;
    let failedCasesArr = [];
    if (!isSafeCode(userCode)) {
      setFeedback("Kod təhlükəli əmrlər ehtiva edir!");
      setFeedbackType("error");
      setTestResults([]);
      setSubmitted(true);
      setIsSubmitting(false);
      setActiveLeftTab(4);
      setFailedCases([]);
      return;
    }

    const bodyMatch = userCode.match(/{([\s\S]*)}/);
    if (bodyMatch) setDetectedComplexity(analyzeTimeComplexity(bodyMatch[1]));

    try {
      for (let i = 0; i < exercise.testCases.length; i++) {
        const tc = exercise.testCases[i];
        let args;
        if (exercise.inputParser) {
          args = exercise.inputParser(tc.input);
        } else {
          args = tc.input.split(" ").map(Number);
        }

        let result, error;
        let functionName = "solution";
        let functionFound = true;
        if (language === "python") {
          // Detect function name in user code
          const match = userCode.match(/def\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/);
          if (match) functionName = match[1];
          else functionFound = false;
          if (!functionFound) {
            setFeedback(
              "Funksiya tapılmadı! Zəhmət olmasa, funksiyanı düzgün şəkildə yazın, məsələn: def myfunc(...):"
            );
            setFeedbackType("error");
            setTestResults([]);
            setSubmitted(true);
            setIsSubmitting(false);
            setDetectedComplexity(null);
            setActiveLeftTab(4);
            setFailedCases([]);
            return;
          }
          // Prepare Python code to call the detected function and print result as JSON if needed
          let callCode = "";
          let argsStr = "";
          if (Array.isArray(args)) {
            argsStr = args
              .map((a) =>
                typeof a === "string" ? `\"${a}\"` : JSON.stringify(a)
              )
              .join(", ");
          } else {
            argsStr = JSON.stringify(args);
          }
          callCode = `\nimport json\nresult = ${functionName}(${argsStr})\nif isinstance(result, (list, dict)):\n    print(json.dumps(result))\nelse:\n    print(result)`;
          const fullCode = `${userCode}${callCode}`;
          const resp = await fetch("/api/execute", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code: fullCode, language: "python" }),
          });
          const data = await resp.json();
          try {
            // Try to parse as JSON (for lists, dicts, etc.)
            result = JSON.parse(data.output);
          } catch {
            // Fallback to string
            result = data.output;
          }
          error = data.error;
        } else {
          // Detect function name in JS code
          const match = userCode.match(
            /function\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/
          );
          if (match) functionName = match[1];
          else functionFound = false;
          if (!functionFound) {
            setFeedback(
              "Funksiya tapılmadı! Zəhmət olmasa, funksiyanı düzgün şəkildə yazın, məsələn: function myfunc(...) {} və ya const/let/var myfunc = ..."
            );
            setFeedbackType("error");
            setTestResults([]);
            setSubmitted(true);
            setIsSubmitting(false);
            setDetectedComplexity(null);
            setActiveLeftTab(4);
            setFailedCases([]);
            return;
          }
          // JS/TS: use worker, pass functionName
          const worker = createSandboxWorker();
          const resultPromise = new Promise<{ result?: any; error?: string }>(
            (resolve) => {
              worker.onmessage = (e: MessageEvent) => resolve(e.data);
              worker.postMessage({ code: userCode, args, functionName });
            }
          );
          const timeoutPromise = new Promise<{ error: string }>((resolve) =>
            setTimeout(() => {
              worker.terminate();
              resolve({ error: "Kodun icrası çox uzun çəkdi (timeout)!" });
            }, 2000)
          );
          const response: { result?: any; error?: string } = await Promise.race(
            [resultPromise, timeoutPromise]
          );
          result = response.result;
          error = response.error;
        }
        if (error) {
          setFeedback(error);
          setFeedbackType("error");
          setTestResults([]);
          setSubmitted(true);
          setIsSubmitting(false);
          setDetectedComplexity(null);
          setActiveLeftTab(4);
          setFailedCases([]);
          return;
        }
        const passed = isEqual(result, tc.expectedOutput);
        if (passed) {
          passedCount++;
        } else {
          failedCase = {
            input: tc.input,
            output: String(result),
            expected: String(tc.expectedOutput),
          };
          failedCasesArr.push(failedCase);
        }
      }
    } catch (e) {
      setFeedback(`Kodda xəta var! ${String(e)}`);
      setFeedbackType("error");
      setTestResults([]);
      setSubmitted(true);
      setIsSubmitting(false);
      setDetectedComplexity(null);
      setActiveLeftTab(4);
      setFailedCases([]);
      return;
    }

    setSubmitted(true);
    setIsSubmitting(false);
    setActiveLeftTab(4);

    // Submit to backend - ALWAYS submit regardless of correctness
    try {
      await fetch("/api/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quizId: Number(id),
          score: exercise
            ? failedCasesArr.length === 0
              ? exercise.testCases.length
              : exercise.testCases.length - failedCasesArr.length
            : 0,
          answers: { failedCases: failedCasesArr },
          code: userCode,
          language,
        }),
      });
      // Save code to localStorage after submit
      if (id) {
        localStorage.setItem(`quiz_code_${id}_${language}`, userCode);
      }
      // After submit, refresh latest submission and status icon
      await refreshLatestSubmission();
    } catch (e) {
      console.error("Error submitting to backend:", e);
    }

    if (failedCasesArr.length > 0) {
      setFailedCases(failedCasesArr);
      setFeedback(
        `${passedCount}/${exercise.testCases.length} test keçdi. İlk səhv test: input = ${failedCasesArr[0].input}, gözlənilən = ${failedCasesArr[0].expected}, sənin çıxışın = ${failedCasesArr[0].output}`
      );
      setFeedbackType("wrong");
      setTestResults([]);
      setDetectedComplexity(null);
      return;
    }

    // All tests passed
    setFailedCases([]);
    setFeedback(
      exercise
        ? `${exercise.testCases.length}/${exercise.testCases.length} test uğurla keçdi!`
        : "Bütün testlər uğurla keçdi!"
    );
    setFeedbackType("success");
    setTestResults([]);
  };

  const visibleCases = exercise.testCases.filter((tc) => !tc.hidden);

  type LeftTab = { label: string; result?: boolean; icon: React.ReactNode };
  const leftTabs: LeftTab[] = [
    { label: "Təsvir", icon: <FiBookOpen /> },
    { label: "Redaktə", icon: <FiEdit3 /> },
    { label: "Həllər", icon: <FiCode /> },
    { label: "Təqdimatlar", icon: <FiEye /> },
  ];

  if (resultTabAvailable) {
    if (feedbackType === "error") {
      leftTabs.push({
        label: "Xəta",
        result: true,
        icon: <FiXCircle />,
      });
    } else {
      leftTabs.push({
        label: isCorrect ? "Doğru Cavab" : "Yalnış Cavab",
        result: true,
        icon: isCorrect ? <FiCheckCircle /> : <FiXCircle />,
      });
    }
  }

  const difficultyColor = (diff: string) => {
    switch (diff) {
      case "Asan":
        return detailStyles.easy;
      case "Orta":
        return detailStyles.medium;
      case "Çətin":
        return detailStyles.hard;
      default:
        return "";
    }
  };

  const difficultyIcon = (diff: string) => {
    switch (diff) {
      case "Asan":
        return "🟢";
      case "Orta":
        return "🟡";
      case "Çətin":
        return "🔴";
      default:
        return "⚪";
    }
  };

  useEffect(() => {
    // Only update code if it matches the previous language's default or is empty
    if (
      !userCode ||
      userCode === languageSamples.javascript ||
      userCode === languageSamples.python
    ) {
      setUserCode(
        languageSamples[language as keyof typeof languageSamples] || ""
      );
    }
    // eslint-disable-next-line
  }, [language]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <Header />

      {/* Hero Section */}
      <section className={detailStyles.heroSection}>
        <div className={detailStyles.heroContent}>
          <div className={detailStyles.heroLeft}>
            <div className={detailStyles.breadcrumb}>
              <span>Tapşırıqlar</span>
              <span className={detailStyles.breadcrumbSeparator}>/</span>
              <span>#{exercise.id}</span>
            </div>
            <h1 className={detailStyles.heroTitle}>
              {exercise.title} {statusIcon}
            </h1>
            <p className={detailStyles.heroDescription}>
              {exercise.description}
            </p>

            <div className={detailStyles.heroStats}>
              <div className={detailStyles.statItem}>
                <FiUsers className={detailStyles.statIcon} />
                <span>{exercise.acceptance}% Qəbul</span>
              </div>
              <div className={detailStyles.statItem}>
                <FiClock className={detailStyles.statIcon} />
                <span>{exercise.timeComplexity}</span>
              </div>
              <div className={detailStyles.statItem}>
                <FiTarget className={detailStyles.statIcon} />
                <span>{exercise.spaceComplexity}</span>
              </div>
            </div>
          </div>

          <div className={detailStyles.heroRight}>
            <div className={detailStyles.difficultyCard}>
              <div className={detailStyles.difficultyHeader}>
                <span className={detailStyles.difficultyLabel}>Çətinlik</span>
                <span
                  className={`${detailStyles.difficultyBadge} ${difficultyColor(
                    exercise.difficulty
                  )}`}
                >
                  {difficultyIcon(exercise.difficulty)} {exercise.difficulty}
                </span>
              </div>
              <div className={detailStyles.tagsContainer}>
                {exercise.tags.map((tag) => (
                  <span key={tag} className={detailStyles.tag}>
                    <FiCode className={detailStyles.tagIcon} />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className={detailStyles.mainContainer}>
        {/* Left: Problem Description and Tabs */}
        <div className={detailStyles.leftPanel}>
          <div className={detailStyles.tabBar}>
            {leftTabs.map((tab, i) => (
              <button
                key={tab.label}
                className={
                  `${detailStyles.tabButton} ` +
                  (activeLeftTab === i ? detailStyles.active : "") +
                  ((tab.result ?? false) && feedbackType === "error"
                    ? " " + detailStyles.xeta
                    : "") +
                  ((tab.result ?? false) && isCorrect
                    ? " " + detailStyles.correct
                    : "") +
                  ((tab.result ?? false) &&
                  !isCorrect &&
                  feedbackType !== "error"
                    ? " " + detailStyles.wrong
                    : "")
                }
                onClick={() => setActiveLeftTab(i)}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          <div className={detailStyles.tabContent}>
            {activeLeftTab === 0 && (
              <div className={detailStyles.descriptionContent}>
                <div className={detailStyles.section}>
                  <h3 className={detailStyles.sectionTitle}>Problem Təsviri</h3>
                  <p className={detailStyles.descriptionText}>
                    {exercise.description}
                  </p>
                </div>

                <div className={detailStyles.section}>
                  <h3 className={detailStyles.sectionTitle}>Məhdudiyyətlər</h3>
                  <ul className={detailStyles.constraintsList}>
                    {exercise.constraints.map((constraint, i) => (
                      <li key={i} className={detailStyles.constraintItem}>
                        {constraint}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={detailStyles.section}>
                  <h3 className={detailStyles.sectionTitle}>Nümunələr</h3>
                  {exercise.examples.map((ex, i) => (
                    <div key={i} className={detailStyles.exampleCard}>
                      <div className={detailStyles.exampleHeader}>
                        <span className={detailStyles.exampleNumber}>
                          Nümunə {i + 1}
                        </span>
                      </div>
                      <div className={detailStyles.exampleContent}>
                        <div className={detailStyles.exampleRow}>
                          <span className={detailStyles.exampleLabel}>
                            Input:
                          </span>
                          <code className={detailStyles.exampleCode}>
                            {ex.input}
                          </code>
                        </div>
                        <div className={detailStyles.exampleRow}>
                          <span className={detailStyles.exampleLabel}>
                            Output:
                          </span>
                          <code className={detailStyles.exampleCode}>
                            {ex.output}
                          </code>
                        </div>
                        {ex.explanation && (
                          <div className={detailStyles.exampleRow}>
                            <span className={detailStyles.exampleLabel}>
                              İzah:
                            </span>
                            <span className={detailStyles.exampleExplanation}>
                              {ex.explanation}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeLeftTab === 1 && (
              <div className={detailStyles.placeholderContent}>
                <FiEdit3 className={detailStyles.placeholderIcon} />
                <h3>Redaktə Bölməsi</h3>
                <p>Bu bölmə tezliklə əlavə olunacaq...</p>
              </div>
            )}

            {activeLeftTab === 2 && (
              <div className={detailStyles.placeholderContent}>
                <FiCode className={detailStyles.placeholderIcon} />
                <h3>Həllər Bölməsi</h3>
                <p>Bu bölmə tezliklə əlavə olunacaq...</p>
              </div>
            )}

            {activeLeftTab === 3 && (
              <div className={detailStyles.placeholderContent}>
                <FiEye className={detailStyles.placeholderIcon} />
                <h3>Təqdimatlar Bölməsi</h3>
                <p>Bu bölmə tezliklə əlavə olunacaq...</p>
              </div>
            )}

            {activeLeftTab === 4 &&
              resultTabAvailable &&
              (feedbackType === "error" ? (
                <div className={detailStyles.errorResultBox}>
                  <div className={detailStyles.errorHeader}>
                    <FiXCircle className={detailStyles.errorIcon} />
                    <h3 className={detailStyles.errorTitle}>Xəta baş verdi</h3>
                  </div>
                  <div className={detailStyles.errorMessage}>{feedback}</div>
                </div>
              ) : (
                <CodeEvalResult
                  status={isCorrect ? "correct" : "wrong"}
                  passedCount={
                    isCorrect
                      ? exercise.testCases.length
                      : exercise.testCases.length - failedCases.length
                  }
                  totalCount={exercise.testCases.length}
                  failedCases={failedCases}
                  onAnalyzeComplexity={() => setIsComplexityModalOpen(true)}
                />
              ))}
          </div>
        </div>

        {/* Right: Code Editor and Test Cases */}
        <div className={detailStyles.rightPanel}>
          <div className={detailStyles.editorSection}>
            <div className={detailStyles.editorHeader}>
              <h3 className={detailStyles.editorTitle}>
                <FiCode className={detailStyles.editorIcon} />
                Kod Redaktəsi
              </h3>

              <div style={{ position: "relative" }}>
                <div
                  onClick={() => setDropdownOpen((open) => !open)}
                  style={{
                    padding: "6px 14px 6px 10px",
                    borderRadius: 8,
                    border: "1px solid #e2e8f0",
                    background: "white",
                    fontWeight: 600,
                    fontSize: 15,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <span style={{ marginRight: 4 }}>
                    {languageOptions.find((opt) => opt.value === language)
                      ?.label || language}
                  </span>
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M6 8L10 12L14 8"
                      stroke="#888"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                <div
                  ref={dropdownRef}
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    zIndex: 2,
                    width: 120,
                    display: "flex",
                    justifyContent: "center",
                    userSelect: "none",
                  }}
                >
                  {dropdownOpen && (
                    <div
                      style={{
                        position: "relative",
                        top: "100%",
                        left: 0,
                        background: "white",
                        border: "1px solid #e2e8f0",
                        borderRadius: 8,
                        boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                        minWidth: 120,
                        padding: "4px 0",
                      }}
                    >
                      {languageOptions.map((opt) => (
                        <div
                          key={opt.value}
                          onClick={() => {
                            setLanguage(opt.value);
                            setDropdownOpen(false);
                          }}
                          style={{
                            padding: "8px 16px",
                            cursor: "pointer",
                            background:
                              opt.value === language ? "#f0f4fa" : "white",
                            fontWeight: opt.value === language ? 700 : 500,
                            color: opt.value === language ? "#2b6cb0" : "#222",
                            fontSize: 15,
                          }}
                        >
                          {opt.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div
              className={detailStyles.editorContainer}
              style={{ position: "relative" }}
            >
              {/* Custom Language Picker Dropdown */}

              <JsTryEditor
                value={userCode}
                onChange={setUserCode}
                language={language}
              />
              <SavadliButton
                text={isSubmitting ? "Yoxlanır..." : "Submit"}
                position="absolute"
                right={"2%"}
                bottom={"11.3%"}
                onClick={submitCode}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className={detailStyles.testCasesSection}>
            <div className={detailStyles.testCasesHeader}>
              <h3 className={detailStyles.testCasesTitle}>
                <FiPlay className={detailStyles.testCasesIcon} />
                Test Halları
              </h3>
            </div>

            <div className={detailStyles.testCasesTabs}>
              {visibleCases.map((tc, i) => (
                <button
                  key={i}
                  onClick={() => setActiveCase(i)}
                  className={`${detailStyles.testCaseTab} ${
                    activeCase === i ? detailStyles.active : ""
                  }`}
                >
                  Case {i + 1}
                </button>
              ))}
            </div>

            <div className={detailStyles.testCaseContent}>
              <div className={detailStyles.testCaseRow}>
                <span className={detailStyles.testCaseLabel}>Input:</span>
                <code className={detailStyles.testCaseCode}>
                  {visibleCases[activeCase]?.input}
                </code>
              </div>

              <div className={detailStyles.testCaseRow}>
                <span className={detailStyles.testCaseLabel}>
                  Gözlənilən çıxış:
                </span>
                <code className={detailStyles.testCaseCode}>
                  {visibleCases[activeCase]?.expectedOutput}
                </code>
              </div>

              <div className={detailStyles.customInputSection}>
                <input
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  placeholder="Custom input (məsələn: 2 3)"
                  className={detailStyles.customInput}
                />
                <button onClick={runCode} className={detailStyles.runButton}>
                  <FiPlay className={detailStyles.runIcon} />
                  Run
                </button>
              </div>

              {output && (
                <div className={detailStyles.outputBox}>
                  <span className={detailStyles.outputLabel}>Nəticə:</span>
                  <code className={detailStyles.outputCode}>{output}</code>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ComplexityModal
        isOpen={isComplexityModalOpen}
        onClose={() => setIsComplexityModalOpen(false)}
        timeComplexity={detectedComplexity}
        spaceComplexity={null}
        userCode={userCode}
      />

      <Footer />
    </>
  );
}
