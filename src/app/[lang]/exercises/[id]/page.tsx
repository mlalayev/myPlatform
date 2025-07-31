"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { use } from "react";
import JsTryEditor from "../../components/tryeditor/JsTryEditor";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
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
} from "react-icons/fi";
import { useI18n } from "@/contexts/I18nContext";
import { useAppContext } from "@/contexts/AppContext";
import { useSession } from "next-auth/react";
import FavoriteButton from "../../../../components/FavoriteButton";
// Remove Babel import since it's causing issues
// import Babel from "@babel/standalone";

interface ExerciseDetailPageProps {
  params: Promise<{ id: string }>;
}

interface Exercise {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  category: string;
  content: {
    acceptance: number;
    constraints: string[];
    examples: { input: string; output: string; explanation?: string }[];
    tags: string[];
    solution: string;
    timeComplexity: string;
    spaceComplexity: string;
    hints?: string[];
    testCases: { input: string; expectedOutput: string; hidden?: boolean }[];
    inputParser?: (input: string) => any;
    functionTemplates?: {
      [key: string]: string;
    };
  };
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

interface FailedCase {
  input: string;
  output: string;
  expected: string;
}

function createSandboxWorker() {
  const blob = new Blob([workerCode], { type: "application/javascript" });
  return new Worker(URL.createObjectURL(blob));
}

// Add languageSamples for default code templates
const languageSamples = {
  javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function solution(nums, target) {
    
}`,
  typescript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function solution(nums: number[], target: number): number[] {
    
}`,
  python: `class Solution(object):
    def solution(self, nums, target):
        """
        :type nums: List[int]
        :type target: int
        :rtype: List[int]
        """
        `,
  cpp: `class Solution {
public:
    vector<int> solution(vector<int>& nums, int target) {
        
    }
};`,
  c: `/**
 * Note: The returned array must be malloced, assume caller calls free().
 */
int* solution(int* nums, int numsSize, int target, int* returnSize) {
    
}`,
  java: `class Solution {
    public int[] solution(int[] nums, int target) {
        
    }
}`,
  csharp: `public class Solution {
    public int[] Solution(int[] nums, int target) {
        
    }
}`,
  php: `/**
 * @param Integer[] $nums
 * @param Integer $target
 * @return Integer[]
 */
function solution($nums, $target) {
    
}`,
};

const languageOptions = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "cpp", label: "C++" },
  { value: "c", label: "C" },
  { value: "java", label: "Java" },
  { value: "csharp", label: "C#" },
  { value: "php", label: "PHP" },
];

// Add this interface for latestSubmission
interface LatestSubmission {
  answers?: { code?: string };
  // Add other fields as needed
}

export default function ExerciseDetailPage({
  params,
}: ExerciseDetailPageProps) {
  const { id } = use(params);
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [customInput, setCustomInput] = useState("");
  const [output, setOutput] = useState("");
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
  const [isComplexityModalOpen, setIsComplexityModalOpen] = useState(false);
  const [latestSubmission, setLatestSubmission] = useState<LatestSubmission | null>(null);
  const [statusIcon, setStatusIcon] = useState<React.ReactNode>(
    <FiXCircle color="gray" title="Not submitted" />
  );
  const codeInitialized = useRef(false);
  const { t } = useI18n();
  const { logActivity } = useAppContext();
  const { data: session } = useSession();

  // Fetch exercise data from API
  useEffect(() => {
    async function fetchExercise() {
      try {
        setLoading(true);
        const response = await fetch(`/api/exercises/${id}`);
        if (!response.ok) {
          throw new Error('Exercise not found');
        }
        const data = await response.json();
        
        // Parse inputParser if it exists as a string
        if (data.content && data.content.inputParser && typeof data.content.inputParser === 'string') {
          try {
            // Use eval to compile the arrow function string directly
            console.log('InputParser string:', data.content.inputParser);
            data.content.inputParser = eval(`(${data.content.inputParser})`);
            console.log('InputParser compiled successfully');
          } catch (error) {
            console.error('Error parsing inputParser:', error);
            // Fallback to default Two Sum parser
            data.content.inputParser = (input: string) => {
              const parts = input.split('|');
              const nums = parts[0].split(' ').map(Number);
              const target = Number(parts[1]);
              return [nums, target];
            };
          }
        }
        
        setExercise(data);
      } catch (error) {
        console.error('Error fetching exercise:', error);
        setError('Exercise not found');
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchExercise();
    }
  }, [id]);

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

  // All hooks must be called before any early return
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
    try {
      const res = await fetch(
        `/api/quiz/${id}/latest?maxTestCases=${exercise.content.testCases.length}`
      );
      if (!res.ok) {
        console.warn('Latest submission API not available');
        return;
      }
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
        setStatusIcon(<FiXCircle color="gray" title="Not submitted" />);
      }
    } catch (error) {
      console.warn('Failed to fetch latest submission:', error);
      // Set default status
      setStatusIcon(<FiXCircle color="gray" title="Not submitted" />);
    }
  }, [exercise, id]);

  // Function to update status icon based on current submission result
  const updateStatusIcon = useCallback((isCorrect: boolean) => {
    // Check if user has ever passed this quiz before
    const hasEverPassed = localStorage.getItem(`quiz_ever_passed_${id}`) === 'true';
    
    if (isCorrect || hasEverPassed) {
      setStatusIcon(<FiCheckCircle color="green" title="Correct" />);
      // Mark as ever passed
      if (id) {
        localStorage.setItem(`quiz_ever_passed_${id}`, 'true');
        localStorage.setItem(`quiz_status_${id}`, 'correct');
      }
    } else {
      setStatusIcon(<FiXCircle color="red" title="Incorrect" />);
      // Save status to localStorage
      if (id) {
        localStorage.setItem(`quiz_status_${id}`, 'incorrect');
      }
    }
  }, [id]);

  // On mount, fetch latest submission
  useEffect(() => {
    if (exercise) {
      refreshLatestSubmission();
    }
  }, [exercise]); // Only run when exercise changes, not after every submission

  // Load status from localStorage on mount
  useEffect(() => {
    if (id) {
      const hasEverPassed = localStorage.getItem(`quiz_ever_passed_${id}`) === 'true';
      const savedStatus = localStorage.getItem(`quiz_status_${id}`);
      
      if (hasEverPassed || savedStatus === 'correct') {
        setStatusIcon(<FiCheckCircle color="green" title="Correct" />);
      } else if (savedStatus === 'incorrect') {
        setStatusIcon(<FiXCircle color="red" title="Incorrect" />);
      }
    }
  }, [id]);

  // Log exercise view activity
  useEffect(() => {
    if (exercise && session?.user) {
        logActivity(
          'EXERCISE_START',
        `Started exercise: ${exercise.title}`,
          {
            exerciseId: id,
            exerciseTitle: exercise.title,
            difficulty: exercise.difficulty,
          category: exercise.category
          }
        );
      }
  }, [exercise, id, session]);

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
    // Only apply JavaScript-specific blacklist for JavaScript/TypeScript
    if (language === "javascript" || language === "typescript") {
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
    
    // For other languages, allow all code (they run in Docker containers)
    return true;
  }

  function isEqual(result: unknown, expected: unknown): boolean {
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
    const failedCasesArr: FailedCase[] = [];
    
    if (!isSafeCode(userCode)) {
      setFeedback("Kod təhlükəli əmrlər ehtiva edir!");
      setFeedbackType("error");
      setFailedCases([]);
      setSubmitted(true);
      setIsSubmitting(false);
      setActiveLeftTab(4);
      updateStatusIcon(false); // Update status icon for error
      return;
    }

    const bodyMatch = userCode.match(/{([\s\S]*)}/);
    if (bodyMatch) setDetectedComplexity(analyzeTimeComplexity(bodyMatch[1]));

    try {
      if (!exercise || !exercise.content.testCases) throw new Error("Exercise or test cases not found");
      for (let i = 0; i < exercise.content.testCases.length; i++) {
        const tc = exercise.content.testCases[i];
        let args;
        if (exercise.content.inputParser) {
          args = exercise.content.inputParser(tc.input);
          console.log(`[DEBUG] Test case ${i}: input="${tc.input}", parsed args=`, args);
        } else {
          // Default parser for Two Sum: last number is target, rest is array
          const numbers = tc.input.split(" ").map(Number);
          const target = numbers.pop(); // Remove and get last number
          const nums = numbers; // Rest is the array
          args = [nums, target];
          console.log(`[DEBUG] Test case ${i}: input="${tc.input}", parsed args=`, args);
        }

        let result, error;
        let functionName = "solution";
        let functionFound = true;

        // Language-specific code execution
        if (language === "python") {
          // Python execution
          const match = userCode.match(/def\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/);
          if (match) functionName = match[1];
          else functionFound = false;
          
          if (!functionFound) {
            setFeedback("Funksiya tapılmadı! Zəhmət olmasa, funksiyanı düzgün şəkildə yazın, məsələn: def myfunc(...):");
            setFeedbackType("error");
            setFailedCases([]);
            setSubmitted(true);
            setIsSubmitting(false);
            setDetectedComplexity(null);
            setActiveLeftTab(4);
            updateStatusIcon(false);
            return;
          }

          let argsStr = Array.isArray(args) 
            ? args.map(a => typeof a === "string" ? `"${a}"` : JSON.stringify(a)).join(", ")
            : JSON.stringify(args);
          
          const callCode = `\nimport json\nresult = ${functionName}(${argsStr})\nif isinstance(result, (list, dict)):\n    print(json.dumps(result))\nelse:\n    print(result)`;
          const fullCode = `${userCode}${callCode}`;
          
          const resp = await fetch("/api/execute", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code: fullCode, language: "python" }),
          });
          const data = await resp.json();
          
          try {
            result = JSON.parse(data.output);
          } catch {
            result = data.output;
          }
          error = data.error;

        } else if (language === "javascript" || language === "typescript" || language === "js" || language === "ts") {
          // JavaScript/TypeScript execution - both use worker for now
          let match = userCode.match(/function\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/);
          if (!match) {
            // Try arrow function pattern
            match = userCode.match(/(?:const|let|var)\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*[:=]\s*(?:\([^)]*\)\s*=>|function\s*\()/);
          }
          if (!match) {
            // Try TypeScript function pattern
            match = userCode.match(/([a-zA-Z_][a-zA-Z0-9_]*)\s*\([^)]*\)\s*:\s*[^{]*{/);
          }
          if (match) functionName = match[1];
          else functionFound = false;
          
          if (!functionFound) {
            setFeedback("Funksiya tapılmadı! Zəhmət olmasa, funksiyanı düzgün şəkildə yazın, məsələn: function myfunc(...) {} və ya const myfunc = (...) => {}");
            setFeedbackType("error");
            setFailedCases([]);
            setSubmitted(true);
            setIsSubmitting(false);
            setDetectedComplexity(null);
            setActiveLeftTab(4);
            updateStatusIcon(false);
            return;
          }

          // Handle TypeScript transpilation like in mainpage editor
          let transpiled = userCode;
          if (language === "typescript" || language === "ts") {
            try {
              // Check for unsupported features
              const unsupported = /(Promise|async\s+function|await\s|private |public |protected )/;
              if (unsupported.test(userCode)) {
                setFeedback("TypeScript-də dəstəklənməyən xüsusiyyətlər istifadə olunub!");
                setFeedbackType("error");
                setFailedCases([]);
                setSubmitted(true);
                setIsSubmitting(false);
                setDetectedComplexity(null);
                setActiveLeftTab(4);
                updateStatusIcon(false);
                return;
              }

              // Security check for dangerous code
              const dangerousPatterns = [
                /require\s*\(/,
                /import\s+.*from\s+['"]/,
                /eval\s*\(/,
                /Function\s*\(/,
                /new\s+Function/,
                /process\./,
                /global\./,
                /window\./,
                /document\./,
                /localStorage\./,
                /sessionStorage\./,
                /indexedDB\./,
                /fetch\s*\(/,
                /XMLHttpRequest/,
                /WebSocket/,
                /Worker/,
                /SharedWorker/,
                /setInterval\s*\(/,
                /setTimeout\s*\(/,
                /while\s*\(\s*true\s*\)/,
                /for\s*\(\s*;\s*;\s*\)/,
                /while\s*\(\s*1\s*\)/,
                /while\s*\(\s*!0\s*\)/,
              ];

              for (const pattern of dangerousPatterns) {
                if (pattern.test(userCode)) {
                  setFeedback("Təhlükəli kod aşkarlanıb! Bu kod icra edilə bilməz.");
                  setFeedbackType("error");
                  setFailedCases([]);
                  setSubmitted(true);
                  setIsSubmitting(false);
                  setDetectedComplexity(null);
                  setActiveLeftTab(4);
                  updateStatusIcon(false);
                  return;
                }
              }

              // Remove TypeScript type annotations and use as JavaScript
              transpiled = userCode
                .replace(/:\s*number\[\]\[\]/g, '')  // Remove number[][] type
                .replace(/:\s*number\[\]/g, '')  // Remove number[] type
                .replace(/:\s*string\[\]/g, '')  // Remove string[] type
                .replace(/:\s*number/g, '')     // Remove number type
                .replace(/:\s*string/g, '')     // Remove string type
                .replace(/:\s*boolean/g, '')    // Remove boolean type
                .replace(/:\s*any/g, '')        // Remove any type
                .replace(/:\s*Record<[^>]*>/g, '')  // Remove Record type
                .replace(/<number,\s*number>/g, '')  // Remove Map type
                .replace(/<number>/g, '')       // Remove generic types
                .replace(/!\s*;/g, ';')         // Remove non-null assertion
                .replace(/!\s*\)/g, ')')        // Remove non-null assertion
                .replace(/!\s*,/g, ',')         // Remove non-null assertion
                .replace(/!\s*]/g, ']')         // Remove non-null assertion
                .replace(/!\s*}/g, '}');        // Remove non-null assertion
            } catch (tsErr: unknown) {
              setFeedback("TypeScript kompilasiya xətası: " + (tsErr instanceof Error ? tsErr.message : String(tsErr)));
              setFeedbackType("error");
              setFailedCases([]);
              setSubmitted(true);
              setIsSubmitting(false);
              setDetectedComplexity(null);
              setActiveLeftTab(4);
              updateStatusIcon(false);
              return;
            }
          } else if (language === "javascript" || language === "js") {
            // Security check for JavaScript code too
            const dangerousPatterns = [
              /require\s*\(/,
              /import\s+.*from\s+['"]/,
              /eval\s*\(/,
              /Function\s*\(/,
              /new\s+Function/,
              /process\./,
              /global\./,
              /window\./,
              /document\./,
              /localStorage\./,
              /sessionStorage\./,
              /indexedDB\./,
              /fetch\s*\(/,
              /XMLHttpRequest/,
              /WebSocket/,
              /Worker/,
              /SharedWorker/,
              /setInterval\s*\(/,
              /setTimeout\s*\(/,
              /while\s*\(\s*true\s*\)/,
              /for\s*\(\s*;\s*;\s*\)/,
              /while\s*\(\s*1\s*\)/,
              /while\s*\(\s*!0\s*\)/,
            ];

            for (const pattern of dangerousPatterns) {
              if (pattern.test(userCode)) {
                setFeedback("Təhlükəli kod aşkarlanıb! Bu kod icra edilə bilməz.");
                setFeedbackType("error");
                setFailedCases([]);
                setSubmitted(true);
                setIsSubmitting(false);
                setDetectedComplexity(null);
                setActiveLeftTab(4);
                updateStatusIcon(false);
                return;
              }
            }
          }

          const worker = createSandboxWorker();
          const resultPromise = new Promise<{ result?: unknown; error?: string }>((resolve) => {
            worker.onmessage = (e: MessageEvent) => resolve(e.data);
            worker.postMessage({ code: transpiled, args });
          });
          const timeoutPromise = new Promise<{ error: string }>((resolve) =>
            setTimeout(() => {
              worker.terminate();
              resolve({ error: "Kodun icrası çox uzun çəkdi (timeout)!" });
            }, 5000) // Increased timeout to 5 seconds
          );
          const response: { result?: unknown; error?: string } = await Promise.race([resultPromise, timeoutPromise]);
          result = response.result;
          error = response.error;

        } else if (language === "cpp") {
          // C++ execution
          const match = userCode.match(/vector<[^>]*>\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/);
          if (match) functionName = match[1];
          else functionFound = false;
          
          if (!functionFound) {
            setFeedback("Funksiya tapılmadı! Zəhmət olmasa, funksiyanı düzgün şəkildə yazın, məsələn: vector<int> solution(...)");
            setFeedbackType("error");
            setFailedCases([]);
            setSubmitted(true);
            setIsSubmitting(false);
            setDetectedComplexity(null);
            setActiveLeftTab(4);
            updateStatusIcon(false);
            return;
          }

          // Convert args to proper C++ format
          let numsArray = "";
          let target = 0;
          
          if (Array.isArray(args) && args.length === 2) {
            const nums = args[0];
            target = args[1];
            if (Array.isArray(nums)) {
              numsArray = `{${nums.join(', ')}}`;
            } else {
              numsArray = JSON.stringify(nums);
            }
          } else {
            numsArray = JSON.stringify(args);
            target = 0;
          }
          
          const callCode = `\nint main() {\n    vector<int> nums = ${numsArray};\n    int target = ${target};\n    auto result = ${functionName}(nums, target);\n    for (int i = 0; i < result.size(); i++) {\n        cout << result[i];\n        if (i < result.size() - 1) cout << " ";\n    }\n    return 0;\n}`;
          const fullCode = `${userCode}\n#include <iostream>\n#include <vector>\nusing namespace std;\n${callCode}`;
          
          const resp = await fetch("/api/execute", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code: fullCode, language: "cpp" }),
          });
          const data = await resp.json();
          
          try {
            result = data.output.trim().split(" ").map(Number);
          } catch {
            result = data.output;
          }
          error = data.error;

        } else if (language === "c") {
          // C execution
          const match = userCode.match(/int\*\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/);
          if (match) functionName = match[1];
          else functionFound = false;
          
          if (!functionFound) {
            setFeedback("Funksiya tapılmadı! Zəhmət olmasa, funksiyanı düzgün şəkildə yazın, məsələn: int* solution(...)");
            setFeedbackType("error");
            setFailedCases([]);
            setSubmitted(true);
            setIsSubmitting(false);
            setDetectedComplexity(null);
            setActiveLeftTab(4);
            updateStatusIcon(false);
            return;
          }

          // Convert args to proper C format
          let numsArray = "";
          let numsSize = 0;
          let target = 0;
          
          if (Array.isArray(args) && args.length === 2) {
            const nums = args[0];
            target = args[1];
            if (Array.isArray(nums)) {
              numsArray = `{${nums.join(', ')}}`;
              numsSize = nums.length;
            } else {
              numsArray = JSON.stringify(nums);
              numsSize = 1;
            }
          } else {
            numsArray = JSON.stringify(args);
            numsSize = 1;
            target = 0;
          }
          
          const callCode = `\nint main() {\n    int returnSize;\n    int nums[] = ${numsArray};\n    int numsSize = ${numsSize};\n    int target = ${target};\n    int* result = ${functionName}(nums, numsSize, target, &returnSize);\n    for (int i = 0; i < returnSize; i++) {\n        printf("%d", result[i]);\n        if (i < returnSize - 1) printf(" ");\n    }\n    return 0;\n}`;
          const fullCode = `${userCode}\n#include <stdio.h>\n#include <stdlib.h>\n${callCode}`;
          
          const resp = await fetch("/api/execute", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code: fullCode, language: "c" }),
          });
          const data = await resp.json();
          
          try {
            result = data.output.trim().split(" ").map(Number);
          } catch {
            result = data.output;
          }
          error = data.error;

        } else if (language === "java") {
          // Java execution
          const match = userCode.match(/public\s+int\[\]\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/);
          if (match) functionName = match[1];
          else functionFound = false;
          
          if (!functionFound) {
            setFeedback("Funksiya tapılmadı! Zəhmət olmasa, funksiyanı düzgün şəkildə yazın, məsələn: public int[] solution(...)");
            setFeedbackType("error");
            setFailedCases([]);
            setSubmitted(true);
            setIsSubmitting(false);
            setDetectedComplexity(null);
            setActiveLeftTab(4);
            updateStatusIcon(false);
            return;
          }

          // Convert args to proper Java format
          let numsArray = "";
          let target = 0;
          
          if (Array.isArray(args) && args.length === 2) {
            const nums = args[0];
            target = args[1];
            if (Array.isArray(nums)) {
              numsArray = `new int[] {${nums.join(', ')}}`;
            } else {
              numsArray = JSON.stringify(nums);
            }
          } else {
            numsArray = JSON.stringify(args);
            target = 0;
          }
          
          // Extract imports from user code
          const importMatch = userCode.match(/import\s+[^;]+;/g);
          const imports = importMatch ? importMatch.join('\n') : '';
          const codeWithoutImports = userCode.replace(/import\s+[^;]+;/g, '').trim();
          
          const callCode = `\n    public static void main(String[] args) {\n        Solution solution = new Solution();\n        int[] result = solution.${functionName}(${numsArray}, ${target});\n        for (int i = 0; i < result.length; i++) {\n            System.out.print(result[i]);\n            if (i < result.length - 1) System.out.print(" ");\n        }\n    }`;
          const fullCode = `${imports}\npublic class Solution {\n${codeWithoutImports}${callCode}\n}`;
          
          const resp = await fetch("/api/execute", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code: fullCode, language: "java" }),
          });
          const data = await resp.json();
          
          try {
            result = data.output.trim().split(" ").map(Number);
          } catch {
            result = data.output;
          }
          error = data.error;

        } else if (language === "csharp") {
          // C# execution
          const match = userCode.match(/public\s+int\[\]\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/);
          if (match) functionName = match[1];
          else functionFound = false;
          
          if (!functionFound) {
            setFeedback("Funksiya tapılmadı! Zəhmət olmasa, funksiyanı düzgün şəkildə yazın, məsələn: public int[] Solution(...)");
            setFeedbackType("error");
            setFailedCases([]);
            setSubmitted(true);
            setIsSubmitting(false);
            setDetectedComplexity(null);
            setActiveLeftTab(4);
            updateStatusIcon(false);
            return;
          }

          // Convert args to proper C# format
          let numsArray = "";
          let target = 0;
          
          if (Array.isArray(args) && args.length === 2) {
            const nums = args[0];
            target = args[1];
            if (Array.isArray(nums)) {
              numsArray = `new int[] {${nums.join(', ')}}`;
            } else {
              numsArray = JSON.stringify(nums);
            }
          } else {
            numsArray = JSON.stringify(args);
            target = 0;
          }
          
          // Extract using statements from user code
          const usingMatch = userCode.match(/using\s+[^;]+;/g);
          const usings = usingMatch ? usingMatch.join('\n') : '';
          const codeWithoutUsings = userCode.replace(/using\s+[^;]+;/g, '').trim();
          
          const callCode = `\n    public static void Main(string[] args) {\n        Solution solution = new Solution();\n        int[] result = solution.${functionName}(${numsArray}, ${target});\n        Console.WriteLine(string.Join(" ", result));\n    }`;
          const fullCode = `${usings}\n\npublic class Solution {\n${codeWithoutUsings}${callCode}\n}`;
          
          const resp = await fetch("/api/execute", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code: fullCode, language: "csharp" }),
          });
          const data = await resp.json();
          
          try {
            result = data.output.trim().split(" ").map(Number);
          } catch {
            result = data.output;
          }
          error = data.error;

        } else if (language === "php") {
          // PHP execution
          const match = userCode.match(/function\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/);
          if (match) functionName = match[1];
          else functionFound = false;
          
          if (!functionFound) {
            setFeedback("Funksiya tapılmadı! Zəhmət olmasa, funksiyanı düzgün şəkildə yazın, məsələn: function solution(...)");
            setFeedbackType("error");
            setFailedCases([]);
            setSubmitted(true);
            setIsSubmitting(false);
            setDetectedComplexity(null);
            setActiveLeftTab(4);
            updateStatusIcon(false);
            return;
          }

          // Convert args to proper PHP format
          let numsArray = "";
          let target = 0;
          
          if (Array.isArray(args) && args.length === 2) {
            const nums = args[0];
            target = args[1];
            if (Array.isArray(nums)) {
              numsArray = `[${nums.join(', ')}]`;
            } else {
              numsArray = JSON.stringify(nums);
            }
          } else {
            numsArray = JSON.stringify(args);
            target = 0;
          }
          
          const callCode = `\n$result = ${functionName}(${numsArray}, ${target});\necho implode(" ", $result);`;
          const fullCode = `<?php\n${userCode}${callCode}\n?>`;
          
          const resp = await fetch("/api/execute", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code: fullCode, language: "php" }),
          });
          const data = await resp.json();
          
          try {
            result = data.output.trim().split(" ").map(Number);
          } catch {
            result = data.output;
          }
          error = data.error;

        } else {
          // Unsupported language
          setFeedback(`Bu dil hələ dəstəklənmir: ${language}`);
          setFeedbackType("error");
          setFailedCases([]);
          setSubmitted(true);
          setIsSubmitting(false);
          setDetectedComplexity(null);
          setActiveLeftTab(4);
          updateStatusIcon(false);
          return;
        }
        if (error) {
          setFeedback(error);
          setFeedbackType("error");
          setFailedCases([]);
          setSubmitted(true);
          setIsSubmitting(false);
          setDetectedComplexity(null);
          setActiveLeftTab(4);
          updateStatusIcon(false); // Update status icon for error
          return;
        }
        console.log(`[DEBUG] Test case ${i}: result=`, result, 'expected=', tc.expectedOutput, 'passed=', isEqual(result, tc.expectedOutput));
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
      setFailedCases([]);
      setSubmitted(true);
      setIsSubmitting(false);
      setDetectedComplexity(null);
      setActiveLeftTab(4);
      updateStatusIcon(false); // Update status icon for error
      return;
    }

    setSubmitted(true);
    setIsSubmitting(false);
    setActiveLeftTab(4);

    // Immediately update status icon based on current result
    const isCorrect = failedCasesArr.length === 0;
    updateStatusIcon(isCorrect);

    // Submit to backend - ALWAYS submit regardless of correctness (optional)
    try {
      const response = await fetch("/api/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quizId: Number(id),
          score: exercise
            ? failedCasesArr.length === 0
              ? exercise.content.testCases.length
              : exercise.content.testCases.length - failedCasesArr.length
            : 0,
          answers: { failedCases: failedCasesArr },
          code: userCode,
          language,
        }),
      });
      
      if (!response.ok) {
        console.warn('Backend submission API not available');
      }
      
      // Save code to localStorage regardless of API success
      if (id) {
        localStorage.setItem(`quiz_code_${id}_${language}`, userCode);
      }
      // Don't refresh latest submission here since we already updated the status icon
      // await refreshLatestSubmission();
    } catch (e) {
      console.warn("Backend submission not available:", e);
      // Save code to localStorage even if API fails
      if (id) {
        localStorage.setItem(`quiz_code_${id}_${language}`, userCode);
      }
    }

    if (failedCasesArr.length > 0) {
      setFailedCases(failedCasesArr);
      setFeedback(
        `${passedCount}/${exercise.content.testCases.length} test keçdi. İlk səhv test: input = ${failedCasesArr[0].input}, gözlənilən = ${failedCasesArr[0].expected}, sənin çıxışın = ${failedCasesArr[0].output}`
      );
      setFeedbackType("wrong");
      setDetectedComplexity(null);
      return;
    }

    // All tests passed
    setFailedCases([]);
    setFeedback(
      exercise
        ? `${exercise.content.testCases.length}/${exercise.content.testCases.length} test uğurla keçdi!`
        : "Bütün testlər uğurla keçdi!"
    );
    setFeedbackType("success");
    
    // Mark exercise as solved in backend
    if (exercise && id) {
      try {
        console.log('Marking exercise as solved:', { exerciseId: parseInt(id), exerciseTitle: exercise.title });
        
        const response = await fetch('/api/user/exercise-solved', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ exerciseId: parseInt(id) })
        });
        
        console.log('Exercise solved API response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Exercise marked as solved:', data);
          
          // Update localStorage to sync with backend
          localStorage.setItem(`quiz_ever_passed_${id}`, 'true');
          localStorage.setItem(`quiz_status_${id}`, 'passed');
          
          // Update status icon
          updateStatusIcon(true);
        } else {
          const errorData = await response.json().catch(() => null);
          console.error('Failed to mark exercise as solved:', response.status, errorData);
        }
      } catch (error) {
        console.warn('Failed to mark exercise as solved:', error);
      }
    }
  };

  const visibleCases = exercise ? exercise.content.testCases.filter((tc) => !tc.hidden) : [];

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
        label: isCorrect ? "Doğru" : "Yalnış",
        result: true,
        icon: isCorrect ? <FiCheckCircle /> : <FiXCircle />,
      });
    }
  }

  const difficultyColor = (diff: string) => {
    switch (diff) {
      case "EASY":
      case "Asan":
        return detailStyles.easy;
      case "MEDIUM":
      case "Orta":
        return detailStyles.medium;
      case "HARD":
      case "Çətin":
        return detailStyles.hard;
      default:
        return "";
    }
  };

  const difficultyIcon = (diff: string) => {
    switch (diff) {
      case "EASY":
      case "Asan":
        return "🟢";
      case "MEDIUM":
      case "Orta":
        return "🟡";
      case "HARD":
      case "Çətin":
        return "🔴";
      default:
        return "⚪";
    }
  };

  const getDifficultyText = (diff: string) => {
    switch (diff) {
      case "EASY":
        return "Asan";
      case "MEDIUM":
        return "Orta";
      case "HARD":
        return "Çətin";
      default:
        return diff;
    }
  };

  useEffect(() => {
    // Always update code when language changes or when exercise loads
    if (exercise?.content?.functionTemplates?.[language]) {
      // Use exercise-specific template
      setUserCode(exercise.content.functionTemplates[language]);
    } else if (languageSamples[language as keyof typeof languageSamples]) {
      // Use default template for this language
      setUserCode(languageSamples[language as keyof typeof languageSamples]);
    }
    // eslint-disable-next-line
  }, [language, exercise]);

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

  // Place the early return here, after all hooks
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!exercise) return <div>Tapşırıq tapılmadı.</div>;

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
              {exercise?.title} {statusIcon}
            </h1>
            <p className={detailStyles.heroDescription}>
              {exercise?.description}
            </p>

            <div className={detailStyles.heroStats}>
              <div className={detailStyles.statItem}>
                <FiUsers className={detailStyles.statIcon} />
                <span>{exercise?.content.acceptance}% Qəbul</span>
              </div>
              <div className={detailStyles.statItem}>
                <FiClock className={detailStyles.statIcon} />
                <span>{exercise?.content.timeComplexity}</span>
              </div>
              <div className={detailStyles.statItem}>
                <FiTarget className={detailStyles.statIcon} />
                <span>{exercise?.content.spaceComplexity}</span>
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
                  {exercise ? difficultyIcon(exercise.difficulty) : ''} {exercise ? getDifficultyText(exercise.difficulty) : ''}
                </span>
              </div>
              <div className={detailStyles.tagsContainer}>
                {exercise?.content.tags.map((tag) => (
                  <span key={tag} className={detailStyles.tag}>
                    <FiCode className={detailStyles.tagIcon} />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <FavoriteButton
              type="EXERCISE"
              itemId={exercise.id}
              title={exercise.title}
              description={exercise.description}
              category={exercise.category}
            />
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
                    {exercise?.description}
                  </p>
                </div>

                <div className={detailStyles.section}>
                  <h3 className={detailStyles.sectionTitle}>Məhdudiyyətlər</h3>
                  <ul className={detailStyles.constraintsList}>
                    {exercise?.content.constraints?.map((constraint, i) => (
                      <li key={i} className={detailStyles.constraintItem}>
                        {constraint}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={detailStyles.section}>
                  <h3 className={detailStyles.sectionTitle}>Nümunələr</h3>
                  {exercise?.content.examples?.map((ex, i) => (
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
                      ? (exercise?.content.testCases.length ?? 0)
                      : (exercise ? exercise.content.testCases.length - failedCases.length : 0)
                  }
                  totalCount={exercise?.content.testCases.length ?? 0}
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
      />

      <Footer />
    </>
  );
}
