"use client";
import React, { useState } from "react";
import { exercises } from "../exercisesData";
import JsTryEditor from "@/app/components/tryeditor/JsTryEditor";
import Header from "../../components/header/Header";
import Sidebar from "../../components/sidebar/Sidebar";
import styles from "../ExercisesList.module.css";
import detailStyles from "./ExerciseDetail.module.css";

const LEFT_TABS = ['Təsvir', 'Redaktə', 'Həllər', 'Təqdimatlar'];

interface ExerciseDetailPageProps {
  params: { id: string };
}

export default function ExerciseDetailPage({ params }: ExerciseDetailPageProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [leftTab, setLeftTab] = useState(0);
  const [customInput, setCustomInput] = useState("");
  const [output, setOutput] = useState("");
  const [testResults, setTestResults] = useState<any[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [feedbackType, setFeedbackType] = useState<"success" | "error" | null>(null);
  const [activeCase, setActiveCase] = useState(0);
  const [userCode, setUserCode] = useState('function sum(a, b) {\n  return a + b;\n}');

  const exercise = exercises.find((ex) => ex.id === params.id);
  if (!exercise) return <div>Tapşırıq tapılmadı.</div>;

  const toggleSidebar = () => setIsSidebarOpen((v) => !v);

  // Mock run/submit logic
  const runCode = () => {
    setOutput(customInput ? `Çıxış: ${customInput}` : "Çıxış yoxdur");
  };
  const submitCode = () => {
    let results: any[] = [];
    let failed: any = null;
    try {
      // Extract the function body from userCode
      const bodyMatch = userCode.match(/{([\s\S]*)}/);
      if (!bodyMatch) {
        setFeedback('Funksiya gövdəsi tapılmadı!');
        setFeedbackType('error');
        setTestResults([]);
        setSubmitted(true);
        return;
      }
      const userBody = bodyMatch[1];
      // Create a new function with known parameter names (a, b, ...)
      // You can adjust the destructuring for different problems
      const userFunc = new Function('...args', `const [a, b] = args; ${userBody}`);
      results = exercise.testCases.map((tc, i) => {
        const args = tc.input.split(' ').map(Number);
        let userOutput;
        try {
          userOutput = userFunc(...args);
        } catch (e) {
          userOutput = 'Xəta';
        }
        const passed = String(userOutput) === tc.expectedOutput;
        if (!passed && !failed) failed = { input: tc.input };
        return {
          input: tc.input,
          expected: tc.expectedOutput,
          output: String(userOutput),
          status: passed ? 'Passed' : 'Failed',
          time: '0.01s',
          memory: '1.2MB',
          hidden: tc.hidden,
        };
      });
    } catch (e) {
      setFeedback('Kodda xəta var!');
      setFeedbackType('error');
      setTestResults([]);
      setSubmitted(true);
      return;
    }
    setTestResults(results);
    setSubmitted(true);
    if (failed) {
      setFeedback(`Test keçmədi: input = ${failed.input}`);
      setFeedbackType('error');
    } else {
      setFeedback('Bütün testlər uğurla keçdi!');
      setFeedbackType('success');
    }
  };

  // Test case panel logic
  const visibleCases = exercise.testCases.filter((tc) => !tc.hidden);

  return (
    <>
      <Header isSidebarOpen={isSidebarOpen} onToggleSidebar={toggleSidebar} />
      <div className={styles.layout}>
        <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
        <div className={isSidebarOpen ? styles.contentOpen : styles.contentClosed}>
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
                  <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 8 }}>{exercise.title}</h1>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 8 }}>
                    <span className={
                      detailStyles.difficulty +
                      " " +
                      (exercise.difficulty === "Asan"
                        ? detailStyles.easy
                        : exercise.difficulty === "Orta"
                        ? detailStyles.medium
                        : detailStyles.hard)
                    }>
                      {exercise.difficulty}
                    </span>
                    {exercise.tags.map((tag) => (
                      <span key={tag} className={detailStyles.tag}>{tag}</span>
                    ))}
                  </div>
                  <div style={{ color: '#f3f3f3', marginBottom: 18 }}>{exercise.description}</div>
                  <div style={{ marginBottom: 12 }}>
                    <b>Məhdudiyyətlər:</b>
                    <ul style={{ margin: 0, paddingLeft: 18 }}>
                      {exercise.constraints.map((c, i) => <li key={i}>{c}</li>)}
                    </ul>
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <b>Nümunələr:</b>
                    <ul style={{ margin: 0, paddingLeft: 18 }}>
                      {exercise.examples.map((ex, i) => (
                        <li key={i}>
                          <span style={{ color: '#6c3fc5' }}>Input:</span> {ex.input} <span style={{ color: '#ff8800', marginLeft: 8 }}>Output:</span> {ex.output}
                          {ex.explanation && <span style={{ color: '#888', marginLeft: 8 }}>({ex.explanation})</span>}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
              {leftTab !== 0 && (
                <div style={{ color: '#aaa', fontStyle: 'italic', marginTop: 32 }}>
                  Bu bölmə hələ aktiv deyil.
                </div>
              )}
            </div>

            {/* Right Panel: Code Editor, Test Cases, Output */}
            <div className={detailStyles.rightPanel}>
              <div className={detailStyles.codeHeader}>
                <div className={detailStyles.codeHeaderRow}>
                  <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>Kod</span>
                  <button onClick={submitCode} className={detailStyles.submitButton}>Submit</button>
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
                <div style={{ marginBottom: 8, color: '#bdbdbd' }}>
                  <b>Input:</b> {visibleCases[activeCase]?.input}
                </div>
                <div style={{ marginBottom: 8, color: '#bdbdbd' }}>
                  <b>Gözlənilən çıxış:</b> {visibleCases[activeCase]?.expectedOutput}
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                  <input
                    value={customInput}
                    onChange={e => setCustomInput(e.target.value)}
                    placeholder="Custom input (məsələn: 2 3)"
                    className={detailStyles.inputBox}
                  />
                  <button onClick={runCode} className={detailStyles.runButton}>Run</button>
                </div>
                {output && (
                  <div className={detailStyles.outputBox}>Nəticə: {output}</div>
                )}
              </div>
              {/* Test Case Results */}
              {submitted && (
                <div style={{ marginBottom: 24 }}>
                  {feedback && (
                    <div className={
                      detailStyles.feedback +
                      " " +
                      (feedbackType === "success"
                        ? detailStyles.success
                        : feedbackType === "error"
                        ? detailStyles.error
                        : "")
                    }>{feedback}</div>
                  )}
                  <div className={detailStyles.testResultsHeader}>Test nəticələri:</div>
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
                        <b>{r.status === 'Passed' ? '✅ Keçdi' : '❌ Uğursuz'}</b> | <b>Input:</b> {r.hidden ? '[Gizli test]' : r.input} | <b>Sənin çıxışın:</b> {r.output} | <b>Gözlənilən çıxış:</b> {r.expected} | <b>Zaman:</b> {r.time} | <b>Yaddaş:</b> {r.memory}
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
                    {exercise.hints.map((h, i) => <li key={i}>{h}</li>)}
                  </ul>
                </div>
              )}
              {/* Post-solve UI */}
              {submitted && (
                <div className={detailStyles.postSolveBox}>
                  <div style={{ fontWeight: 700, marginBottom: 8 }}>Həll və Analiz</div>
                  <div style={{ marginBottom: 8 }}><b>Həll:</b>
                    <pre style={{ background: '#232136', color: '#fff', borderRadius: 6, padding: 12, fontSize: 15, marginTop: 6 }}>{exercise.solution}</pre>
                  </div>
                  <div style={{ marginBottom: 8 }}><b>Zaman mürəkkəbliyi:</b> {exercise.timeComplexity}</div>
                  <div style={{ marginBottom: 8 }}><b>Yaddaş mürəkkəbliyi:</b> {exercise.spaceComplexity}</div>
                  <button onClick={() => window.location.href = '/exercises'} className={detailStyles.submitButton} style={{ marginTop: 8 }}>Başqa tapşırıq</button>
                </div>
              )}
              {/* Star/Save, Daily Challenge, Stats (mocked) */}
              <div className={detailStyles.saveRow}>
                <button className={detailStyles.saveButton}>⭐ Yadda saxla</button>
                <span className={detailStyles.dailyTag}>Günün tapşırığı</span>
                <span className={detailStyles.stats}>Cəhd sayı: 2 | Uğur faizi: 100%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
