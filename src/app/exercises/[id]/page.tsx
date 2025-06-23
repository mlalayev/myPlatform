"use client";
import React, { useState } from "react";
import { exercises } from "../exercisesData";
import JsTryEditor from "@/app/components/tryeditor/JsTryEditor";
import Header from "../../components/header/Header";
import Sidebar from "../../components/sidebar/Sidebar";
import styles from "../ExercisesList.module.css";

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

  const exercise = exercises.find((ex) => ex.id === params.id);
  if (!exercise) return <div>Tapşırıq tapılmadı.</div>;

  const toggleSidebar = () => setIsSidebarOpen((v) => !v);

  // Mock run/submit logic
  const runCode = () => {
    setOutput(customInput ? `Çıxış: ${customInput}` : "Çıxış yoxdur");
  };
  const submitCode = () => {
    const results = exercise.testCases.map((tc, i) => ({
      input: tc.input,
      expected: tc.expectedOutput,
      output: i === 2 ? "səhv" : tc.expectedOutput, // fail one hidden case
      status: i === 2 ? "Failed" : "Passed",
      time: "0.01s",
      memory: "1.2MB",
      hidden: tc.hidden,
    }));
    setTestResults(results);
    setSubmitted(true);
    const failed = results.find((r) => r.status === "Failed");
    if (failed) {
      setFeedback(`Test keçmədi: input = ${failed.input}`);
      setFeedbackType("error");
    } else {
      setFeedback("Bütün testlər uğurla keçdi!");
      setFeedbackType("success");
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
          <div style={{ display: 'flex', gap: 24, minHeight: '80vh', margin: '0 auto', maxWidth: 1400 }}>
            {/* Left Panel: Problem Details with Tabs */}
            <div style={{ flex: 1.2, background: '#23232a', borderRadius: 12, padding: 24, color: '#f3f3f3', minWidth: 0, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'flex', gap: 18, marginBottom: 18 }}>
                {LEFT_TABS.map((tab, i) => (
                  <button
                    key={tab}
                    onClick={() => setLeftTab(i)}
                    style={{
                      background: leftTab === i ? '#fff' : 'transparent',
                      color: leftTab === i ? '#23232a' : '#f3f3f3',
                      border: 'none',
                      borderBottom: leftTab === i ? '2px solid #6c3fc5' : '2px solid transparent',
                      fontWeight: 700,
                      fontSize: '1.08rem',
                      padding: '8px 0',
                      cursor: 'pointer',
                      borderRadius: 0,
                    }}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              {leftTab === 0 && (
                <div style={{ overflowY: 'auto', maxHeight: '70vh', paddingRight: 8 }}>
                  <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 8 }}>{exercise.title}</h1>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ fontWeight: 600, color: '#fff', background: exercise.difficulty === 'Asan' ? '#4ade80' : exercise.difficulty === 'Orta' ? '#facc15' : '#f87171', borderRadius: 6, padding: '2px 12px' }}>{exercise.difficulty}</span>
                    {exercise.tags.map((tag) => (
                      <span key={tag} style={{ background: '#e0e7ff', color: '#6c3fc5', borderRadius: 6, padding: '2px 10px', fontSize: 13, fontWeight: 600, marginLeft: 4 }}>{tag}</span>
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
            <div style={{ flex: 1.8, background: '#18181b', borderRadius: 12, padding: 24, color: '#f3f3f3', minWidth: 0, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div style={{ marginBottom: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                  <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>Kod</span>
                  <button onClick={submitCode} style={{ background: '#6c3fc5', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 22px', fontWeight: 600, fontSize: '1rem', cursor: 'pointer', marginLeft: 'auto' }}>Submit</button>
                </div>
                <JsTryEditor />
              </div>
              {/* Testcase Panel */}
              <div style={{ background: '#23232a', borderRadius: 8, padding: 16, marginBottom: 0 }}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                  {visibleCases.map((tc, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveCase(i)}
                      style={{
                        background: activeCase === i ? '#6c3fc5' : '#fff',
                        color: activeCase === i ? '#fff' : '#23232a',
                        border: 'none',
                        borderRadius: 6,
                        padding: '4px 16px',
                        fontWeight: 600,
                        fontSize: '1rem',
                        cursor: 'pointer',
                      }}
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
                    style={{ flex: 1, border: '1px solid #ccc', borderRadius: 6, padding: 8 }}
                  />
                  <button onClick={runCode} style={{ background: '#4ade80', color: '#23232a', border: 'none', borderRadius: 8, padding: '8px 22px', fontWeight: 600, fontSize: '1rem', cursor: 'pointer' }}>Run</button>
                </div>
                {output && (
                  <div style={{ marginTop: 12, background: '#f3f3f3', borderRadius: 8, padding: 12, color: '#232136', fontWeight: 600 }}>Nəticə: {output}</div>
                )}
              </div>
              {/* Test Case Results */}
              {submitted && (
                <div style={{ marginBottom: 24 }}>
                  {feedback && (
                    <div style={{
                      background: feedbackType === 'success' ? '#d1fae5' : '#fee2e2',
                      color: feedbackType === 'success' ? '#065f46' : '#991b1b',
                      borderRadius: 8,
                      padding: 12,
                      marginBottom: 16,
                      fontWeight: 600,
                    }}>{feedback}</div>
                  )}
                  <div style={{ marginBottom: 12, fontWeight: 600 }}>Test nəticələri:</div>
                  <div style={{ border: '1px solid #eee', borderRadius: 8, overflow: 'hidden' }}>
                    {testResults.map((r, i) => (
                      <div key={i} style={{ background: r.status === 'Passed' ? '#f0fdf4' : '#fef2f2', color: r.status === 'Passed' ? '#166534' : '#991b1b', padding: 10, borderBottom: '1px solid #eee', fontSize: 15 }}>
                        <b>{r.status === 'Passed' ? '✅ Keçdi' : '❌ Uğursuz'}</b> | <b>Input:</b> {r.hidden ? '[Gizli test]' : r.input} | <b>Sənin çıxışın:</b> {r.output} | <b>Gözlənilən çıxış:</b> {r.expected} | <b>Zaman:</b> {r.time} | <b>Yaddaş:</b> {r.memory}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* Hints */}
              {exercise.hints && exercise.hints.length > 0 && (
                <div style={{ marginBottom: 24, background: '#23232a', borderRadius: 8, padding: 16 }}>
                  <b>İpuçları:</b>
                  <ul style={{ margin: 0, paddingLeft: 18 }}>
                    {exercise.hints.map((h, i) => <li key={i}>{h}</li>)}
                  </ul>
                </div>
              )}
              {/* Post-solve UI */}
              {submitted && (
                <div style={{ marginTop: 32, background: '#f3f3f3', borderRadius: 10, padding: 18, color: '#232136' }}>
                  <div style={{ fontWeight: 700, marginBottom: 8 }}>Həll və Analiz</div>
                  <div style={{ marginBottom: 8 }}><b>Həll:</b>
                    <pre style={{ background: '#232136', color: '#fff', borderRadius: 6, padding: 12, fontSize: 15, marginTop: 6 }}>{exercise.solution}</pre>
                  </div>
                  <div style={{ marginBottom: 8 }}><b>Zaman mürəkkəbliyi:</b> {exercise.timeComplexity}</div>
                  <div style={{ marginBottom: 8 }}><b>Yaddaş mürəkkəbliyi:</b> {exercise.spaceComplexity}</div>
                  <button onClick={() => window.location.href = '/exercises'} style={{ background: '#6c3fc5', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 22px', fontWeight: 600, fontSize: '1rem', cursor: 'pointer', marginTop: 8 }}>Başqa tapşırıq</button>
                </div>
              )}
              {/* Star/Save, Daily Challenge, Stats (mocked) */}
              <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', gap: 18 }}>
                <button style={{ background: '#fff', border: '1px solid #6c3fc5', color: '#6c3fc5', borderRadius: 8, padding: '6px 18px', fontWeight: 600, cursor: 'pointer' }}>⭐ Yadda saxla</button>
                <span style={{ background: '#ffe066', color: '#b45309', borderRadius: 8, padding: '4px 12px', fontWeight: 600 }}>Günün tapşırığı</span>
                <span style={{ color: '#6c3fc5', fontWeight: 600 }}>Cəhd sayı: 2 | Uğur faizi: 100%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
