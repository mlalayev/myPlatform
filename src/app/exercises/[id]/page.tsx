"use client";
import React, { useState } from "react";
import { use } from "react";
import { exercises } from "../exercisesData";
import JsTryEditor from "@/app/components/tryeditor/JsTryEditor";
import Header from "../../components/header/Header";
import Sidebar from "../../components/sidebar/Sidebar";
import styles from "../ExercisesList.module.css";
import detailStyles from "./ExerciseDetail.module.css";

const LEFT_TABS = ["Təsvir", "Redaktə", "Həllər", "Təqdimatlar"];

interface ExerciseDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function ExerciseDetailPage({
  params,
}: ExerciseDetailPageProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { id } = use(params);
  const [leftTab, setLeftTab] = useState(0);
  const [customInput, setCustomInput] = useState("");
  const [output, setOutput] = useState("");
  const [testResults, setTestResults] = useState<any[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [feedbackType, setFeedbackType] = useState<"success" | "error" | null>(
    null
  );
  const [activeCase, setActiveCase] = useState(0);
  const [userCode, setUserCode] = useState(
    "function sum() {\n\n}"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [detectedComplexity, setDetectedComplexity] = useState<string | null>(null);

  const exercise = exercises.find((ex) => ex.id === id);
  if (!exercise) return <div>Tapşırıq tapılmadı.</div>;

  const toggleSidebar = () => setIsSidebarOpen((v) => !v);

  // Mock run/submit logic
  const runCode = () => {
    setOutput(customInput ? `Çıxış: ${customInput}` : "Çıxış yoxdur");
  };
  const analyzeTimeComplexity = (code: string) => {
    // Simple static analysis: count nested for-loops
    // This is a naive approach and can be improved with a real parser
    const forMatches = code.match(/for\s*\(/g) || [];
    if (forMatches.length === 0) return 'O(1)';
    if (forMatches.length === 1) return 'O(n)';
    if (forMatches.length === 2) return 'O(n^2)';
    if (forMatches.length === 3) return 'O(n^3)';
    return `O(n^${forMatches.length})`;
  };
  const submitCode = () => {
    setIsSubmitting(true);
    let passedCount = 0;
    let failedCase = null;
    try {
      // Extract the function body from userCode
      const bodyMatch = userCode.match(/{([\s\S]*)}/);
      if (!bodyMatch) {
        setFeedback("Funksiya gövdəsi tapılmadı!");
        setFeedbackType("error");
        setTestResults([]);
        setSubmitted(true);
        setIsSubmitting(false);
        setDetectedComplexity(null);
        return;
      }
      const userBody = bodyMatch[1];
      const userFunc = new Function(
        "...args",
        `const [a, b] = args; ${userBody}`
      );
      for (let i = 0; i < exercise.testCases.length; i++) {
        const tc = exercise.testCases[i];
        const args = tc.input.split(" ").map(Number);
        let userOutput;
        try {
          userOutput = userFunc(...args);
        } catch (e) {
          userOutput = "Xəta";
        }
        const passed = String(userOutput) === tc.expectedOutput;
        if (!passed) {
          failedCase = {
            input: tc.input,
            expected: tc.expectedOutput,
            output: String(userOutput),
            index: i + 1,
          };
          break;
        }
        passedCount++;
      }
      // Analyze time complexity
      setDetectedComplexity(analyzeTimeComplexity(userBody));
    } catch (e) {
      setFeedback("Kodda xəta var!");
      setFeedbackType("error");
      setTestResults([]);
      setSubmitted(true);
      setIsSubmitting(false);
      setDetectedComplexity(null);
      return;
    }
    setSubmitted(true);
    setIsSubmitting(false);
    if (failedCase) {
      setFeedback(
        `${passedCount}/${exercise.testCases.length} test keçdi. İlk səhv test: input = ${failedCase.input}, gözlənilən = ${failedCase.expected}, sənin çıxışın = ${failedCase.output}`
      );
      setFeedbackType("error");
    } else {
      setFeedback(
        `${exercise.testCases.length}/${exercise.testCases.length} test uğurla keçdi!`
      );
      setFeedbackType("success");
    }
    setTestResults([]); // Hide detailed results
  };

  // Test case panel logic
  const visibleCases = exercise.testCases.filter((tc) => !tc.hidden);

  return (
    <>
      <Header isSidebarOpen={isSidebarOpen} onToggleSidebar={toggleSidebar} />
      <div className={styles.layout}>
        <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
        <div
          className={isSidebarOpen ? styles.contentOpen : styles.contentClosed}
        >
          <div className={detailStyles.container}>
            {/* Left Panel: Problem Details with Tabs */}
            <div className={detailStyles.leftPanel}>
              <div className={detailStyles.leftTabs}>
                {LEFT_TABS.map((tab, i) => (
                  <button
                    key={tab}
                    onClick={() => setLeftTab(i)}
                    className={
                      detailStyles.leftTabButton +
                      (leftTab === i ? " " + detailStyles.active : "")
                    }
                  >
                    {tab}
                  </button>
                ))}
              </div>
              {leftTab === 0 && (
                <div className={detailStyles.leftTabContent}>
                  <h1
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: 700,
                      marginBottom: 8,
                    }}
                  >
                    {exercise.title}
                  </h1>
                  <div
                    style={{
                      display: "flex",
                      gap: 12,
                      alignItems: "center",
                      marginBottom: 8,
                    }}
                  >
                    <span
                      className={
                        detailStyles.difficulty +
                        " " +
                        (exercise.difficulty === "Asan"
                          ? detailStyles.easy
                          : exercise.difficulty === "Orta"
                          ? detailStyles.medium
                          : detailStyles.hard)
                      }
                    >
                      {exercise.difficulty}
                    </span>
                    {exercise.tags.map((tag) => (
                      <span key={tag} className={detailStyles.tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div style={{ color: "#f3f3f3", marginBottom: 18 }}>
                    {exercise.description}
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <b>Məhdudiyyətlər:</b>
                    <ul style={{ margin: 0, paddingLeft: 18 }}>
                      {exercise.constraints.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <b>Nümunələr:</b>
                    <ul style={{ margin: 0, paddingLeft: 18 }}>
                      {exercise.examples.map((ex, i) => (
                        <li key={i}>
                          <span style={{ color: "#6c3fc5" }}>Input:</span>{" "}
                          {ex.input}{" "}
                          <span style={{ color: "#ff8800", marginLeft: 8 }}>
                            Output:
                          </span>{" "}
                          {ex.output}
                          {ex.explanation && (
                            <span style={{ color: "#888", marginLeft: 8 }}>
                              ({ex.explanation})
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
              {leftTab !== 0 && (
                <div
                  style={{ color: "#aaa", fontStyle: "italic", marginTop: 32 }}
                >
                  Bu bölmə hələ aktiv deyil.
                </div>
              )}
            </div>

            {/* Right Panel: Code Editor, Test Cases, Output */}
            <div className={detailStyles.rightPanel}>
              <div className={detailStyles.codeHeader}>
                <div className={detailStyles.codeHeaderRow}>
                  <span style={{ fontWeight: 700, fontSize: "1.1rem" }}>
                    Kod
                  </span>
                  <button
                    onClick={submitCode}
                    className={detailStyles.submitButton}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Yoxlanır..." : "Submit"}
                  </button>
                </div>
                <JsTryEditor value={userCode} onChange={setUserCode} />
              </div>
              {/* Testcase Panel */}
              <div className={detailStyles.testcasePanel}>
                <div className={detailStyles.testcaseTabs}>
                  {visibleCases.map((tc, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveCase(i)}
                      className={
                        detailStyles.testcaseTabButton +
                        (activeCase === i ? " " + detailStyles.active : "")
                      }
                    >
                      Case {i + 1}
                    </button>
                  ))}
                </div>
                <div style={{ marginBottom: 8, color: "#bdbdbd" }}>
                  <b>Input:</b> {visibleCases[activeCase]?.input}
                </div>
                <div style={{ marginBottom: 8, color: "#bdbdbd" }}>
                  <b>Gözlənilən çıxış:</b>{" "}
                  {visibleCases[activeCase]?.expectedOutput}
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                  <input
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    placeholder="Custom input (məsələn: 2 3)"
                    className={detailStyles.inputBox}
                  />
                  <button onClick={runCode} className={detailStyles.runButton}>
                    Run
                  </button>
                </div>
                {output && (
                  <div className={detailStyles.outputBox}>Nəticə: {output}</div>
                )}
              </div>
              {/* Test Case Results */}
              {submitted && (
                <div style={{ marginBottom: 24 }}>
                  {feedback && (
                    <div
                      className={
                        detailStyles.feedback +
                        " " +
                        (feedbackType === "success"
                          ? detailStyles.success
                          : feedbackType === "error"
                          ? detailStyles.error
                          : "")
                      }
                    >
                      {feedback}
                    </div>
                  )}
                  <div className={detailStyles.testResultsHeader}>
                    Test nəticələri:
                  </div>
                  <div className={detailStyles.testResultsBox}>
                    {testResults.map((r, i) => (
                      <div
                        key={i}
                        className={
                          detailStyles.testResultRow +
                          " " +
                          (r.status === "Passed"
                            ? detailStyles.passed
                            : detailStyles.failed)
                        }
                      >
                        <b>
                          {r.status === "Passed" ? "✅ Keçdi" : "❌ Uğursuz"}
                        </b>{" "}
                        | <b>Input:</b> {r.hidden ? "[Gizli test]" : r.input} |{" "}
                        <b>Sənin çıxışın:</b> {r.output} |{" "}
                        <b>Gözlənilən çıxış:</b> {r.expected} | <b>Zaman:</b>{" "}
                        {r.time} | <b>Yaddaş:</b> {r.memory}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* Hints */}
              {exercise.hints && exercise.hints.length > 0 && (
                <div className={detailStyles.hintsBox}>
                  <b>İpuçları:</b>
                  <ul style={{ margin: 0, paddingLeft: 18 }}>
                    {exercise.hints.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                </div>
              )}
              {/* Post-solve UI */}
              {submitted && (
                <div className={detailStyles.postSolveBox}>
                  <div style={{ fontWeight: 700, marginBottom: 8 }}>
                    Həll və Analiz
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    <b>Həll:</b>
                    <pre
                      style={{
                        background: "#232136",
                        color: "#fff",
                        borderRadius: 6,
                        padding: 12,
                        fontSize: 15,
                        marginTop: 6,
                      }}
                    >
                      {exercise.solution}
                    </pre>
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    <b>Zaman mürəkkəbliyi:</b> {exercise.timeComplexity}
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    <b>Yaddaş mürəkkəbliyi:</b> {exercise.spaceComplexity}
                  </div>
                  <button
                    onClick={() => (window.location.href = "/exercises")}
                    className={detailStyles.submitButton}
                    style={{ marginTop: 8 }}
                  >
                    Başqa tapşırıq
                  </button>
                </div>
              )}
              {/* Star/Save, Daily Challenge, Stats (mocked) */}
              <div className={detailStyles.saveRow}>
                <button className={detailStyles.saveButton}>
                  ⭐ Yadda saxla
                </button>
                <span className={detailStyles.dailyTag}>Günün tapşırığı</span>
                <span className={detailStyles.stats}>
                  Cəhd sayı: 2 | Uğur faizi: 100%
                </span>
              </div>
              {detectedComplexity && (
                <div style={{ marginTop: 12, color: '#ff6600', fontWeight: 600 }}>
                  Tapılan zaman mürəkkəbliyi: {detectedComplexity}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
