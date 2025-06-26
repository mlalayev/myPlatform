"use client";
import React, { useState } from "react";
import { use } from "react";
import { exercises } from "../exercisesData";
import JsTryEditor from "@/app/components/tryeditor/JsTryEditor";
import Header from "../../components/header/Header";
import styles from "../ExercisesList.module.css";
import detailStyles from "./ExerciseDetail.module.css";
import workerCode from "./sandboxWorkerString";
import SavadliButton from "@/app/components/Buttons/savadliButton/SavadliButton";

const LEFT_TABS = ["Təsvir", "Redaktə", "Həllər", "Təqdimatlar"];

interface ExerciseDetailPageProps {
  params: Promise<{ id: string }>;
}

function createSandboxWorker() {
  const blob = new Blob([workerCode], { type: "application/javascript" });
  return new Worker(URL.createObjectURL(blob));
}

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
  const [feedbackType, setFeedbackType] = useState<"success" | "error" | null>(
    null
  );
  const [activeCase, setActiveCase] = useState(0);
  const [userCode, setUserCode] = useState("function solution() {\n\n}");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [detectedComplexity, setDetectedComplexity] = useState<string | null>(
    null
  );

  const exercise = exercises.find((ex) => ex.id === id);
  if (!exercise) return <div>Tapşırıq tapılmadı.</div>;

  // Mock run/submit logic
  const runCode = () => {
    setOutput(customInput ? `Çıxış: ${customInput}` : "Çıxış yoxdur");
  };
  const analyzeTimeComplexity = (code: string) => {
    // Simple static analysis: count nested for-loops
    // This is a naive approach and can be improved with a real parser
    const forMatches = code.match(/for\s*\(/g) || [];
    if (forMatches.length === 0) return "O(1)";
    if (forMatches.length === 1) return "O(n)";
    if (forMatches.length === 2) return "O(n^2)";
    if (forMatches.length === 3) return "O(n^3)";
    return `O(n^${forMatches.length})`;
  };

  function isSafeCode(code: string): boolean {
    // Block dangerous keywords
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
    // Try to parse expected if it's a stringified array/object
    let parsedExpected = expected;

    if (typeof expected === "string") {
      try {
        parsedExpected = JSON.parse(expected);
      } catch {
        // not a JSON string, leave as is
      }
    }

    // Deep equality check for arrays/objects
    if (
      typeof result === "object" &&
      result !== null &&
      typeof parsedExpected === "object" &&
      parsedExpected !== null
    ) {
      return JSON.stringify(result) === JSON.stringify(parsedExpected);
    }

    // Loose equality for primitives
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

    // Final fallback to string comparison
    return String(result).trim() === String(parsedExpected).trim();
  }

  const submitCode = async () => {
    setIsSubmitting(true);
    setDetectedComplexity(null);
    let passedCount = 0;
    let failedCase = null;
    if (!isSafeCode(userCode)) {
      setFeedback("Kod təhlükəli əmrlər ehtiva edir!");
      setFeedbackType("error");
      setTestResults([]);
      setSubmitted(true);
      setIsSubmitting(false);
      return;
    }
    // Extract the function body for complexity analysis
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
        // Run in sandbox worker
        const worker = createSandboxWorker();
        const resultPromise = new Promise<{ result?: any; error?: string }>(
          (resolve) => {
            worker.onmessage = (e: MessageEvent) => resolve(e.data);
            worker.postMessage({ code: userCode, args });
          }
        );
        // Timeout after 2s
        const timeoutPromise = new Promise<{ error: string }>((resolve) =>
          setTimeout(() => {
            worker.terminate();
            resolve({ error: "Kodun icrası çox uzun çəkdi (timeout)!" });
          }, 2000)
        );
        const response: { result?: any; error?: string } = await Promise.race([
          resultPromise,
          timeoutPromise,
        ]);
        const { result, error } = response;
        if (error) {
          setFeedback(error);
          setFeedbackType("error");
          setTestResults([]);
          setSubmitted(true);
          setIsSubmitting(false);
          setDetectedComplexity(null);
          return;
        }
        const passed = isEqual(result, tc.expectedOutput);

        if (!passed) {
          failedCase = {
            input: tc.input,
            expected: tc.expectedOutput,
            output: String(result),
            index: i + 1,
          };
          break;
        }
        passedCount++;
      }
    } catch (e) {
      setFeedback(`Kodda xəta var! ${String(e)}`);
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
      <Header />
      <div className={detailStyles.leetcodeContainer}>
        {/* Left: Problem Description */}
        <div className={detailStyles.leetcodeLeft}>
          <div className={detailStyles.leetcodeTitleRow}>
            <span className={detailStyles.leetcodeTitle}>{exercise.title}</span>
            <span
              className={
                detailStyles.leetcodeDifficulty +
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
              <span key={tag} className={detailStyles.leetcodeTag}>
                {tag}
              </span>
            ))}
          </div>
          <div className={detailStyles.leetcodeDescription}>
            {exercise.description}
          </div>
          <div className={detailStyles.leetcodeNotes}>
            <b>Qeyd:</b>
            <ul>
              <li>Altardiz sıfırlar ola bilər.</li>
              <li>Boş string 0-a bərabər sayılır.</li>
              <li>
                <b>Altardiz</b> - ardıcıllığı pozmadan bəzi simvolları silməklə
                əldə olunan string.
              </li>
            </ul>
          </div>
          <div className={detailStyles.leetcodeExamples}>
            <b>Nümunə:</b>
            {exercise.examples.map((ex, i) => (
              <div key={i} className={detailStyles.leetcodeExampleBlock}>
                <div>
                  <b>Input:</b> {ex.input}
                </div>
                <div>
                  <b>Output:</b> {ex.output}
                </div>
                {ex.explanation && (
                  <div>
                    <b>Explanation:</b> {ex.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        {/* Right: Code Editor, Submit, Testcase */}
        <div className={detailStyles.leetcodeRight}>
          <div className={detailStyles.leetcodeSubmitRow}></div>
          <div className={detailStyles.leetcodeEditorBlock}>
            <JsTryEditor value={userCode} onChange={setUserCode} />

            <SavadliButton
              text={isSubmitting ? "Yoxlanır..." : "Submit"}
              position="absolute"
              right={"1%"}
              bottom={"6%"}
              onClick={submitCode}
              disabled={isSubmitting}
            />
          </div>
          <div className={detailStyles.leetcodeTestcaseBlock}>
            <div className={detailStyles.leetcodeTestcaseTabs}>
              {visibleCases.map((tc, i) => (
                <button
                  key={i}
                  onClick={() => setActiveCase(i)}
                  className={
                    detailStyles.leetcodeTestcaseTab +
                    (activeCase === i ? " " + detailStyles.active : "")
                  }
                >
                  Case {i + 1}
                </button>
              ))}
            </div>
            <div className={detailStyles.leetcodeTestcaseInputRow}>
              <div>
                <b>Input:</b> {visibleCases[activeCase]?.input}
              </div>
              <div>
                <b>Gözlənilən çıxış:</b>{" "}
                {visibleCases[activeCase]?.expectedOutput}
              </div>
            </div>
            <div className={detailStyles.leetcodeTestcaseCustomRow}>
              <input
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="Custom input (məsələn: 2 3)"
                className={detailStyles.leetcodeInputBox}
              />
              <button
                onClick={runCode}
                className={detailStyles.leetcodeRunButton}
              >
                Run
              </button>
            </div>
            {output && (
              <div className={detailStyles.leetcodeOutputBox}>
                Nəticə: {output}
              </div>
            )}
            {submitted && (
              <div className={detailStyles.leetcodeTestResultsBox}>
                {testResults.map((r, i) => (
                  <div
                    key={i}
                    className={
                      detailStyles.leetcodeTestResultRow +
                      (r.status === "Passed"
                        ? " " + detailStyles.passed
                        : " " + detailStyles.failed)
                    }
                  >
                    <b>{r.status === "Passed" ? "✅ Keçdi" : "❌ Uğursuz"}</b> |{" "}
                    <b>Input:</b> {r.hidden ? "[Gizli test]" : r.input} |{" "}
                    <b>Sənin çıxışın:</b> {r.output} | <b>Gözlənilən çıxış:</b>{" "}
                    {r.expected} | <b>Zaman:</b> {r.time} | <b>Yaddaş:</b>{" "}
                    {r.memory}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
